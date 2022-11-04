import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, models

DATA_PATH = "/storage/yirans/chestxray/training_data_dir/CovidScanData"

# Define hyperparameters
AUTO = tf.data.AUTOTUNE
BATCH_SIZE = 32
IMAGE_SIZE = 299 #Xception input size
DROPOUT_RATE = 0.3
LOAD_COLOR_MODE = "rgb"
CLASS_NAMES = ["negative", "positive"] # negative -> 0, positive -> 1

# Based on:
# https://www.tensorflow.org/tutorials/load_data/images
def load_dataset():
    """Load training data with specified batch number, image size, and color mode"""
    train_ds = keras.utils.image_dataset_from_directory(
        DATA_PATH,
        class_names=CLASS_NAMES,
        validation_split=0.2,
        color_mode=LOAD_COLOR_MODE,
        subset="training",
        seed=123,
        image_size=[IMAGE_SIZE, IMAGE_SIZE],
        batch_size=BATCH_SIZE
    )
    val_ds = keras.utils.image_dataset_from_directory(
        DATA_PATH,
        class_names=CLASS_NAMES,
        validation_split=0.2,
        color_mode=LOAD_COLOR_MODE,
        subset="validation",
        seed=123,
        image_size=[IMAGE_SIZE, IMAGE_SIZE],
        batch_size=BATCH_SIZE
    )
    return train_ds, val_ds

def data_aug(train_ds, val_ds):

    train_aug = keras.Sequential(
        [
            layers.RandomFlip("horizontal"),
            layers.RandomRotation(factor=0.01),
            layers.RandomZoom(
                height_factor=0.2, width_factor=0.2
            ),
        ]
    )

    # data augmentation
    train_ds = train_ds.map(lambda x, y: (train_aug(x), y), num_parallel_calls=AUTO).prefetch(AUTO)
    #train_ds = train_ds.prefetch(AUTO)
    val_ds = val_ds.prefetch(AUTO)
    return train_ds, val_ds


# reference: https://keras.io/examples/vision/image_classification_efficientnet_fine_tuning/
def make_model(input_shape):
    inputs = keras.Input(shape=input_shape)

    # load pre-trained weights of Xception
    base_model = keras.applications.Xception(
        include_top=False, weights="imagenet", input_shape=[IMAGE_SIZE, IMAGE_SIZE, 3]
    )
    # freeze the weights
    base_model.trinable = False

    x = base_model(inputs)
    # Rebuild top
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.BatchNormalization()(x)

    x = layers.Dropout(DROPOUT_RATE)(x)
    # A Dense classifier with a single unit (Binary Classification)
    outputs = layers.Dense(1, activation="sigmoid")(x)

    return keras.Model(inputs, outputs)


# Based on:
# https://keras.io/examples/vision/image_classification_efficientnet_fine_tuning/
def unfreeze_model(model):
    # unfreeze the top 20 layers while leaving BatchNorm layers frozen
    for layer in model.layers[-20:]:
        if not isinstance(layer, layers.BatchNormalization):
            layer.trainable = True

    model.compile(
        optimizer=keras.optimizers.Adam(1e-4),
        loss="binary_crossentropy",
        metrics=["accuracy"]
    )


def train(train_ds, val_ds):

    # model compile
    model = make_model(input_shape=(IMAGE_SIZE, IMAGE_SIZE) + (3, ))

    checkpoint_filepath = './tmp'
    model_checkpoint_callback = keras.callbacks.ModelCheckpoint(
        filepath=checkpoint_filepath,
        monitor='val_accuracy',
        mode='max',
        save_best_only=True)

    model.compile(
        optimizer=keras.optimizers.Adam(1e-2),
        loss="binary_crossentropy",
        metrics=["accuracy"],
    )
    
    epochs=15
    model.fit(train_ds, epochs=epochs, validation_data=val_ds)

    # TO-DO: add fine-tuning
    unfreeze_model(model)
    epochs=5
    model.fit(train_ds, epochs=epochs, validation_data=val_ds, callbacks=[model_checkpoint_callback], verbose=2)

    print("training done")



if __name__ == "__main__":
    train_ds, val_ds = load_dataset()
    train_ds, val_ds = data_aug(train_ds, val_ds)
    train(train_ds, val_ds)


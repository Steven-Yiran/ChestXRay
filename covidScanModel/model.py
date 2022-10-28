import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, models

DATA_PATH = "/storage/yirans/chestxray/training_data_dir/CovidScanData"

# Define hyperparameters
AUTO = tf.data.AUTOTUNE
BATCH_SIZE = 32
IMAGE_SIZE = 224 #EfficientNetB0 input size
EPOCHS = 5
CLASS_NAMES = ["negative", "positive"] # negative -> 0, positive -> 1

# train test split
train_ds = keras.utils.image_dataset_from_directory(
    DATA_PATH,
    class_names=CLASS_NAMES,
    validation_split=0.2,
    color_mode='rgb',
    subset="training",
    seed=123,
    image_size=[IMAGE_SIZE, IMAGE_SIZE],
    batch_size=BATCH_SIZE
)
val_ds = keras.utils.image_dataset_from_directory(
    DATA_PATH,
    class_names=CLASS_NAMES,
    validation_split=0.2,
    color_mode='rgb',
    subset="validation",
    seed=123,
    image_size=[IMAGE_SIZE, IMAGE_SIZE],
    batch_size=BATCH_SIZE
)

train_aug = keras.Sequential(
    [
        layers.RandomFlip("horizontal"),
        layers.RandomRotation(factor=0.01),
        layers.RandomZoom(
            height_factor=0.2, width_factor=0.2
        ),
    ]
)

train_ds = (
    train_ds
    .map(
        lambda x, y: (train_aug(x), y), num_parallel_calls=AUTO,
    )
    .prefetch(AUTO)

)
val_ds = (
    val_ds
    .prefetch(AUTO)
)   

# reference: https://keras.io/examples/vision/image_classification_efficientnet_fine_tuning/
def make_model(input_shape):
    inputs = keras.Input(shape=input_shape)

    # load pre-trained weights of EfficientNet
    backbone = keras.applications.EfficientNetB0(
        include_top=False, weights="imagenet", input_shape=[IMAGE_SIZE, IMAGE_SIZE, 3]
    )
    
    # freeze the weights
    backbone.trinable = False

    x = backbone(inputs)
    # Rebuild top
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.BatchNormalization()(x)

    x = layers.Dropout(0.2)(x)
    outputs = layers.Dense(1, activation="sigmoid")(x)

    return keras.Model(inputs, outputs)

model = make_model(input_shape=(IMAGE_SIZE, IMAGE_SIZE) + (3, ))

epochs = 5

model.compile(
    optimizer=keras.optimizers.Adam(1e-3),
    loss="binary_crossentropy",
    metrics=["accuracy"],
)
model.fit(
    train_ds, epochs=epochs, validation_data=val_ds,
)
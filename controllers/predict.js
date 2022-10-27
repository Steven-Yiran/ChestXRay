const tf = require('@tensorflow/tfjs-node');
const sharp = require('sharp');

const MODEL_DIR_PATH = "resources/static/demo_savedmodel";

class InferenceController {
    constructor() {
        this.model = null;
    }

    // Based on searchFromFiles in:
    // https://github.com/tensorflow/tfjs-examples/blob/master/electron/image_classifier.js
    runInference = async (req, res) => {
        await this.ensureModelLoaded();
        const imageBuffer = await sharp(req.file.path)
                    .resize(128, 128)
                    .grayscale()
                    .toColourspace('b-w')
                    .toBuffer()
        return tf.tidy(() => {
            // decode buffer to image tenser
            const decodeTensor = tf.node.decodeImage(imageBuffer);
            // convert tensortype to float and append additional dimension
            const imageTensor = tf.cast(decodeTensor, 'float32').expandDims(0);
            // predict with model
            const probs = this.model.predict(imageTensor);
            // return result
            res.status(200).json({
                class : 1,
                prob : probs.arraySync()[0][0],
            });
        })
    }

    // Based on ensureModelLoaded in:
    // https://github.com/tensorflow/tfjs-examples/blob/master/electron/image_classifier.js
    ensureModelLoaded = async () => {
        if (this.model == null) {
            console.log('Loading image classifier model...');
        }

        console.time('Model loading');
        this.model = await tf.node.loadSavedModel(MODEL_DIR_PATH);
        console.timeEnd('Model loading');
    }
}

const inferenceController = new InferenceController();

module.exports = {
    inferenceController,
};
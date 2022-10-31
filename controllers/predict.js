const tf = require('@tensorflow/tfjs-node');
const sharp = require('sharp');
const fs = require('fs');

const MODEL_DIR_PATH = "resources/static/demo_savedmodel";
const IMAGE_SIZE = 128;

class InferenceController {
    constructor() {
        this.model = null;
    }

    // Based on searchFromFiles in:
    // https://github.com/tensorflow/tfjs-examples/blob/master/electron/image_classifier.js
    runInference = async (req, res) => {
        console.time("running inference");
        await this.ensureModelLoaded();
        
        const imagePath = req.file.path;
        const imageBuffer = await sharp(imagePath)
                    .resize(IMAGE_SIZE, IMAGE_SIZE)
                    .grayscale()
                    .toColourspace('b-w')
                    .toBuffer()
        // remove uploaded file
        fs.unlink(imagePath, (error) => {
            if (error) console.log(error);
        });
        return tf.tidy(() => {
            // decode buffer to image tenser
            const decodeTensor = tf.node.decodeImage(imageBuffer);
            // convert tensortype to float and append additional dimension
            const imageTensor = tf.cast(decodeTensor, 'float32').expandDims(0);
            // predict with model
            const probs = this.model.predict(imageTensor);
            // use integer instead of floats
            const probsVal = Math.round(probs.arraySync()[0][0] * 100);
            const classVal = probsVal > 50 ? 1 : 0;
            // return result
            res.status(200).json({
                class : classVal,
                prob : probs.arraySync()[0][0],
            });
            console.timeEnd("running inference");
        })
    }

    // Based on ensureModelLoaded in:
    // https://github.com/tensorflow/tfjs-examples/blob/master/electron/image_classifier.js
    ensureModelLoaded = async () => {
        if (this.model == null) {
            console.log('Loading image classifier model...');
            console.time('Model loaded');
            this.model = await tf.node.loadSavedModel(MODEL_DIR_PATH);
            console.timeEnd('Model loaded');
        }
    }
}

const inferenceController = new InferenceController();

module.exports = {
    inferenceController,
};
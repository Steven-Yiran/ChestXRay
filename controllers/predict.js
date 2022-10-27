const tf = require('@tensorflow/tfjs-node');
const jimp = require('jimp');
const sharp = require('sharp');
const fs = require('fs')
const {classify} = require('./xray_classifier');
const { isNullOrUndefined } = require('util');


async function prepareImage(imagePath) {
    try {
        await sharp(imagePath).resize({
            width: 128,
            height: 128
        })
        .grayscale()
        .toBuffer()
        .then(function(imageBuffer) {
            return imageBuffer;
        });
    } catch (error) {
        console.error(error);
    }
}

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

//const xrayClassifier = new XRayClassifier();
const inferenceController = new InferenceController();

const runInference = async (req, res) => {
    try {
        if (req.file == undefined) {
            return res.send("You must select an image for inference");
        }
        let imageTensor;
        // Read the content of the xray image as tensors with dimensions
        // that match the requirement of the image classifier   
        await sharp(req.file.path)
            .resize(128, 128)
            .grayscale()
            .toColourspace('b-w')
            .toBuffer()
            .then((outputBuffer) => {
                const decodeTensor = tf.node.decodeImage(outputBuffer);
                const imageTensor = tf.cast(decodeTensor, 'float32').expandDims(0);
            });

        const classProbs = await classify(imageTensor);
        res.send(`Probability of COVID-19: ${classProbs}`);
        // Tensorflow.js memory cleanup
    } catch (error) {
        console.log(`Error when trying to run predict on images: ${error}`)
    }
}

module.exports = {
    inferenceController,
};
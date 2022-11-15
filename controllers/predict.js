const tf = require('@tensorflow/tfjs-node');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const {Storage} = require('@google-cloud/storage')

const MODEL_DIR_PATH = "resources/static/Xception";
const IMAGE_SIZE = 299; //128
// const MODEL_DIR_PATH = "resources/static/demo_savedmodel";
// const IMAGE_SIZE = 128;

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
                    //.grayscale()
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
            try {
                const probs = this.model.predict(imageTensor);
                // use integer instead of floats
                const probsVal = Math.round(probs.arraySync()[0][0] * 100);
                const classVal = probsVal > 50 ? 1 : 0;
                // return result as json
                res.status(200).json({
                    class : classVal,
                    prob : probs.arraySync()[0][0],
                    success : true,
                });
                console.timeEnd("running inference");
            } catch (error) {
                console.error(error);
                res.status(404).send("Model inference error");
            }
        })
    }

    // Based on ensureModelLoaded in:
    // https://github.com/tensorflow/tfjs-examples/blob/master/electron/image_classifier.js
    ensureModelLoaded = async () => {
        if (this.model == null) {
            if (!fs.existsSync(MODEL_DIR_PATH)) {
                // get model from google cloud
                await this.downloadModel();
                const cwd = path.join(__dirname, "..");
                const archivePath = path.join(cwd, 'resources/Xception.zip');
                await this.extractModelArchive(archivePath)
            }
            try {
                console.log('Loading image classifier model...');
                console.time('Model loaded');
                this.model = await tf.node.loadSavedModel(MODEL_DIR_PATH);
                console.timeEnd('Model loaded');
            } catch (error) {
                console.log(error);
            }
        }
    }


    downloadModel = async () => {
        console.log('Downloading model from cloud storage');
        console.time('Downloading from cloud storage');
        const bucketName = 'chestxray-trained-models';
        const fileName = 'Xception.zip';

        const destFileName = 'resources/Xception.zip';

        const storage = new Storage();

        async function downloadFile() {
            const options = {
                destination: destFileName,
            };

            await storage.bucket(bucketName).file(fileName).download(options);

            console.log(
                `gs://${bucketName}/${fileName} downloaded as ${destFileName}`,
            );
        }

        await downloadFile().catch(console.error);
        console.timeEnd('Downloading from cloud storage');
    }


    extractModelArchive = async (filepath) => {
        try {
            const zip = new AdmZip(filepath);
            const cwd = path.join(__dirname, "..");
            const outputDir = path.join(cwd, 'resources/static');
            zip.extractAllTo(outputDir);

            console.log(`Model extracted to ${outputDir} successfully`);
        } catch (error) {
            console.log(`Something went wrong. ${error}`);
        }
    }
}


const inferenceController = new InferenceController();

module.exports = {
    inferenceController,
};
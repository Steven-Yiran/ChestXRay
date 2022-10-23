const tf = require('@tensorflow/tfjs-node');
const sharp = require('sharp');

const MODEL_DIR_PATH = "resources/static/trained_models/demo_savedmodel";

const uploadImage = async (req, res) => {
    try {
        console.log(req.file);
        if (req.file == undefined) {
            return res.send("You must select an image for inference");
        }
        await runInference(req.file.path);
        return res.send("predict finished")
    } catch (error) {
        console.log(error);
        return res.send(`Error when trying to run predict on images: ${error}`);
    }
}


async function prepareImage(imagePath) {
    try {
        await sharp(imagePath).resize({
            width: 128,
            height: 128
        })
        .grayscale()
        .toFile("resources/static/temp/sharp.png");
        return "resources/static/temp/sharp.png";
    } catch (error) {
        console.error(error);
    }
}

async function runInference(imagePath) {
    // load SavedModel
    // https://stackoverflow.com/questions/53639919/load-tensorflow-js-model-from-local-file-system-in-javascript
    const model = tf.node.loadSavedModel(MODEL_DIR_PATH);
    const path = await prepareImage(req.file.path);
}

module.exports = {
    uploadImage,
};
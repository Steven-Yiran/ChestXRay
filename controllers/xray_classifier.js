const tfnode = require('@tensorflow/tfjs-node');


const MODEL_DIR_PATH = "resources/static/demo_savedmodel";


class XRayClassifier {
    constructor() {
        this.model = null;
    }

    classify = (images) => {
        tfnode.node.loadSavedModel(MODEL_DIR_PATH).then((model) => {
            const probs = model.predict(images);
        })
    }

    // ensureModelLoaded = () => {
    //     if (this.model === null) {
    //         console.log('Loading xray classifier model ...');
    //     }
    //     this.model = tfnode.node.loadSavedModel(MODEL_DIR_PATH)
    // }

    getDims() {
        return [128, 128];
    }
}

module.exports = {
    XRayClassifier,
};

// async function runInference(imagePath) {
//     // load SavedModel
//     // https://stackoverflow.com/questions/53639919/load-tensorflow-js-model-from-local-file-system-in-javascript
//     const model = tf.node.loadSavedModel(MODEL_DIR_PATH);
// }
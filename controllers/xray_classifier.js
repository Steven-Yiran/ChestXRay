const tf = require('@tensorflow/tfjs-node');


const MODEL_DIR_PATH = "resources/static/demo_savedmodel";


classify = async (images) => {
    let probs = 0;
    await tf.node.loadSavedModel(MODEL_DIR_PATH).then((model) => {
        probs = model.predict(images);
        const value = probs.arraySync()[0][0];
        res.send(`Probability of COVID-19: ${value}`);
    })
}

module.exports = {
    classify,
};
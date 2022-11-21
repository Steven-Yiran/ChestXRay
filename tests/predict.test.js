const { test_util } = require("@tensorflow/tfjs-node");
const {inferenceController} = require("../controllers/predict");

test('check model is not null', async () => {
    await inferenceController.ensureModelLoaded();
    expect(inferenceController.model).not.toBeNull();
})



// write an unit test on post api
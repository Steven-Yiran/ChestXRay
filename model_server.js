const redis = require('redis');
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');

const MODEL_DIR_PATH = "resources/static/Xception";
const BATCH_SIZE = 5;


async function ensureRedisConnect() {
    const redisClient = redis.createClient();

    redisClient.on("error", (err) => {
    console.log(`Error : ${err}`);
    });

    redisClient.on("connect", () => {
        console.log('Redis server connected!');
    });

    
    await redisClient.connect();
    return redisClient;
}


async function ensureModelLoaded() {
    try {
        console.log('Loading image classifier model...');
        console.time('Model loaded');
        if (!fs.existsSync(MODEL_DIR_PATH)) {
            console.log('Does not exist model path: ', MODEL_DIR_PATH);
            throw new Error('Null model file');
        }
        model = await tf.node.loadSavedModel(MODEL_DIR_PATH);
        console.timeEnd('Model loaded');
        return model;
    } catch (err) {
        console.log(`Error : ${err}`);
    }
}


function decodeImage(pixelString) {
    const pixelDecoded = pixelString.split(",");
    const decodeImageBuffer = Buffer.from(pixelDecoded);
    // decode buffer to image tenser
    const decodeTensor = tf.node.decodeImage(decodeImageBuffer);
    // convert tensortype to float and append additional dimension
    const imageTensor = tf.cast(decodeTensor, 'float32').expandDims(0);
    return imageTensor;
}


// https://www.sitepoint.com/delay-sleep-pause-wait/
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function classify_process () {
    // load the trained Keras model
    const model = await ensureModelLoaded();
    // connect to redis client
    const redisClient = await ensureRedisConnect();
    console.log('model loaded!');

    // continually pool for new images to classify
    while (true) {
        const queue = await redisClient.lRange("queue:image", 0, BATCH_SIZE);
        // loop over the images and obtain their results
        for (let i = 0; i < queue.length; i++) {
            console.time("inference time");
            const dict = JSON.parse(queue[i])
            const imageTensor = decodeImage(dict.image);

            const probs = model.predict(imageTensor);
            const probsVal = Math.round(probs.arraySync()[0][0] * 100);
            const res = {
                class : probsVal > 50 ? 1 : 0,
                prob : probs.arraySync()[0][0]
            };
            redisClient.set(dict.id, JSON.stringify(res));
            console.timeEnd("inference time");
        }
        // remove the 
        redisClient.lTrim("queue:image", queue.length, -1)
        // sleep for a small amount
        await sleep(1000);
    }
}

// run model server
classify_process();

module.exports = {
    ensureModelLoaded,
    ensureRedisConnect,
};


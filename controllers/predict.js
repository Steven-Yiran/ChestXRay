const tf = require('@tensorflow/tfjs-node');
const sharp = require('sharp');
const redis = require('redis');
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const uuid = require('uuid');
const {Storage} = require('@google-cloud/storage');

const MODEL_DIR_PATH = "resources/static/Xception";
const IMAGE_SIZE = 299; //128
const TIME_SLEEP = 500;
const TIME_LIM = 1000; // time limit

async function encodeImage(imagePath) {
    const imageBuffer = await sharp(imagePath)
    .resize(IMAGE_SIZE, IMAGE_SIZE)
    .toBuffer();
    // remove uploaded file
    fs.unlink(imagePath, (error) => {
        if (error) console.log(error);
    });
    const pixelArray = new Uint8ClampedArray(imageBuffer);
    const pixelEncoded = pixelArray.toString();
    return pixelEncoded;
}


// https://www.sitepoint.com/delay-sleep-pause-wait/
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class InferenceController {
    constructor() {
        this.model = null;
        this.redisClient = null;
    }

    // endpoint /predict
    runInference = async (req, res) => {
        // initialize the data dictionary that will be returned
        let data = {
            success : false,
            class : -1, // null default
            prob : -1 // null default
        };
        let status_code = 408; // Timeout respond
        try {
            // read the image and encode it to a string
            if (req.file == undefined) {
                throw 'Image not attached';
            }
            // encode image for classification
            const pixelEncoded = await encodeImage(req.file.path);
            
            // generate an ID for the classification task then add
            // the ID + image to the queue
            const key = String(uuid.v4())
            const keyImagePair = {
                id : key,
                image : pixelEncoded
            };
            this.redisClient.rPush("queue:image", JSON.stringify(keyImagePair));
            
            // keep looping until model server returns the output predictions
            const start_time = Date.now()
            // while process time within limit
            while (Date.now() - start_time < TIME_LIM) {
                var time_elapse = Date.now() - start_time;
                if (time_elapse > TIME_LIM) {
                    this.redisClient.del(key);
                    break;
                }
                // attempt to grab the prediction
                const output = await this.redisClient.get(key);

                if (output != null) {
                    const res = JSON.parse(output);
                    Object.assign(data, res);
                    this.redisClient.del(key);
                    data["success"] = true;
                    status_code = 200; // success
                    break;
                }
                // client sleep for a small amount
                await sleep(TIME_SLEEP);
            }

            res.status(status_code).json(data);

        } catch (error) {
            console.log(`Error : ${error}`);
            res.status(404).json(data);
        }
    }


    ensureRedisLoaded = async () => {
        try {
            const redisClient = redis.createClient();

            redisClient.on("error", (err) => {
            console.log(`Error : ${err}`);
            });

            redisClient.on("connect", () => {
            console.log('Redis server connected!');
            });

            (async () => {
                await redisClient.connect();
            })();
            this.redisClient = redisClient
        } catch (err) {
            console.log(`Error : ${err}`);
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
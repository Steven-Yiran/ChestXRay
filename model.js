/**
 * Loads the Tensorflow model and preprocesses and predicts images
 */
//import * as tf from '../node_modules/@tensorflow/tfjs'
const {loadGraphModel} = require("@tensorflow/tfjs-converter")

const MODEL_URL = 'model/tfjs_model/model.json';
const model = await loadGraphModel(MODEL_URL);
console.log("success")

// class Model {

//     constructor() {
//         this.loadModel = this.loadModel();
//     }

//     loadModel() {
//         const model = tf.loadLayersModel("model/tfjs_model/model.json").then(model => {
//             this._model = model;
//         });
//         console.log("success");

//     }
// }

// let model = new Model;
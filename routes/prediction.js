// router for predict
const express = require("express");
const {inferenceController} = require("../controllers/predict")
const upload = require("../middleware/upload");

const inferenceRouter = express.Router();

// model prediction endpoint
// Multer adds a body object and a file object to the request body
// File saved in folder specified in upload configs
inferenceRouter.post("/predict", upload.single('image'), inferenceController.runInference);

module.exports = {
    inferenceRouter
}
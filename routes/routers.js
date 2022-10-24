const express = require("express");
const {runInference} = require("../controllers/predict")
const upload = require("../middleware/upload");

const landingRouter = express.Router();
landingRouter.get("/", (req, res) => {
    res.redirect("/menu");
});

landingRouter.get("/main", (req, res) => {
    res.render("main");
});

landingRouter.get("/menu", (req, res) => {
    res.render("menu");
});

landingRouter.get("/account", (req, res) => {
    res.render("account");
});

landingRouter.get("/about", (req, res) => {
    res.render("about");
});

// router for predict
const inferenceRouter = express.Router();

inferenceRouter.post("/predict", upload.single('xray'), runInference)

module.exports = {
    landingRouter,
    inferenceRouter,
};
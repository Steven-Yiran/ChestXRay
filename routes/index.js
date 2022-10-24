const express = require("express");
const router = express.Router();
const predictController = require("../controllers/predict")
const upload = require("../middleware/upload");

router.get("/", (req, res) => {
    res.redirect("/menu");
});

router.get("/main", (req, res) => {
    res.render("main");
});

router.get("/menu", (req, res) => {
    res.render("menu");
});

router.get("/account", (req, res) => {
    res.render("account");
});

router.get("/about", (req, res) => {
    res.render("about");
});

// router for predict 
router.post("/predict", upload.single('xray'), predictController.uploadImage)



module.exports = router;

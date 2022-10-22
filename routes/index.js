const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.redirect("/main");
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




module.exports = router;

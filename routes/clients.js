const express = require("express");


const landingRouter = express.Router();
landingRouter.get("/", (req, res) => {
    res.redirect("/menu");
});

landingRouter.get("/menu", (req, res) => {
    res.render("menu");
});

landingRouter.get("/main", (req, res) => {
    res.render("main", {});
});

landingRouter.get("/account", (req, res) => {
    res.render("account");
});

landingRouter.get("/about", (req, res) => {
    res.render("about");
});

module.exports = {
    landingRouter
};
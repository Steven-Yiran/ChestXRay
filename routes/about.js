const express = require("express");
const router = express.Router();

/* GET users listing. */
router.get("/", (req, res) => {
    res.render("about");
});

module.exports = router;
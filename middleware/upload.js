/**
 * Initializes Multer Storage engine and defines middleware function.
 */
//https://expressjs.com/en/resources/middleware/multer.html
const multer = require("multer");
const UPLOAD_PATH = "resources/static/uploads/";

const uploadImg = multer({ dest: UPLOAD_PATH })
module.exports = uploadImg;
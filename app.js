// Requiring module
var http = require('http'),
    path = require('path'),
    express = require('express'),
    //multer = require("multer"),
    fs = require("fs");
    bodyParser = require('body-parser'),
    mobilenet = require('node_modules/@tensorflow-models/mobilenet');


// create global app project
var app = express();

// normal express configs
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Use ejs as template engine
app.set('view engine', 'ejs');
app.use(express.json());

app.use(require("./routes"));


// const upload = multer({
//   dest: "uploads/"
// })

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Something went wrong!");
}

// app.post('/upload', upload.single("image"), (req, res) => {
//   const tempPath = req.file.path;
//   const targetPath = path.join(__dirname, "./uploads/image.png");

//   fs.rename(tempPath, targetPath, err => {
//     if (err) return handleError(err, res);

//     res
//       .status(200)
//       .contentType("text/plain")
//       .end("File uploaded!");
//   });
// });

// Server setup
app.listen(3000, () => {
  console.log("The server started running on port 3000") 
});
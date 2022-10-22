// Requiring module
var http = require('http'),
    path = require('path'),
    express = require('express'),
    fs = require("fs");
    bodyParser = require('body-parser');

// create global app project
var app = express();

// normal express configs
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Use ejs as template engine
app.set('view engine', 'ejs');
app.use(express.json());

app.use(require("./routes"));

// Server setup
app.listen(3000, () => {
  console.log("The server started running on port 3000") 
});

// app.use(function(req, res) {
//   res.status(404).send({url: req.originalUrl + ' not found'})
// });
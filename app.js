// Requiring module
var express = require('express'),
    bodyParser = require('body-parser'),
    tf = require('@tensorflow/tfjs-node');

// create global app project
var app = express();

// normal express configs
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Use ejs as template engine
app.set('view engine', 'ejs');
app.use(express.json());

app.use(require("./routes"));

// 404 error handeling
app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

// Server setup
app.listen(3000, () => {
  console.log("The server started running on port 3000") 
});


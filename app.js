// Requiring module
const express = require('express'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    path = require('path'),
    {inferenceController} = require("./controllers/predict"),
    {landingRouter, inferenceRouter} = require('./routes/routers');


const port = 8080;
const hostname = 'localhost'
// create global app project
var app = express();

// normal express configs
app.use(bodyParser.urlencoded({ extended: true }));

// expose static resources
app.use(express.static(path.join(__dirname, 'public')));

// Use ejs as template engine
app.set('view engine', 'ejs');
app.use(express.json());

app.use(landingRouter);
app.use(inferenceRouter);

// 404 error handeling
app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

// Server setup
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
  // load inference model for prediction
  inferenceController.ensureModelLoaded();
});


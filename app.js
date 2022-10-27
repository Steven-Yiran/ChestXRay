// Requiring module
var express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    {landingRouter, inferenceRouter} = require('./routes/routers');


const PORT = 8080;
// create global app project
var app = express();

// normal express configs
app.use(bodyParser.urlencoded({ extended: true }));

// expose static resources
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(__dirname + '/views'));


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
app.listen(PORT, () => {
  console.log(`The server started running on port ${PORT}`) 
});


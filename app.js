// Requiring module
const express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    {inferenceController} = require("./controllers/predict"),
    {landingRouter} = require('./routes/clients'),
    {inferenceRouter} = require('./routes/prediction');

// create global app project
const app = express();

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

// load inference model before starting server
const port = process.env.port || 3000;

inferenceController.ensureRedisLoaded()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at port ${port}`);
    });
  });

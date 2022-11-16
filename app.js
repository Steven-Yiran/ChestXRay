// Requiring module
const express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    redis = require('redis'),
    {inferenceController} = require("./controllers/predict"),
    {landingRouter} = require('./routes/clients'),
    {inferenceRouter} = require('./routes/prediction');

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

// redis
const redisClient = redis.createClient();

redisClient.on("error", (err) => {
  console.log(`Error : ${err}`);
});

redisClient.on("connect", () => {
  console.log('Redis server connected!');
});

(async () => {
  await redisClient.connect();
})();

app.set('redisClient', redisClient);

// load inference model before starting server
inferenceController.ensureModelLoaded().then(() => {
  const port = process.env.port || 3000;
  app.listen(port, () => {
    console.log(`Server running at port ${port}`);
  });
});

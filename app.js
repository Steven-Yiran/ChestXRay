// Requiring module
const express = require("express");
const app = express();
const path = require("path")

const indexRouter = require("./routes/index");
const aboutRouter = require("./routes/about");

  
// Set public as static directory
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, '/views'))
  
// Use ejs as template engine
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/about", aboutRouter)
  
// Server setup
app.listen(3000, () => {
  console.log("The server started running on port 3000") 
});

module.exports = app;
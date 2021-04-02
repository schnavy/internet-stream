var createError = require("http-errors");
var express = require("express");
var path = require("path");

const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://david:cameraraw@dw.afb8c.mongodb.net/Internet-stream?retryWrites=true&w=majority";

const monk = require("monk");
const db = monk(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

db.then(() => {
  console.log("Connected correctly to server");
});


var indexRouter = require("./routes/index");

//APP
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
  req.db = db;
  next();
});

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
app.locals.isDownloader = false;


module.exports = app;

console.log("app js is listening");
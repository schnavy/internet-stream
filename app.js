var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fs = require("fs");
var Twit = require("twit");

const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://david:cameraraw@dw.afb8c.mongodb.net/Internet-stream?retryWrites=true&w=majority";

const monk = require("monk");
const db = monk(uri);

db.then(() => {
  console.log("Connected correctly to server");
});

//TWITTER
var client = new Twit({
  consumer_key: "a5HcMnCzVyz2EWaeRQ88DFOi9",
  consumer_secret: "wkUweUgD0mH27JhKbIBxKG2VlexYoQaMhUWbLC1IFaTeNpRsXb",
  access_token: "1915008564-uhQ7jGcSXowRaGCjLDoHAQUcikObvzKwu82OWaR",
  access_token_secret: "kcG0eELOszOxwlHBoZ1UJXsQHyzPBofweZxiQNANENkjI",
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  strictSSL: true, // optional - requires SSL certificates to be valid.
});

let websiteList = fs.readFileSync("websites.json");
let websites = JSON.parse(websiteList);

var indexRouter = require("./routes/index");

let rawdata = fs.readFileSync("data.json");
let data = JSON.parse(rawdata);

//APP
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
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

app.locals.data = data;
app.locals.websites = websites;

// let instantScraping = true;

// if (instantScraping) {
//   startScraping()
// }
// setInterval(startScraping, 18000000);


// function startScraping() {
//   const { exec } = require("child_process");
//   let process = exec("npm run scrape", (error, stdout, stderr) => {
//     if (error) {
//       console.error("exec error:" + error);
//       return;
//     }
//     console.log(`stdout: ${stdout}`);
//     console.error(`stderr: ${stderr}`);
//   });

//   process.stdout.on("data", function (data) {
//     console.log(data);
//   });
// }

module.exports = app;

console.log("app js is listening");


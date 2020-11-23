var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var Twit = require("twit");

var indexRouter = require("./routes/index");

var app = express();

const fs = require("fs");
const puppeteer = require("puppeteer");

// const client = new Twit({
//   consumer_key: "a5HcMnCzVyz2EWaeRQ88DFOi9",
//   consumer_secret: "wkUweUgD0mH27JhKbIBxKG2VlexYoQaMhUWbLC1IFaTeNpRsXb",
//   bearer_token:
//     "AAAAAAAAAAAAAAAAAAAAAOewJgEAAAAAhHerz%2BZHico6%2B6Kp%2B%2BdnCaUjIY8%3DILgzNlAdW11yjH9hhmPjZk7m6SEzS8zko0vesLFcT9hQDTQtAA",
// });

var client = new Twit({
  consumer_key: "a5HcMnCzVyz2EWaeRQ88DFOi9",
  consumer_secret: "wkUweUgD0mH27JhKbIBxKG2VlexYoQaMhUWbLC1IFaTeNpRsXb",
  access_token: "1915008564-uhQ7jGcSXowRaGCjLDoHAQUcikObvzKwu82OWaR",
  access_token_secret: "kcG0eELOszOxwlHBoZ1UJXsQHyzPBofweZxiQNANENkjI",
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  strictSSL: true, // optional - requires SSL certificates to be valid.
});

let rawdata = fs.readFileSync("data.json");
let data = JSON.parse(rawdata);

let websiteList = fs.readFileSync("websites.json");
let websites = JSON.parse(websiteList);
let urls = [];
let trends = [];
let twitterurls = [];
let withImageSelector = [];

websites.forEach((e) => {
  urls.push(e.domain);
  if (e.imageSelector != "") {
    withImageSelector.push(e.domain);
  }
});

//TWITTER

var params = {
  id: "23424829"
};
client.get("trends/place", params, getTwitterData);

function getTwitterData(err, data, response) {
  if (err) {
    console.log(err);
  } else {
    trends = data[0].trends;
    trends = trends.map((x) => x.name);
    console.log(trends);
    
    for (let i = 0; i < 5; i++) {
      client.get("search/tweets", { q: trends[i], count: 100 }, gotTweets);
    setTimeout(() => {
      client.get("search/tweets", { q: trends[i], count: 100 }, gotTweets);
    }, 15000000);
    }
  }
}



function gotTweets(err, tweets, response) {
  console.log(tweets);
  tweets.statuses.forEach((elem) => {
    if (elem.entities.hasOwnProperty("media")) {
      twitterurls.push(elem.entities.media[0].media_url);
    }
  });
  console.log(twitterurls);
  data.imageurls = data.imageurls.concat(twitterurls);
  addToDb(data);
  console.log("added");

}

// SCRAPER
async function scraper() {
  (async () => {
    for (let i = 0; i < withImageSelector.length; i++) {
      let curr = websites[i];
      let url = "http://" + curr.domain;

      const browser = await puppeteer.launch();
      // const browser = await puppeteer.launch({headless:false});
      const page = await browser.newPage();
      await page.goto(url);
      try {
        await page.waitForSelector(curr.imageSelector);
      } catch (e) {
        console.log("DISSSSS" + url + i);
      }
      try {
        const imgsources = await page.evaluate((variableInBROWSER) => {
          return Array.from(
            document.querySelectorAll(variableInBROWSER.imageSelector)
          )
            .map((imgsrc) => imgsrc.src)
            .slice(variableInBROWSER.range[0], variableInBROWSER.range[1]);
        }, curr);
        data.imageurls = data.imageurls.concat(imgsources);
        console.log(imgsources);
        if (imgsources[0] == undefined || imgsources == undefined) {
          console.log("DISSSSS" + url + i);
        }
      } catch (e) {
        console.log("DISSSSS" + url + i);
      }

      await browser.close();
    }
  })().then(() => {
    addToDb(data);
  });
}
scraper();
setInterval(scraper, 18000000);

function addToDb(d) {
  console.log(d.imageurls.length);
  d.imageurls = uniq(d.imageurls);
  console.log(d.imageurls.length);

  let dataToJson = JSON.stringify(d);
  fs.writeFileSync("data.json", dataToJson);
}

function uniq(a) {
  console.log("Doppelte gelöscht");
  return Array.from(new Set(a));
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

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

module.exports = app;
console.log("app js fertig");

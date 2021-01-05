const fs = require("fs");
const puppeteer = require("puppeteer");
var Twit = require("twit");
const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://david:cameraraw@dw.afb8c.mongodb.net/Internet-stream?retryWrites=true&w=majority";

const monk = require("monk");
const db = monk(uri);

db.then(() => {
  console.log("Connected correctly to server");
});

const imageCol = db.get("imagedata");
const textCol = db.get("imagedata");



let rawdata = fs.readFileSync("data.json");
let data = JSON.parse(rawdata);

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
let urls = [];
let trends = [];
let twitterurls = [];
let withImageSelector = [];

let imgsources;

websites.forEach((e) => {
  urls.push(e.domain);
  if (e.imageSelector != "") {
    withImageSelector.push(e.domain);
  }
});

let items = [];
let newItem;

//TWITTER

var params = {
  id: "23424829",
};
// client.get("trends/place", params, getTwitterData);
// client.get("trends/place", params,getKeywordImages);

scraper();

// SCRAPER
async function scraper() {
  (async () => {
    for (let i = 0; i < withImageSelector.length-10; i++) {
      let curr = websites[i];
      let url = "http://" + curr.domain;

      const browser = await puppeteer.launch();
      // const browser = await puppeteer.launch({headless:false});
      const page = await browser.newPage();
      await page.goto(url);
      try {
        await page.waitForSelector(curr.imageSelector);
      } catch (e) {
        console.log("DISSSSS " + url + " " + e);
      }
      try {
        imgsources = await page.evaluate((variableInBROWSER) => {
          return Array.from(
            document.querySelectorAll(variableInBROWSER.imageSelector)
          )
            .map((imgsrc) => imgsrc.src)
            .slice(variableInBROWSER.range[0], variableInBROWSER.range[1]);
        }, curr);

        // ALT
        data.imageurls = data.imageurls.concat(imgsources);

        //NEU
        for (const elem of imgsources) {
          newItem = {
            url: elem,
            timecode: new Date(),
            origin: curr.domain,
            type: "",
          };
          items.push(newItem);
        }

        console.log(
          url + " fertig —— " + imgsources.length + " Bilder hinzugefügt"
        );
      } catch (e) {
        console.log(url + " Fehler: " + e);
      }

      await browser.close();
      // console.log(imgsources);
    }
    console.log("sssssssssss" + items);
  })().then(() => {
    addToJSON(data);
    addToDb(items);
  });
}

function addToJSON(d) {
  d.imageurls = uniq(d.imageurls);
  console.log(d.imageurls.length);

  let dataToJson = JSON.stringify(d);
  fs.writeFileSync("data.json", dataToJson);
}

function addToDb(d) {
    imageCol.insert(d).then(() => db.close());
    console.log(d + "wurde hinzugefügt");

}

function uniq(a) {
  // console.log("Doppelte gelöscht");
  return Array.from(new Set(a));
}

function gotTweets(err, tweets, response) {
  tweets.statuses.forEach((elem) => {
    if (elem.entities.hasOwnProperty("media")) {
      twitterurls.push(elem.entities.media[0].media_url);
    }
  });
  // console.log(twitterurls);
  data.imageurls = data.imageurls.concat(twitterurls);
  addToJSON(data);
}

function getTwitterData(err, data, response) {
  if (err) {
    console.log(err);
  } else {
    trends = data[0].trends;
    trends = trends.map((x) => x.name);

    for (let i = 0; i < 5; i++) {
      client.get("search/tweets", { q: trends[i], count: 20 }, gotTweets);
      setTimeout(() => {
        client.get("search/tweets", { q: trends[i], count: 20 }, gotTweets);
      }, 15000000);
    }
  }
}
function getKeywordImages(err, data, response) {
  if (err) {
    console.log(err);
  } else {
    client.get("search/tweets", { q: "flooding", count: 1000 }, gotTweets);
  }
}

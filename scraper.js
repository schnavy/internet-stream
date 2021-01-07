const fs = require("fs");
const puppeteer = require("puppeteer");
var Twit = require("twit");
var client = new Twit({
  consumer_key: "a5HcMnCzVyz2EWaeRQ88DFOi9",
  consumer_secret: "wkUweUgD0mH27JhKbIBxKG2VlexYoQaMhUWbLC1IFaTeNpRsXb",
  access_token: "1915008564-uhQ7jGcSXowRaGCjLDoHAQUcikObvzKwu82OWaR",
  access_token_secret: "kcG0eELOszOxwlHBoZ1UJXsQHyzPBofweZxiQNANENkjI",
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  strictSSL: true, // optional - requires SSL certificates to be valid.
});

const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://david:cameraraw@dw.afb8c.mongodb.net/Internet-stream?retryWrites=true&w=majority";
const monk = require("monk");
const db = monk(uri);

const imageCol = db.get("imagedata");
const textCol = db.get("imagedata");


let websiteList = fs.readFileSync("websites.json");
let websites = JSON.parse(websiteList);
let urls = [];
let items = [];
let newItem;

let trends = [];
let twitterurls = [];


//TWITTER

var params = {
  id: "23424829",
};
// client.get("trends/place", params, getTwitterData);
// client.get("trends/place", params,getKeywordImages);

(async () => {

  for (let i = 0; i < 2; i++) {
    try {
      await scrapeImages(websites[i]);
    } catch (e) {
      console.log(e);
    }
  }
})().then(()=>{
  addToDb(items);
  process.exit();


})

// for (let i = 0; i < 20; i++) {
//     scrapeImages(websites[i])
//     //.then(addToJSON(items))
// }

// scraper(websites[1]);

// SCRAPER
async function scrapeImages(website) {
  let curr = website;
  let url = "http://" + curr.Domain;
  let selector = "img";

  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1400 });
  await page.goto(url);
  try {
    await page.waitForSelector(selector);
  } catch (e) {
    console.log("DISSSSS " + url + " " + e);
  }
  try {
    scrapedElements = await page.evaluate(() => {
      let elems = Array.from(document.querySelectorAll("img"));

      let newArr = [];

      elems.forEach((x) => {
        if (
          x.clientWidth > 150 &&
          x.clientWidth < 800 &&
          x.clientHeight > 100 &&
          x.clientHeight < 800
        ) {
          newArr.push(x.src);
        }
      });
      newArr.map((imgsrc) => imgsrc.src);
      return newArr;
    });

    // imgsources =  sortForSize(scrapedElemenets);

    for (const elem of scrapedElements) {
      newItem = {
        url: elem,
        timecode: new Date(),
        origin: curr.Domain,
        type: "",
      };
      if (newItem.url != "") {
        items.push(newItem);
      }
    }
  } catch (e) {
    console.log(url + " Fehler: " + e);
  }

  console.log(
    url + " fertig —— " + scrapedElements.length + " Bilder hinzugefügt"
  );
  await browser.close();

  // return items;
  // console.log(imgsources);
  //   console.log(items);
}

function addToJSON(d) {
  d.imageurls = uniq(d.imageurls);
  console.log(d.length + " Neue Elemente in der JSON Datei");

  let dataToJson = JSON.stringify(d);
  fs.writeFileSync("data.json", dataToJson);
}

function addToDb(d) {
  imageCol.insert(d).then(() => db.close());
  console.log(d.length + " Neue Elemente in der Datenbank");
}

function sortForSize(imgArray) {
  let newArr = [];

  imgArray.forEach((x) => {
    if (x.clientWidth > 250 && x.clientWidth < 800) {
      newArr.push(x.src);
    }
  });
  return newArr;
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

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
const textCol = db.get("textdata");

// let imageItems;
// let textItems;

// imageCol.remove();
// textCol.remove();

// let websiteList = fs.readFileSync("websites.json");
// let websites = JSON.parse(websiteList).map((x) => x.Domain);
let websiteList = fs.readFileSync("NewsWebsites.json");
let websites = JSON.parse(websiteList).domains;
let urls = [];
let newItem;
let elemscount = 0;
let noContent = [];
let trends = [];
let twitterurls = [];



/// Main Funktion

(async () => {
  console.log("scraper startet");

  for (const item of websites) {
    try {
      await scrapeImages(item, "img");
      await scrapeText(item, "h3");
      await scrapeText(item, "p");
      console.log(item);
    } catch (e) {
      console.log(e);
    }
  }

  console.log("Fertig — " + elemscount + " Elemente zur Datenbank hinzugefügt");
  console.log(noContent);
  db.close();
})();










//TWITTER

var params = {
  id: "23424829",
};
// client.get("trends/place", params, getTwitterData);
// client.get("trends/place", params,getKeywordImages);



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

















// SCRAPER IMAGES

async function scrapeImages(curr, selector) {
  let imageItems = [];

  let url = "http://" + curr;

  const browser = await puppeteer.launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process", // <- this one doesn't works in Windows
      "--disable-gpu",
    ],
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1400 });
  await page.goto(url);
  try {
    await page.waitForSelector(selector);
  } catch (e) {
    console.log("DISSSSS " + url + " " + e);
    noContent.push(url);
  }
  try {
    scrapedElements = await page.evaluate((selector) => {
      let elems = Array.from(document.querySelectorAll(selector));

      let newArr = [];

      elems.forEach((x) => {
        if (
          x.clientWidth > 200 &&
          x.clientWidth < 1000 &&
          x.clientHeight > 150 &&
          x.clientHeight < 1000
          // x.getBoundingClientRect().top >= 0 &&
          // x.getBoundingClientRect().left >= 0 &&
          // x.getBoundingClientRect().bottom <= 1400 &&
          // x.getBoundingClientRect().right <= 1280
        ) {
          newArr.push(x.src);
        }
      });

      newArr.map((imgsrc) => imgsrc.src);
      return newArr;
    }, selector);

    for (const elem of scrapedElements) {
      newItem = {
        url: elem,
        timecode: new Date(),
        origin: curr,
        type: selector,
      };
      if (newItem.url != "" && newItem.url[4] == "s") {
        imageItems.push(newItem);
      }
    }
  } catch (e) {
    console.log(url + " Fehler: " + e);
  }

  console.log(url + " fertig —— " + imageItems.length + " Bilder hinzugefügt");
  await browser.close();
  await addToDb(imageItems, imageCol);
  await db.close();
}

// SCRAPER TEXT
async function scrapeText(curr, selector) {
  let textItems = [];
  let nurLangeTexte = false;
  if (selector == "p") {
    nurLangeTexte = true;
  }

  let url = "http://" + curr;

  const browser = await puppeteer.launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process", // <- this one doesn't works in Windows
      "--disable-gpu",
    ],
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
    scrapedElements = await page.evaluate((selector) => {
      let newArr = Array.from(document.querySelectorAll(selector))
        .map((x) => x.textContent)
        .slice(0, 10);

      // newArr.map(x => x.textContent);

      return newArr;
    }, selector);

    for (let elem of scrapedElements) {
      elem = "" + elem.replace(/ +(?= )/g, "");
      newItem = {
        text: elem,
        timecode: new Date(),
        origin: curr,
        type: selector,
      };
      if (elem != "" && nurLangeTexte) {
        if (newItem.type == "p") {
          textItems.push(newItem);
        }
      } else {
        if (elem != "") {
          textItems.push(newItem);
        }
      }
    }
  } catch (e) {
    console.log(url + " Fehler: " + e);
  }

  console.log(url + " fertig —— " + textItems.length + " Texte hinzugefügt");
  await browser.close();

  await addToDb(textItems, textCol);
  await db.close();
}

function addToJSON(d) {
  d.imageurls = uniq(d.imageurls);
  console.log(d.length + " Neue Elemente in der JSON Datei");

  let dataToJson = JSON.stringify(d);
  fs.writeFileSync("data.json", dataToJson);
}
function addToDb(d, zielDB) {
  zielDB.insert(d).then(() => db.close());
  elemscount += d.length;
  // console.log(d.length + " -> DB");
}

function uniq(a) {
  // console.log("Doppelte gelöscht");
  return Array.from(new Set(a));
}




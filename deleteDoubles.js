const fs = require("fs");
let keywords = ["fallback", "Fallback", "logo", "Logo", "engageya"];

const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://david:cameraraw@dw.afb8c.mongodb.net/Internet-stream?retryWrites=true&w=majority";
const monk = require("monk");
const db = monk(uri);

const imageCol = db.get("imagedata");
const textCol = db.get("textdata");
const test = db.get("test");

let c;

// let websiteList = fs.readFileSync("NewsWebsites.json");
// let websites = JSON.parse(websiteList).domains;

async function deleteDoubles(collection, queryKey) {
  let logger = 0;
  let Anzahl = await collection.count();

  await console.log("Collection beinhaltet: " + Anzahl + " Beiträge");
  console.log("(" + logger + ") checking...");

  const cursor = await collection.find({}, { [queryKey]: 1 });

  await cursor.forEach(function (doc) {
    collection
      .find(
        { _id: { $gt: doc._id }, [queryKey]: doc[queryKey] },
        (err, res) => {
          if (err) {
            console.log(err);
          }
          // console.log(res.length);
        }
      )
      .then(() => {
        logger++;
        if (logger % 200 == 0) {
          console.log("(" + logger + ") checking...");
        }
      });
    collection.remove({ _id: { $gt: doc._id }, [queryKey]: doc[queryKey] });
  });
  let AnzahlNeu = await collection.count();

  await console.log("Neue Anzahl: " + AnzahlNeu + " — Doppelte: " + (Anzahl - AnzahlNeu));
}


async function deleteKeywords(collection, keys) {
  let Anzahl = await collection.count();

  await keys.forEach((elem) => {
    imageCol.find({ url: { $regex: ".*" + elem + ".*" } }, (err, res) => {
    //   console.log(res.length);
    });

    imageCol.remove({ url: { $regex: ".*" + elem + ".*" } });
  });

  let AnzahlNeu = await collection.count();

  await console.log(
    "Neue Anzahl: " + AnzahlNeu + " — Keywords gelöscht: " + (Anzahl - AnzahlNeu)
  );
}

(async () => {
  await deleteDoubles(imageCol, "url");
  await deleteDoubles(textCol, "text");
  await deleteKeywords(imageCol, keywords);
  await process.exit();
})();

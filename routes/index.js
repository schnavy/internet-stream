var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {

    const imgCol = req.db.get("imagedata");
    const textCol = req.db.get("textdata");


    imgCol.find({}, {
      sort: {
        timecode: -1
      },  
      limit: 1000
    }, (e, imgs) => {
      if (e) return console.log(e);
      textCol.find({}, {
        sort: {
          timecode: -1
        },
        limit: 1000
      }, (e, texts) => {
        if (e) return console.log(e);
        res.render("index", {
          imageData: imgs,
          textData: texts,
          title: "Reiz/Flut",
          isDownloader: false,
          kinect: false,
          mitIntro: true,
          fullscreen: false
        });
      });
    });
});


  router.get("/local", function (req, res) {
    const imageJsonOBj = require("../dump/imagedata-dump.json");
    const textJsonOBj = require("../dump/textdata-dump.json");
    res.render("index", {
      imageData: imageJsonOBj,
      textData: textJsonOBj,
      title: "Reiz/Flut",
      isDownloader: false,
      kinect: false,
      mitIntro: false,
      fullscreen: true
    });
  });



router.get("/download", function (req, res) {
  const imgCol = req.db.get("imagedata");
  const textCol = req.db.get("textdata");

  imgCol.find({}, {
    sort: {
      timecode: -1
    },
    limit: 2000
  }, (e, imgs) => {
    if (e) return console.log(e);
    textCol.find({}, {
      sort: {
        timecode: -1
      },
      limit: 2000
    }, (e, texts) => {
      if (e) return console.log(e);
      res.render("index", {
        imageData: imgs,
        textData: texts,
        title: "Reiz/Flut",
        isDownloader: true,
        kinect: false,
        mitIntro: true,
        fullscreen: true
      });
    });
  });
});



router.get("/intro", function (req, res) {

  res.render("intro", {
    title: "Intropanels",
    isDownloader: false,
    kinect: false,
    mitIntro: false
  });
});



module.exports = router;
var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
  const imgCol = req.db.get("imagedata");
  const textCol = req.db.get("textdata");

  imgCol.find({}, {
    sort: {
      "timecode": -1
    },
    limit: 2000
  }, (e, imgs) => {
    if (e) return next(e);
    textCol.find({}, {
      sort: {
        "timecode": -1
      },
      limit: 2000
    }, (e, texts) => {
      if (e) return next(e);
      res.render("index", {
        imageData: imgs,
        textData: texts,
        title: "Reiz/Flut",
        isDownloader: false
      });
    });
  });
});

router.get("/download", function (req, res) {
  const imgCol = req.db.get("imagedata");
  const textCol = req.db.get("textdata");

  imgCol.find({}, {
    sort: {
      timecode: -1
    },
    limit: 1000
  }, (e, imgs) => {
    if (e) return next(e);
    textCol.find({}, {
      sort: {
        timecode: -1
      },
      limit: 1000
    }, (e, texts) => {
      if (e) return next(e);
      res.render("index", {
        imageData: imgs,
        textData: texts,
        title: "Reiz/Flut",
        isDownloader: true
      });
    });
  });
});

module.exports = router;
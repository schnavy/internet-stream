var express = require("express");
var router = express.Router();

/* GET home page. */
// router.get("/", function (req, res, next) {
//   const collection = req.db.get("imagedata");

//   collection.find({}, {}, function (e, docs) {
//     res.render("index", {
//       imageData: docs,
//       title: "Das Internet",
//     });
//   });
// });

router.get("/", function (req, res) {
  req.app.locals.isDownloader = false;
  const imgCol = req.db.get("imagedata");
  const textCol = req.db.get("textdata");


  imgCol.find({}, function (err, imgCol) {
    if (err) {
      console.log(err);
    } else {
      textCol.find({}, function (err, textCol) {
        if (err) {
          console.log(err);
        } else {
          res.render("index", {
            imageData: imgCol,
            textData: textCol,
            title: "Reiz/Flut",
          });
        }
      });
    }
  });
});

router.get("/download", function (req, res) {
  req.app.locals.isDownloader = true;
  const imgCol = req.db.get("imagedata");
  const textCol = req.db.get("textdata");


  imgCol.find({}, function (err, imgCol) {
    if (err) {
      console.log(err);
    } else {
      textCol.find({}, function (err, textCol) {
        if (err) {
          console.log(err);
        } else {
          res.render("index", {
            imageData: imgCol,
            textData: textCol,
            title: "Reiz/Flut",
          });
        }
      });
    }
  });
});

module.exports = router;
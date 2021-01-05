var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  const collection = req.db.get("imagedata");
  collection
    .find()
    .then((docs) => {
      console.log(docs);
      // docs contains the documents inserted with added **_id** fields
      // Inserted 3 documents into the document collection
    })
    .then(() => req.db.close());

  res.render("index", { title: "Das Internet" });
});

module.exports = router;

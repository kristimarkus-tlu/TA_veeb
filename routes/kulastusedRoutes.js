const express = require("express");
const router = express.Router();

// kontrollerid
const {
    kulastused,
    kulastajad,
    kulastajadAdd,
    kulastajadAddPost,
    kulastajadSaved } = require("../controllers/kulastusedControllers.js");

router.route("/").get(kulastused);

router.route("/kulastajad").get(kulastajad)

router.route("/kulastajad_add").get(kulastajadAdd)

router.route("/kulastajad_add").post(kulastajadAddPost)

router.route("/kulastajad_saved").get(kulastajadSaved)

module.exports = router;
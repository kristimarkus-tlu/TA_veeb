const express = require("express");
const router = express.Router();

// kontrollerid
const {
    eestifilm,
    filmiinimesed,
    inimesedAdd,
    inimesedAddPost,
    position,
    positionAdd,
    positionAddPost } = require("../controllers/eestiFilmControllers.js");

router.route("/").get(eestifilm);

router.route("/filmiinimesed").get(filmiinimesed)

router.route("/filmiinimesed_add").get(inimesedAdd)

router.route("/filmiinimesed_add").post(inimesedAddPost)

router.route("/ametid").get(position)

router.route("/ametid_add").get(positionAdd)

router.route("/ametid_add").post(positionAddPost)

module.exports = router;

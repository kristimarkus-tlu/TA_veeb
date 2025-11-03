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
    positionAddPost,
    movie,
    movieAdd,
    movieAddPost,
    seosed,
    seosedAdd,
    seosedAddPost } = require("../controllers/eestiFilmControllers.js");

router.route("/").get(eestifilm);

router.route("/filmiinimesed").get(filmiinimesed)

router.route("/filmiinimesed_add").get(inimesedAdd)

router.route("/filmiinimesed_add").post(inimesedAddPost)

router.route("/ametid").get(position)

router.route("/ametid_add").get(positionAdd)

router.route("/ametid_add").post(positionAddPost)

router.route("/filmid").get(movie)

router.route("/filmid_add").get(movieAdd)

router.route("/filmid_add").post(movieAddPost)

router.route("/seosed").get(seosed)

router.route("/seosed_add").get(seosedAdd)

router.route("/seosed_add").post(seosedAddPost)

module.exports = router;

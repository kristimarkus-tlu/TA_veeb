const express = require("express");
const multer = require("multer");
const router = express.Router();

//seadistame vahevara fotode üleslaadimiseks kindlasse kataloogi
const uploader = multer({dest: "./public/gallery/orig/"});

// kontrollerid
const {
    galleryPage,
    /* galleryPagePost, */
    photouploadPage,
    photouploadPagePost } = require("../controllers/photouploadControllers.js");

router.route("/").get(galleryPage);

/* router.route("/").post(galleryPagePost); */

router.route("/gallery_add").get(photouploadPage);

router.route("/gallery_add").post(uploader.single("photoInput"), photouploadPagePost);

module.exports = router;

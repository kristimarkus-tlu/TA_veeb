const express = require("express");
const router = express.Router();

const {
    indexPage } = require("../controllers/indexControllers.js");

router.route("/").get(indexPage);

module.exports = router;

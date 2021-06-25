const express = require("express");
const ctrlMain = require("../controllers/main");

const router = express.Router();
router.get("/", ctrlMain.index);


module.exports = router;

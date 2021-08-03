const express = require("express");
const router = express.Router();

const ctrlLocations = require("../controllers/locations");
router.get("/", ctrlLocations.homeList);
router.get("/location/:location_id", ctrlLocations.locationInfo);
router.get("/location/review/new", ctrlLocations.addReview);

const ctrlOthers = require("../controllers/others");
router.get("/about", ctrlOthers.about);


module.exports = router;

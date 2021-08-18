const express = require("express");
const router = express.Router();


// местоположения
const ctrlLocations = require("../controllers/locations");
router.get("/locations", ctrlLocations.locationsListByDistance);
router.post("/locations", ctrlLocations.locationsCreate);
router.get("/locations/:location_id", ctrlLocations.locationsReadOne);
router.put("/locations/:location_id", ctrlLocations.locationsUpdateOne);
router.delete("/locations/:location_id", ctrlLocations.locationsDeleteOne);

// отзывы
const ctrlReviews = require("../controllers/reviews");
router.post("/locations/:location_id/reviews", ctrlReviews.reviewsCreate);
router.get("/locations/:location_id/reviews/:review_id", ctrlReviews.reviewsReadOne);
router.put("/locations/:location_id/reviews/:review_id", ctrlReviews.reviewsUpdateOne);
router.delete("/locations/:location_id/reviews/:review_id", ctrlReviews.reviewsDeleteOne);


module.exports = router;
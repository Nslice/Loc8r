const express = require("express");
const router = express.Router();
const jwt = require("express-jwt");


const auth = jwt({
    algorithms: ["SHA256"],
    secret: process.env.JWT_SECRET,
    useProperty: "payload"
});


// местоположения
const ctrlLocations = require("../controllers/locations");
router.get("/locations", ctrlLocations.locationsListByDistance);
router.post("/locations", ctrlLocations.locationsCreate);
router.get("/locations/:location_id", ctrlLocations.locationsReadOne);
router.put("/locations/:location_id", ctrlLocations.locationsUpdateOne);
router.delete("/locations/:location_id", ctrlLocations.locationsDeleteOne);

// отзывы
const ctrlReviews = require("../controllers/reviews");
router.post("/locations/:location_id/reviews", auth, ctrlReviews.reviewsCreate);
router.get("/locations/:location_id/reviews/:review_id", ctrlReviews.reviewsReadOne);
router.put("/locations/:location_id/reviews/:review_id", auth, ctrlReviews.reviewsUpdateOne);
router.delete("/locations/:location_id/reviews/:review_id", auth, ctrlReviews.reviewsDeleteOne);


// аутентификация
const ctrlAuth = require("../controllers/authentication");
router.post("/register", ctrlAuth.register);
router.post("/login", ctrlAuth.login);


module.exports = router;
const chalk = require("chalk");
const moment = require("moment");
const _ = require("lodash");
const request = require("request");


const port = process.env.PORT || "3000";
const apiOptions = (process.env.NODE_ENV === "production")
    ? {server: process.env.SERVER_URI}
    : {server: `http://localhost:${port}`};


module.exports.homeList = function (cntrlRequest, cntrlResponse) {
    const requestOptions = {
        url: `${apiOptions.server}/api/locations`,
        method: "GET",
        json: {},
        qs: {
            lng: 74.68263823715606, // TODO: хардкод убрать
            lat: 42.884340390920535,
            max: 10500
        }
    };

    request(requestOptions, function (err, apiResponse, locations) {
        if (apiResponse.statusCode === 200 && Array.isArray(locations))
            locations.forEach(x => x.distance = formatDistance(x.distance));
        else
            console.log(`homeList controller, apiResponse.statusCode: ${chalk.red(apiResponse.statusCode)}`);

        renderHomepage(cntrlRequest, cntrlResponse, locations);
    });

    const formatDistance = (dist) => {
        if (!isNaN(dist) && Number.isFinite(dist)) {
            if (dist >= 1000)
                return `${_.round(dist / 1000, 1)} km`;
            else
                return `${_.round(dist, 0)} m`;
        } else
            return "?";
    };
};


const renderHomepage = function (request, response, locations) {
    let message;
    if (!Array.isArray(locations)) {
        message = "API lookup error";
        locations = [];
    } else if (!locations.length)
        message = "No places found nearby";

    response.render("locations-list", {
        title: "Loc8r - find a place to work with wifi",
        pageHeader: {
            title: "Loc8r",
            strapLine: "Find places to work with wifi near you"
        },
        sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about." +
            "Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.",
        locations: locations,
        message: message
    });
};


module.exports.locationInfo = function (cntrlRequest, cntrlResponse) {
    getLocationInfo(cntrlRequest, cntrlResponse, renderDetailPage);
};


const getLocationInfo = function (cntrlRequest, cntrlResponse, callback) {
    const requestOptions = {
        url: `${apiOptions.server}/api/locations/${cntrlRequest.params.location_id}`,
        method: "GET",
        json: {}
    };

    request(requestOptions, function (err, apiResponse, location) {
        if (apiResponse.statusCode === 200) {
            location.coords.lng = location.coords[0];
            location.coords.lat = location.coords[1];
            if (Array.isArray(location.reviews)) {
                const formatDate = (str) => moment(new Date(str)).format("HH:mm, DD.MM.YYYY");
                location.reviews.forEach(x => x.createdOn = formatDate(x.createdOn));
            }

            callback(cntrlRequest, cntrlResponse, location);
        } else
            showError(cntrlRequest, cntrlResponse, apiResponse.statusCode);
    });
};


const showError = function (request, response, status) {
    let title, content;
    if (status === 404) {
        title = "404, page not found";
        content = "Oh, dear. Looks like we can't find this page. Sorry.";
    } else {
        title = `${status}, something's gone wrong`;
        content = "Something, somewhere, has gone just a little bit wrong.";
    }

    response.status(status);
    response.render("generic-text", {title, content});
};


const renderDetailPage = function (request, response, location) {
    response.render("location-info", {
        title: location.name,
        sidebar: {
            context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
            callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
        },
        location: location,
        geoapifyApiKey: "a0b6c6c2176a456d81380e6f6bd954ea"
    });
};


module.exports.addReview = function (cntrlRequest, cntrlResponse) {
    getLocationInfo(cntrlRequest, cntrlResponse, renderReviewForm);
};


const renderReviewForm = function (request, response, location) {
    response.render("location-review-form", {
        title: `Review ${location.name} on Loc8r`,
        pageHeader: {title: `Review ${location.name}`},
        error: request.query.err
    });
};


module.exports.doAddReview = function (cntrlRequest, cntrlResponse) {
    const locationId = cntrlRequest.params.location_id;
    const requestOptions = {
        url: `${apiOptions.server}/api/locations/${locationId}/reviews`,
        method: "POST",
        json: {
            author: cntrlRequest.body.name,
            rating: Number.parseInt(cntrlRequest.body.rating),
            reviewText: cntrlRequest.body.review
        }
    };

    if (!requestOptions.json.author || !requestOptions.json.rating || !requestOptions.json.reviewText)
        cntrlResponse.redirect(`/location/${locationId}/reviews/new?err=val`);
    else {
        request(requestOptions, function (err, apiResponse, review) {
            if (apiResponse.statusCode === 201)
                cntrlResponse.redirect(`/location/${locationId}`);
            else if (apiResponse.statusCode === 400 && review.name && review.name === "ValidationError") {
                cntrlResponse.redirect(`/location/${locationId}/reviews/new?err=val`);
            } else {
                console.log(review);
                showError(cntrlRequest, cntrlResponse, apiResponse.statusCode);
            }
        });
    }
};
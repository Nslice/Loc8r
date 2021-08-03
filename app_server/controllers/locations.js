const chalk = require("chalk");
const moment = require("moment");
const _ = require("lodash");
const request = require("request");

const port = process.env.PORT || "3000";
const apiOptions = (process.env.NODE_ENV === "production")
    ? {server: process.env.SERVER_URI}
    : {server: `http://localhost:${port}`};



// TODO: отрефакторить
module.exports.homeList = function (requestArg, response) {
    const requestOptions = {
        url: `${apiOptions.server}/api/locations`,
        method: "GET",
        json: {},
        qs: {
            lng: 74.68263823715606,
            lat: 42.884340390920535,
            max: 10500
        }
    };

    request(requestOptions, function (err, apiResponse, locations) {
        if (apiResponse.statusCode === 200 && Array.isArray(locations))
            locations.forEach(x => x.distance = _formatDistance(x.distance));
        else
            console.log(`homeList controller, apiResponse.statusCode: ${chalk.red(apiResponse.statusCode)}`);

        renderHomepage(requestArg, response, locations);
    });

    const _formatDistance = (dist) => {
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





module.exports.locationInfo = function (requestArg, response) {
    const requestOptions = {
        url: `${apiOptions.server}/api/locations/${requestArg.params.location_id}`,
        method: "GET",
        json: {}
    };

    request(requestOptions, function (err, apiResponse, location) {
        location.coords.lng = location.coords[0];
        location.coords.lat = location.coords[1];
        location.reviews
            .forEach(x => x.createdOn = moment(new Date(x.createdOn)).format("DD.MM.YYYY"));

        renderDetailPage(requestArg, response, location);
    });

    // response.render("location-info", {
    //     title: "Location info",
    //     sidebar: {
    //         context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
    //         callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
    //     },
    //     location: {
    //         name: "Starcups",
    //         address: "125 High Street, Reading, RG6 1PS",
    //         rating: 3,
    //         facilities: ["Hot drinks", "Food", "Premium wifi"],
    //         coords: {
    //             lat: 51.455041,
    //             lng: -0.9690884
    //         },
    //
    //         openingTimes: [
    //             {
    //                 days: "Monday - Friday",
    //                 opening: "07:00 am",
    //                 closing: "07:00 pm",
    //                 closed: false
    //             },
    //             {
    //                 days: "Saturday",
    //                 opening: "08:00 am",
    //                 closing: "05:00 pm",
    //                 closed: false
    //             },
    //             {
    //                 days: "Sunday",
    //                 closed: true
    //             }
    //         ],
    //
    //         reviews: [
    //             {
    //                 author: "Simon Holmes",
    //                 rating: 5,
    //                 timestamp: "16 July 2013",
    //                 reviewText: "What a great place. I can't say enough good things about it."
    //             },
    //             {
    //                 author: "Charlie Chaplin",
    //                 rating: 3,
    //                 timestamp: "16 June 2013",
    //                 reviewText: "It was okay. Coffee wasn't great, but the wifi was fast."
    //             }
    //         ]
    //     }
    // });
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


module.exports.addReview = function (req, res) {
    res.render("location-review-form", {title: "Add review"});
};
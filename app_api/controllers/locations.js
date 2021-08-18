const mongoose = require("mongoose");
const Location = mongoose.model("Location");


module.exports.locationsListByDistance = function (request, response) {
    const lng = Number(request.query.lng);
    const lat = Number(request.query.lat);
    const max = Number(request.query.max) || 10000;
    const limit = Number(request.query.limit) || 10;

    if (Number.isNaN(lng) || Number.isNaN(lat)) {
        const err = {message: "'lng' and 'lat' query parameters are required"};
        console.log(err);
        sendJsonResponse(response, 400, err);
        return;
    }

    // TODO: добавил для теста анимации загрузки, убрать потом
    setTimeout( function () {
        Location.aggregate([
                {
                    $geoNear: {
                        near: {type: "Point", coordinates: [lng, lat]},
                        spherical: true,
                        distanceField: "dist.calculated",
                        maxDistance: max
                    }
                },
                {$limit: limit}
            ],
            function (err, result) {
                if (err) {
                    console.log(err);
                    sendJsonResponse(response, 400, err);
                } else
                    sendLocationsResult(response, result)
            });
    }, 3555);
};


const sendLocationsResult = function (response, result) {
    const locations = [];
    result.forEach(x => {
        locations.push({
            distance: x.dist.calculated,
            name: x.name,
            address: x.address,
            rating: x.rating,
            facilities: x.facilities,
            _id: x._id,
        });
    });
    sendJsonResponse(response, 200, locations);
};


module.exports.locationsCreate = function (request, response) {
    Location.create({
            name: request.body.name,
            address: request.body.address,
            facilities: parseFacilitiesString(request.body.facilities),
            coords: [Number.parseFloat(request.body.lng), Number.parseFloat(request.body.lat)],
            openingTimes: [
                {
                    days: request.body.days1,
                    opening: request.body.opening1,
                    closing: request.body.closing1,
                    closed: request.body.closed1
                },
                {
                    days: request.body.days2,
                    opening: request.body.opening2,
                    closing: request.body.closing2,
                    closed: request.body.closed2
                },
            ]
        },
        function (err, location) {
            if (err) {
                console.log(err);
                sendJsonResponse(response, 400, err);
            }
            else
                sendJsonResponse(response, 201, location);
        });
};


/**
 * @param {String} facilities
 * @return {Array}
 */
const parseFacilitiesString = function (facilities) {
    return facilities.split(/,\s*/);
};


module.exports.locationsReadOne = function (request, response) {
    if (request.params && request.params.location_id) {
        Location.findById(request.params.location_id)
            .exec(function (err, location) {
                if (err) {
                    console.log(err);
                    sendJsonResponse(response, 400, err);
                }
                else if (!location)
                    sendJsonResponse(response, 404, {message: "location_id not found"});
                else
                    sendJsonResponse(response, 200, location);
            });
    } else {
        const err = {message: "No location_id in request"};
        console.log(err);
        sendJsonResponse(response, 400, err);
    }
};


// TODO: не тестил это
module.exports.locationsUpdateOne = function (request, response) {
    if (request.params && request.params.location_id) {
        Location.findById(request.params.location_id)
            .select("-reviews -rating")
            .exec(function (err, location) {
                if (err) {
                    console.log(err);
                    sendJsonResponse(response, 400, err);
                }
                else if (!location)
                    sendJsonResponse(response, 404, {message: "location_id not found"});
                else {
                    location.name = request.body.name;
                    location.address = request.body.address;
                    location.facilities = parseFacilitiesString(request.body.facilities),
                    location.coords = [Number.parseFloat(request.body.lng), Number.parseFloat(request.body.lat)];
                    location.openingTimes = [
                        {
                            days: request.body.days1,
                            opening: request.body.opening1,
                            closing: request.body.closing1,
                            closed: request.body.closed1
                        },
                        {
                            days: request.body.days2,
                            opening: request.body.opening2,
                            closing: request.body.closing2,
                            closed: request.body.closed2
                        },
                    ];

                    location.save(function (err, loc) {
                        if (err) {
                            console.log(err);
                            sendJsonResponse(response, 400, err);
                        }
                        else
                            sendJsonResponse(response, 200, loc);
                    });
                }
            });
    } else {
        const err = {message: "No location_id in request"};
        console.log(err);
        sendJsonResponse(response, 400, err);
    }
}


module.exports.locationsDeleteOne = function (request, response) {
    if (request.params && request.params.location_id) {
        Location.findByIdAndRemove(request.params.location_id)
            .exec(function (err, location) {
                if (err) {
                    console.log(err);
                    sendJsonResponse(response, 400, err);
                }
                else if (!location)
                    sendJsonResponse(response, 404, {message: "location_id not found"});
                else
                    sendJsonResponse(response, 204, null);
            });
    } else {
        const err = {message: "No location_id in request"};
        console.log(err);
        sendJsonResponse(response, 400, err);
    }
};


const sendJsonResponse = function (response, status, content) {
    response.status(status);
    response.json(content);
};
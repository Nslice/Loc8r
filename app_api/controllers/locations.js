const mongoose = require("mongoose");
const Location = mongoose.model("Location");


const radiansConvertor = (function () {
    const earthRadius = 6371;
    const getDistanceFromRads = rads => rads * earthRadius;
    const getRadsFromDistance = distance => distance / earthRadius;

    return {
        getDistanceFromRads,
        getRadsFromDistance
    };
})();


module.exports.locationsListByDistance = function (request, response) {
    const lng = Number.parseFloat(request.query.lng);
    const lat = Number.parseFloat(request.query.lat);
    const max = Number.parseFloat(request.query.max);

    if (Number.isNaN(lng) || Number.isNaN(lat)) {
        sendJsonResponse(response, 400, {message: "'lng' and 'lat' query parameters are required"});
        return;
    }

    Location.aggregate([
            {
                $geoNear: {
                    near: {type: "Point", coordinates: [lng, lat]},
                    spherical: true,
                    distanceField: "dist.calculated",
                    maxDistance: 0.01,
                }
            },
            {$limit: 10}
        ],
        function (err, result) {
            if (err) {
                sendJsonResponse(response, 400, err);
            } else {
                sendLocationsResult(response, result)
            }
        });
};


/**
 * @param response
 * @param {Array} result
 */
const sendLocationsResult = function (response, result) {
    if (result.length) {
        const locations = [];
        result.forEach(x => {
            locations.push({
                distance: radiansConvertor.getDistanceFromRads(x.dist.calculated),
                name: x.name,
                address: x.address,
                rating: x.rating,
                facilities: x.facilities,
                _id: x._id,
            });
        });
        sendJsonResponse(response, 200, locations);
    } else
        sendJsonResponse(response, 404, "locations not found")
};


module.exports.locationsCreate = function (request, response) {
    Location.create({
            name: request.body.name,
            address: request.body.address,
            facilities: request.body.facilities.split(/,\s*/), // TODO: вынести в метод parseFacilities
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
            if (err)
                sendJsonResponse(response, 400, err);
            else
                sendJsonResponse(response, 201, location);
        });
};


module.exports.locationsReadOne = function (request, response) {
    if (request.params && request.params.location_id) {
        Location.findById(request.params.location_id)
            .exec(function (err, location) {
                if (err)
                    sendJsonResponse(response, 400, err);
                else if (!location)
                    sendJsonResponse(response, 404, {message: "location_id not found"});
                else
                    sendJsonResponse(response, 200, location)
            });
    } else
        sendJsonResponse(response, 400, {message: "No location_id in request"})
};


// TODO: не тестил это
module.exports.locationsUpdateOne = function (request, response) {
    if (request.params && request.params.location_id) {
        Location.findById(request.params.location_id)
            .select("-reviews -rating")
            .exec(function (err, location) {
                if (err)
                    sendJsonResponse(response, 400, err);
                else if (!location)
                    sendJsonResponse(response, 404, {message: "location_id not found"});
                else {
                    location.name = request.body.name;
                    location.address = request.body.address;
                    location.facilities = request.body.facilities.split(/,\s*/); // TODO: вынести в метод parseFacilities
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
                        if (err)
                            sendJsonResponse(response, 400, err);
                        else
                            sendJsonResponse(response, 200, loc);
                    });
                }
            });
    } else
        sendJsonResponse(response, 400, {message: "No location_id in request"});
}


module.exports.locationsDeleteOne = function (request, response) {
    if (request.params && request.params.location_id) {
        Location.findByIdAndRemove(request.params.location_id)
            .exec(function (err, location) {
                if (err)
                    sendJsonResponse(response, 400, err);
                else if (!location)
                    sendJsonResponse(response, 404, {message: "location_id not found"});
                else
                    sendJsonResponse(response, 204, null);
            });
    } else
        sendJsonResponse(response, 400, {message: "No location_id in request"});
};


const sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};
const mongoose = require("mongoose");
const User = mongoose.model("User");
const passport = require("passport");


module.exports.register = function (request, response) {
    if (!request.body.name || !request.body.email || !request.body.password) {
        sendJsonResponse(response, 400, {message: "All field required"});
        return;
    }

    const user = new User();
    user.name = request.body.name;
    user.email = request.body.email;
    user.setPassword(request.body.password);

    user.save(function (err) {
        if (err) {
            console.log(err);
            if (err.code === 11000)
                sendJsonResponse(response, 400, {message: "An account with this email already exists"});
            else
                sendJsonResponse(response, 400, err.message);
        } else {
            console.log(`registered user email '${user.email}'`);
            sendJsonResponse(response, 200, {token: user.generateJwt()});
        }
    });

};


module.exports.login = function (request, response) {
    if (!request.body.email || !request.body.password) {
        sendJsonResponse(response, 400, {message: "All field required"});
        return;
    }

    // TODO: чоза info
    passport.authenticate("local", function (err, user, info) {
        if (err) {
            sendJsonResponse(response, 404, err);
            return;
        }

        if (user)
            sendJsonResponse(response, 200, {token: user.generateJwt()});
        else
            sendJsonResponse(response, 401, info);
    })(request, response);
};


const sendJsonResponse = function (response, status, content) {
    response.status(status);
    response.json(content);
};
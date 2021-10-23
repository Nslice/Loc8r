const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("./app_api/models/db");



minificateCode();

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "app_client")));
app.use("/lodash", express.static(path.join(__dirname, "node_modules", "lodash")));

setRoutes();

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});




function minificateCode() {
    const uglifyJs = require("uglify-js");
    const fs = require("fs");

    const appClientFiles = {
        app: fs.readFileSync("app_client/app.js", "utf8"),
        homeCtrl: fs.readFileSync("app_client/home/home.controller.js", "utf8"),
        aboutCtrl: fs.readFileSync("app_client/about/about.controller.js", "utf8"),
        locationDetailCtrl: fs.readFileSync("app_client/locationDetail/locationDetail.controller.js", "utf8"),
        reviewModalCtrl: fs.readFileSync("app_client/reviewModal/reviewModal.controller.js", "utf8"),
        geolocationService: fs.readFileSync("app_client/common/services/geolocation.service.js", "utf8"),
        loc8rDataService: fs.readFileSync("app_client/common/services/loc8rData.service.js", "utf8"),
        pageHeaderDirective: fs.readFileSync("app_client/common/directives/pageHeader/pageHeader.directive.js", "utf8"),
        navigationDirective: fs.readFileSync("app_client/common/directives/navigation/navigation.directive.js", "utf8"),
        footerGenericDirective: fs.readFileSync("app_client/common/directives/footerGeneric/footerGeneric.directive.js", "utf8"),
        ratingStarsDirective: fs.readFileSync("app_client/common/directives/ratingStars/ratingStars.directive.js", "utf8"),
        formatDistanceFilter: fs.readFileSync("app_client/common/filters/formatDistance.filter.js", "utf8"),
        addHtmlLineBreaksFilter: fs.readFileSync("app_client/common/filters/addHtmlLineBreaks.filter.js", "utf8"),
    };

    const uglified = uglifyJs.minify(appClientFiles, {compress: true});
    fs.writeFile("public/angularjs/loc8r.min.js", uglified.code, function (err) {
        if (err)
            console.log(err);
        else
            console.log("Script generated and saved: 'loc8r.min.js");
    });
}


function setRoutes() {
    const routesApi = require("./app_api/routes/locations");
    app.use("/api", routesApi);


    // index.html по умолчанию будет отправляться и без этого контроллера, если изменить имя файла, то тогда понадобиться
    app.use(function (request, response) {
        response.sendFile(path.join(__dirname, "app_client", "index.html"));
    });
}



module.exports = app;
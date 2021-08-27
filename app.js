const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("./app_api/models/db");

const uglifyJs = require("uglify-js");
const fs = require("fs");


const indexRouter = require("./app_server/routes/index");
const usersRouter = require("./app_server/routes/users");
const routesApi = require("./app_api/routes/locations");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "app_server", "views"));
app.set("view engine", "pug");


const appClientFiles = {
    app: fs.readFileSync("app_client/app.js", "utf8"),
    homeController: fs.readFileSync("app_client/home/home.controller.js", "utf8"),
    geolocation: fs.readFileSync("app_client/common/services/geolocation.service.js", "utf8"),
    loc8rData: fs.readFileSync("app_client/common/services/loc8rData.service.js", "utf8"),
    formatDistance: fs.readFileSync("app_client/common/filters/formatDistance.filter.js", "utf8"),
    ratingStars: fs.readFileSync("app_client/common/directive/ratingStars/ratingStars.directive.js", "utf8")
};

const uglified = uglifyJs.minify(appClientFiles, {compress: true});
fs.writeFile("public/angularjs/loc8r.min.js", uglified.code, function (err) {
    if (err)
      console.log();
    else
      console.log("Script generated and saved: 'loc8r.min.js");
});


app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "app_client")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api", routesApi);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

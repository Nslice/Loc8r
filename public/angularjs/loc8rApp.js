angular.module("loc8rApp", []);


// TODO: все GEO API тут надо заменить на более интелктуальное.
// мы живем 800 м над уровнем моря, значит радиус получается больше.
// для определения местоположений надо попробывать 2GIS api оно бесплатное.
// Mongoose встроено явно неправильно определяетс расстояния между точками, не учитывается высота
const loc8rData = function ($http) {
    const locationsByCoords = function (lat, lng) {
        return $http.get(`/api/locations?lng=${lng}&lat=${lat}`)
    };

    return {locationsByCoords};
};


const geolocation = function () {
    const getPosition = function (cbSuccess, cbError, cbNoGeo) {
        if (navigator.geolocation)
            navigator.geolocation.getCurrentPosition(cbSuccess, cbError);
        else
            cbNoGeo();
    };

    return {getPosition};
};


// TODO: Ajax Spinner сделать анимацию загрузкиы
const locationListCtrl = function ($scope, loc8rData, geolocation) {
    $scope.message = "Checking your location";

    $scope.getData = function (position) {
        $scope.$apply(() => $scope.message = "Searching for nearby places");

        loc8rData.locationsByCoords(position.coords.latitude, position.coords.longitude)
            .then(response => {
                    $scope.message = (response.data.length) ? "" : "No locations found";
                    $scope.data = {locations: response.data};
                },
                err => {
                    console.log(err);
                    $scope.message = "Sorry, something's gone wrong";
                }
            );
    };

    $scope.showError = function (error) {
        $scope.$apply(function () {
            $scope.message = error.message;
        });
    };

    $scope.noGeo = function () {
        $scope.$apply(function () {
            $scope.message = "Geolocation not supported by this browser";
        });
    };

    geolocation.getPosition($scope.getData, $scope.showError, $scope.noGeo);
};


const formatDistance = function () {
    return function (dist) {
        if (!isNaN(dist) && Number.isFinite(dist)) {
            if (dist >= 1000)
                return `${_.round(dist / 1000, 1)} km`;
            else
                return `${_.round(dist, 0)} m`;
        } else
            return "?";
    };
};


const ratingStars = function () {
    return {
        scope: {
            thisRating: "=rating"
        },
        templateUrl: "/angularjs/rating-stars.html"
    };
};


angular.module("loc8rApp")
    .controller("locationListCtrl",  locationListCtrl)
    .filter("formatDistance", formatDistance)
    .directive("ratingStars", ratingStars)
    .service("loc8rData", loc8rData)
    .service("geolocation", geolocation);
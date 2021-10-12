(function () {
    const homeCtrl = function ($scope, loc8rData, geolocation) {
        const thisRef = this;

        thisRef.pageHeader = {
            title: "Loc8r",
            strapLine: "Find places to work with wifi near you"
        };

        thisRef.sidebar = {
            content: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about." +
                "Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for."
        };


        thisRef.message = "Checking your location";

        const getData = function (position) {
            $scope.$apply(() => thisRef.message = "Searching for nearby places");

            loc8rData.locationsByCoords(position.coords.latitude, position.coords.longitude)
                .then(response => {
                        thisRef.message = (response.data.length) ? "" : "No locations found";
                        thisRef.data = {locations: response.data};
                    },
                    err => {
                        console.log(err);
                        thisRef.message = "Sorry, something's gone wrong";
                    }
                );
        };

        const showError = function (error) {
            $scope.$apply(function () {
                thisRef.message = error.message;
            });
        };

        const noGeo = function () {
            $scope.$apply(function () {
                thisRef.message = "Geolocation not supported by this browser";
            });
        };

        geolocation.getPosition(getData, showError, noGeo);
    };
    homeCtrl.$inject = ["$scope", "loc8rData", "geolocation"];


    angular.module("loc8rApp")
        .controller("homeCtrl", homeCtrl);
})();
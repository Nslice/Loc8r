(function () {
    angular.module("loc8rApp", ["ngRoute", "ngSanitize", "ui.bootstrap"]);

    const config = function ($routeProvider, $locationProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "home/home.view.html",
                controller: "homeCtrl",
                controllerAs: "vm"
            })
            .when("/about", {
                templateUrl: "/common/views/genericText.view.html",
                controller: "aboutCtrl",
                controllerAs: "vm"
            })
            .when("/location/:location_id", {
                templateUrl: "/locationDetail/locationDetail.view.html",
                controller: "locationDetailCtrl",
                controllerAs: "vm"
            })
            .otherwise({redirectTo: "/"});


        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
        $locationProvider.hashPrefix("");
    };

    angular.module("loc8rApp")
        .config(["$routeProvider", "$locationProvider", config]);
})();
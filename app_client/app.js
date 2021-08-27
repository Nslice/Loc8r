(function () {
    angular.module("loc8rApp", []);
    angular.module("loc8rApp", ["ngRoute"]);

    const config = function ($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "home/home.view.html",
                controller: "homeCtrl",
                controllerAs: "vm"
            })
            .otherwise({redirectTo: "/"});
    }

    angular.module("loc8rApp")
        .config(["$routeProvider", config]);
})();
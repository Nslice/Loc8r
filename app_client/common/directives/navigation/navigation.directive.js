(function () {
    const navigation = function () {
        return {
            restrict: "EA",
            templateUrl: "/common/directives/navigation/navigation.template.html",
            controller: "navigationCtrl",
            controllerAs: "navvm"
        };
    };

    angular.module("loc8rApp")
        .directive("navigation", navigation);
})();

(function () {
    const pageHeader = function () {
        return {
            restrict: "EA",
            scope: {
                content: "=content"
            },
            templateUrl: "/common/directives/pageHeader/pageHeader.template.html"
        };
    };

    angular.module("loc8rApp")
        .directive("pageHeader", pageHeader);
})();

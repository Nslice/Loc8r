(function () {
    const ratingStars = function () {
        return {
            restrict: "EA",
            scope: {
                thisRating: "=rating"
            },
            templateUrl: "/common/directive/ratingStars/ratingStars.template.html"
        };
    };

    angular.module("loc8rApp")
        .directive("ratingStars", ratingStars);
})();

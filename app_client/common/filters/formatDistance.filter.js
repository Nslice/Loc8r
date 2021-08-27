(function () {
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

    angular.module("loc8rApp")
        .filter("formatDistance", formatDistance);
})();

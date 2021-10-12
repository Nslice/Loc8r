(function () {
    // TODO: все GEO API тут надо заменить на более интелктуальное.
    // мы живем 800 м над уровнем моря, значит радиус получается больше.
    // для определения местоположений надо попробывать 2GIS api оно бесплатное.
    // Mongoose встроено явно неправильно определяетс расстояния между точками, не учитывается высота
    const loc8rData = function ($http) {
        const locationsByCoords = function (lat, lng) {
            return $http.get(`/api/locations?lng=${lng}&lat=${lat}`);
        };

        const locationById = function (locationId) {
            return $http.get(`/api/locations/${locationId}`);
        };

        const addReviewById = function (locationId, data) {
            return $http.post(`/api/locations/${locationId}/reviews`, data);
        };

        return {
            locationsByCoords,
            locationById,
            addReviewById
        };
    };
    loc8rData.$inject = ["$http"];

    angular.module("loc8rApp")
        .service("loc8rData", loc8rData);
})();
angular.module("loc8rApp", []);


const locationListCtrl = function ($scope) {
    $scope.data = {
        locations: [{
            name: "Starcups",
            address: "125 High Street, Reading, RG6 1PS",
            rating: 3,
            facilities: ["Hot drinks", "Food", "Premium wifi"],
            distance: "0.43",
            _id: "fd"
        }, {
            name: "Costy",
            address: "Rape dear",
            rating: 3,
            facilities: ["Guchi Muchi", "Food", "Premium wifi"],
            distance: "0.54",
            _id: "zagd"
        }]
    };
    $scope.message = "hi nigga"
};


angular.module("loc8rApp")
    .controller("locationListCtrl", locationListCtrl);
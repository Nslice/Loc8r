angular.module("myApp", []);

const myController = function ($scope) {
    $scope.myInput = "world!";
    $scope.items = ["one", "two", "free"];
};



angular.module("myApp")
    .controller("myController", myController);



angular.module("myApp")
    .controller("locationListCtrl", function ($scope) {
        $scope.message = "hi nigga";
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
    })
    .controller("testCtrl", $scope => {
        $scope.message = "hi, nigga";
    });

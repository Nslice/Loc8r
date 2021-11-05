(function () {
    const locationDetailCtrl = function ($routeParams, $location, $uibModal, loc8rData, authentication) {
        const thisRef = this;

        thisRef.isLoggedIn = authentication.isLoggedIn;
        thisRef.currentPath = $location.path();

        loc8rData.locationById($routeParams.location_id)
            .then(response => {
                    thisRef.location = response.data;
                    thisRef.location.coords.lng = thisRef.location.coords[0];
                    thisRef.location.coords.lat = thisRef.location.coords[1];
                    thisRef.pageHeader = {
                        title: thisRef.location.name
                    };
                    thisRef.sidebar = {
                        context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
                        callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
                    };

                    thisRef.geoapifyApiKey = "a0b6c6c2176a456d81380e6f6bd954ea";
                },
                err => {
                    console.log(err);
                    thisRef.message = "Something wrong";
                }
            );


        thisRef.popupReviewForm = function () {
            const modalInstance = $uibModal.open({
                templateUrl: "/reviewModal/reviewModal.view.html",
                controller: "reviewModalCtrl",
                controllerAs: "vm",
                resolve: {
                    locationData: function () {
                        return {
                            id: thisRef.location._id,
                            name: thisRef.location.name
                        };
                    }
                }
            });

            modalInstance.result.then(data => {
                    thisRef.location.reviews.push(data)
                },
                err => console.log(err)
            );
        };
    };
    locationDetailCtrl.$inject = ["$routeParams", "$location", "$uibModal", "loc8rData", "authentication"];


    angular.module("loc8rApp")
        .controller("locationDetailCtrl", locationDetailCtrl);
})();
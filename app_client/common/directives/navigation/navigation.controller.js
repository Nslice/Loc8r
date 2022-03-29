(function () {
    const navigationCtrl = function ($location, authentication) {
        const thisRef = this;


        console.log("lodash " + _.now())
        thisRef.currentPath = $location.path();

        thisRef.isLoggedIn = authentication.isLoggedIn();
        thisRef.currentUser = authentication.currentUser();

        thisRef.logout = function () {
            authentication.logout();
            $location.path(thisRef.currentPath);
            thisRef.isLoggedIn = authentication.isLoggedIn();
        };
    };
    navigationCtrl.$inject = ["$location", "authentication"];

    angular.module("loc8rApp")
        .controller("navigationCtrl", navigationCtrl);
})();
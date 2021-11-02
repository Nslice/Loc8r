(function () {
    const authentication = function ($window, $http) {
        const jwtTokenKey = "loc8r-jwt-token";

        const saveToken = function (token) {
            $window.localStorage[jwtTokenKey] = token;
        };

        const getToken = function () {
            return $window.localStorage[jwtTokenKey];
        };

        const register = function (user) {
            return $http.post("/api/register", user)
                .then(response => saveToken(response.data.token));
        };

        const login = function (user) {
            return $http.post("/api/login", user)
                .then(response => saveToken(response.data.token));
        };

        const logout = function () {
            return $window.localStorage.removeItem(jwtTokenKey);
        };

        const isLoggedIn = function () {
            const token = getToken();
            if (token) {
                const payload = JSON.parse($window.atob(token.split(".")[1]));
                return payload.exp > Date.now() / 1000;
            } else
                return false;
        };

        const currentUser = function () {
            if (isLoggedIn()) {
                const token = getToken();
                const payload = JSON.parse($window.atob(token.split(".")[1]));

                return {
                    email: payload.email,
                    name: payload.name
                };
            }
        };


        return {
            saveToken,
            getToken,
            register,
            login,
            logout,
            isLoggedIn,
            currentUser
        };
    };
    authentication.$inject = ["$window", "$http"];

    angular.module("loc8rApp")
        .service("authentication", authentication);
})();

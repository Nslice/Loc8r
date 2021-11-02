(function () {
    const loginCtrl = function ($location, authentication) {
        const thisRef = this;

        thisRef.pageHeader = {title: "Sign in to Loc8r"};

        thisRef.returnPage = $location.search().page || "/";

        thisRef.onSubmit = function () {
            thisRef.formError = "";
            if (!thisRef.credentials?.email || !thisRef.credentials.password)
                thisRef.formError = "All fields required, please try again";
            else
                thisRef.doLogin()
        };

        thisRef.doLogin = function (){
            thisRef.formError = "";
            authentication.login(thisRef.credentials)
                .then(result => $location.search("page", null)
                    .path(thisRef.returnPage),
                    err => thisRef.formError = err
                );

        };


    };
    loginCtrl.$inject = ["$location", "authentication"];

    angular.module("loc8rApp")
        .controller("loginCtrl", loginCtrl);
})();
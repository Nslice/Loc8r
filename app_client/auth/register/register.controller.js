(function () {
    const registerCtrl = function ($location,  $timeout, authentication) {
        const thisRef = this;

        thisRef.pageHeader = {title: "Create a new Loc8r account"};
        thisRef.returnPage = $location.search().page || "/";

        thisRef.onSubmit = function () {
            thisRef.formError = "";
            if (!thisRef.credentials?.name || !thisRef.credentials.email || !thisRef.credentials.password)
                $timeout(() =>thisRef.formError = "All fields required, please try again", 200);
            else
                thisRef.doRegister();
        };

        thisRef.doRegister = function () {
            thisRef.formError = "";
            authentication.register(thisRef.credentials)
                .then(() => $location.search("page", null)
                    .path(thisRef.returnPage)
                )
                .catch(err => thisRef.formError = err.data.message);
        };

    };
    registerCtrl.$inject = ["$location", "$timeout", "authentication"];

    angular.module("loc8rApp")
        .controller("registerCtrl", registerCtrl);
})();
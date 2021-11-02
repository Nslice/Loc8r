(function () {
    const registerCtrl = function ($location, authentication) {
        const thisRef = this;

        thisRef.pageHeader = {title: "Create a new Loc8r account"};
        thisRef.returnPage = $location.search().page || "/";

        thisRef.onSubmit = function () {
            thisRef.formError = "";
            if (!thisRef.credentials?.name || !thisRef.credentials.email || !thisRef.credentials.password)
                thisRef.formError = "All fields required, please try again";
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
    registerCtrl.$inject = ["$location", "authentication"];

    angular.module("loc8rApp")
        .controller("registerCtrl", registerCtrl);
})();
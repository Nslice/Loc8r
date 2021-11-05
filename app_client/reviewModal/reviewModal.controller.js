(function () {
    const reviewModalCtrl = function ($uibModalInstance, loc8rData, locationData) {
        const thisRef = this;

        thisRef.locationData = locationData;

        thisRef.modal = {
            close: function (result) {
                $uibModalInstance.close(result);
            },
            cancel: function () {
                $uibModalInstance.dismiss("cancel");
            }
        };


        thisRef.onSubmit = function () {
            if (!thisRef.formData?.rating || !thisRef.formData.reviewText)
                thisRef.formError = "All fields required, please try again";
            else
                thisRef.doAddReview(locationData.id, thisRef.formData)
        };


        thisRef.doAddReview = function (locationId, formData) {
            loc8rData
                .addReviewById(locationId, {
                    rating: formData.rating,
                    reviewText: formData.reviewText
                })
                .then(response => {
                        console.log(response.data);
                        thisRef.modal.close(response.data);
                    },
                    err => {
                        console.log(err);
                        thisRef.formError = "Your review has not been saved, try again";
                    }
                );
        };

    };
    reviewModalCtrl.$inject = ["$uibModalInstance", "loc8rData", "locationData"];


    angular.module("loc8rApp")
        .controller("reviewModalCtrl", reviewModalCtrl);
})();
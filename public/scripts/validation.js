$("#addReview").submit(function (e) {
    $(".alert.alert-danger").hide();
    if (!$("input#name").val() || !$("select#rating").val() || !$("textarea#review").val()) {
        const $this = $(this);
        setTimeout(function() {
            if ($(".alert.alert-danger").length)
                $(".alert.alert-danger").show();
            else
                $this.prepend(`<div role="alert" class="alert alert-danger"> All fields required, please try again</div>`);
        }, 150);

        return false;
    }

    return true;
});
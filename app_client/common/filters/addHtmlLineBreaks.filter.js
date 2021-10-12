(function () {
    const addHtmlLineBreaks = function () {
        return function (text) {
            return text.replace(/\n/g, "<br/>");
        };
    };

    angular.module("loc8rApp")
        .filter("addHtmlLineBreaks", addHtmlLineBreaks);
})();

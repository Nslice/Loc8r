module.exports.about = function (req, res) {
    res.render("generic-text", {title: "About"});
};


module.exports.angularApp = function (request, response) {
    response.render("layout", {
        title: "Loc8r"
    });
};
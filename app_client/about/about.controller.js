(function () {
    const aboutCtrl = function () {
        this.pageHeader = {
            title: "Loc8r"
        };
        this.main = {
            content: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam\n" +
                "rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.\n" +
                "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores\n" +
                "eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,\n" +
                "consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam\n" +
                "aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit\n" +
                "laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate\n" +
                "velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
        }
    };


    angular.module("loc8rApp")
        .controller("aboutCtrl", aboutCtrl);
})();
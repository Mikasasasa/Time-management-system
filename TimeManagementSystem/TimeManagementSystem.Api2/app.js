(function () {

    var app = Sammy('body');
    app.use(Sammy.Template);

    $(document).ready(function () {
        ko.applyBindings(new HomeViewModel(), document.getElementById("menu"));
        app.run('#/');
    });

})();
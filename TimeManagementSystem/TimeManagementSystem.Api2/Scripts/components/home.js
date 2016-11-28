(function () {
    var app = Sammy.apps.body;

    app.get('/#home', function (context) {
        context.render('/Views/menu.html', {}, function (output) {
            $('#header').html(output);
            ko.applyBindings(new HomeViewModel(), document.getElementById("menu"));
        });
        context.render('/Views/welcome.html', {}, function (output) {
            $('#wrapper').html(output);
        });
    });

})();
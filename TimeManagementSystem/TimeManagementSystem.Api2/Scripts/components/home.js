(function () {
    var app = Sammy.apps.body;

    app.get('/#home', function (context) {
        context.render('/Views/home.html', {}, function (output) {
            $('#container').html(output);
        });
    });

})();
(function () {
    var app = Sammy.apps.body;

    function AuthViewModel() {

        var self = this;
        self.login = ko.observable("");
        self.password = ko.observable("");
        self.confirmPassword = ko.observable("");
        self.permissionLevel = ko.observable(0);
        self.permissionLevels = ko.observableArray([{ name: "regular", value: 0 }, { name: "user manager", value: 1 }, { name: "administrator", value: 2 }]);
        self.isRegistration = ko.observable(false);
        self.logIn = function () {
            $.get("http://localhost:4599/api/Users", { login: self.login, password: self.password })
            .done(function (data) {
                location.hash = "users/options/" + data.Id;
            }).fail(function (data) {
                alert("login failed");
            });
        };
        self.register = function () {
            if (self.password() === self.confirmPassword()) {
                $.post("http://localhost:4599/api/Users", { Login: self.login, Password: self.password, PermissionLevel: self.permissionLevel })
                .done(function (data) {
                    location.hash = "users/options/" + data.Id;
                }).fail(function (data) {
                    alert("registration failed");
                });
            } else {
                alert("Passwords aren't the same");
            }
        };
        self.setLoggingIn = function () { self.isRegistration(false); };
        self.setRegistering = function () { self.isRegistration(true); };
    }

    app.get('#/', function (context) {
        context.render('/Views/auth.html', {}, function (output) {
            $('#wrapper').html(output);
            ko.applyBindings(new AuthViewModel(), document.getElementById("container"));
        });
    });

})();
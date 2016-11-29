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
            $.ajax({
                type: "post",
                url: "http://localhost:4599/token",
                data: { username: self.login, password: self.password, grant_type: "password" },
                dataType: "application/x-www-form-urlencoded"
            }).always(function (data) {
                if (data.status === 200) {
                    localStorage.setItem("token", "Bearer " + JSON.parse(data.responseText).access_token);
                    location.hash = "/";
                } else {
                    var errorDescription = JSON.parse(data.responseText).error_description;
                    toastr.error(errorDescription);
                }
            });
        };
        self.register = function () {
            if (self.password() === self.confirmPassword()) {
                $.post("http://localhost:4599/api/Users", { Login: self.login, Password: self.password, PermissionLevel: self.permissionLevel })
                .done(function (data) {
                    self.setLoggingIn();
                    toastr.success("User created");
                }).fail(function (data) {
                    var errorDescription = JSON.parse(data.responseText).ModelState[""][0];
                    toastr.error(errorDescription);
                });
            } else {
                toastr.error("Passwords aren't the same");
            }
        };
        self.setLoggingIn = function () { self.isRegistration(false); };
        self.setRegistering = function () { self.isRegistration(true); };
    }

    app.get('#/', function (context) {
        authenticatedRequest("Roles", "get", {}, function (data) {
            localStorage.setItem("role", JSON.parse(data));
            location.hash = "home";
        },
        function () {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            location.hash = "auth";
        });
    });

    app.get('/#auth', function (context) {
        $('#header').html("");
        context.render('/Views/auth.html', {}, function (output) {
            $('#wrapper').html(output);
            ko.applyBindings(new AuthViewModel(), document.getElementById("container"));
        });
    });

})();
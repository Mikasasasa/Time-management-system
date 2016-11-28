(function () {
    var app = Sammy.apps.body;

    function UserViewModel(action, userName) {
        var self = this;
        self.user = ko.observable();
        self.isFullForm = ko.observable(action !== "options");
        self.permissionLevels = ko.observableArray([{ name: "regular", value: 0 }, { name: "user manager", value: 1 }, { name: "administrator", value: 2 }]);

        if (action === "add") {
            self.user({
                Login: null,
                Password: null,
                PermissionLevel: 0,
                PreferredWorkingHourPerDay: null
            });
        } else {
            if (action === "edit") {
                authenticatedRequest("Users", "get", { username: userName }, function (data) {
                    self.user(data);
                },
                function () {
                    alert("not such user");
                    location.hash = "timeRecords";
                });
            } else {
                authenticatedRequest("Users", "get", {}, function (data) {
                    self.user(data[0]);
                },
                function () {
                    alert("not such user");
                    location.hash = "timeRecords";
                });
            }
        }
        self.goToTimeRecords = function () {
            location.hash = "timeRecords/" + id;
        };
        self.saveUser = function () {
            if (action === "add") {
                authenticatedRequest("Users", "post", ko.toJSON(self.user), function (data) {
                    alert("ok");
                    location.hash = "users/edit/" + data.Login;
                },
                function () {
                    alert("not ok");
                });
            } else {
                authenticatedRequest("Users/" + self.user().Id, "put", ko.toJSON(self.user), function (data) {
                    alert("ok");
                },
                function () {
                    alert("not ok");
                });
            }
        };
    }

    function UsersViewModel() {
        var self = this;
        self.users = ko.observableArray();

        authenticatedRequest("Users", "get", ko.toJSON(self.user), function (data) {
            for (var i = 0, len = data.length; i < len; ++i) {
                self.users.push(data[i]);
            }
        },
        function () {
            alert("Error");
        });
        self.addUser = function () {
            location.hash = "users/add";
        };
        self.editUser = function () {
            location.hash = "users/edit/" + this.Login;
        };
        self.removeUser = function () {
            if (confirm("Are you sure?")) {
                var removedItem = this;
                authenticatedRequest("Users/" + removedItem.Id, "delete", {}, function (data) {
                    self.users.remove(removedItem);
                    alert("ok");
                },
                function () {
                    alert("removing failed");
                });
            }
        };
    }

    app.get('/#users', function (context) {
        context.render('/Views/users.html', {}, function (output) {
            $('#wrapper').html(output);
            ko.applyBindings(new UsersViewModel(), document.getElementById("container"));
        });
    });

    app.get('/#users/edit', function (context) {
        var params = this.params;
        context.render('/Views/user.html', {}, function (output) {
            $('#wrapper').html(output);
            ko.applyBindings(new UserViewModel("options"), document.getElementById("container"));
        });
    });

    app.get('/#users/add', function (context) {
        context.render('/Views/user.html', {}, function (output) {
            $('#wrapper').html(output);
            ko.applyBindings(new UserViewModel("add"), document.getElementById("container"));
        });
    });

    app.get('/#users/edit/:username', function (context) {
        var params = this.params;
        context.render('/Views/user.html', {}, function (output) {
            $('#wrapper').html(output);
            ko.applyBindings(new UserViewModel("edit", params.username), document.getElementById("container"));
        });
    });

})();
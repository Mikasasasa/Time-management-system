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
                    self.user(JSON.parse(data));
                },
                function (data) {
                    toastr.error("Unautorized access.");
                    location.hash = "timeRecords";
                });
            } else {
                authenticatedRequest("Users", "get", {}, function (data) {
                    self.user(JSON.parse(data)[0]);
                },
                function (data) {
                    toastr.error("Unautorized access.");
                    location.hash = "timeRecords";
                });
            }
        }
        self.saveUser = function () {
            if (action === "add") {
                authenticatedRequest("Users", "post", ko.toJSON(self.user), function (data) {
                    toastr.success("User added successfully.");
                    location.hash = "users/edit/" + self.user.Login;
                },
                function (data) {
                    var errorDescription = JSON.parse(data.responseText).ModelState[""][0];
                    toastr.error(errorDescription);
                });
            } else {
                authenticatedRequest("Users/" + self.user().Id, "put", ko.toJSON(self.user), function (data) {
                    toastr.success("User updated successfully.");
                },
                function () {
                    toastr.error("Unautorized access.");
                });
            }
        };
    }

    function UsersViewModel() {
        var self = this;
        self.users = ko.observableArray();

        authenticatedRequest("Users", "get", ko.toJSON(self.user), function (data) {
            var responseArray = JSON.parse(data);
            for (var i = 0, len = responseArray.length; i < len; ++i) {
                self.users.push(responseArray[i]);
            }
        },
        function () {
            toastr.error("Unautorized access.");
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
                    toastr.success("User deleted successfully.");
                },
                function () {
                    toastr.error("Unautorized access.");
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
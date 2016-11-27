(function () {
    var app = Sammy.apps.body;

    function UserViewModel(action, id) {
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
            $.get("http://localhost:4599/api/Users", { id: id })
                .done(function (data) {
                    self.user(data);
                }).fail(function (data) {
                    alert("not such user");
                    location.hash = "timeRecords";
                });
        }
        self.goToTimeRecords = function () {
            location.hash = "timeRecords/" + id;
        };
        self.saveUser = function () {
            if (action === "add") {
                $.ajax({
                    url: "http://localhost:4599/api/Users",
                    type: "post",
                    contentType: 'application/json',
                    data: ko.toJSON(self.user)
                })
                .done(function (data) {
                    alert("ok");
                }).fail(function (data) {
                    alert("not ok");
                });
            } else {
                $.ajax({
                    url: "http://localhost:4599/api/Users/" + id,
                    type: "put",
                    contentType: 'application/json',
                    data: ko.toJSON(self.user)
                })
                .done(function (data) {
                    alert("ok");
                }).fail(function (data) {
                    alert("not ok");
                });
            }
        };
    }

    function TimeRecordsViewModel() {
        var self = this;
        self.records = ko.observableArray();

        $.get("http://localhost:4599/api/TimeRecords", {})
            .done(function (data) {
                for (var i = 0, len = data.length; i < len; ++i) {
                    self.records.push(data[i]);
                }
            }).fail(function (data) {
                alert("Error");
            });
        self.addRecord = function () {
            location.hash = "timeRecords/add";
        };
        self.editRecord = function () {
            location.hash = "timeRecords/edit/" + this.Id;
        };
        self.removeRecord = function () {
            if (confirm("Are you sure?")) {
                var removedItem = this;
                $.ajax({
                    url: "http://localhost:4599/api/TimeRecords/" + removedItem.Id,
                    type: "delete"
                }).done(function () {
                    self.records.remove(removedItem);
                    alert("ok");
                }).fail(function () {
                    alert("removing failed");
                });
            }
        };
    }

    app.get('/#timeRecords', function (context) {
        context.render('/Views/timeRecords.html', {}, function (output) {
            $('#wrapper').html(output);
            ko.applyBindings(new TimeRecordsViewModel(), document.getElementById("container"));
        });
    });

    app.get('/#users/options/:id', function (context) {
        var params = this.params;
        context.render('/Views/user.html', {}, function (output) {
            $('#wrapper').html(output);
            ko.applyBindings(new UserViewModel("options", params.id), document.getElementById("container"));
        });
    });

    app.get('/#users/add', function (context) {
        context.render('/Views/user.html', {}, function (output) {
            $('#wrapper').html(output);
            ko.applyBindings(new UserViewModel("add"), document.getElementById("container"));
        });
    });

    app.get('/#users/edit/:id', function (context) {
        var params = this.params;
        context.render('/Views/user.html', {}, function (output) {
            $('#wrapper').html(output);
            ko.applyBindings(new UserViewModel("edit", params.id), document.getElementById("container"));
        });
    });

})();
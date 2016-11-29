(function () {
    permissionLevel = {
        regular: "0",
        userManager: "1",
        administrator: "2"
    };

    authenticatedRequest = function (url, method, data, success, fail) {
        var token = localStorage.getItem("token");
        if (token !== null) {
            $.ajax({
                url: "http://localhost:4599/api/" + url,
                type: method,
                dataType: "jsonp",
                headers: { "Content-Type": "application/json", "Accept": "application/json", "Authorization": "OAuth oauth_token=ACCESSTOKEN" },
                contentType: "application/json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", token);
                },
                data: data
            }).always(function (data) {
                if (data !== undefined) {
                    if (data.status === 200 || data.status === 204 || data.status === 201) {
                        success(data.responseText);
                    } else {
                        fail(data.responseText);
                    }
                } else {
                    //special case
                    success();
                }
            });
        } else {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            location.hash = "auth";
        }

    };

    HomeViewModel = function () {
        var self = this;

        var role = localStorage.getItem("role");

        self.logout = function () {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            location.hash = "auth";
        };
        self.isMenuVisible = ko.observable(false);

        if (role !== null) {
            self.canSeeTimeRecords = ko.observable(role === permissionLevel.regular || role === permissionLevel.administrator);
            self.canSeeUsers = ko.observable(role === permissionLevel.userManager || role === permissionLevel.administrator);
            self.canSeeMyProfile = ko.observable(role === permissionLevel.regular);
            self.canSeeCalendar = ko.observable(role === permissionLevel.regular);
            self.isMenuVisible(true);
        } else {
            location.hash = "auth";
        }
    };
}());
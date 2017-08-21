(function () {
    'use strict';

    angular
        .module('app')
        .factory('dataservice', dataservice);

    function dataservice($http, $q) {
        return {
            loginIntoApp: loginIntoApp,
            register: register
        };

        function loginIntoApp(login, password) {
            return $http({
                method: 'POST',
                url: '/token',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: { username: login, password: password, grant_type: "password" }
            })
            .then(function (data) {
                localStorage.setItem("token", data.data.access_token);
            })
            .catch(function (data) {
                var errorDescription = data.data.error_description;
                toastr.error(errorDescription);
                return $q.reject();
            });
        }

        function register(login, password) {
            return $http({
                method: 'POST',
                url: '/api/Users',
                data: {
                    Login: login,
                    Password: password,
                    PermissionLevel: 0
                }
            })
            .then(function (data) {
                toastr.success("User created");
            })
            .catch(function (data) {
                var errorDescription = data.data.ModelState[""][0];
                toastr.error(errorDescription);
                return $q.reject();
            });
        }
    }
})();
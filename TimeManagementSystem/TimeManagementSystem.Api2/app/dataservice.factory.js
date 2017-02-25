(function () {
    'use strict';

    angular
        .module('app')
        .factory('dataservice', dataservice);

    function dataservice($http, $location) {
        return {
            loginIntoApp: loginIntoApp
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
                localStorage.setItem("token", "Bearer " + data.data.access_token);
                $location.path("/home");
            })
            .catch(function (data) {
                var errorDescription = data.data.error_description;
                toastr.error(errorDescription);
            });
        }
    }

})();
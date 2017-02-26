(function () {
    'use strict';

    angular
        .module('app')
        .factory('dataservice', dataservice);

    function dataservice($http, $state) {
        return {
            loginIntoApp: loginIntoApp,
            register: register,
            request: request
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
                $state.transitionTo('app.home');
            })
            .catch(function (data) {
                var errorDescription = data.data.error_description;
                toastr.error(errorDescription);
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
                $state.transitionTo('anonymous.login');
            })
            .catch(function (data) {
                var errorDescription = data.data.ModelState[""][0];
                toastr.error(errorDescription);
            });
        }

        function request(controller, method, data, onSuccess, onError) {
            var token = localStorage.getItem("token");
            if (token !== null) {
                return $http({
                    method: method,
                    url: '/api/' + controller,
                    data: data,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': token
                    },
                })
                .then(function (data) {
                    onSuccess(data);
                })
                .catch(function (data) {
                    onError(data);
                });
            } else {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                $state.transitionTo('anonymous.login');
            }
        }

        //function (url, method, data, success, fail) {
        //    var token = localStorage.getItem("token");
        //    if (token !== null) {
        //        $.ajax({
        //            url: "http://localhost:4599/api/" + url,
        //            type: method,
        //            dataType: "jsonp",
        //            headers: { "Content-Type": "application/json", "Accept": "application/json", "Authorization": "OAuth oauth_token=ACCESSTOKEN" },
        //            contentType: "application/json",
        //            beforeSend: function (xhr) {
        //                xhr.setRequestHeader("Authorization", token);
        //            },
        //            data: data
        //        }).always(function (data) {
        //            if (data !== undefined) {
        //                if (data.status === 200 || data.status === 204 || data.status === 201) {
        //                    success(data.responseText);
        //                } else {
        //                    fail(data.responseText);
        //                }
        //            } else {
        //                //special case
        //                success();
        //            }
        //        });
        //    } else {
        //        localStorage.removeItem("token");
        //        localStorage.removeItem("role");
        //        location.hash = "auth";
        //    }

        //};
    }

})();
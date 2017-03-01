(function () {
    'use strict';

    angular
        .module('app')
        .factory('dataservice', dataservice)
        .factory('authInterceptor', authInterceptor)
        .config(authConfig);

    function dataservice($http, $state, $q) {
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
                localStorage.setItem("token", data.data.access_token);
            })
            .catch(function (data) {
                var errorDescription = data.data.error_description;
                toastr.error(errorDescription);
                $q.reject();
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
                $q.reject();
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
    }


    function authInterceptor($q) {
        return {
            'request': function (config) {
                var token = localStorage.getItem("token");
                if (token === null) {
                    return config;
                }
                config.headers['Content-Type'] = 'application/json';
                config.headers['Accept'] = 'application/json';
                config.headers['Authorization'] = `Bearer ${token}`;
                return config;
            },
            'responseError': function (rejection) {
                switch (rejection.status) {
                    case 401:
                        alert("401");
                        break;
                    case 403:
                        alert("403");
                        break;
                }
                if (canRecover(rejection)) {
                    return responseOrNewPromise
                }
                return $q.reject(rejection);
            }
        }
    }

    function authConfig($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    }

})();
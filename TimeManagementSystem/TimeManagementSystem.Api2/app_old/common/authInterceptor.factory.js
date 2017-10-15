(function () {
    'use strict';

    angular
        .module('app')
        .factory('authInterceptor', authInterceptor)
        .config(authConfig);

    function authInterceptor($q, $injector) {
        return {
            'request': function (config) {
                var token = localStorage.getItem("token");
                if (token === null || config.url.indexOf('/api') !== 0) {
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
                        localStorage.removeItem("token");
                        localStorage.removeItem("role");
                        toastr.success("Please log in again");
                        $injector.get('$state').transitionTo('anonymous.login');
                        break;
                    case 403:
                        toastr.success("You have no access to this page");
                        $injector.get('$state').transitionTo('app.home');
                        break;
                }
                return $q.reject(rejection);
            }
        }
    }

    function authConfig($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    }

})();
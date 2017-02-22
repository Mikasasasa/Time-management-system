(function () {
    'use strict';

    angular.module('app', ['ngRoute']);

    angular.module('app').config(function ($routeProvider) {
        $routeProvider
        .when("/login", {
            templateUrl: "app/authorization/authorization.html",
            controller: "AuthorizationController"
        })
        .when("/home", {
            templateUrl: "app/home/home.html"
        })
        .otherwise({ redirectTo: "/login" });
    });

})();
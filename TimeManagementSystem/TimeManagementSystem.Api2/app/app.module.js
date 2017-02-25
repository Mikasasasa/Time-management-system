(function () {
    'use strict';

    angular.module('app', ['ui.router']);

    angular.module('app').config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
        .state("login", {
            url: "/login",
            templateUrl: "app/authorization/authorization.html",
            controller: "AuthorizationController"
        })
        .state("/home", {
            url: "/home",
            templateUrl: "app/home/home.html"
        });
        $urlRouterProvider.otherwise("/login");
    });

})();
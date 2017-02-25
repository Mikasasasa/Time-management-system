(function () {
    'use strict';

    angular.module('app', ['ui.router']);

    angular.module('app').config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
        .state('app', {
            abstract: true,
            url: '/',
            views: {
                header: {
                    template: 'header'
                },
                content: {},
                footer: {
                    template: 'footer'
                }
            }
        })
        .state("app.home", {
            url: "/home",
            views: {
                'content@': {
                    templateUrl: 'app/home/home.html'
                },
            }
        });
        $urlRouterProvider.otherwise("/login");
    });

})();
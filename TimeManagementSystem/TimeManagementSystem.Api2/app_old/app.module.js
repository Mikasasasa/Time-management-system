(function () {
    'use strict';

    angular.module('app', ['ui.router', 'ui.grid']);

    angular.module('app')
        .config(stateProviderConfig);

    function stateProviderConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                abstract: true,
                url: '/',
                views: {
                    header: {
                        templateUrl: 'app/components/app-header/header.html',
                        controller: 'HeaderController as vm'
                    },
                    content: {},
                    footer: {
                        template: ''
                    }
                }
            })
            .state('anonymous', {
                abstract: true,
                url: '/',
                views: {
                    header: {
                        templateUrl: 'app/components/anonymous-header/header.html'
                    },
                    content: {},
                    footer: {
                        template: ''
                    }
                }
            })
            .state("app.home", {
                url: "/",
                views: {
                    'content@': {
                        templateUrl: 'app/components/home/home.html'
                    }
                }
            });

        $urlRouterProvider.otherwise("/login");
    }

})();
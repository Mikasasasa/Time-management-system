(function () {
    'use strict';

    angular
        .module('app')
        .controller('TimeRecordController', TimeRecordController)
        .config(stateProviderConfig);

    function stateProviderConfig($stateProvider) {
        $stateProvider
            .state('app.time-records.add', {
                url: '/add',
                views: {
                    'content@': {
                        templateUrl: 'app/components/time-records/edit/time-record.html',
                        controller: 'TimeRecordController as vm'
                    }
                }
            })
            .state('app.time-records.edit', {
                url: '/edit/:id',
                views: {
                    'content@': {
                        templateUrl: 'app/components/time-records/edit/time-record.html',
                        controller: 'TimeRecordController as vm'
                    }
                }
            });
    }

    function TimeRecordController($http, $stateParams, $state) {
        var vm = this;

        vm.record = null;
        vm.saveMethod = null;
        vm.saveMethodName = "";
        vm.isAddingMode = true;
        vm.isAdministrator = localStorage.getItem("role") === "Administrator";

        setRecord();

        function setRecord() {
            var recordId = $stateParams.id;
            if (recordId !== undefined) {
                $http({
                    method: "GET",
                    url: '/api/TimeRecords',
                    params: { id: recordId }
                })
                    .then(function (data) {
                        vm.record = data.data;
                        vm.record.StartDate = new Date(data.data.StartDate);
                        vm.saveMethod = editRecord;
                        vm.isAddingMode = false;
                        vm.saveMethodName = "Edit";
                    });
            } else {
                vm.record = {
                    StartDate: null,
                    Note: null,
                    Length: 0
                };
                vm.saveMethod = addRecord;
                vm.saveMethodName = "Add";
            }
        }

        function addRecord() {
            $http({
                method: "POST",
                url: '/api/TimeRecords',
                data: vm.record
            })
                .then(function (data) {
                    toastr.success("Record added successfully.");
                    $state.transitionTo('app.time-records.list');
                });
        }

        function editRecord() {
            $http({
                method: "PUT",
                url: '/api/TimeRecords',
                params: { id: vm.record.Id },
                data: vm.record
            })
                .then(function (data) {
                    toastr.success("Record updated successfully.");
                    $state.transitionTo('app.time-records.list');
                });
        }
    }
})();
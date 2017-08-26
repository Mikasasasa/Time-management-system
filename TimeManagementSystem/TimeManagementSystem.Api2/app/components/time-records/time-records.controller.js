(function () {
    'use strict';

    angular
        .module('app')
        .controller('TimeRecordsController', TimeRecordsController)
        .config(stateProviderConfig);

    function stateProviderConfig($stateProvider) {
        $stateProvider
            .state('app.time-records', {
                abstract: true,
                url: 'time-records'
            })
            .state('app.time-records.list', {
                url: '',
                views: {
                    'content@': {
                        templateUrl: 'app/components/time-records/time-records.html',
                        controller: 'TimeRecordsController as vm'
                    }
                }
            });
    }

    function TimeRecordsController($http, $state) {
        var vm = this;

        vm.records = [];
        vm.addRecord = addRecord;
        vm.editRecord = editRecord;
        vm.removeRecord = removeRecord;

        fetchRecord();

        function fetchRecord() {
            $http({
                method: "GET",
                url: '/api/TimeRecords'
            })
                .then(function (data) {
                    fetchRecordSuccess(data);
                })
                .catch(function (data) {
                    fetchRecordError(data);
                });
        }

        function fetchRecordSuccess(data) {
            vm.records = data.data;
        }

        function fetchRecordError(data) {
            toastr.error("Unauthorized access.");
        }

        function addRecord() {
            $state.transitionTo('app.time-records.add');
        }

        function editRecord(id) {
            $state.transitionTo('app.time-records.edit', { id: id });
        }

        function removeRecord(record) {
            if (confirm("Are you sure?")) {
                $http({
                    method: "DELETE",
                    url: '/api/TimeRecords/' + record.Id
                })
                    .then(function (data) {
                        var index = vm.records.indexOf(record);
                        vm.records.splice(index, 1);
                        toastr.success("Record deleted successfully.");
                    })
                    .catch(function (data) {
                        toastr.error("Unautorized access.");
                    });
            }
        }
    }
})();
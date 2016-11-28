(function () {
    var app = Sammy.apps.body;

    function TimeRecordViewModel(action, id) {
        var self = this;
        self.record = ko.observable();
        self.date = ko.observable(null);

        if (action === "add") {
            self.record({
                StartDate: null,
                Note: null,
                Length: 0
            });
        } else {
            authenticatedRequest("TimeRecords", "get", { id: id }, function (data) {
                self.record(data);
                self.date(moment(data.StartDate).format('YYYY-MM-DD'));
            },
            function () {
                alert("not such record");
                location.hash = "timeRecords";
            });
        }

        self.saveRecord = function () {
            if (action === "add") {
                authenticatedRequest("TimeRecords", "post", ko.toJSON(self.record), function (data) {
                    alert("ok");
                    location.hash = "timeRecords/edit/" + data.Id;
                },
                function () {
                    alert("not ok");
                });
            } else {
                self.record().StartDate = self.date();
                authenticatedRequest("TimeRecords/" + self.record().Id, "put", ko.toJSON(self.record), function (data) {
                    alert("ok");
                },
                function () {
                    alert("not ok");
                });
            }
        };
    }

    function TimeRecordsViewModel() {
        var self = this;
        self.records = ko.observableArray();

        authenticatedRequest("TimeRecords", "get", {}, function (data) {
            for (var i = 0, len = data.length; i < len; ++i) {
                self.records.push(data[i]);
            }
        },
        function () {
            alert("Error");
        });

        self.addRecord = function () {
            location.hash = "timeRecords/add";
        };
        self.editRecord = function () {
            location.hash = "timeRecords/edit/" + this.Id;
        };
        self.removeRecord = function () {
            if (confirm("Are you sure?")) {
                var removedItem = this;
                authenticatedRequest("TimeRecords/" + removedItem.Id, "delete", {}, function (data) {
                    self.records.remove(removedItem);
                    alert("ok");
                },
                function () {
                    alert("removing failed");
                });
            }
        };
    }

    function TimeRecordsCalendarViewModel() {
        var self = this;
        self.records = ko.observableArray();
        self.PrefferedWorkingHours = ko.observable(0);

        self.filterFrom = ko.observable("");
        self.filterTo = ko.observable("");

        self.filteredRecords = ko.computed(function () {
            function isInFilter(element, index, array) {
                return (element.date >= self.filterFrom() || self.filterFrom() === "") && (element.date <= self.filterTo() || self.filterTo() === "");
            }
            return self.records().filter(isInFilter);
        });

        authenticatedRequest("Users", "get", {}, function (data) {
            self.PrefferedWorkingHours(data[0].PreferredWorkingHourPerDay);
            authenticatedRequest("TimeRecords", "get", {}, function (data) {
                var itemDate = null;
                var itemHours = 0;
                var itemNotes = [];
                for (var i = 0, len = data.length; i < len; ++i) {
                    var item = data[i];
                    if (itemDate === item.StartDate) {
                        itemHours += item.Length;
                        itemNotes.push(item.Note);
                    } else {
                        if (i > 0) {
                            self.records.push({
                                date: itemDate,
                                length: itemHours,
                                notes: itemNotes,
                                isValid: itemHours >= self.PrefferedWorkingHours()
                            });
                        }
                        itemDate = item.StartDate;
                        itemHours = item.Length;
                        itemNotes = [item.Note];
                    }
                }
                self.records.push({
                    date: itemDate,
                    length: itemHours,
                    notes: itemNotes,
                    isValid: itemHours >= self.PrefferedWorkingHours()
                });
            },
            function () {
                alert("Error");
            });
        },
        function () {
            alert("not such user");
            location.hash = "timeRecords";
        });
    }

    app.get('/#timeRecords', function (context) {
        context.render('/Views/timeRecords.html', {}, function (output) {
            $('#wrapper').html(output);
            ko.applyBindings(new TimeRecordsViewModel(), document.getElementById("container"));
        });
    });

    app.get('/#timeRecords/calendar', function (context) {
        context.render('/Views/timeRecordsCalendar.html', {}, function (output) {
            $('#wrapper').html(output);
            ko.applyBindings(new TimeRecordsCalendarViewModel(), document.getElementById("container"));
        });
    });

    app.get('/#timeRecords/edit/:id', function (context) {
        var params = this.params;
        context.render('/Views/timeRecord.html', {}, function (output) {
            $('#wrapper').html(output);
            ko.applyBindings(new TimeRecordViewModel("options", params.id), document.getElementById("container"));
        });
    });

    app.get('/#timeRecords/add', function (context) {
        context.render('/Views/timeRecord.html', {}, function (output) {
            $('#wrapper').html(output);
            ko.applyBindings(new TimeRecordViewModel("add"), document.getElementById("container"));
        });
    });

})();
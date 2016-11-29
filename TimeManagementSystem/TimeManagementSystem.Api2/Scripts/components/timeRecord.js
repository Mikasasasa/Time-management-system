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
                self.record(JSON.parse(data));
                self.date(moment(JSON.parse(data).StartDate).format('YYYY-MM-DD'));
            },
            function (data) {
                toastr.error("No such record");
                location.hash = "timeRecords";
            });
        }

        self.saveRecord = function () {
            if (!isNormalInteger(self.record().Length)) {
                toastr.error("Length is invalid");
                return;
            }
            if (action === "add") {
                authenticatedRequest("TimeRecords", "post", ko.toJSON(self.record), function (data) {
                    toastr.success("Record added successfully.");
                    location.hash = "timeRecords/edit/" + JSON.parse(data).Id;
                },
                function (data) {
                    toastr.error(JSON.parse(data).Message);
                });
            } else {
                self.record().StartDate = self.date();
                authenticatedRequest("TimeRecords/" + self.record().Id, "put", ko.toJSON(self.record), function (data) {
                    toastr.success("Record updated successfully.");
                },
                function (data) {
                    toastr.error(JSON.parse(data).Message);
                });
            }
        };
    }

    function TimeRecordsViewModel() {
        var self = this;
        self.records = ko.observableArray();

        authenticatedRequest("TimeRecords", "get", {}, function (data) {
            var responseArray = JSON.parse(data);
            for (var i = 0, len = responseArray.length; i < len; ++i) {
                self.records.push(responseArray[i]);
            }
        },
        function (data) {
            toastr.error("Some error occured");
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
                    toastr.success("Record deleted successfully");
                },
                function () {
                    toastr.error("removing failed");
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

        self.generateExportContent = function () {
            var doc = document.implementation.createHTMLDocument("Time records");

            var records = self.filteredRecords();

            var ul = doc.createElement("ul");
            for (var i = 0; i < records.length; ++i) {
                var dateLi = doc.createElement("li");
                dateLi.innerHTML = "Date: " + moment(records[i].date).format('DD.M');
                ul.appendChild(dateLi);
                var lenghtLi = doc.createElement("li");
                lenghtLi.innerHTML = "Total time: " + records[i].length + "h";
                ul.appendChild(lenghtLi);
                var notesLi = doc.createElement("li");
                notesLi.innerHTML = "Notes: ";
                ul.appendChild(notesLi);
                var notesUl = doc.createElement("ul");
                for (var j = 0; j < records[i].notes.length; ++j) {
                    var noteLi = doc.createElement("li");
                    noteLi.innerHTML = records[i].notes[j];
                    notesUl.appendChild(noteLi);
                }
                ul.appendChild(notesUl);
            }

            doc.body.appendChild(ul);

            window.open("data:application/octet-stream;filename=records.html;charset=utf-8;base64," + encodeURI(window.btoa(doc.documentElement.outerHTML)), '_blank');
        };

        authenticatedRequest("Users", "get", {}, function (data) {
            self.PrefferedWorkingHours(JSON.parse(data)[0].PreferredWorkingHourPerDay);
            authenticatedRequest("TimeRecords", "get", {}, function (data) {
                var itemDate = null;
                var itemHours = 0;
                var itemNotes = [];
                var responseArray = JSON.parse(data);
                for (var i = 0, len = responseArray.length; i < len; ++i) {
                    var item = responseArray[i];
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
                toastr.error("Some error occured");
            });
        },
        function () {
            toastr.error("Some error occured");
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
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var data_service_1 = require("../../services/data.service");
var global_1 = require("../../shared/global");
var router_1 = require("@angular/router");
var ng2_toastr_1 = require("ng2-toastr/ng2-toastr");
var UsersComponent = /** @class */ (function () {
    function UsersComponent(_dataService, _router, _toastr) {
        this._dataService = _dataService;
        this._router = _router;
        this._toastr = _toastr;
        this.columns = [
            {
                display: 'Login',
                variable: 'Login',
                filter: 'text'
            },
            {
                display: 'Permission level',
                variable: 'PermissionLevel',
                filter: 'text'
            },
            {
                display: 'Preferred working hour per day',
                variable: 'PreferredWorkingHourPerDay',
                filter: 'text'
            }
        ];
    }
    UsersComponent.prototype.ngOnInit = function () {
        this._loadUsers();
    };
    UsersComponent.prototype._loadUsers = function () {
        var _this = this;
        this._dataService.get(global_1.Global.BASE_USER_ENDPOINT)
            .subscribe(function (users) {
            _this.users = users;
        });
    };
    UsersComponent.prototype.addUser = function () {
        this._router.navigate(['users/add']);
    };
    UsersComponent.prototype.editUser = function (user) {
        this._router.navigate(['users/edit', { login: user.Login }]);
    };
    UsersComponent.prototype.deleteUser = function (user) {
        var _this = this;
        if (confirm("Are you sure?")) {
            this._dataService.delete(global_1.Global.BASE_USER_ENDPOINT, user.Id).subscribe(function () {
                var index = _this.users.indexOf(user);
                _this.users.splice(index, 1);
                _this._toastr.success("User deleted successfully.");
            });
        }
    };
    UsersComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/components/users/users.component.html'
        }),
        __metadata("design:paramtypes", [data_service_1.DataService, router_1.Router, ng2_toastr_1.ToastsManager])
    ], UsersComponent);
    return UsersComponent;
}());
exports.UsersComponent = UsersComponent;
//# sourceMappingURL=users.component.js.map
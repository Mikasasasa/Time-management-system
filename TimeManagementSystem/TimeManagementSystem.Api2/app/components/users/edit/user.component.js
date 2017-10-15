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
var data_service_1 = require("../../../services/data.service");
var forms_1 = require("@angular/forms");
var enum_1 = require("../../../shared/enum");
var global_1 = require("../../../shared/global");
var router_1 = require("@angular/router");
var ng2_toastr_1 = require("ng2-toastr/ng2-toastr");
var UserComponent = (function () {
    function UserComponent(_dataService, _router, _toastr, _route, _formBuilder) {
        this._dataService = _dataService;
        this._router = _router;
        this._toastr = _toastr;
        this._route = _route;
        this._formBuilder = _formBuilder;
        this.role = +localStorage.getItem("role");
        this.isAdministrator = this.role === enum_1.PermissionLevel.administrator;
        this.permissionLevels = enum_1.PermissionLevel;
        this.permissionLevelKeys = Object.keys(enum_1.PermissionLevel).filter(Number);
        this.isAddingMode = true;
        this.saveMethod = null;
        this.saveMethodName = null;
        this.message = null;
    }
    UserComponent.prototype.ngOnInit = function () {
        this.userForm = this._formBuilder.group({
            Login: ['', forms_1.Validators.required],
            Password: [''],
            OldPassword: [''],
            PasswordRepeat: [''],
            PermissionLevel: [enum_1.PermissionLevel.regular],
            PreferredWorkingHourPerDay: [null]
        }, { validator: this.passwordsValidator });
        this._setUser();
    };
    UserComponent.prototype._setUser = function () {
        var _this = this;
        var userLogin = null;
        this._route.paramMap.subscribe(function (params) {
            userLogin = params.get('login');
        });
        if (userLogin !== undefined) {
            var params = new URLSearchParams();
            params.append('userName', userLogin);
            this._dataService.get(global_1.Global.BASE_USER_ENDPOINT, params).subscribe(function (user) {
                _this.user = user;
                //setPermissionLevel?
                _this.saveMethod = _this.editUser;
                _this.saveMethodName = 'Edit';
                _this.isAddingMode = false;
            });
        }
        else {
            this.user = {
                Id: null,
                Login: null,
                Password: null,
                PermissionLevel: 0,
                PreferredWorkingHourPerDay: null
            };
            this.saveMethod = this.addUser;
            this.saveMethodName = 'Add';
        }
    };
    UserComponent.prototype.editUser = function (formData) {
        //vm.user.PermissionLevel = vm.selectedPermissionLevel.value;
        //@todo: check if passwords are the same
        var _this = this;
        this._dataService.put(global_1.Global.BASE_USER_ENDPOINT, formData._value.Id, formData._value).subscribe(function () {
            _this._toastr.success('User updated successfully.');
            _this._router.navigate(['users/list']);
        });
    };
    UserComponent.prototype.addUser = function (formData) {
        //vm.user.PermissionLevel = vm.selectedPermissionLevel.value;
        var _this = this;
        this._dataService.post(global_1.Global.BASE_USER_ENDPOINT, formData._value).subscribe(function () {
            _this._toastr.success('User added successfully.');
            _this._router.navigate(['users/list']);
        });
    };
    UserComponent.prototype.passwordsValidator = function () {
        return function (group) {
            var password = group.controls['Password'];
            var confirmPassword = group.controls['PasswordRepeat'];
            if (password.value !== confirmPassword.value) {
                return {
                    mismatchedPasswords: true
                };
            }
        };
    };
    return UserComponent;
}());
UserComponent = __decorate([
    core_1.Component({
        templateUrl: 'app/components/users/edit/user.component.html'
    }),
    __metadata("design:paramtypes", [data_service_1.DataService,
        router_1.Router,
        ng2_toastr_1.ToastsManager,
        router_1.ActivatedRoute,
        forms_1.FormBuilder])
], UserComponent);
exports.UserComponent = UserComponent;
//# sourceMappingURL=user.component.js.map
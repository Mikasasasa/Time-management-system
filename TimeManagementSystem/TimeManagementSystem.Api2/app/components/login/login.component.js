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
var router_1 = require("@angular/router");
var LoginComponent = /** @class */ (function () {
    function LoginComponent(_dataService, _router) {
        this._dataService = _dataService;
        this._router = _router;
        this.login = '';
        this.password = '';
    }
    LoginComponent.prototype.logIntoApp = function () {
        var _this = this;
        this._dataService.loginIntoApp(this.login, this.password).subscribe(function (data) {
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("user", _this.login);
            _this._dataService.get('/api/Roles').subscribe(function (role) {
                localStorage.setItem("role", role);
                _this._router.navigate(['dashboard']);
            });
        });
    };
    LoginComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/components/login/login.component.html'
        }),
        __metadata("design:paramtypes", [data_service_1.DataService, router_1.Router])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map
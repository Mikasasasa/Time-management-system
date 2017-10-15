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
var ng2_toastr_1 = require("ng2-toastr/ng2-toastr");
var router_1 = require("@angular/router");
var enum_1 = require("./shared/enum");
var AppComponent = /** @class */ (function () {
    function AppComponent(toastr, vRef, _router) {
        this.toastr = toastr;
        this._router = _router;
        this.role = +localStorage.getItem("role");
        this.isAnonymous = this.role === null;
        this.isAdministrator = this.role === enum_1.PermissionLevel.administrator;
        this.isUserManager = this.role === enum_1.PermissionLevel.userManager;
        this.isRegular = this.role === enum_1.PermissionLevel.regular;
        this.user = localStorage.getItem("user");
        this.toastr.setRootViewContainerRef(vRef);
    }
    AppComponent.prototype.logOut = function () {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        this._router.navigate(['login']);
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: "tms-app",
            templateUrl: "app/app.component.html"
        }),
        __metadata("design:paramtypes", [ng2_toastr_1.ToastsManager, core_1.ViewContainerRef, router_1.Router])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map
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
var http_1 = require("@angular/http");
var Observable_1 = require("rxjs/Observable");
var router_1 = require("@angular/router");
var ng2_toastr_1 = require("ng2-toastr/ng2-toastr");
require("rxjs/add/operator/map");
require("rxjs/add/operator/do");
require("rxjs/add/operator/catch");
var DataService = /** @class */ (function () {
    function DataService(_http, _router, _toastr) {
        this._http = _http;
        this._router = _router;
        this._toastr = _toastr;
    }
    DataService.prototype.loginIntoApp = function (login, password) {
        var urlSearchParams = new URLSearchParams();
        urlSearchParams.append('username', login);
        urlSearchParams.append('password', password);
        urlSearchParams.append('grant_type', "password");
        var body = urlSearchParams.toString();
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this._http.post('/token', body, options)
            .map(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    DataService.prototype.get = function (url, params) {
        if (params === void 0) { params = null; }
        return this._http.get(url, new http_1.RequestOptions({ headers: this.prepareHeaders(), params: params }))
            .map(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    DataService.prototype.post = function (url, model) {
        var body = JSON.stringify(model);
        var options = new http_1.RequestOptions({ headers: this.prepareHeaders() });
        return this._http.post(url, body, options)
            .map(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    DataService.prototype.put = function (url, id, model) {
        var body = JSON.stringify(model);
        var options = new http_1.RequestOptions({ headers: this.prepareHeaders() });
        return this._http.put(url + id, body, options)
            .map(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    DataService.prototype.delete = function (url, id) {
        var options = new http_1.RequestOptions({ headers: this.prepareHeaders() });
        return this._http.delete(url + id, options)
            .map(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    DataService.prototype.handleError = function (error) {
        this._toastr.info(error.json().error || 'Server error');
        switch (error.status) {
            case 401:
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                this._router.navigateByUrl('/login');
                break;
            case 403:
                this._router.navigateByUrl('/dashboard');
                break;
        }
        return Observable_1.Observable.throw(error.json().error || 'Server error');
    };
    DataService.prototype.prepareHeaders = function () {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
        var token = localStorage.getItem("token");
        if (token !== null) {
            headers.append('Authorization', "Bearer " + token);
        }
        return headers;
    };
    DataService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, router_1.Router, ng2_toastr_1.ToastsManager])
    ], DataService);
    return DataService;
}());
exports.DataService = DataService;
//function loginIntoApp(login, password) {
//           return $http({
//               method: 'POST',
//               url: '/token',
//               headers: {
//                   'Content-Type': 'application/x-www-form-urlencoded'
//               },
//               transformRequest: function (obj) {
//                   var str = [];
//                   for (var p in obj)
//                       str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
//                   return str.join("&");
//               },
//               data: { username: login, password: password, grant_type: "password" }
//           })
//           .then(function (data) {
//               localStorage.setItem("token", data.data.access_token);
//               localStorage.setItem("user", login);
//           })
//           .catch(function (data) {
//               var errorDescription = data.data.error_description;
//               toastr.error(errorDescription);
//               return $q.reject();
//           });
//       } 
//# sourceMappingURL=data.service.js.map
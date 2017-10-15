import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Injectable()
export class DataService {
    constructor(private _http: Http, private _router: Router, private _toastr: ToastsManager) { }

    loginIntoApp(login: string, password: string): Observable<any> {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('username', login);
        urlSearchParams.append('password', password);
        urlSearchParams.append('grant_type', "password");

        let body = urlSearchParams.toString();
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options = new RequestOptions({ headers: headers });
        return this._http.post('/token', body, options)
            .map((response: Response) => <any>response.json())
            .catch(this.handleError);
    }

    get(url: string, params: URLSearchParams = null): Observable<any> {
        return this._http.get(url, new RequestOptions({ headers: this.prepareHeaders(), params: params }))
            .map((response: Response) => <any>response.json())
            .catch(this.handleError);
    }

    post(url: string, model: any): Observable<any> {
        let body = JSON.stringify(model);
        let options = new RequestOptions({ headers: this.prepareHeaders() });
        return this._http.post(url, body, options)
            .map((response: Response) => <any>response.json())
            .catch(this.handleError);
    }

    put(url: string, id: number, model: any): Observable<any> {
        let body = JSON.stringify(model);
        let options = new RequestOptions({ headers: this.prepareHeaders() });
        return this._http.put(url + id, body, options)
            .map((response: Response) => <any>response.json())
            .catch(this.handleError);
    }

    delete(url: string, id: number): Observable<any> {
        let options = new RequestOptions({ headers: this.prepareHeaders() });
        return this._http.delete(url + id, options)
            .map((response: Response) => <any>response.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
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
        return Observable.throw(error.json().error || 'Server error');
    }

    private prepareHeaders(): Headers {
        var headers = new Headers({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
        var token = localStorage.getItem("token");
        if (token !== null) {
            headers.append('Authorization', `Bearer ${token}`);
        }
        return headers;
    }

}

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
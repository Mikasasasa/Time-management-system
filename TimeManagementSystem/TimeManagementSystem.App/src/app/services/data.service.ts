import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Global } from '../shared/global';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class DataService {

    constructor(private _router: Router, private _toastr: ToastsManager, private _httpClient: HttpClient) { }

    loginIntoApp(login: string, password: string): Observable<any> {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('username', login);
        urlSearchParams.append('password', password);
        urlSearchParams.append('grant_type', "password");

        let body = urlSearchParams.toString();
        let headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options = { headers: headers };
        return this._httpClient.post(Global.API_ENDPOINT + '/token', body, options)
            .map((response: Response) => <any>response)
            .catch(this.handleError);
    }

    get(url: string, params: HttpParams = null): Observable<any> {
        return this._httpClient.get(Global.API_ENDPOINT + url, { headers: this.prepareHeaders(), params: params })
            .catch(this.handleError);
    }

    post(url: string, model: any): Observable<any> {
        let body = JSON.stringify(model);
        return this._httpClient.post(Global.API_ENDPOINT + url, body, { headers: this.prepareHeaders() })
            .catch(this.handleError);
    }

    put(url: string, id: number, model: any): Observable<any> {
        let body = JSON.stringify(model);
        return this._httpClient.put(Global.API_ENDPOINT + url + '/' + id, body, { headers: this.prepareHeaders(), responseType: 'text' })
            .catch(this.handleError);
    }

    delete(url: string, id: number): Observable<any> {
        return this._httpClient.delete(Global.API_ENDPOINT + url + '/' + id, { headers: this.prepareHeaders() })
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        this._toastr.info(error.json().ModelState[""][0] || 'Server error');
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

    private prepareHeaders(): HttpHeaders {
        var headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
        var token = localStorage.getItem("token");
        if (token !== null) {
            headers = headers.append('Authorization', `Bearer ${token}`);
        }
        return headers;
    }

}

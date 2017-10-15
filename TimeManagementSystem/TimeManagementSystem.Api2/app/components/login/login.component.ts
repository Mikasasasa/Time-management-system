import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

@Component({
    templateUrl: 'app/components/login/login.component.html'
})

export class LoginComponent {
    login: string = '';
    password: string = '';

    constructor(private _dataService: DataService, private _router: Router) { }

    logIntoApp(): void {
        this._dataService.loginIntoApp(this.login, this.password).subscribe(data => {
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("user", this.login);
            this._dataService.get('/api/Roles').subscribe(role => {
                localStorage.setItem("role", role);
                this._router.navigate(['dashboard']);
            })
        }, )
    }
}
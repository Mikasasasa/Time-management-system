import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    login: string = '';
    password: string = '';

    constructor(private _dataService: DataService, private _router: Router) { }

    ngOnInit() {
    }

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

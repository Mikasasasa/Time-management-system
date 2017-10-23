import { Component, OnInit } from '@angular/core';
import { Global } from '../../shared/global';
import { DataService } from '../../services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUser } from '../../models/user';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
    ngOnInit(): void {
        this._loadUsers();
    }

    constructor(private _dataService: DataService, private _router: Router, private _toastr: ToastsManager) { }

    columns: any[] = [
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

    private _loadUsers(): void {
        this._dataService.get(Global.BASE_USER_ENDPOINT)
            .subscribe(users => {
                this.users = users;
            })
    }

    addUser(): void {
        this._router.navigate(['users/add']);
    }

    editUser(user: IUser): void {
        this._router.navigate(['users/edit', user.Login]);
    }


    deleteUser(user: IUser): void {
        if (confirm("Are you sure?")) {
            this._dataService.delete(Global.BASE_USER_ENDPOINT, user.Id).subscribe(() => {
                var index = this.users.indexOf(user);
                this.users.splice(index, 1);
                this._toastr.success("User deleted successfully.");
            });
        }
    }

    users: IUser[];
}

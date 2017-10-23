import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { IUser } from '../../../models/user';
import { PermissionLevel } from '../../../shared/enum';
import { Observable } from 'rxjs/Rx';
import { Global } from '../../../shared/global';
import { HttpParams } from '@angular/common/http';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
    ngOnInit(): void {
        this._route.paramMap.subscribe((params: Params) => {
            this.userLogin = params.get('login');
        });
        if (this.userLogin !== null && this.userLogin !== undefined) {
            this.isEditingMode = true;
        }

        let groupValidators = [this.passwordsValidator];
        let passwordValidators = [];
        if (this.isEditingMode) {
            groupValidators.push(this.oldPasswordValidator);
        } else {
            passwordValidators.push(Validators.required);
        }

        this.permissionLevelKeys = Object.keys(PermissionLevel).filter(f => !isNaN(Number(f))).map(Number);

        this.userForm = this._formBuilder.group({
            Id: [null],
            Login: ['', Validators.required],
            Password: ['', Validators.compose(passwordValidators)],
            OldPassword: [''],
            PasswordRepeat: [''],
            PermissionLevel: [this.permissionLevelKeys[0]],
            PreferredWorkingHourPerDay: [null]
        }, { validator: Validators.compose(groupValidators) });

        this._setUser();
    }

    role: PermissionLevel = +localStorage.getItem("role");

    isAdministrator: boolean = this.role === PermissionLevel.administrator;

    permissionLevels: any = PermissionLevel;
    permissionLevelKeys: number[];

    isEditingMode: boolean = false;
    userLogin: string;
    saveMethod: any = null;
    saveMethodName: string = null;
    userForm: FormGroup;
    message: string = null;

    constructor(
        private _dataService: DataService,
        private _router: Router,
        private _toastr: ToastsManager,
        private _route: ActivatedRoute,
        private _formBuilder: FormBuilder
    ) { }

    private _setUser(): void {
        var userLogin = null;
        this._route.paramMap.subscribe((params: Params) => {
            userLogin = params.get('login');
        });
        if (this.userLogin !== null && this.userLogin !== undefined) {
            let getParams = new HttpParams();
            getParams = getParams.set('userName', this.userLogin);

            this._dataService.get(Global.BASE_USER_ENDPOINT, getParams).subscribe(user => {
                this.userForm.patchValue(user);
                this.saveMethod = this.editUser;
                this.saveMethodName = 'Edit';
            });
        } else {
            this.saveMethod = this.addUser;
            this.saveMethodName = 'Add';
        }
    }

    editUser(formData: any): void {
        this._dataService.put(Global.BASE_USER_ENDPOINT, formData._value.Id, formData._value).subscribe(() => {
            this._toastr.success('User updated successfully.');
            this._router.navigate(['users/list']);
        });
    }

    addUser(formData: any): void {
        this._dataService.post(Global.BASE_USER_ENDPOINT, formData._value).subscribe(() => {
            this._toastr.success('User added successfully.');
            this._router.navigate(['users/list']);
        });
    }

    passwordsValidator(group: FormGroup): { [key: string]: any } {
        let password = group.controls['Password'].value;
        let confirmPassword = group.controls['PasswordRepeat'].value;

        if (password !== confirmPassword && !(!password && !confirmPassword)) {
            return {
                passwordsValidator: true
            };
        }
    }

    oldPasswordValidator(group: FormGroup): { [key: string]: any } {
        let password = group.controls['Password'].value;

        if (password) {
            let oldPassword = group.controls['OldPassword'].value;

            if (oldPassword === null) {
                return {
                    oldPasswordValidator: true
                };
            }
        }
    }
}

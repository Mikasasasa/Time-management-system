import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUser } from '../../../models/user';
import { DBOperation, PermissionLevel } from '../../../shared/enum';
import { Observable } from 'rxjs/Rx';
import { Global } from '../../../shared/global';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
    templateUrl: 'app/components/users/edit/user.component.html'
})

export class UserComponent implements OnInit {
    ngOnInit(): void {
        this.userForm = this._formBuilder.group({
            Login: ['', Validators.required],
            Password: [''],
            OldPassword: [''],
            PasswordRepeat: [''],
            PermissionLevel: [PermissionLevel.regular],
            PreferredWorkingHourPerDay: [null]
        }, { validator: this.passwordsValidator });

        this._setUser();
    }

    role: PermissionLevel = +localStorage.getItem("role");
    
    isAdministrator: boolean = this.role === PermissionLevel.administrator;

    permissionLevels: any = PermissionLevel;
    permissionLevelKeys: string[] = Object.keys(PermissionLevel).filter(Number);

    isAddingMode: boolean = true;
    user: IUser;
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
        if (userLogin !== undefined) {
            var params = new URLSearchParams();
            params.append('userName', userLogin);

            this._dataService.get(Global.BASE_USER_ENDPOINT, params).subscribe(user => {
                this.user = user;
                //setPermissionLevel?
                this.saveMethod = this.editUser;
                this.saveMethodName = 'Edit';
                this.isAddingMode = false;
            });
        } else {
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
    }

    editUser(formData: any): void {
        //vm.user.PermissionLevel = vm.selectedPermissionLevel.value;
        //@todo: check if passwords are the same

        this._dataService.put(Global.BASE_USER_ENDPOINT, formData._value.Id, formData._value).subscribe(() => {
            this._toastr.success('User updated successfully.');
            this._router.navigate(['users/list']);
        });
    }

    addUser(formData: any): void {
        //vm.user.PermissionLevel = vm.selectedPermissionLevel.value;

        this._dataService.post(Global.BASE_USER_ENDPOINT, formData._value).subscribe(() => {
            this._toastr.success('User added successfully.');
            this._router.navigate(['users/list']);
        });
    }

    passwordsValidator() {
        return (group: FormGroup): { [key: string]: any } => {
            let password = group.controls['Password'];
            let confirmPassword = group.controls['PasswordRepeat'];

            if (password.value !== confirmPassword.value) {
                return {
                    mismatchedPasswords: true
                };
            }
        }
    } 
}
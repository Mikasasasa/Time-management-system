import { Component, ViewContainerRef  } from "@angular/core";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router } from '@angular/router';
import { PermissionLevel } from './shared/enum';

@Component({
    selector: "tms-app",
    templateUrl: "app/app.component.html"
})

export class AppComponent {
    constructor(public toastr: ToastsManager, vRef: ViewContainerRef, private _router: Router) {
        this.toastr.setRootViewContainerRef(vRef);
    }

    role: PermissionLevel = +localStorage.getItem("role");

    isAnonymous: boolean = this.role === null;
    isAdministrator: boolean = this.role === PermissionLevel.administrator;
    isUserManager: boolean = this.role === PermissionLevel.userManager;
    isRegular: boolean = this.role === PermissionLevel.regular;
    user = localStorage.getItem("user");

    logOut(): void {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        this._router.navigate(['login']);
    }
}
import { ModuleWithProviders  } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './components/users/users.component';
import { LoginComponent } from './components/login/login.component';
import { UserComponent } from './components/users/edit/user.component';

const appRoutes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: LoginComponent },
    { path: 'users', redirectTo: 'users/list', pathMatch: 'full' },
    { path: 'users/list', component: UsersComponent },
    { path: 'users/edit/:login', component: UserComponent },
    { path: 'users/add', component: UserComponent },
    { path: 'time-records', redirectTo: 'time-records/list', pathMatch: 'full' },
    { path: 'time-records/list', component: LoginComponent },
    { path: 'time-records/edit', component: LoginComponent },
    { path: 'time-records/add', component: LoginComponent },
    { path: 'dashboard', redirectTo: 'users/list', pathMatch: 'full' }
];

export const routing: ModuleWithProviders =
    RouterModule.forRoot(appRoutes, { useHash: true });
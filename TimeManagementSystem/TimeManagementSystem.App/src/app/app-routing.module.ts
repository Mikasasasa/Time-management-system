import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { UsersComponent } from './components/users/users.component';
import { UserComponent } from './components/users/user/user.component';

const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: LoginComponent },
    { path: 'users', redirectTo: 'users/list', pathMatch: 'full' },
    { path: 'users/list', component: UsersComponent },
    { path: 'users/edit/:login', component: UserComponent },
    { path: 'users/add', component: UserComponent },
    { path: 'dashboard', redirectTo: 'users/list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

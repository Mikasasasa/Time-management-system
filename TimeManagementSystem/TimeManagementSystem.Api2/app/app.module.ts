import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { DataService } from './services/data.service'

import { UsersComponent } from './components/users/users.component';
import { LoginComponent } from './components/login/login.component';
import { UserComponent } from './components/users/edit/user.component';
import { AppComponent } from './app.component';
import { routing } from './app.routing';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        routing,
        ToastModule.forRoot()
    ],
    declarations: [
        AppComponent,
        UsersComponent,
        LoginComponent,
        UserComponent
    ],
    providers: [DataService],
    bootstrap: [AppComponent]
})

export class AppModule { }
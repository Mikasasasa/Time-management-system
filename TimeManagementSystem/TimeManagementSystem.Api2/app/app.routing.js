"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var users_component_1 = require("./components/users/users.component");
var login_component_1 = require("./components/login/login.component");
var user_component_1 = require("./components/users/edit/user.component");
var appRoutes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: login_component_1.LoginComponent },
    { path: 'register', component: login_component_1.LoginComponent },
    { path: 'users', redirectTo: 'users/list', pathMatch: 'full' },
    { path: 'users/list', component: users_component_1.UsersComponent },
    { path: 'users/edit/:login', component: user_component_1.UserComponent },
    { path: 'users/add', component: user_component_1.UserComponent },
    { path: 'time-records', redirectTo: 'time-records/list', pathMatch: 'full' },
    { path: 'time-records/list', component: login_component_1.LoginComponent },
    { path: 'time-records/edit', component: login_component_1.LoginComponent },
    { path: 'time-records/add', component: login_component_1.LoginComponent },
    { path: 'dashboard', redirectTo: 'users/list', pathMatch: 'full' }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes, { useHash: true });
//# sourceMappingURL=app.routing.js.map
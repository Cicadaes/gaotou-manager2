import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginGuard} from './common/guard/login.guard';
import {UserService} from './common/services/user.service';
// import {LoginRemindComponent} from './login-remind/login-remind.component';
const appRoutes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', loadChildren: 'app/login/login.module#LoginModule'},
  {
    path: 'home',
    loadChildren: 'app/home/home.module#HomeModule',
    canActivate: [LoginGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: [UserService]
})
export class AppRouterModule {}

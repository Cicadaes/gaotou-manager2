import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LimitMenuComponent} from './limit-menu/limit-menu.component';
import {LimitButtonComponent} from './limit-button/limit-button.component';
import {LimitRouterComponent} from './limit-router/limit-router.component';
import {LimitRoleComponent} from './limit-role/limit-role.component';
const mainRoutes: Routes = [
  {path: 'role', component: LimitRoleComponent},
  // {path: 'menu', component: LimitMenuComponent},
  // {path: 'button', component: LimitButtonComponent},
  {path: 'route', component: LimitRouterComponent},
];

@NgModule({
  imports: [RouterModule.forChild(mainRoutes)],
  exports: [RouterModule],
  providers: []
})
export class LimitRoutersModule {}

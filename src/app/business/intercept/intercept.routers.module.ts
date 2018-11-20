import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {InterceptComponent} from './intercept.component';
const mainRoutes: Routes = [
  {path: '', component: InterceptComponent},
];

@NgModule({
  imports: [RouterModule.forChild(mainRoutes)],
  exports: [RouterModule],
  providers: []
})
export class InterceptRoutersModule {}

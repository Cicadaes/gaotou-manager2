import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {VideomComponent} from './videom.component';
const mainRoutes: Routes = [
  {path: '', component: VideomComponent},
];

@NgModule({
  imports: [RouterModule.forChild(mainRoutes)],
  exports: [RouterModule],
  providers: []
})
export class VideomRoutersModule {}

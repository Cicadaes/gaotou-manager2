import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ApplyComponent} from './apply.component';
const mainRoutes: Routes = [
  {path: '', component: ApplyComponent},
];

@NgModule({
  imports: [RouterModule.forChild(mainRoutes)],
  exports: [RouterModule],
  providers: []
})
export class ApplyRoutersModule {}

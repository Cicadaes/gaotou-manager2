import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AreaComponent} from './area.component';
const mainRoutes: Routes = [
  {path: '', component: AreaComponent},
];

@NgModule({
  imports: [RouterModule.forChild(mainRoutes)],
  exports: [RouterModule],
  providers: []
})
export class AreaRoutersModule {}

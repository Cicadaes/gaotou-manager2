import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {WifiComponent} from './wifi.component';
const mainRoutes: Routes = [
  {path: '', component: WifiComponent},
];

@NgModule({
  imports: [RouterModule.forChild(mainRoutes)],
  exports: [RouterModule],
  providers: []
})
export class WifiRoutersModule {}

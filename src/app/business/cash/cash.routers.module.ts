import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CashComponent} from './cash.component';
const mainRoutes: Routes = [
  {path: '', component: CashComponent},
];

@NgModule({
  imports: [RouterModule.forChild(mainRoutes)],
  exports: [RouterModule],
  providers: []
})
export class CashRoutersModule {}

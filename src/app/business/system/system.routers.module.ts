import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EventTypeComponent} from './event-type/event-type.component';
const mainRoutes: Routes = [
  {path: 'eventtype', component: EventTypeComponent},
];

@NgModule({
  imports: [RouterModule.forChild(mainRoutes)],
  exports: [RouterModule],
  providers: []
})
export class SystemRoutersModule {}

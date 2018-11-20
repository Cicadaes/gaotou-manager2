import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {VideoGroupComponent} from './video-group.component';
const mainRoutes: Routes = [
  {path: '', component: VideoGroupComponent},
];

@NgModule({
  imports: [RouterModule.forChild(mainRoutes)],
  exports: [RouterModule],
  providers: []
})
export class VideoGroupRoutersModule {}

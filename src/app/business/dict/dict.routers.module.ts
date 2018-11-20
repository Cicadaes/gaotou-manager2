import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DictListComponent} from './dict-list/dict-list.component';
import {DictWordComponent} from './dict-word/dict-word.component';
const mainRoutes: Routes = [
  {path: '', component: DictListComponent},
  {path: 'word', component: DictWordComponent},
];

@NgModule({
  imports: [RouterModule.forChild(mainRoutes)],
  exports: [RouterModule],
  providers: []
})
export class DictRoutersModule {}

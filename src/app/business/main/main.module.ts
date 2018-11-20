import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MainComponent} from './main.component';
import {MainRoutersModule} from './main.routers.module';
import {SharedModule} from '../../common/shared.module';


@NgModule({
  imports: [
    CommonModule,
    MainRoutersModule,
    SharedModule
  ],
  declarations: [
    MainComponent,
  ],
  providers: [],
})
export class MainModule { }

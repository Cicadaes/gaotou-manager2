import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoginRoutersModule} from './login.routers.module';
import {LoginComponent} from './login.component';
import {CustomFormsModule} from 'ng4-validators';
import {LocalStorageService} from '../common/services/local-storage.service';
import {LoginService} from '../common/services/login.service';
import {LoginGuard} from '../common/guard/login.guard';
import {GlobalService} from '../common/services/global.service';
// import {LoginRemindComponent} from '../login-remind/login-remind.component';

@NgModule({
  imports: [
    CommonModule,
    LoginRoutersModule,
    FormsModule,
    ReactiveFormsModule,
    CustomFormsModule
  ],
  declarations: [
    LoginComponent
  ],
  providers: [ LocalStorageService,LoginService ],
  bootstrap: []
})
export class LoginModule {}

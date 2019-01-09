import {BrowserModule } from '@angular/platform-browser';
import {NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRouterModule} from './app.router.module';
import {AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {GlobalService} from './common/services/global.service';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {ProgressSpinnerModule} from 'primeng/primeng';
import {LocalStorageService} from './common/services/local-storage.service';
import {LoginComponent} from './login/login.component';
import {LoginGuard} from './common/guard/login.guard';
// import {LoginRemindComponent} from './login-remind/login-remind.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRouterModule,
    HttpClientModule,
    ProgressSpinnerModule
  ],
  declarations: [
    AppComponent,
  ],
  providers: [
    GlobalService,
    LoginGuard,
    {provide: LocationStrategy ,useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }

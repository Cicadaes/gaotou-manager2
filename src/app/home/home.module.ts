import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeRoutersModule} from './home.routers.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HomeComponent} from './home.component';
import {HeaderComponent} from './header/header.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {FooterComponent} from './footer/footer.component';
import {SharedModule} from '../common/shared.module';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutersModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    HomeComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
  ],
  providers: [],
  bootstrap: []
})
export class HomeModule {}

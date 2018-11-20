import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { LimitComponent } from './limit.component';
import {LimitRoutersModule} from './limit.routers.module';
import {LimitMenuComponent} from './limit-menu/limit-menu.component';
import {LimitButtonComponent} from './limit-button/limit-button.component';
import {LimitRouterComponent} from './limit-router/limit-router.component';
import {SharedModule} from '../../common/shared.module';
import { LimitRoleComponent } from './limit-role/limit-role.component';
import {TableModule} from 'primeng/table';
import {DialogModule} from 'primeng/dialog';
import {LimitService} from '../../common/services/limit.service';
import {
  CalendarModule, ConfirmationService,
  ConfirmDialogModule, DropdownModule,
  MessageModule, MessageService,
  MessagesModule,
  ProgressSpinnerModule, RadioButtonModule,
  ScrollPanelModule,
  TreeModule,
  TreeTableModule
} from 'primeng/primeng';


@NgModule({
  imports: [
    CommonModule,
    LimitRoutersModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TreeTableModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    TreeModule,
    TableModule,
    DialogModule,
    MessageModule,
    MessagesModule,
    ScrollPanelModule,
    DropdownModule,
    RadioButtonModule,
    CalendarModule
  ],
  declarations: [
    LimitComponent,
    LimitMenuComponent,
    LimitButtonComponent,
    LimitRouterComponent,
    LimitRoleComponent
  ],
  providers: [LimitService, MessageService, ConfirmationService]
})
export class LimitModule { }

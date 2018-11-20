import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { InterceptComponent } from './intercept.component';
import {InterceptRoutersModule} from './intercept.routers.module';
import {SharedModule} from '../../common/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {
  CalendarModule,
  CheckboxModule,
  ConfirmationService,
  ConfirmDialogModule,
  DialogModule, DropdownModule,
  MessageModule,
  MessageService,
  MessagesModule, ProgressSpinnerModule, RadioButtonModule, ScrollPanelModule, TreeModule, TreeTableModule
} from 'primeng/primeng';
import { InterceptService } from '../../common/services/intercept.service';

@NgModule({
  imports: [
    CommonModule,
    InterceptRoutersModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
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
  declarations: [InterceptComponent],
  providers: [InterceptService, ConfirmationService, MessageService, DatePipe]
})
export class InterceptModule { }

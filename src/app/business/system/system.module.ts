import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SystemRoutersModule} from './system.routers.module';
import {SharedModule} from '../../common/shared.module';
import { SystemService } from '../../common/services/system.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DialogModule} from 'primeng/dialog';
import {MessageModule} from 'primeng/message';
import {
  CalendarModule,
  ConfirmDialogModule,
  DropdownModule,
  MessagesModule,
  ProgressSpinnerModule, RadioButtonModule, ScrollPanelModule,
  TreeModule,
  TreeTableModule
} from 'primeng/primeng';
import { EventTypeComponent } from './event-type/event-type.component';

@NgModule({
  imports: [
    CommonModule,
    SystemRoutersModule,
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
  declarations: [EventTypeComponent],
  providers: [SystemService, MessageService, ConfirmationService]
})
export class SystemModule { }

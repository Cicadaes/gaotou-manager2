import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplyComponent } from './apply.component';
import {ApplyRoutersModule} from './apply.routers.module';
import {TableModule} from 'primeng/table';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DialogModule} from 'primeng/dialog';
import {
  CalendarModule,
  ConfirmationService,
  ConfirmDialogModule, DropdownModule,
  MessageModule,
  MessageService,
  MessagesModule,
  ProgressSpinnerModule, RadioButtonModule, ScrollPanelModule, TreeModule, TreeTableModule
} from 'primeng/primeng';
import {ApplyService } from '../../common/services/apply.service';
import {SharedModule} from '../../common/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ApplyRoutersModule,
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
  declarations: [ApplyComponent],
  providers: [ApplyService, MessageService, ConfirmationService]
})
export class ApplyModule {}

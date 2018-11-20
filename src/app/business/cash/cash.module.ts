import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CashComponent } from './cash.component';
import {CashRoutersModule} from './cash.routers.module';
import {SharedModule} from '../../common/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CashService } from '../../common/services/cash.service';
import {MessageModule} from 'primeng/message';
import {
  CalendarModule,
  ConfirmationService,
  ConfirmDialogModule,
  DialogModule,
  DropdownModule, MessageService,
  MessagesModule,
  ProgressSpinnerModule, RadioButtonModule,
  ScrollPanelModule,
  TreeModule, TreeTableModule
} from 'primeng/primeng';
import {TableModule} from 'primeng/table';

@NgModule({
  imports: [
    CommonModule,
    CashRoutersModule,
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
  declarations: [CashComponent],
  providers: [CashService, MessageService, ConfirmationService]
})
export class CashModule { }

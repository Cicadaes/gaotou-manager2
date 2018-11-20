import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { StoreComponent } from './store.component';
import {StoreRoutersModule} from './store.routers.module';
import {SharedModule} from '../../common/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {
  CalendarModule,
  CheckboxModule, ConfirmationService,
  ConfirmDialogModule,
  DialogModule, DropdownModule,
  MessageModule,
  MessageService,
  MessagesModule,
  ProgressSpinnerModule, RadioButtonModule, ScrollPanelModule, TreeModule, TreeTableModule
} from 'primeng/primeng';
import { StoreService } from '../../common/services/store.service';

@NgModule({
  imports: [
    CommonModule,
    StoreRoutersModule,
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
  declarations: [StoreComponent],
  providers: [StoreService, MessageService, ConfirmationService, DatePipe]
})
export class StoreModule { }

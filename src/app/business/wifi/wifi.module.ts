import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { WifiComponent } from './wifi.component';
import {WifiRoutersModule} from './wifi.routers.module';
import { WifiService } from '../../common/services/wifi.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {
  CalendarModule,
  ConfirmDialogModule,
  DialogModule,
  DropdownModule,
  MessageModule,
  MessagesModule,
  ProgressSpinnerModule, RadioButtonModule, ScrollPanelModule,
  TreeModule, TreeTableModule
} from 'primeng/primeng';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {SharedModule} from '../../common/shared.module';

@NgModule({
  imports: [
    CommonModule,
    WifiRoutersModule,
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
  declarations: [WifiComponent],
  providers: [WifiService, MessageService, ConfirmationService, DatePipe]
})
export class WifiModule { }

import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { DictListComponent } from './dict-list/dict-list.component';
import { DictWordComponent } from './dict-word/dict-word.component';
import {DictRoutersModule} from './dict.routers.module';
import {SharedModule} from '../../common/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  CalendarModule, ConfirmationService,
  ConfirmDialogModule,
  DialogModule, DropdownModule,
  MessageModule, MessageService,
  MessagesModule,
  ProgressSpinnerModule, RadioButtonModule, ScrollPanelModule,
  TreeModule,
  TreeTableModule
} from 'primeng/primeng';
import {TableModule} from 'primeng/table';
import {DictService} from '../../common/services/dict.service';

@NgModule({
  imports: [
    CommonModule,
    DictRoutersModule,
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
  declarations: [DictListComponent, DictWordComponent],
  providers: [DictService, MessageService, ConfirmationService, DatePipe]
})
export class DictModule { }

import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { SerareaComponent } from './serarea.component';
import {SerareaRoutersModule} from './serarea.routers.module';
import {SharedModule} from '../../common/shared.module';
import { SerareaSernumComponent } from './serarea-sernum/serarea-sernum.component';
import { SerareaFieldsComponent } from './serarea-fields/serarea-fields.component';
import {TableModule} from 'primeng/table';
import {
  CalendarModule,
  ConfirmationService,
  ConfirmDialogModule,
  DialogModule, DropdownModule,
  MessageModule,
  MessageService,
  MessagesModule,
  ProgressSpinnerModule, RadioButtonModule, ScrollPanelModule, TreeModule, TreeTableModule
} from 'primeng/primeng';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SerareaService } from '../../common/services/serarea.service';
import { SerareaFieldtypeComponent } from './serarea-fieldtype/serarea-fieldtype.component';

@NgModule({
  imports: [
    CommonModule,
    SerareaRoutersModule,
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
  declarations: [SerareaComponent, SerareaSernumComponent, SerareaFieldsComponent, SerareaFieldtypeComponent],
  providers: [SerareaService, MessageService, ConfirmationService, DatePipe]
})
export class SerareaModule { }

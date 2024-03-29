import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideomComponent } from './videom.component';
import {VideomRoutersModule} from './videom.routers.module';
import {SharedModule} from '../../common/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {
  ConfirmationService,
  ConfirmDialogModule,
  DialogModule, DropdownModule, MessageModule,
  MessageService, MessagesModule,
  ProgressSpinnerModule, RadioButtonModule, ScrollPanelModule, TreeModule, TreeTableModule
} from 'primeng/primeng';
import { VideomService } from '../../common/services/videom.service';
import {PagingModule} from '../../common/components/paging/paging.module';

@NgModule({
  imports: [
    CommonModule,
    VideomRoutersModule,
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
    PagingModule
  ],
  declarations: [VideomComponent],
  providers: [VideomService, MessageService, ConfirmationService]
})
export class VideomModule { }

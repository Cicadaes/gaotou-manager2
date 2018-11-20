import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemComponent } from './system.component';
import {SystemRoutersModule} from './system.routers.module';
import {SharedModule} from '../../common/shared.module';
import { SystemService } from '../../common/services/system.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DialogModule} from 'primeng/dialog';
import {MessageModule} from 'primeng/message';
import {ConfirmDialogModule, MessagesModule, ProgressSpinnerModule} from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    SystemRoutersModule,
    SharedModule,
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    MessagesModule,
    MessageModule,
    ConfirmDialogModule,
    ProgressSpinnerModule
  ],
  declarations: [SystemComponent],
  providers: [SystemService, MessageService, ConfirmationService]
})
export class SystemModule { }

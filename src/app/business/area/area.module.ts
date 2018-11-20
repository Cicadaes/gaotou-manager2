import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { AreaComponent } from './area.component';
import {AreaRoutersModule} from './area.routers.module';
import {ButtonModule} from 'primeng/button';
import {SharedModule} from '../../common/shared.module';
import {
  ConfirmationService,
  ConfirmDialogModule,
  DialogModule,
  MessageModule,
  MessageService,
  MessagesModule, RadioButtonModule, ScrollPanelModule,
  TreeModule, TreeTableModule
} from 'primeng/primeng';
import {AreaService} from '../../common/services/area.service';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AreaRoutersModule,

    TreeTableModule,
    ButtonModule,
    SharedModule,
    DialogModule,
    MessagesModule,
    MessageModule,
    ConfirmDialogModule,
    TreeModule,
    ScrollPanelModule,
    RadioButtonModule
  ],
  declarations: [AreaComponent],
  providers: [AreaService, MessageService, ConfirmationService, DatePipe]
})
export class AreaModule { }

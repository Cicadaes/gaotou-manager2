import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoGroupComponent } from './video-group.component';
import {VideoGroupRoutersModule} from './video-group.routers.module';
import {TableModule} from 'primeng/table';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DialogModule} from 'primeng/dialog';
import {
  ConfirmationService,
  ConfirmDialogModule, DropdownModule,
  MessageModule,
  MessageService,
  MessagesModule,
  ProgressSpinnerModule, RadioButtonModule, ScrollPanelModule, TreeModule, TreeTableModule
} from 'primeng/primeng';
import { VideoGroupService } from '../../common/services/video-group.service';
import {SharedModule} from '../../common/shared.module';

@NgModule({
  imports: [
    CommonModule,
    VideoGroupRoutersModule,
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
    RadioButtonModule
  ],
  declarations: [VideoGroupComponent],
  providers: [VideoGroupService, MessageService, ConfirmationService]
})
export class VideoGroupModule { }

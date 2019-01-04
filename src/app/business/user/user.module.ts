import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserComponent} from './user.component';
import {UserRoutersModule} from './user.routers.module';
import {TableModule} from 'primeng/table';
import {SharedModule} from '../../common/shared.module';
import {DialogModule} from 'primeng/dialog';
import {ConfirmationService, MessageService} from 'primeng/api';
import {UserService} from '../../common/services/user.service';
import {
  CalendarModule,
  ConfirmDialogModule,
  DropdownModule,
  MessageModule,
  MessagesModule,
  ProgressSpinnerModule,
  RadioButtonModule, ScrollPanelModule, TreeModule, TreeTableModule
} from 'primeng/primeng';
import {OrgCompanyComponent} from '../org/org-company/org-company.component';
import {PagingComponent} from '../../common/components/paging/paging.component';
import {PagingModule} from '../../common/components/paging/paging.module';


@NgModule({
  imports: [
    CommonModule,
    UserRoutersModule,
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
    CalendarModule,
    PagingModule
  ],
  declarations: [UserComponent],
  providers: [UserService, MessageService, ConfirmationService, DatePipe]
})
export class UserModule {
}

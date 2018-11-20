import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { OrgComponent } from './org.component';
import {OrgRoutersModule} from './org.routers.module';
import {SharedModule} from '../../common/shared.module';
import {
  CalendarModule,
  ConfirmationService,
  ConfirmDialogModule,
  DialogModule,
  DropdownModule,
  MessageModule, MessageService,
  MessagesModule, ProgressSpinnerModule, RadioButtonModule, ScrollPanelModule, TreeModule,
  TreeTableModule
} from 'primeng/primeng';
import {TableModule} from 'primeng/table';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { OrgService } from '../../common/services/org.service';
import { OrgDutyComponent } from './org-duty/org-duty.component';
import {OrgDepartmentComponent} from './org-department/org-department.component';
import { OrgCompanyComponent } from './org-company/org-company.component';

@NgModule({
  imports: [
    CommonModule,
    OrgRoutersModule,
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
  declarations: [OrgComponent, OrgDutyComponent, OrgDepartmentComponent, OrgCompanyComponent],
  providers: [OrgService, MessageService, ConfirmationService, DatePipe]
})
export class OrgModule { }

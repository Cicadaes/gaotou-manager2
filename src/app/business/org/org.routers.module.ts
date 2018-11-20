import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OrgComponent} from './org.component';
import {OrgDutyComponent} from './org-duty/org-duty.component';
import {OrgDepartmentComponent} from './org-department/org-department.component';
import {OrgCompanyComponent} from './org-company/org-company.component';
const mainRoutes: Routes = [
  {path: '', component: OrgComponent, children: [
      {path: 'company', component: OrgCompanyComponent, pathMatch: 'full'},
      {path: 'department', component: OrgDepartmentComponent, pathMatch: 'full'},
      {path: 'duty', component: OrgDutyComponent, pathMatch: 'full'},
    ]},
];

@NgModule({
  imports: [RouterModule.forChild(mainRoutes)],
  exports: [RouterModule],
  providers: []
})
export class OrgRoutersModule {}

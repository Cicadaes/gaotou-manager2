import { Component, OnInit } from '@angular/core';
import {ConfirmationService, Message, MessageService} from 'primeng/api';
import {OrgService} from '../../../common/services/org.service';
import {GlobalService} from '../../../common/services/global.service';
import {AddDuty, Duty} from '../../../common/model/org-model';
import {SelectItem} from '../../../common/model/shared-model';

@Component({
  selector: 'app-org-duty',
  templateUrl: './org-duty.component.html',
  styleUrls: ['./org-duty.component.css']
})
export class OrgDutyComponent implements OnInit {
// table显示相关
  public duties: Duty[]; // 整个table数据
  public cols: any[]; // 表头
  public duty: any; // 接收选中的值
  public selectedDuties: Duty[]; // 多个选择
  // 增加相关
  public addDialog: boolean; // 增加弹窗显示控制
  public addDuty: AddDuty = new AddDuty(); // 添加参数字段
  public addCompanySelect: SelectItem[]; // 公司列表
  public addDepSelect: SelectItem[]; // 部门列表
  public addDepTopDutySelect: SelectItem[]; // 上级职务
  // 其他提示弹窗相关
  public cleanTimer: any; // 清除时钟
  public msgs: Message[] = []; // 消息弹窗
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private orgService: OrgService,
    private globalService: GlobalService
  ) { }

  ngOnInit() {
    this.cols = [
      {field: 'id', header: '职务id'},
      {field: 'dutyName', header: '职务名称'},
      {field: 'level', header: '部门等级'},
      {field: 'description', header: '部门描述'},
      {field: 'organizationName', header: '所属公司'},
    ];
    this.updateDutyDate();
    this.orgService.searchCompanyList({page: 1, nums: 100}).subscribe(
      (val) => {
        this.addCompanySelect = this.initializeSelectCompany(val.data.contents);
      }
    );
  }
  public updateDutyDate(): void {
   /* this.orgService.searchDepartList({page: 1, nums: 100}).subscribe(
      (val) => {
        this.orgs = val.data.contents;
      }
    );*/
    this.orgService.searchDutyList({page: 1, nums: 100}).subscribe(
      (val) => {
        console.log(val);
        this.duties = val.data.contents;
      }
    );
  }
  public cleanData(): void {
    this.addDuty = {};
    this.addCompanySelect = [];
    this.addDepSelect = [];
    this.addDepTopDutySelect = [];
    console.log(this.addCompanySelect);
  }
  // 选中后赋值
  public onRowSelect(event): void {
    console.log(event.data);
    this.duty = this.cloneCar(event.data);
  }
  // 遍历修改后的数据，并把它赋值给car1
  public cloneCar(c: any): any {
    const car = {};
    for (const prop in c) {
      if (c) {
        car[prop] = c[prop];
      }
    }
    return car;
  }
  // 增加
  public addsSave(): void {
    console.log(this.addDuty);
    if (this.addDuty.boss === '1') {
      this.addDuty.boss = false;
    } else {
      this.addDuty.boss = true;
    }
    this.confirmationService.confirm({
      message: `确定要增加吗？`,
      header: '增加提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.globalService.eventSubject.next({display: true});
        this.orgService.addDutyItem(this.addDuty).subscribe(
          (value) => {
            if (value.status === '200') {
              this.globalService.eventSubject.next({display: false});
              if (this.cleanTimer) {
                clearTimeout(this.cleanTimer);
              }
              this.msgs = [];
              this.msgs.push({severity: 'success', summary: '增加提醒', detail: value.message});
              this.updateDutyDate();
              this.cleanTimer = setTimeout(() => {
                this.msgs = [];
              }, 3000);
              this.addDialog = false;
              this.cleanData();
            } else {
              setTimeout(() => {
                this.globalService.eventSubject.next({display: false});
                if (this.cleanTimer) {
                  clearTimeout(this.cleanTimer);
                }
                this.msgs = [];
                this.cleanData();
                this.msgs.push({severity: 'error', summary: '增加提醒', detail: '服务器处理失败'});
                this.cleanTimer = setTimeout(() => {
                  this.msgs = [];
                }, 3000);
              }, 3000);
            }
          },
          (err) => {
            console.log(err);
            setTimeout(() => {
              this.globalService.eventSubject.next({display: false});
              if (this.cleanTimer) {
                clearTimeout(this.cleanTimer);
              }
              this.msgs = [];
              this.msgs.push({severity: 'error', summary: '增加提醒', detail: '连接服务器失败'});
              this.cleanTimer = setTimeout(() => {
                this.msgs = [];
              }, 3000);
            }, 3000);
          }
        );
      },
      reject: () => {}
    });
  }
  // 删除
  public deleteFirm(): void {
    if (this.selectedDuties === undefined || this.selectedDuties.length === 0) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.msgs = [];
      this.msgs.push({severity: 'error', summary: '操作错误', detail: '请选择需要删除的项'});
      this.cleanTimer = setTimeout(() => {
        this.msgs = [];
      }, 3000);
    } else {
      this.confirmationService.confirm({
        message: `确定要删除这${this.selectedDuties.length}项吗？`,
        header: '删除提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.globalService.eventSubject.next({display: true});
          if (this.selectedDuties.length === 1) {
            this.orgService.deleteDutyItem(this.selectedDuties[0].id).subscribe(
              (value) => {
                if (value.status === '200') {
                  this.globalService.eventSubject.next({display: false});
                  /* this.selectedorgs.map((val, inx) => {
                     const index = this.cashs.indexOf(val);
                     this.cashs = this.cashs.filter((val1, i) => i !== index);
                   });*/
                  if (this.cleanTimer) {
                    clearTimeout(this.cleanTimer);
                  }
                  this.msgs = [];
                  this.selectedDuties = undefined;
                  this.msgs.push({severity: 'success', summary: '删除提醒', detail: value.message});
                  this.cleanTimer = setTimeout(() => {
                    this.msgs = [];
                  }, 3000);
                  this.updateDutyDate();
                } else {
                  setTimeout(() => {
                    this.globalService.eventSubject.next({display: false});
                    if (this.cleanTimer) {
                      clearTimeout(this.cleanTimer);
                    }
                    this.msgs = [];
                    this.msgs.push({severity: 'error', summary: '删除提醒', detail: '服务器处理失败'});
                    this.cleanTimer = setTimeout(() => {
                      this.msgs = [];
                    }, 3000);
                  }, 3000);
                }
              },
              (err) => {
                setTimeout(() => {
                  this.globalService.eventSubject.next({display: false});
                  if (this.cleanTimer) {
                    clearTimeout(this.cleanTimer);
                  }
                  this.msgs = [];
                  this.msgs.push({severity: 'error', summary: '删除提醒', detail: '连接服务器失败'});
                  this.cleanTimer = setTimeout(() => {
                    this.msgs = [];
                  }, 3000);
                });
              }
            );
          } else {
            const ids = [];
            for (let i = 0; i < this.selectedDuties.length; i ++) {
              ids.push(this.selectedDuties[i].id);
            }
            this.orgService.deleteDutyItem(ids).subscribe(
              (value) => {
                if (value.status === '200') {
                  setTimeout(() => {
                    this.globalService.eventSubject.next({display: false});
                    /*this.selectedorgs.map((val, inx) => {
                      const index = this.cashs.indexOf(val);
                      this.cashs = this.cashs.filter((val1, i) => i !== index);
                    });*/
                    if (this.cleanTimer) {
                      clearTimeout(this.cleanTimer);
                    }
                    this.msgs = [];
                    this.selectedDuties = undefined;
                    this.updateDutyDate();
                    this.msgs.push({severity: 'success', summary: '删除提醒', detail: value.message});
                    this.cleanTimer = setTimeout(() => {
                      this.msgs = [];
                    }, 3000);
                  }, 3000);
                } else {
                  setTimeout(() => {
                    this.globalService.eventSubject.next({display: false});
                    if (this.cleanTimer) {
                      clearTimeout(this.cleanTimer);
                    }
                    this.msgs = [];
                    this.msgs.push({severity: 'error', summary: '删除提醒', detail: '服务器处理失败'});
                    this.cleanTimer = setTimeout(() => {
                      this.msgs = [];
                    }, 3000);
                  }, 3000);
                }
              },
              (err) => {
                setTimeout(() => {
                  this.globalService.eventSubject.next({display: false});
                  if (this.cleanTimer) {
                    clearTimeout(this.cleanTimer);
                  }
                  this.msgs = [];
                  this.msgs.push({severity: 'error', summary: '删除提醒', detail: '连接服务器失败'});
                  this.cleanTimer = setTimeout(() => {
                    this.msgs = [];
                  }, 3000);
                });
              }
            );
          }
        },
        reject: () => {}
      });
    }
  }
  // 选择公司
  public companyChange(e): void {
    this.addDuty.organizationName = e.value.name;
    this.addDuty.organizationId = e.value.id;
    this.orgService.searchCompanyIdDepList(e.value.id).subscribe(
      (value) => {
        console.log(value);
        this.addDepSelect = this.initializeSelectOrg(value.data);
      }
    );
    this.orgService.searchCompanyIdDepIdDutyList({companyId: e.value.id, depId: null}).subscribe(
      (val) => {
        console.log(val);
        this.addDepTopDutySelect = this.initializeSelectDuty(val.data);
      }
    );
  }
  // 选择部门
  public orgsChange(e): void {
    this.addDuty.deptName = e.value.name;
    this.addDuty.deptId = e.value.id;
    this.orgService.searchCompanyIdDepIdDutyList({companyId:  this.addDuty.organizationId, depId: e.value.id}).subscribe(
      (val) => {
        console.log(val);
        this.addDepTopDutySelect = this.initializeSelectDuty(val.data);
      }
    );
  }
  // 选择上级职务
  public topDutyChange(e): void {
    console.log(e);
    this.addDuty.pid = e.value.id;
  }
  // 数据格式化
  public initializeSelectCompany(data): any {
    const oneChild = [];
    for (let i = 0; i < data.length; i++) {
      const childnode =  new SelectItem();
      childnode.name = data[i].name;
      childnode.id = data[i].id;
      oneChild.push(childnode);
    }
    return oneChild;
  }
  public initializeSelectOrg(data): any {
    const oneChild = [];
    for (let i = 0; i < data.length; i++) {
      const childnode =  new SelectItem();
      childnode.name = data[i].deptName;
      childnode.id = data[i].id;
      oneChild.push(childnode);
    }
    return oneChild;
  }
  public initializeSelectDuty(data): any {
    const oneChild = [];
    for (let i = 0; i < data.length; i++) {
      const childnode =  new SelectItem();
      childnode.name = data[i].dutyName;
      childnode.id = data[i].id;
      oneChild.push(childnode);
    }
    return oneChild;
  }
}

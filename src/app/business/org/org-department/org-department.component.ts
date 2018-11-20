import { Component, OnInit } from '@angular/core';
import {AddDepartment, Department} from '../../../common/model/org-model';
import {SelectItem} from '../../../common/model/shared-model';
import {ConfirmationService, Message, MessageService} from 'primeng/api';
import {OrgService} from '../../../common/services/org.service';
import {GlobalService} from '../../../common/services/global.service';

@Component({
  selector: 'app-department',
  templateUrl: './org-department.component.html',
  styleUrls: ['./org-department.component.css']
})
export class OrgDepartmentComponent implements OnInit {
// table显示相关
  public orgs: Department[]; // 整个table数据
  public cols: any[]; // 表头
  public org: any; // 接收选中的值
  public selectedorgs: Department[]; // 多个选择
  // 增加相关
  public addDialog: boolean; // 增加弹窗显示控制
  public addOrg: AddDepartment = new AddDepartment(); // 添加参数字段
  public addCompanySelect: SelectItem[]; // 公司列表
  public addOrgSelect: SelectItem[]; // 部门列表
  // 其他提示弹窗相关
  public cleanTimer: any; // 清除时钟
  public msgs: Message[] = []; // 消息弹窗
  // 时间初始化
  public esDate: any;
  public value: Date; // 时间选择器
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private orgService: OrgService,
    private globalService: GlobalService
  ) { }

  ngOnInit() {
    // 时间初始化
    this.esDate = {
      dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      dayNamesShort: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      dayNamesMin: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    };
    this.cols = [
      {field: 'deptCode', header: '部门编号'},
      {field: 'deptName', header: '部门名称'},
      {field: 'fax', header: '部门传真'},
      {field: 'telNumber', header: '部门电话'},
      {field: 'organizationName', header: '所属公司'},
      {field: 'idt', header: '创建时间'},

    ];
    this.updateOrgDate();
  }
  public updateOrgDate(): void {
    this.orgService.searchDepartList({page: 1, nums: 100}).subscribe(
      (val) => {
        this.orgs = val.data.contents;
      }
    );
    this.orgService.searchCompanyList({page: 1, nums: 100}).subscribe(
      (val) => {
        this.addCompanySelect = this.initializeSelectCompany(val.data.contents);
      }
    );
  }
  // 增加
  public addsSave(): void {
    console.log(this.addOrg);
    this.confirmationService.confirm({
      message: `确定要增加吗？`,
      header: '增加提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.globalService.eventSubject.next({display: true});
        this.orgService.addDepartItem(this.addOrg).subscribe(
          (value) => {
            if (value.status === '200') {
              this.globalService.eventSubject.next({display: false});
              if (this.cleanTimer) {
                clearTimeout(this.cleanTimer);
              }
              this.msgs = [];
              this.msgs.push({severity: 'success', summary: '增加提醒', detail: value.message});
              this.updateOrgDate();
              this.cleanTimer = setTimeout(() => {
                this.msgs = [];
              }, 3000);
              this.addDialog = false;
            } else {
              setTimeout(() => {
                this.globalService.eventSubject.next({display: false});
                if (this.cleanTimer) {
                  clearTimeout(this.cleanTimer);
                }
                this.msgs = [];
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
    if (this.selectedorgs === undefined || this.selectedorgs.length === 0) {
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
        message: `确定要删除这${this.selectedorgs.length}项吗？`,
        header: '删除提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.globalService.eventSubject.next({display: true});
          if (this.selectedorgs.length === 1) {
            this.orgService.deleteDepartItem(this.selectedorgs[0].id).subscribe(
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
                  this.selectedorgs = undefined;
                  this.msgs.push({severity: 'success', summary: '删除提醒', detail: value.message});
                  this.cleanTimer = setTimeout(() => {
                    this.msgs = [];
                  }, 3000);
                  this.updateOrgDate();
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
            for (let i = 0; i < this.selectedorgs.length; i ++) {
              ids.push(this.selectedorgs[i].id);
            }
            this.orgService.deleteDepartList(ids).subscribe(
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
                    this.selectedorgs = undefined;
                    this.updateOrgDate();
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
    this.addOrg.organizationName = e.value.name;
    this.addOrg.organizationId = e.value.id;
    this.orgService.searchCompanyIdDepList(e.value.id).subscribe(
      (value) => {
        this.addOrgSelect = this.initializeSelectOrg(value.data);
      }
    );
  }
  // 选择部门
  public orgsChange(e): void {
    console.log(e);
    this.addOrg.pid = e.value.pid;
    this.addOrg.pids = `/${e.value.pid}/${e.value.pids}`;
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
      childnode.pid = data[i].pid;
      childnode.pids = data[i].pids;
      oneChild.push(childnode);
    }
    return oneChild;
  }

}

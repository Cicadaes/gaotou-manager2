import {Component, OnInit} from '@angular/core';
import {AddUser, modifyUser, User} from '../../common/model/user-model';
import {UserService} from '../../common/services/user.service';
import {ConfirmationService, Message, MessageService} from 'primeng/api';
import {GlobalService} from '../../common/services/global.service';
import {SelectItem} from '../../common/model/shared-model';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  // table显示相关
  public users: User[]; // 整个table数据
  public cols: any[]; // 表头
  public cash: any; // 接收选中的值
  public selectedUsers: User[]; // 多个选择
  public sex = ['男', '女'];
  // 增加相关
  public addDialog: boolean; // 增加弹窗显示控制
  public addUser: AddUser = new AddUser(); // 添加参数字段
  public addCompanySelect: SelectItem[]; // 公司列表
  public addDepSelect: SelectItem[]; // 部门列表
  public addDepTopDutySelect: SelectItem[]; // 职务
  // 修改相关
  public modifyDialog: boolean;//修改弹窗显示控制
  public modifyUser: modifyUser = new modifyUser();
  // 其他提示弹窗相关
  public cleanTimer: any; // 清除时钟
  public msgs: Message[] = []; // 消息弹窗
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private userService: UserService,
    private globalService: GlobalService,
    private datePipe: DatePipe,
  ) {
  }

  ngOnInit() {
    this.cols = [
      {field: 'realName', header: '姓名'},
      {field: 'telNumber', header: '电话'},
      {field: 'gender', header: '性别'},
      {field: 'organizationName', header: '所属公司'},
      {field: 'deptName', header: '所属部门'},
      {field: 'dutyName', header: '职务'},
      {field: 'idt', header: '添加时间'}
    ];
    this.updateUserDate();
  }

  public updateUserDate(): void {
    this.userService.searchList({page: 1, nums: 1000}).subscribe(
      (value) => {
        console.log(value);
        this.users = value.data.contents;
        this.users.map((val, index) => {
          val.gender = this.sex[val.gender - 1];
        });
      }
    );
    this.userService.searchCompanyList({page: 1, nums: 100}).subscribe(
      (val) => {
        this.addCompanySelect = this.initializeSelectCompany(val.data.contents);
      }
    );
  }

  // 选中后赋值
  public onRowSelect(event): void {
    // console.log(event);
  }

  // 增加
  public addsSave(): void {
    console.log(this.addUser);
    this.confirmationService.confirm({
      message: `确定要增加吗？`,
      header: '增加提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.globalService.eventSubject.next({display: true});
        this.userService.addItem(this.addUser).subscribe(
          (value) => {
            if (value.status === '200') {
              this.globalService.eventSubject.next({display: false});
              if (this.cleanTimer) {
                clearTimeout(this.cleanTimer);
              }
              this.msgs = [];
              this.msgs.push({severity: 'success', summary: '增加提醒', detail: value.message});
              this.updateUserDate();
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
      reject: () => {
      }
    });
  }

  public timeOnSelect(e): void {
    this.addUser.birthday = this.datePipe.transform(e, 'yyyy-MM-dd');
    this.modifyUser.birthday = this.datePipe.transform(e, 'yyyy-MM-dd');
  }

  // 删除
  public deleteFirm(): void {
    if (this.selectedUsers === undefined || this.selectedUsers.length === 0) {
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
        message: `确定要删除这${this.selectedUsers.length}项吗？`,
        header: '删除提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.globalService.eventSubject.next({display: true});
          if (this.selectedUsers.length === 1) {
            this.userService.deleteItem(this.selectedUsers[0].id).subscribe(
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
                  this.selectedUsers = undefined;
                  this.msgs.push({severity: 'success', summary: '删除提醒', detail: value.message});
                  this.cleanTimer = setTimeout(() => {
                    this.msgs = [];
                  }, 3000);
                  this.updateUserDate();
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
            for (let i = 0; i < this.selectedUsers.length; i++) {
              ids.push(this.selectedUsers[i].id);
            }
            this.userService.deleteList(ids).subscribe(
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
                    this.selectedUsers = undefined;
                    this.updateUserDate();
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
        reject: () => {
        }
      });
    }
  }

  //修改
  public modifyBtn(): void {
    if (this.selectedUsers === undefined || this.selectedUsers.length === 0) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.msgs = [];
      this.msgs.push({severity: 'error', summary: '操作错误', detail: '请选择需要修改的项'});
      this.cleanTimer = setTimeout(() => {
        this.msgs = [];
      }, 3000);
    } else if (this.selectedUsers.length > 0 && this.selectedUsers.length <= 1) {
      this.modifyDialog = true;
      this.modifyUser.id = this.selectedUsers[0].id;
      this.modifyUser.organizationId = this.selectedUsers[0].organizationId;
      this.modifyUser.organizationName = this.selectedUsers[0].organizationName;
      this.modifyUser.deptId = this.selectedUsers[0].deptId;
      this.modifyUser.deptName = this.selectedUsers[0].deptName;
      this.modifyUser.dutyId = this.selectedUsers[0].dutyId;
      this.modifyUser.dutyName = this.selectedUsers[0].dutyName;
      this.modifyUser.realName = this.selectedUsers[0].realName;
      this.modifyUser.userName = this.selectedUsers[0].userName;
      this.modifyUser.telNumber = this.selectedUsers[0].telNumber;
      this.modifyUser.email = this.selectedUsers[0].email;
      this.modifyUser.address = this.selectedUsers[0].address;
      this.modifyUser.idt = this.selectedUsers[0].idt;
      if (this.selectedUsers[0].gender=='女'){
        this.modifyUser.gender=2;
      }else {
        this.modifyUser.gender=1;
      }
      this.modifyUser.enabled = this.selectedUsers[0].enabled;
      this.modifyUser.birthday = this.selectedUsers[0].birthday;
      this.modifyUser.remark = this.selectedUsers[0].remark;
      console.log(this.selectedUsers);
    } else {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.msgs = [];
      this.msgs.push({severity: 'error', summary: '操作错误', detail: '最多选择一项修改'});
      this.cleanTimer = setTimeout(() => {
        this.msgs = [];
      }, 3000);
    }
  }

  //修改确认
  public modifySure(): void {
    console.log(this.modifyUser);
    this.confirmationService.confirm({
      message: '确定要修改吗？',
      header: '修改提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.globalService.eventSubject.next({display: true});
        this.userService.modifyUser(this.modifyUser).subscribe(
          (value) => {
            if (value.status === '200') {
              this.globalService.eventSubject.next({display: false});
              if (this.cleanTimer) {
                clearTimeout(this.cleanTimer);
              }
              this.msgs = [];
              this.selectedUsers = undefined;
              this.msgs.push({severity: 'success', summary: '修改提醒', detail: value.message});
              this.updateUserDate();
              this.cleanTimer = setTimeout(() => {
                this.msgs = [];
              }, 3000);
              this.modifyDialog = false;
            } else {
              console.log(value);
              setTimeout(() => {
                this.globalService.eventSubject.next({display: false});
                if (this.cleanTimer) {
                  clearTimeout(this.cleanTimer);
                }
                this.msgs = [];
                this.msgs.push({severity: 'error', summary: '修改提醒', detail: '服务器处理失败'});
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
              this.msgs.push({severity: 'error', summary: '修改提醒', detail: '连接服务器失败'});
              this.cleanTimer = setTimeout(() => {
                this.msgs = [];
              }, 3000);
            }, 3000);
          }
        );
      },
      reject: () => {
      }
    });
  }

  // 选择公司
  public companyChange(e): void {
    this.addUser.organizationName = e.value.name;
    this.addUser.organizationId = e.value.id;
    this.modifyUser.organizationName = e.value.name;
    this.modifyUser.organizationId = e.value.id;
    this.userService.searchCompanyIdDepList(e.value.id).subscribe(
      (value) => {
        console.log(value);
        this.addDepSelect = this.initializeSelectOrg(value.data);
      }
    );
    this.userService.searchCompanyIdDepIdDutyList({companyId: e.value.id, depId: null}).subscribe(
      (val) => {
        console.log(val);
        this.addDepTopDutySelect = this.initializeSelectDuty(val.data);
      }
    );
  }

  // 选择部门
  public orgsChange(e): void {
    this.addUser.deptName = e.value.name;
    this.addUser.deptId = e.value.id;
    this.modifyUser.deptName = e.value.name;
    this.modifyUser.deptId = e.value.id;
    this.userService.searchCompanyIdDepIdDutyList({companyId: this.addUser.organizationId, depId: e.value.id}).subscribe(
      (val) => {
        console.log(val);
        this.addDepTopDutySelect = this.initializeSelectDuty(val.data);
      }
    );
  }

  // 选择部门
  public dutyChange(e): void {
    this.addUser.dutyName = e.value.name;
    this.addUser.dutyId = e.value.id;
    this.modifyUser.dutyName = e.value.name;
    this.modifyUser.dutyId = e.value.id;
  }

  // 数据格式化
  public initializeSelectCompany(data): any {
    const oneChild = [];
    for (let i = 0; i < data.length; i++) {
      const childnode = new SelectItem();
      childnode.name = data[i].name;
      childnode.id = data[i].id;
      oneChild.push(childnode);
    }
    return oneChild;
  }

  public initializeSelectOrg(data): any {
    const oneChild = [];
    for (let i = 0; i < data.length; i++) {
      const childnode = new SelectItem();
      childnode.name = data[i].deptName;
      childnode.id = data[i].id;
      childnode.pid = data[i].pid;
      childnode.pids = data[i].pids;
      oneChild.push(childnode);
    }
    return oneChild;
  }

  public initializeSelectDuty(data): any {
    const oneChild = [];
    for (let i = 0; i < data.length; i++) {
      const childnode = new SelectItem();
      childnode.name = data[i].dutyName;
      childnode.id = data[i].id;
      oneChild.push(childnode);
    }
    return oneChild;
  }
}

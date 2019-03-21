import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {AddUser, modifyUser, QueryUser, User} from '../../common/model/user-model';
import {UserService} from '../../common/services/user.service';
import {ConfirmationService, Message, MessageService} from 'primeng/api';
import {GlobalService} from '../../common/services/global.service';
import {
  AddTreeArea,
  CompanyTree,
  CompanyTreeNode,
  DepartmentTree,
  DepartmentTreeNode,
  DutyTree, DutyTreeNode,
  SelectItem,
  TreeNode
} from '../../common/model/shared-model';
import {DatePipe} from '@angular/common';
import {Calendar} from 'primeng/primeng';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UserComponent implements OnInit {
  @ViewChild('addbirthday') addbirthday: Calendar;
  // table显示相关
  public users: User[]; // 整个table数据
  public cols: any[]; // 表头
  public cash: any; // 接收选中的值
  public selectedUsers: User[]; // 多个选择
  public sex = ['男', '女'];
  // 增加相关
  public addDialog: boolean; // 增加弹窗显示控制
  public addUser: AddUser = new AddUser(); // 添加参数字段
  // public addCompanySelect: SelectItem[]; // 公司列表
  // public addDepSelect: SelectItem[]; // 部门列表
  // public addDepTopDutySelect: SelectItem[]; // 职务
  //分页相关
  public nowPage: any;
  public option: any;
  //树形结构相关
  public addAreaTrees: AddTreeArea[]; // 区域树结构
  public addAreaTree: AddTreeArea = new AddTreeArea(); // 区域树选择
  public areaDialog: boolean; // 区域树弹窗

  public CompanyTrees: CompanyTree[];
  public companyDialog: boolean;// 公司树弹窗
  public CompanyTree: CompanyTree = new CompanyTree(); // 公司树选择
  public Companylabel: any;


  public DepartmentTrees:  DepartmentTree[];
  public departmentDialog: boolean;// 部门树弹窗
  public DepartmentTree:  DepartmentTree = new  DepartmentTree(); // 部门树选择
  public CompanyId: number; // 区域查询的公司ID
  public Departmentlabel: any;


  public DutyTrees:  DutyTree[];
  public dutyDialog: boolean;// 职位树弹窗
  public DutyTree:  DutyTree = new  DutyTree(); // 职位树选择
  public Dutylabel: any;


  //调教查询
  public queryUser:   QueryUser = new QueryUser();

  // 修改相关
  public modifyDialog: boolean;//修改弹窗显示控制
  public modifyUser: modifyUser = new modifyUser();
  public modifyFlag = 0;
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
    this.queryUser.deptId = null;
    this.queryUser.organizationId = null;
    this.queryUser.realName = null;
    this.queryUser.userName = null;
  }

  public updateUserDate(): void {
    this.userService.searchList({page: 1, nums: 10}).subscribe(
      (value) => {
        console.log(value);
        this.option = {total: value.data.totalRecord, row: value.data.pageSize};
        this.users = value.data.contents;
        this.users.map((val, index) => {
          val.gender = this.sex[val.gender - 1];
        });
      }
    );
    // this.userService.searchCompanyList({page: 1, nums: 100}).subscribe(
    //   (val) => {
    //     this.addCompanySelect = this.initializeSelectCompany(val.data.contents);
    //   }
    // );
  }

  // 选中后赋值
  public onRowSelect(event): void {
    console.log(event);
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
            console.log(value);
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
    this.modifyFlag = 1;
    if (this.selectedUsers === undefined || this.selectedUsers.length === 0) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.msgs = [];
      this.msgs.push({severity: 'error', summary: '操作错误', detail: '请选择需要修改的项'});
      this.cleanTimer = setTimeout(() => {
        this.msgs = [];
      }, 3000);
    } else if (this.selectedUsers.length === 1) {
         // this.userService.searchCompanyIdDepIdDutyList({companyId: this.selectedUsers[0].organizationId, depId: this.selectedUsers[0].deptId}).subscribe(
         //   (val) => {
         //     console.log(val.data);
         //     // this.addDepTopDutySelect = this.initializeSelectDuty(val.data);
         //   }
         // );
        /* // this.userService.searchCompanyIdDepList(this.selectedUsers[0].organizationId).subscribe(
         //   (value) => {
         //     console.log(value);
         //     this.addDepSelect = this.initializeSelectOrg(value.data);
         //   }
         // );
         // this.userService.searchCompanyIdDepIdDutyList({companyId: this.selectedUsers[0].organizationId, depId: null}).subscribe(
         //   (val) => {
         //     console.log(val);
         //     this.addDepTopDutySelect = this.initializeSelectDuty(val.data);
         //   }
         // );
         // this.userService.searchCompanyIdDepIdDutyList({companyId:this.selectedUsers[0].organizationId, depId: this.selectedUsers[0].deptId}).subscribe(
         //   (val) => {
         //     console.log(val);
         //     this.addDepTopDutySelect = this.initializeSelectDuty(val.data);
         //   }
         // );*/
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
      if (this.selectedUsers[0].gender == '女') {
        this.modifyUser.gender = 2;
      } else {
        this.modifyUser.gender = 1;
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
  //
  /* // // 选择公司
   // public companyChange(e): void {
   //   this.addUser.organizationName = e.value.name;
   //   this.addUser.organizationId = e.value.id;
   //   this.modifyUser.organizationName = e.value.name;
   //   this.modifyUser.organizationId = e.value.id;
   //   this.userService.searchCompanyIdDepList(e.value.id).subscribe(
   //     (value) => {
   //       console.log(value);
   //       this.addDepSelect = this.initializeSelectOrg(value.data);
   //     }
   //   );
   //   this.userService.searchCompanyIdDepIdDutyList({companyId: e.value.id, depId: null}).subscribe(
   //     (val) => {
   //       console.log(val);
   //       this.addDepTopDutySelect = this.initializeSelectDuty(val.data);
   //     }
   //   );
   // }
   //
   // // 选择部门
   // public orgsChange(e): void {
   //   this.addUser.deptName = e.value.name;
   //   this.addUser.deptId = e.value.id;
   //   this.modifyUser.deptName = e.value.name;
   //   this.modifyUser.deptId = e.value.id;
   //   this.userService.searchCompanyIdDepIdDutyList({companyId: this.addUser.organizationId, depId: e.value.id}).subscribe(
   //     (val) => {
   //       console.log(val);
   //       this.addDepTopDutySelect = this.initializeSelectDuty(val.data);
   //     }
   //   );
   // }

   // 选择部门
   // public dutyChange(e): void {
   //   this.addUser.dutyName = e.value.name;
   //   this.addUser.dutyId = e.value.id;
   //   this.modifyUser.dutyName = e.value.name;
   //   this.modifyUser.dutyId = e.value.id;
   // }*/

  //条件查询
  public  QueryUser(): void {
    this.userService.searchUser({page: 1, nums: 10},this.queryUser).subscribe(
      (value) => {
        console.log(value);
        this.option = {total:value.data.totalRecord,row:value.data.pageSize};
        this.users = value.data.contents;
        this.users.map((val, index) => {
          val.gender = this.sex[val.gender - 1];
        });
      }
    );
  }
  //重置数据
  public  resetQueryUser(): void {
    this.queryUser.deptId = null;
    this.queryUser.organizationId = null;
    this.queryUser.realName = null;
    this.queryUser.userName = null;
    this.clearData();
    this.updateUserDate();
  }


  //选择区域
  public AreaTreeClick(): void {
    this.areaDialog = true;
    this.userService.searchArea({page: 1, nums: 100}).subscribe(
      (val) => {
        this.addAreaTrees = this.initializeTree(val.data.contents);
        console.log(this.addAreaTrees);
      }
    );
  }
  public treeOnNodeSelect(event): void {
    this.areaDialog = false;
    // this.addAreaTreeSelect.push(event.node);
    // console.log(this.addAreaTree);
  }
  public treeSelectAreaClick(): void {
    this.areaDialog = false;
  }
  // 区划数据格式化
  public initializeTree(data): any {
    const oneChild = [];
    for (let i = 0; i < data.length; i++) {
      const childnode = new TreeNode();
      childnode.label = data[i].areaName;
      childnode.id = data[i].id;
      childnode.areaCode = data[i].areaCode;
      childnode.parentId = data[i].parentId;
      childnode.enabled = data[i].enabled;
      childnode.cityType = data[i].cityType;
      childnode.level = data[i].level;
      if (childnode === null) {
        childnode.children = [];
      } else {
        childnode.children = this.initializeTree(data[i].administrativeAreaTree);
      }
      oneChild.push(childnode);
    }
    console.log(oneChild);
    return oneChild;
  }

  //选择公司
  public CompanyTreeClick(): void {
    this.companyDialog = true;
    this.userService.searchCompanyTree().subscribe(
      (val) => {
        this.CompanyTrees = this.initializeCompanyTree(val.data);
      }
    );
  }

  //选择部门
  public  departmentTreeClick(): void {
    if (this.modifyFlag === 1){
      this.departmentDialog = true;
      console.log(this.modifyUser.organizationId);
      this.userService.searchDepartmentTree(this.modifyUser.organizationId).subscribe(
        (val) => {
          // console.log(val);
          this.DepartmentTrees = this.initializeDepartmentTree(val.data);
          // console.log( this.CompanyTrees);
        }
      );
    } else {
      if (this.CompanyId === undefined) {
        if (this.cleanTimer) {
          clearTimeout(this.cleanTimer);
        }
        this.msgs = [];
        this.msgs.push({severity: 'error', summary: '操作错误', detail: '请先选择公司'});
        this.cleanTimer = setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }else {
        this.departmentDialog = true;
        console.log(this.CompanyId);
        this.userService.searchDepartmentTree(this.CompanyId).subscribe(
          (val) => {
            console.log(val);
            this.DepartmentTrees = this.initializeDepartmentTree(val.data);
            // console.log( this.CompanyTrees);
          }
        );
      }
    }

  }
  //选择职位
  public  dutyTreeClick(): void {
    console.log({companyId:this.modifyUser.organizationId,depId:this.modifyUser.deptId});
    if (this.modifyFlag === 1){
      this.dutyDialog = true;
      console.log(this.CompanyId);
      this.userService.searchCompanyIdDepIdDutyList({companyId:this.modifyUser.organizationId,deptId:this.modifyUser.deptId}).subscribe(
        (val) => {
          console.log(val);
          if(val.data){
            this.DutyTrees = this.initializeDutyTree(val.data);

          }
          // console.log( this.CompanyTrees);
        }
      );
    }else {
      if (this.CompanyId === undefined) {
        if (this.cleanTimer) {
          clearTimeout(this.cleanTimer);
        }
        this.msgs = [];
        this.msgs.push({severity: 'error', summary: '操作错误', detail: '请先选择公司'});
        this.cleanTimer = setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }else {
        this.dutyDialog = true;
        // console.log(this.CompanyId);
        this.userService.searchCompanyIdDepIdDutyList({companyId:this.CompanyId,deptId:this.DepartmentTree.id}).subscribe(
          (val) => {
            console.log(val);
            if(val.data){
                this.DutyTrees = this.initializeDutyTree(val.data);
            }
            // console.log( this.CompanyTrees);
          }
        );
      }
    }
  }

  public treeSelectCompanyClick(): void {
    this.Companylabel = this.CompanyTree.label;
    this.companyDialog = false;
    this.CompanyId = this.CompanyTree.id;
    this.addUser.organizationName = this.CompanyTree.label;
    this.addUser.organizationId = this.CompanyTree.id;

    this.modifyUser.organizationName =  this.CompanyTree.label;
    this.modifyUser.organizationId =  this.CompanyTree.id;
    this.queryUser.organizationId =  this.CompanyTree.id;
    // this.queryDepartment.organizationId =  this.CompanyTree.id;
  }
  public treeSelectDepartmentClick (): void {
    this.Departmentlabel = this.DepartmentTree.label;
    this.departmentDialog = false;
    this.addUser.deptId = this.DepartmentTree.id;
    this.addUser.deptName = this.DepartmentTree.label;
    this.modifyUser.deptName = this.DepartmentTree.label;
    this.modifyUser.deptId = this.DepartmentTree.id;
    this.queryUser.deptId = this.DepartmentTree.id;

  }
  public treeSelectDutyClick (): void {
    this.Dutylabel = this.DutyTree.label;
    this.dutyDialog = false;
    this.addUser.dutyName = this.DutyTree.label;
    this.addUser.dutyId = this.DutyTree.id;

    this.modifyUser.dutyName = this.DutyTree.label;
    this.modifyUser.dutyId = this.DutyTree.id;
  }
  // 公司数据格式化
  public initializeCompanyTree(data): any {
    const oneChild1 = [];
    // console.log(data.length);
    for (let i = 0; i < data.length; i++) {
      const childnode1 = new CompanyTreeNode();
      childnode1.areaCode = data[i].areaCode;
      childnode1.areaName = data[i].areaName;
      childnode1.label = data[i].name;
      childnode1.id = data[i].id;
      if (data[i].list === null) {
        childnode1.children = [];
      } else {
        childnode1.children = this.initializeCompanyTree(data[i].list);
      }
      oneChild1.push(childnode1);
    }
    return oneChild1;
  }

  // 部门数据格式化
  public initializeDepartmentTree(data): any {
    const oneChild1 = [];
    // console.log(data.length);
    for (let i = 0; i < data.length; i++) {
      const childnode1 = new DepartmentTreeNode();
      childnode1.label = data[i].deptName;
      childnode1.telNumber = data[i].telNumber;
      childnode1.id = data[i].id;
      childnode1.pid = data[i].pid;
      childnode1.pids = data[i].pids;
      if (data[i].list === null) {
        childnode1.children = [];
      } else {
        childnode1.children = this.initializeDepartmentTree(data[i].list);
      }
      oneChild1.push(childnode1);
    }
    return oneChild1;
  }

  // 职位数据格式化
  public initializeDutyTree(data): any {
    const oneChild1 = [];
    // console.log(data.length);
    for (let i = 0; i < data.length; i++) {
      const childnode1 = new DutyTreeNode();
      childnode1.label = data[i].dutyName;
      childnode1.id = data[i].id;
      childnode1.pid = data[i].pid;
      if (data[i].dutys === null) {
        childnode1.children = [];
      } else {
        childnode1.children = this.initializeDutyTree(data[i].dutys);
      }
      oneChild1.push(childnode1);
    }
    return oneChild1;
  }




  public  clearData(): void {
    this.addUser= new AddUser();
    this.Dutylabel = '请选择职位...';
    this.Companylabel = '请选择公司...';
    this.Departmentlabel = '请选择部门...';
    this.addbirthday.inputFieldValue = null;
  }




  // // 数据格式化
  // public initializeSelectCompany(data): any {
  //   const oneChild = [];
  //   for (let i = 0; i < data.length; i++) {
  //     const childnode = new SelectItem();
  //     childnode.name = data[i].name;
  //     childnode.id = data[i].id;
  //     oneChild.push(childnode);
  //   }
  //   return oneChild;
  // }
  //
  // public initializeSelectOrg(data): any {
  //   const oneChild = [];
  //   for (let i = 0; i < data.length; i++) {
  //     const childnode = new SelectItem();
  //     childnode.name = data[i].deptName;
  //     childnode.id = data[i].id;
  //     childnode.pid = data[i].pid;
  //     childnode.pids = data[i].pids;
  //     oneChild.push(childnode);
  //   }
  //   return oneChild;
  // }
  //
  // public initializeSelectDuty(data): any {
  //   const oneChild = [];
  //   for (let i = 0; i < data.length; i++) {
  //     const childnode = new SelectItem();
  //     childnode.name = data[i].dutyName;
  //     childnode.id = data[i].id;
  //     oneChild.push(childnode);
  //   }
  //   return oneChild;
  // }
  //分页查询
  public nowpageEventHandle(event: any) {
    this.nowPage = event;
    console.log('我是父组件');
    console.log(this.nowPage);
    this.userService.searchList({page: this.nowPage, nums: 10}).subscribe(
      (value) => {
        console.log(value);
        this.users = value.data.contents;
        this.users.map((val, index) => {
          val.gender = this.sex[val.gender - 1];
        });
      }
    );
    this.selectedUsers = null;
  }
}

import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {LimitService} from '../../../common/services/limit.service';
import {AddRole, modifyRole, Role} from '../../../common/model/limit-model';
import {ConfirmationService, Message, MessageService} from 'primeng/api';
import {GlobalService} from '../../../common/services/global.service';
import {
  AddTreeArea,
  CompanyTree,
  CompanyTreeNode,
  DepartmentTree,
  DepartmentTreeNode,
  DutyTreeNode,
  TreeNode
} from '../../../common/model/shared-model';

@Component({
  selector: 'app-limit-role',
  templateUrl: './limit-role.component.html',
  styleUrls: ['./limit-role.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class LimitRoleComponent implements OnInit {
  // table显示相关
  public roles: Role[]; // 整个table数据
  public cols: any[]; // 表头
  public role: any; // 接收选中的值
  public selectedRoles: Role[]; // 多个选择
  // 增加相关
  public addDialog: boolean; // 增加弹窗显示控制
  public addRole: AddRole = new AddRole();
  //分页相关
  public nowPage: any;
  public option: any;
  // 修改相关
  public modifyDialog: boolean;//控制显示弹窗显示
  public modifyRole: modifyRole = new modifyRole();

  //树形结构相关
  public addAreaTrees: AddTreeArea[]; // 区域树结构
  public addAreaTree: AddTreeArea = new AddTreeArea(); // 区域树选择
  public areaDialog: boolean; // 区域树弹窗

  public CompanyTrees: CompanyTree[];
  public companyDialog: boolean;// 公司树弹窗
  public CompanyTree: CompanyTree = new CompanyTree(); // 公司树选择

  public DepartmentTrees:  DepartmentTree[];
  public departmentDialog: boolean;// 部门树弹窗
  public DepartmentTree:  DepartmentTree = new  DepartmentTree(); // 部门树选择
  public CompanyId: number; // 区域查询的公司ID

  //条件查询相关
  public roleName: string;
  
  // 其他提示弹窗相关
  public cleanTimer: any; // 清除时钟
  public msgs: Message[] = []; // 消息弹窗
  constructor(
    private limitService: LimitService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private globalService: GlobalService
  ) {
  }

  ngOnInit() {
    this.cols = [
      {field: 'roleCode', header: '角色编码'},
      {field: 'roleName', header: '角色名称'},
      {field: 'description', header: '角色描述'},
      {field: 'idt', header: '添加时间'},
    ];
    this.uploadRoleData();
    this.roleName = null;
  }

  public uploadRoleData(): void {
    this.limitService.searchRoleList({page: 1, nums: 10}).subscribe(
      (value) => {
        console.log(value);
        this.option = {total: value.data.totalRecord, row:value.data.pageSize, nowpage: 1};
        this.roles = value.data.contents;
      }
    );
  }

  // 选中后赋值
  public onRowSelect(event): void {
    console.log(event.data);
    this.role = this.cloneCar(event.data);
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
    console.log(this.addRole);
    this.confirmationService.confirm({
      message: `确定要增加吗？`,
      header: '增加提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.globalService.eventSubject.next({display: true});
        this.limitService.addRoleItem(this.addRole).subscribe(
          (value) => {
            console.log(value);
            if (value.status === '200') {
              this.globalService.eventSubject.next({display: false});
              if (this.cleanTimer) {
                clearTimeout(this.cleanTimer);
              }
              this.msgs = [];
              this.msgs.push({severity: 'success', summary: '增加提醒', detail: value.message});
              this.uploadRoleData();
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

  // 删除
  public deleteFirm(): void {
    if (this.selectedRoles === undefined || this.selectedRoles.length === 0) {
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
        message: `确定要删除这${this.selectedRoles.length}项吗？`,
        header: '删除提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.globalService.eventSubject.next({display: true});
          if (this.selectedRoles.length === 1) {
            this.limitService.deleteRoleItem(this.selectedRoles[0].id).subscribe(
              (value) => {
                if (value.status === '200') {
                  setTimeout(() => {
                    this.globalService.eventSubject.next({display: false});
                    if (this.cleanTimer) {
                      clearTimeout(this.cleanTimer);
                    }
                    this.msgs = [];
                    this.selectedRoles = undefined;
                    this.msgs.push({severity: 'success', summary: '删除提醒', detail: value.message});
                    this.cleanTimer = setTimeout(() => {
                      this.msgs = [];
                    }, 3000);
                    this.uploadRoleData();
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
          } else {
            const ids = [];
            for (let i = 0; i < this.selectedRoles.length; i++) {
              ids.push(this.selectedRoles[i].id);
            }
            this.limitService.deleteRoleList(ids).subscribe(
              (value) => {
                if (value.status === '200') {
                  setTimeout(() => {
                    this.globalService.eventSubject.next({display: false});
                    if (this.cleanTimer) {
                      clearTimeout(this.cleanTimer);
                    }
                    this.msgs = [];
                    this.selectedRoles = undefined;
                    this.uploadRoleData();
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
    if (this.selectedRoles === undefined || this.selectedRoles.length === 0) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.msgs = [];
      this.msgs.push({severity: 'error', summary: '操作错误', detail: '请选择需要修改的项'});
      this.cleanTimer = setTimeout(() => {
        this.msgs = [];
      }, 3000);
    } else if (this.selectedRoles.length > 0 && this.selectedRoles.length <= 1) {
      this.modifyDialog = true;
      this.modifyRole.id = this.selectedRoles[0].id;
      this.modifyRole.description = this.selectedRoles[0].description;
      this.modifyRole.idt = this.selectedRoles[0].idt;
      this.modifyRole.roleCode = this.selectedRoles[0].roleCode;
      this.modifyRole.roleName = this.selectedRoles[0].roleName;
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

  // 修改确认
  public modifySure(): void {
    this.confirmationService.confirm({
      message: `确定要修改吗？`,
      header: '修改提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.globalService.eventSubject.next({display: true});
        this.limitService.modifyRoleItem(this.modifyRole).subscribe(
          (value) => {
            console.log(value);
            if (value.status === '200') {
              this.globalService.eventSubject.next({display: false});
              if (this.cleanTimer) {
                clearTimeout(this.cleanTimer);
              }
              this.msgs = [];
              this.selectedRoles = undefined;
              this.msgs.push({severity: 'success', summary: '修改提醒', detail: value.message});
              this.uploadRoleData();
              this.cleanTimer = setTimeout(() => {
                this.msgs = [];
              }, 3000);
              this.modifyDialog = false;
            } else {
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

  //条件查询
  public  queryRole(): void {
    console.log(this.roleName);
    this.limitService.searchRole({page: 1, nums: 10},{roleName:this.roleName}).subscribe(
      (value) => {
        console.log(value);
        this.option = {total: value.data.totalRecord, row:value.data.pageSize};
        this.roles = value.data.contents;
      }
    );
  }
  // 重置数据
  public  resetQueryRole(): void {
    this.roleName = null;
    this.uploadRoleData();
  }

  //选择区域
  public AreaTreeClick(): void {
    this.areaDialog = true;
    this.limitService.searchArea({page: 1, nums: 100}).subscribe(
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
    this.limitService.searchCompanyTree().subscribe(
      (val) => {
        this.CompanyTrees = this.initializeCompanyTree(val.data);
      }
    );
  }

  //选择部门
  public  departmentTreeClick(): void {
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
        this.limitService.searchDepartmentTree(this.CompanyId).subscribe(
          (val) => {
            console.log(val);
            this.DepartmentTrees = this.initializeDepartmentTree(val.data);
            // console.log( this.CompanyTrees);
          }
        );
      }
  }

  public treeSelectCompanyClick(): void {
    this.companyDialog = false;
    this.CompanyId = this.CompanyTree.id;  //根据公司id查部门

  }
  public treeSelectDepartmentClick (): void {
    this.departmentDialog = false;
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

  //分页组件
  public nowpageEventHandle(event: any) {
    this.nowPage = event;
    // console.log('我是父组件');
    // console.log(this.nowPage);
    this.limitService.searchRoleList({page: this.nowPage, nums: 10}).subscribe(
      (value) => {
        console.log(value);
        this.option = {total: value.data.totalRecord, row:value.data.pageSize};
        this.roles = value.data.contents;
      }
    );
    this.selectedRoles = null;
  }
}

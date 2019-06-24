import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ConfirmationService, Message, MessageService} from 'primeng/api';
import {OrgService} from '../../../common/services/org.service';
import {GlobalService} from '../../../common/services/global.service';
import {AddDuty, Duty, ModifyDuty, QueryDuty} from '../../../common/model/org-model';
import {
  AddTreeArea,
  CompanyTree,
  CompanyTreeNode,
  DepartmentTree,
  DepartmentTreeNode,
  DutyTree,
  DutyTreeNode,
  SelectItem, TreeNode
} from '../../../common/model/shared-model';

@Component({
  selector: 'app-org-duty',
  templateUrl: './org-duty.component.html',
  styleUrls: ['./org-duty.component.css'],
  encapsulation: ViewEncapsulation.None
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

  //树结构相关

  public CompanyTrees: CompanyTree[];
  public companyDialog: boolean;// 公司树弹窗
  public CompanyTree: CompanyTree = new CompanyTree(); // 公司树选择

  public DepartmentTrees:  DepartmentTree[];
  public departmentDialog: boolean;// 公司树弹窗
  public DepartmentTree:  DepartmentTree = new  DepartmentTree(); // 区域树选择
  public CompanyId: number; // 区域查询的公司ID

  public DutyTrees:  DutyTree[];
  public dutyDialog: boolean;// 公司树弹窗
  public DutyTree:  DutyTree = new  DutyTree(); // 区域树选择
  public Companylabel = '请选择公司...';
  public Departmentlabel = '请选择部门...';
  public Dutylabel = '请选择职位...';
  // public DepartmentId: number; // 区域查询的公司ID
  // 分页相关
  public option: any;
  public nowPage: any;

  //条件查询
  public addAreaTrees: AddTreeArea[]; // 区域树结构
  public addAreaTree: AddTreeArea = new AddTreeArea(); // 区域树选择
  public areaDialog: boolean; // 区域树弹窗

  //条件查询相关
  public queryDuty: QueryDuty = new QueryDuty;

  // 修改相关
  public modifyDialog: boolean;//修改弹窗显示控制
  public modifyDuty: ModifyDuty = new ModifyDuty();
  public modifyFlag = 0; //判断树形结构是修改还是删除
  
  public pdutyName: any;
  // 其他提示弹窗相关
  public cleanTimer: any; // 清除时钟
  public msgs: Message[] = []; // 消息弹窗
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private orgService: OrgService,
    private globalService: GlobalService
  ) {
  }

  ngOnInit() {
    this.cols = [
      {field: 'id', header: '职务id'},
      {field: 'dutyName', header: '职务名称'},
      {field: 'level', header: '部门等级'},
      {field: 'description', header: '部门描述'},
      {field: 'organizationName', header: '所属公司'},
    ];
    this.updateDutyDate(1);
    this.orgService.searchCompanyList({page: 1, nums: 100}).subscribe(
      (val) => {
        this.addCompanySelect = this.initializeSelectCompany(val.data.contents);
      }
    );
    this.queryDuty.deptId = null;
    this.queryDuty.organizationId = null;
    this.queryDuty.pid = null;
    this.queryDuty.dutyName = null;
  }

  public updateDutyDate(page): void {
    this.orgService.searchDutyList({page: page, nums: 10}).subscribe(
      (val) => {
        console.log(val);
        this.duties = val.data.contents;
        this.option = {total: val.data.totalRecord, row: val.data.pageSize, nowpage: val.data.pageNo};

      }
    );
  }

  public cleanData(): void {
    this.addDuty = new AddDuty();
    this.CompanyTree.label = null;
    this.DepartmentTree.label = null;
    this.DutyTree.label = null;
    // this.addCompanySelect = [];
    // this.addDepSelect = [];
    // this.addDepTopDutySelect = [];
    this.Companylabel = '请选择公司...';
    this.Departmentlabel = '请选择部门...';
    this.Dutylabel = '请选择职位...'
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
    this.modifyFlag = 0;
    console.log(this.modifyFlag);
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
              this.updateDutyDate(this.nowPage);
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
                // this.cleanData();
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
                  this.updateDutyDate(this.nowPage);
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
            for (let i = 0; i < this.selectedDuties.length; i++) {
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
                    this.updateDutyDate(this.nowPage);
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
    // console.log(this.modifyFlag);
    if (this.selectedDuties === undefined || this.selectedDuties.length === 0) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.msgs = [];
      this.msgs.push({severity: 'error', summary: '操作错误', detail: '请选择需要修改的项'});
      this.cleanTimer = setTimeout(() => {
        this.msgs = [];
      }, 3000);
    } else if (this.selectedDuties.length === 1) {
      this.modifyDialog = true;
      if (this.selectedDuties[0].pid) {
        this.orgService.searchIdDepIdDutyList(this.selectedDuties[0].pid).subscribe(
          (value) => {
            console.log(value);

            if(value.data)
            {

              this.pdutyName = value.data.dutyName;

            }
            // this.addDepSelect = this.initializeSelectOrg(value.data);
          }
        );
      }
      /*this.orgService.searchCompanyIdDepIdDutyList({companyId: this.selectedDuties[0].organizationId, deptId: null}).subscribe(
        (val) => {
          console.log(val);
          this.addDepTopDutySelect = this.initializeSelectDuty(val.data);
        }
      );
      this.orgService.searchCompanyIdDepIdDutyList({companyId: this.selectedDuties[0].organizationId, deptId: this.selectedDuties[0].deptId}).subscribe(
        (val) => {
          console.log(val);
          this.addDepTopDutySelect = this.initializeSelectDuty(val.data);
        }
      );*/
      this.modifyDuty.id = this.selectedDuties[0].id;
      this.modifyDuty.pid = this.selectedDuties[0].pid;
      this.modifyDuty.deptId = this.selectedDuties[0].deptId;
      this.modifyDuty.dutyName = this.selectedDuties[0].dutyName;
      this.modifyDuty.level = this.selectedDuties[0].level;
      this.modifyDuty.quantity = this.selectedDuties[0].quantity;
      this.modifyDuty.pos = this.selectedDuties[0].pos;
      this.modifyDuty.boss = this.selectedDuties[0].boss;
      this.modifyDuty.description = this.selectedDuties[0].description;
      this.modifyDuty.leaf = this.selectedDuties[0].leaf;
      this.modifyDuty.organizationId = this.selectedDuties[0].organizationId;
      this.modifyDuty.organizationName = this.selectedDuties[0].organizationName;
      this.modifyDuty.deptName = this.selectedDuties[0].deptName;

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
    console.log(this.modifyDuty);
    if (this.modifyDuty.boss === '1') {
      this.modifyDuty.boss = false;
    } else {
      this.modifyDuty.boss = true;
    }
    console.log(this.modifyDuty);
    this.confirmationService.confirm({
      message: '确定要修改吗？',
      header: '修改提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.globalService.eventSubject.next({display: true});
        this.orgService.modifyDutyList(this.modifyDuty).subscribe(
          (value) => {
            if (value.status === '200') {
              this.globalService.eventSubject.next({display: false});
              if (this.cleanTimer) {
                clearTimeout(this.cleanTimer);
              }
              this.msgs = [];
              this.selectedDuties = undefined;
              this.msgs.push({severity: 'success', summary: '修改提醒', detail: value.message});
              this.updateDutyDate(this.nowPage);
              this.cleanTimer = setTimeout(() => {
                this.msgs = [];
              }, 3000);
              this.modifyDialog = false;
              // this.cleanData();
            } else {
              console.log(value);
              setTimeout(() => {
                this.globalService.eventSubject.next({display: false});
                if (this.cleanTimer) {
                  clearTimeout(this.cleanTimer);
                }
                this.msgs = [];
                // this.cleanData();
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
  // 条件查询
  public dutyQuery(): void {
    this.orgService.searchDuty({page: 1, nums: 10},this.queryDuty).subscribe(
      (val) => {
        console.log(val);
        this.duties = val.data.contents;
        this.option = {total: val.data.totalRecord, row: val.data.pageSize};
      }
    );
  }
  //重置
  public  resetdutyQuery(): void {
    this.queryDuty.deptId = null;
    this.queryDuty.organizationId = null;
    this.queryDuty.pid = null;
    this.queryDuty.dutyName = null;
    this.Companylabel = '请选择公司...';
    this.Departmentlabel = '请选择部门...';
    this.Dutylabel = '请选择职位...';
    this.updateDutyDate(this.nowPage);
  }
  // //选择区域
  // public AreaTreeClick(): void {
  //   this.areaDialog = true;
  //   this.orgService.searchAreaList({page: 1, nums: 100}).subscribe(
  //     (val) => {
  //       this.addAreaTrees = this.initializeTree(val.data.contents);
  //       console.log(this.addAreaTrees);
  //     }
  //   );
  // }


  public treeOnNodeSelect(event): void {
    this.areaDialog = false;
    // this.addAreaTreeSelect.push(event.node);
    // console.log(this.addAreaTree);
  }
  public treeSelectAreaClick(): void {
    this.areaDialog = false;
  }
// 区划数据格式化
//   public initializeTree(data): any {
//     const oneChild = [];
//     for (let i = 0; i < data.length; i++) {
//       const childnode = new TreeNode();
//       childnode.label = data[i].areaName;
//       childnode.id = data[i].id;
//       childnode.areaCode = data[i].areaCode;
//       childnode.parentId = data[i].parentId;
//       childnode.enabled = data[i].enabled;
//       childnode.cityType = data[i].cityType;
//       childnode.level = data[i].level;
//       if (childnode === null) {
//         childnode.children = [];
//       } else {
//         childnode.children = this.initializeTree(data[i].administrativeAreaTree);
//       }
//       oneChild.push(childnode);
//     }
//     console.log(oneChild);
//     return oneChild;
//   }
  //选择公司
  public CompanyTreeClick(): void {
    this.companyDialog = true;
    this.orgService.searchCompanyTree().subscribe(
      (val) => {
        this.CompanyTrees = this.initializeCompanyTree(val.data);
      }
    );
  }

  //选择部门
  public  departmentTreeClick(): void {
    if (this.modifyFlag === 1){
      this.departmentDialog = true;
      console.log(this.modifyDuty.organizationId);
      this.orgService.searchDepartmentTree(this.modifyDuty.organizationId).subscribe(
        (val) => {
          console.log(val);
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
        this.orgService.searchDepartmentTree(this.CompanyId).subscribe(
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
    if (this.modifyFlag === 1){
      this.dutyDialog = true;
      console.log(this.CompanyId);
      this.orgService.searchCompanyIdDepIdDutyList({companyId:this.modifyDuty.organizationId,deptId:this.modifyDuty.deptId}).subscribe(
        (val) => {
          console.log(val);
          if (val.data){
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
      }else{
        this.dutyDialog = true;
        console.log(this.DepartmentTree.id);
        this.orgService.searchCompanyIdDepIdDutyList({companyId:this.CompanyId,deptId:this.DepartmentTree.id}).subscribe(
          (val) => {
            console.log(val);
            this.DutyTrees = this.initializeDutyTree(val.data);
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
    this.addDuty.organizationName = this.CompanyTree.label;
    this.addDuty.organizationId = this.CompanyTree.id;

    this.modifyDuty.organizationName =  this.CompanyTree.label;
    this.modifyDuty.organizationId =  this.CompanyTree.id;
    this.queryDuty.organizationId = this.CompanyTree.id;
    // this.queryDepartment.organizationId =  this.CompanyTree.id;
  }
  public treeSelectDepartmentClick (): void {
    this.Departmentlabel = this.DepartmentTree.label;

    this.departmentDialog = false;
    this.addDuty.pid = this.DepartmentTree.pid;
    this.addDuty.deptName = this.DepartmentTree.label;
    this.modifyDuty.deptName = this.DepartmentTree.label;
    this.modifyDuty.id = this.DepartmentTree.pid;
    this.queryDuty.deptId = this.DepartmentTree.id;
  }
  public treeSelectDutyClick (): void {
    this.pdutyName = this.DutyTree.label;

    this.Dutylabel = this.DutyTree.label;
    this.dutyDialog = false;
    this.addDuty.pid = this.DutyTree.pid;
    this.modifyDuty.pid = this.DutyTree.pid;
    console.log(this.DutyTree.pid);
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




  // // 选择公司
  // public companyChange(e): void {
  //   this.addDuty.organizationName = e.value.name;
  //   this.addDuty.organizationId = e.value.id;
  //   this.modifyDuty.organizationName = e.value.name;
  //   this.modifyDuty.organizationId = e.value.id;
  //   this.modifyDuty.deptName = '选择所属部门...';
  //   this.orgService.searchCompanyIdDepList(e.value.id).subscribe(
  //     (value) => {
  //       console.log(value);
  //       this.addDepSelect = this.initializeSelectOrg(value.data);
  //     }
  //   );
  //   this.orgService.searchCompanyIdDepIdDutyList({companyId: e.value.id, depId: null}).subscribe(
  //     (val) => {
  //       console.log(val);
  //       this.addDepTopDutySelect = this.initializeSelectDuty(val.data);
  //     }
  //   );
  // }
  //
  // // 选择部门
  // public orgsChange(e): void {
  //   this.addDuty.deptName = e.value.name;
  //   this.addDuty.deptId = e.value.id;
  //   this.modifyDuty.deptName = e.value.name;
  //   this.modifyDuty.deptId = e.value.id;
  //   // this.modifyDuty.dutyName = '请选择所属职务...';
  //   this.orgService.searchCompanyIdDepIdDutyList({companyId: this.addDuty.organizationId, depId: e.value.id}).subscribe(
  //     (val) => {
  //       console.log(val);
  //       this.addDepTopDutySelect = this.initializeSelectDuty(val.data);
  //     }
  //   );
  // }
  //
  // // 选择上级职务
  // public topDutyChange(e): void {
  //   console.log(e);
  //   this.addDuty.pid = e.value.id;
  //   this.modifyDuty.pid = e.value.id;
  // }

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

  public nowpageEventHandle(event: any) {
    this.nowPage = event;
    console.log('我是父组件');
    console.log(this.nowPage);
    this.orgService.searchDutyList({page: this.nowPage, nums: 10}).subscribe(
      (val) => {
        console.log(val);
        this.duties = val.data.contents;
        this.option = {total: val.data.totalRecord, row: val.data.pageSize, nowpage: val.data.pageNo};

        // this.option = {total: val.data.totalRecord, row: val.data.pageSize};
      }
    );
    this.selectedDuties = null;
  }
}

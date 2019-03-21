import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AddDepartment, Department, DepartmentType, ModifyDepartment, queryCompany, queryDepartment} from '../../../common/model/org-model';
import {
  AddTreeArea,
  CompanyTree,
  CompanyTreeNode,
  DepartmentTree,
  DepartmentTreeNode,
  SelectItem,
  TreeNode
} from '../../../common/model/shared-model';
import {ConfirmationService, Message, MessageService} from 'primeng/api';
import {OrgService} from '../../../common/services/org.service';
import {GlobalService} from '../../../common/services/global.service';
import {e} from '@angular/core/src/render3';
import {number} from 'ng4-validators/src/app/number/validator';

@Component({
  selector: 'app-department',
  templateUrl: './org-department.component.html',
  styleUrls: ['./org-department.component.css'],
  encapsulation: ViewEncapsulation.None
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
  public CompanyTrees: CompanyTree[];
  public companyDialog: boolean;// 公司树弹窗
  public CompanyTree: CompanyTree = new CompanyTree(); // 区域树选择

  public DepartmentTrees:  DepartmentTree[];
  public departmentDialog: boolean;// 公司树弹窗
  public DepartmentTree:  DepartmentTree = new  DepartmentTree(); // 区域树选择
  public CompanyId: number; // 区域查询的公司ID
  public Companylabel = '请选择公司...';
  public Departmentlabel = '请选择部门...';


  //条件查询
  public DepartmentType: any;
  public addAreaTrees: AddTreeArea[]; // 区域树结构
  public addAreaTree: AddTreeArea = new AddTreeArea(); // 区域树选择
  public areaDialog: boolean; // 区域树弹窗
  public queryDepartment: queryDepartment = new queryDepartment();
  public dType: any;
  public nowPage: any;
  public option: any;
  //修改相关
  public modifyDialog: boolean;//修改弹窗显示控制
  public modifyDepartment: ModifyDepartment = new ModifyDepartment();
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
  ) {
  }

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
    this.DepartmentType = [{label:'服务区类',value:1},{label:'非服务区类',value:2}];
    this.queryDepartment.deptCategory = null;
    this.queryDepartment.deptCode = null;
    this.queryDepartment.organizationId = null;
    this.queryDepartment.deptName = null;
    this.queryDepartment.pid = null;
    this.updateOrgDate();
  }

  public updateOrgDate(): void {
    this.orgService.searchDepartList({page: 1, nums: 10}).subscribe(
      (val) => {
        this.orgs = val.data.contents;
        this.option = {total:val.data.totalRecord, row:val.data.pageSize}

      }
    );
    this.orgService.searchCompanyList({page: 1, nums: 100}).subscribe(
      (val) => {
        this.addCompanySelect = this.initializeSelectCompany(val.data.contents);

      }
    );
  }
  // 选中后赋值
  public onRowSelect(event): void {
    console.log(event.data);
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
      reject: () => {
      }
    });
  }

  // 删除
  public deleteFirm(): void {
    console.log(this.selectedorgs);
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
            for (let i = 0; i < this.selectedorgs.length; i++) {
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
        reject: () => {
        }
      });
    }
  }

  // 修改
  public modifybtn(): void {
    if (this.selectedorgs === undefined || this.selectedorgs.length === 0) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.msgs = [];
      this.msgs.push({severity: 'error', summary: '操作错误', detail: '请选择需要修改的项'});
      this.cleanTimer = setTimeout(() => {
        this.msgs = [];
      }, 3000);
    } else if (this.selectedorgs.length === 1) {
      this.modifyDialog = true;
      this.orgService.searchCompanyIdDepList(this.selectedorgs[0].id).subscribe(
        (value) => {
          if (value.data) {
            this.addOrgSelect = this.initializeSelectOrg(value.data);
          }
        }
      );
      this.modifyDepartment.id = this.selectedorgs[0].id;
      this.modifyDepartment.organizationId = this.selectedorgs[0].organizationId;
      this.modifyDepartment.organizationName = this.selectedorgs[0].organizationName;
      this.modifyDepartment.deptName = this.selectedorgs[0].deptName;
      this.modifyDepartment.pDeptName = this.selectedorgs[0].pDeptName;
      this.modifyDepartment.deptCode = this.selectedorgs[0].deptCode;
      this.modifyDepartment.deptCategory = this.selectedorgs[0].deptCategory;
      this.modifyDepartment.fax = this.selectedorgs[0].fax;
      this.modifyDepartment.telNumber = this.selectedorgs[0].telNumber;
      this.modifyDepartment.description = this.selectedorgs[0].description;
      this.modifyDepartment.endFlag = this.selectedorgs[0].endFlag;
      this.modifyDepartment.pid = this.selectedorgs[0].pid;
      this.modifyDepartment.idt = this.selectedorgs[0].idt;
      console.log(this.modifyDepartment.organizationName);
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
    console.log(this.modifyDepartment);
    this.confirmationService.confirm({
      message: `确定要修改吗？`,
      header: '修改提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.globalService.eventSubject.next({display: true});
        this.orgService.modifyDepartList(this.modifyDepartment).subscribe(
          (value) => {
            if (value.status === '200') {
              this.globalService.eventSubject.next({display: false});
              if (this.cleanTimer) {
                clearTimeout(this.cleanTimer);
              }
              this.msgs = [];
              this.selectedorgs = undefined;
              this.msgs.push({severity: 'success', summary: '修改提醒', detail: value.message});
              this.updateOrgDate();
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

  //条件查询
  public conditionDepartmentQuery(): void {
    console.log(this.queryDepartment);
    this.orgService.searchDepart({page: 1, nums: 10},this.queryDepartment).subscribe(
      (val) => {
        console.log(val);

        this.orgs = val.data.contents;
      }
    );
  }
  // 重置
  public resetDepartmentQuery(): void {
    this.queryDepartment.deptCategory = null;
    this.queryDepartment.deptCode = null;
    this.queryDepartment.organizationId = null;
    this.queryDepartment.deptName = null;
    this.queryDepartment.pid = null;
    this.clearData();
    this.dType = null;
    this.updateOrgDate();
    this.DepartmentType = [{label:'1、服务区类',value:1},{label:'2、非服务区类',value:2}];

  }

  // 部门类型
  public departmentTypeChange(e): void {
    console.log(e.value.value);
    if (e.value.value >=1){
      this.queryDepartment.deptCategory = e.value.value;
    }
  }
  //选择区域
  public AreaTreeClick(): void {
    this.areaDialog = true;
    this.orgService.searchAreaList({page: 1, nums: 100}).subscribe(
      (val) => {
        this.addAreaTrees = this.initializeTree(val.data.contents);
        console.log(this.addAreaTrees);
      }
    );
  }
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

  public treeOnNodeSelect(event) {
    // this.areaDialog = false;
    // this.addAreaTreeSelect.push(event.node);
    // console.log(this.addAreaTree);
  }
  public treeSelectAreaClick(): void {
    this.areaDialog = false;
  }
  public treeSelectCompanyClick(): void {
    this.Companylabel = this.CompanyTree.label;
    this.companyDialog = false;
    this.CompanyId = this.CompanyTree.id;
    this.addOrg.organizationName = this.CompanyTree.label;
    this.addOrg.organizationId = this.CompanyTree.id;

    this.modifyDepartment.organizationName =  this.CompanyTree.label;
    this.modifyDepartment.organizationId =  this.CompanyTree.id;
    this.queryDepartment.organizationId =  this.CompanyTree.id;
  }
  public treeSelectDepartmentClick (): void {
    this.Departmentlabel = this.DepartmentTree.label;
    this.departmentDialog = false;
    this.addOrg.pid = this.DepartmentTree.pid;
    this.addOrg.pids = `/${this.DepartmentTree.pid}/${this.DepartmentTree.pids}`;
    this.modifyDepartment.pDeptName = this.DepartmentTree.label;

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
  // 选择公司
  // public companyChange(e): void {
  //   console.log(e);
  //   this.addOrg.organizationName = e.value.name;
  //   this.addOrg.organizationId = e.value.id;
  //   this.modifyDepartment.organizationName = e.value.name;
  //   this.modifyDepartment.organizationId = e.value.id;
  //   this.modifyDepartment.pDeptName = '请选择部门';
  //   this.queryDepartment.organizationId = e.value.id;
  //   this.orgService.searchCompanyIdDepList(e.value.id).subscribe(
  //     (value) => {
  //       this.addOrgSelect = this.initializeSelectOrg(value.data);
  //     }
  //   );
  // }

  // 选择部门
  // public orgsChange(e): void {
  //   console.log(e);
  //   this.addOrg.pid = e.value.pid;
  //   this.addOrg.pids = `/${e.value.pid}/${e.value.pids}`;
  //   this.modifyDepartment.pid = e.value.pid;
  //   this.modifyDepartment.pDeptName = e.value.name;
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
      childnode.pid = data[i].pid;
      childnode.pids = data[i].pids;
      oneChild.push(childnode);
    }
    return oneChild;
  }

  public nowpageEventHandle(event: any) {
    this.nowPage = event;
    console.log('我是父组件');
    console.log(this.nowPage);
    this.orgService.searchDepartList({page:this.nowPage, nums: 10}).subscribe(
      (val) => {
        this.orgs = val.data.contents;
      }
    );
    this.selectedorgs = null;
  }

  public  clearData(): void {
      this.addAreaTree = new AddTreeArea();
      this.Companylabel = '请选择公司...';
      this.Departmentlabel= '请选择部门...';
  }
}

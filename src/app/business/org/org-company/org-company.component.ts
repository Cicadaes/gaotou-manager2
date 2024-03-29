import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {AddTreeArea, TreeNode} from '../../../common/model/shared-model';
import {ConfirmationService, Message, MessageService} from 'primeng/api';
import {GlobalService} from '../../../common/services/global.service';
import {DatePipe} from '@angular/common';
import {OrgService} from '../../../common/services/org.service';
import {AddCompany, Company, modifydCompany, queryCompany} from '../../../common/model/org-model';
import {Calendar, Dropdown} from 'primeng/primeng';

@Component({
  selector: 'app-org-company',
  templateUrl: './org-company.component.html',
  styleUrls: ['./org-company.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class OrgCompanyComponent implements OnInit {
  @ViewChild('addfoundDate') addfoundDate: Calendar;
  // table显示相关
  public companies: Company[]; // 整个table数据
  public cols: any[]; // 表头
  public cash: any; // 接收选中的值
  public selectedcompanies: Company[]; // 多个选择公司
  // 增加相关
  public addDialog: boolean; // 增加弹窗显示控制
  public areaDialog: boolean; // 区域树弹窗
  public addCompany: AddCompany = new AddCompany();
  public addAreaTrees: AddTreeArea[]; // 区域树结构
  public addAreaTree: AddTreeArea = new AddTreeArea(); // 区域树选择

  // 修改相关
  public modifyDialog: boolean; // 修改弹窗显示控制
  public modifyCompany: modifydCompany = new modifydCompany();

  // 条件查询相关
  public queryCompany: queryCompany = new queryCompany();
  public arealabel = '请选择区划...';
  //分页相关
  public nowPage = 1;
  public option: any;
  // 其他提示弹窗相关
  public cleanTimer: any; // 清除时钟
  public msgs: Message[] = []; // 消息弹窗
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private orgService: OrgService,
    private globalService: GlobalService,
    private datePipe: DatePipe,
  ) {
  }

  ngOnInit() {
    this.cols = [
      {field: 'name', header: '公司名称'},
      {field: 'telNumber', header: '公司电话'},
      {field: 'legalPerson', header: '企业法人'},
      {field: 'address', header: '公司地址'},
      {field: 'idt', header: '创建时间'},
    ];
    this.queryCompany.name = '';
    this.queryCompany.regNo = '';
    this.queryCompany.pid = null;
    this.updateCompanyDate(1);
  }

  public updateCompanyDate(page): void {
    this.orgService.searchCompanyList({page: page, nums: 10}).subscribe(
      (value) => {
        this.companies = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        console.log(value);
      }
    );
  }

  // 选中后赋值
  public onRowSelect(event): void {
    console.log(event);
  }

  // 增加
  public addsSave(): void {
    console.log(this.addCompany);
    this.confirmationService.confirm({
      message: `确定要增加吗？`,
      header: '增加提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.globalService.eventSubject.next({display: true});
        this.orgService.addCompanyItem(this.addCompany).subscribe(
          (value) => {
            if (value.status === '200') {
              this.globalService.eventSubject.next({display: false});
              if (this.cleanTimer) {
                clearTimeout(this.cleanTimer);
              }
              this.msgs = [];
              this.msgs.push({severity: 'success', summary: '增加提醒', detail: value.message});
              this.updateCompanyDate(this.nowPage);
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
    this.addCompany.foundDate = this.datePipe.transform(e, 'yyyy-MM-dd');
    this.modifyCompany.foundDate = this.datePipe.transform(e, 'yyyy-MM-dd');
    console.log(e);
    // console.log(this.addCompany.foundDate)
  }

  // 删除
  public deleteFirm(): void {
    if (this.selectedcompanies === undefined || this.selectedcompanies.length === 0) {
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
        message: `确定要删除这${this.selectedcompanies.length}项吗？`,
        header: '删除提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.globalService.eventSubject.next({display: true});
          if (this.selectedcompanies.length === 1) {
            this.orgService.deleteCompanyItem(this.selectedcompanies[0].id).subscribe(
              (value) => {
                if (value.status === '200') {
                  setTimeout(() => {
                    this.globalService.eventSubject.next({display: false});
                    /* this.selectedcompanies.map((val, inx) => {
                       const index = this.cashs.indexOf(val);
                       this.cashs = this.cashs.filter((val1, i) => i !== index);
                     });*/
                    if (this.cleanTimer) {
                      clearTimeout(this.cleanTimer);
                    }
                    this.msgs = [];
                    this.selectedcompanies = undefined;
                    this.msgs.push({severity: 'success', summary: '删除提醒', detail: value.message});
                    this.cleanTimer = setTimeout(() => {
                      this.msgs = [];
                    }, 3000);
                    this.updateCompanyDate(this.nowPage);
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
            for (let i = 0; i < this.selectedcompanies.length; i++) {
              ids.push(this.selectedcompanies[i].id);
            }
            this.orgService.deleteCompanyList(ids).subscribe(
              (value) => {
                if (value.status === '200') {
                  setTimeout(() => {
                    this.globalService.eventSubject.next({display: false});
                    /* this.selectedcompanies.map((val, inx) => {
                       const index = this.cashs.indexOf(val);
                       this.cashs = this.cashs.filter((val1, i) => i !== index);
                     });*/
                    if (this.cleanTimer) {
                      clearTimeout(this.cleanTimer);
                    }
                    this.msgs = [];
                    this.selectedcompanies = undefined;
                    this.updateCompanyDate(this.nowPage);
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
  public modifyBtn(): void {
    if (this.selectedcompanies === undefined || this.selectedcompanies.length === 0) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.msgs = [];
      this.msgs.push({severity: 'error', summary: '操作错误', detail: '请选择需要修改的项'});
      this.cleanTimer = setTimeout(() => {
        this.msgs = [];
      }, 3000);
    } else if (this.selectedcompanies.length === 1) {
      this.modifyDialog = true;
      this.modifyCompany.address = this.selectedcompanies[0].address;
      this.modifyCompany.areaCode = this.selectedcompanies[0].areaCode;
      this.modifyCompany.areaName = this.selectedcompanies[0].areaName;
      this.modifyCompany.postcode = this.selectedcompanies[0].postcode;
      this.modifyCompany.introduction = this.selectedcompanies[0].introduction;
      this.modifyCompany.category = this.selectedcompanies[0].category;
      this.modifyCompany.scale = this.selectedcompanies[0].scale;
      this.modifyCompany.email = this.selectedcompanies[0].email;
      this.modifyCompany.telNumber = this.selectedcompanies[0].telNumber;
      this.modifyCompany.fax = this.selectedcompanies[0].fax;
      this.modifyCompany.name = this.selectedcompanies[0].name;
      this.modifyCompany.longitude = this.selectedcompanies[0].longitude;
      this.modifyCompany.latitude = this.selectedcompanies[0].latitude;
      this.modifyCompany.regNo = this.selectedcompanies[0].regNo;
      this.modifyCompany.legalPerson = this.selectedcompanies[0].legalPerson;
      this.modifyCompany.foundDate = this.selectedcompanies[0].foundDate;
      this.modifyCompany.pid = this.selectedcompanies[0].pid;
      this.modifyCompany.idt = this.selectedcompanies[0].idt;
      this.modifyCompany.id = this.selectedcompanies[0].id;
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
    console.log(this.modifyCompany);
    this.confirmationService.confirm({
      message: `确定要修改吗？`,
      header: '修改提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.globalService.eventSubject.next({display: true});
        this.orgService.modifyCompanyList(this.modifyCompany).subscribe(
          (value) => {
            if (value.status === '200') {
              this.globalService.eventSubject.next({display: false});
              console.log(value.data);
              if (this.cleanTimer) {
                clearTimeout(this.cleanTimer);
              }
              this.selectedcompanies = undefined;
              this.msgs = [];
              this.msgs.push({severity: 'success', summary: '修改提醒', detail: value.message});
              this.updateCompanyDate(this.nowPage);
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
  public  conditionQuery(): void {
   console.log(this.queryCompany);
   this.orgService.searchCompany({page: 1, nums: 10},this.queryCompany).subscribe(
     (value) => {
       this.companies = value.data.contents;
       console.log(value);

     }
   );
  }
  // 重置
  public  resetCompanyQuery(): void {
    this.queryCompany.name = '';
    this.queryCompany.regNo = '';
    this.queryCompany.pid = null;
    this.arealabel = "请选择区划...";
    this.updateCompanyDate(this.nowPage);
  }

  // 选择区域
  public AreaTreeClick(): void {
    this.areaDialog = true;
    this.orgService.searchAreaList({page: 1, nums: 100}).subscribe(
      (val) => {
        this.addAreaTrees = this.initializeTree(val.data);
        console.log(val);
      }
    );
  }

  public treeOnNodeSelect(event) {
    // this.areaDialog = false;
    // this.addAreaTreeSelect.push(event.node);
    // console.log(this.addAreaTree);
  }

  public treeSelectAreaClick(): void {
    this.arealabel = this.addAreaTree.label;
    this.areaDialog = false;
    this.queryCompany.areaName = this.addAreaTree.label;
    this.addCompany.areaCode = this.addAreaTree.areaCode;
    this.addCompany.areaName = this.addAreaTree.label;
    this.modifyCompany.areaCode = this.addAreaTree.areaCode;
    this.modifyCompany.areaName = this.addAreaTree.label;
  }

  // 数据格式化
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
    return oneChild;
  }

  //分页查询
  public nowpageEventHandle(event: any) {
    this.nowPage = event;
    console.log('我是父组件');
    console.log(this.nowPage);
    this.orgService.searchCompanyList({page: this.nowPage, nums: 10}).subscribe(
      (value) => {
        this.companies = value.data.contents;
        console.log(value);
      }
    );
    this.selectedcompanies = null;
  }
  
  
  public cleardata (): void {
      this.arealabel = "请选择区划...";
      this.addCompany = new AddCompany();
      this.addfoundDate.inputFieldValue = null;
  }
}

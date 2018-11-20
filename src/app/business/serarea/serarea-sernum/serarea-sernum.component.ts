import { Component, OnInit } from '@angular/core';
import {SerareaService} from '../../../common/services/serarea.service';
import {ConfirmationService, Message, MessageService} from 'primeng/api';
import {GlobalService} from '../../../common/services/global.service';
import {AddSerarea, Serarea} from '../../../common/model/serarea-model';
import {AddTreeArea, SelectItem} from '../../../common/model/shared-model';
import {TreeNode} from '../../../common/model/cash-model';

@Component({
  selector: 'app-serarea-sernum',
  templateUrl: './serarea-sernum.component.html',
  styleUrls: ['./serarea-sernum.component.css']
})
export class SerareaSernumComponent implements OnInit {
  // table显示相关
  public serAreas: Serarea[]; // 整个table数据
  public cols: any[]; // 表头
  public serArea: any; // 接收选中的值
  public selectedSerAreas: Serarea[]; // 多个选择
  // 增加相关
  public addDialog: boolean; // 增加弹窗显示控制
  public addSerarea: AddSerarea = new AddSerarea(); // 添加参数字段
  public addCompanySelect: SelectItem[]; // 公司列表
  public addDepSelect: SelectItem[]; // 部门列表
  public areaDialog: boolean; // 区域树弹窗
  public addAreaTrees: AddTreeArea[]; // 区域树结构
  public addAreaTree: AddTreeArea = new AddTreeArea(); // 区域树选择
  public userDialog: boolean; // 区域树弹窗
  public addUserTrees: AddTreeArea[]; // 用户树结构
  public addUserTree: AddTreeArea = new AddTreeArea(); // 用户树选择
  public commonAttributeValues = []; // 公共属性
  public upAttribute = []; // 上行属性
  public downAttribute = []; // 下行属性
  public upSource: string;  // 上行起始点
  public upDestination: string;  // 上行终点
  public downSource: string;  // 下行起始点
  public downDestination: string;  // 下行终点
  // 修改
  public revampDialog: boolean; // 修改弹窗
  public revampSerArea: any;
  // 其他提示弹窗相关
  public cleanTimer: any; // 清除时钟
  public msgs: Message[] = []; // 消息弹窗
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private serareaService: SerareaService,
    private globalService: GlobalService
  ) { }

  ngOnInit() {
    this.cols = [
      {field: 'id', header: '服务区id'},
      {field: 'name', header: '服务区名'},
      {appDesc: 'createUserName', header: '创建的用户名'},
      {appDesc: 'idt', header: '创建时间'},
    ];
    this.updateApplyListData();
    // 初始化公司数据
    this.serareaService.searchCompanyList({page: 1, nums: 1000}).subscribe(
      (val) => {
        this.addCompanySelect = this.initializeSelectCompany(val.data.contents);
      }
    );
    // 初始化人员数据
    this.serareaService.searchUserList({page: 1, nums: 1000}).subscribe(
      (val) => {
        this.addUserTrees = this.initializeUserTree(val.data.contents);
        console.log(val.data.contents);
      }
    );
    this.serareaService.searchtSerareaAttribute().subscribe(
      (value) => {
        console.log(value.data);
        value.data.commonAttribute.map((val, index) => {
          this.commonAttributeValues.push(
            {attributeName: val.attributeDesc, value: ''}
          );
        });
        value.data.hasOrientationAttribute.map((val, index) => {
          this.upAttribute.push(
            {attributeName: val.attributeDesc, value: ''}
          );
          this.downAttribute.push(
            {attributeName: val.attributeDesc, value: ''}
          );
        });
      }
    );
  }
  public updateApplyListData(): void {
    this.serareaService.searchSerAraList({page: 1, nums: 1000}).subscribe(
      (value) => {
        this.serAreas = value.data.contents;
      }
    );
  }
  // 选中后赋值
  public onRowSelect(event): void {
    this.serArea = this.cloneCar(event.data);
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
    this.addSerarea.commonAttributeValues = this.commonAttributeValues;
    // 上行
    this.addSerarea.upAttributeValues.source = this.upSource;
    this.addSerarea.upAttributeValues.destination = this.upDestination;
    this.addSerarea.upAttributeValues.flag = '2';
    this.addSerarea.upAttributeValues.flagName = '上行';
    this.addSerarea.upAttributeValues.attributeValues = this.upAttribute;
    // 下行
    this.addSerarea.downAttributeValues.source = this.downSource;
    this.addSerarea.downAttributeValues.destination = this.downDestination;
    this.addSerarea.downAttributeValues.flag = '3';
    this.addSerarea.downAttributeValues.flagName = '下行';
    this.addSerarea.downAttributeValues.attributeValues = this.downAttribute;
    console.log(this.addSerarea);
    this.confirmationService.confirm({
      message: `确定要增加吗？`,
      header: '增加提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.globalService.eventSubject.next({display: true});
        this.serareaService.addSerAraItem(this.addSerarea).subscribe(
          (value) => {
            if (value.status === '200') {
              this.globalService.eventSubject.next({display: false});
              if (this.cleanTimer) {
                clearTimeout(this.cleanTimer);
              }
              this.msgs = [];
              this.msgs.push({severity: 'success', summary: '增加提醒', detail: value.message});
              this.updateApplyListData();
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
    if (this.selectedSerAreas === undefined || this.selectedSerAreas.length === 0) {
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
        message: `确定要删除这${this.selectedSerAreas.length}项吗？`,
        header: '删除提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.globalService.eventSubject.next({display: true});
          if (this.selectedSerAreas.length === 1) {
            this.serareaService.deleteSerAraItem(this.selectedSerAreas[0].id).subscribe(
              (value) => {
                if (value.status === '200') {
                  this.globalService.eventSubject.next({display: false});
                  if (this.cleanTimer) {
                    clearTimeout(this.cleanTimer);
                  }
                  this.msgs = [];
                  this.selectedSerAreas = undefined;
                  this.msgs.push({severity: 'success', summary: '删除提醒', detail: value.message});
                  this.cleanTimer = setTimeout(() => {
                    this.msgs = [];
                  }, 3000);
                  this.updateApplyListData();
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
            for (let i = 0; i < this.selectedSerAreas.length; i ++) {
              ids.push(this.selectedSerAreas[i].id);
            }
            this.serareaService.deleteSerAraList(ids).subscribe(
              (value) => {
                if (value.status === '200') {
                  this.globalService.eventSubject.next({display: false});
                  if (this.cleanTimer) {
                    clearTimeout(this.cleanTimer);
                  }
                  this.msgs = [];
                  this.selectedSerAreas = undefined;
                  this.updateApplyListData();
                  this.msgs.push({severity: 'success', summary: '删除提醒', detail: value.message});
                  this.cleanTimer = setTimeout(() => {
                    this.msgs = [];
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
  // 修改、保存修改
  public revampClick() {
    if (this.selectedSerAreas === undefined || this.selectedSerAreas.length === 0) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.msgs = [];
      this.msgs.push({severity: 'error', summary: '操作错误', detail: '请选择需要修改的项'});
      this.cleanTimer = setTimeout(() => {
        this.msgs = [];
      }, 3000);
      this.revampDialog = false;
    } else if (this.selectedSerAreas.length > 1) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.cleanTimer = setTimeout(() => {
        this.msgs = [];
      }, 3000);
      this.msgs.push({severity: 'error', summary: '操作错误', detail: '修改只能选择一项'});
      this.revampDialog = false;
    } else if (this.selectedSerAreas.length === 1) {
      // this.globalService.eventSubject.next({display: true});
      this.serareaService.searchSerAraListItem({id: this.serArea.id}).subscribe(
        (val) => {
          if (val.status === '200') {
            console.log(val.data);
            this.globalService.eventSubject.next({display: false});
          } else {
            // this.globalService.eventSubject.next({display: false});
            this.msgs = [];
            this.msgs.push({severity: 'error', summary: '请求异常', detail: '网络请求异常'});
            this.cleanTimer = setTimeout(() => {
              this.msgs = [];
            }, 3000);
          }
        }
      );
    }

  }
  public revampSave(): void {
    this.confirmationService.confirm({
      message: `确定要修改吗？`,
      header: '修改提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.globalService.eventSubject.next({display: true});
        this.serareaService.modifySerAraItem({}).subscribe(
          (value) => {
            if (value.state) {
              setTimeout(() => {
                this.globalService.eventSubject.next({display: false});
                if (this.cleanTimer) {
                  clearTimeout(this.cleanTimer);
                }
                this.msgs = [];
                this.msgs.push({severity: 'success', summary: '修改提醒', detail: value.msg});
                this.cleanTimer = setTimeout(() => {
                  this.msgs = [];
                }, 3000);
                this.selectedSerAreas = undefined;
                this.revampDialog = false;
              }, 3000);
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
      reject: () => {}
    });
  }
  // 选择公司
  public companyChange(e): void {
    this.addSerarea.organizationName = e.value.name;
    this.addSerarea.organizationId = e.value.id;
    this.revampSerArea.organizationName = e.value.name;
    this.revampSerArea.organizationId = e.value.id;
    this.serareaService.searchCompanyIdDepList(e.value.id).subscribe(
      (value) => {
        console.log(value);
        this.addDepSelect = this.initializeSelectOrg(value.data);
      }
    );
  }
  // 选择部门
  public orgsChange(e): void {
    this.addSerarea.deptName = e.value.name;
    this.addSerarea.deptId = e.value.id;
    this.revampSerArea.deptName = e.value.name;
    this.revampSerArea.deptId = e.value.id;
  }
  // 选择区域
  public AreaTreeClick(): void {
    this.areaDialog = true;
    this.serareaService.searchAreaList({page: 1, nums: 100}).subscribe(
      (val) => {
        this.addAreaTrees = this.initializeTree(val.data.contents);
      }
    );
  }
  public treeOnNodeSelect(event) {
    // this.areaDialog = false;
    // this.addAreaTreeSelect.push(event.node);
    // console.log(this.addAreaTree);
  }
  public treeSelectAreaClick(): void {
    const a = parseFloat(this.addAreaTree.level);
    if (a >= 2 ) {
      this.addSerarea.administrativeAreaId = this.addAreaTree.id;
      this.addSerarea.administrativeAreaName = this.addAreaTree.label;
      this.revampSerArea.administrativeAreaId = this.addAreaTree.id;
      this.revampSerArea.administrativeAreaName = this.addAreaTree.label;
      this.areaDialog = false;
    } else {
      this.msgs = [];
      this.msgs.push({severity: 'error', summary: '操作错误', detail: '请选择市'});
      this.cleanTimer = setTimeout(() => {
        this.msgs = [];
      }, 3000);
    }
  }
  // 选择用户
  public userTreeClick(): void {
    this.userDialog = true;
    this.serareaService.searchAreaList({page: 1, nums: 100}).subscribe(
      (val) => {
        this.addAreaTrees = this.initializeTree(val.data.contents);
      }
    );
  }
  public userTreeOnNodeSelect() {
    this.userDialog = false;
    this.addSerarea.chiefUserId = this.addUserTree.id;
    this.addSerarea.chiefName = this.addUserTree.label;
    this.addSerarea.chiefPhone = this.addUserTree.areaCode;
    this.revampSerArea.chiefUserId = this.addUserTree.id;
    this.revampSerArea.chiefName = this.addUserTree.label;
    this.revampSerArea.chiefPhone = this.addUserTree.areaCode;

  }
  // 上行下属性删除
  public upAttributeDelete(i): void {
    this.upAttribute = this.upAttribute.filter((item, index) => {
      return i !== index;
    });
  }
  public downAttributeDelete(i): void {
    this.downAttribute = this.upAttribute.filter((item, index) => {
      return i !== index;
    });
  }
  /************************数据格式化**************************/
 // 公司数据格式化
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
  // 组织数据格式化
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
  // 格式区划树
  public initializeTree(data): any {
    const oneChild = [];
    for (let i = 0; i < data.length; i++) {
      const childnode =  new TreeNode();
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
  // 格式化用户树
  public initializeUserTree(data): any {
    const oneChild = [];
    for (let i = 0; i < data.length; i++) {
      const childnode =  new TreeNode();
      childnode.label = data[i].realName;
      childnode.id = data[i].id;
      childnode.areaCode = data[i].telNumber;
      oneChild.push(childnode);
    }
    return oneChild;
  }
}

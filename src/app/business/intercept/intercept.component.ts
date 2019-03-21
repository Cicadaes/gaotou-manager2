import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {AddIntercept, Intercept, ModifyIntercept, QueryIntercept} from '../../common/model/intercept-model';
import {ConfirmationService, Message, MessageService} from 'primeng/api';
import {GlobalService} from '../../common/services/global.service';
import {InterceptService} from '../../common/services/intercept.service';
import {AddTreeArea, SelectItem} from '../../common/model/shared-model';
import {TreeNode} from '../../common/model/cash-model';
import {Dropdown} from 'primeng/primeng';

@Component({
  selector: 'app-intercept',
  templateUrl: './intercept.component.html',
  styleUrls: ['./intercept.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class InterceptComponent implements OnInit {
  @ViewChild('addserviceArea1') addserviceArea: Dropdown;
  @ViewChild('addserviceArea1') addserviceArea1: Dropdown;
  @ViewChild('addserviceArea1') addsaOrientation: Dropdown;
  @ViewChild('addserviceArea1') addsaOrientation1: Dropdown;
  // table显示相关
  public intercepts: Intercept[]; // 整个table数据
  public cols: any[]; // 表头
  public intercept: any; // 接收选中的值
  public selectedintercepts: Intercept[]; // 多个选择
  public addArealabel: any;
  // 增加相关
  public addDialog: boolean; // 增加弹窗显示控制
  public addIntercept: AddIntercept = new AddIntercept();
  public areaDialog: boolean; // 区域树弹窗
  public addAreaTrees: AddTreeArea[]; // 区域树结构
  public addAreaTree: AddTreeArea = new AddTreeArea(); // 区域树选择
  public addServicesAreas: SelectItem[]; // 服务区列表
  public highsdData: SelectItem[]; // 上下行选择数据
  //分页相关
  public nowPage: any;
  public option: any;
  //条件查询相关
  public bayonetTypes: any; //选择卡口分类
  public bayonetLabel: any;
  public ServiceDown: any; //选择服务区
  public orientationDown: any; //选择上下行
  public queryIntercept: QueryIntercept = new QueryIntercept();
  // 修改相关
  public modifyDialog: boolean;//增加弹窗显示控制
  public modifyIntercept: ModifyIntercept = new ModifyIntercept();//增加弹窗显示控制
  public modifyhighsdData: any;
  // 其他提示弹窗相关
  public cleanTimer: any; // 清除时钟
  public msgs: Message[] = []; // 消息弹窗
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private interceptService: InterceptService,
    private globalService: GlobalService
  ) {
  }

  ngOnInit() {
    this.cols = [
      {field: 'bayonetCode', header: '卡口编号'},
      {field: 'bayonetType', header: '卡口类型'},
      {field: 'orientationFlag', header: '服务区方向'},
      {field: 'bayonetName', header: '卡口名称'},
      {field: 'idt', header: '添加时间'},
    ];
    this.bayonetTypes = [{label:'进口',value:1},{label:'出口',value:2}];
    this.updateInterceptDate();
    this.queryIntercept.serviceAreaName = null;
    this.queryIntercept.serviceAreaId = null;
    this.queryIntercept.bayonetCode = null;
    this.queryIntercept.bayonetType = null;
    this.queryIntercept.orientationDO = null;
  }

  public updateInterceptDate(): void {
    this.interceptService.searchList({page: 1, nums: 10, bayonetType: '2'}).subscribe(
      (value) => {
        console.log(value);
        this.option = {total: value.data.totalRecord, row: value.data.pageSize};
        this.intercepts = value.data.contents;
      }
    );
  }

  // 选中后赋值
  public onRowSelect(event): void {
    console.log(event.data);
    this.modifyhighsdData = null;
    this.modifyIntercept.administrativeAreaName = null;
    this.modifyIntercept.serviceAreaName = null;
    this.addServicesAreas = null;
    this.intercept = this.cloneCar(event.data);
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
    console.log(this.addIntercept);
    this.confirmationService.confirm({
      message: `确定要增加吗？`,
      header: '增加提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.globalService.eventSubject.next({display: true});
        this.interceptService.addItem(this.addIntercept).subscribe(
          (value) => {
            // console.log(value);
            if (value.status === '200') {
              this.globalService.eventSubject.next({display: false});
              if (this.cleanTimer) {
                clearTimeout(this.cleanTimer);
              }
              this.msgs = [];
              this.msgs.push({severity: 'success', summary: '增加提醒', detail: value.message});
              this.updateInterceptDate();
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
    if (this.selectedintercepts === undefined || this.selectedintercepts.length === 0) {
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
        message: `确定要删除这${this.selectedintercepts.length}项吗？`,
        header: '删除提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.globalService.eventSubject.next({display: true});
          if (this.selectedintercepts.length === 1) {
            this.interceptService.deleteItem(this.selectedintercepts[0].id).subscribe(
              (value) => {
                if (value.status === '200') {
                  setTimeout(() => {
                    this.globalService.eventSubject.next({display: false});
                    if (this.cleanTimer) {
                      clearTimeout(this.cleanTimer);
                    }
                    this.msgs = [];
                    this.selectedintercepts = undefined;
                    this.msgs.push({severity: 'success', summary: '删除提醒', detail: value.message});
                    this.cleanTimer = setTimeout(() => {
                      this.msgs = [];
                    }, 3000);
                    this.updateInterceptDate();
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
            for (let i = 0; i < this.selectedintercepts.length; i++) {
              ids.push(this.selectedintercepts[i].id);
            }
            this.interceptService.deleteList(ids).subscribe(
              (value) => {
                console.log(value);
                if (value.status === '200') {
                  setTimeout(() => {
                    this.globalService.eventSubject.next({display: false});
                    if (this.cleanTimer) {
                      clearTimeout(this.cleanTimer);
                    }
                    this.msgs = [];
                    this.selectedintercepts = undefined;
                    this.updateInterceptDate();
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
    if (this.selectedintercepts === undefined || this.selectedintercepts.length === 0) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.msgs = [];
      this.msgs.push({severity: 'error', summary: '操作错误', detail: '请选择需要修改的项'});
      this.cleanTimer = setTimeout(() => {
        this.msgs = [];
      }, 3000);
    } else if (this.selectedintercepts.length === 1) {
      this.modifyDialog = true;
      this.interceptService.searchServiceAreaList(this.selectedintercepts[0].administrativeAreaId).subscribe(
        value => {
          // console.log(value.data);
          if(value.data){
            this.addServicesAreas = this.initializeServiceArea(value.data);

          }
        }
      );
      this.interceptService.searchHighDirection(this.selectedintercepts[0].serviceAreaId).subscribe(
        (value) => {
          if(value.data){
            this.highsdData = this.initializeServiceAreaDirec(value.data);
          }
          // console.log(value);
        }
      );
      this.interceptService.QuryHighDirection(this.selectedintercepts[0].serviceAreaId).subscribe(
        (value) => {
          // console.log(value);
          if(value.data){
            this.modifyhighsdData = value.data.source + '-' + value.data.destination;
          }
        }
      );
      this.modifyIntercept.bayonetCode = this.selectedintercepts[0].bayonetCode;
      this.modifyIntercept.bayonetName = this.selectedintercepts[0].bayonetName;
      this.modifyIntercept.bayonetType = this.selectedintercepts[0].bayonetType;
      this.modifyIntercept.id = this.selectedintercepts[0].id;
      this.modifyIntercept.idt = this.selectedintercepts[0].idt;
      this.modifyIntercept.serviceAreaId = this.selectedintercepts[0].serviceAreaId;
      this.modifyIntercept.serviceAreaName = this.selectedintercepts[0].serviceAreaName;
      this.modifyIntercept.administrativeAreaId = this.selectedintercepts[0].administrativeAreaId;
      this.modifyIntercept.administrativeAreaName = this.selectedintercepts[0].administrativeAreaName;
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
        this.interceptService.modifyList(this.modifyIntercept).subscribe(
          (value) => {
            if (value.status === '200') {
              this.globalService.eventSubject.next({display: false});
              if (this.cleanTimer) {
                clearTimeout(this.cleanTimer);
              }
              this.msgs = [];
              this.selectedintercepts = undefined;
              this.msgs.push({severity: 'success', summary: '修改提醒', detail: value.message});
              this.updateInterceptDate();
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

  // 条件查询
  public queryInterceptData (): void {
    this.interceptService.searchIntercept({page: 1, nums: 10},this.queryIntercept).subscribe(
      (value) => {
        console.log(value);
        this.option = {total: value.data.totalRecord, row: value.data.pageSize};
        this.intercepts = value.data.contents;
      }
    );
  }
  //重置
  public  resetQueryIntercept(): void {
    this.queryIntercept.serviceAreaName = null;
    this.queryIntercept.serviceAreaId = null;
    this.queryIntercept.bayonetCode = null;
    this.queryIntercept.bayonetType = null;
    this.queryIntercept.orientationDO = null;
    this.ServiceDown = null;
    this.orientationDown = null;
    this.bayonetLabel = null;
    this.clearData();
    this.updateInterceptDate();
  }

  // 选择区域
  public AreaTreeClick(): void {
    this.areaDialog = true;
    this.modifyIntercept.serviceAreaName = '请选择服务区...';
    this.interceptService.searchAreaList({page: 1, nums: 100}).subscribe(
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
    this.addArealabel = this.addAreaTree.label;
    const a = parseFloat(this.addAreaTree.level);
    if (a >= 2) {
      this.addIntercept.administrativeAreaId = this.addAreaTree.id;
      this.addIntercept.administrativeAreaName = this.addAreaTree.label;
      // this.addIntercept.level = this.addAreaTree.level;
      // this.addIntercept.administrativeAreaId = this.addAreaTree.parent.id;
      // this.addIntercept.administrativeAreaName = this.addAreaTree.parent.label;
      // this.addIntercept.province.level = this.addAreaTree.parent.level;

      this.modifyIntercept.administrativeAreaId = this.addAreaTree.id;
      this.modifyIntercept.administrativeAreaName = this.addAreaTree.label;
      // this.modifyIntercept.city.level = this.addAreaTree.level;
      // this.modifyIntercept.province.administrativeAreaId = this.addAreaTree.parent.id;
      // this.modifyIntercept.province.administrativeAreaName = this.addAreaTree.parent.label;
      // this.modifyIntercept.province.level = this.addAreaTree.parent.level;
      this.areaDialog = false;
      this.interceptService.searchServiceAreaList(this.addAreaTree.id).subscribe(
        value => {
          if(value.data){
            this.addServicesAreas = this.initializeServiceArea(value.data);
          }
        }
      );
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

  // 选择服务区
  public serviceChange(e): void {
    this.addIntercept.serviceAreaId = e.value.id;
    this.addIntercept.serviceAreaName = e.value.name;

    this.modifyIntercept.serviceAreaId = e.value.id;
    this.modifyIntercept.serviceAreaName = e.value.name;
    this.queryIntercept.serviceAreaId = e.value.id;
    this.modifyhighsdData = '请选择上下行';
    this.interceptService.searchHighDirection(e.value.id).subscribe(
      (value) => {
        console.log(value);
        if(value.data){
          this.highsdData = this.initializeServiceAreaDirec(value.data);
        }
      }
    );
  }

  // 选择上下行
  public directionChange(e): void {
    // this.addIntercept.saOrientation.destination = e.value.destination;
    // this.addIntercept.saOrientation.flag = e.value.flag;
    // this.addIntercept.saOrientation.flagName = e.value.flagName;
    this.addIntercept.saOrientationId = e.value.orientaionId;
    // this.addIntercept.saOrientation.source = e.value.source;
    //
    // this.modifyIntercept.saOrientation.destination = e.value.destination;
    // this.modifyIntercept.saOrientation.flag = e.value.flag;
    // this.modifyIntercept.saOrientation.flagName = e.value.flagName;
    this.modifyIntercept.saOrientationId = e.value.orientaionId;
    // this.modifyIntercept.saOrientation.source = e.value.source;

    this.queryIntercept.orientationDO = e.value.orientaionId;
  }

  // 选择卡口类型
  public bayonetChange (e): void {
   console.log(e.value.value);
   this.queryIntercept.bayonetType = e.value.value;
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

  public initializeServiceArea(data): any {
    const oneChild = [];
    for (let i = 0; i < data.length; i++) {
      const childnode = new SelectItem();
      childnode.name = data[i].name;
      childnode.id = data[i].id;
      childnode.administrativeAreaId = data[i].administrativeAreaId;
      oneChild.push(childnode);
    }
    return oneChild;
  }

  public initializeServiceAreaDirec(data): any {
    const oneChild = [];
    if (data) {
      for (let i = 0; i < data.length; i++) {
        const childnode = new SelectItem();
        childnode.name = data[i].flagName + '：' + data[i].source + '—>' + data[i].destination;
        childnode.code = data[i].flag;
        childnode.destination = data[i].id;
        childnode.id = data[i].id;
        childnode.flag = data[i].flag;
        childnode.flagName = data[i].flagName;
        childnode.orientaionId = data[i].id;
        childnode.source = data[i].source;
        oneChild.push(childnode);
      }
    }
    return oneChild;
  }

  public nowpageEventHandle(event: any) {
    this.nowPage = event;
    console.log('我是父组件');
    console.log(this.nowPage);
    this.interceptService.searchList({page: this.nowPage, nums: 10, bayonetType: '2'}).subscribe(
      (value) => {
        console.log(value);
        this.option = {total: value.data.totalRecord, row: value.data.pageSize};
        this.intercepts = value.data.contents;
      }
    );
    this.selectedintercepts = null;
  }

  public  clearData(): void {
    this.addAreaTree = new AddTreeArea();
    this.addIntercept = new AddIntercept();
    this.addServicesAreas = null;
    this.highsdData = null;
    this.addsaOrientation.value = null;
    this.addsaOrientation1.value = null;
    this.addserviceArea.value =null;
    this.addserviceArea1.value =null;
    this.addArealabel = null;

  }

}


import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {CashService} from '../../common/services/cash.service';
import {GlobalService} from '../../common/services/global.service';
import {ConfirmationService, Message, MessageService} from 'primeng/api';
import {AddCash, Cash, ModifyCash, QueryCash, TreeNode} from '../../common/model/cash-model';
import {AddTreeArea, SelectItem} from '../../common/model/shared-model';

@Component({
  selector: 'app-cash',
  templateUrl: './cash.component.html',
  styleUrls: ['./cash.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CashComponent implements OnInit {
  // table显示相关
  public cashs: Cash[]; // 整个table数据
  public cols: any[]; // 表头
  public cash: any; // 接收选中的值
  public selectedCashs: Cash[]; // 多个选择收银设备
  // 增加相关
  public addDialog: boolean; // 增加弹窗显示控制
  public addCash: AddCash = new AddCash();
  public areaDialog: boolean; // 区域树弹窗
  public addAreaTrees: AddTreeArea[]; // 区域树结构
  public addAreaSelect = '请选择区域...'; // 区域树选择
  public addAreaTree: AddTreeArea = new AddTreeArea(); // 区域树选择
  public servicesAreaDialog: boolean; // 服务区树弹窗
  public addServicesAreaTrees: AddTreeArea[]; // 服务区列表
  public highsdData: SelectItem[]; // 上下行选择数据
  public storeList: AddTreeArea[]; // 店铺列表

  //条件查询相关
  public ServiceDown: any; //选择服务区
  public orientationDown: any; //选择上下行
  public StoreType: any; // 选择店铺分类
  public queryCash: QueryCash = new QueryCash();
  // 分页相关
  public nowPage: any;
  public option: any;
  // 修改相关
  public modifyDialog: boolean; // 修改弹窗显示控制
  public modifyCash: ModifyCash = new ModifyCash();
  public modifyhighsdData: any;
  // public selectType = 'multiple';
  // public modifyDialog: boolean; // 修改弹窗显示控制
  // 其他提示弹窗相关
  public cleanTimer: any; // 清除时钟
  public msgs: Message[] = []; // 消息弹窗
  constructor(
    private cashService: CashService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private globalService: GlobalService
  ) {
  }

  ngOnInit() {
    this.cols = [
      {field: 'administrativeAreaId', header: '区划ID'},
      {field: 'administrativeAreaName', header: '区划名称'},
      {field: 'serviceAreaId', header: '服务区ID'},
      {field: 'serviceAreaName', header: '服务区名称'},
      {field: 'storeId', header: '店铺ID'},
      {field: 'storeName', header: '店铺名称'},
      {field: 'cashRegisterCode', header: '收银机编号'},
      {field: 'idt', header: '添加时间'},
    ];
    this.updateCashDate();
    this.queryCash.orientationDO = null;
    this.queryCash.serviceAreaId = null;
    this.queryCash.storeName = null;
    this.queryCash.storeId = null;
  }

  public updateCashDate(): void {
    this.cashService.searchList({page: 1, nums: 10}).subscribe(
      (value) => {
        this.option = {total: value.data.totalRecord, row: value.data.pageSize};
        this.cashs = value.data.contents;
      }
    );
  }

  // 选中后赋值
  public onRowSelect(event): void {
    console.log(event.data);
    this.cash = this.cloneCar(event.data);
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
    console.log(this.addCash);
    this.confirmationService.confirm({
      message: `确定要增加吗？`,
      header: '增加提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.globalService.eventSubject.next({display: true});
        this.cashService.addItem(this.addCash).subscribe(
          (value) => {
            if (value.status === '200') {
              this.globalService.eventSubject.next({display: false});
              if (this.cleanTimer) {
                clearTimeout(this.cleanTimer);
              }
              this.msgs = [];
              this.msgs.push({severity: 'success', summary: '增加提醒', detail: value.message});
              this.updateCashDate();
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
    if (this.selectedCashs === undefined || this.selectedCashs.length === 0) {
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
        message: `确定要删除这${this.selectedCashs.length}项吗？`,
        header: '删除提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.globalService.eventSubject.next({display: true});
          if (this.selectedCashs.length === 1) {
            this.cashService.deleteItem(this.selectedCashs[0].id).subscribe(
              (value) => {
                if (value.status === '200') {
                  setTimeout(() => {
                    this.globalService.eventSubject.next({display: false});
                    this.selectedCashs.map((val, inx) => {
                      const index = this.cashs.indexOf(val);
                      this.cashs = this.cashs.filter((val1, i) => i !== index);
                    });
                    if (this.cleanTimer) {
                      clearTimeout(this.cleanTimer);
                    }
                    this.msgs = [];
                    this.selectedCashs = undefined;
                    this.msgs.push({severity: 'success', summary: '删除提醒', detail: value.message});
                    this.cleanTimer = setTimeout(() => {
                      this.msgs = [];
                    }, 3000);
                    this.updateCashDate();
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
            for (let i = 0; i < this.selectedCashs.length; i++) {
              ids.push(this.selectedCashs[i].id);
            }
            this.cashService.deleteList(ids).subscribe(
              (value) => {
                if (value.status === '200') {
                  setTimeout(() => {
                    this.globalService.eventSubject.next({display: false});
                    this.selectedCashs.map((val, inx) => {
                      const index = this.cashs.indexOf(val);
                      this.cashs = this.cashs.filter((val1, i) => i !== index);
                    });
                    if (this.cleanTimer) {
                      clearTimeout(this.cleanTimer);
                    }
                    this.msgs = [];
                    this.selectedCashs = undefined;
                    this.updateCashDate();
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


  // 修改、保存修改
  public modifyBtn(): void {
    if (this.selectedCashs === undefined || this.selectedCashs.length === 0) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.msgs = [];
      this.msgs.push({severity: 'error', summary: '操作错误', detail: '请选择需要修改的项'});
      this.cleanTimer = setTimeout(() => {
        this.msgs = [];
      }, 3000);
    } else if (this.selectedCashs.length === 1) {
      this.modifyDialog = true;
      this.cashService.QuryHighDirection(this.selectedCashs[0].saOrientationId).subscribe(
        (value) => {
          console.log(value);
          this.modifyhighsdData = value.data.source + '-' + value.data.destination;
        }
      );
      this.modifyCash.cashRegisterCode = this.selectedCashs[0].cashRegisterCode;
      this.modifyCash.id = this.selectedCashs[0].id;
      this.modifyCash.idt = this.selectedCashs[0].idt;
      this.modifyCash.city.administrativeAreaName = this.selectedCashs[0].administrativeAreaName;
      this.modifyCash.serviceArea.serviceName = this.selectedCashs[0].serviceAreaName;
      this.modifyCash.store.storeName = this.selectedCashs[0].storeName;
      this.modifyCash.store.storeId = this.selectedCashs[0].storeId;
      this.modifyCash.city.administrativeAreaId = this.selectedCashs[0].administrativeAreaId;
      // this.modifyCash.province.level = this.selectedCashs[0].;
      // this.modifyhighsdData = this.selectedCashs[0].orientationFlag===2?'遵义-贵阳':'贵阳-遵义';
      console.log(this.modifyCash.serviceArea.serviceName);
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
    console.log(this.addServicesAreaTrees);
    if (this.addServicesAreaTrees === undefined) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.msgs = [];
      this.msgs.push({severity: 'error', summary: '操作错误', detail: '请选择区划'});
      this.cleanTimer = setTimeout(() => {
        this.msgs = [];
      }, 3000);
    } else {
      this.confirmationService.confirm({
        message: `确定要修改吗？`,
        header: '修改提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.globalService.eventSubject.next({display: true});
          this.cashService.modifyItem(this.modifyCash).subscribe(
            (value) => {
              if (value.status === '200') {
                this.globalService.eventSubject.next({display: false});
                if (this.cleanTimer) {
                  clearTimeout(this.cleanTimer);
                }
                this.msgs = [];
                this.selectedCashs = undefined;
                this.msgs.push({severity: 'success', summary: '修改提醒', detail: value.message});
                this.updateCashDate();
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
    console.log(this.modifyCash);
    // console.log(this.modifyCash.province.administrativeAreaName);
  }

  public clearDown(): void {
    this.addAreaSelect = '请选择区域...';
    this.addServicesAreaTrees = null;
    this.highsdData = null;
    this.storeList = null;
    this.addCash = new AddCash();
  }

  // 条件查询
  public queryCashData(): void {
    this.cashService.searchCash({page: 1, nums: 10}, this.queryCash).subscribe(
      (value) => {
        console.log(value);
        this.option = {total: value.data.totalRecord, row: value.data.pageSize};
        this.cashs = value.data.contents;
      }
    );
  }

  //重置
  public resetQueryCash(): void {
    this.updateCashDate();
    this.queryCash.orientationDO = null;
    this.queryCash.serviceAreaId = null;
    this.queryCash.storeName = null;
    this.queryCash.storeId = null;
    this.ServiceDown = null;
    this.orientationDown = null;
    this.StoreType = null;
    this.addAreaTree.label = null;
    this.addServicesAreaTrees = null;
    this.highsdData = null;
    this.storeList = null;
  }


  // onHide(e):void{
  //   console.log(123);
  // }
  // 搜索
  /*public searchKeydown(e): void {
    if (e.keyCode === 13) {
      this.searchClick();
    }
  }
  public searchClick(): void {
    this.globalService.eventSubject.next({display: true});
    this.cashService.searchList({'name': '文君', 'age': '18'}).subscribe(
      (value) => {
        console.log(value);
        /!*setTimeout(() => {
          this.globalService.eventSubject.next({display: false});
          if (value.state) {
            if (this.cleanTimer) {
              clearTimeout(this.cleanTimer);
            }
            this.msgs = [];
            this.msgs.push({severity: 'success', summary: '搜索提醒', detail: '搜索成功'});
            this.cleanTimer = setTimeout(() => {
              this.msgs = [];
            }, 3000);
            this.cars = value.data;
          } else {
            if (this.cleanTimer) {
              clearTimeout(this.cleanTimer);
            }
            this.msgs = [];
            this.msgs.push({severity: 'error', summary: '搜索提醒', detail: '无数据'});
            this.cleanTimer = setTimeout(() => {
              this.msgs = [];
            }, 3000);
          }
        }, 3000);*!/
      },
      (error) => {
        console.log(error);
        setTimeout(() => {
          this.globalService.eventSubject.next({display: false});
          if (this.cleanTimer) {
            clearTimeout(this.cleanTimer);
          }
          this.msgs = [];
          this.msgs.push({severity: 'error', summary: '查询失败', detail: '连接服务器失败'});
          this.cleanTimer = setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }, 3000);
      }
    );
  }*/
  // 查看详情
  /*public checkClick(): void {
    if (this.selectedCars3 === undefined || this.selectedCars3.length === 0) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.msgs = [];
      this.msgs.push({severity: 'error', summary: '操作错误', detail: '请选择需要查看的项'});
      this.cleanTimer = setTimeout(() => {
        this.msgs = [];
      }, 3000);
      this.revampDialog = false;
    } else if (this.selectedCars3.length > 1) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.cleanTimer = setTimeout(() => {
        this.msgs = [];
      }, 3000);
      this.msgs.push({severity: 'error', summary: '操作错误', detail: '查看详情只能选择一项'});
      this.revampDialog = false;
    } else if (this.selectedCars3.length === 1) {
      this.detailsDialog = true;
    }
  }*/

  // 选择区域
  public AreaTreeClick(): void {
    this.areaDialog = true;
    this.cashService.searchAreaList({page: 1, nums: 100}).subscribe(
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
    this.addAreaSelect = this.addAreaTree.label;
    const a = parseFloat(this.addAreaTree.level);
    if (a >= 2) {
      this.addCash.city.administrativeAreaId = this.addAreaTree.id;
      this.addCash.city.administrativeAreaName = this.addAreaTree.label;
      this.addCash.city.level = this.addAreaTree.level;
      this.addCash.province.administrativeAreaId = this.addAreaTree.parent.id;
      this.addCash.province.administrativeAreaName = this.addAreaTree.parent.label;
      this.addCash.province.level = this.addAreaTree.parent.level;

      this.modifyCash.city.administrativeAreaId = this.addAreaTree.id;
      this.modifyCash.city.administrativeAreaName = this.addAreaTree.label;
      this.modifyCash.city.level = this.addAreaTree.level;
      this.modifyCash.province.administrativeAreaId = this.addAreaTree.parent.id;
      this.modifyCash.province.administrativeAreaName = this.addAreaTree.parent.label;
      this.modifyCash.province.level = this.addAreaTree.parent.level;
      this.modifyCash.serviceArea.serviceName = '请选择服务区';
      this.areaDialog = false;
      this.cashService.searchServiceAreaList(this.addAreaTree.id).subscribe(
        value => {
          this.addServicesAreaTrees = this.initializeServiceArea(value.data);
        }
      );
    } else {
      this.msgs = [];
      this.msgs.push({severity: 'error', summary: '操作错误', detail: '请选择市'});
      this.cleanTimer = setTimeout(() => {
        this.msgs = [];
      }, 3000);
    }
  }

  // 选择服务区
  public serviceChange(e): void {
    this.servicesAreaDialog = false;
    this.addCash.serviceArea.serviceAreaId = e.value.id;
    this.addCash.serviceArea.serviceName = e.value.name;
    this.modifyCash.serviceArea.serviceAreaId = e.value.id;
    this.modifyCash.serviceArea.serviceName = e.value.name;
    this.queryCash.serviceAreaId = e.value.id;
    this.modifyhighsdData = '请选择上下行';
    this.cashService.searchHighDirection(e.value.id).subscribe(
      (value) => {
        console.log(value);
        this.highsdData = this.initializeServiceAreaDirec(value.data);
      }
    );
  }

  // 选择上下行
  public directionChange(e): void {
    console.log(e);
    this.addCash.saOrientation.destination = e.value.destination;
    this.addCash.saOrientation.flag = e.value.flag;
    this.addCash.saOrientation.flagName = e.value.flagName;
    this.addCash.saOrientation.serviceAreaId = e.value.serviceAreaId;
    this.addCash.saOrientation.source = e.value.source;
    this.addCash.saOrientation.id = e.value.id;

    this.modifyCash.saOrientation.destination = e.value.destination;
    this.modifyCash.saOrientation.flag = e.value.flag;
    this.modifyCash.saOrientation.flagName = e.value.flagName;
    this.modifyCash.saOrientation.serviceAreaId = e.value.serviceAreaId;
    this.modifyCash.saOrientation.source = e.value.source;

    this.queryCash.orientationDO = e.value.orientaionId;
    this.modifyCash.store.storeName = '请选择店铺';
    this.cashService.searchStoreItem(e.value.id).subscribe(
      (value) => {
        console.log(value.data);
        this.storeList = this.initializeStore(value.data);
      }
    );
  }

  // 选择店铺
  public storeChange(e): void {
    this.addCash.store.categoryCode = e.value.categoryCode;
    this.addCash.store.storeId = e.value.id;
    this.addCash.store.storeName = e.value.name;

    this.modifyCash.store.categoryCode = e.value.categoryCode;
    this.modifyCash.store.storeId = e.value.id;
    this.modifyCash.store.storeName = e.value.name;

    this.queryCash.storeId = e.value.id;
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
        childnode.destination = data[i].destination;
        childnode.flag = data[i].flag;
        childnode.flagName = data[i].flagName;
        childnode.id = data[i].id;
        childnode.serviceAreaId = data[i].serviceAreaId;
        childnode.source = data[i].source;
        oneChild.push(childnode);
      }
    }
    return oneChild;
  }

  public initializeStore(data): any {
    const oneChild = [];
    for (let i = 0; i < data.length; i++) {
      const childnode = new SelectItem();
      childnode.name = data[i].storeName;
      childnode.id = data[i].id;
      childnode.categoryCode = data[i].categoryCode;
      oneChild.push(childnode);
    }
    return oneChild;
  }

  //分页查询
  public nowpageEventHandle(event: any) {
    this.nowPage = event;
    console.log('我是父组件');
    console.log(this.nowPage);
    this.cashService.searchList({page: this.nowPage, nums: 10}).subscribe(
      (value) => {
        this.cashs = value.data.contents;
      }
    );
    this.selectedCashs = null;
  }
}

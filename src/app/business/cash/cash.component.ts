import { Component, OnInit } from '@angular/core';
import {CashService} from '../../common/services/cash.service';
import {GlobalService} from '../../common/services/global.service';
import {ConfirmationService, Message, MessageService} from 'primeng/api';
import {AddCash, Cash, TreeNode} from '../../common/model/cash-model';
import {AddTreeArea, SelectItem} from '../../common/model/shared-model';

@Component({
  selector: 'app-cash',
  templateUrl: './cash.component.html',
  styleUrls: ['./cash.component.css']
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
  public addAreaTree: AddTreeArea = new AddTreeArea(); // 区域树选择
  public servicesAreaDialog: boolean; // 服务区树弹窗
  public addServicesAreaTrees: AddTreeArea[]; // 服务区列表
  public highsdData: SelectItem[]; // 上下行选择数据
  public storeList: AddTreeArea[]; // 店铺列表
  // 修改相关
  public revampDialog: boolean; // 修改弹窗显示控制
  // 其他提示弹窗相关
  public cleanTimer: any; // 清除时钟
  public msgs: Message[] = []; // 消息弹窗
  constructor(
    private cashService: CashService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private globalService: GlobalService
  ) { }

  ngOnInit() {
    this.cols = [
      {field: 'administrativeAreaId', header: '区划ID'},
      {field: 'serviceAreaId', header: '服务区ID'},
      {field: 'storeId', header: '店铺ID'},
      {field: 'cashRegisterCode', header: '收银机编号'},
      {field: 'idt', header: '添加时间'}
    ];
    this.updateCashDate();
  }
  public updateCashDate(): void {
    this.cashService.searchList({page: 1, nums: 100}).subscribe(
      (value) => {
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
      reject: () => {}
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
            for (let i = 0; i < this.selectedCashs.length; i ++) {
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
        reject: () => {}
      });
    }
  }
  // 修改、保存修改
/*  public revampClick() {
    if (this.selectedCashs === undefined || this.selectedCashs.length === 0) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.msgs = [];
      this.msgs.push({severity: 'error', summary: '操作错误', detail: '请选择需要修改的项'});
      this.cleanTimer = setTimeout(() => {
        this.msgs = [];
      }, 3000);
      this.revampDialog = false;
    } else if (this.selectedCashs.length > 1) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.cleanTimer = setTimeout(() => {
        this.msgs = [];
      }, 3000);
      this.msgs.push({severity: 'error', summary: '操作错误', detail: '修改只能选择一项'});
      this.revampDialog = false;
    } else if (this.selectedCashs.length === 1) {
      this.revampDialog = true;
    }

  }
  public revampSave(): void {
    this.confirmationService.confirm({
      message: `确定要修改吗？`,
      header: '修改提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.globalService.eventSubject.next({display: true});
        this.cashService.modifyList().subscribe(
          (value) => {
            if (value.state) {
              setTimeout(() => {
                this.globalService.eventSubject.next({display: false});
                const carsSave = [...this.cashs];
                carsSave[this.cashs.indexOf(this.selectedCashs[0])] = this.cash;
                this.cashs = carsSave;
                if (this.cleanTimer) {
                  clearTimeout(this.cleanTimer);
                }
                this.msgs = [];
                this.msgs.push({severity: 'success', summary: '修改提醒', detail: value.msg});
                this.cleanTimer = setTimeout(() => {
                  this.msgs = [];
                }, 3000);
                this.selectedCashs = undefined;
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
  }*/

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
    const a = parseFloat(this.addAreaTree.level);
    if (a >= 2 ) {
      this.addCash.province.administrativeAreaId = this.addAreaTree.id;
      this.addCash.province.administrativeAreaName = this.addAreaTree.label;
      this.addCash.province.level = this.addAreaTree.level;
      this.addCash.city.administrativeAreaId = this.addAreaTree.parent.id;
      this.addCash.city.administrativeAreaName = this.addAreaTree.parent.label;
      this.addCash.city.level = this.addAreaTree.parent.level;
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
    this.cashService.searchHighDirection(e.value.id).subscribe(
      (value) => {
        console.log(value);
        this.highsdData = this.initializeServiceAreaDirec(value.data);
      }
    );
  }
  // 选择上下行
  public directionChange(e): void {
    this.addCash.saOrientation.destination = e.value.destination;
    this.addCash.saOrientation.flag = e.value.flag;
    this.addCash.saOrientation.flagName = e.value.flagName;
    this.addCash.saOrientation.orientaionId = e.value.orientaionId;
    this.addCash.saOrientation.source = e.value.source;
    this.cashService.searchStoreItem(e.value.orientaionId).subscribe(
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
  }
  // 数据格式化
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
  public initializeServiceArea(data): any {
    const oneChild = [];
    for (let i = 0; i < data.length; i++) {
      const childnode =  new SelectItem();
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
        const childnode =  new SelectItem();
        childnode.name = data[i].flagName + '：' + data[i].source + '—>' + data[i].destination;
        childnode.code = data[i].flag;
        childnode.destination = data[i].id;
        childnode.flag = data[i].flag;
        childnode.flagName = data[i].flagName;
        childnode.orientaionId = data[i].id;
        childnode.source = data[i].source;
        oneChild.push(childnode);
      }
    }
    return oneChild;
  }
  public initializeStore(data): any {
    const oneChild = [];
    for (let i = 0; i < data.length; i++) {
      const childnode =  new SelectItem();
      childnode.name = data[i].storeName;
      childnode.id = data[i].id;
      childnode.categoryCode = data[i].categoryCode;
      oneChild.push(childnode);
    }
    return oneChild;
  }
}

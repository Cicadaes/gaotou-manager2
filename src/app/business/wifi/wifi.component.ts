import {Component, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, Message, MessageService} from 'primeng/api';
import {GlobalService} from '../../common/services/global.service';
import {AddWifi, ModifyWifi, Wifi} from '../../common/model/wifi-model';
import {WifiService} from '../../common/services/wifi.service';
import {AddTreeArea, SelectItem} from '../../common/model/shared-model';
import {TreeNode} from '../../common/model/cash-model';
import {Dropdown} from 'primeng/primeng';
import {v} from '@angular/core/src/render3';

@Component({
  selector: 'app-wifi',
  templateUrl: './wifi.component.html',
  styleUrls: ['./wifi.component.css']
})
export class WifiComponent implements OnInit {
  @ViewChild('addsaOrientation') addsaOrientation: Dropdown;
  @ViewChild('addsaOrientation') addserviceArea: Dropdown;
  @ViewChild('addsaOrientation1') addsaOrientation1: Dropdown;
  // table显示相关
  public wifis: Wifi[]; // 整个table数据
  public cols: any[]; // 表头
  public wifi: any; // 接收选中的值
  public selectedwifis: Wifi[]; // 多个选择
  // 增加相关
  public addDialog: boolean; // 增加弹窗显示控制
  public addWifi: AddWifi = new AddWifi();
  public areaDialog: boolean; // 区域树弹窗
  public addAreaTrees: AddTreeArea[]; // 区域树结构
  public addAreaTree: AddTreeArea = new AddTreeArea(); // 区域树选择
  public addServicesAreas: SelectItem[]; // 服务区列表
  public highsdData: SelectItem[]; // 上下行选择数据
  public addArealabel: any;
  //分页相关
  public nowPage = 1;
  public option: any;
  //条件查询
  public ServiceName: any;
  // 修改相关
  public modifyDialog: boolean;
  public modifyWifi: ModifyWifi = new ModifyWifi();
  public modifyhighsdData = null;
  // 其他提示弹窗相关
  public cleanTimer: any; // 清除时钟
  public msgs: Message[] = []; // 消息弹窗
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private wifiService: WifiService,
    private globalService: GlobalService
  ) {
  }

  ngOnInit() {
    this.cols = [
      {field: 'deviceCode', header: '设备编号'},
      {field: 'devicePosition', header: '设备位置'},
      {field: 'serviceAreaName', header: '所属服务区'},
      {field: 'orientationFlag', header: '所属服务区方向'},
      {field: 'administrativeAreaName', header: '所属区划'}
    ];
    this.updateWifiDate(1);
  }

  public updateWifiDate(page): void {
    this.wifiService.searchList({page: page, nums: 10}).subscribe(
      (value) => {
        console.log(value.data.contents);
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};

        this.wifis = value.data.contents;
      }
    );
  }

  // 选中后赋值
  public onRowSelect(event): void {
    console.log(event.data);
    this.modifyhighsdData = null;
    this.modifyWifi.province.administrativeAreaName = null;
    this.addServicesAreas = null;
    this.modifyWifi.serviceArea.serviceName = null;
    this.wifi = this.cloneCar(event.data);
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
    console.log(this.addWifi);
    this.confirmationService.confirm({
      message: `确定要增加吗？`,
      header: '增加提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.globalService.eventSubject.next({display: true});
        this.wifiService.addItem(this.addWifi).subscribe(
          (value) => {
            console.log(value);
            if (value.status === '200') {
              this.globalService.eventSubject.next({display: false});
              if (this.cleanTimer) {
                clearTimeout(this.cleanTimer);
              }
              this.msgs = [];
              this.msgs.push({severity: 'success', summary: '增加提醒', detail: value.message});
              this.updateWifiDate(this.nowPage);
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
    if (this.selectedwifis === undefined || this.selectedwifis.length === 0) {
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
        message: `确定要删除这${this.selectedwifis.length}项吗？`,
        header: '删除提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.globalService.eventSubject.next({display: true});
          if (this.selectedwifis.length === 1) {
            this.wifiService.deleteItem(this.selectedwifis[0].id).subscribe(
              (value) => {
                if (value.status === '200') {
                  setTimeout(() => {
                    this.globalService.eventSubject.next({display: false});
                    if (this.cleanTimer) {
                      clearTimeout(this.cleanTimer);
                    }
                    this.msgs = [];
                    this.selectedwifis = undefined;
                    this.msgs.push({severity: 'success', summary: '删除提醒', detail: value.message});
                    this.cleanTimer = setTimeout(() => {
                      this.msgs = [];
                    }, 3000);
                    this.updateWifiDate(this.nowPage);
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
            for (let i = 0; i < this.selectedwifis.length; i++) {
              ids.push(this.selectedwifis[i].id);
            }
            this.wifiService.deleteList(ids).subscribe(
              (value) => {
                console.log(value);
                if (value.status === '200') {
                  setTimeout(() => {
                    this.globalService.eventSubject.next({display: false});
                    if (this.cleanTimer) {
                      clearTimeout(this.cleanTimer);
                    }
                    this.msgs = [];
                    this.selectedwifis = undefined;
                    this.updateWifiDate(this.nowPage);
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
    if (this.selectedwifis === undefined || this.selectedwifis.length === 0) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.msgs = [];
      this.msgs.push({severity: 'error', summary: '操作错误', detail: '请选择需要修改的项'});
      this.cleanTimer = setTimeout(() => {
        this.msgs = [];
      }, 3000);
    } else if (this.selectedwifis.length === 1) {
      //查询服务区
      if(this.selectedwifis[0].administrativeAreaId){
        this.wifiService.searchServiceAreaList(this.selectedwifis[0].administrativeAreaId).subscribe(
          value => {
            if(value.data){
              this.addServicesAreas = this.initializeServiceArea(value.data);
            }
          }
        );
      }
      //查询当前服务区的上下行
      if (this.selectedwifis[0].serviceAreaId) {
        this.wifiService.searchHighDirection(this.selectedwifis[0].serviceAreaId).subscribe(
          (value) => {
            // console.log(value);
            if (value.data) {
              this.highsdData = this.initializeServiceAreaDirec(value.data);

            }
          }
        );
      }

      //查询当前服务区的上下行拼接显示
      if (this.selectedwifis[0].saOrientationId) {
        this.wifiService.QuryHighDirection(this.selectedwifis[0].saOrientationId).subscribe(
          (value) => {
            // console.log(value);
            if(value.data){
              this.modifyhighsdData =value.data.flagName+"："+ value.data.source + '-' + value.data.destination;
            }
          }
        );
      }

      this.modifyDialog = true;
      this.modifyWifi.deviceCode = this.selectedwifis[0].deviceCode;
      this.modifyWifi.id = this.selectedwifis[0].id;
      this.modifyWifi.idt = this.selectedwifis[0].idt;
      this.modifyWifi.devicePosition = this.selectedwifis[0].devicePosition;
      this.modifyWifi.devicePositionCode = this.selectedwifis[0].devicePositionCode;
      this.modifyWifi.city.administrativeAreaId = this.selectedwifis[0].administrativeAreaId;
      this.modifyWifi.city.administrativeAreaName = this.selectedwifis[0].administrativeAreaName;
      this.modifyWifi.serviceArea.serviceName = this.selectedwifis[0].serviceAreaName;
      this.modifyWifi.serviceArea.serviceAreaId = this.selectedwifis[0].serviceAreaId;
      this.modifyWifi.saOrientation.orientaionId = this.selectedwifis[0].saOrientationId;
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

  //确认修改
  public modifySure(): void {
    console.log(this.modifyWifi);
    this.confirmationService.confirm({
      message: `确定要修改吗？`,
      header: '修改提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.globalService.eventSubject.next({display: true});
        this.wifiService.modifyList(this.modifyWifi).subscribe(
          (value) => {
            if (value.status === '200') {
              this.globalService.eventSubject.next({display: false});
              if (this.cleanTimer) {
                clearTimeout(this.cleanTimer);
              }
              this.msgs = [];
              this.selectedwifis = undefined;
              this.msgs.push({severity: 'success', summary: '修改提醒', detail: value.message});
              this.updateWifiDate(this.nowPage);
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
  public queryWifiData(): void {
    this.wifiService.searchWifi({page: 1, nums: 10}, {serviceAreaName: this.ServiceName}).subscribe(
      (value) => {
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        this.wifis = value.data.contents;
      }
    );
  }

  // 重置
  public resetQueryWifi(): void {
    this.ServiceName = null;
    this.updateWifiDate(this.nowPage);
  }

  public  clearData(): void {
      this.addAreaTree = new AddTreeArea();
      this.highsdData = null;
      this.addServicesAreas = null;
      this.addsaOrientation.value = null;
      this.addsaOrientation.value = null;
      this.addArealabel = null;
      this.addWifi = new AddWifi();
      this.addsaOrientation1.value = null;
      // this.modifyWifi = null;
  }

  // 选择区域
  public AreaTreeClick(): void {
    this.areaDialog = true;
    this.wifiService.searchAreaList({page: 1, nums: 100}).subscribe(
      (val) => {
        console.log(val);
        if (val.data) {
          this.addAreaTrees = this.initializeTree(val.data.contents);
        }
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
      this.addWifi.city.administrativeAreaId = this.addAreaTree.id;
      this.addWifi.city.administrativeAreaName = this.addAreaTree.label;
      this.addWifi.city.level = this.addAreaTree.level;
      this.addWifi.province.administrativeAreaId = this.addAreaTree.parent.id;
      this.addWifi.province.administrativeAreaName = this.addAreaTree.parent.label;
      this.addWifi.province.level = this.addAreaTree.parent.level;

      this.modifyWifi.city.administrativeAreaId = this.addAreaTree.id;
      this.modifyWifi.city.administrativeAreaName = this.addAreaTree.label;
      this.modifyWifi.city.level = this.addAreaTree.level;
      this.modifyWifi.province.administrativeAreaId = this.addAreaTree.parent.id;
      this.modifyWifi.province.administrativeAreaName = this.addAreaTree.parent.label;
      this.modifyWifi.province.level = this.addAreaTree.parent.level;

      this.areaDialog = false;
      this.modifyWifi.serviceArea.serviceName = '请选择服务区...';
      this.wifiService.searchServiceAreaList(this.addAreaTree.id).subscribe(
        value => {
          if(value.data){
            this.addServicesAreas = this.initializeServiceArea(value.data);
          }
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
    this.modifyhighsdData = '请选择高速方向...';
    this.addWifi.serviceArea.serviceAreaId = e.value.id;
    this.addWifi.serviceArea.serviceName = e.value.name;

    this.modifyWifi.serviceArea.serviceAreaId = e.value.id;
    this.modifyWifi.serviceArea.serviceName = e.value.name;

    this.wifiService.searchHighDirection(e.value.id).subscribe(
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
    this.addWifi.saOrientation.destination = e.value.destination;
    this.addWifi.saOrientation.flag = e.value.flag;
    this.addWifi.saOrientation.flagName = e.value.flagName;
    this.addWifi.saOrientation.orientaionId = e.value.orientaionId;
    this.addWifi.saOrientation.source = e.value.source;

    this.modifyWifi.saOrientation.destination = e.value.destination;
    this.modifyWifi.saOrientation.flag = e.value.flag;
    this.modifyWifi.saOrientation.flagName = e.value.flagName;
    this.modifyWifi.saOrientation.orientaionId = e.value.orientaionId;
    this.modifyWifi.saOrientation.source = e.value.source;
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

  //分页查询
  public nowpageEventHandle(event: any) {
    this.nowPage = event;
    // console.log('我是父组件');
    // console.log(this.nowPage);
    this.wifiService.searchList({page: this.nowPage, nums: 10}).subscribe(
      (value) => {
        // console.log(value.data.contents);
        this.wifis = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};

      }
    );
    this.selectedwifis = null;
  }
}

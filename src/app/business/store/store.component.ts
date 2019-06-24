import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {AddStore, ModifyStore, QueryStroe, Store} from '../../common/model/store-model';
import {StoreService} from '../../common/services/store.service';
import {ConfirmationService, Message, MessageService} from 'primeng/api';
import {GlobalService} from '../../common/services/global.service';
import {AddTreeArea, SelectItem, TreeNode} from '../../common/model/shared-model';
import {DatePipe} from '@angular/common';
import {Dropdown} from 'primeng/primeng';
import * as Q from 'q';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class StoreComponent implements OnInit {
  @ViewChild('addserviceAreaId1') addserviceAreaId1: Dropdown;
  @ViewChild('Serchservice') Serchservice: Dropdown;
  @ViewChild('SerchaOrientation') SerchaOrientation: Dropdown;
  @ViewChild('Serchstore') Serchstore: Dropdown;
  @ViewChild('addstore') addstore: Dropdown;
  @ViewChild('addsaOrientation') addsaOrientation: Dropdown;
  public stores: Store[]; // 整个table数据
  public cols: any[]; // 表头
  public store: any; // 接收选中的值
  public selectedstores: Store[]; // 多个选择
  public Searchtype =1;
  //分页相关
  public nowPage: any;
  public option: any;
  // 增加相关
  public addDialog: boolean; // 增加弹窗显示控制
  public addStore: AddStore = new AddStore(); // 添加参数字段
  public areaDialog: boolean; // 区域树弹窗
  public addAreaTrees: AddTreeArea[]; // 区域树结构
  public addAreaTree: AddTreeArea = new AddTreeArea(); // 区域树选择
  public addServicesAreas: SelectItem[]; // 服务区列表
  public highsdData: SelectItem[]; // 上下行选择数据
  public storeTypes: SelectItem[]; // 上下行选择数据
  public arealabel= '请选择区划';

  // 条件查询相关
  public queryStroe: QueryStroe = new QueryStroe();
  public ServiceDown: any; //选择服务区
  public orientationDown: any; //选择上下行
  public StoreType: any; // 选择店铺分类
  public SerchDialog: boolean; ///条件搜索区域弹筐显示
  public SerchAreaTrees: AddTreeArea[]; // 区域树结构
  public SerchAreaTree: AddTreeArea = new AddTreeArea(); // 区域树选择
  public SerchServicesAreas: SelectItem[]; // 服务区列表
  public SerchhighsdData: SelectItem[]; // 上下行选择数据
  public SerchstoreTypes: SelectItem[]; // 上下行选择数据
  public Sercharealabel= '请选择区划';
  //修改相关
  public modifyDialog: boolean; //修改弹窗显示控制
  public modifyStore: ModifyStore = new ModifyStore(); //修改弹窗显示控制
  public modifyOrientation: any;
  // public modifyStoreType: any;
  public modifyStoreName: any;
  // 其他提示弹窗相关
  public cleanTimer: any; // 清除时钟
  public msgs: Message[] = []; // 消息弹窗
  // public totalpage: any;
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private storeService: StoreService,
    private globalService: GlobalService,
    private datePipe: DatePipe,
  ) {
  }

  ngOnInit() {
    this.cols = [
      {field: 'storeName', header: '店铺名称'},
      {field: 'categoryCode', header: '店铺分类'},
      {field: 'principal', header: '负责人姓名'},
      {field: 'principalMobile', header: '负责人电话'},
      {field: 'serviceAreaName', header: '所属服务区'},
      {field: 'saOrientationId', header: '服务区方向'},
    ];
    this.updateStoreDate(1);

    // console.log();
  }

  public updateStoreDate(page): void {
    this.storeService.searchList({page: page, nums: 10}).subscribe(
      (value) => {
        console.log(value.data.totalRecord);
        // this.totalpage = Math.ceil(value.data.totalRecord/ value.data.pageSize);
        this.stores = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};

      }
    );
    this.Sercharealabel = '请选择区划...';
    this.Serchservice.value = null;
    this.SerchServicesAreas = null;
    this.SerchhighsdData = null;
    this.SerchstoreTypes =null;
    this.SerchaOrientation.value = null;
    this.Serchstore.value = null;
    this.Searchtype =1;
    this.queryStroe = new QueryStroe();
    // this.queryStroe = new QueryStroe();
    // // this.arealabel = null;
    // this.Serchservice.value = '请选择服务区';
    // this.SerchaOrientation.value = null;
    // this.Serchstore.value = null;
    // if (this.Searchtype === 2) {
    //   this.storeService.searchStore({page: 1, nums: 10},this.queryStroe).subscribe(
    //     (value) => {
    //       this.option = {total: value.data.totalRecord, row: value.data.pageSize};
    //       this.totalpage = Math.ceil(value.data.totalRecord/ value.data.pageSize);
    //       this.stores = value.data.contents;
    //     }
    //   );
    // }else {
    //   this.storeService.searchList({page: 1, nums: 10}).subscribe(
    //     (value) => {
    //       console.log(value.data.totalRecord);
    //       this.option = {total: value.data.totalRecord, row: value.data.pageSize};
    //       this.totalpage = Math.ceil(value.data.totalRecord/ value.data.pageSize);
    //       this.stores = value.data.contents;
    //     }
    //   );
    // }
    // this.selectedstores = null;
  }

  // 选中后赋值
  public onRowSelect(event): void {
    console.log(event.data);
    this.store = this.cloneCar(event.data);
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
        this.storeService.addItem(this.addStore).subscribe(
          (value) => {
            if (value.status === '200') {
              this.globalService.eventSubject.next({display: false});
              if (this.cleanTimer) {
                clearTimeout(this.cleanTimer);
              }
              this.msgs = [];
              this.msgs.push({severity: 'success', summary: '增加提醒', detail: value.message});
              this.updateStoreDate(this.nowPage);
              // this.updateAddData();
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
    if (this.selectedstores === undefined || this.selectedstores.length === 0) {
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
        message: `确定要删除这${this.selectedstores.length}项吗？`,
        header: '删除提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.globalService.eventSubject.next({display: true});
          if (this.selectedstores.length === 1) {
            this.storeService.deleteItem(this.selectedstores[0].id).subscribe(
              (value) => {
                if (value.status === '200') {
                  setTimeout(() => {
                    this.globalService.eventSubject.next({display: false});
                    if (this.cleanTimer) {
                      clearTimeout(this.cleanTimer);
                    }
                    this.msgs = [];
                    this.selectedstores = undefined;
                    this.msgs.push({severity: 'success', summary: '删除提醒', detail: value.message});
                    this.cleanTimer = setTimeout(() => {
                      this.msgs = [];
                    }, 3000);
                    // this.nowpageEventHandle();
                    //查询数据
                    this.updateStoreDate(this.nowPage)
                    // this.updateNowData();
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
            for (let i = 0; i < this.selectedstores.length; i++) {
              ids.push(this.selectedstores[i].id);
            }
            this.storeService.deleteList(ids).subscribe(
              (value) => {
                if (value.status === '200') {
                  setTimeout(() => {
                    this.globalService.eventSubject.next({display: false});
                    if (this.cleanTimer) {
                      clearTimeout(this.cleanTimer);
                    }
                    this.msgs = [];
                    this.selectedstores = undefined;
                    this.updateStoreDate(this.nowPage);
                    // this.updateNowData();
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
    if (this.selectedstores === undefined || this.selectedstores.length === 0) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.msgs = [];
      this.msgs.push({severity: 'error', summary: '操作错误', detail: '请选择需要修改的项'});
      this.cleanTimer = setTimeout(() => {
        this.msgs = [];
      }, 3000);
    } else if (this.selectedstores.length === 1) {
      //服务区查询
      if(this.selectedstores[0].administrativeAreaId){
        this.storeService.searchServiceAreaList(this.selectedstores[0].administrativeAreaId).subscribe(
          value => {
            console.log(value);
            if (value.data){
              this.addServicesAreas = this.initializeServiceArea(value.data);
            }
          }
        );
      }


      //上下行查询
      if (this.selectedstores[0].serviceAreaId) {
        this.storeService.searchHighDirection(this.selectedstores[0].serviceAreaId).subscribe(
          (value) => {
            // console.log(value);
            if (value.data){
              this.highsdData = this.initializeServiceAreaDirec(value.data);
            }
          }
        );
      }

      //店铺查询
      this.storeService.searchStoreType().subscribe(
        (val) => {
          // console.log(val);
          if(val.data){
            this.storeTypes = this.initializeStoreTypes(val.data);
            // console.log(this.storeTypes);
            // this.modifyStoreType = ;
            for (var i = 0;i<this.storeTypes.length; i++){
              if (this.selectedstores[0].categoryCode === this.storeTypes[i].code) {
                this.modifyStoreName = this.storeTypes[i].name;
              }
            }
          }
        }
      );

      this.modifyDialog = true;
      this.modifyStore.id = this.selectedstores[0].id;
      this.modifyStore.administrativeAreaName = this.selectedstores[0].administrativeAreaName;
      this.modifyStore.serviceAreaId = this.selectedstores[0].serviceAreaId;
      this.modifyStore.saOrientationId = this.selectedstores[0].orientationDO.id;
      this.modifyStore.storeName = this.selectedstores[0].storeName;
      this.modifyStore.storeCode = this.selectedstores[0].storeCode;
      this.modifyStore.categoryCode = this.selectedstores[0].categoryCode;
      this.modifyStore.industryName = this.selectedstores[0].industryName;
      this.modifyStore.principal = this.selectedstores[0].principal;
      this.modifyStore.principalMobile = this.selectedstores[0].principalMobile;

      // this.modifyStore.openData
      this.modifyOrientation =this.selectedstores[0].orientationDO.flagName+":"+this.selectedstores[0].orientationDO.source+'—>'+this.selectedstores[0].orientationDO.destination;
      this.modifyStore.operateStatus = this.selectedstores[0].operateStatus;
      this.modifyStore.statusChangeDate = this.selectedstores[0].statusChangeDate;
      this.modifyStore.usableArea = this.selectedstores[0].usableArea;
      this.modifyStore.waterAccount = this.selectedstores[0].waterAccount;
      this.modifyStore.electricityAccount = this.selectedstores[0].electricityAccount;
      this.modifyStore.buildAera = this.selectedstores[0].buildAera;
      this.modifyStore.industryCode = this.selectedstores[0].industryCode;
      this.modifyStore.cashierType = this.selectedstores[0].cashierType;
      this.modifyStore.enabled = this.selectedstores[0].enabled;
      this.modifyStore.serviceAreaName = this.selectedstores[0].serviceAreaName;
      this.modifyStore.contractStartDate = this.selectedstores[0].contractStartDate;
      this.modifyStore.contractExpirationDate = this.selectedstores[0].contractExpirationDate;

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

  // 保存修改
  public modifySure(): void {
    this.confirmationService.confirm({
      message: `确定要修改吗？`,
      header: '修改提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.globalService.eventSubject.next({display: true});
        // console.log(this.modifyStore);
        this.storeService.modifyList(this.modifyStore).subscribe(
          (value) => {
            // console.log(value);
            if (value.status === '200') {
              this.globalService.eventSubject.next({display: false});
              if (this.cleanTimer) {
                clearTimeout(this.cleanTimer);
              }
              this.msgs = [];
              this.selectedstores = undefined;
              this.msgs.push({severity: 'success', summary: '修改提醒', detail: value.message});
              this.updateStoreDate(this.nowPage);
              this.cleanTimer = setTimeout(() => {
                this.msgs = [];
              }, 3000);
              // this.clearMoudle();

              // // 更新数据区域
              // this.storeService.searchList({page: this.nowPage, nums: 10}).subscribe(
              //   (value) => {
              //     console.log(value);
              //     this.option = {total: value.data.totalRecord, row: value.data.pageSize ,nowpage: this.nowPage};
              //     this.stores = value.data.contents;
              //   }
              // );
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


  //搜索
  public  queryStoreData(): void {
    console.log(this.queryStroe);
    this.storeService.searchStore({page: 1, nums: 10},this.queryStroe).subscribe(
      (value) => {
        console.log(value);
        this.Searchtype =2;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize};
        this.stores = value.data.contents;
      }
    );
  }
  // 重置
  public  resetQueryStore(): void {
    // this.clearMoudle();
    this.Serchservice.value = null;
    this.SerchaOrientation.value = null;
    this.Serchstore.value = null;
    this.Searchtype =1;
    this.queryStroe = new QueryStroe();
    this.updateStoreDate(this.nowPage);
    this.addOnHide();
  }

  // addOnHide
  public addOnHide (): void {
    this.addserviceAreaId1.value = '请选择服务区';
    this.Serchservice.value = null;
    this.SerchaOrientation.value = null;
    this.Serchstore.value = null;
    this.addStore= new AddStore();
    this.arealabel = "请选择区划";
    this.addServicesAreas = null;
    this.highsdData= null;
    this.storeTypes = null;
    this.StoreType = null;
    this.modifyOrientation = null;
    this.modifyStoreName = null;
  }
  public addHide (): void {
    this.addStore = new AddStore();
    this.addDialog = false;
     this.arealabel =null;
}
//   //删除数据
//   public  updateNowData(): void {
//     console.log(this.nowPage);
//     this.storeService.searchList({page: this.nowPage, nums: 10}).subscribe(
//       (value) => {
//         if (value.data.contents.length<1 || value.data.contents===null){
//           if (this.nowPage-1>=1){
//             this.storeService.searchList({page: this.nowPage-1, nums: 10}).subscribe(
//               (value) => {
//                 this.stores = value.data.contents;
//                 this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: this.nowPage-1};
//               }
//             );
//           }else {
//             this.stores = value.data.contents;
//             this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: this.nowPage};
//           }
//         } else {
//           this.stores = value.data.contents;
//           this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: this.nowPage};
//         }
//       }
//     );
//     this.selectedstores = null;
//   }
// public  updateAddData(): void {
//   this.storeService.searchList({page: this.totalpage, nums: 10}).subscribe(
//     (value) => {
//       if (value.data.contents.length+1>10){
//           this.storeService.searchList({page: this.totalpage+1, nums: 10}).subscribe(
//             (value) => {
//               this.stores = value.data.contents;
//               this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: this.totalpage+1};
//             }
//           );
//       } else {
//         this.stores = value.data.contents;
//         this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: this.totalpage};
//       }
//     }
//   );
//   this.selectedstores = null;
// }
  //搜索查询区域
  public  SerchAreaTreeClick(): void {
    this.SerchDialog = true;
    this.Serchservice.value = null;
    this.storeService.searchAreaList({page: 1, nums: 100}).subscribe(
      (val) => {
        // console.log(val);
        this.SerchAreaTrees = this.initializeTree(val.data.contents);
      }
    );
  }
  public SerchtreeSelectAreaClick(): void {
    this.Sercharealabel = this.SerchAreaTree.label;
    const a = parseFloat(this.SerchAreaTree.level);
    if (a >= 2) {
      this.SerchDialog = false;
      this.storeService.searchServiceAreaList(this.SerchAreaTree.id).subscribe(
        value => {
          this.SerchServicesAreas = this.initializeServiceArea(value.data);
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
  public SerchserviceChange(e): void {
    this.SerchaOrientation.value = null;
    this.queryStroe.serviceAreaId = e.value.id;

    // console.log(e.value.id);
    this.storeService.searchHighDirection(e.value.id).subscribe(
      (value) => {
        // console.log(value);
        this.SerchhighsdData = this.initializeServiceAreaDirec(value.data);
      }
    );
  }
  // 选择上下行
  public SerchdirectionChange(e): void {
    // console.log(e);
    this.Serchstore.value = null;
    this.queryStroe.orientationDO = e.value.id;
    this.storeService.searchStoreType().subscribe(
      (val) => {
        // console.log(val);
        this.SerchstoreTypes = this.initializeStoreTypes(val.data);
      }
    );
  }

  // 选择店铺类型
  public SerchstoreTypeChange(e): void {
    // console.log(e.value.code);
    this.queryStroe.categoryCode = e.value.code;
  }




  // 选择区域
  public AreaTreeClick(): void {
    this.areaDialog = true;
    // this.Serchservice.value = null;
    this.modifyStore.serviceAreaName = '请选择服务区...';
    this.storeService.searchAreaList({page: 1, nums: 100}).subscribe(
      (val) => {
        // console.log(val);
        this.addAreaTrees = this.initializeTree(val.data.contents);
      }
    );
  }

  public treeOnNodeSelect(event) {
  }

  public treeSelectAreaClick(): void {
    this.addStore.administrativeAreaId =this.addAreaTree.id;
    this.addStore.administrativeAreaName =this.addAreaTree.label;
    this.modifyStore.administrativeAreaId =this.addAreaTree.id;
    this.modifyStore.administrativeAreaName =this.addAreaTree.label;
    this.arealabel = this.addAreaTree.label;
    const a = parseFloat(this.addAreaTree.level);
    if (a >= 2) {
      this.areaDialog = false;
      this.storeService.searchServiceAreaList(this.addAreaTree.id).subscribe(
        value => {
          this.addServicesAreas = this.initializeServiceArea(value.data);
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
    this.addsaOrientation.value = null;
    this.SerchaOrientation.value = null;
    this.addStore.serviceAreaId = e.value.id;
    this.addStore.serviceAreaName = e.value.name;
    this.modifyStore.serviceAreaId = e.value.id;
    this.modifyStore.serviceAreaName = e.value.name;
    this.queryStroe.serviceAreaId = e.value.id;
    this.modifyOrientation = '请选择上下行...';
    // console.log(e.value.id);
    this.storeService.searchHighDirection(e.value.id).subscribe(
      (value) => {
        // console.log(value);
        this.highsdData = this.initializeServiceAreaDirec(value.data);
      }
    );
  }

  // 选择上下行
  public directionChange(e): void {
    // console.log(e);
    this.Serchstore.value = null;
    this.addstore.value = null;

    this.addStore.saOrientationId = e.value.id;
    this.modifyStore.saOrientationId = e.value.id;
    this.queryStroe.orientationDO = e.value.id;
    this.storeService.searchStoreType().subscribe(
      (val) => {
        // console.log(val);
        this.storeTypes = this.initializeStoreTypes(val.data);
      }
    );
  }

  // 选择店铺类型
  public storeTypeChange(e): void {
    // console.log(e.value.code);
    this.addStore.categoryCode = e.value.code;
    this.modifyStore.categoryCode = e.value.code;
    this.queryStroe.categoryCode = e.value.code;
  }

  // 选择时间
  public timeOnSelect(e, type): void {
    if (type === 'contractStartDate') {
      this.addStore.contractStartDate = this.datePipe.transform(e, 'yyyy-MM-dd');
      this.modifyStore.contractStartDate = this.datePipe.transform(e, 'yyyy-MM-dd');
    } else if (type === 'contractExpirationDate') {
      this.addStore.contractExpirationDate = this.datePipe.transform(e, 'yyyy-MM-dd');
      this.modifyStore.contractExpirationDate = this.datePipe.transform(e, 'yyyy-MM-dd');
    } else if (type === 'statusChangeDate') {
      this.addStore.statusChangeDate = this.datePipe.transform(e, 'yyyy-MM-dd');
      this.modifyStore.statusChangeDate = this.datePipe.transform(e, 'yyyy-MM-dd');
    }
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

  public initializeStoreTypes(data): any {
    const oneChild = [];
    if (data) {
      for (let i = 0; i < data.length; i++) {
        const childnode = new SelectItem();
        childnode.name = data[i].entryValue;
        childnode.code = data[i].entryCode;
        oneChild.push(childnode);
      }
    }
    return oneChild;
  }
  //分页查询
  public nowpageEventHandle(event: any) {
    this.nowPage = event;
    if (this.Searchtype === 2) {
      this.storeService.searchStore({page: this.nowPage, nums: 10},this.queryStroe).subscribe(
        (value) => {
          this.stores = value.data.contents;
        }
      );
    }else {

      this.storeService.searchList({page: this.nowPage, nums: 10}).subscribe(
        (value) => {
          console.log(value);
          this.stores = value.data.contents;
        }
      );
    }

    this.selectedstores = null;
  }
}

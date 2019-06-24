import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ConfirmationService, Message, MessageService} from 'primeng/api';
import {GlobalService} from '../../common/services/global.service';
import {VideomService} from '../../common/services/videom.service';
import {AddVideo, ModifyVideo, Video} from '../../common/model/videom-model';
import {AddTreeArea, QueryVideo, SelectItem, TreeNode} from '../../common/model/shared-model';
import {Dropdown} from 'primeng/primeng';
import {C} from '@angular/core/src/render3';

@Component({
  selector: 'app-videom',
  templateUrl: './videom.component.html',
  styleUrls: ['./videom.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class VideomComponent implements OnInit {
  @ViewChild('addSerdropDown') addSerdropDown: Dropdown;
  @ViewChild('addDircDropDown') addDircDropDown: Dropdown;
  @ViewChild('addShopDropDown') addShopDropDown: Dropdown;
  @ViewChild('addgroupId2') addgroupId2: Dropdown;

  @ViewChild('modifySerdropDown') modifySerdropDown: Dropdown;
  @ViewChild('modifyDircDropDown') modifyDircDropDown: Dropdown;
  @ViewChild('modifyShopDropDown') modifyShopDropDown: Dropdown;
  @ViewChild('modifygroupId1') modifygroupId1: Dropdown;
  // table显示相关
  public videos: Video[]; // 整个table数据
  public cols: any[]; // 表头
  public video: any; // 接收选中的值
  public selectedvideos: Video[]; // 多个选择收银设备
  // 增加相关
  public addDialog: boolean; // 增加弹窗显示控制
  public addVideo: AddVideo = new AddVideo();
  public areaDialog: boolean; // 区域树弹窗
  public addAreaTrees: AddTreeArea[]; // 区域树结构
  public addAreaTree: AddTreeArea = new AddTreeArea(); // 区域树选择
  public addAreaSelect =  '请选择区域...'; // 区域树选择
  public addServicesAreas: SelectItem[]; // 服务区列表
  public highsdData: SelectItem[]; // 上下行选择数据
  public storeList: SelectItem[]; // 店铺列表
  public videoGroupList: SelectItem[]; // 分组列表
  
  // 条件查询
  public  queryVideo: QueryVideo = new QueryVideo();
  public  ServiceName: any;
  public  orientationName: any;
  public  VideoGroupName: any;
  //分页相关
  public nowPage: any;
  public option: any;
  // 修改相关
  public modifyDialog: boolean; //修改弹窗显示
  public modifyVideo: ModifyVideo = new ModifyVideo();
  public orientation: any;
  public modifyGroupName: any;
  public modifyStoreTypeName: any;
  public modifyorientationDO: any;
  // public modifyStoreTypeName: any;
  // 其他提示弹窗相关
  public cleanTimer: any; // 清除时钟
  public msgs: Message[] = []; // 消息弹窗
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private videomService: VideomService,
    private globalService: GlobalService
  ) {
  }

  ngOnInit() {
    this.addAreaTree.label = '请选择区域...';
    this.cols = [
      {field: 'id', header: '摄像头id'},
      {field: 'cameraName', header: '摄像头名称'},
      // {field: 'showLocation', header: '监视窗位置'},
      {field: 'serviceAreaName', header: '服务区名字'},
      {field: 'orientationDO', header: '上下行'},
      {field: 'outUrl', header: '视频连接'},
    ];
    this.updateVideoData(1);

  }

  public updateVideoData(page): void {
    this.videomService.searchList({page: page, nums: 10}).subscribe(
      (value) => {
        console.log(value);
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        this.videos = value.data.contents;
      }
    );
    this.queryVideo.groupId = null;
    this.queryVideo.serviceAreaId = null;
    this.queryVideo.orientationDO = null;
  }

  // 选中后赋值
  public onRowSelect(event): void {
    console.log(event.data);
    this.video = this.cloneCar(event.data);
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
    console.log(this.addVideo);
    if (this.addVideo.inStore === '1') {
      this.addVideo.inStore = true;
    } else {
      this.addVideo.inStore = false;
    }
    this.confirmationService.confirm({
      message: `确定要增加吗？`,
      header: '增加提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.globalService.eventSubject.next({display: true});
        this.videomService.addItem(this.addVideo).subscribe(
          (value) => {
            if (value.status === '200') {
              this.globalService.eventSubject.next({display: false});
              if (this.cleanTimer) {
                clearTimeout(this.cleanTimer);
              }
              this.msgs = [];
              this.msgs.push({severity: 'success', summary: '增加提醒', detail: value.message});
              this.updateVideoData(this.nowPage);
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
    if (this.selectedvideos === undefined || this.selectedvideos.length === 0) {
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
        message: `确定要删除这${this.selectedvideos.length}项吗？`,
        header: '删除提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.globalService.eventSubject.next({display: true});
          if (this.selectedvideos.length === 1) {
            this.videomService.deleteItem(this.selectedvideos[0].id).subscribe(
              (value) => {
                if (value.status === '200') {
                  setTimeout(() => {
                    this.globalService.eventSubject.next({display: false});
                    if (this.cleanTimer) {
                      clearTimeout(this.cleanTimer);
                    }
                    this.msgs = [];
                    this.selectedvideos = undefined;
                    this.msgs.push({severity: 'success', summary: '删除提醒', detail: value.message});
                    this.cleanTimer = setTimeout(() => {
                      this.msgs = [];
                    }, 3000);
                    this.updateVideoData(this.nowPage);
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
            for (let i = 0; i < this.selectedvideos.length; i++) {
              ids.push(this.selectedvideos[i].id);
            }
            this.videomService.deleteList(ids).subscribe(
              (value) => {
                if (value.status === '200') {
                  setTimeout(() => {
                    this.globalService.eventSubject.next({display: false});
                    if (this.cleanTimer) {
                      clearTimeout(this.cleanTimer);
                    }
                    this.msgs = [];
                    this.selectedvideos = undefined;
                    this.updateVideoData(this.nowPage);
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
    if (this.selectedvideos === undefined || this.selectedvideos.length === 0) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.msgs = [];
      this.msgs.push({severity: 'error', summary: '操作错误', detail: '请选择需要删除的项'});
      this.cleanTimer = setTimeout(() => {
        this.msgs = [];
      }, 3000);
    } else if (this.selectedvideos.length === 1) {
      if (this.selectedvideos[0].administrativeAreaId) {
        this.videomService.searchServiceAreaList(this.selectedvideos[0].administrativeAreaId).subscribe(
          value => {
            if (value.data) {
              this.addServicesAreas = this.initializeServiceArea(value.data);
            }
            // console.log(value);
          }
        );
      }

      if (this.selectedvideos[0].serviceAreaId) {
        this.videomService.searchHighDirection(this.selectedvideos[0].serviceAreaId).subscribe(
          (value) => {
            this.highsdData = this.initializeServiceAreaDirec(value.data);
          }
        );
      }

      if (this.selectedvideos[0].orientationDO.id)  {
        this.videomService.searchStoreItem(this.selectedvideos[0].orientationDO.id).subscribe(
          (value) => {
            console.log(value);
            this.storeList = this.initializeStore(value.data);
            // console.log(this.storeList[2].id);
            for (var i =0;i<value.data.length;i++){
              if (this.selectedvideos[0].storeId === value.data[i].id){
                this.modifyStoreTypeName = value.data[i].storeName;
                console.log(this.modifyStoreTypeName);
              }
            }
          }
        );
      }

      this.videomService.searchVideoGroupList(this.selectedvideos[0].orientationDO.id).subscribe(
        (value) => {
          // console.log(value);
          this.videoGroupList = this.initializeVideoGroup(value.data);
          console.log(value.data);
          for (var i =0;i<value.data.length;i++){
            if (this.selectedvideos[0].groupId === value.data.id){
              this.modifyGroupName = value.data.groupName;
            }
          }
        }
      );
      this.modifyDialog = true;
      this.modifyorientationDO = this.selectedvideos[0].orientationDO.flagName+"："+this.selectedvideos[0].orientationDO.source+"—>"+this.selectedvideos[0].orientationDO.destination;
      this.modifyVideo.cameraName = this.selectedvideos[0].cameraName;
      this.modifyVideo.saOrientationId = this.selectedvideos[0].saOrientationId;
      this.modifyVideo.serviceAreaId = this.selectedvideos[0].serviceAreaId;
      this.modifyVideo.serviceAreaName = this.selectedvideos[0].serviceAreaName;
      this.modifyVideo.storeId = this.selectedvideos[0].storeId;
      this.modifyVideo.groupId = this.selectedvideos[0].groupId;
      this.modifyVideo.cameraName = this.selectedvideos[0].cameraName;
      this.modifyVideo.inStore = this.selectedvideos[0].inStore;
      this.modifyVideo.innerUrl = this.selectedvideos[0].innerUrl;
      this.modifyVideo.outUrl = this.selectedvideos[0].outUrl;
      this.modifyVideo.showLocation = this.selectedvideos[0].showLocation;
      this.modifyVideo.videoUrl = this.selectedvideos[0].videoUrl;
      this.modifyVideo.enabled = this.selectedvideos[0].enabled;
      this.modifyVideo.id = this.selectedvideos[0].id;
      this.modifyVideo.idt = this.selectedvideos[0].idt;
      this.modifyVideo.administrativeAreaName = this.selectedvideos[0].administrativeAreaName;
      this.modifyVideo.administrativeAreaId = this.selectedvideos[0].administrativeAreaId;
      this.modifyVideo.cameraType = this.selectedvideos[0].cameraType;
      this.modifyVideo.saOrientationId = this.selectedvideos[0].orientationDO.id;
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
    if (this.modifyVideo.inStore === '1') {
      this.modifyVideo.inStore = true;
    } else {
      this.modifyVideo.inStore = false;
    }
    console.log(this.modifyVideo);
    this.confirmationService.confirm({
      message: `确定要修改吗？`,
      header: '修改提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.globalService.eventSubject.next({display: true});
        this.videomService.modifyList(this.modifyVideo).subscribe(
          (value) => {
            console.log(value);
            if (value.status === '200') {
              this.globalService.eventSubject.next({display: false});
              if (this.cleanTimer) {
                clearTimeout(this.cleanTimer);
              }
              this.msgs = [];
              this.selectedvideos = undefined;
              this.msgs.push({severity: 'success', summary: '增加提醒', detail: value.message});
              this.updateVideoData(this.nowPage);
              this.cleanTimer = setTimeout(() => {
                this.msgs = [];
              }, 3000);
              this.modifyDialog = false;
              this.clearDown();
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

  // 选择区域
  public AreaTreeClick(): void {
    this.areaDialog = true;
    this.videomService.searchAreaList({page: 1, nums: 100}).subscribe(
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
    this.addVideo.administrativeAreaId = this.addAreaTree.id;
    this.addVideo.administrativeAreaName = this.addAreaTree.label;

    this.modifyVideo.administrativeAreaId = this.addAreaTree.id;
    this.modifyVideo.administrativeAreaName = this.addAreaTree.label;
    const a = parseFloat(this.addAreaTree.level);
    if (a >= 2) {
      this.areaDialog = false;
      this.videomService.searchServiceAreaList(this.addAreaTree.id).subscribe(
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

  public clearDown(): void {
    this.addAreaSelect = '请选择区域...';
    this.addSerdropDown.value = '请选择服务区...';
    this.addDircDropDown.value = '请选择服务区方向...';
    this.addShopDropDown.value = '请选择店铺...';
    this.modifySerdropDown.value = '请选择服务区...';
    this.modifyDircDropDown.value = '请选择服务区方向...';
    this.modifyShopDropDown.value = '请选择店铺...';
    this.addgroupId2.value = '请选择分组...';
    this.modifygroupId1.value = '请选择分组...';
    this.modifyGroupName = null;
    this.modifyStoreTypeName = null;
    this.modifyorientationDO = null;
    // this.modifyGroupName = null;
    this.addServicesAreas = null;
    this.highsdData = null;
    this.storeList = null;
    this.videoGroupList = null;
    this.addVideo = new AddVideo();
  }

  // 条件查询
  public  queryVideoData(): void {
    this.videomService.searchVideo({page: 1, nums: 10}, this.queryVideo).subscribe(
      (value) => {
        console.log(value);
        this.option = {total: value.data.totalRecord, row: value.data.pageSize};
        this.videos = value.data.contents;
      }
    );
  }
  // 重置
  public  resetQueryVideo(): void {
    this.queryVideo.groupId = null;
    this.queryVideo.serviceAreaId = null;
    this.queryVideo.orientationDO = null;
    this.addAreaTree.label = null;
    this.ServiceName = null;
    this.orientationName = null;
    this.VideoGroupName = null;
    this.addAreaSelect = '请选择区域...';
    this.updateVideoData(this.nowPage);
  }


  // 选择服务区
  public serviceChange(e): void {
    this.addVideo.serviceAreaId = e.value.id;
    this.modifyVideo.serviceAreaId = e.value.id;
    this.queryVideo.serviceAreaId = e.value.id;
    this.videomService.searchHighDirection(e.value.id).subscribe(
      (value) => {
        this.highsdData = this.initializeServiceAreaDirec(value.data);
      }
    );
  }

  // 选择上下行
  public directionChange(e): void {
    this.addVideo.saOrientationId = e.value.id;
    this.modifyVideo.saOrientationId = e.value.id;
    this.queryVideo.orientationDO= e.value.id;
    console.log(e.value.id);
    this.videomService.searchStoreItem(e.value.orientaionId).subscribe(
      (value) => {
        this.storeList = this.initializeStore(value.data);
      }
    );
    this.videomService.searchVideoGroupList(e.value.orientaionId).subscribe(
      (value) => {
        this.videoGroupList = this.initializeVideoGroup(value.data);
      }
    );
  }

  // 选择店铺
  public storeChange(e): void {
    this.addVideo.storeId = e.value.id;
    this.modifyVideo.storeId = e.value.id;
  }

  // 选择视频分组
  public videoGroupChange(e): void {
    this.addVideo.groupId = e.value.id;
    this.modifyVideo.groupId = e.value.id;
    this.queryVideo.groupId = e.value.id;
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
  public initializeVideoGroup(data): any {
    const oneChild = [];
    for (let i = 0; i < data.length; i++) {
      const childnode = new SelectItem();
      childnode.name = data[i].groupName;
      childnode.id = data[i].id;
      oneChild.push(childnode);
    }
    return oneChild;
  }
  //分页查询
  public nowpageEventHandle(event: any) {
    this.nowPage = event;
    console.log('我是父组件');
    console.log(this.nowPage);
    this.videomService.searchList({page: event, nums: 10}).subscribe(
      (value) => {
        console.log(value.data.contents);
        this.videos = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
      }
    );
    this.selectedvideos = null;
  }
}

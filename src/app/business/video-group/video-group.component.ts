import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ConfirmationService, Message, MessageService} from 'primeng/api';
import {GlobalService} from '../../common/services/global.service';
import {VideoGroupService} from '../../common/services/video-group.service';
import {AddVideoGroup, ModifyVideoGroup, QueryVideoGroup, VideoGroup} from '../../common/model/video-group-model';
import {AddTreeArea, SelectItem, TreeNode} from '../../common/model/shared-model';
import {Dropdown} from 'primeng/primeng';
import {log} from 'util';

@Component({
  selector: 'app-video-group',
  templateUrl: './video-group.component.html',
  styleUrls: ['./video-group.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class VideoGroupComponent implements OnInit {
  @ViewChild('addSerdropDown') addSerdropDown: Dropdown;
  @ViewChild('addDircDropDown') addDircDropDown: Dropdown;
  @ViewChild('modifySer') modifySer: Dropdown;
  @ViewChild('modifyDirec') modifyDirec: Dropdown;
  // table显示相关
  public videoGroups: VideoGroup[]; // 整个table数据
  public cols: any[]; // 表头
  public videoGroup: any; // 接收选中的值
  public selectedVideoGroups: VideoGroup[]; // 多个选择收银设备
  // 增加相关
  public addDialog: boolean; // 增加弹窗显示控制
  public addVideoGroup: AddVideoGroup = new AddVideoGroup(); // 添加参数字段
  public areaDialog: boolean; // 区域树弹窗
  public addAreaTrees: AddTreeArea[]; // 区域树结构
  public addAreaTree: AddTreeArea = new AddTreeArea(); // 区域树选择
  public addServicesAreas: SelectItem[]; // 服务区列表
  public highsdData: SelectItem[]; // 上下行选择数据
  public addArealabel: any;
  // 分页相关
  public nowPage: any;
  public option: any;
  // 条件查询相关
  public queryVideoGroup: QueryVideoGroup = new QueryVideoGroup();
  public  ServiceName: any;
  public  orientationName: any;

  // 修改相关
  public modifyDialog: boolean; // 添加弹窗显示控制
  public modifyVideoGroup: ModifyVideoGroup = new ModifyVideoGroup();
  public modifyhighsdData: any;
  public col: any;
  public modifyserviceAreaName: any;
  public modifyOrientationName: any;
  // 其他提示弹窗相关
  public cleanTimer: any; // 清除时钟
  public msgs: Message[] = []; // 消息弹窗
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private videoGroupService: VideoGroupService,
    private globalService: GlobalService
  ) {
  }

  ngOnInit() {
    this.addAreaTree.label = '请选择区域...';
    this.cols = [
      {field: 'groupCode', header: '分组编号'},
      {field: 'groupName', header: '分组名称'},
      {field: 'serviceAreaName', header: '服务区名称'},
      {field: 'orientationDO', header: '上下行'},
      {field: 'udt', header: '添加时间'},
    ];
    this.updateCashDate();
    this.queryVideoGroup.orientationDO = null;
    this.queryVideoGroup.serviceAreaId = null;
  }

  public updateCashDate(): void {
    this.videoGroupService.searchList({page: 1, nums: 10}).subscribe(
      (value) => {
        this.option = {total: value.data.totalRecord, row: value.data.pageSize};
        this.videoGroups = value.data.contents;

      }
    );
  }

  // 选中后赋值
  public onRowSelect(event): void {
    console.log(event.data);
    this.videoGroup = this.cloneCar(event.data);
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
        this.videoGroupService.addItem(this.addVideoGroup).subscribe(
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
    if (this.selectedVideoGroups === undefined || this.selectedVideoGroups.length === 0) {
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
        message: `确定要删除这${this.selectedVideoGroups.length}项吗？`,
        header: '删除提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.globalService.eventSubject.next({display: true});
          if (this.selectedVideoGroups.length === 1) {
            this.videoGroupService.deleteItem(this.selectedVideoGroups[0].id).subscribe(
              (value) => {
                if (value.status === '200') {
                  setTimeout(() => {
                    this.globalService.eventSubject.next({display: false});
                    if (this.cleanTimer) {
                      clearTimeout(this.cleanTimer);
                    }
                    this.msgs = [];
                    this.selectedVideoGroups = undefined;
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
            for (let i = 0; i < this.selectedVideoGroups.length; i++) {
              ids.push(this.selectedVideoGroups[i].id);
            }
            this.videoGroupService.deleteList(ids).subscribe(
              (value) => {
                if (value.status === '200') {
                  setTimeout(() => {
                    this.globalService.eventSubject.next({display: false});
                    if (this.cleanTimer) {
                      clearTimeout(this.cleanTimer);
                    }
                    this.msgs = [];
                    this.selectedVideoGroups = undefined;
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

  // 选择区域

  // 修改
  public modifyBtn(): void {
    if (this.selectedVideoGroups === undefined || this.selectedVideoGroups.length === 0) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.msgs = [];
      this.msgs.push({severity: 'error', summary: '操作错误', detail: '请选择需要删除的项'});
      this.cleanTimer = setTimeout(() => {
        this.msgs = [];
      }, 3000);
    } else if (this.selectedVideoGroups.length === 1) {

      if(this.selectedVideoGroups[0].administrativeAreaId) {
        this.videoGroupService.searchServiceAreaList(this.selectedVideoGroups[0].administrativeAreaId).subscribe(
          (value) => {
            this.addServicesAreas = this.initializeServiceArea(value.data);
          }
        );
      }
     if(this.selectedVideoGroups[0].orientationDO.id){
       this.videoGroupService.searchHighDirection(this.selectedVideoGroups[0].orientationDO.id).subscribe(
         (value) => {
           this.highsdData = this.initializeServiceAreaDirec(value.data);
         }
       );
     }
      this.modifyDialog = true;
      this.modifyserviceAreaName = this.selectedVideoGroups[0].serviceAreaName;
      this.modifyOrientationName =this.selectedVideoGroups[0].orientationDO.flagName+"："+ this.selectedVideoGroups[0].orientationDO.source+"—>"+ this.selectedVideoGroups[0].orientationDO.destination;
      this.modifyVideoGroup.groupCode = this.selectedVideoGroups[0].groupCode;
      this.modifyVideoGroup.administrativeAreaId = this.selectedVideoGroups[0].administrativeAreaId;
      this.modifyVideoGroup.administrativeAreaName = this.selectedVideoGroups[0].administrativeAreaName;
      this.modifyVideoGroup.groupName = this.selectedVideoGroups[0].groupName;
      this.modifyVideoGroup.id = this.selectedVideoGroups[0].id;
      this.modifyVideoGroup.idt = this.selectedVideoGroups[0].idt;
      this.modifyVideoGroup.enabled = this.selectedVideoGroups[0].enabled;
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
    console.log(this.modifyVideoGroup);
    this.confirmationService.confirm({
      // console.log(this.modifyVideoGroup);
      message: `确定要修改吗？`,
      header: '修改提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.globalService.eventSubject.next({display: true});
        this.videoGroupService.modifyList(this.modifyVideoGroup).subscribe(
          (value) => {
            if (value.status === '200') {
              this.globalService.eventSubject.next({display: false});
              if (this.cleanTimer) {
                clearTimeout(this.cleanTimer);
              }
              this.msgs = [];
              this.selectedVideoGroups = undefined;
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
  public queryVideoGroupData(): void {
    this.videoGroupService.searchVideoGroup({page: 1, nums: 10}, this.queryVideoGroup).subscribe(
      (value) => {
        this.option = {total: value.data.totalRecord, row: value.data.pageSize};
        this.videoGroups = value.data.contents;

      }
    );
  }

  public AreaTreeClick(): void {
    this.areaDialog = true;
    this.videoGroupService.searchAreaList({page: 1, nums: 100}).subscribe(
      (val) => {
        this.addAreaTrees = this.initializeTree(val.data.contents);
      }
    );
  }

  public treeSelectAreaClick(): void {

    this.addArealabel = this.addAreaTree.label;
    this.addVideoGroup.administrativeAreaId = this.addAreaTree.id;
    this.addVideoGroup.administrativeAreaName = this.addAreaTree.label;

    this.modifyVideoGroup.administrativeAreaId = this.addAreaTree.id;
    this.modifyVideoGroup.administrativeAreaName = this.addAreaTree.label;
    const a = parseFloat(this.addAreaTree.level);
    if (a >= 2) {
      this.areaDialog = false;
      this.videoGroupService.searchServiceAreaList(this.addAreaTree.id).subscribe(
        (value) => {
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
    this.addVideoGroup.serviceAreaId = e.value.id;
    this.modifyVideoGroup.serviceAreaId = e.value.id;
    this.queryVideoGroup.serviceAreaId = e.value.id;
    this.videoGroupService.searchHighDirection(e.value.id).subscribe(
      (value) => {
        this.highsdData = this.initializeServiceAreaDirec(value.data);
      }
    );
  }

  public clearDown(): void {
    this.addArealabel= '请选择区域...';
    this.addSerdropDown.value = '请选择服务区...';
    this.addDircDropDown.value = '请选择服务区方向...';
    this.modifySer.value = '请选择服务区...';
    this.modifyDirec.value = '请选择服务区方向...';
    this.addServicesAreas = null;
    this.highsdData = null;
    this.addVideoGroup = new AddVideoGroup();
  }
  // 重置
  public  resetQueryVideoGroup(): void {
    this.queryVideoGroup.orientationDO = null;
    this.queryVideoGroup.serviceAreaId = null;
    this.addArealabel = '请选择区域...';
    this.orientationName = null;
    this.ServiceName = null;
    this.addServicesAreas = null;
    this.highsdData = null;
    this.updateCashDate();
  }

  // 选择上下行
  public directionChange(e): void {
    this.addVideoGroup.saOrientationId = e.value.id;
    this.modifyVideoGroup.saOrientationId = e.value.id;
    this.queryVideoGroup.orientationDO = e.value.id;
    /* this.videoGroupService.searchStoreItem(e.value.orientaionId).subscribe(
       (value) => {
         console.log(value.data);
         this.storeList = this.initializeStore(value.data);
       }
     );*/
  }

  // 选择是否可用开关
  public selectEnabledClick(e): void {
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
        childnode.id = data[i].id;
        oneChild.push(childnode);
      }
    }
    return oneChild;
  }

  //分页查询
  public nowpageEventHandle(event: any) {
    this.nowPage = event;
    console.log('我是父组件');
    console.log(this.nowPage);
    this.videoGroupService.searchList({page: this.nowPage, nums: 10}).subscribe(
      (value) => {
        this.videoGroups = value.data.contents;
      }
    );
    this.selectedVideoGroups = null;
  }
}

import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ConfirmationService, Message, MessageService} from 'primeng/api';
import {GlobalService} from '../../../common/services/global.service';
import {SystemService} from '../../../common/services/system.service';
import {AddEventType, EventType, ModifyEventType, QueryEventType} from '../../../common/model/system-model';

@Component({
  selector: 'app-event-type',
  templateUrl: './event-type.component.html',
  styleUrls: ['./event-type.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EventTypeComponent implements OnInit {
  // table显示相关
  public eventTypes: EventType[]; // 整个table数据
  public cols: any[]; // 表头
  public eventType: any; // 接收选中的值
  public selecteEventTypes: EventType[]; // 多个选择
  // 增加相关
  public addDialog: boolean; // 增加弹窗显示控制
  public addEventType: AddEventType = new AddEventType();
  //分页相关
  public nowPage: any;
  public option: any;
  // 条件查询相关
  public queryEventType: QueryEventType = new QueryEventType();
  // 修改相关
  public modifyDialog: boolean; // 修改弹窗显示控制
  public modifyEventType: ModifyEventType = new ModifyEventType();
  // public modifyList: any[]; // 选择的数据
  // 其他提示弹窗相关
  public cleanTimer: any; // 清除时钟
  public msgs: Message[] = []; // 消息弹窗
  constructor(
    private systemService: SystemService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private globalService: GlobalService
  ) {
  }

  ngOnInit() {
    this.cols = [
      {field: 'categoryCode', header: '分类编码'},
      {field: 'eventCategoryName', header: '分类名称'},
      {field: 'idt', header: '创建时间'},
    ];
    this.updateEventTypeDate();
    this.queryEventType.categoryCode = null;
    this.queryEventType.eventCategoryName = null;
  }

  public updateEventTypeDate(): void {
    this.systemService.searchEventTypeList({page: 1, nums: 10}).subscribe(
      (value) => {
        // console.log(value);
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: 1};
        this.eventTypes = value.data.contents;
      }
    );
  }

  // 选中后赋值
  public onRowSelect(event): void {
    // console.log(event.data);
    this.eventType = this.cloneCar(event.data);
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
    console.log(this.addEventType);
    /* if (this.addVideo.inStore === '1') {
       this.addVideo.inStore = true;
     } else {
       this.addVideo.inStore = false;
     }*/
    this.confirmationService.confirm({
      message: `确定要增加吗？`,
      header: '增加提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.globalService.eventSubject.next({display: true});
        this.systemService.addEventTypeItem(this.addEventType).subscribe(
          (value) => {
            if (value.status === '200') {
              this.globalService.eventSubject.next({display: false});
              if (this.cleanTimer) {
                clearTimeout(this.cleanTimer);
              }
              this.msgs = [];
              this.msgs.push({severity: 'success', summary: '增加提醒', detail: value.message});
              this.updateEventTypeDate();
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
    if (this.selecteEventTypes === undefined || this.selecteEventTypes.length === 0) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      // 判断是否选择
      this.msgs = [];
      this.msgs.push({severity: 'error', summary: '操作错误', detail: '请选择需要删除的项'});
      this.cleanTimer = setTimeout(() => {
        this.msgs = [];
      }, 3000);
    } else {
      // 删除单个
      this.confirmationService.confirm({
        message: `确定要删除这${this.selecteEventTypes.length}项吗？`,
        header: '删除提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.globalService.eventSubject.next({display: true});
          if (this.selecteEventTypes.length === 1) {
            this.systemService.deleteEventTypeItem(this.selecteEventTypes[0].id).subscribe(
              (value) => {
                if (value.status === '200') {
                  this.globalService.eventSubject.next({display: false});
                  if (this.cleanTimer) {
                    clearTimeout(this.cleanTimer);
                  }
                  this.msgs = [];
                  this.selecteEventTypes = undefined;
                  this.msgs.push({severity: 'success', summary: '删除提醒', detail: value.message});
                  this.cleanTimer = setTimeout(() => {
                    this.msgs = [];
                  }, 3000);
                  this.updateEventTypeDate();
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
            // 删除多个
            const ids = [];
            for (let i = 0; i < this.selecteEventTypes.length; i++) {
              ids.push(this.selecteEventTypes[i].id);
            }
            this.systemService.deleteEventTypeList(ids).subscribe(
              (value) => {
                if (value.status === '200') {
                  this.globalService.eventSubject.next({display: false});
                  if (this.cleanTimer) {
                    clearTimeout(this.cleanTimer);
                  }
                  this.msgs = [];
                  this.selecteEventTypes = undefined;
                  this.updateEventTypeDate();
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
        reject: () => {
        }
      });
    }
  }

  // 修改
  public modifyBtn(): void {
    // if (this.)
    // console.log(this.selecteEventTypes[0]['id']);
    // if (this.selecteEventTypes.length > 1) {
    // }
    if (this.selecteEventTypes === undefined || this.selecteEventTypes.length === 0) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.msgs = [];
      this.msgs.push({severity: 'error', summary: '操作错误', detail: '请选择需要修改的项'});
      this.cleanTimer = setTimeout(() => {
        this.msgs = [];
      }, 3000);
    } else if (this.selecteEventTypes.length > 0 && this.selecteEventTypes.length <= 1) {
      this.modifyDialog = true;
      this.modifyEventType.categoryCode = this.selecteEventTypes[0]['categoryCode'];
      this.modifyEventType.eventCategoryName = this.selecteEventTypes[0]['eventCategoryName'];
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
  public modifyData(): void {
    this.confirmationService.confirm({
      message: `确定要修改吗？`,
      header: '修改提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.modifyEventType.id = this.selecteEventTypes[0].id;
        this.modifyEventType.idt = this.selecteEventTypes[0].idt;
        console.log(this.modifyEventType);
        this.globalService.eventSubject.next({display: true});
        this.systemService.modifyEventTypeItem(this.modifyEventType).subscribe(
          (value) => {
            if (value.status === '200') {
              this.globalService.eventSubject.next({display: false});
              if (this.cleanTimer) {
                clearTimeout(this.cleanTimer);
              }
              this.msgs = [];
              this.selecteEventTypes = undefined;
              this.msgs.push({severity: 'success', summary: '修改提醒', detail: value.message});
              this.updateEventTypeDate();
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
  
  //条件查询
  public queryEventTypeData(): void {
    this.systemService.searchEventType({page: 1, nums: 10},this.queryEventType).subscribe(
      (value) => {
        console.log(value);
        this.option = {total: value.data.totalRecord, row: value.data.pageSize};
        this.eventTypes = value.data.contents;
      }
    );
  }
  // 重置
  public  resetQueryEventType(): void {
    this.updateEventTypeDate();
    this.queryEventType.categoryCode = null;
    this.queryEventType.eventCategoryName = null;
  }

  //分页查询
  public nowpageEventHandle(event: any) {
    this.nowPage = event;
    console.log('我是父组件');
    console.log(this.nowPage);
    this.systemService.searchEventTypeList({page: this.nowPage, nums: 10}).subscribe(
      (value) => {
        console.log(value);
        this.eventTypes = value.data.contents;
      }
    );
    this.selecteEventTypes = null;
  }
}

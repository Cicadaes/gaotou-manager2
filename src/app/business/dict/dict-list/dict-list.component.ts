import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ConfirmationService, Message, MessageService} from 'primeng/api';
import {GlobalService} from '../../../common/services/global.service';
import {DictService} from '../../../common/services/dict.service';
import {AddDictList, DictList, ModifyDictList} from '../../../common/model/dict.model';

@Component({
  selector: 'app-dict-list',
  templateUrl: './dict-list.component.html',
  styleUrls: ['./dict-list.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class DictListComponent implements OnInit {
// table显示相关
  public dictLists: DictList[]; // 整个table数据
  public cols: any[]; // 表头
  public dictList: any; // 接收选中的值
  public selectedDictLists: DictList[]; // 多个选择
  // 增加相关
  public addDialog: boolean; // 增加弹窗显示控制
  public addDictList: AddDictList = new AddDictList();
  //分页相关
  public nowPage: any;
  public option: any;
  // 修改相关
  public modifyDialog: boolean;
  public modifyDictList: ModifyDictList = new ModifyDictList();
  // 其他提示弹窗相关
  public cleanTimer: any; // 清除时钟
  public msgs: Message[] = []; // 消息弹窗
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dictService: DictService,
    private globalService: GlobalService
  ) {
  }

  ngOnInit() {
    this.cols = [
      {field: 'dictionaryCode', header: '字典编码'},
      {field: 'dictionaryName', header: '字典名称'},
      {field: 'idt', header: '添加时间'},
    ];
    this.updateDictListData();
  }

  public updateDictListData(): void {
    this.dictService.searchDictList({page: 1, nums: 10}).subscribe(
      (value) => {
        console.log(value);
        this.option = {total: value.data.totalRecord, row: value.data.pageSize};
        this.dictLists = value.data.contents;
      }
    );
  }

  // 选中后赋值
  public onRowSelect(event): void {
    console.log(event.data);
    this.dictList = this.cloneCar(event.data);
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
    console.log(this.addDictList);
    this.confirmationService.confirm({
      message: `确定要增加吗？`,
      header: '增加提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.globalService.eventSubject.next({display: true});
        this.dictService.addDictItem(this.addDictList).subscribe(
          (value) => {
            if (value.status === '200') {
              this.globalService.eventSubject.next({display: false});
              if (this.cleanTimer) {
                clearTimeout(this.cleanTimer);
              }
              this.msgs = [];
              this.msgs.push({severity: 'success', summary: '增加提醒', detail: value.message});
              this.updateDictListData();
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
    if (this.selectedDictLists === undefined || this.selectedDictLists.length === 0) {
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
        message: `确定要删除这${this.selectedDictLists.length}项吗？`,
        header: '删除提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.globalService.eventSubject.next({display: true});
          if (this.selectedDictLists.length === 1) {
            this.dictService.deleteDictItem(this.selectedDictLists[0].id).subscribe(
              (value) => {
                if (value.status === '200') {
                  setTimeout(() => {
                    this.globalService.eventSubject.next({display: false});
                    if (this.cleanTimer) {
                      clearTimeout(this.cleanTimer);
                    }
                    this.msgs = [];
                    this.selectedDictLists = undefined;
                    this.msgs.push({severity: 'success', summary: '删除提醒', detail: value.message});
                    this.cleanTimer = setTimeout(() => {
                      this.msgs = [];
                    }, 3000);
                    this.updateDictListData();
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
            for (let i = 0; i < this.selectedDictLists.length; i++) {
              ids.push(this.selectedDictLists[i].id);
            }
            this.dictService.deleteDictList(ids).subscribe(
              (value) => {
                if (value.status === '200') {
                  setTimeout(() => {
                    this.globalService.eventSubject.next({display: false});
                    if (this.cleanTimer) {
                      clearTimeout(this.cleanTimer);
                    }
                    this.msgs = [];
                    this.selectedDictLists = undefined;
                    this.updateDictListData();
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
    if (this.selectedDictLists === undefined || this.selectedDictLists.length === 0) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.msgs = [];
      this.msgs.push({severity: 'error', summary: '操作错误', detail: '请选择需要修改的项'});
      this.cleanTimer = setTimeout(() => {
        this.msgs = [];
      }, 3000);
    }else if (this.selectedDictLists.length ===1){
      this.modifyDialog = true;
      this.modifyDictList.dictionaryCode = this.selectedDictLists[0].dictionaryCode;
      this.modifyDictList.id = this.selectedDictLists[0].id;
      this.modifyDictList.idt = this.selectedDictLists[0].idt;
      this.modifyDictList.dictionaryName = this.selectedDictLists[0].dictionaryName;
      this.modifyDictList.enabled = this.selectedDictLists[0].enabled;
    }else {
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
  public modifySure():void{
    this.confirmationService.confirm({
      message: `确定要修改吗？`,
      header: '修改提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.globalService.eventSubject.next({display: true});
        this.dictService.modifyDictItem(this.modifyDictList).subscribe(
          (value) => {
            if (value.status === '200') {
              this.globalService.eventSubject.next({display: false});
              if (this.cleanTimer) {
                clearTimeout(this.cleanTimer);
              }
              this.msgs = [];
              this.selectedDictLists = undefined;
              this.msgs.push({severity: 'success', summary: '修改提醒', detail: value.message});
              this.updateDictListData();
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
  //分页查询
  public nowpageEventHandle(event: any) {
    this.nowPage = event;
    console.log('我是父组件');
    console.log(this.nowPage);
    this.dictService.searchDictList({page: this.nowPage, nums: 10}).subscribe(
      (value) => {
        console.log(value);
        this.dictLists = value.data.contents;
      }
    );
    this.modifyDictList = null;
  }
}

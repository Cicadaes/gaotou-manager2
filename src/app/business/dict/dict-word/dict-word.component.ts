import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ConfirmationService, Message, MessageService} from 'primeng/api';
import {GlobalService} from '../../../common/services/global.service';
import {DictService} from '../../../common/services/dict.service';
import {AddDictWord, DictWord, ModifyDictWord, QueryDictWord} from '../../../common/model/dict.model';
import {SelectItem} from '../../../common/model/shared-model';

@Component({
  selector: 'app-dict-word',
  templateUrl: './dict-word.component.html',
  styleUrls: ['./dict-word.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class DictWordComponent implements OnInit {
  // table显示相关
  public dictWords: DictWord[]; // 整个table数据
  public cols: any[]; // 表头
  public dictWord: any; // 接收选中的值
  public selectedDictWords: DictWord[]; // 多个选择
  // 增加相关
  public addDialog: boolean; // 增加弹窗显示控制
  public addDictWord: AddDictWord = new AddDictWord(); // 添加参数字段
  public addDictListSelect: SelectItem[]; // 字典列表
  //分页相关
  public nowPage: any;
  public option1: any;

  //条件查询
  public queryDictWord: QueryDictWord = new QueryDictWord();
  // 修改相关
  public modifyDialog: boolean;
  public modifyDictWord: ModifyDictWord = new ModifyDictWord();
  public option: any;
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
      {field: 'entryCode', header: '词条编码'},
      {field: 'sequence', header: '显示序列'},
      {field: 'entryValue', header: '词条值'},
      {field: 'idt', header: '添加时间'},
    ];
    this.updateDictWordsata();
    this.dictService.searchDictList({page: 1, nums: 100}).subscribe(
      (value) => {
        console.log(value);
        this.addDictListSelect = this.initializeSelectDictList(value.data.contents);
      }
    );
    this.queryDictWord.dictionaryCode = null;
    this.queryDictWord.entryCode = null;
    this.queryDictWord.entryValue = null;
  }

  public updateDictWordsata(): void {
    this.dictService.searchDictWordList({page: 1, nums: 10}).subscribe(
      (value) => {
        console.log(value);
        this.option1 = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: 1};
        this.dictWords = value.data.contents;
      }
    );
  }

  // 选中后赋值
  public onRowSelect(event): void {
    console.log(event.data);
    this.dictWord = this.cloneCar(event.data);
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
    console.log(this.addDictWord);
    this.confirmationService.confirm({
      message: `确定要增加吗？`,
      header: '增加提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.globalService.eventSubject.next({display: true});
        this.dictService.addDictWordItem(this.addDictWord).subscribe(
          (value) => {
            if (value.status === '200') {
              this.globalService.eventSubject.next({display: false});
              if (this.cleanTimer) {
                clearTimeout(this.cleanTimer);
              }
              this.msgs = [];
              this.msgs.push({severity: 'success', summary: '增加提醒', detail: value.message});
              this.updateDictWordsata();
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
    if (this.selectedDictWords === undefined || this.selectedDictWords.length === 0) {
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
        message: `确定要删除这${this.selectedDictWords.length}项吗？`,
        header: '删除提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.globalService.eventSubject.next({display: true});
          if (this.selectedDictWords.length === 1) {
            this.dictService.deleteDictWordItem(this.selectedDictWords[0].id).subscribe(
              (value) => {
                if (value.status === '200') {
                  this.globalService.eventSubject.next({display: false});
                  /* this.selectedorgs.map((val, inx) => {
                     const index = this.cashs.indexOf(val);
                     this.cashs = this.cashs.filter((val1, i) => i !== index);
                   });*/
                  if (this.cleanTimer) {
                    clearTimeout(this.cleanTimer);
                  }
                  this.msgs = [];
                  this.selectedDictWords = undefined;
                  this.msgs.push({severity: 'success', summary: '删除提醒', detail: value.message});
                  this.cleanTimer = setTimeout(() => {
                    this.msgs = [];
                  }, 3000);
                  this.updateDictWordsata();
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
            for (let i = 0; i < this.selectedDictWords.length; i++) {
              ids.push(this.selectedDictWords[i].id);
            }
            this.dictService.deleteDictWordList(ids).subscribe(
              (value) => {
                if (value.status === '200') {
                  setTimeout(() => {
                    this.globalService.eventSubject.next({display: false});
                    /*this.selectedorgs.map((val, inx) => {
                      const index = this.cashs.indexOf(val);
                      this.cashs = this.cashs.filter((val1, i) => i !== index);
                    });*/
                    if (this.cleanTimer) {
                      clearTimeout(this.cleanTimer);
                    }
                    this.msgs = [];
                    this.selectedDictWords = undefined;
                    this.updateDictWordsata();
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
    if (this.selectedDictWords === undefined || this.selectedDictWords.length === 0) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.msgs = [];
      this.msgs.push({severity: 'error', summary: '操作错误', detail: '请选择需要修改的项'});
      this.cleanTimer = setTimeout(() => {
        this.msgs = [];
      }, 3000);
    } else if (this.selectedDictWords.length === 1) {
      // this.dictService.searchDictList({page: 1, nums: 100}).subscribe(
      //   (value) => {
      //     console.log(value);
      //     this.addDictListSelect = this.initializeSelectDictList(value.data.contents);
      //   }
      // );
      this.modifyDialog = true;
      this.modifyDictWord.id = this.selectedDictWords[0].id;
      this.modifyDictWord.idt = this.selectedDictWords[0].idt;
      this.modifyDictWord.dictionaryCode = this.selectedDictWords[0].dictionaryCode;
      this.modifyDictWord.enabled = this.selectedDictWords[0].enabled;
      this.modifyDictWord.entryCode = this.selectedDictWords[0].entryCode;
      this.modifyDictWord.entryValue = this.selectedDictWords[0].entryValue;
      this.modifyDictWord.sequence = this.selectedDictWords[0].sequence;
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
    console.log(this.modifyDictWord);
    this.confirmationService.confirm({
      message: `确定要修改吗？`,
      header: '修改提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.globalService.eventSubject.next({display: true});
        this.dictService.modifyDictWordItem(this.modifyDictWord).subscribe(
          (value) => {
            if (value.status === '200') {
              this.globalService.eventSubject.next({display: false});
              if (this.cleanTimer) {
                clearTimeout(this.cleanTimer);
              }
              this.msgs = [];
              this.selectedDictWords = undefined;
              this.msgs.push({severity: 'success', summary: '增加提醒', detail: value.message});
              this.updateDictWordsata();
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
  public  queryDictWordData(): void {
    this.dictService.searchDictWord({page: 1, nums: 10},this.queryDictWord).subscribe(
      (value) => {
        console.log(value);
        this.option1 = {total: value.data.totalRecord, row: value.data.pageSize};
        this.dictWords = value.data.contents;
      }
    );
  }
  //重置
  public  resetQueryDictWord(): void {
    this.queryDictWord.dictionaryCode = null;
    this.queryDictWord.entryCode = null;
    this.queryDictWord.entryValue = null;
    this.updateDictWordsata();
  }

  // 选择字典
  public dictChange(e): void {
    this.addDictWord.dictionaryCode = e.value.id;
    this.modifyDictWord.dictionaryCode = e.value.id;
  }

  // 格式化数据
  public initializeSelectDictList(data): any {
    const oneChild = [];
    for (let i = 0; i < data.length; i++) {
      const childnode = new SelectItem();
      childnode.name = data[i].dictionaryName;
      childnode.id = data[i].dictionaryCode;
      oneChild.push(childnode);
    }
    return oneChild;
  }
  //分页查询
  public nowpageEventHandle(event: any) {
    this.nowPage = event;
    console.log('我是父组件');
    console.log(this.nowPage);
    this.dictService.searchDictWordList({page: this.nowPage, nums: 10}).subscribe(
      (value) => {
        console.log(value);
        this.dictWords = value.data.contents;
      }
    );
    this.selectedDictWords = null;
  }
}

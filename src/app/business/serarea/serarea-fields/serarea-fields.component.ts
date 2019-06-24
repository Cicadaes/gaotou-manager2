import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AddField, Field, ModifyField} from '../../../common/model/serarea-model';
import {ConfirmationService, Message, MessageService} from 'primeng/api';
import {SerareaService} from '../../../common/services/serarea.service';
import {GlobalService} from '../../../common/services/global.service';
import {SelectItem} from '../../../common/model/shared-model';

@Component({
  selector: 'app-serarea-fields',
  templateUrl: './serarea-fields.component.html',
  styleUrls: ['./serarea-fields.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SerareaFieldsComponent implements OnInit {
  // table显示相关
  public fields: Field[]; // 整个table数据
  public cols: any[]; // 表头
  public field: any; // 接收选中的值
  public selectedfields: Field[]; // 多个选择
  //分页相关
  public nowPage: any;
  public option: any;
  // 增加相关
  public addDialog: boolean; // 增加弹窗显示控制
  public addField: AddField = new AddField();
  public addFieldType: SelectItem[]; // 服务区列表
  // 修改相关
  public modifyDialog: boolean; //修改弹窗显示控制
  public modifyField: ModifyField = new ModifyField();
  public attributeCategoryName: any;
  
  // 条件查询相关
  public attributeName1: any;
  // 其他提示弹窗相关
  public cleanTimer: any; // 清除时钟
  public msgs: Message[] = []; // 消息弹窗
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private serareaService: SerareaService,
    private globalService: GlobalService
  ) {
  }

  ngOnInit() {
    this.cols = [
      {field: 'id', header: '字段ID'},
      {field: 'attributeName', header: '字段编码'},
      {field: 'attributeDesc', header: '字段名称'},
      {field: 'position', header: '字段顺序'},
      {field: 'idt', header: '添加时间'},
    ];

    this.uploadFieldData(1);
    this.serareTypeFiled();
    this.attributeName1 = null;
  }

  public uploadFieldData(page): void {
    this.serareaService.searchSaFieldList({page: page, nums: 10}).subscribe(
      (value) => {
        // console.log(value);
        this.fields = value.data.contents;
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};

      }
    );
  }
  public serareTypeFiled(): void {
    this.serareaService.searchSaFieldTypeList({page: 1, nums: 10}).subscribe(
      (val) => {
        // console.log(val.data.contents);
        this.addFieldType = this.initializeFieldType(val.data.contents);
      }
    );
  }
  // 选中后赋值
  public onRowSelect(event): void {
    console.log(event.data);
    this.field = this.cloneCar(event.data);
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
    console.log(this.addField);
    if (this.addField.showTableHead === '1') {
      this.addField.showTableHead = true;
    } else {
      this.addField.showTableHead = false;
    }
    if (this.addField.hasOrientation === '1') {
      this.addField.hasOrientation = true;
    } else {
      this.addField.hasOrientation = false;
    }
    this.confirmationService.confirm({
      message: `确定要增加吗？`,
      header: '增加提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.globalService.eventSubject.next({display: true});
        this.serareaService.addSaFieldItem(this.addField).subscribe(
          (value) => {
            if (value.status === '200') {
              this.globalService.eventSubject.next({display: false});
              if (this.cleanTimer) {
                clearTimeout(this.cleanTimer);
              }
              this.msgs = [];
              this.msgs.push({severity: 'success', summary: '增加提醒', detail: value.message});
              this.uploadFieldData(this.nowPage);
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
    if (this.selectedfields === undefined || this.selectedfields.length === 0) {
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
        message: `确定要删除这${this.selectedfields.length}项吗？`,
        header: '删除提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.globalService.eventSubject.next({display: true});
          if (this.selectedfields.length === 1) {
            this.serareaService.deleteSaFieldItem(this.selectedfields[0].id).subscribe(
              (value) => {
                if (value.status === '200') {
                  this.globalService.eventSubject.next({display: false});
                  if (this.cleanTimer) {
                    clearTimeout(this.cleanTimer);
                  }
                  this.msgs = [];
                  this.selectedfields = undefined;
                  this.msgs.push({severity: 'success', summary: '删除提醒', detail: value.message});
                  this.cleanTimer = setTimeout(() => {
                    this.msgs = [];
                  }, 3000);
                  this.uploadFieldData(this.nowPage);
                } else {
                  this.globalService.eventSubject.next({display: false});
                  if (this.cleanTimer) {
                    clearTimeout(this.cleanTimer);
                  }
                  this.msgs = [];
                  this.msgs.push({severity: 'error', summary: '删除提醒', detail: '服务器处理失败'});
                  this.cleanTimer = setTimeout(() => {
                    this.msgs = [];
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
            for (let i = 0; i < this.selectedfields.length; i++) {
              ids.push(this.selectedfields[i].id);
            }
            this.serareaService.deleteSaFieldList(ids).subscribe(
              (value) => {
                if (value.status === '200') {
                  this.globalService.eventSubject.next({display: false});
                  if (this.cleanTimer) {
                    clearTimeout(this.cleanTimer);
                  }
                  this.msgs = [];
                  this.selectedfields = undefined;
                  this.uploadFieldData(this.nowPage);
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
    if (this.selectedfields === undefined || this.selectedfields.length === 0) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.msgs = [];
      this.msgs.push({severity: 'error', summary: '操作错误', detail: '请选择需要修改的项'});
      this.cleanTimer = setTimeout(() => {
        this.msgs = [];
      }, 3000);
    } else if (this.selectedfields.length === 1) {
      this.serareTypeFiled();
      console.log(this.addFieldType);
      this.modifyDialog = true;
      this.modifyField.id = this.selectedfields[0].id;
      this.modifyField.idt = this.selectedfields[0].idt;
      this.modifyField.attributeCategoryId = this.selectedfields[0].attributeCategoryId;
      this.modifyField.hasOrientation = this.selectedfields[0].hasOrientation;
      this.modifyField.attributeName = this.selectedfields[0].attributeName;
      this.modifyField.attributeDesc = this.selectedfields[0].attributeDesc;
      this.modifyField.position = this.selectedfields[0].position;
      this.modifyField.showTableHead = this.selectedfields[0].showTableHead;
      this.attributeCategoryName = this.selectedfields[0].attributeCategoryName;
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
    if (this.modifyField.showTableHead === '1') {
      this.modifyField.showTableHead = true;
    } else {
      this.modifyField.showTableHead = false;
    }
    if (this.modifyField.hasOrientation === '1') {
      this.modifyField.hasOrientation = true;
    } else {
      this.modifyField.hasOrientation = false;
    }

    this.confirmationService.confirm({
      message: `确定要修改吗？`,
      header: '修改提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.globalService.eventSubject.next({display: true});
        this.serareaService.modifySaFieldItem(this.modifyField).subscribe(
          (value) => {
            if (value.status === '200') {
              this.globalService.eventSubject.next({display: false});
              if (this.cleanTimer) {
                clearTimeout(this.cleanTimer);
              }
              this.msgs = [];
              this.selectedfields=undefined;
              this.msgs.push({severity: 'success', summary: '修改提醒', detail: value.message});
              this.uploadFieldData(this.nowPage);
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

  //条件查询
  public  queryFields(): void {
    this.serareaService.searchSaField({page: 1, nums: 10},{attributeDesc:this.attributeName1}).subscribe(
      (value) => {
        console.log(value);
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};
        this.fields = value.data.contents;
      }
    );
  }
  //重置
  public  resetQueryFields(): void {
    this.attributeName1 = null;
    this.uploadFieldData(this.nowPage);
  }

  public  clearData(): void {
      this.addField = new AddField();
      this.addFieldType = null;
  }

  // 字段分类改变
  public fieldTypeChange(e) {
    // this.attributeCategoryName =
    this.addField.attributeCategoryId = e.value.id;
    this.modifyField.attributeCategoryId = e.value.id;
  }

  // 数据格式化
  public initializeFieldType(data): any {
    const oneChild = [];
    for (let i = 0; i < data.length; i++) {
      const childnode = new SelectItem();
      childnode.name = data[i].categoryName;
      childnode.id = data[i].id;
      oneChild.push(childnode);
    }
    return oneChild;
  }
  public nowpageEventHandle(event: any) {
    this.nowPage = event;
    console.log('我是父组件');
    console.log(this.nowPage);
    this.serareaService.searchSaFieldList({page: this.nowPage, nums: 10}).subscribe(
      (value) => {
        console.log(value);
        this.option = {total: value.data.totalRecord, row: value.data.pageSize, nowpage: value.data.pageNo};

        this.fields = value.data.contents;
      }
    );
  }

}

import { Component, OnInit } from '@angular/core';
import {System} from '../../common/model/system-model';
import {ConfirmationService, Message, MessageService} from 'primeng/api';
import {GlobalService} from '../../common/services/global.service';
import {SystemService} from '../../common/services/system.service';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.css']
})
export class SystemComponent implements OnInit {
  public addDialog: boolean; // 增加弹窗
  public addCar: System = new System();
  public revampDialog: boolean; // 修改弹窗
  public detailsDialog: boolean; // 详情弹窗
  public searchField: string;
  public cars: System[]; // 整个table数据
  public cols: any[]; // 表头
  public car1: any; // 接收选中的值
  public selectedCars3: System[]; // 多选接受变量
  public msgs: Message[] = []; // 消息弹窗
  public cleanTimer
    : any; // 清除时钟

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private systemService: SystemService,
    private globalService: GlobalService
  ) { }

  ngOnInit() {
    this.cols = [
      {field: 'vin', header: 'Vin'},
      {field: 'year', header: 'Year'},
      {field: 'brand', header: 'Brand'},
      {field: 'color', header: 'Color'}
    ];
    this.cars = [
      {vin: 'dsad231ff', year: '2012', brand: 'VW', color: 'Orange'},
      {vin: 'gwregre345', year: '2011', brand: 'Audi', color: 'Black'},
      {vin: 'h354htr', year: '2005', brand: 'Renault', color: 'Gray'},
      {vin: 'j6w54qgh', year: '2003', brand: 'BMW', color: 'Blue'},
    ];
  }
  // 选中后赋值
  public onRowSelect(event): void {
    this.car1 = this.cloneCar(event.data);
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
  // 增加、保存增加
  public addClick(): void {
    this.addDialog = true;
  }
  public addsSave(): void {
    this.confirmationService.confirm({
      message: `确定要增加吗？`,
      header: '增加提醒',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.globalService.eventSubject.next({display: true});
        this.systemService.addList().subscribe(
          (value) => {
            if (value.state) {
              setTimeout(() => {
                this.globalService.eventSubject.next({display: false});
                const carsSave = [...this.cars];
                carsSave.push(this.addCar);
                this.cars = carsSave;
                if (this.cleanTimer) {
                  clearTimeout(this.cleanTimer);
                }
                this.msgs = [];
                this.msgs.push({severity: 'success', summary: '增加提醒', detail: value.msg});
                this.cleanTimer = setTimeout(() => {
                  this.msgs = [];
                }, 3000);
                this.addDialog = false;
              }, 3000);
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
      reject: () => {}
    });
  }
  // 修改、保存修改
  public revampClick() {
    if (this.selectedCars3 === undefined || this.selectedCars3.length === 0) {
      if (this.cleanTimer) {
        clearTimeout(this.cleanTimer);
      }
      this.msgs = [];
      this.msgs.push({severity: 'error', summary: '操作错误', detail: '请选择需要修改的项'});
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
      this.msgs.push({severity: 'error', summary: '操作错误', detail: '修改只能选择一项'});
      this.revampDialog = false;
    } else if (this.selectedCars3.length === 1) {
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
        this.systemService.modifyList().subscribe(
          (value) => {
            if (value.state) {
              setTimeout(() => {
                this.globalService.eventSubject.next({display: false});
                const carsSave = [...this.cars];
                carsSave[this.cars.indexOf(this.selectedCars3[0])] = this.car1;
                this.cars = carsSave;
                if (this.cleanTimer) {
                  clearTimeout(this.cleanTimer);
                }
                this.msgs = [];
                this.msgs.push({severity: 'success', summary: '修改提醒', detail: value.msg});
                this.cleanTimer = setTimeout(() => {
                  this.msgs = [];
                }, 3000);
                this.selectedCars3 = undefined;
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
  }
  // 删除
  public deleteFirm(): void {
    if (this.selectedCars3 === undefined || this.selectedCars3.length === 0) {
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
        message: `确定要删除这${this.selectedCars3.length}项吗？`,
        header: '删除提醒',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.globalService.eventSubject.next({display: true});
          this.systemService.deleteList().subscribe(
            (value) => {
              if (value.state) {
                setTimeout(() => {
                  this.globalService.eventSubject.next({display: false});
                  this.selectedCars3.map((val, inx) => {
                    const index = this.cars.indexOf(val);
                    this.cars = this.cars.filter((val1, i) => i !== index);
                  });
                  if (this.cleanTimer) {
                    clearTimeout(this.cleanTimer);
                  }
                  this.msgs = [];
                  this.selectedCars3 = undefined;
                  this.msgs.push({severity: 'success', summary: '删除提醒', detail: value.msg});
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
        },
        reject: () => {}
      });
    }
  }
  // 搜索
  public searchKeydown(e): void {
    if (e.keyCode === 13) {
      this.searchClick();
    }
  }
  public searchClick(): void {
    this.globalService.eventSubject.next({display: true});
    this.systemService.searchList({'name': '文君', 'age': '18'}).subscribe(
      (value) => {
        console.log(value);
        /*setTimeout(() => {
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
        }, 3000);*/
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
  }
  // 查看详情
  public checkClick(): void {
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
  }

}

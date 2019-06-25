import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class GlobalService {
  public eventSubject: Subject<any> = new Subject<any>(); // 控制全局加载动画
  public urls = `http://120.77.171.73:8888/highway-management`;
  // public urls = `http://123.249.28.108:8082/highway-management`;
  public url = `http://120.77.171.73:8080/highway-authentication`;
  // public urls = `http://192.168.28.139:8080`;
  // sessionStorage临时存储
  public sessionStorage: any;
  constructor() {
    if (!sessionStorage) {
      throw new Error('Current browser does not support Local Storage');
    }
    this.sessionStorage = sessionStorage;
  }
  // sessionStorage临时存储相关操作
  public set(key: string, value: string): void {
    this.sessionStorage[key] = value;
  }
  public get(key: string): string {
    return this.sessionStorage[key] || false;
  }
  public setObject(key: string, value: any): void {
    this.sessionStorage[key] = JSON.stringify(value);
  }
  public getObject(key: string): any {
    return JSON.parse(this.sessionStorage[key] || '{}');
  }
  public remove(key: string): any {
    this.sessionStorage.removeItem(key);
  }

}

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {GlobalService} from './global.service';

@Injectable()
export class CompanyService {
  // public headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
  public headers = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(
    private http: HttpClient,
    private globalService: GlobalService
  ) { }
  // 增加
  public addItem(params): Observable<any> {
    return this.http.post(`${this.globalService.urlt}/organization/add`, params);
  }
  // 删除单个
  public deleteItem(id): Observable<any> {
    return this.http.get(`${this.globalService.urlt}/organization/delete/${id}`);
  }
  // 删除多个
  public deleteList(params): Observable<any> {
    return this.http.post(`${this.globalService.urlt}/organization/delete`, params);
  }
  // 修改接口
  public modifyList(params): Observable<any> {
    return this.http.post(`${this.globalService.urlt}/organization/update`, params);
  }
  // 查询
  public searchList(num): Observable<any> {
    return this.http.post(
      `${this.globalService.urlt}/organization/queryByPaging/${num.page}/${num.nums}`, {});
  }
  /****************************数据联动相关*********************************/
  // 查询激活区域
  public searchAreaList(num): Observable<any> {
    return this.http.post(
      `${this.globalService.urlt}/administrativeArea/queryTreeByPaging/${num.page}/${num.nums}`, {});
  }
}

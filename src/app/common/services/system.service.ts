import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {GlobalService} from './global.service';

@Injectable()
export class SystemService {
// public headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
  public headers = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(
    private http: HttpClient,
    private globalService: GlobalService
  ) { }
  /*************************事件类型接口******************************/
  // 增加
  public addEventTypeItem(params): Observable<any> {
    return this.http.post(`${this.globalService.urls}/eventCategory/add`, params);
  }
  // 删除单个
  public deleteEventTypeItem(id): Observable<any> {
    return this.http.get(`${this.globalService.urls}/eventCategory/delete/${id}`);
  }
  // 删除多个
  public deleteEventTypeList(params): Observable<any> {
    return this.http.post(`${this.globalService.urls}/eventCategory/delete`, params);
  }
  // 修改
  public modifyEventTypeItem(params): Observable<any> {
    return this.http.post(`${this.globalService.urls}/eventCategory/update`, params);
  }
  // 查询
  public searchEventTypeList(num): Observable<any> {
    return this.http.post(`${this.globalService.urls}/eventCategory/queryByPaging/${num.page}/${num.nums}`, {});
  }
  // 查询
  public searchEventType(num,body): Observable<any> {
    return this.http.post(`${this.globalService.urls}/eventCategory/queryByPaging/${num.page}/${num.nums}`, body);
  }
}

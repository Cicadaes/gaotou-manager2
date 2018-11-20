import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {GlobalService} from './global.service';

@Injectable()
export class StoreService {
  // public headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
  public headers = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(
    private http: HttpClient,
    private globalService: GlobalService
  ) { }
  // 增加
  public addItem(params): Observable<any> {
    return this.http.post(`${this.globalService.urls}/storeInfo/add`, params);
  }
  // 删除单个
  public deleteItem(id): Observable<any> {
    return this.http.get(`${this.globalService.urls}/storeInfo/delete/${id}`);
  }
  // 删除多个
  public deleteList(params): Observable<any> {
    return this.http.post(`${this.globalService.urls}/storeInfo/delete`, params);
  }
  // 修改
  public modifyList(): Observable<any> {
    return this.http.post('http://localhost/gaotouService/modify.php', '');
  }
  // 查询
  public searchList(num): Observable<any> {
    return this.http.post(`${this.globalService.urls}/storeInfo/queryByPaging/${num.page}/${num.nums}`, {});
  }
  // 查询激活区域
  public searchAreaList(num): Observable<any> {
    return this.http.post(
      `${this.globalService.urls}/administrativeArea/queryTreeByPaging/${num.page}/${num.nums}`, {});
  }
  // 根据区域查询所属服务区
  public searchServiceAreaList(id): Observable<any> {
    return this.http.get(
      `${this.globalService.urls}/common/config/getServiceAreaByAdministrativeAreaId/${id}`, {});
  }
  // 根据服务区查询服务区方向
  public searchHighDirection(id): Observable<any> {
    return this.http.get(
      `${this.globalService.urls}/serviceArea/orientation/queryByServiceAreaId/${id}`);
  }
  // 查询店铺类型
  public searchStoreType(): Observable<any> {
    return this.http.get(`${this.globalService.urls}/dictionaryEntry/queryByDictionaryCode/STORE_TYPE`);
  }
}

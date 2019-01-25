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
    return this.http.post(`${this.globalService.urlt}/storeInfo/add`, params);
  }
  // 删除单个
  public deleteItem(id): Observable<any> {
    return this.http.get(`${this.globalService.urlt}/storeInfo/delete/${id}`);
  }
  // 删除多个
  public deleteList(params): Observable<any> {
    return this.http.post(`${this.globalService.urlt}/storeInfo/delete`, params);
  }
  // 修改
  public modifyList(params): Observable<any> {
    return this.http.post(`${this.globalService.urlt}/storeInfo/update`, params)
  }
  // 查询
  public searchList(num): Observable<any> {
    return this.http.post(`${this.globalService.urlt}/storeInfo/queryByPaging/${num.page}/${num.nums}`, {});
  }
  // 条件查询
  public searchStore(num,body): Observable<any> {
    return this.http.post(`${this.globalService.urlt}/storeInfo/queryByPaging/${num.page}/${num.nums}`, body);
  }

  // 查询激活区域
  public searchAreaList(num): Observable<any> {
    return this.http.post(
      `${this.globalService.urlt}/administrativeArea/queryTreeByPaging/${num.page}/${num.nums}`, {});
  }
  // 根据区域查询所属服务区
  public searchServiceAreaList(id): Observable<any> {
    return this.http.get(
      `${this.globalService.urlt}/common/config/getServiceAreaByAdministrativeAreaId/${id}`, {});
  }
  // 根据服务区查询服务区方向
  public searchHighDirection(id): Observable<any> {
    return this.http.get(
      `${this.globalService.urlt}/serviceArea/orientation/queryByServiceAreaId/${id}`);
  }
  // 查询店铺类型
  public searchStoreType(): Observable<any> {
    return this.http.get(`${this.globalService.urlt}/dictionaryEntry/queryByDictionaryCode/STORE_TYPE`);
  }
}

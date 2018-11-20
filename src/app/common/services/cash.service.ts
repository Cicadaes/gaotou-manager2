import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GlobalService} from './global.service';

@Injectable()
export class CashService {

  constructor(
    private http: HttpClient,
    private globalService: GlobalService
  ) { }
  // 增加
  public addItem(params): Observable<any> {
    return this.http.post(`${this.globalService.urls}/cashRegister/add`, params);
  }
  // 删除单个
  public deleteItem(id): Observable<any> {
    console.log(id);
    return this.http.get(`${this.globalService.urls}/cashRegister/delete/${id}`);
  }
  // 删除多个
  public deleteList(params): Observable<any> {
    return this.http.post(`${this.globalService.urls}/cashRegister/delete`, params);
  }
  // 修改
  public modifyItem(params): Observable<any> {
    return this.http.post(`${this.globalService.urls}/cashRegister/upload`, params);
  }
  // 收银设备分页查询
  public searchList(num): Observable<any> {
    return this.http.post(
      `${this.globalService.urls}/cashRegister/queryByPaging/${num.page}/${num.nums}`, {});
  }

  /**********************数据联动*****************************/
  // 查询激活区域
  public searchAreaList(num): Observable<any> {
    return this.http.post(
      `${this.globalService.urls}/administrativeArea/queryTreeByPaging/${num.page}/${num.nums}`, {});
  }
  // 查询所属服务区
  public searchServiceAreaList(id): Observable<any> {
    return this.http.get(
      `${this.globalService.urls}/common/config/getServiceAreaByAdministrativeAreaId/${id}`, {});
  }
  // 查询服务区方向
  public searchHighDirection(id): Observable<any> {
    return this.http.get(
      `${this.globalService.urls}/serviceArea/orientation/queryByServiceAreaId/${id}`);
  }
  // 根据服务区方向查询店铺
  public searchStoreItem(id): Observable<any> {
    return this.http.get(
      `${this.globalService.urls}/storeInfo/queryByOrientationId/${id}`);
  }
}

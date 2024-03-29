import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {GlobalService} from './global.service';

@Injectable()
export class WifiService {
  // public headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
  public headers = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(
    private http: HttpClient,
    private globalService: GlobalService
  ) { }
  // 增加
  public addItem(params): Observable<any> {
    return this.http.post(`${this.globalService.urls}/wifiProber/add`, params);
  }
  // 删除单个
  public deleteItem(id): Observable<any> {
    return this.http.get(`${this.globalService.urls}/wifiProber/delete/${id}`);
  }
  // 删除多个
  public deleteList(params): Observable<any> {
    console.log(params);
    return this.http.post(`${this.globalService.urls}/wifiProber/delete`, params);
  }
  // 修改
  public modifyList(params): Observable<any> {
    return this.http.post(`${this.globalService.urls}/wifiProber/update`, params);
  }
  // 查询
  public searchList(num): Observable<any> {
    return this.http.post(`${this.globalService.urls}/wifiProber/queryByPaging/${num.page}/${num.nums}`, {});
  }
  // 条件查询
  public searchWifi(num,body): Observable<any> {
    return this.http.post(`${this.globalService.urls}/wifiProber/queryByPaging/${num.page}/${num.nums}`, body);
  }
  // 查询激活区域
  public searchAreaList(num): Observable<any> {
    return this.http.post(
      `${this.globalService.urls}/administrativeArea/queryTreeByPaging/${num.page}/${num.nums}`, {});
  }
  // // 查询激活区域id查名字
  // public searchAreaName(id): Observable<any> {
  //   return this.http.get(
  //     `${this.globalService.urls}/administrativeArea/queryById/${id}`);
  // }

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
  // 分页查询
  public searchUserList(num): Observable<any> {
    return this.http.post(`${this.globalService.urls}/user/queryByPaging/${num.page}/${num.nums}`, {});
  }
  // 根据服务区方向查询店铺
  public QuryHighDirection(id): Observable<any> {
    return this.http.get(
      `${this.globalService.urls}/serviceArea/orientation/queryById/${id}`);
  }
}

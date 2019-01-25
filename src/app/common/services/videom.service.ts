import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {GlobalService} from './global.service';

@Injectable()
export class VideomService {
  // public headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
  public headers = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(
    private http: HttpClient,
    private globalService: GlobalService
  ) { }
  // 增加
  public addItem(params): Observable<any> {
    return this.http.post(`${this.globalService.urlt}/camera/add`, params);
  }
  // 删除单个
  public deleteItem(id): Observable<any> {
    return this.http.get(`${this.globalService.urlt}/camera/delete/${id}`);
  }
  // 删除多个
  public deleteList(params): Observable<any> {
    return this.http.post(`${this.globalService.urlt}/camera/delete`, params);
  }
  // 修改
  public modifyList(params): Observable<any> {
    return this.http.post(`${this.globalService.urlt}/camera/update`, params);
  }
  // 查询
  public searchList(num): Observable<any> {
    return this.http.post(`${this.globalService.urlt}/camera/queryByPaging/${num.page}/${num.nums}`, {});
  }
  // 分页查询
  public searchVideo(num,body): Observable<any> {
    return this.http.post(`${this.globalService.urlt}/camera/queryByPaging/${num.page}/${num.nums}`, body);
  }
  // 查询激活区域
  public searchAreaList(num): Observable<any> {
    return this.http.post(
      `${this.globalService.urlt}/administrativeArea/queryTreeByPaging/${num.page}/${num.nums}`, {});
  }
  // 查询所属服务区
  public searchServiceAreaList(id): Observable<any> {
    return this.http.get(
      `${this.globalService.urlt}/common/config/getServiceAreaByAdministrativeAreaId/${id}`, {});
  }
  // 查询服务区方向
  public searchHighDirection(id): Observable<any> {
    return this.http.get(
      `${this.globalService.urlt}/serviceArea/orientation/queryByServiceAreaId/${id}`);
  }
  // 根据服务区方向查询店铺
  public searchStoreItem(id): Observable<any> {
    return this.http.get(
      `${this.globalService.urlt}/storeInfo/queryByOrientationId/${id}`);
  }
  // 根据服务区方向查询视频分组
  public searchVideoGroupList(id): Observable<any> {
    return this.http.get(
      `${this.globalService.urlt}/cameraGroup/queryByOrientationId/${id}`);
  }
}

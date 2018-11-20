import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GlobalService} from './global.service';

@Injectable()
export class AreaService {
  public levelEnu = ['国家', '省份直辖市', '地级市'];
  constructor(
    private http: HttpClient,
    private globalService: GlobalService
  ) { }
  // 增加接口
  public addItem(id): Observable<any> {
    return this.http.get(`${this.globalService.urls}/administrativeArea/addById/${id}`);
  }
  // 删除一个
  public deleteItem(id): Observable<any> {
    return this.http.get(`${this.globalService.urls}/administrativeArea/delete/${id}`);
  }
  // 删除多个
  public deleteList(params): Observable<any> {
    return this.http.post(`${this.globalService.urls}/administrativeArea/delete`, params);
  }
   // 修改接口
  public modifyItem(params): Observable<any> {
    return this.http.post(`${this.globalService.urls}/administrativeArea/upload`, params);
  }
  // 分页查询
  public searchList(num, body): Observable<any> {
    return this.http.post(
      `${this.globalService.urls}/administrativeArea/queryTreeByPaging/${num.page}/${num.nums}`, body);
  }
  // 单条查询
  public searchItem(id): Observable<any> {
    return this.http.get(`${this.globalService.urls}/administrativeArea/queryById/${id}`);
  }

  /**************************数据联动*****************************/
  // 查询接口行政区划
  public getAllList(): Observable<any> {
    return this.http.get(`${this.globalService.urls}/administrativeArea/queryAll`);
  }
}

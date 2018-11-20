import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {GlobalService} from './global.service';


@Injectable()
export class UserService {
  // public headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
  public headers = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(
    private http: HttpClient,
    private globalService: GlobalService
  ) { }
  // 增加
  public addItem(params): Observable<any> {
    return this.http.post(`${this.globalService.urls}/user/add`, params);
  }
  // 删除一个
  public deleteItem(id): Observable<any> {
    return this.http.get(`${this.globalService.urls}/user/delete/${id}`);
  }
  // 删除多个
  public deleteList(params): Observable<any> {
    return this.http.post(`${this.globalService.urls}/user/delete`, params);
  }
  // 分页查询
  public searchList(num): Observable<any> {
    return this.http.post(`${this.globalService.urls}/user/queryByPaging/${num.page}/${num.nums}`, {});
  }

  /*************************数据联动查询*******************************/
  // 查询激活区域
  public searchAreaList(num): Observable<any> {
    return this.http.post(
      `${this.globalService.urls}/administrativeArea/queryTreeByPaging/${num.page}/${num.nums}`, {});
  }
  // 查询所有公司
  public searchCompanyList(num): Observable<any> {
    return this.http.post(`${this.globalService.urls}/organization/queryByPaging/${num.page}/${num.nums}`, {});
  }
  // 根据公司id查询部门
  public searchCompanyIdDepList(id): Observable<any> {
    return this.http.get(`${this.globalService.urls}/department/queryTreeByOrganizationId/${id}`);
  }
  // 查询上级职务；根据公司或者部门id
  public searchCompanyIdDepIdDutyList(params): Observable<any> {
    if (params.depId) {
      return this.http.get(`${this.globalService.urls}/duty/queryByOrg/${params.companyId}/${params.depId}`);
    } else {
      return this.http.get(`${this.globalService.urls}/duty/queryByOrg/${params.companyId}`);
    }
  }
}

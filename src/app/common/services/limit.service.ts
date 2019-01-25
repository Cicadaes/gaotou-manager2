import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {GlobalService} from './global.service';

@Injectable()
export class LimitService {

  constructor(
    private http: HttpClient,
    private globalService: GlobalService
  ) { }
  /*****************************角色管理**************************/
  // 增加
  public addRoleItem(params): Observable<any> {
    return this.http.post(`${this.globalService.urlt}/role/add`, params);
  }
  // 删除单个
  public deleteRoleItem(id): Observable<any> {
    return this.http.get(`${this.globalService.urlt}/role/delete/${id}`);
  }
  // 删除多个
  public deleteRoleList(params): Observable<any> {
    return this.http.post(`${this.globalService.urlt}/role/delete`, params);
  }
  // 修改
  public modifyRoleItem(params): Observable<any> {
    return this.http.post(`${this.globalService.urlt}/role/update`, params);
  }
  // 查询
  public searchRoleList(num): Observable<any> {
    return this.http.post(`${this.globalService.urlt}/role/queryByPaging/${num.page}/${num.nums}`, {});
  }
  // 条件查询
  public searchRole(num,body): Observable<any> {
    return this.http.post(`${this.globalService.urlt}/role/queryByPaging/${num.page}/${num.nums}`, body);
  }

  public searchArea(num): Observable<any> {
    return this.http.post(
      `${this.globalService.urlt}/administrativeArea/queryTreeByPaging/${num.page}/${num.nums}`, {});
  }

  // 查询公司树
  public searchCompanyTree(): Observable<any> {
    return this.http.get(`${this.globalService.urlt}/organization/query2Tree`, {});
  }
  //查询部门树
  public searchDepartmentTree(params): Observable<any> {
    return this.http.get(`${this.globalService.urlt}/department/queryTreeByOrganizationId/${params}`);
  }
}

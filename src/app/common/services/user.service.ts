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
    return this.http.post(`${this.globalService.urlt}/user/add`, params);
  }
  // 删除一个
  public deleteItem(id): Observable<any> {
    return this.http.get(`${this.globalService.urlt}/user/delete/${id}`);
  }
  // 删除多个
  public deleteList(params): Observable<any> {
    return this.http.post(`${this.globalService.urlt}/user/delete`, params);
  }
  // 删除多个
  public modifyUser(params): Observable<any> {
    return this.http.post(`${this.globalService.urlt}/user/update`, params);
  }
  // 分页查询
  public searchList(num): Observable<any> {
    return this.http.post(`${this.globalService.urlt}/user/queryByPaging/${num.page}/${num.nums}`, {});
  }
  // 条件查询
  public searchUser(num,body): Observable<any> {
    return this.http.post(`${this.globalService.urlt}/user/queryByPaging/${num.page}/${num.nums}`, body);
  }

  /*************************数据联动查询*******************************/
  // 查询激活区域
  public searchAreaList(num): Observable<any> {
    return this.http.post(
      `${this.globalService.urlt}/administrativeArea/queryTreeByPaging/${num.page}/${num.nums}`, {});
  }
  // 查询所有公司
  public searchCompanyList(num): Observable<any> {
    return this.http.post(`${this.globalService.urlt}/organization/queryByPaging/${num.page}/${num.nums}`, {});
  }
  // 根据公司id查询部门
  public searchCompanyIdDepList(id): Observable<any> {
    return this.http.get(`${this.globalService.urlt}/department/queryTreeByOrganizationId/${id}`);
  }
  // 查询上级职务；根据公司或者部门id
  public searchCompanyIdDepIdDutyList(params): Observable<any> {
    if (params.deptId) {
      return this.http.get(`${this.globalService.urlt}/duty/queryByOrg/${params.companyId}/${params.deptId}`);
    } else {
      return this.http.get(`${this.globalService.urlt}/duty/queryByOrg/${params.companyId}`);
    }
  }

  // 查询区域树
  // 查询激活区域
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

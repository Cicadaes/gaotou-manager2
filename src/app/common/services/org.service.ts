import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {GlobalService} from './global.service';

@Injectable()
export class OrgService {
  // public headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
  public headers = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(
    private http: HttpClient,
    private globalService: GlobalService
  ) { }
  /*************************公司*******************************/
  // 公司增加
  public addCompanyItem(params): Observable<any> {
    return this.http.post(`${this.globalService.urls}/organization/add`, params);
  }
  // 公司删除单个
  public deleteCompanyItem(id): Observable<any> {
    return this.http.get(`${this.globalService.urls}/organization/delete/${id}`);
  }
  // 公司删除多个
  public deleteCompanyList(params): Observable<any> {
    return this.http.post(`${this.globalService.urls}/organization/delete`, params);
  }
  // 公司修改接口
  public modifyCompanyList(params): Observable<any> {
    return this.http.post(`${this.globalService.urls}/organization/update`, params);
  }
  /*************************部门*******************************/
  // 部门增加
  public addDepartItem(params): Observable<any> {
    return this.http.post(`${this.globalService.urls}/department/add`, params);
  }
  // 部门删除单个
  public deleteDepartItem(id): Observable<any> {
    return this.http.get(`${this.globalService.urls}/department/delete/${id}`);
  }
  // 部门删除多个
  public deleteDepartList(params): Observable<any> {
    return this.http.post(`${this.globalService.urls}/department/delete`, params);
  }
  // 部门修改接口
  public modifyDepartList(params): Observable<any> {
    return this.http.post('${this.globalService.urls}/organization/update', params);
  }
  // 部门查询
  public searchDepartList(num): Observable<any> {
    return this.http.post(`${this.globalService.urls}/department/queryByPaging/${num.page}/${num.nums}`, {});
  }

  /*************************职位*******************************/
  // 部门增加
  public addDutyItem(params): Observable<any> {
    return this.http.post(`${this.globalService.urls}/duty/add`, params);
  }
  // 部门删除单个
  public deleteDutyItem(id): Observable<any> {
    return this.http.get(`${this.globalService.urls}/duty/delete/${id}`);
  }
  // 部门删除多个
  public deleteDutyList(params): Observable<any> {
    return this.http.post(`${this.globalService.urls}/duty/delete`, params);
  }
  // 部门修改接口
  public modifyDutyList(params): Observable<any> {
    return this.http.post('${this.globalService.urls}/duty/update', params);
  }
  // 部门查询
  public searchDutyList(num): Observable<any> {
    return this.http.post(`${this.globalService.urls}/duty/queryByPaging/${num.page}/${num.nums}`, {});
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

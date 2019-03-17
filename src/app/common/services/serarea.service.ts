import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GlobalService} from './global.service';

@Injectable()
export class SerareaService {
  // public headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
  public headers = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(
    private http: HttpClient,
    private globalService: GlobalService
  ) { }
  /*****************************字段分类**************************/
  // 增加
  public addSaFieldTypeItem(params): Observable<any> {
    return this.http.post(`${this.globalService.urls}/serviceArea/attributeCategory/add`, params);
  }
  // 删除单个
  public deleteSaFieldTypeItem(id): Observable<any> {
    return this.http.get(`${this.globalService.urls}/serviceArea/attributeCategory/delete/${id}`);
  }
  // 删除多个
  public deleteSaFieldTypeList(params): Observable<any> {
    return this.http.post(`${this.globalService.urls}/serviceArea/attributeCategory/delete`, params);
  }
  // 修改
  public modifySaFieldTypeItem(params): Observable<any> {
    return this.http.post(`${this.globalService.urls}/serviceArea/attributeCategory/update`, params);
  }
  // 查询
  public searchSaFieldTypeList(num): Observable<any> {
    return this.http.post(`${this.globalService.urls}/serviceArea/attributeCategory/queryByPaging/${num.page}/${num.nums}`, {});
  }
  // 条件查询
  public searchSaFieldType(num,body): Observable<any> {
    return this.http.post(`${this.globalService.urls}/serviceArea/attributeCategory/queryByPaging/${num.page}/${num.nums}`, body);
  }

  /*****************************字段管理**************************/
  // 增加
  public addSaFieldItem(params): Observable<any> {
    return this.http.post(`${this.globalService.urls}/serviceArea/attribute/add`, params);
  }
  // 删除单个
  public deleteSaFieldItem(id): Observable<any> {
    return this.http.get(`${this.globalService.urls}/serviceArea/attribute/delete/${id}`);
  }
  // 删除多个
  public deleteSaFieldList(params): Observable<any> {
    return this.http.post(`${this.globalService.urls}/serviceArea/attribute/delete`, params);
  }
  // 修改
  public modifySaFieldItem(params): Observable<any> {
    return this.http.post(`${this.globalService.urls}/serviceArea/attribute/update`, params);
  }
  // 查询
  public searchSaFieldList(num): Observable<any> {
    return this.http.post(`${this.globalService.urls}/serviceArea/attribute/queryByPaging/${num.page}/${num.nums}`, {});
  }
  // 条件查询
  public searchSaField(num, body): Observable<any> {
    return this.http.post(`${this.globalService.urls}/serviceArea/attribute/queryByPaging/${num.page}/${num.nums}`, body);
  }

  /*****************************服务区**************************/
  // 增加
  public addSerAraItem(params): Observable<any> {
    return this.http.post(`${this.globalService.urls}/serviceArea/add`, params);
  }
  // 删除单个
  public deleteSerAraItem(id): Observable<any> {
    return this.http.get(`${this.globalService.urls}/serviceArea/delete/${id}`);
  }
  // 删除多个
  public deleteSerAraList(params): Observable<any> {
    console.log(params);
    return this.http.post(`${this.globalService.urls}/serviceArea/delete`, params);
  }
  // 修改
  public modifySerAraItem(item): Observable<any> {
    return this.http.post(`${this.globalService.urls}/serviceArea/update`, item);
  }
  // 单个id指定查询
  public searchSerAraListItem(params): Observable<any> {
    return this.http.get(`${this.globalService.urls}/serviceArea/queryById/${params.id}`);
  }
  // 查询
  public searchSerAraList(num): Observable<any> {
    return this.http.post(`${this.globalService.urls}/serviceArea/queryByPaging/${num.page}/${num.nums}`, {});
  }
  // 删除指定属性
  public delSerAraAttr(id): Observable<any> {
    return this.http.get(`${this.globalService.urls}/serviceArea/deleteAttributeValue/${id}`);
  }
  // 查询所有公共字段
  public searchSaCommonFieldList(id): Observable<any> {
    return this.http.get(`${this.globalService.urls}/serviceArea/queryCommonAttribute/${id}`);
  }
  // 查询所有有方向的字段
  public searchSaDircFieldList(areaId, oriId): Observable<any> {
    return this.http.get(`${this.globalService.urls}/serviceArea/queryOrientationAttribute/${areaId}/orientationId/${oriId}`);
  }
  // 条件查询
  public searchSerAra(num, body): Observable<any> {
    return this.http.post(`${this.globalService.urls}/serviceArea/queryByPaging/${num.page}/${num.nums}`, body);
  }

  /*************************数据联动查询*******************************/
  // 查询所有公司
  public searchCompanyList(num): Observable<any> {
    return this.http.post(`${this.globalService.urls}/organization/queryByPaging/${num.page}/${num.nums}`, {});
  }
  // 根据公司id查询部门
  public searchCompanyIdDepList(id): Observable<any> {
    return this.http.get(`${this.globalService.urls}/department/queryTreeByOrganizationId/${id}`);
  }
  // 查询激活区域
  public searchAreaList(num): Observable<any> {
    return this.http.post(
      `${this.globalService.urls}/administrativeArea/queryTreeByPaging/${num.page}/${num.nums}`, {});
  }
  // 查询所有人员树
  public searchUserList(num): Observable<any> {
    return this.http.post(`${this.globalService.urls}/user/queryByPaging/${num.page}/${num.nums}`, {});
  }
  // 查询服务区字段
  public searchtSerareaAttribute(): Observable<any> {
    return this.http.get(`${this.globalService.urls}/serviceArea/queryAllAttribute`);
  }

  // 查询公司树
  public searchCompanyTree(): Observable<any> {
    return this.http.get(`${this.globalService.urls}/organization/query2Tree`, {});
  }
  //查询部门树
  public searchDepartmentTree(params): Observable<any> {
    return this.http.get(`${this.globalService.urls}/department/queryTreeByOrganizationId/${params}`);
  }

}

import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GlobalService} from './global.service';
import {Observable} from 'rxjs';

@Injectable()
export class DictService {

  constructor(
    private http: HttpClient,
    private globalService: GlobalService
  ) { }
  /*****************************字典**************************/
  // 增加
  public addDictItem(params): Observable<any> {
    return this.http.post(`${this.globalService.urls}/dictionary/add`, params);
  }
  // 删除单个
  public deleteDictItem(id): Observable<any> {
    return this.http.get(`${this.globalService.urls}/dictionary/delete/${id}`);
  }
  // 删除多个
  public deleteDictList(params): Observable<any> {
    return this.http.post(`${this.globalService.urls}/dictionary/delete`, params);
  }
  // 修改
  public modifyDictItem(params): Observable<any> {
    return this.http.post(`${this.globalService.urls}/dictionary/update`, params);
  }
  // 查询
  public searchDictList(num): Observable<any> {
    return this.http.post(`${this.globalService.urls}/dictionary/queryByPaging/${num.page}/${num.nums}`, {});
  }

  /*****************************字典词条**************************/
  // 增加
  public addDictWordItem(params): Observable<any> {
    return this.http.post(`${this.globalService.urls}/dictionaryEntry/add`, params);
  }
  // 删除单个
  public deleteDictWordItem(id): Observable<any> {
    return this.http.get(`${this.globalService.urls}/dictionaryEntry/delete/${id}`);
  }
  // 删除多个
  public deleteDictWordList(params): Observable<any> {
    return this.http.post(`${this.globalService.urls}/dictionaryEntry/delete`, params);
  }
  // 修改
  public modifyDictWordItem(params): Observable<any> {
    return this.http.post(`${this.globalService.urls}/dictionaryEntry/update`, params);
  }
  // 查询
  public searchDictWordList(num): Observable<any> {
    return this.http.post(`${this.globalService.urls}/dictionaryEntry/queryByPaging/${num.page}/${num.nums}`, {});
  }
  // 指定查询
  public searchDictWordItem(item): Observable<any> {
    return this.http.post(`${this.globalService.urls}/dictionaryEntry/queryByPaging/${item}`, {});
  }
}

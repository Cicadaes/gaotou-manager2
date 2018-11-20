import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class SystemService {
// public headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
  public headers = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }
  // 增加接口
  public addList(): Observable<any> {
    return this.http.post('http://localhost/gaotouService/adds.php', '');
  }
  // 增加删除
  public deleteList(): Observable<any> {
    return this.http.post('http://localhost/gaotouService/deletes.php', '');
  }
  // 修改接口
  public modifyList(): Observable<any> {
    return this.http.post('http://localhost/gaotouService/modify.php', '');
  }
  // 查询接口
  public searchList(params): Observable<any> {
    console.log(params);
    return this.http.post('http://localhost/gaotouService/search.php', params, {headers: this.headers});
  }
}

import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {GlobalService} from '../services/global.service';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor (
    private localSessionStorage: GlobalService,
    public router: Router
  ) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (Number(this.localSessionStorage.get('logstatus')) === 10) {
      return true;
    }
    if (Number(this.localSessionStorage.get('logstatus')) === 14) {
      /*this.req.SidUpdate(JSON.stringify({sid: this.localSessionStorage.get('sid')}))
        .subscribe(value => {
          console.log('value=' + JSON.stringify(value));
          if (Number(value.status) === 10) {
            console.log('刷新成功!');
            return true;
          }
          if (Number(value.status) === 13) {
            alert('你的账号登录已经过期!');
            this.router.navigate(['/login']);
          }
        });
      return true;
    }*/
      return false;
    }
  }
}

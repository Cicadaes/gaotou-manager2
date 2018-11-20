import {Component, OnInit} from '@angular/core';
import {GlobalService} from './common/services/global.service';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public display: boolean;
  constructor(
    private globalService: GlobalService
  ) {
    console.log('当前产品状态是：' + environment.productState);
  }
  ngOnInit() {
    this.globalService.eventSubject.subscribe(
      (value) => {
        console.log(value);
        this.display = value.display;
      }
    );
  }
}

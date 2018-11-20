import { Component, OnInit} from '@angular/core';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public remindShow = true;
  public messageShow = true;
  constructor() {}
  ngOnInit() {
    let that = this;
    document.addEventListener('click', function (e) {
      if (e.srcElement.id !== 'remind' && e.srcElement.id !== 'message') {
        that.remindShow = true;
        that.messageShow = true;
      }
    });
  }

  public remindClick() {
    this.remindShow = !this.remindShow;
    this.messageShow = true;
  }
  public messageClick() {
    this.messageShow = !this.messageShow;
    this.remindShow = true;
  }

}


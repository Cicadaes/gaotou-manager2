import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {NavList, NavListChild} from '../../common/model/home-model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  public logoShow = false;
  public navLists: NavList[] = [
    new NavList('系统首页', 'main', 'fa fa-university', true, [] , true),
    new NavList('区域管理', 'area', 'fa fa-car', false, [
     /* new NavListChild('数据采集', false, 'department/organization-management'),
      new NavListChild('部门管理', false, 'department/organization')*/
    ] , true),
    new NavList('组织机构', '', 'fa fa-car', false, [
      new NavListChild('公司管理', false, 'org/company', 'fa fa-snowflake-o'),
      new NavListChild('部门管理', false, 'org/department', 'fa fa-snowflake-o'),
      new NavListChild('职位管理', false, 'org/duty', 'fa fa-snowflake-o'),
    ] , true),
    new NavList('用户管理', 'user', 'fa fa-bar-chart', false, [
      /*new NavListChild('生产线', false, 'device/proline'),
      new NavListChild('模块数据', false, 'device/prolicm'),
      new NavListChild('设备数据', false, 'device/proldata'),
      new NavListChild('传感器', false, 'device/prolsen'),*/
    ] , true),
    new NavList('权限管理', '', 'fa fa-outdent', false, [
      new NavListChild('角色管理', false, 'limit/role', 'fa fa-snowflake-o'),
     /* new NavListChild('菜单权限', false, 'limit/menu', 'fa fa-snowflake-o'),
      new NavListChild('按钮管理', false, 'limit/button', 'fa fa-snowflake-o'),*/
      new NavListChild('路由权限', false, 'limit/route', 'fa fa-snowflake-o'),
    ] , true),
    new NavList('服务区管理', '', 'fa fa-cog', false, [
      new NavListChild('服务区', false, 'serarea/sernum', 'fa fa-snowflake-o'),
      new NavListChild('服务区字段分类', false, 'serarea/types', 'fa fa-snowflake-o'),
      new NavListChild('服务区字段', false, 'serarea/fields', 'fa fa-snowflake-o'),
    ] , true),
    new NavList('门店管理', 'store', 'fa fa-address-card-o', false, [] , true),
    new NavList('卡口管理', 'intercept', 'fa fa-desktop', false, [] , true),
    new NavList('WIFI管理', 'wifi', 'fa fa-desktop', false, [] , true),
    new NavList('视频管理', 'videom', 'fa fa-desktop', false, [] , true),
    new NavList('视频组管理', 'videomg', 'fa fa-desktop', false, [] , true),
    new NavList('应用访问控制 ', 'apply', 'fa fa-desktop', false, [] , true),
    new NavList('收银机配置', 'cash', 'fa fa-cog', false, [] , true),
    new NavList('字典管理', '', 'fa fa-cog', false, [
      new NavListChild('字典', false, 'dict', 'fa fa-snowflake-o'),
      new NavListChild('字典词条', false, 'dict/word', 'fa fa-snowflake-o'),
    ] , true),
    new NavList('系统配置', 'system', 'fa fa-cog', false, [
      new NavListChild('事件类型', false, 'dict', 'fa fa-snowflake-o'),
    ] , true),
  ];
  public slidinghight: number;
  public slidingTop: number;
  public difulHeight: number;
  constructor(private router: Router) {}
  ngOnInit() {}
  public menuOnMousEnter(element): void {
    element.srcElement.style.left = '0';
    this.logoShow = true;
  }
  public onMouseleave(element): void {
    this.slidingTop = -120;
    element.srcElement.style.left = '-143px';
    this.logoShow = false;
  }
  public mainLiMouseEnter(element): void {
    this.slidingTop =  element.offsetTop;
    this.slidinghight = element.offsetHeight;
  }
  public mainLiClick(mainul, element, list): void {
    if (list.routers) {
      this.router.navigate(['/home/' + list.routers]);
    }
    this.difulHeight = 0;
    if (!(list.children.length > 0)) {
      // this.router.navigate(['/home']);
      for (let i = 0; i < mainul.children.length; i++) {
        mainul.children[i].children[1].style.height = '0px';
      }
      this.navLists.forEach((item) => {
        item.open = true;
        item.clsstate = false;
        item.children.forEach((itemchild) => {
          itemchild.setState = false;
        });
      });
      list.clsstate = true;
      return;
    }
    if (element.offsetHeight === 0) {
      this.navLists.forEach((item) => {
        item.open = true;
      });
      list.open = false;
      for (let i = 0; i < mainul.children.length; i++) {
        mainul.children[i].children[1].style.height = '0px';
      }
      for (let i = 0; i < list.children.length; i++) {
        this.difulHeight = this.difulHeight + 40;
      }
      element.style.height = this.difulHeight.toString() + 'px';
    }
    else {
      list.open = true;
      this.difulHeight = 0;
      element.style.height = this.difulHeight.toString() + 'px';
      setTimeout(() => {
        list.open = true;
      }, 200);
    }
  }
  public menuliMouseEnter(element): void {
    this.slidingTop =  element.offsetTop;
    this.slidinghight = element.offsetHeight;
    element.setState = true;
  }
  public menuliClick(element): void {
    this.navLists.forEach((item) => {
      item.clsstate = false;
      item.children.forEach((itemchild) => {
        itemchild.setState = false;
      });
    });
    element.setState = true;
  }
}

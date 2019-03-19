import {AddCity, AddProvince, AddSaOrientation, AddServiceArea} from './shared-model';
import {e} from '@angular/core/src/render3';

export class Intercept {
  administrativeAreaId?: number; // 区划
  bayonetCode?: string; // 卡口编码
  bayonetType?: number; // 卡口类型
  orientationFlag?: string; // 卡口方向(出口/进口)
  saOrientationId?: number; // 服务区方向
  serviceAreaId?: number; // 服务区
  bayonetName?: string; // 卡口名称
  udt?: string;
  id?: string;
  idt?: string;
  serviceAreaName?: string;
  administrativeAreaName?:string;
}

export class AddIntercept {
  // 区划
  // province: AddProvince = new AddProvince();
  // city: AddCity = new AddCity();
  // // 服务区, 上下行
  // serviceArea: AddServiceArea = new AddServiceArea();
  // saOrientation: AddSaOrientation = new AddSaOrientation();
  administrativeAreaId?: number;
  administrativeAreaName?: string;
  serviceAreaId?: number;
  serviceAreaName?: string;
  saOrientationId?: number;
  bayonetCode?: string; // 卡口编号
  bayonetName?: string; // 卡口名称
  bayonetType?: number; // 卡口类型
}

export class ModifyIntercept {
  administrativeAreaId?: number; //区划id
  administrativeAreaName?: string; //区划名称
  serviceAreaId?: number; //服务区id
  serviceAreaName?: string; //服务区名称
  saOrientationId?: number;  // 上下行id
  bayonetCode?: string; // 卡口编号
  bayonetName?: string; // 卡口名称
  bayonetType?: number; // 卡口类型
  id?: string;
  idt?: string;
}

//条件查询
export class QueryIntercept {
  serviceAreaId?: number;
  orientationDO?: number;
  bayonetCode?: number;
  bayonetType?: number;
  serviceAreaName?: string;
}

import {AddCity, AddProvince, AddSaOrientation, AddServiceArea} from './shared-model';

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
}
export class AddIntercept {
  // 区划
  province: AddProvince = new AddProvince();
  city: AddCity = new AddCity();
  // 服务区, 上下行
  serviceArea: AddServiceArea = new AddServiceArea();
  saOrientation: AddSaOrientation = new AddSaOrientation();
  bayonetCode?: string; // 卡口编号
  bayonetName?: string; // 卡口名称
  bayonetType?: string; // 卡口类型
}

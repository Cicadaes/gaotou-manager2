import {AddCity, AddProvince, AddSaOrientation, AddServiceArea} from './shared-model';

export class Wifi {
  administrativeAreaId?: number; // 区划id
  administrativeAreaName?: string; // 区划名称
  deviceCode?: string; // 设备编号
  devicePosition?: string; // 设备位置
  devicePositionCode?: string; // 位置编号
  orientationFlag?: string; // 上下行方向
  saOrientationId?: number; // 上下行ID
  serviceAreaId?: number; // 服务区ID
  serviceAreaName?: string; // 服务区名称
  udt?: string;
  id?: number;
  idt?: string;
}
export class AddWifi {
  // 区划
  province: AddProvince = new AddProvince();
  city: AddCity = new AddCity();
  // 服务区, 上下行
  serviceArea: AddServiceArea = new AddServiceArea();
  saOrientation: AddSaOrientation = new AddSaOrientation();
  deviceCode?: string; // 设备编号
  devicePosition?: string; // 设备位置
  devicePositionCode?: string; // 位置编号
}

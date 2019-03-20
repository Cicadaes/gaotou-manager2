export class Store {
  id: 1;
  idt: null;
  udt: null;
  buildAera: null; // 建组面积
  cashierType: null; // 收银分类
  categoryCode: string; // 店铺分类
  contractExpirationDate: null; // 合同到期日期
  contractStartDate: null; // 合同开始日期
  electricityAccount: null; // 电费账号
  enabled: true; // 数据状态
  industryCode: null; // 行业编码
  industryName: null; // 行业名称
  operateStatus: null; // 经营状态
  principal: null; // 负责人姓名
  principalMobile: string; // 负责人电话
  saOrientationId: number; // 服务区方向
  serviceAreaId: number; // 服务区id
  serviceAreaName: '久长服务区'; // 服务区名称
  statusChangeDate: null; // 经营状态改变日期
  storeCode: string; // 店铺编码
  storeName: string; // 店铺名称
  usableArea: null; // 实用面积
  waterAccount: null; // 水费账号
  administrativeAreaId?: number; // 区划id
  administrativeAreaName?: string; // 区划名称
  orientationDO?: orientationDo
}
export class AddStore {
  administrativeAreaId?: number; // 区划id
  administrativeAreaName?: string; // 区划名称
  saOrientationId?: number; // 服务区方向
  serviceAreaId?: number; // 服务区id
  serviceAreaName?: string; // 服务区名称
  categoryCode?: string; // 店铺分类
  operateStatus?: string; // 经营状态
  statusChangeDate?: any; // 经营状态改变日期
  cashierType?: any; // 收银分类
  contractExpirationDate?: any; // 合同到期日期
  contractStartDate?: any; // 合同开始日期
  storeCode?: string; // 店铺编码
  storeName?: string; // 店铺名称
  electricityAccount?: string; // 电费账号
  waterAccount?: string; // 水费账号
  buildAera?: any; // 建组面积
  usableArea?: any; // 实用面积
  industryCode?: string; // 行业编码
  industryName?: string; // 行业名称
  principal?: string; // 负责人姓名
  principalMobile?: string; // 负责人电话
}
export class ModifyStore {
  administrativeAreaId?: number; // 区划id
  administrativeAreaName?: string; // 区划名称
  saOrientationId?: number; // 服务区方向
  serviceAreaId?: number; // 服务区id
  serviceAreaName?: string; // 服务区名称
  categoryCode?: string; // 店铺分类
  operateStatus?: any; // 经营状态
  statusChangeDate?: any; // 经营状态改变日期
  cashierType?: any; // 收银分类
  contractExpirationDate?: any; // 合同到期日期
  contractStartDate?: any; // 合同开始日期
  storeCode?: string; // 店铺编码
  storeName?: string; // 店铺名称
  electricityAccount?: string; // 电费账号
  waterAccount?: string; // 水费账号
  buildAera?: string; // 建组面积
  usableArea?: string; // 实用面积
  industryCode?: string; // 行业编码
  industryName?: string; // 行业名称
  principal?: string; // 负责人姓名
  principalMobile?: string; // 负责人电话
  enabled: true; // 数据状态
  // openDate?: any;
  id?: number;
  // idt?: any;
}

export class QueryStroe {
  serviceAreaId?: number; //服务区id
  orientationDO?: number; //方向id
  categoryCode?: string; //店铺分类
  storeName?: string; //商店名
  principal?: string; //负责人
}

export class orientationDo {
  id?: number;
  flag?: number;
  flagName?: string;
  destination?: string;
  source?: string;

}

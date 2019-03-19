// table数据泛型
export class Cash {
  administrativeAreaId?: number;
  cashRegisterCode?: string;
  serviceAreaName?: string;
  enabled?: boolean;
  idt?: string;
  administrativeAreaName?: string;
  saOrientationId?: number;
  serviceAreaId?: number;
  storeId?: number;
  udt?: any;
  id?: number;
  orientationFlag: number;
  storeName?: string;
  level?: string;
  orientationDO?: orientationDO = new orientationDO();
}

//
export  class   orientationDO{
  id?: number;
}
// 添加泛型
export class AddCashProvince {
  administrativeAreaId?: number;
  administrativeAreaName?: string;
  level?: string;
}

export class AddCashCity {
  administrativeAreaId?: number;
  administrativeAreaName?: string;
  level?: string;
}

export class AddCashServiceArea {
  serviceAreaId?: number;
  serviceName?: string;
}

export class AddCashSaOrientation {
  destination?: string;
  flag?: string;
  flagName?: string;
  serviceAreaId?: number;
  source?: string;
  id?: any;
}

export class AddCashStore {
  categoryCode?: string;
  storeId?: number;
  storeName?: string;
}

export class AddCash {
  // 区划
  // province: AddCashProvince = new AddCashProvince();
  // city: AddCashCity = new AddCashCity();
  // // 服务区
  // serviceArea: AddCashServiceArea = new AddCashServiceArea();
  // // 上下行
  // saOrientation: AddCashSaOrientation = new AddCashSaOrientation();
  // // 店铺
  // store: AddCashStore = new AddCashStore();
  administrativeAreaId?: number;
  administrativeAreaName?: string;
  serviceAreaId?: number;
  serviceAreaName?: number;
  saOrientationId?: number;
  orientationFlag?: number;
  storeId?: number;
  storeName?: number;
  cashRegisterCode?: string; // 收银机编号
  idt?: string; // 创建时间
  udt?: any; // 修改时间
}

export class ModifyCash {

  administrativeAreaId?: number;
  administrativeAreaName?: string;
  serviceAreaId?: number;
  serviceAreaName?: string;
  saOrientationId?: number;
  orientationFlag?: number;
  storeId?: number;
  storeName?: string;
  cashRegisterCode: string; // 收银机编号
  idt?: string; // 创建时间
  id?: number;
}

//条件查询
export class QueryCash {
  serviceAreaId?: number;
  orientationDO?: number;
  storeId?: number;
  storeName?: string;
}


// 上下行方向泛型
export class HighSpeedDirection {
  label?: string;
  value?: number;
}

// 下拉菜单泛型
/*export class SelectItem {
  id?: number;
  name?: string;
  code: any;
  styleClass?: string;
  icon?: string;
  title?: string;
  disabled?: boolean;
  administrativeAreaId?: number;
  destination?: string;
  flag?: string;
  flagName?: string;
  orientaionId?: number;
  source?: string;
  categoryCode?: string;
}*/

// 区域树泛型
export class TreeNode {
  id?: number;
  label?: string;
  areaCode?: string;
  level?: number;
  enabled?: boolean;
  parentId?: number;
  children?: TreeNode[];
  cityType?: string;
  pids?: string;
  administrativeAreaId?: number;
  status?: boolean;
  parent?: TreeNode;
  icon?: any;
  expandedIcon?: any;
  collapsedIcon?: any;
  styleClass?: string;
  draggable?: boolean;
  droppable?: boolean;
}

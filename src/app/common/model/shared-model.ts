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
export class AddTreeArea {
  id?: number;
  label?: string;
  areaCode?: string;
  level?: string;
  enabled?: boolean;
  parentId?: number;
  children?: AddTreeArea[];
  cityType?: string;
  pids?: string;
  status?: boolean;
  parent?: AddTreeArea;
  icon?: any;
  expandedIcon?: any;
  collapsedIcon?: any;
  styleClass?: string;
  draggable?: boolean;
  droppable?: boolean;
}
export class SelectItem {
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
  pid?: number;
  pids?: number;
}

// 添加泛型
// 省
export class AddProvince {
  administrativeAreaId?: number;
  administrativeAreaName?: string;
  level?: string;
}
// 市
export class AddCity {
  administrativeAreaId?: number;
  administrativeAreaName?: string;
  level?: string;
}
// 服务区
export class AddServiceArea {
  serviceAreaId?: number;
  serviceName?: string;
}
// 上下行
export class AddSaOrientation {
  destination?: string;
  flag?: string;
  flagName?: string;
  orientaionId?: number;
  source?: string;
}


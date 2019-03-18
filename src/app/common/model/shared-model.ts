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
  serviceAreaId?: any;
  label?: number;
  value?: any;
  id?: any;
  attributeDesc?: string;
  attributeId?: any;
  attributeName?: string;
  show?: any;
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
export class CompanyTree {
  id?: number;
  areaName?: string;
  areaCode?: string;
  postcode?: string;
  regNo?: string;
  latitude?: string;
  longitude?: string;
  legalPerson?: string;
  address?: string;
  label?: string;
  foundDate?: any;
  fax?: string;
  telNumber?: string;
  email?: string;
  scale?: string;
  category?: string;
  introduction?: string;
  list?: any;
  pid?: string;
}

// 条件查询
export class QueryVideo{
  serviceAreaId?: number;
  orientationDO?: number;
  groupId?: number;
}

// 区域树泛型
export class CompanyTreeNode {
  id?: number;
  areaName?: string;
  areaCode?: string;
  postcode?: string;
  regNo?: string;
  label?:string;
  latitude?: string;
  longitude?: string;
  legalPerson?: string;
  address?: string;
  foundDate?: any;
  fax?: string;
  telNumber?: string;
  email?: string;
  scale?: string;
  category?: string;
  introduction?: string;
  list?: any;
  pid?: string;
  children?: CompanyTreeNode[];

}


export class DepartmentTree {
  id?: number;
  label?: string;
  organizationName?: string;
  organizationId?: string;
  pDeptName?: string;
  deptCode?: string;
  deptCategory?: string;
  description?: string;
  pid?: number;
  pids?: string;
  fax?: string;
  telNumber?: string;
  list?: any;
}
export class DepartmentTreeNode {
  id?: number;
  deptName?: string;
  organizationName?: string;
  organizationId?: string;
  pDeptName?: string;
  deptCode?: string;
  deptCategory?: string;
  description?: string;
  pid?: number;
  pids?: string;
  label?: string;
  fax?: string;
  telNumber?: string;
  list?: any;
  children?: DepartmentTreeNode[];
}

export class DutyTree {
  id?: number;
  areaName?: string;
  areaCode?: string;
  postcode?: string;
  dutyName?: string;
  deptId?: any;
  regNo?: string;
  label?:string;
  latitude?: string;
  longitude?: string;
  legalPerson?: string;
  address?: string;
  foundDate?: any;
  fax?: string;
  telNumber?: string;
  email?: string;
  scale?: string;
  category?: string;
  introduction?: string;
  list?: any;
  pid?: number;
  children?: CompanyTreeNode[];
}
export class DutyTreeNode {
  id?: number;
  areaName?: string;
  areaCode?: string;
  postcode?: string;
  regNo?: string;
  label?:string;
  latitude?: string;
  longitude?: string;
  legalPerson?: string;
  address?: string;
  foundDate?: any;
  fax?: string;
  telNumber?: string;
  email?: string;
  scale?: string;
  category?: string;
  introduction?: string;
  list?: any;
  pid?: string;
  children?: CompanyTreeNode[];
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
  serviceAreaName?: string;
}
// 上下行
export class AddSaOrientation {
  destination?: string;
  flag?: string;
  flagName?: string;
  orientaionId?: number;
  source?: string;
}


// 公司table数据泛型
export class Company {
  address?: string;
  areaCode?: string;
  areaName?: string;
  category?: string;
  email?: string;
  fax?: string;
  foundDate?: number;
  id?: number;
  idt?: string;
  introduction?: string;
  latitude?: string;
  legalPerson?: string;
  longitude?: string;
  name?: string;
  pid?: number;
  pids?: string;
  postcode?: string;
  regNo?: string;
  scale?: string;
  telNumber?: string;
  udt?: any;
}

export class AddCompany {
  areaCode?: string; // 行政区划编码
  areaName?: string; // 行政区划名称
  postcode?: string; // 邮编
  regNo?: string; // 工商注册号
  latitude?: string; // 维度
  longitude?: string; // 经度
  legalPerson?: string; // 法人
  address?: string; // 公司地址
  name?: string; // 公司名称
  foundDate?: any; // 成立日期
  fax?: string; // 传真
  telNumber?: string; // 单位电话
  email?: string; // 邮箱
  scale?: string; // 公司规模
  category?: string; // 公司类型
  introduction?: string; // 公司简介
  pid?: number; // 上级节点ID
  pids?: string; // 节点路径
}

// 修 改
export class modifydCompany {
  id?: number;//数据id
  areaCode?: string; // 行政区划编码
  areaName?: string; // 行政区划名称
  postcode?: string; // 邮编
  regNo?: string; // 工商注册号
  latitude?: string; // 维度
  longitude?: string; // 经度
  legalPerson?: string; // 法人
  address?: string; // 公司地址
  name?: string; // 公司名称
  foundDate?: any; // 成立日期
  fax?: string; // 传真
  telNumber?: string; // 单位电话
  email?: string; // 邮箱
  scale?: string; // 公司规模
  category?: string; // 公司类型
  introduction?: string; // 公司简介
  pid?: number; // 上级节点ID
  pids?: string; // 节点路径
  idt?: string; // 节点路径
}



// 条件查询
export class queryCompany {
  name?: string;
  regNo?: string;
  pid?: number;
  areaName?: string;
}


// 部门table数据泛型
export class Department {
  deptCategory?: number;
  organizationName?: string; // 所属公司
  deptCode?: string; // 部门编号
  deptName?: string; // 部门名称
  description?: string;
  endFlag?: number;
  fax?: string; // 部门传真
  id?: number;
  idt?: string; // 创建时间
  organizationId?: number;
  pid?: number;
  pids?: string;
  telNumber?: string; // 部门电话
  udt?: any;
  pDeptName: string; //上级部门
}

export class AddDepartment {
  organizationName?: string; // 所属公司
  organizationId?: number; // 所属公司得id
  pid?: number; // 上级部门
  pids?: string; // 上级部门
  deptCode?: string; // 部门编号
  deptName?: string; // 部门名称
  deptCategory?: any; // 是不是服务区
  fax?: string; // 部门传真
  telNumber?: string; // 部门电话
  description?: string;
  pDeptName: string; //上级部门
}

export class ModifyDepartment {
  deptCategory?: number;
  organizationName?: string; // 所属公司
  deptCode?: string; // 部门编号
  deptName?: string; // 部门名称
  description?: string;
  endFlag?: number;
  fax?: string; // 部门传真
  id?: number;
  idt?: string; // 创建时间
  organizationId?: number;
  pid?: number;
  telNumber?: string; // 部门电话
  pDeptName: string; //上级部门
}
// 条件查询
export class queryDepartment {
  deptName?: string;
  deptCode?: string;
  organizationId?: number;
  deptCategory?: number;
  pid?: string; // 上级部门
}
// 职位类型
export class DepartmentType {
  label?:string;
  value?:number;

}
// 职位数据泛型
export class Duty {
  boss?: any; // 一把手
  deptId?: number; // 部门id
  deptName?: string; // 部门名称
  description?: string; // 描述
  dutyName?: string; // 职务名称
  level?: number; // 等级
  enabled?: any; // 是否启用
  leaf?: any; // 分支
  organizationId?: number; // 公司id
  organizationName?: string; // 公司名称
  pid?: number; // 上级职位id
  pids?: string; // 父id链
  pos?: number; // 职位顺序
  quantity?: number; // 数量
  udt?: string;
  id?: number;
  idt?: string;
}

export class AddDuty {
  organizationId?: number; // 公司id
  organizationName?: string; // 公司名称
  deptId?: number; // 部门id
  deptName?: string; // 部门名称
  pid?: number; // 上级职位id
  dutyName?: string; // 职务名称
  pos?: number; // 职位顺序
  quantity?: number; // 数量
  boss?: any; // 一把手
  description?: string; // 描述
}

export class ModifyDuty {
  id?: number; // 描述
  pid?: number; // 上级职位id
  deptId?: number; // 部门id
  dutyName?: string; // 职务名称
  level?: number;//等级
  quantity?: number; // 数量
  pos?: number; // 职位顺序
  boss?: any; // 一把手
  description?: string; // 描述
  leaf?: string;//是否分支
  organizationName?: string; // 公司名称
  deptName?: string; // 部门名称
  organizationId?: number; // 公司id
  // pDutyName?: number; // 公司id
}

export class QueryDuty {
  organizationId?: number;
  deptId?: number;
  pid?: string;
  dutyName?: string;
}


// table数据泛型
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

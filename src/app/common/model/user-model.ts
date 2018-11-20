export class User {
  id?: 1; // 用户id
  organizationId?: any; // 公司ID
  organizationName?: string; // 公司名称
  deptId?: number; // 部门id
  deptName?: string; // 部门名称
  dutyId?: number; // 职务ID
  dutyName?: string; // 职务名称
  realName?: string; // 真实姓名
  userName?: string; // 用户名
  telNumber?: string; // 电话号码
  email?: string; // 邮箱
  address?: string; // 用户住址
  gender?: any; // 用户性别
  enabled?: boolean; // 用户状态
  locked?: boolean;  // 是否锁定
  birthday?: string; // 用户生日
  remark?: string; // 备注
  idt?: string; // 创建时间
  udt?: null; // 更新时间
  title?: any;
}
export class AddUser {
  organizationId?: any; // 公司ID
  organizationName?: string; // 公司名称
  deptId?: number; // 部门id
  deptName?: string; // 部门名称
  dutyId?: number; // 职务ID
  dutyName?: string; // 职务名称

  realName?: string; // 真实姓名
  userName?: string; // 用户名
  telNumber?: string; // 电话号码
  email?: string; // 邮箱
  address?: string; // 用户住址
  gender?: any; // 用户性别
  enabled?: boolean; // 用户状态
  birthday?: string; // 用户生日
  remark?: string; // 备注
}

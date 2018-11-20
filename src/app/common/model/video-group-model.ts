export class VideoGroup {
  enabled?: boolean; // 是否可用
  groupCode?: string; // 视频设备分组编号
  groupName?: string; // 分组名称
  id?: number;
  idt?: string; // 创建时间
  saOrientationId?: number; // 方向id
  serviceAreaId?: number; // 服务区ID
  udt?: string; // 更新时间
}
export class AddVideoGroup {
  serviceAreaId?: number; // 服务区ID
  saOrientationId?: number; // 方向id
  groupCode?: string; // 视频设备分组编号
  groupName?: string; // 分组名称
  // enabled?: any; // 是否可用
}

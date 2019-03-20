export class VideoGroup {
  administrativeAreaId?: number; // 区划id
  administrativeAreaName?: string; // 区划名称
  enabled?: boolean; // 是否可用
  groupCode?: string; // 视频设备分组编号
  groupName?: string; // 分组名称
  id?: number;
  idt?: string; // 创建时间
  saOrientationId?: number; // 方向id
  serviceAreaId?: number; // 服务区ID
  serviceAreaName?: number; // 服务区ID
  udt?: string; // 更新时间
  orientationDO?: orientationDO; // 更新时间
}
export class AddVideoGroup {
  administrativeAreaId?: number; // 区划id
  administrativeAreaName?: string; // 区划名称
  serviceAreaId?: number; // 服务区ID
  saOrientationId?: number; // 方向id
  groupCode?: string; // 视频设备分组编号
  groupName?: string; // 分组名称
  // enabled?: any; // 是否可用
}
export class ModifyVideoGroup {
  administrativeAreaId?: number; // 区划id
  administrativeAreaName?: string; // 区划名称
  serviceAreaId?: number; // 服务区ID
  saOrientationId?: number; // 方向id
  groupCode?: string; // 视频设备分组编号
  groupName?: string; // 分组名称
  // enabled?: any; // 是否可用
  id?: number;
  idt?: string; // 创建时间
  enabled?: boolean; // 是否可用
}


//条件查询
export class QueryVideoGroup {
  serviceAreaId?: number;
  orientationDO?: number;
}

export  class orientationDO {
  destination?:string;
  source?:string;
  id?:number;
  flagName?:string;
}

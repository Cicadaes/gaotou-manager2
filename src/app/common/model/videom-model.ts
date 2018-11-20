export class Video {
  cameraName: string; // 摄像头名称
  cameraNumber: string; // 摄像头编号
  enabled: any; // 摄像头是否可用
  groupId: number; // 分组id
  id: number;
  idt: string; // 创建时间
  inStore: any; //  是否再店铺内
  innerUrl: string; // 内网地址
  outUrl: string; // 外网地址
  add: number; // 服务区方向
  serviceAreaId: number; // 服务区id
  showLocation: number; // 页面监视窗口位置
  storeId: number; // 店铺id
  udt: string; // 修改时间
  videoUrl: string; // 视频源地址
}
export class AddVideo {
  saOrientationId: number; // 服务区方向2
  serviceAreaId: number; // 服务区id 1
  storeId: number; // 店铺id 10
  groupId: number; // 分组id 3
  cameraName: string; // 摄像头名称 4
  cameraNumber: string; // 摄像头编号 5
  inStore: any; //  是否再店铺内 11
  innerUrl: string; // 内网地址 9
  outUrl: string; // 外网地址 8
  showLocation: number; // 页面监视窗口位置 6
  videoUrl: string; // 视频源地址 7
  // enabled: any; // 摄像头是否可用
}

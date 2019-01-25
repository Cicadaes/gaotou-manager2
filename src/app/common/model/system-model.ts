export class System {
  vin;
  year;
  brand;
  color;
}

// 事件类型
export class EventType {
  categoryCode: string; // 分类编码
  enabled: any; // 是否启用
  eventCategoryName: string; // 事件分类名称
  id: number; // 唯一id
  idt: string; // 创建时间
  udt: string; // 更新时间
}

export class AddEventType {
  categoryCode: string; // 分类编码
  // enabled: any; // 是否启用
  eventCategoryName: string; // 事件分类名称
  // id: number; // 唯一id
  // idt: string; // 创建时间
  // udt: string; // 更新时间
}

export class ModifyEventType {
  categoryCode: string; // 分类编码
  // enabled: any; // 是否启用
  eventCategoryName: string; // 事件分类名称
  id: number; // 唯一id
  idt: string; // 创建时间
  // udt: string; // 更新时间
}

export class QueryEventType {
  eventCategoryName?: string;
  categoryCode ?: number;
}

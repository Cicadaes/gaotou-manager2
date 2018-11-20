/*******************字段分类泛型**************************/
export class FieldType {
  categoryName?: string; // 分类名称
  sequence?: number; // 序列
  enabled?: any;
  id?: number;
  idt?: string;
  udt?: string;
}
export class AddFieldType {
  categoryName?: string; // 分类名称
  sequence?: number; // 序列
}

/*******************字段泛型**************************/
export class Field {
  attributeCategoryId?: number; // 属性分类id
  attributeDesc?: string; // 字段描述
  attributeName?: string; // 字段名称
  enabled?: any;
  foreignKey?: any;
  position?: number; // 字段顺序
  relatedTable?: any;
  related_column?: any;
  saOrientationFlag?: any; // 单选框(1公共2上行3下行)
  showTableHead?: any; // 是否显示在页面表单
  udt?: string;
  id?: number;
  idt?: string;
}
export class AddField {
  attributeCategoryId?: number; // 属性分类
  hasOrientation?: any; // 单选框(1公共2上行3下行)
  attributeName?: string; // 字段名称
  attributeDesc?: string; // 字段描述
  position?: number; // 字段顺序
  showTableHead?: any; // 是否显示在页面表单
}

/*******************服务区泛型**************************/
export class Serarea {
  organizationId?: number; // 机构ID
  administrativeAreaId?: number; // 区划id
  attributeValueList?: Coordinate[]; // 经纬度
  chiefUserId?: number; // 区长用户id
  createUserId?: number; // 创建用户id
  createUserName?: string; // 创建的用户名
  name?: string; // 服务区名
  status?: any; // 服务区状态
  deptId?: number; // 部门ID
  updateUserId?: number; // 修改的用户ID
  updateUserName?: string; // 修改的用户名
  id?: number; // 服务区id
  idt?: string;
  udt?: string;

}
// 经纬度
export class Coordinate {
  attributeCategoryId?: number;
  attributeDesc?: string;
  attributeName?: string;
  attributeValue?: string;
  foreignKey?: any;
  id?: number;
  position?: string;
  relatedTable?: any;
  related_column?: any;
  saAttributeId?: number;
  saOrientationFlag?: any;
  serviceAreaId?: number;
  showTableHead?: any;
}

/*******************添加服务区泛型**************************/
export class AddSerarea {
  organizationId: number; // 1 公司ID
  organizationName: string; // 1 公司名
  deptId: number; // 1 部门ID
  deptName: string; // 1 部门名
  administrativeAreaId: number; // 1 区划id
  administrativeAreaName: string; // 1 区划名
  chiefUserId: number; // 1 区长用户id
  chiefName: string; // 1 区长名
  chiefPhone: string; // 1 区长电话
  serviceAreaName: string; // 2 服务区名
  commonAttributeValues: any[]; // 公共属性：经纬度及面积
  upAttributeValues: AddUpDownAttribute = new AddUpDownAttribute(); // 上行;
  downAttributeValues: AddUpDownAttribute = new AddUpDownAttribute(); // 下行
}
// 上下行属性
export class AddUpDownAttribute {
  source: string; // 起始点
  destination: string; // 终点
  flag: string; // 上下行标识
  flagName: string; // 上下行
  attributeValues: Array<AddCommonAttribute>;
}
// 循环属性
export class AddCommonAttribute {
  // attributeId: number;
  attributeName: string;
  value: number;
}

/*export class AddCarAttribute {
  attributeName: string; // 停车位类型，大车还是小车
  value: number;
}*/

/*export class AddSerarea {
  'organizationId': 1; // 1 公司ID
  'organizationName': '贵州高投服务管理有限公司'; // 1 公司名
  'deptId': 5; // 1 部门ID
  'deptName': null; // 1 部门名
  'administrativeAreaId': 3; // 1 区划id
  'administrativeAreaName': '贵阳市'; // 1 区划名
  'chiefUserId': 1; // 1 区长用户
  'chiefName': null; // 1 区长名
  'chiefPhone': null; // 1 区长电话
  'serviceAreaName': '没有服务区'; // 2 服务区名
  'commonAttributeValues': [ // 公共属性
    {
      'attributeId': 15,
      'attributeName': 'longitude', // 经度
      'value': '106.705393'
    },
    {
      'attributeId': 16,
      'attributeName': 'latitude', // 维度
      'value': '26.901464'
    },
    {
      'attributeId': 2,
      'attributeName': 'square_meter', // 服务区面积
      'value': '5000'
    }
    ];
  'upAttributeValues': { // 上行
    'source': '遵义',
    'destination': '贵阳',
    'flag': '2',
    'flagName': '上行',
    'attributeValues': [
      {
        'attributeId': 12,
        'attributeName': 'little_parking_space', // 小车停车位
        'value': '20'
      },
      {
        'attributeId': 14,
        'attributeName': 'bus_parking_space', // 客车停车位
        'value': '20'
      }
      ]
  };
  'downAttributeValues': {// 下行
    'source': '贵阳',
    'destination': '遵义',
    'flag': '3',
    'flagName': '下行',
    'attributeValues': [
      {
        'attributeId': 12,
        'attributeName': 'little_parking_space', // 小车停车位
        'value': '20'
      },
      {
        'attributeId': 14,
        'attributeName': 'bus_parking_space', // 客车停车位
        'value': '20'
      }
      ]
  };
}*/



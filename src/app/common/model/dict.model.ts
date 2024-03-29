// 字典泛型
export class DictList {
  dictionaryCode?: string; // 字典编码
  dictionaryName?: string; // 字典名称
  enabled?: any;
  id?: null;
  idt?: string;
  udt?: string;
}

export class AddDictList {
  dictionaryCode?: string;
  dictionaryName?: string;
}
export class ModifyDictList {
  dictionaryCode?: string;
  dictionaryName?: string;
  enabled?: any;
  id?: null;
  idt?: string;
}

//条件查询
export class QueryDict {
  dictionaryName?: string;
  dictionaryCode?: string;
}

// 字典词条
export class DictWord {
  dictionaryCode?: string; // 字典编码
  enabled?: boolean;
  entryCode?: string; // 词条编码
  entryValue?: string; // 词条值
  id?: number;
  idt?: string;
  sequence?: number; // 序列
  udt?: string;
}

export class AddDictWord {
  dictionaryCode?: string; // 字典编码
  entryCode?: string; // 词条编码
  entryValue?: string; // 词条值
  sequence?: number; // 序列
}
export class ModifyDictWord {
  dictionaryCode?: string; // 字典编码
  entryCode?: string; // 词条编码
  entryValue?: string; // 词条值
  sequence?: number; // 序列
  id?: number;
  idt?: string;
  enabled?: boolean;
}

//条件查询
export class QueryDictWord {
  dictionaryCode?: string;
  entryValue?: string;
  entryCode?: string;
}

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

import { Debug, ValueType, GUID, DataType } from 'core/object/utils';
import { Table } from "core/object/table";
import { KeySlot, BoxSlot, Slot } from "core/object/slot";
/** 游戏对象 */
export class Card extends DataType {
  //============================================================
  // 序列化
  //============================================================
  /** 从数据重建对象 */
  static fromData(data: any): Card {
    const constructor = DataType.getType(data.type);
    if (!constructor) {
      throw new Error(`Unknown table type: ${data.type}`);
    }
    const instance = new (constructor as any)();
    Object.assign(instance, data);
    if (data.tables) {
      instance.tables = new Map(
        Object.entries(data.tables).map(([key, tableData]) =>
          [key, Table.fromData(tableData)]
        )
      );
    }
    if (data.keyslots) {
      instance.keyslots = new Map(
        Object.entries(data.keyslots).map(([key, slotData]) =>
          [key, Slot.fromData(slotData)]
        )
      );
    }
    if (data.boxslots) {
      instance.boxslots = new Map(
        Object.entries(data.boxslots).map(([key, slotData]) =>
          [key, Slot.fromData(slotData)]
        )
      );
    }
    return instance;
  }
  /** 转换为数据 */
  public toData(): any {
    const data: any = {};
    // 复制所有可枚举的自有属性
    for (const key in this) {
      if (this.hasOwnProperty(key) && !(this[key] instanceof Map)) {
        data[key] = this[key];
      }
    }
    // 特殊处理Map属性
    data.tables = this.convertMapToObject(this.tables);
    data.keyslots = this.convertMapToObject(this.keyslots);
    data.boxslots = this.convertMapToObject(this.boxslots);

    return data;
  }

  private convertMapToObject(map: Map<string, any>): any {
    const obj: any = {};
    for (const [key, value] of map.entries()) {
      obj[key] = value.toData();
    }
    return obj;
  }
  //============================================================
  // 主要属性
  //============================================================
  /** 卡片类型 */
  public type: string = "";
  /** 卡片版本 */
  public version: string = "";
  /** 卡片系统 */
  public system: string = "";
  /** 卡片唯一标识符 */
  public guid: GUID = "";

  /** 卡片名称 */
  public name: string = "";
  /** 卡片图片 */
  public pic: string = "";
  /** 卡片描述-路径 */
  public des: string = "";

  /** 卡片所有者 */
  public owner: string | undefined;
  /** 表集合 */
  public tables: Map<string, Table>;
  /** KEYSLOT集合 */
  public keyslots: Map<string, Slot<Card>>;
  /** BOXSLOT集合 */
  public boxslots: Map<string, Slot<Card>>;

  //============================================================
  // 构造函数
  //============================================================
  constructor() {
    super()
    this.initType()
    this.tables = new Map();
    this.keyslots = new Map();
    this.boxslots = new Map();
  }

  //=======================================================
  // 序列化
  //=======================================================

  // ======================================================
  // 表格管理方法
  // ======================================================
  /** 添加表格 */
  public addTable(table: Table): boolean {
    const tableCopy = table.copy();
    if (tableCopy.sole) {
      const conflictInfo = this.checkSoleConflicts(tableCopy);
      if (conflictInfo) {
        Debug(`[Card] 无法添加表 [${tableCopy.name}]：sole属性冲突`);
        Debug(conflictInfo);
        return false;
      }
    }

    this.tables.set(tableCopy.name, tableCopy);
    return true;
  }
  /** 获取表格 */
  public getTable(name: string): Table | undefined {
    return this.tables.get(name);
  }

  /** 检查sole属性冲突 */
  private checkSoleConflicts(newTable: Table): string | null {
    const conflictKeys: string[] = [];
    const conflictTables: string[] = [];

    // 获取新表格的所有属性键
    const newTableKeys = Array.from(newTable.keys());

    // 遍历现有的sole表格
    for (const [tableName, existingTable] of this.tables) {
      if (existingTable.sole) {
        const existingKeys = Array.from(existingTable.keys());

        // 检查是否有相同的属性键
        for (const newKey of newTableKeys) {
          if (existingKeys.includes(newKey)) {
            conflictKeys.push(newKey);
            if (!conflictTables.includes(tableName)) {
              conflictTables.push(tableName);
            }
          }
        }
      }
    }

    return conflictKeys.length > 0
      ? `冲突属性: ${[...new Set(conflictKeys)].join(
        ", "
      )}, 冲突表格: ${conflictTables.join(", ")}`
      : null;
  }

  // ======================================================
  // 槽管理方法
  // ======================================================
  public addSlot(slot: Slot<Card>): void {
    slot.owner = this.guid;
    // 根据slot的类型添加到不同的数组
    if (slot instanceof KeySlot) {
      this.keyslots.set(slot.name, slot);
    } else if (slot instanceof BoxSlot) {
      this.boxslots.set(slot.name, slot);
    }
  }
  public getKeySlot(name: string): KeySlot<Card> | undefined {
    return this.keyslots.get(name) as KeySlot<Card>;
  }
  public getBoxSlot(name: string): BoxSlot<Card> | undefined {
    return this.boxslots.get(name) as BoxSlot<Card>;
  }

  // ======================================================
  // 属性操作方法
  // ======================================================

  /** 获取属性值（从sole表中） */
  public get<T extends ValueType>(name: string): T | undefined {
    // 从sole为true的表格中获取属性
    for (const table of this.tables.values()) {
      if (table.sole && table.has(name)) {
        return table.get<T>(name);
      }
    }
    return undefined;
  }

  /** 设置属性值（在sole表中） */
  public set(key: string, value: ValueType): void {
    // 设置sole为true的表格中的属性
    for (const table of this.tables.values()) {
      if (table.sole && table.has(key)) {
        table.set(key, value);
        return;
      }
    }
  }

  /** 修改数值属性（在sole表中） */
  public alter(key: string, value: number): void {
    // 修改sole为true的表格中的属性
    for (const table of this.tables.values()) {
      if (table.sole && table.has(key)) {
        table.alter(key, value);
        return;
      }
    }
  }

  /** 从指定表格中获取属性 */
  public getFromTable<T extends ValueType>(
    tableName: string,
    key: string
  ): T | undefined {
    const table = this.tables.get(tableName);
    if (table && table.has(key)) {
      return table.get<T>(key);
    }
    return undefined;
  }
  /** 设置指定表格中的属性 */
  public setInTable(tableName: string, key: string, value: ValueType): void {
    const table = this.tables.get(tableName);
    if (table && table.has(key)) table.set(key, value);
  }

  public alterInTable(tableName: string, key: string, value: number): void {
    const table = this.tables.get(tableName);
    if (table && table.has(key)) {
      table.alter(key, value);
    }
  }
}

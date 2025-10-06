import { Card } from "core/object/card";
import { Msg } from "core/object/message";
import { GAME } from "core/object/data";
import { DataType, GUID } from 'core/object/utils';

/** 槽 */
export abstract class Slot<T extends Card> extends DataType implements Iterable<T> {
  //============================================================
  // 序列化
  //============================================================
  /** 从数据重建对象 */
  static fromData(data: any): Slot<Card> {
    const constructor = DataType.getType(data.type);
    if (!constructor) {
      throw new Error(`Unknown slot type: ${data.type}`);
    }
    const instance = new (constructor as any)();
    Object.assign(instance, data);
    instance.list = data.list;
    return instance;
  }
  /** 转换为数据 */
  public toData(): any {
    return { ...this };
  }

  //============================================================
  /** 卡槽名称 */
  public name: string = "";
  /** 卡槽所有者 */
  public owner: GUID | undefined;

  /** 卡片数据 */
  list: GUID[] = [];

  constructor() {
    super()
    this.initType()
  }
  //============================================================
  // 卡片操作
  //============================================================
  /** 添加卡片 */
  public add(card: T): Msg {
    // 条件检查
    let rs = this.check_add(card);
    if (rs.success) {
      // 从属关系
      card.owner = this.owner;
      this.list.push(card.guid);
      // 添加
      this._add(card);
      // 添加后运行
      this._add_after(card)
    }
    return rs;
  }

  /** 移除卡片 */
  public remove(card: T): Msg {
    // 条件检查
    let rs = this.check_remove(card);
    if (rs.success) {
      // 从属关系
      card.owner = undefined;
      this.list.splice(this.list.indexOf(card.guid), 1);
      // 移除
      this._remove(card);
      // 移除后运行
      this._remove_after(card)
    }
    return rs;
  }

  /** 添加检查 */
  check_add(_card: T): Msg {
    return new Msg()
  };
  /** 移除检查 */
  check_remove(_card: T): Msg {
    return new Msg()
  };
  /** 自定义添加 */
  _add(_card: T): Msg {
    return new Msg()
  };
  /** 自定义移除 */
  _remove(_card: T): Msg {
    return new Msg()
  };
  /** 添加后运行 */
  _add_after(_card: T): void { };
  /** 移除后运行 */
  _remove_after(_card: T): void { };

  /** 获取卡片 */
  public get(guid: GUID): T | undefined {
    return GAME.get(guid) as T | undefined;
  }

  //============================================================
  // 数组操作
  //============================================================
  /** 遍历器 */
  *[Symbol.iterator](): Iterator<T> {
    for (const guid of this.list) {
      const card = GAME.get(guid) as T | undefined;
      if (card) {
        yield card;
      }
    }
  }

  get count(): number {
    return this.list.length;
  }
}

// ==================================================
// 盒子卡槽,用于创建仓库,技能栏等突出数量的容器，需要提供一定的排序功能。
// 除了有唯一标识符，还带有序号功能
// ==================================================

/** 盒子槽 */
export abstract class BoxSlot<T extends Card> extends Slot<T> {
  /** 筛选 */
  abstract find(main: string, minor: string): Array<T>;
  /** 盒子大小，设置为-1时，容器无上限 默认为-1 */
  public size: number = -1;

  /** 空间检查 */
  check_size(): Msg {
    if (this.size > 0 && this.count >= this.size) {
      return new Msg(false, `容器[${this.type}]已满。`);
    }
    return new Msg(true, `容器[${this.type}]可用`);
  }

  // 覆盖父类方法
  public override add(card: T): Msg {
    // 容器大小检查
    let rs = this.check_size();
    if (!rs.success) return rs

    // 其他
    rs = this.check_add(card);
    if (rs.success) {
      // 从属关系
      card.owner = this.owner;
      this.list.push(card.guid);
      // 添加
      this._add(card);
      // 添加后运行
      this._add_after(card)
    }
    return rs;
  }
}

// ==================================================
// 关键字卡槽
// 固定槽类型，固定数量，用于创建装备槽等
// ==================================================

/** 关键字卡槽 */
export abstract class KeySlot<T extends Card> extends Slot<T> {
  Keys: string[] = [];

  public setKeys(keys: string[]): void {
    this.Keys = keys;
    for (const _key of this.Keys) {
      this.list.push(undefined)
    }
  }

  public override add(card: T): Msg {
    // 容器大小检查
    let rs = this.check_key(card);
    if (!rs.success) return rs
    // 其他
    rs = this.check_add(card);
    if (rs.success) {
      // 从属关系
      card.owner = this.owner;
      this.list[this.Keys.indexOf(this.getKey(card))] = card.guid;
      // 添加
      this._add(card);
      // 添加后运行
      this._add_after(card)
    }
    return rs;
  }

  public override remove(card: T): Msg {
    // 条件检查
    let rs = this.check_remove(card);
    if (rs.success) {
      // 从属关系
      card.owner = undefined;
      this.list[this.Keys.indexOf(this.getKey(card))] = undefined;
      // 移除
      this._remove(card);
      // 移除后运行
      this._remove_after(card)
    }
    return rs;
  }

  /** 槽位检查 */
  check_key(card: T): Msg {
    const key = this.getKey(card);
    // 槽位不存在
    if (this.Keys.indexOf(key) === -1) {
      return new Msg(false, `${key}槽位不存在`);
    }
    // 槽位为空
    if (this.list[this.Keys.indexOf(key)] === undefined) {
      return new Msg(true, `${key}槽位可用`);
    }
    // 槽位上的卡片是否可以移除
    return this.check_remove(card);
  }

  /** 获取关键字 */
  abstract getKey(card: T): string;
}

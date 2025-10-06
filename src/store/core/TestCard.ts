import { markRaw } from "vue";
import { defineStore } from "pinia";
import { Table } from "core/object/table";
import { Card } from "core/object/card";
import { BoxSlot, KeySlot } from "core/object/slot";
import { GAME } from "bin/core/object/data";
import { ValueType } from "core/object/utils";
import type {
  IStateCard,
  ICard,
  IStateMiniMenu,
  IMiniMenu,
  IStateKeySlot,
  IStateBoxSlot,
} from "../storeType";

import imgItem from "assets/青锋剑.png";

import { Msg } from "core/object/message";
// ASSETS
import img_木剑 from "assets/XJ/武器/木剑.png";
import img_长剑 from "assets/XJ/武器/长剑.png";
import img_太极剑 from "assets/XJ/武器/太极剑.png";
import img_七星剑 from "assets/XJ/武器/七星剑.png";

import img_布袍 from "assets/XJ/防具/布袍.png";
import img_籐甲 from "assets/XJ/防具/籐甲.png";
import img_披风 from "assets/XJ/防具/披风.png";
import img_罗汉袍 from "assets/XJ/防具/罗汉袍.png";

import img_布靴 from "assets/XJ/防具/布靴.png";
import img_草鞋 from "assets/XJ/防具/草鞋.png";
import img_绣花鞋 from "assets/XJ/防具/绣花鞋.png";
// OTHERS
class Equipment extends Card {
  constructor(name: string, pic: string) {
    super();
    this.name = name;
    this.pic = pic;
    GAME.add(this);
  }
}

class ItemKeySlot extends KeySlot<Equipment> {
  _add(_card: Equipment): Msg {
      return new Msg();
    }
    _remove(_card: Equipment): Msg {
      return new Msg();
    }
  constructor(name: string, keylist: string[]) {
    super();
    this.setKeys(keylist)
    this.name = name;
  }
  getKey(card: Equipment): string {
    return card.name;
  }
  check_add(_card: Equipment): Msg {
    return new Msg();
  }
  check_remove(_card: Equipment): Msg {
    return new Msg();
  }
  _add_after(_card: Equipment): void {}
  _remove_after(_card: Equipment): void {}
}

class TestBagSlot extends BoxSlot<Equipment> {
  _add(_card: Equipment): Msg {
      return new Msg();
    }
    _remove(_card: Equipment): Msg {
      return new Msg();
    }
  constructor(size: number = -1) {
    super();
    this.name = "背包";
    this.size = size;
    this.add(new Equipment("武器", img_木剑));
    this.add(new Equipment("武器", img_长剑));
    this.add(new Equipment("武器", img_太极剑));
    this.add(new Equipment("武器", img_七星剑));

    this.add(new Equipment("衣服", img_布袍));
    this.add(new Equipment("衣服", img_籐甲));
    this.add(new Equipment("衣服", img_披风));
    this.add(new Equipment("衣服", img_罗汉袍));

    this.add(new Equipment("鞋子", img_布靴));
    this.add(new Equipment("鞋子", img_草鞋));
    this.add(new Equipment("鞋子", img_绣花鞋));
  }
  find(main: string, minor: string): Equipment[] {
    const list_eq: Equipment[] = [];
    for (const eq of this) {
      if (main == "" && minor == "") {
        list_eq.push(eq!);
      } else {
        if (main != "" && minor != "") {
          if (eq?.name! == main && eq?.name! == minor) {
            list_eq.push(eq!);
          }
        } else {
          if (eq?.name! == main || eq?.name! == minor) {
            list_eq.push(eq!);
          }
        }
      }
    }
    return list_eq;
  }
  _add_after(_card: Equipment): void {}
  _remove_after(_card: Equipment): void {}
  check_add(_card: Equipment): Msg {
    return new Msg();
  }
  check_remove(_card: Equipment): Msg {
    return new Msg();
  }
  type: string = "BagSlot";
}

class ItemTable extends Table {
  constructor() {
    super();
    this.name = "人物";
    this.add("姓名", "李逍遥");
    this.add("门派", "蜀山");
  }
  limit(_key: string, _value: ValueType) {}
}

class AttTable extends Table {
  constructor() {
    super();
    this.name = "属性";
    this.add("力量", 15);
    this.add("敏捷", 20);
    this.add("体力", 20);
    this.add("灵敏", 20);
    this.add("视力", 20);
    this.add("剑术", 20);
    this.add("家务", 20);
  }
  limit(_key: string, _value: ValueType) {}
}

class ItemCard extends Card {
  constructor() {
    super();
    this.pic = imgItem;
    this.addTable(new ItemTable());
    this.addTable(new AttTable());

    this.addSlot(new ItemKeySlot("装备", ["武器", "防具", "饰品"]));
    this.addSlot(new ItemKeySlot("晶片", ["X型", "Y型", "Z型"]));

    this.addSlot(new TestBagSlot());
  }
}

// OBJECT
const card = new ItemCard();

// STORE
/** IState接口 */
interface IState extends IStateCard {}

/** IStore接口 */
interface IStore extends IState, ICard {
  init(): void;
}

export const useTestCardStore = defineStore("useTestCardStore", {
  state: (): IState => ({
    listTable: ["人物", "属性"],
    listKeySlot: ["装备", "晶片"],
    listBoxSlot: ["背包"],
    table: undefined,
    keyslot: undefined,
    boxslot: undefined,
    card: markRaw(card),
    storeKeySlot: new Map(),
    storeBoxSlot: new Map(),
  }),
  actions: {
    // 初始化
    init() {
      this.table = this.card.getTable(this.listTable[0]);
      this.keyslot = this.card.getKeySlot(this.listKeySlot[0]);
      this.boxslot = this.card.getBoxSlot(this.listBoxSlot[0]);
      this.storeKeySlot.set("装备", storeEquip());
      this.storeKeySlot.set("晶片", storeOther());
      this.storeBoxSlot.set("背包", storeBag());
    },
    preTable() {
      let n = this.listTable.indexOf(this.table!.name) - 1;
      if (n == -1) n += 1;
      this.table = this.card.getTable(this.listTable[n]);
    },
    nextTable() {
      let n = this.listTable.indexOf(this.table!.name) + 1;
      if (n == this.listTable.length) n -= 1;
      this.table = this.card.getTable(this.listTable[n]);
    },
    preKeySlot() {
      let n = this.listKeySlot.indexOf(this.keyslot!.name) - 1;
      if (n == -1) n += 1;
      this.keyslot = this.card.getKeySlot(this.listKeySlot[n]);
    },
    nextKeySlot() {
      let n = this.listKeySlot.indexOf(this.keyslot!.name) + 1;
      if (n == this.listKeySlot.length) n -= 1;
      this.keyslot = this.card.getKeySlot(this.listKeySlot[n]);
    },
    preBoxSlot() {
      let n = this.listBoxSlot.indexOf(this.boxslot!.name) - 1;
      if (n == -1) n += 1;
      this.boxslot = this.card.getBoxSlot(this.listBoxSlot[n]);
    },
    nextBoxSlot() {
      let n = this.listBoxSlot.indexOf(this.boxslot!.name) + 1;
      if (n == this.listBoxSlot.length) n -= 1;
      this.boxslot = this.card.getBoxSlot(this.listBoxSlot[n]);
    },
  } as IStore,
});

// 装备栏交互
export const storeEquip = defineStore("storeEquip", {
  state: (): IStateMiniMenu & IStateKeySlot => ({
    keySlot: markRaw(card.getKeySlot("装备")!),
    menuItems: ["装备", "强化", "卸载"],
    select: "",
  }),
  actions: {
    // IMiniMenu接口方法
    clickItem(item: string) {
      console.log(`slect:${this.select},item:${item}`);
    },
  } as IMiniMenu,
});

// 装备栏交互
export const storeOther = defineStore("storeOther", {
  state: (): IStateMiniMenu & IStateKeySlot => ({
    keySlot: markRaw(card.getKeySlot("晶片")!),
    menuItems: ["替换", "移除"],
    select: "",
  }),
  actions: {
    // IMiniMenu接口方法
    clickItem(item: string) {
      console.log(`slect:${this.select},item:${item}`);
    },
  } as IMiniMenu,
});

// 背包交互
export const storeBag = defineStore("storeBag", {
  state: (): IStateMiniMenu & IStateBoxSlot => ({
    boxSlot: markRaw(card.getBoxSlot("背包")!),
    mainSelect: ["普通", "稀有"],
    minorSelect: ["武器", "衣服", "鞋子"],

    menuItems: ["查看", "丢弃"],
    select: "",
  }),
  actions: {
    // IMiniMenu接口方法
    clickItem(item: string) {
      console.log(`slect:${this.select},item:${item}`);
    },
  } as IMiniMenu,
});

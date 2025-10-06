import { defineStore } from "pinia";
import { Card } from "core/object/card";
import { BoxSlot } from "core/object/slot";
import { GAME } from "core/object/data";

import type {
  IStateBoxSlot,
  IBoxSlot,
  IStateMiniMenu,
  IMiniMenu,
} from "../storeType";

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

// STORE

interface IState extends IStateBoxSlot, IStateMiniMenu {}

/** ITestSlot接口 */
interface IStore extends IState, IBoxSlot, IMiniMenu {
  /** 容器[无上限] */
  createBoxSlot_0(): void;
  /** 容器[25] */
  createBoxSlot_30(): void;
  /** 容器[5] */
  createBoxSlot_5(): void;
  /** 添加物品 */
  addItem(): void;
}

export const useTestBoxSlotStore = defineStore("testBoxSlotStore", {
  state: (): IState => ({
    boxSlot: new TestBagSlot(),
    mainSelect: [],
    minorSelect: ["武器", "衣服", "鞋子"],
    menuItems: ["丢弃"],
    select: "",
  }),
  actions: {
    // IMiniMenu
    clickItem(item: string): void {
      switch(item){
        case "丢弃":
          this.boxSlot.remove(GAME.get(this.select)!)
          return
      }
    },
    // IBoxSlot
    createBoxSlot_0(): void {
      this.boxSlot = new TestBagSlot();
    },
    createBoxSlot_30(): void {
      this.boxSlot = new TestBagSlot(30);
    },
    createBoxSlot_5(): void {
      this.boxSlot = new TestBagSlot(5);
    },
    addItem(): void {
      const n = Math.floor(Math.random() * 3);
      switch (n) {
        case 0:
          this.boxSlot.add(new Equipment("武器", img_木剑));
          return 
        case 1:
          this.boxSlot.add(new Equipment("衣服", img_罗汉袍));
          return 
        case 2:
          this.boxSlot.add(new Equipment("鞋子", img_布靴));
          return 
      }
    },
  } as IStore,
});

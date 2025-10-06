import { defineStore } from 'pinia'
import {Card} from 'core/object/card'
import { KeySlot } from 'core/object/slot'
import type { IStateKeySlot, IKeySlot,IStateMiniMenu, IMiniMenu } from '../storeType'

import { Msg } from 'core/object/message'


// OTHERS
class Equipment extends Card {
  constructor(name: string, pic: string) {
    super()
    this.name = name
    this.pic = pic
  }
}



class EquipSlot extends KeySlot<Equipment> {
  getKey(card: Equipment): string {
    return card.name
  }
  check_add(_card: Equipment): Msg {
    return new Msg()
  }
  check_remove(_card: Equipment): Msg {
    return new Msg()
  }
  _add_after(_card: Equipment): void { }
  _remove_after(_card: Equipment): void { }
}


interface IState extends IStateKeySlot,IStateMiniMenu{

}

/** ITestSlot接口 */
interface IStore extends IState,IKeySlot,IMiniMenu {
    /** 展示装备槽 */
    showEquipSlot(): void
    /** 展示宝石槽 */
    showGemSlot(): void
}


export const useTestKeySlotStore = defineStore('testTable', {
  state: (): IState => ({
    keySlot: new EquipSlot(),
    menuItems:[ '强化', '卸下'],
    select:''
  }),
  actions: {
    // IStore接口方法
    showEquipSlot() {
      this.keySlot = new EquipSlot()
      this.keySlot.setKeys(['武器', '衣服', '鞋子', '头盔', '项链', '戒指'])
    },
    showGemSlot() {
      this.keySlot = new EquipSlot()
      this.keySlot.setKeys(['红', '蓝', '绿', '黄', '白', '黑', '紫'])
    },
    // IMiniMenu接口方法
    clickItem(item: string) {
      console.log(`slect:${this.select},item:${item}`)
    }
  } as IStore
})
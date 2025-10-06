// CORE
import { Msg } from "core/object/message";
import { BoxSlot } from "core/object/slot";
// GAME
import { Equip } from "game/object/card/equip";
import { 属性, 装备 } from "mod/XJ01/enum"

/** XJ01 装备管理列表类型 */
class BoxSlot_Equip_XJ01 extends BoxSlot<Equip_XJ01> {
    _add(_card: Equip_XJ01): Msg {
        return new Msg();
    }
    _remove(_card: Equip_XJ01): Msg {
        return new Msg();
    }
    find(_main: string, _minor: string): Equip_XJ01[] {
        return []
    }
    type: string = "BoxSlot_Equip_XJ01";

    constructor() {
        super()
    }

    _add_after(_equip: Equip_XJ01): void { }
    _remove_after(_equip: Equip_XJ01): void { }
    check_add(_equip: Equip_XJ01): Msg {
        return new Msg()
    }
    check_remove(_equip: Equip_XJ01): Msg {
        return new Msg()
    }
}

/** XJ01装备管理列表 */
const Manager_Equit_XJ01 = new BoxSlot_Equip_XJ01()

/**
const Equip_Type = {
    武器: '武器',
    头饰: '头饰',
    衣服: '衣服',
    披风: '披风',
    鞋子: '鞋子',
    饰品: '饰品'
}
 */



class Equip_XJ01 extends Equip {
    version: string = '1.0'
    sole: boolean = true

    constructor(name: string) {
        super('Equip_XJ01')
        Manager_Equit_XJ01.add(this)
        this.name = name
    }
}

// CORE
import { ValueType,Table } from "core/object/table";
import { Slot } from "core/object/slot";
import { numberp } from "core/object/tools";
// GAME
import { Equip } from "game/object/card/equip";
import { Role } from "game/object/card/role"
import { Skill } from "game/object/card/skill";
import { Status } from "game/object/card/status";
import { RPG_TPGame } from "game/object/table/RPG_TPGame"

/** 人物基础属性 */
class Att_XJ01 extends Table {
    name: string = 'Att_XJ01'
    version: string = '1.0'
    sole: boolean = true

    /** 属性枚举 */
    static readonly Att = {
        体力: '体力',
        真气: '真气',
        武术: '武术',
        灵力: '灵力',
        防御: '防御',
        身法: '身法',
        吉运: '吉运'
    } as const;

    constructor() {
        super()
        this.add(Att_XJ01.Att.体力,0)
        this.add(Att_XJ01.Att.真气,0)
        this.add(Att_XJ01.Att.武术,0)
        this.add(Att_XJ01.Att.灵力,0)
        this.add(Att_XJ01.Att.防御,0)
        this.add(Att_XJ01.Att.身法,0)
        this.add(Att_XJ01.Att.吉运,0)
    }

    limit(key: string, value: ValueType) {
        // 所有数值都需要大于0
        if (numberp(value)) {
            if (value < 0) {
                this.set(key, 0)
            }
        }
    }
}

export class Role_XJ01 extends Role {
    _initTable() {
        this.addTable(new Att_XJ01())
    }
    _initEquipSlot(): Slot<Equip> {
        throw new Error("Method not implemented.");
    }
    _initSkillSlot(): Slot<Skill> {
        throw new Error("Method not implemented.");
    }
    _initStatusSlot(): Slot<Status> {
        throw new Error("Method not implemented.");
    }

    _initSlot(): void {}

    initType() {
        const hp = this.get<number>(Att_XJ01.Att.体力)!
        const mp = this.get<number>(Att_XJ01.Att.真气)!
        // 计算hp最大值与当前hp
        this.set(RPG_TPGame.Att.HP_MAX, hp)
        if (this.get<number>(RPG_TPGame.Att.HP)! == 0) {
            this.set(RPG_TPGame.Att.HP, hp)
        }
        // 计算mp最大值与当前mp
        this.set(RPG_TPGame.Att.MP_MAX, mp)
        if (this.get<number>(RPG_TPGame.Att.MP)! == 0) {
            this.set(RPG_TPGame.Att.MP, mp)
        }
    }

    // 无修正值
    _getMud(_name: string): number {
        return 1
    }
}
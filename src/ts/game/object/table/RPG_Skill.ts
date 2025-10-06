// CORE
import { ValueType, Table } from "core/object/table";
import { numberp } from "core/object/tools";

/** 技能属性表 */
export class RPG_Skill extends Table {
    name: string = 'RPG_Skill'
    version: string = '1.0'
    sole: boolean = true

    /** 属性枚举 */
    static readonly Att = {
        /** 权重，用于参与技能的释放决策 */
        WEIGHT: 'CHARGE',
        /** 强度，用于衡量技能的效果强度 */
        POWER: 'POWER',
        /** TP，技能使用消耗 */
        TP: 'TP',
    } as const;

    constructor() {
        super()
        this.add(RPG_Skill.Att.WEIGHT, 0)
        this.add(RPG_Skill.Att.POWER, 0)
        this.add(RPG_Skill.Att.TP, 0)
    }

    public limit(key: string, value: ValueType) {
        // 所有数值都需要大于0
        if (numberp(value)) {
            if (value < 0) {
                this.set(key, 0)
            }
        }
    }
}

/** 技能目标表 */
export class RPG_Skill_TARGET extends Table {
    name: string = 'RPG_Skill_TARGET'
    version: string = '1.0'
    sole: boolean = true
    /** 属性枚举 */
    static readonly Att = {
        /** 目标数量 */
        NUM: 'NUM',
        /** 排序属性 */
        ATTR: 'ATTR',
        /** 排序顺序（true升序，false降序） */
        ORDER: 'ORDER',
        /** 是否允许目标重复 */
        REPEAT: 'REPEAT',
        /** 是否选取敌方 */
        ENEMY: 'ENEMY',
    } as const;

    constructor() {
        super()
        this.add(RPG_Skill_TARGET.Att.NUM, 1)
        this.add(RPG_Skill_TARGET.Att.ATTR, '')
        this.add(RPG_Skill_TARGET.Att.ORDER, true)
        this.add(RPG_Skill_TARGET.Att.REPEAT, false)
        this.add(RPG_Skill_TARGET.Att.ENEMY, true)
    }

    public limit(key: string, value: ValueType) {
        if (key == RPG_Skill_TARGET.Att.NUM && numberp(value)) {
            if (value < 1) {
                this.set(RPG_Skill_TARGET.Att.NUM, 1)
            }
        }
        // 所有数值都需要大于0
        if (numberp(value)) {
            if (value < 0) {
                this.set(key, 0)
            }
        }
    }
}

/** 技能消耗表 */
export class RPG_Skill_COST extends Table {
    name: string = 'RPG_Skill_COST'
    version: string = '1.0'
    sole: boolean = false

    public limit(key: string, value: ValueType) {
        // 所有数值都需要大于0
        if (numberp(value)) {
            if (value < 0) {
                this.set(key, 0)
            }
        }
    }
}
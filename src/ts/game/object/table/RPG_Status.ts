// CORE
import { ValueType, Table } from "core/object/table";
import { numberp } from "core/object/tools";

/** 状态属性表 */
export class RPG_Status extends Table {
    name: string = SYSTEM_TYPE.STATUS
    version: string = '1.0'
    sole: boolean = true
    /** 属性 */

    /** 属性枚举 */
    static readonly Att = {
        /** 充能，可用于衡量状态的强度，随周期变化，可以控制状态的持续时间。 */
        CHARGE: 'CHARGE',
        /** 周期, 控制状态的触发频率。单位毫秒/回合数*/
        CYCLE: 'CYCLE',
        /** TP，计时工具 */
        TP: 'TP',
        /** 控制状态是否还激活，非激活状态应该在游戏循环的某个环节中被移除。 */
        ALIVE: 'ALIVE'
    } as const;

    constructor() {
        super()
        this.add(RPG_Status.Att.CHARGE, 0)
        this.add(RPG_Status.Att.CYCLE, 1000)
        this.add(RPG_Status.Att.TP, 0)
        this.add(RPG_Status.Att.ALIVE, false)
    }

    public limit(key: string, value: ValueType) {
        //** CHARGE逻辑 */
        if (key == STATUS.CHARGE && numberp(value)) {
            if (value < 0) {
                this.set(STATUS.CHARGE, 0)
            }
        }
        //** CYCLE逻辑 */
        if (key == STATUS.CYCLE && numberp(value)) {
            if (value < 1000) {
                this.set(STATUS.CYCLE, 1000)
            }
        }
        //** TP逻辑 */
        if (key == STATUS.TP && numberp(value)) {
            if (value >= this.get<number>(STATUS.CYCLE)!) {
                this.set(STATUS.ALIVE, true)
            } else {
                this.set(STATUS.ALIVE, false)
            }
        }
    }
}
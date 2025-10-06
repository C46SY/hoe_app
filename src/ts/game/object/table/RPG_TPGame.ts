// CORE
import { ValueType } from "core/object/utils";
import { Table } from "core/object/table";
import { numberp } from "core/object/tools";

// ==============================================
// RPG基础属性表，用于衡量角色在战斗中的基本状态。
// ==============================================

/** RPG基础属性表 */
export class RPG_TPGame extends Table {
    name: string = 'RPG_TPGame'
    version: string = '1.0'
    sole: boolean = true

    /** 属性枚举 */
    static readonly Att = {
        /** 生命 */
        HP: 'HP',
        HP_MAX: 'HP_MAX',
        /** 能量 */
        MP: 'MP',
        MP_MAX: 'MP_MAX',
        /** 进度条 */
        SP: 'SP',
        TP: 'TP',
        /** 行动 */
        ACTION: 'ACTION',
        /** 存活 */
        ALIVE: 'ALIVE'
    } as const;

    constructor() {
        super()
        this.add(RPG_TPGame.Att.HP, 0)
        this.add(RPG_TPGame.Att.HP_MAX, 0)
        this.add(RPG_TPGame.Att.MP, 0)
        this.add(RPG_TPGame.Att.MP_MAX, 0)
        this.add(RPG_TPGame.Att.SP, 0)
        this.add(RPG_TPGame.Att.TP, 0)
        this.add(RPG_TPGame.Att.ACTION, false)
        this.add(RPG_TPGame.Att.ALIVE, false)
    }

    public limit(key: string, value: ValueType) {
        //** TP逻辑 */
        if (key == RPG_TPGame.Att.TP && numberp(value)) {
            this.set(RPG_TPGame.Att.ACTION, value >= 10000);
        }

        //** HP逻辑 */
        if (key == RPG_TPGame.Att.HP && numberp(value)) {
            if (value < 0) {
                this.set(RPG_TPGame.Att.HP, 0)
            }
            if (value == 0) {
                this.set(RPG_TPGame.Att.ALIVE, false);
            }
            if (value > 0) {
                if (value > this.get<number>(RPG_TPGame.Att.HP_MAX)) {
                    this.set(RPG_TPGame.Att.HP, this.get(RPG_TPGame.Att.HP_MAX))
                } else {
                    this.set(RPG_TPGame.Att.ALIVE, true);
                }
            }
        }

        //** MP逻辑 */
        if (key == RPG_TPGame.Att.MP && numberp(value)) {
            if (value < 0) {
                this.set(RPG_TPGame.Att.MP, 0)
            }
            if (value > this.get<number>(RPG_TPGame.Att.MP_MAX)) {
                this.set(RPG_TPGame.Att.MP, this.get(RPG_TPGame.Att.MP_MAX))
            }
        }

        //** SP逻辑 */
        if (key == RPG_TPGame.Att.SP && numberp(value)) {
            if (value < 0 || value > 10000) {
                this.set(RPG_TPGame.Att.SP, 0)
            }
        }
    }
}
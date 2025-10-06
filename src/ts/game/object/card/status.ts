// CORE
import { ValueType, Table } from "core/object/table";
import { BoxSlot } from "core/object/slot"
import { Card } from "core/object/card";
import { numberp } from "core/object/tools";

// GAME
import { Role } from "game/object/card/role";
import { RPG_Status } from "game/object/table/RPG_Status"

// ------------------------------------------------------------------
// 状态基础表
// ------------------------------------------------------------------
/** 状态基础表 */
class Table_Status_Attr extends Table {
    constructor(name: string, sole: boolean) {
        super()
        this.name = name
        this.sole = sole
    }

    limit(_key: string, _value: ValueType) {
    }
}

// ------------------------------------------------------------------
// 状态
// ------------------------------------------------------------------
/** 状态 */
export abstract class Status extends Card {

    public static Table = {
        ATTR: 'ATTR',
        ADD: 'ADD',
        MUL: 'MUL',
    }

    constructor() {
        super()
        this.addTable(new RPG_Status())
    }


    // ------------------------------------------------------
    // 属性管理

    // ======================================================
    // 1.状态属性
    // ======================================================
    /** 添加表 状态属性 */
    tableAttr(obj: Record<string, ValueType>): this {
        const table = new Table_Status_Attr(Status.Table.ATTR, true)
        Object.entries(obj).forEach(([key, value]) => {
            table.add(key, value)
        });
        this.addTable(table)
        return this
    }
    /** 添加、覆盖 需求属性 */
    addAttr(key: string, value: ValueType): this {
        const table = this.tables.get(Status.Table.ATTR)
        table?.set(key, value)
        return this
    }
    /** 修正 需求属性 */
    alterAttr(key: string, value: ValueType): this {
        const table = this.tables.get(Status.Table.ATTR)
        if (numberp(value)) {
            table?.alter(key, value)
        } else {
            table?.set(key, value)
        }
        return this
    }

    // ======================================================
    // 2.加法修正
    // ======================================================
    /** 添加表 加法修正 */
    tableEnhance_Add(obj: Record<string, number>): this {
        const table = new Table_Status_Attr(Status.Table.ADD, true)
        Object.entries(obj).forEach(([key, value]) => {
            table.add(key, value)
        });
        this.addTable(table)
        return this
    }
    /** 添加、覆盖 加法修正 */
    addEnhance_Add(key: string, value: number): this {
        const table = this.tables.get(Status.Table.ADD)
        table?.set(key, value)
        return this
    }
    /** 修正 加法修正 */
    alterEnhance_Add(key: string, value: number): this {
        const table = this.tables.get(Status.Table.ADD)
        table?.alter(key, value)
        return this
    }

    // ======================================================
    // 3.乘法修正
    // ======================================================
    /** 添加表 乘法修正 */
    tableEnhance_Mul(obj: Record<string, number>): this {
        const table = new Table_Status_Attr(Status.Table.MUL, false)
        Object.entries(obj).forEach(([key, value]) => {
            table.add(key, value)
        });
        this.addTable(table)
        return this
    }
    /** 添加、覆盖 乘法修正 */
    addEnhance_Mul(key: string, value: number): this {
        const table = this.tables.get(Status.Table.MUL)
        table?.set(key, value)
        return this
    }
    /** 修正 乘法修正 */
    alterEnhance_Mul(key: string, value: number): this {
        const table = this.tables.get(Status.Table.MUL)
        table?.alter(key, value)
        return this
    }
    /** 获取 乘法修正 */
    getEnhance_Mul(key: string): number | undefined {
        const table = this.tables.get(Status.Table.MUL)
        return table?.get(key)
    }


    // ======================================================
    // 状态运行机制
    // ======================================================
    /** 状态激活 */
    public activate(roles: Array<Role>): Array<any> {
        const messages = this._activate(this._target(roles))
        this.cost()
        if (messages && messages instanceof Array) {
            return messages
        } else if (messages) {
            return [messages]
        }
        return []
    }
    
    /** 状态消耗 */
    private cost() {
        this.set(STATUS.TP, 0)
        this._cost()
        if (this.get<number>(RPG_Status.Att.CHARGE)! <= 0) {
            this._off()
        }
    }
    /** 状态添加 */
    public on() {
        // 按属性加法表添加属性
        const am = this.tables.get(Status.Table.ADD)
        if (am) {
            for (const [key, value] of am) {
                if (numberp(value)) this.owner?.alter(key, value)
            }
        }
        // 自定义操作
        this._on()
    }

    /** 状态移除 */
    public off() {
        // 按属性加法表移除属性
        const am = this.tables.get(Status.Table.ADD)
        if (am) {
            for (const [key, value] of am) {
                if (numberp(value)) this.owner?.alter(key, -value)
            }
        }
        this._off()
    }

    // ======================================================
    // 子类实现函数
    // ======================================================
    /** 子类实现 获取对象 */
    abstract _target(roles: Array<Role>): Array<Role>;
    /** 子类实现 触发状态 */
    abstract _activate(roles: Array<Role>): Array<any> | any | void;
    /** 子类实现 触发消耗 */
    abstract _cost(): any;
    /** 子类实现 加载状态 */
    abstract _on(): any;
    /** 子类实现 移除状态 */
    abstract _off(): any;
}


// ----------------------------------------------------------------
// 状态槽
// ----------------------------------------------------------------
/** 状态槽 */
export abstract class Slot_Status extends BoxSlot<Status> {
    /** 状态槽 */
    type: string = 'STATUS'
    _add_after(status: Status): void {
        status.on()
    }
    _remove_after(status: Status): void {
        status.off()
    }
}

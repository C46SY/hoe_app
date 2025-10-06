// CORE
import { ValueType } from "core/object/utils";
import { Table } from "core/object/table";
import { KeySlot } from "core/object/slot"
import { Card } from "core/object/card";
import { numberp, stringp } from "core/object/tools";
import { Msg } from "core/object/message";

import { GAME } from "core/object/data";

/** 装备基表 */
class Table_Equip_ARG extends Table {
    constructor(name: string, sole: boolean) {
        super()
        this.name = name
        this.sole = sole
    }

    limit(_key: string, _value: ValueType) {
        // 词缀无法修改
    }
}

/** 装备 */
export class Equip extends Card {
    /** 装备属性表 */
    public static Table = {
        NEED: 'NEED',
        ATTR: 'ATTR',
        ADD: 'ADD',
        MUL: 'MUL',
    }

    constructor(sys: string) {
        super()
        this.system = sys
    }

    // ======================================================
    // 需求属性
    // ======================================================
    /** 添加表 需求属性 */
    tableNeed(obj: Record<string, ValueType>): this {
        const table = new Table_Equip_ARG(Equip.Table.NEED, false)
        Object.entries(obj).forEach(([key, value]) => {
            table.add(key, value)
        });
        this.addTable(table)
        return this
    }
    /** 添加、覆盖 需求属性 */
    setNedd(key: string, value: ValueType): this {
        const table = this.tables.get(Equip.Table.NEED)
        table?.set(key, value)
        return this
    }
    /** 修正 需求属性 */
    alterNedd(key: string, value: ValueType): this {
        const table = this.tables.get(Equip.Table.NEED)
        if (numberp(value)) {
            table?.alter(key, value)
        } else {
            table?.set(key, value)
        }
        return this
    }

    // ======================================================
    // 装备属性
    // ======================================================
    /** 添加表 装备属性 */
    tableAttr(obj: Record<string, ValueType>): this {
        const table = new Table_Equip_ARG(Equip.Table.ATTR, false)
        Object.entries(obj).forEach(([key, value]) => {
            table.add(key, value)
        });
        this.addTable(table)
        return this
    }
    /** 添加、覆盖 装备属性 */
    setAttr(key: string, value: ValueType): this {
        const table = this.tables.get(Equip.Table.ATTR)
        table?.set(key, value)
        return this
    }
    /** 修正 装备属性 */
    alterAttr(key: string, value: ValueType): this {
        const table = this.tables.get(Equip.Table.ATTR)
        if (numberp(value)) {
            table?.alter(key, value)
        } else {
            table?.set(key, value)
        }
        return this
    }
    getAttr(key: string): number | undefined {
        const table = this.tables.get(Equip.Table.ATTR)
        return table?.get<number>(key)
    }

    // ======================================================
    // 加法修正
    // ======================================================
    /** 添加表 加法修正 */
    tableEnhance_Add(obj: Record<string, number>): this {
        const table = new Table_Equip_ARG(Equip.Table.ADD, false)
        Object.entries(obj).forEach(([key, value]) => {
            table.add(key, value)
        });
        this.addTable(table)
        return this
    }
    /** 添加、覆盖 加法修正 */
    setEnhance_Add(key: string, value: number): this {
        const table = this.tables.get(Equip.Table.ADD)
        table?.set(key, value)
        return this
    }
    /** 修正 加法修正 */
    alterEnhance_Add(key: string, value: number): this {
        const table = this.tables.get(Equip.Table.ADD)
        table?.alter(key, value)
        return this
    }


    // ======================================================
    // 乘法修正
    // ======================================================
    /** 添加表 乘法修正 */
    tableEnhance_Mul(obj: Record<string, number>): this {
        const table = new Table_Equip_ARG(Equip.Table.MUL, false)
        Object.entries(obj).forEach(([key, value]) => {
            table.add(key, value)
        });
        this.addTable(table)
        return this
    }
    /** 添加、覆盖 加法修正 */
    setEnhance_Mul(key: string, value: number): this {
        const table = this.tables.get(Equip.Table.MUL)
        table?.set(key, value)
        return this
    }
    /** 修正 加法修正 */
    alterEnhance_Mul(key: string, value: number): this {
        const table = this.tables.get(Equip.Table.MUL)
        table?.alter(key, value)
        return this
    }
    getEnhance_Mul(key: string): number | undefined {
        const table = this.tables.get(Equip.Table.MUL)
        return table?.get<number>(key)
    }

    // ======================================================
    // 装备逻辑
    // ======================================================
    /** 穿上装备 */
    equip() {
        const role = GAME.get(this.owner)
        // 按属性加法表添加属性
        const am = this.tables.get(Equip.Table.ADD)
        if (am) {
            for (const [key, value] of am) {
                if (numberp(value)) role?.alter(key, value)
            }
        }
        // 自定义操作
        this._equip()
    }
    /** 卸下装备 */
    unequip() {
        const role = GAME.get(this.owner)
        // 按属性加法表移除属性
        const am = this.tables.get(Equip.Table.ADD)
        if (am) {
            for (const [key, value] of am) {
                if (numberp(value)) role?.alter(key, -value)
            }
        }
        // 自定义操作
        this._unequip()
    }
    /** 自定义 穿戴装备事件 */
    _equip(): any { }
    /** 自定义 卸载装备事件 */
    _unequip(): any { };
}


// ----------------------------------------------------------------
// 装备槽
// ----------------------------------------------------------------
/** 装备槽 */
export abstract class Slot_Equip extends KeySlot<Equip> {
    type: string = "EQUIP";

    /** 装备属性要求检查 */
    check_need(equip: Equip): Msg {
        let check = true
        const role = GAME.get(this.owner)
        // 装备属性需求检查
        const nt = equip.tables.get(STATUS_ATTR.NEED)
        if (nt) {
            for (const [key, value] of nt) {
                if (numberp(value)) {
                    check = check && role?.get<number>(key)! >= value
                }
                if (stringp(value)) {
                    check = check && role?.get<string>(key)! == value
                }
            }
        }
        if (!check) {
            return new Msg(false, "不满足装备需求")
        }
        return new Msg(true, "满足装备需求")
    }

    check_add(equip: Equip): Msg {
        // 装备属性需求检查
        let check = this.check_need(equip)
        if (!check.success) {
            return check
        }
        // 装备自定义检查
        check = this.check_others(equip)
        if (!check.success) {
            return check
        }
        // 可以添加
        return new Msg(true, "装备可使用")
    }

    _add_after(equip: Equip): void {
        equip.equip()
    }
    check_remove(_equip: Equip): Msg {
        return new Msg(true, "装备允许卸载")
    }
    _remove_after(equip: Equip): void {
        equip.unequip()
        equip.owner = undefined
    }

    /** 自定义装备要求 */
    abstract check_others(equip: Equip): Msg;
}
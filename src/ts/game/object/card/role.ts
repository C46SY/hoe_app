// CORE
import { ValueType } from "core/object/table";
import { Slot } from "core/object/slot"
import { Card } from "core/object/card";
import { numberp, booleanp, stringp, Cards } from "core/object/tools";
import { Msg } from "core/object/message";
// GAME
import { Equip } from "game/object/card/equip"
import { Status } from "game/object/card/status";
import { Skill } from "game/object/card/skill";
import { RPG_TPGame } from "game/object/table/RPG_TPGame"

/** TP回合制角色 */
export abstract class Role extends Card {
    public guid: string = '';

    public static Slot = {
        EQUIP: 'EQUIP',
        STATUS: 'STATUS',
        SKILL: 'SKILL',
    }

    /** 装备槽 */
    slot_equip: Slot<Equip> | undefined;
    /** 状态槽 */
    slot_status: Slot<Status> | undefined;
    /** 技能槽 */
    slot_skill: Slot<Skill> | undefined;

    constructor() {
        super()
        // RPG属性表 用于游戏逻辑控制
        this.addTable(new RPG_TPGame())
        // 自定义表，自定义卡系统
        this._initTable()
        // 自定义装备槽
        this.slot_equip = this._initEquipSlot()
        if (this.slot_equip) this.addSlot(this.slot_equip)
        // 自定义技能槽
        this.slot_skill = this._initSkillSlot()
        if (this.slot_skill) this.addSlot(this.slot_skill)
        // 自定义状态槽
        this.slot_status = this._initStatusSlot()
        if (this.slot_status) this.addSlot(this.slot_status)
        // 自定义卡槽
        this._initSlot()
    }

    /** 初始化 角色表 如：种族值，训练值，天赋等。 */
    abstract _initTable(): any;

    /** 初始化 装备槽 */
    abstract _initEquipSlot(): Slot<Equip> | undefined;
    /** 初始化 技能槽 */
    abstract _initSkillSlot(): Slot<Skill> | undefined;
    /** 初始化 状态槽 */
    abstract _initStatusSlot(): Slot<Status> | undefined;

    /** 初始化 自定义卡槽 天赋及其他 */
    abstract _initSlot(): void;

    /** 角色初始化，计算角色的RPG属性表 */
    abstract initType(): any;

    //=======================================================
    // 游戏逻辑
    // ======================================================

    /** 添加 装备 */
    public addEquip(equip: Equip): Msg {
        return this.slot_equip!.add(equip)
    }

    /** 添加 状态 */
    public addStatus(status: Status): Msg {
        return this.slot_status!.add(status)
    }

    /** 添加 技能 */
    public addSkill(skill: Skill): Msg {
        return this.slot_skill!.add(skill)
    }


    //=======================================================
    // 游戏逻辑
    // ======================================================

    /** 处理 状态 */
    public TriggerStatus(roles: Array<Role>, tp: number): Array<Msg> {
        const messages: Array<Msg> = [];

        // 为所有状态计算时点
        for (const [_key, status] of this.slot_status!) {
            if (status) {
                tp += status.get<number>(STATUS.TP)!
                status.set(STATUS.TP, tp)
            }
        }

        // 获取激发的状态
        const sl = Cards.Select(this.slot_status!.list, STATUS.ALIVE, true)

        // 触发状态
        for (const status of sl) {
            const msg = status.activate(roles)
            if (msg && msg instanceof Array) {
                messages.push(...msg)
            } else if (msg) {
                messages.push(msg)
            }
        }

        return messages;
    }

    /** 处理 技能 */
    public TriggerSkill(roles: Array<Role>): Array<Msg> {
        // 获取所有可用技能
        let sl: Array<Skill> = []
        for (const [_key, skill] of this.slot_skill!) {
            if (skill) {
                if (skill.available()) {
                    sl.push(skill)
                }
            }
        }

        // 选取使用的技能
        if (sl != null && sl.length > 0) {
            // 按权重排列技能
            sl = sl.sort((a, b) => b.get<number>(SKILL.WEIGHT)! - a.get<number>(SKILL.WEIGHT)!)
            // 获取最大权重的若干个技能
            const w = sl[0].get(SKILL.WEIGHT)
            if (w) sl = Cards.Select(sl, SKILL.WEIGHT, w)
            // 随机获取其中一个技能
            const sk = Cards.Random(sl)[0]
            return sk.use(roles)
        }

        // 如果没有可用技能，返回空数组
        return []
    }

    /** 获取属性 */
    public override get<T extends ValueType>(name: string): T | undefined {
        // 计算基础属性
        const att = super.get<T>(name)
        if (numberp(att)) {
            return att * this._getMud(name) as T
        }
        if (booleanp(att) || stringp(att)) {
            return att
        }
        return undefined
    }

    /** 计算乘法修正 来自装备，状态等修正 */
    abstract _getMud(name: string): number;
}







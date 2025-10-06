// CORE
import { ValueType, GUID } from "core/object/utils";
import { GAME } from "bin/core/object/data";
import { Table } from "core/object/table";
import { Card } from "core/object/card";
import { numberp, Cards } from "core/object/tools";
import { Msg } from "core/object/message";
// GAME
import { Role } from "game/object/card/role";
import { RPG_TPGame } from "game/object/table/RPG_TPGame"
import { RPG_Skill, RPG_Skill_TARGET, RPG_Skill_COST } from "game/object/table/RPG_Skill"

// ------------------------------------------------------------------
// 技能
// ------------------------------------------------------------------
/** 技能 */
export abstract class Skill extends Card {
    public owner: GUID = undefined;
    table_cost: Table;
    table_target: Table;

    constructor(name: string, tp: number, weight: number) {
        super()
        this.name = name
        this.addTable(new RPG_Skill())

        this.table_cost = new RPG_Skill_COST()
        this.table_target = new RPG_Skill_TARGET()

        this.addTable(this.table_cost)
        this.addTable(this.table_target)


        this.set(SKILL.TP, tp)
        this.set(SKILL.WEIGHT, weight)
    }

    // ================== 技能消耗表 ==================
    /** 添加消耗表 */
    tableCost(obj: Record<string, ValueType>): this {
        Object.entries(obj).forEach(([key, value]) => {
            this.table_cost.add(key, value)
        });
        return this
    }
    /** 添加/覆盖消耗属性 */
    setCost(key: string, value: ValueType): this {
        this.table_cost.set(key, value)
        return this
    }
    /** 获取消耗值 */
    getCost(key: string): ValueType | undefined {
        return this.table_cost.get(key)
    }
    /** 修改消耗值 */
    alterCost(key: string, value: number): this {
        if (numberp(value)) {
            this.table_cost.alter(key, value)
        }
        return this
    }

    // ================== 技能目标表 ==================
    /** 批量设置目标表属性 */
    tableTarget(obj: Record<string, ValueType>): this {
        Object.entries(obj).forEach(([key, value]) => {
            this.table_target.set(key, value)
        })
        return this
    }

    /** 选取目标（可被子类重写） */
    target(roles: Array<Role>): Array<GUID> {
        const num = this.table_target.get<number>(SKILL_TARGET.NUM) ?? 0
        const attr = this.table_target.get<string>(SKILL_TARGET.ATTR) ?? ''
        const order = this.table_target.get<boolean>(SKILL_TARGET.ORDER) ?? true
        const repeat = this.table_target.get<boolean>(SKILL_TARGET.REPEAT) ?? false
        const enemy = this.table_target.get<boolean>(SKILL_TARGET.ENEMY) ?? true

        // 获取当前角色阵营
        const myTeam = GAME.get(this.owner)!.get('阵营')!
        // 过滤目标
        // 1. 过滤出活着的目标
        let aliveRoles = Cards.Select(roles, RPG_TPGame.Att.ALIVE, true);

        // 2. 根据enemy参数区分敌我
        let candidates: Array<GUID>;
        if (enemy) {
            // 只选敌人，且不能包含自己
            candidates = Cards.Remove(aliveRoles, '阵营', myTeam);
        } else {
            // 只选己方
            candidates = Cards.Select(aliveRoles, '阵营', myTeam);
        }

        // 如果num为0，返回自己
        if (num === 0) {
            return [this.owner!]
        }

        // 如果没有目标，直接返回空
        if (candidates.length === 0) {
            return []
        }

        // 如果没有attr，随机筛选
        if (!attr) {
            // 允许重复
            if (repeat) {
                let result: Array<GUID> = []
                for (let i = 0; i < num; i++) {
                    const idx = Math.floor(Math.random() * candidates.length)
                    result.push(candidates[idx].guid)
                }
                return result
            } else {
                // 不允许重复
                // 如果目标数小于num，返回全部
                if (candidates.length <= num) {
                    return candidates
                }
                // 随机选num个
                let shuffled = candidates.slice()
                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1))
                        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
                }
                return shuffled.slice(0, num)
            }
        } else {
            // 有attr，根据attr排序
            candidates.sort((a, b) => {
                const va = a.get<any>(attr)
                const vb = b.get<any>(attr)
                if (va === undefined && vb === undefined) return 0
                if (va === undefined) return 1
                if (vb === undefined) return -1
                if (va === vb) return 0
                if (order) {
                    // 升序
                    return va > vb ? 1 : -1
                } else {
                    // 降序
                    return va < vb ? 1 : -1
                }
            })

            // 检查是否存在属性值相等且大于num的情况
            if (!repeat && candidates.length > num && num > 0) {
                // 取前num个的属性值
                const topAttrValue = candidates[0].get<any>(attr)
                let sameAttrCount = 1
                for (let i = 1; i < candidates.length; i++) {
                    const v = candidates[i].get<any>(attr)
                    if (v === topAttrValue) {
                        sameAttrCount++
                    } else {
                        break
                    }
                }
                // 如果前sameAttrCount个属性值都相等，且sameAttrCount >= num
                if (sameAttrCount >= num) {
                    // 从属性值相等的前sameAttrCount个中随机选num个
                    let pool = candidates.slice(0, sameAttrCount)
                    let result: Array<Role> = []
                    let usedIdx: Set<number> = new Set()
                    for (let i = 0; i < num; i++) {
                        let idx: number
                        do {
                            idx = Math.floor(Math.random() * pool.length)
                        } while (usedIdx.has(idx) && usedIdx.size < pool.length)
                        usedIdx.add(idx)
                        result.push(pool[idx])
                    }
                    return result
                }
            }

            if (repeat) {
                // 允许重复，按排序结果重复选num个
                let result: Array<Role> = []
                for (let i = 0; i < num; i++) {
                    result.push(candidates[i % candidates.length])
                }
                return result
            } else {
                // 不允许重复
                // 如果排序后目标数小于num，直接返回全部，不再补足
                if (candidates.length < num) {
                    return candidates
                }
                // 正常情况，直接取前num个
                return candidates.slice(0, num)
            }
        }
    }

    // 检查技能是否满足消耗
    public available(): boolean {
        // 检查TP消耗
        const utp = this.owner?.get<number>(SKILL.TP)!
        const tp = this.get<number>(SKILL.TP)!
        let tpCheck = utp >= tp

        // 检查消耗表
        let costCheck = true
        const costTable = this.tables.get(SKILL_ATTR.COST)
        if (costTable) {
            for (const [key, value] of costTable) {
                const userValue = this.owner?.get(key)
                if (userValue === undefined) {
                    costCheck = false
                    break
                }

                // 数值类型需要大于等于
                if (numberp(value)) {
                    if (numberp(userValue) && userValue < value) {
                        costCheck = false
                        break
                    }
                }
                // 字符串和布尔值需要相等
                else if (value !== userValue) {
                    costCheck = false
                    break
                }
            }
        }

        // 所有条件都要满足
        return tpCheck && costCheck && this._available()
    }

    /** 基础 MP TP消耗 */
    public cost() {
        // TP消耗
        const tp = this.get<number>(SKILL.TP)!
        this.owner?.alter(RPG_TPGame.Att.TP, -tp)

        // 消耗表消耗
        const costTable = this.tables.get(SKILL_ATTR.COST)
        if (costTable) {
            for (const [key, value] of costTable) {
                if (numberp(value)) {
                    const userValue = this.owner?.get<number>(key)!
                    this.owner?.set(key, userValue - value)
                }
            }
        }

        // 自定义消耗
        this._cost()
    }


    /** 使用技能
     * @param roles 所有角色
     * 1. 获取目标并使用技能
     * 2. 消耗资源
     * 3. 获取资源
     */
    private msg: Array<Msg> = [];
    public use(roles: Array<Role>): Array<Msg> {
        this.msg = [new Msg_SkillCast(this.owner!, this)];
        this.cost()
        this.msg.push(...this._use(this.target(roles)))
        this.gain()
        return this.msg
    }

    /** 私有方法：获取资源 */
    private gain() {
        const resourceTable = this.tables.get(SKILL_ATTR.RESOURCE)
        if (resourceTable) {
            for (const [key, value] of resourceTable) {
                if (numberp(value)) {
                    const userValue = this.owner?.get<number>(key) ?? 0
                    this.owner?.set(key, userValue + value)
                }
            }
        }
    }

    /** 获取技能属性 */
    public get<T extends ValueType>(name: string): T | undefined {
        // 返回第一个捕获的属性
        for (const am of this.tables.values()) {
            if (am.has(name)) {
                return am.get<T>(name)
            }
        }
        return undefined
    }

    /** 设置技能属性 */
    public set(key: string, value: ValueType) {
        // 设置第一个捕获的属性     
        for (const table of this.tables.values()) {
            if (table.has(key)) {
                table.set(key, value)
            }
        }
    }
    /** 子类实现 自定义消耗 */
    abstract _cost(): any;
    /** 子类实现 消耗确认 */
    abstract _available(): boolean;
    /** 使用技能 */
    abstract _use(role: Array<Role>): Array<any>;
    /** 计算攻击力，返回一个number */
    abstract _calcAttack(): number;
    /** 计算防御力，返回一个number 大于0 小于1 */
    abstract _calcDefense(target: Role): number;
}

// 技能释放信息
class Msg_SkillCast extends Msg {
    public data: {
        readonly caster: Readonly<Role>;
        readonly skill: Readonly<Skill>;
    } | undefined;

    constructor(caster: Role, skill: Skill) {
        super();
        this.data = {
            caster: caster,
            skill: skill
        }
    }

    formatText(): string {
        if (!this.data) return '未知技能释放';
        const casterName = this.data.caster.name || '未知';
        const skillName = this.data.skill.name || '未知技能';
        return `${casterName} 使用了 ${skillName}`;
    }
}
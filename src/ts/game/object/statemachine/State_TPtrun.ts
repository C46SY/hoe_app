// CORE
import { Table } from "core/object/table";
import { GuidGenerator, Cards } from "core/object/tools";
import { Msg } from "core/object/message";
import { State, StateMachine } from "core/object/StateMachine";

// GAME
import { Role } from "game/object/card/role";
import { RPG_TPGame } from "game/object/table/RPG_TPGame"

/** 回合制状态 */
class State_TPtrun {
    /** 初始化 */
    static INIT = "INIT"
    /** 检测Card就绪 */
    static CHECK = "CHECK"
    /** 时间流逝 */
    static TIME = "TIME"
    /** Card决策 全AI托管 */
    static ACTION = "ACTION"
    /** 效果结算 */
    static DEAL = "DEAL"
    /** 胜利结算 */
    static WIN = "WIN"
    /** 失败结算 */
    static LOSE = "LOSE"
    /** 结束 */
    static END = "END"
}

/** 回合制棋盘 */
export class TPtrun_Board extends StateMachine {
    /** 状态数据 */
    data: Role[]

    init(): void {
        // 初始化
    }

    constructor() {
        super()
        // 组装状态机
        this.setInitState(new State_TPtrun_INIT())
        this.addState(new State_TPtrun_CHECK())
        this.addState(new State_TPtrun_TIME())
        this.addState(new State_TPtrun_ACTION())
        this.addState(new State_TPtrun_DEAL())
        this.addState(new State_TPtrun_WIN())
        this.addState(new State_TPtrun_LOSE())
        this.addState(new State_TPtrun_END())

        // 初始化
        this.data = []

        // 设置默认coolDown为0（无延迟）
        this.coolDown = 20
    }

    /** 添加角色 */
    public addRole(role: Role, team: Team) {
        // 生成临时guid
        role.guid = GuidGenerator.guid()
        role.addTable(new 战场属性())
        role.set('阵营', team)
        this.data?.push(role)
    }


    public toString(keys: Array<string>): string {
        let rs = ''
        if (this.data) {
            for (const role of this.data) {
                let vs = '====================\n'
                for (const key of keys) {
                    vs = vs + key + ':' + role.get(key) + '\n'
                }
                rs += vs
            }
            rs += '====================\n'
        }
        return rs
    }
}

/** 回合制棋盘 状态基类 */
abstract class State_TPtrun_Base extends State {
    /** 消息列表，用于接收技能反馈等信息 */
    public msgList: Array<Msg> = []
    enter(): void { }
    exit(): void { }

    beforeUpdate(): void {
        this.msgList = []
    }
}

/** 回合制棋盘 状态 初始化 */
class State_TPtrun_INIT extends State_TPtrun_Base {
    // 完成说明
    description = '初始化 所有Card'
    // 状态变换
    transitions: [string, string][] = [[State_TPtrun.CHECK, '检测Card就绪']]
    update(): string | undefined {
        if (this.machine?.data) {
            for (const role of this.machine?.data) {
                role.init()
            }
        }
        return State_TPtrun.CHECK
    }
}

/** 回合制棋盘 状态 结束 */
class State_TPtrun_END extends State_TPtrun_Base {
    // 完成说明
    description = '初始化 所有Card'
    // 状态变换
    transitions: [string, string][] = []
    update(): string | undefined {
        return undefined
    }
}

/** 回合制棋盘 状态 检测Card就绪 */
class State_TPtrun_CHECK extends State_TPtrun_Base {
    // 完成说明
    description = '检测Card就绪'
    // 状态变换
    transitions: [string, string][] = [
        [State_TPtrun.ACTION, '有Role可行动'],
        [State_TPtrun.TIME, '没有Role可行动']
    ]
    update(): string | undefined {
        // 获取可行动的角色
        const roles = Cards.Select(this.machine?.data, 'ACTION', true)
        if (roles.length >= 1) {
            return State_TPtrun.ACTION
        } else {
            return State_TPtrun.TIME
        }
    }
}

/** 回合制棋盘 状态 时间流逝 */
class State_TPtrun_TIME extends State_TPtrun_Base {
    // 完成说明
    description = '时间流逝'
    // 状态变换
    transitions: [string, string][] = [[State_TPtrun.DEAL, 'Role TP增长后']]
    update(): string | undefined {
        // 获取可行动的角色
        let roles = Cards.Select<Role>(this.machine?.data, 'ALIVE', true)
        // 处理状态
        for (const role of roles) {
            const statusResult = role.TriggerStatus(this.machine?.data!, 50)
            if (statusResult && statusResult instanceof Array) {
                this.msgList.push(...statusResult)
            } else if (statusResult) {
                this.msgList.push(statusResult)
            }
        }
        // 重新获取可行动的角色
        roles = Cards.Select(this.machine?.data, 'ALIVE', true)
        // TP增长
        for (const role of roles) {
            const tp = role.get<number>(RPG_TPGame.Att.TP)! + role.get<number>(RPG_TPGame.Att.SP)!
            role.set(RPG_TPGame.Att.TP, tp)
        }
        return State_TPtrun.DEAL
    }
}

/** 回合制棋盘 状态 Card决策 */
class State_TPtrun_ACTION extends State_TPtrun_Base {
    // 完成说明
    description = 'Role 行动'
    // 状态变换
    transitions: [string, string][] = [[State_TPtrun.DEAL, 'Role 行动后']]
    update(): string | undefined {
        // 获取可行动的角色并执行技能
        const roles = Cards.Select<Role>(this.machine?.data, 'ACTION', true)
        if (this.machine?.data && roles.length > 0) {
            const skillResult = roles[0].TriggerSkill(this.machine?.data)
            if (skillResult && skillResult instanceof Array) {
                this.msgList.push(...skillResult)
            } else if (skillResult) {
                this.msgList.push(skillResult)
            }
        }
        return State_TPtrun.DEAL
    }
}

/** 回合制棋盘 状态 效果结算 */
class State_TPtrun_DEAL extends State_TPtrun_Base {
    // 完成说明
    description = '结算'
    // 状态变换
    transitions: [string, string][] = [
        [State_TPtrun.WIN, '红队全灭'],
        [State_TPtrun.LOSE, '蓝队全灭'],
        [State_TPtrun.CHECK, '未分胜负']
    ]
    update(): string | undefined {
        // 区分队伍
        let red_roles = Cards.Select(this.machine?.data, '阵营', Team.red)
        let blue_roles = Cards.Select(this.machine?.data, '阵营', Team.blue)
        // 检查存活人数
        let red_length = Cards.Select(red_roles, 'ALIVE', true).length
        let blue_length = Cards.Select(blue_roles, 'ALIVE', true).length
        // 状态判断
        if (red_length == 0) {
            return State_TPtrun.WIN
        }
        if (blue_length == 0) {
            return State_TPtrun.LOSE
        }
        return State_TPtrun.CHECK
    }
}

/** 回合制棋盘 状态 胜利 */
class State_TPtrun_WIN extends State_TPtrun_Base {
    // 完成说明
    description = '胜利'
    // 状态变换
    transitions: [string, string][] = [[State_TPtrun.END, '状态机结束']]
    update(): string | undefined {
        console.log('Win')
        return State_TPtrun.END
    }
}

class State_TPtrun_LOSE extends State_TPtrun_Base {
    // 完成说明
    description = '失败'
    // 状态变换
    transitions: [string, string][] = [[State_TPtrun.END, '状态机结束']]
    update(): string | undefined {
        console.log('Lose')
        return State_TPtrun.END
    }
}

enum Team {
    red = 0,
    blue = 1,
    yellow = 2
}

class 战场属性 extends Table {
    sole: boolean = true
    name: string = '战场属性'
    version: string = '1.0'

    constructor() {
        super()
        this.add('阵营', 0)
    }

    // 🚀 重写getDefaultConstructorArgs提供默认参数
    protected getDefaultConstructorArgs(): any[] {
        return []; // 战场属性无参构造
    }

    // 🚀 不再需要实现createInstance方法！

    public limit() { }
}
import { Msg } from "core/object/message";
/**
 * 状态基类
 * @template T 状态机数据类型
 * @template S 状态机类型
 */
abstract class State {
    public type: string = ""
    /** 关联的状态机实例 */
    machine: StateMachine | undefined = undefined;

    /** 状态说明文档 */
    public description: string = '';

    /** 状态转换描述：[目标状态, 条件描述]的数组，用于UI显示 */
    public transitions: [string, string][] = [];

    /** 进入状态时调用 */
    abstract enter(): void;

    /** 退出状态时调用 */
    abstract exit(): void;

    /** 状态更新逻辑，返回下一个状态名或undefined表示保持当前状态 */
    abstract update(): string | undefined;

    /**
     * 每次update前调用，用于重置状态数据
     */
    abstract beforeUpdate(): void;

    /**
     * 绑定状态机实例
     * @param machine 状态机实例
     */
    bind(machine: StateMachine): void {
        this.machine = machine;
    }
}



/**
 * 泛型状态机基类
 */
abstract class StateMachine {
    /** 状态机名称 */
    name: string = '未命名状态机';

    /** 状态说明文档 */
    description: string = '';

    /** 状态机共享数据，由子类实现 */
    data: any;

    /** 更新间隔时间（毫秒），0表示使用requestAnimationFrame */
    coolDown: number = 0;

    /** 初始激活的状态 */
    initState: State | null = null

    /** 当前激活的状态 */
    currentState: State | null = null;

    /** 状态机信息 */
    info: Msg[] = []

    /** 状态注册表：状态名 -> 状态实例 */
    private states: Map<string, State>;

    /**
     * 构造状态机
     * @param initialState 初始状态名
     * @param states 状态映射表
     */
    constructor() {
        this.states = new Map();
    }

    setInitState(state: State) {
        this.addState(state)
        this.initState = state
        this.currentState = state
    }

    // 添加状态
    addState(state: State) {
        this.states.set(state.type, state)
    }

    /**
     * 初始化状态机，在子类构造完成后调用
     */
    initialize(): void {
        if (this.currentState) {
            this.currentState.enter();
        }
    }

    /**
     * 状态转换
     * @param state 目标状态名
     */
    transitionTo(state: string): void {

        // 1. 退出当前状态
        if (this.currentState) {
            this.currentState.exit();
        }

        // 2. 切换到新状态
        const newState = this.states.get(state);
        if (!newState) {
            throw new Error(`State "${state}" not found in state machine`);
        }
        this.currentState = newState;

        // 3. 进入新状态
        this.currentState.enter();
    }


    /**
     * 状态机主更新循环
     * 执行当前状态的update，处理状态转换
     */
    update(): Msg[] {
        this.info = []

        if (!this.currentState) {
            this.info.push(new Msg(false, "状态机未初始化"))
            return this.info
        }

        // 1. 每次更新前的预处理
        this.currentState.beforeUpdate();

        // 2. 执行当前状态的更新逻辑
        const nextState = this.currentState.update();

        // 3. 如果需要状态转换，执行转换
        if (nextState) {
            this.transitionTo(nextState);
        }
        
        return this.info
    }

    abstract init(): void
}

//===============================================================
// 示例状态机
//===============================================================

// 状态类型
enum StateType {
    SA = "SA",
    SB = "SB",
    SC = "SC"
}

/** 回合制棋盘 状态基类 */
abstract class State_Base extends State {
    enter(): void {
        console.log(`[${this.type}] - enter`)
    }
    exit(): void {
        // console.log(`[${this.type}] - exit`)
    }
    beforeUpdate(): void {
        // console.log(`[${this.type}] - beforeUpdate`)
    }
}

class State_A extends State_Base {
    type = StateType.SA
    description: string = "状态A运行"
    transitions: [string, string][] = [
        ['SB', '30%直接跳转SB'],
        ['SC', '70%直接跳转SC'],
        ['T1', '测试'],
        ['T2', '测试']];
    update(): string | undefined {
        const r = Math.random()
        if (r < 0.3) return StateType.SB
        return StateType.SC
    }
}

class State_B extends State_Base {
    type = StateType.SB
    description: string = "状态B运行"
    transitions: [string, string][] = [['SA', '直接跳转SA']];
    update(): string | undefined {
        return StateType.SA
    }
}

class State_C extends State_Base {
    type = StateType.SC
    description: string = "状态C运行"
    transitions: [string, string][] = [['SA', '直接跳转SA']];
    update(): string | undefined {
        return StateType.SA
    }
}


class BaseStateMachine extends StateMachine {
    init(): void {
        this.currentState = this.initState
    }
    name: string = "示例状态机"
    description: string = '标准状态机测试'
    constructor() {
        super();
        this.setInitState(new State_A())
        this.addState(new State_B())
        this.addState(new State_C())
    }
}

// 导出主要类
export { StateMachine, State, BaseStateMachine };

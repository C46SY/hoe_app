/** 数值类型 */
export type ValueType = number | boolean | string;

// --------------------------------------------------------
// 序列化工具
// --------------------------------------------------------
/** 序列化工具 */
export abstract class DataType {
    private static registry: Map<string, Function> = new Map();

    static register(typeClass: Function): void {
        if (!this.registry.has(typeClass.name)) {
            this.registry.set(typeClass.name, typeClass);
        }
    }

    // 子类必须实现
    // static fromData(_data: any): any;
    abstract toData(): any;

    type: string = '';
    version: string = '1.0';

    /** 序列化准备 */
    public initType(): void {
        this.type = this.constructor.name;
        DataType.register(this.constructor);
    }

    public static getType(name: string): Function | undefined {
        return this.registry.get(name);
    }


}


// --------------------------------------------------------
// GUID生成
// --------------------------------------------------------
export type GUID = string | undefined;
export class GuidGenerator {
    private static counter = 0;
    private static lastTime = 0;

    static guid(): string {
        const now = Date.now();
        
        // 时间戳部分（毫秒，36进制）
        const timestamp = now.toString(36);
        
        // 计数器处理（确保同一毫秒内的唯一性）
        if (now === this.lastTime) {
            this.counter = (this.counter + 1) % 46656; // 36^3 = 46656
        } else {
            this.counter = 0;
            this.lastTime = now;
        }
        
        // 计数器部分（固定3位36进制）
        const counter = this.counter.toString(36).padStart(3, '0');
        
        // 随机部分（4位36进制）
        const random = Math.floor(Math.random() * 1679616) // 36^4 = 1,679,616
                        .toString(36)
                        .padStart(4, '0');
        
        return `${timestamp}${counter}${random}`;
    }
}

// --------------------------------------------------------
// 日志
// --------------------------------------------------------
const STSTEM_DEBUG_TYPE: boolean = true

export function Debug(msg: string) {
    if (STSTEM_DEBUG_TYPE) {
        console.log(msg)
    } else {
        throw new Error(msg)
    }
}
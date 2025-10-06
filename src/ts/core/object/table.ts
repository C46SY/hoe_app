import { Debug } from 'core/object/utils';
import { DataType, ValueType } from 'core/object/utils';

/** 表格TABLE */
export class Table extends DataType implements Iterable<[string, ValueType]> {
    // ================================================
    // 序列化
    // ================================================
    /** 从数据重建对象 */
    public static fromData(data: any): Table {
        const constructor = DataType.getType(data.type);
        if (!constructor) {
            throw new Error(`Unknown table type: ${data.type}`);
        }
        const instance = new (constructor as any)();
        Object.assign(instance, data);
        instance.map = new Map(Object.entries(data.map));
        return instance;
    }
    /** 转换为数据 */
    toData(): any {
        const data: any = {};
        // 复制所有可枚举的自有属性
        for (const key in this) {
            if (this.hasOwnProperty(key) && !(this[key] instanceof Map)) {
                data[key] = this[key];
            }
        }
        // 转换Map为普通对象
        data.map = Object.fromEntries(this.map);
        return data;
    }
    // ================================================
    // 属性
    // ================================================
    /** 表格类型 */
    type: string = '';
    /** 表格版本 */
    version: string = '1.0';
    /** 表格名称 */
    name: string = '';
    /** 表格描述 */
    description: string = '';
    /** 是否唯一 */
    sole: boolean = false;
    /** 属性集合 */
    private map: Map<string, ValueType>;
    /** 构造函数 */
    constructor() {
        super();
        this.initType()
        this.map = new Map();
    }


    // ================================================
    // map操作
    // ================================================
    /** map迭代器 */
    [Symbol.iterator](): Iterator<[string, ValueType], any, any> {
        return this.map.entries();
    }
    /** 添加属性 */
    add(key: string, value: ValueType): void {
        if (this.map.has(key)) {
            Debug(`[${this.name}] 中 ${key} 已经存在`);
        } else {
            // 属性无法重复添加
            this.map.set(key, value);
        }
    }
    /** 获取属性 */
    public get<T>(key: string): T {
        return this.map.get(key) as T;
    }
    /** 修改属性 */
    public set(key: string, value: ValueType): boolean {
        if (this.map.has(key)) {
            this.map.set(key, value);
            this.limit(key, value);
            return true;
        } else {
            Debug(`[${this.name}] 中 ${key} 不存在`);
            return false;
        }
    }
    /** 修改属性 */
    public alter(key: string, value: number): void {
        console.log('alter',value)
        if (this.map.has(key)) {
            const currentValue = this.get<number>(key);
            this.set(key, currentValue + value);
        } else {
            this.set(key, value);
        }
    }
    /** 判断是否存在属性 */
    public has(key: string): boolean {
        return this.map.has(key);
    }

    /** table 键位 弃用 */
    public keys(): IterableIterator<string> {
        return this.map.keys();
    }

    // ================================================
    // 序列化
    // ================================================
    /** COPY */
    public copy(): this {
        const constructor = this.constructor as new () => this;
        const copy = new constructor();
        // 复制所有属性
        Object.assign(copy, this);
        // 重新创建map（因为Map是引用类型）
        copy.map = new Map(this.map);
        return copy;
    }

    /** 属性限制及联动逻辑 可继承 */
    limit(_key: string, _value: ValueType): void { }
}


/** 空表格 */
export class EmptyTable extends Table {
    constructor() {
        super();
        this.name = '空表格';
        this.version = '0';
        this.description = '空白表格';
        this.sole = false;
    }

    limit(_key: string, _value: ValueType): void {
        // 空表格不需要任何限制逻辑
    }
}

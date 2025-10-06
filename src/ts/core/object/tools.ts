import { ValueType } from 'core/object/utils';
import { Card } from 'core/object/card'
// --------------------------------------------------------
// 属性类型
// --------------------------------------------------------
/** 属性类型 */
export function numberp(value: any): value is number {
    return typeof value === "number";
}

export function booleanp(value: any): value is boolean {
    return typeof value === "boolean";
}

export function stringp(value: any): value is string {
    return typeof value === "string";
}

// --------------------------------------------------------
// 等待时间
// --------------------------------------------------------
export function Delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// --------------------------------------------------------
// 卡片工具类 (原cards.ts内容)
// --------------------------------------------------------

/**
 * 卡片集合操作工具类
 * 
 * 提供强大的卡片筛选、随机选择、条件过滤等功能。
 * 所有方法都是静态的，可以直接调用。
 */
export class Cards {
    /**
     * 随机选择指定数量的卡片
     * 使用优化的Fisher-Yates算法，性能良好
     * 
     * @param gameObjects 卡片数组
     * @param n 选择数量，默认为1
     * @returns 随机选择的卡片数组
     */
    public static Random<T>(gameObjects: Array<T>, n: number = 1): Array<T> {
        // 边界检查
        if (!gameObjects || gameObjects.length === 0) return [];
        if (n <= 0) return [];
        if (n >= gameObjects.length) return [...gameObjects];

        // 使用优化的Fisher-Yates算法，只洗牌前n个位置
        const indices = Array.from({ length: gameObjects.length }, (_, i) => i);

        // 部分洗牌：只洗牌前n个位置，避免洗牌整个数组
        for (let i = 0; i < n; i++) {
            // 在剩余未洗牌的元素中随机选择一个
            const j = Math.floor(Math.random() * (gameObjects.length - i)) + i;
            // 交换当前位置与随机选择的位置
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        // 只取前n个元素，直接映射到对应的游戏对象
        return indices.slice(0, n).map(index => gameObjects[index]);
    }

    /**
     * 私有筛选方法
     * @param gameObjects 卡片数组
     * @param callback 筛选回调函数
     * @returns 筛选结果
     */
    private static _select<T extends Card>(gameObjects: Array<T>, callback: (go: T) => boolean): Array<T> {
        return gameObjects.filter(callback);
    }

    /**
     * 私有排除方法
     * @param gameObjects 卡片数组
     * @param callback 排除回调函数
     * @returns 排除结果
     */
    private static _remove<T extends Card>(gameObjects: Array<T>, callback: (go: T) => boolean): Array<T> {
        return gameObjects.filter(go => !callback(go));
    }

    // 重载签名
    public static Select<T extends Card>(gameObjects: Array<T> | undefined, key: string, value: ValueType): Array<T>;
    public static Select<T extends Card>(gameObjects: Map<string, T | undefined> | undefined, key: string, value: ValueType): Array<T>;

    /**
     * 根据属性值筛选卡片
     * 支持数组和Map两种输入类型
     * 
     * @param gameObjects 卡片集合（数组或Map）
     * @param key 属性键
     * @param value 属性值
     * @returns 符合条件的卡片数组
     */
    public static Select<T extends Card>(
        gameObjects: Array<T> | Map<string, T> | undefined,
        key: string,
        value: ValueType
    ): Array<T> {
        if (!gameObjects) return [];

        const items = Array.isArray(gameObjects)
            ? gameObjects
            : Array.from(gameObjects.values());

        return Cards._select<T>(items, (go: T) => go.get(key) === value);
    }

    /**
     * 排除具有指定属性值的卡片
     * @param gameObjects 卡片数组
     * @param key 属性键
     * @param value 属性值
     * @returns 不符合条件的卡片数组
     */
    public static Remove<T extends Card>(gameObjects: Array<T>, key: string, value: ValueType): Array<T> {
        return Cards._remove<T>(gameObjects, (go: T) => go.get(key) === value);
    }
}

// --------------------------------------------------------
// CardView 管理器
// --------------------------------------------------------

/** CardView窗口数据接口 */
interface CardViewData {
    id: string;
    card: any;
    title?: string;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
}

/** CardView事件管理器 */
export class CardViewManager {
    private static eventTarget = new EventTarget();
    private static windowCounter = 0;

    /**
     * 显示CardView窗口
     * @param card Card对象
     * @param options 窗口选项
     */
    static showCard(card: any, options?: {
        title?: string;
        width?: number;
        height?: number;
        x?: number;
        y?: number;
    }) {
        // 生成唯一窗口ID
        const windowId = `cardview_${++this.windowCounter}_${Date.now()}`;

        // 计算窗口位置偏移，避免重叠
        const baseX = options?.x || 300;
        const baseY = options?.y || 200;
        const offset = (this.windowCounter - 1) * 30; // 每个新窗口偏移30px

        const cardViewData: CardViewData = {
            id: windowId,
            card,
            title: options?.title || card?.get('name') || '卡片详情',
            width: options?.width || 550,
            height: options?.height || 400,
            x: baseX + offset,
            y: baseY + offset
        };

        // 派发自定义事件
        const event = new CustomEvent('showCardView', {
            detail: cardViewData
        });

        this.eventTarget.dispatchEvent(event);

        console.log('🃏 新CardView窗口创建:', cardViewData);
    }

    /**
     * 关闭CardView窗口
     * @param windowId 窗口ID
     */
    static closeCard(windowId: string) {
        const event = new CustomEvent('closeCardView', {
            detail: { id: windowId }
        });

        this.eventTarget.dispatchEvent(event);

        console.log('🔒 CardView窗口关闭:', windowId);
    }

    /**
     * 监听CardView显示事件
     * @param callback 回调函数
     */
    static onShowCard(callback: (data: CardViewData) => void) {
        this.eventTarget.addEventListener('showCardView', (event: any) => {
            callback(event.detail);
        });
    }

    /**
     * 监听CardView关闭事件
     * @param callback 回调函数
     */
    static onCloseCard(callback: (data: { id: string }) => void) {
        this.eventTarget.addEventListener('closeCardView', (event: any) => {
            callback(event.detail);
        });
    }

    /**
     * 移除CardView事件监听
     * @param callback 回调函数
     */
    static offShowCard(callback: (data: CardViewData) => void) {
        this.eventTarget.removeEventListener('showCardView', callback as any);
    }

    static offCloseCard(callback: (data: { id: string }) => void) {
        this.eventTarget.removeEventListener('closeCardView', callback as any);
    }
}

// 全局函数：显示卡片
export function showCard(card: any, options?: {
    title?: string;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
}) {
    CardViewManager.showCard(card, options);
}

// --------------------------------------------------------
// 消息管理器
// --------------------------------------------------------

/** 消息数据接口 */
interface MessageData {
    text: string;
    type: 'info' | 'success' | 'warning' | 'error';
    duration: number;
}

/** 消息管理器 */
export class MessageManager {
    private static eventTarget = new EventTarget();

    /**
     * 显示消息
     * @param text 消息文本
     * @param type 消息类型
     * @param duration 显示时长(ms)，实际统一使用3秒
     */
    static showMessage(text: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', duration: number = 3000) {
        const messageData: MessageData = {
            text,
            type,
            duration
        };

        // 派发自定义事件
        const event = new CustomEvent('showMessage', {
            detail: messageData
        });

        this.eventTarget.dispatchEvent(event);

        console.log('💬 显示消息:', messageData);
    }

    /**
     * 监听消息事件
     * @param callback 回调函数
     */
    static onShowMessage(callback: (data: MessageData) => void) {
        this.eventTarget.addEventListener('showMessage', (event: any) => {
            callback(event.detail);
        });
    }

    /**
     * 移除消息事件监听
     * @param callback 回调函数
     */
    static offShowMessage(callback: (data: MessageData) => void) {
        this.eventTarget.removeEventListener('showMessage', callback as any);
    }
}

// 全局函数：显示消息（统一3秒自动消失）
export function showMessage(text: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', duration: number = 3000) {
    MessageManager.showMessage(text, type, duration);
}


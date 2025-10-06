// ========================================================================
// HOE Message - 通用信息基类系统
// 用于各种游戏信息的统一管理和格式化
// ========================================================================

/** 通用信息基类 */
export class Msg {
    success: boolean
    text: string
    constructor(success: boolean = true, text: string = "") {
        this.text = text
        this.success = success
    }
    /** 获取格式化文本 */
    formatText(): string {
        return `[${this.success}]: ${this.text}`
    }
}
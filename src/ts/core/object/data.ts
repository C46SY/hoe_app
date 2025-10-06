import { File } from "core/data/File";
import { Card } from "core/object/card";
import { GuidGenerator, GUID } from "core/object/utils";

/** 数据中心 */
class Data {
    /** 配置 */
    config: any = {};
    /** 临时数据 */
    tempData: Map<string, Card> = new Map<string, Card>();
    /** 保存数据 */
    saveData: Map<string, Card> = new Map<string, Card>();

    async init(): Promise<void> {
        // 检查是否存在save文件夹
        // 如果不存在则创建
        const rs = await File.folderExists("save");
        if (!rs) {
            await File.createFolder("save");
        }
    }

    /** 重置 */
    reset(): void {
        this.tempData.clear();
        this.saveData.clear();
    }

    /** 添加 */
    add(card: Card): void {
        card.guid = GuidGenerator.guid();
        // 添加到临时数据
        this.tempData.set(card.guid, card);
    }
    /** 获取 */
    get(guid: GUID): Card | undefined {
        // 从temp和save中获取
        let card = this.tempData.get(guid!);
        if (!card) {
            card = this.saveData.get(guid!);
        }
        return card;
    }
    /** 移除 */
    remove(card: Card): void {
        this.tempData.delete(card.guid!);
        this.saveData.delete(card.guid!);
    }

    has(card: Card): boolean {
        // 从temp和save中获取
        let rs = this.tempData.has(card.guid!);
        if (!rs) {
            rs = this.saveData.has(card.guid!);
        }
        return rs
    }
    //========================================
    // 配置存储
    //========================================
    async loadConfig(): Promise<void> { };
    async saveConfig(): Promise<void> { };
    //========================================
    // 数据存储
    //========================================
    async load(_id: number): Promise<void> {
        const filename = `save/save_${_id.toString().padStart(2, '0')}.json`;

        // 检查文件是否存在
        const fileExists = await File.fileExists(filename);
        if (!fileExists) {
            console.warn(`保存文件 ${filename} 不存在`);
            return;
        }

        // 读取文件内容
        const fileContent = await File.readFile(filename);
        if (!fileContent.trim()) {
            console.warn(`保存文件 ${filename} 为空`);
            return;
        }

        this.reset();

        // 解析JSON数据
        const cardsData = JSON.parse(fileContent);

        // 重建Card对象
        for (const [guid, cardData] of Object.entries(cardsData)) {
            try {
                // 使用Card的fromData方法重建对象
                const card = Card.fromData(cardData);
                card.guid = guid; // 恢复GUID
                this.saveData.set(guid, card);
            } catch (error) {
                console.error(`重建卡片失败 (GUID: ${guid}):`, error);
            }
        }
    };
    async save(_id: number): Promise<void> {
        this.guidComplete();
        const filename = `save/save_${_id.toString().padStart(2, '0')}.json`;
        const cardsData: any = {};
        for (const [guid, card] of this.saveData.entries()) {
            // 卡片数据
            cardsData[guid] = card.toData();
        }
        // 序列化为JSON
        const data = JSON.stringify(cardsData, null, 2);
        await File.writeFile(filename, data);
    }

    /** 转移临时数据到保存数据 */
    saveCard(card: Card): void {
        // 检查card是否在tempData中，若是，移动到saveData
        if (this.tempData.has(card.guid!)) {
            this.tempData.delete(card.guid!);
            this.saveData.set(card.guid!, card);
        }
    }

    /** guid完备检查 */
    guidComplete(): void {
        // 检查saveDATA中每一个Card得keyslot,boxslot记录得guid是否都在saveData中
        for (const [_guid, card] of this.saveData.entries()) {
            for (const [_name, slot] of card.keyslots) {
                for (const guid of slot.list) {
                    if (guid && !this.saveData.has(guid)) {
                        // 从temp 转移到 save
                        this.saveData.set(guid, this.get(guid)!);
                        this.tempData.delete(guid);
                    }
                }
            }
            for (const [_name, slot] of card.boxslots) {
                for (const guid of slot.list) {
                    if (guid && !this.saveData.has(guid)) {
                        this.saveData.set(guid, this.get(guid)!);
                        this.tempData.delete(guid);
                    }
                }
            }
        }
    }
}

export const GAME = new Data();

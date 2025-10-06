import { defineStore } from 'pinia'
import type { IStateMiniMenu, IMiniMenu } from '../storeType'

interface IState extends IStateMiniMenu {}
/** TestTable接口 */
interface IStore extends IState, IMiniMenu {}


export const storeSaveData = defineStore('storeSaveData', {
    state: (): IState => ({
        menuItems: ['保存', '读取','删除'],
        select: 0
    }),
    actions: {
        // IMiniMenu接口方法
        clickItem(item: string) {
            console.log(`slect:${this.select},item:${item}`)
        }
    } as IStore
})
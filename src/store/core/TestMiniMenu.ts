import { defineStore } from 'pinia'
import type { IStateMiniMenu, IMiniMenu } from '../storeType'

interface IState extends IStateMiniMenu {
}
/** TestTable接口 */
interface IStore extends IState, IMiniMenu { }


export const useTestMiniMenu = defineStore('TestMiniMenu', {
    state: (): IState => ({
        menuItems: ['装备', '强化', '卸载'],
        select: ''
    }),
    actions: {
        // IMiniMenu接口方法
        clickItem(item: string) {
            console.log(`slect:${this.select},item:${item}`)
        }
    } as IStore
})
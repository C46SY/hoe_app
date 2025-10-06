import { defineStore } from 'pinia'
import { EmptyTable } from 'core/object/table'
import type { IStateTable, ITable } from '../storeType'

/** TestTable接口 */
interface ITestTable {
  /** 重置table */
  resetTable(): void
  /** 添加属性 */
  addItem(): void
  /** 修改属性 */
  setItem(): void
}

const att = ['力量','敏捷','智力']
let attid = 0

export const useTestTableStore = defineStore('TestTable', {
  state: (): IStateTable => ({
    table: new EmptyTable()
  }),
  actions: {
    // ITestTable接口方法
    resetTable() {
      this.table = new EmptyTable()
    },
    addItem() {
      this.table!.add(att[attid], Math.floor(Math.random() * 100))
      attid += 1
      if (attid == att.length) attid = 0
      this.table = this.table!.copy()
    },
    setItem() {
      for(const [key, _value] of this.table!) {
        this.table!.set(key, Math.floor(Math.random() * 100))
      }
      this.table = this.table!.copy()
    }
  } as ITable & ITestTable
})
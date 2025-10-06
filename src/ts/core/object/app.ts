import type { Ref } from 'vue'
import { ref, markRaw, reactive } from 'vue';

// Frame 的 option 的属性
export class FrameOptions {
  left: number
  top: number
  zIndex: number

  constructor() {
    this.left = 0
    this.top = 0
    this.zIndex = 1000
  }
}

export interface FrameProps {
  title?: string
  data?: any
  frame: Frame
}

/**
 * FrameManager类 - 管理所有Frame实例
 */
class FrameManager {
  private static instance: FrameManager
  private frames: Ref<Frame[]>
  public frameCounter: number = 0
  private readonly baseZIndex: number = 1000  // 基础z-index值
  private readonly zIndexStep: number = 10    // z-index间隔

  constructor() {
    this.frames = ref<Frame[]>([])
  }

  // 获取单例实例
  public static getInstance(): FrameManager {
    if (!FrameManager.instance) {
      FrameManager.instance = new FrameManager()
    }
    return FrameManager.instance
  }

  // 获取新的顶层z-index
  public getTopZIndex(): number {
    // 找到当前最高的z-index
    const maxZIndex = Math.max(
      this.baseZIndex,
      ...this.frames.value.map(frame => frame.options.zIndex)
    )
    // 返回比当前最高值大一个步进的值
    return maxZIndex + this.zIndexStep
  }

  // 重新排序所有窗口的z-index
  private reorderZIndices(): void {
    // 按z-index从小到大排序
    const sortedFrames = [...this.frames.value].sort(
      (a, b) => a.options.zIndex - b.options.zIndex
    )

    // 重新分配z-index，确保间隔一致
    sortedFrames.forEach((frame, index) => {
      frame.options.zIndex = this.baseZIndex + (index * this.zIndexStep)
    })
  }

  // 将指定Frame移到最顶层
  public bringFrameToFront(frameId: string): void {
    const frame = this.getFrameById(frameId)
    if (frame) {
      // 获取新的最高z-index
      const newTopZIndex = this.getTopZIndex()

      // 如果z-index差距过大，重新排序所有窗口
      if (newTopZIndex - this.baseZIndex > this.zIndexStep * 100) {
        this.reorderZIndices()
        frame.options.zIndex = this.getTopZIndex()
      } else {
        frame.options.zIndex = newTopZIndex
      }
    }
  }

  // 创建新的Frame
  public createFrame(title: string, component: any, dataObject?: any,): Frame {
    const frame = new Frame(component, dataObject)
    frame.props.title = title
    // 添加到管理器中
    this.frames.value.push(frame)

    return frame
  }

  public createOnlyFrame(title: string, component: any, dataObject?: any,): Frame | undefined {
    // 检查当前是否包含相同title的Frame
    const existingFrame = this.frames.value.find(frame => frame.props.title === title)
    if (existingFrame) return undefined
    const frame = new Frame(component, dataObject)
    frame.props.title = title
    this.frames.value.push(frame)
    return frame
  }

  // 移除Frame
  public removeFrame(frameId: string): void {
    const index = this.frames.value.findIndex(frame => frame.guid === frameId)
    if (index !== -1) {
      this.frames.value.splice(index, 1)
      // 当窗口数量较多时，移除窗口后重新排序
      if (this.frames.value.length > 10) {
        this.reorderZIndices()
      }
    }
  }

  // 获取所有Frame
  public getFrames(): Ref<Frame[]> {
    return reactive(this.frames)
  }

  // 清除所有Frame
  public clearFrames(): void {
    this.frames.value = []
    this.frameCounter = 0
  }

  // 根据ID获取Frame
  public getFrameById(frameId: string): Frame | undefined {
    return this.frames.value.find(frame => frame.guid === frameId)
  }

  // 获取Frame数量
  public getFrameCount(): number {
    return this.frames.value.length
  }
}

const App = new FrameManager()

export { App }

/**
 * Frame类 - 表示一个窗口框架
 */
export class Frame {
  public readonly guid: string = ''
  public readonly component: any


  public readonly options: FrameOptions
  public readonly props: FrameProps

  constructor(
    component: any,
    dataObject?: any
  ) {
    this.component = markRaw(component);
    // 设置默认属性
    this.options = {
      left: 150,
      top: 150,
      zIndex: 1000
    }
    this.props = {
      title: '',
      data: dataObject,
      frame: this
    }
    this.guid = `frame-${++App.frameCounter}`
  }

  get eventObject() {
    return {
      close: () => this.destroy(),
      move: (x: number, y: number) => this.move(x, y)
    }
  }

  // 移动窗口到指定位置
  public move(x: number, y: number): void {
    this.options.left = x
    this.options.top = y
  }

  // 将窗口置于顶层
  public bringToFront(): void {
    App.bringFrameToFront(this.guid)
  }

  // 销毁Frame
  public destroy(): void {
    App.removeFrame(this.guid)
  }
}









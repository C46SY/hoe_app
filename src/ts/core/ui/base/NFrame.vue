<!-- 可拖动框架 -->

<script lang="ts">
// VUE
import { computed, onUnmounted, useSlots } from 'vue'
// OBJECT
// UI
// STORE
</script>

<template>
    <div class="frame" :style="styleFrame">
        <div class="title-bar" :style="styleTitle" @mousedown="handleMouseDown" @contextmenu="MouseRightClick">
            <!-- 标题 -->
            <div class="title">{{ title }}</div>
        </div>
        <div class='body'>
            <div class="control" v-if="styleControl">
                <slot name="button"></slot>
            </div>
            <div class="area">
                <slot name="ui"></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
//===================================================
// 父组件传入参数
//===================================================
//#region

interface Props {
    title?: string;
    left?: number;
    top?: number;
}
const props = withDefaults(defineProps<Props>(), {
    letf: 100,
    top: 100
})
//#endregion

//===================================================
// 组件响应式样式
//===================================================
// #region

/** 框架样式 */
const styleFrame = computed(() => {
    return {
        left: `${props.left}px`,
        top: `${props.top}px`
    }
})
/** 标题栏样式 */
const styleTitle = computed(() => {
    if (props.title) {
        return { height: 'var(--title-text)' }
    } else {
        return { height: 'var(--title-null)' }
    }
})

const slots = useSlots()
const styleControl = computed(() => {
    // 当#button不存在空间时，返回false
    return !!slots.button
})


// #endregion

//===================================================
// 鼠标事件
//===================================================
//#region

/** 参数 */
let isDragging = false
let dx = 0
let dy = 0
/** 信息类型 */
const emit = defineEmits<{
    close: []
    focus: []
    move: [x: number, y: number]
}>()
/** 右键关闭 */
const MouseRightClick = (event: MouseEvent) => {
    event.preventDefault();
    emit('close'); // 触发事件并传递数据
}
/** 鼠标按下 */
const handleMouseDown = (event: MouseEvent) => {
    emit('focus')
    // 只响应左键
    if (event.button !== 0) return
    // 记录鼠标相对位置
    isDragging = true;
    dx = event.clientX - props.left!;
    dy = event.clientY - props.top!;
    // 开始监听鼠标
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    event.preventDefault();
}
/** 鼠标拖动 */
const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging) return;
    const left = event.clientX - dx;
    const top = event.clientY - dy;
    // 通知父组件更新位置
    emit('move', left, top);
}
/** 结束拖动 */
const handleMouseUp = () => {
    isDragging = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
}

//#endregion

//===================================================
// 组件接口
//===================================================
//#region

/** 组件销毁时 */
onUnmounted(() => {
    // 移除监听器
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
});

//#endregion
</script>

<style scoped>
.frame {
    display: flex;
    position: fixed;
    flex-direction: column;
    /* 背景 */
    border: 2px solid var(--black);
    background: var(--b3);
}

.title-bar {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background: var(--a1);
    padding: 0 16px;
    user-select: none;
    border-bottom: 2px solid var(--black);
}

.title {
    display: flex;
    flex: 1;
    height: 100%;
    width: 100%;
    color: var(--black);
    font-size: 18px;
    font-weight: 350;
    text-align: left;
    align-items: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    pointer-events: none;
}

.body {
    display: flex;
    flex: 1;
    flex-flow: row;
}


.control {
    display: flex;
    height: 100%;
    width: var(--button-width);
    background: var(--a2);
    flex-flow: column;
    padding: 10px;
    gap: 10px;
    border-right: 2px solid var(--black);
}

.area {
    display: flex;
    flex: 1;

    justify-content: center;
    align-items: center;

    height: 100%;
    background: var(--a3);
}

:deep(.control button) {
    width: 100%;
    height: 30px;

    background: var(--a3);

    text-align: center;

    border-radius: 8px;

    font-weight: 400;

    border: 2px solid var(--black);
}

:deep(.control button:active) {
    background: var(--a2);
}
</style>
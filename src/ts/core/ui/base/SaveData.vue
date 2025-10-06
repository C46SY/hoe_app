<!-- 存档管理界面 -->
<script lang="ts">
// VUE
import { toRefs, Ref, ref, onMounted } from 'vue'
// OBJECT
import { App, FrameProps } from 'core/object/app'
import { File } from 'core/data/File'
// UI
import NFrame from 'core/ui/base/NFrame.vue';
import MiniMenu from 'core/ui/base/MiniMenu.vue'
// STORE
import { storeSaveData } from 'store/core/storeSaveData.ts'

</script>


<script setup lang="ts">
// PROPS
const props = withDefaults(defineProps<FrameProps>(), {})
const { options } = toRefs(props.frame!)

class saveData {
    /** id */
    id: number;
    constructor(id: number) {
        this.id = id;
    }
}

// 创建一个10长度得数组
const saveItems: Ref<Array<saveData | undefined>> = ref(new Array(5).fill(0).map((_, _index) => undefined))



async function init() {
    for (let i = 0; i < saveItems.value.length; i++) {
        // 检查文件是否存在
        const filename = `save/save_${i.toString().padStart(2, '0')}.json`
        const rs = await File.fileExists(filename)
        if (rs) {
            saveItems.value[i] = new saveData(i)
        }
    }
}

const miniMenu = storeSaveData()

const handleClick = (event: MouseEvent, item: number) => {
    // 如果右击，打开一个MINIMENU
    const frame = App.createOnlyFrame('MiniMenu', MiniMenu, {
        left: event.clientX,
        top: event.clientY,
        store: miniMenu
    })
    if (frame) miniMenu.select = item
}

onMounted(async () => {
    await init()
})

</script>

<template>
    <NFrame v-on="props.frame!.eventObject" :left="options.left" :top="options.top">
        <template #ui>
            <div class="savedatas">
                <div class="item" v-for="(item, id) in saveItems" :key="id"
                    @click.right="(event) => handleClick(event, id)">
                    <div class="id">{{ id.toString().padStart(2, '0') }}</div>
                    <div class="des" v-if="item">有存档</div>
                    <div class="des" v-else>空存档</div>
                </div>
            </div>
        </template>

    </NFrame>
</template>


<style scoped>
.frame {
    width: var(--width);
    height: var(--height);
}

.save {
    display: flex;
    width: 100%;
    flex-flow: column;
}

.title {
    display: flex;
    width: 100%;
    height: 30px;
    padding: 5px;
    border-bottom: 2px solid var(--black);
}

.title span {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    font-weight: bold;
}

.savedatas {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr;
    /* 单列布局 */
    grid-auto-rows: 80px;
    /* 每行固定高度 */
    width: 100%;
    height: 100%;
    padding: 5px;
    gap: 5px;
    overflow-y: auto;
}

.savedatas::-webkit-scrollbar {
    display: none;
}

.item {
    display: flex;
    width: 100%;
    border: 1px dashed var(--black);
    border-radius: 6px;
    cursor: pointer;
}

.item:hover {
    border-color: #007bff;
}

.des {
    display: flex;
    width: 90%;
    font-size: 0.9em;
    align-items: center;
    justify-content: center;
}

.id {
    display: flex;
    height: 100%;
    width: 10%;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    border-right: 1px dashed var(--black);
}
</style>
<script lang="ts">
// VUE
import { withDefaults, toRefs } from 'vue'
// OBJECT
import { App,FrameProps } from 'core/object/app'
// UI
import NFrame from 'core/ui/base/NFrame.vue';
import MiniMenu from 'core/ui/base/MiniMenu.vue'
// STORE
import { useTestMiniMenu } from 'store/core/TestMiniMenu.ts'
</script>

<script setup lang="ts">
// PROPS
const props = withDefaults(defineProps<FrameProps>(), {})
const { options } = toRefs(props.frame!)

const miniMenu = useTestMiniMenu()

const handleClick = (event: MouseEvent, item: string) => {
    // 如果右击，打开一个MINIMENU
    const frame = App.createOnlyFrame('MiniMenu', MiniMenu, {
        left: event.clientX,
        top: event.clientY,
        store: miniMenu
    })
    if (frame) miniMenu.select = item
}

</script>

<template>
    <NFrame v-on="props.frame!.eventObject" :title="'MiniMenu'" :left="options.left" :top="options.top">
        <template #button>
            <button @click="">当前选择：{{ miniMenu.select }}</button>
        </template>
        <template #ui>
            <div class="click-area" @click.right="(event) => handleClick(event, 'hello world')"></div>
        </template>
    </NFrame>
</template>

<style scoped>
.frame {
  position: fixed;
  width: 800px;
  height: 600px;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
}

.click-area {
    width: 100%;
    height: 100%;
    display: flex;
}

.test-instruction {
    padding: 20px;
    background: var(--b2);
    border: 2px solid var(--black);
    border-radius: 8px;
    cursor: pointer;
}

.test-instruction:hover {
    background: var(--c2);
}
</style>
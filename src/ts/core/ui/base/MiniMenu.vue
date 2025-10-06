<!-- 右击菜单 -->
<script lang="ts">
// VUE
// OBJECT
import { FrameProps } from 'bin/core/object/app';
// UI
import Frame from 'core/ui/base/Frame.vue'
// STORE
import { IMiniMenu } from 'store/storeType'
</script>

<script setup lang="ts">
interface Props extends FrameProps {
    data: { left: number, top: number, store: IMiniMenu }
}
const props = withDefaults(defineProps<Props>(), {})

const handleItemClick = (item: string) => {
    props.data.store?.clickItem(item)
    props.frame!.destroy()
}
</script>

<template>
    <Frame class="mini-menu-frame" :left="data!.left" :top="data!.top">
        <div class="menu-content">
            <div v-for="(item, index) in data.store?.menuItems" :key="index" class="menu-item"
                @click="handleItemClick(item)">
                {{ item }}
            </div>
        </div>
    </Frame>
</template>



<style scoped>
.mini-menu-frame {
    width: 100px;
    border: 1px solid var(--black);
    border-radius: 0px;
}

.menu-content {
    display: grid;
    grid-auto-rows: min-content;
    width: 100%;
    background: var(--a2);
    padding: 2px;
    gap: 2px;
}

.menu-item {
    height: 30px;
    line-height: 30px;
    padding: 0 12px;
    font-size: 14px;
    color: var(--black);
    border: 1px dashed var(--black);
    background: var(--b3);
}

.menu-item:hover {
    background: var(--b2);
}
</style>
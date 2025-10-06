<!-- 可拖动框架 -->
<template>
    <div class="frame" :style="{ left: `${props.left}px`, top: `${props.top}px` }">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
interface Props {
    left: number
    top: number
}
const props = withDefaults(defineProps<Props>(), {
    letf: 0,
    top: 0
})
</script>

<style scoped>
.frame {
    display: flex;
    position: fixed;
    flex-direction: column;
    /* 背景 */
    border: 2px solid var(--black);
    background: var(--b3);
    box-shadow: 0 8px 32px var(--shadow);
}
</style>
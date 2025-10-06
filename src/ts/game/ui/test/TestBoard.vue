<script lang="ts">
// VUE
import { ref, Ref ,toRefs, computed } from "vue";
// OBJECT
import { FrameProps } from "core/object/app";
// UI
import NFrame from 'core/ui/base/NFrame.vue';
import Board from "game/ui/Board.vue";
</script>

<script setup lang="ts">
// PROPS
const props = withDefaults(defineProps<FrameProps>(), {})
const { options } = toRefs(props.frame!)

const isFullscreen = ref(false)
const originalPosition = ref({
  left: options.value.left,
  top: options.value.top,
})

const frameClass = computed(() => ({
  fullscreen: isFullscreen.value,
}))

function toggleFullscreen() {
  if (!isFullscreen.value) {
    originalPosition.value = {
      left: options.value.left,
      top: options.value.top,
    }
    options.value.left = 0
    options.value.top = 0
    isFullscreen.value = true
    return
  }

  options.value.left = originalPosition.value.left
  options.value.top = originalPosition.value.top
  isFullscreen.value = false
}

type Instance = InstanceType<typeof Board>;
const mr: Ref<Instance | null> = ref(null);

/** 空角色 */
async function br1() {}

/** 绑定角色 */
async function br2() {}

/** 数值变化 */
async function br3() {}
</script>

<template>
  <NFrame
    v-on="props.frame!.eventObject"
    :title="'Board'"
    :left="options.left"
    :top="options.top"
    :class="frameClass"
  >
    <template #button>
      <button @click="br1()">空角色</button>
      <button @click="toggleFullscreen">{{ isFullscreen ? '退出全屏' : '全屏' }}</button>
    </template>
    <template #ui>
      <div class="board" :class="{ 'board--fullscreen': isFullscreen }">
        <Board ref="mr"></Board>
      </div>
    </template>
  </NFrame>
</template>

<style scoped>
.board {
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid var(--line);
  background: var(--bg-lv2);
}

.board--fullscreen {
  padding: 0;
}

.frame {
  width: 800px;
  height: 600px;
  backdrop-filter: blur(10px);
  flex-direction: column;
}

.frame.fullscreen {
  width: 100vw;
  height: 100vh;
  max-width: none;
  max-height: none;
}

:deep(.frame.fullscreen .area) {
  justify-content: center;
  align-items: stretch;
}

:deep(.frame.fullscreen .area > *) {
  flex: 1;
}
</style>

<script lang="ts">
// VUE
import { ref, Ref ,toRefs} from "vue";
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
    class="test-board-frame"
    v-on="props.frame!.eventObject"
    :title="'Board'"
    :left="options.left"
    :top="options.top"
  >
    <template #button>
      <button @click="br1()">空角色</button>
    </template>
    <template #ui>
      <div class="board-wrapper">
        <div class="board">
          <Board ref="mr"></Board>
        </div>
      </div>
    </template>
  </NFrame>
</template>

<style scoped>
.board-wrapper {
  width: 100%;
  height: 100%;
}

.board {
  width: 100%;
  height: 100%;

  border: 1px solid var(--line);
  background: var(--bg-lv2);
}

:deep(.test-board-frame) {
  width: 100vw;
  height: 100vh;
  left: 0 !important;
  top: 0 !important;
}

:deep(.test-board-frame .body) {
  height: calc(100% - var(--title-text));
}

:deep(.test-board-frame .area) {
  align-items: stretch;
  justify-content: stretch;
}
</style>

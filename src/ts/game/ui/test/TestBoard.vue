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
  <NFrame v-on="props.frame!.eventObject" :title="'Board'" :left="options.left" :top="options.top">
    <template #button>
      <button @click="br1()">空角色</button>
    </template>
    <template #ui>
      <div class="board">
        <Board ref="mr"></Board>
      </div>
    </template>
  </NFrame>
</template>

<style scoped>
.board {
  width: 500px;
  height: 500px;

  border: 1px, solid, var(--line);
  background: var(--bg-lv2);
}

.frame {
  width: 800px;
  height: 600px;
  backdrop-filter: blur(10px);
  flex-direction: column;
}
</style>

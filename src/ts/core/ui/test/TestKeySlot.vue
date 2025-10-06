<script lang="ts">
// VUE
import { withDefaults, toRefs } from 'vue'
// OBJECT
import { FrameProps } from 'core/object/app'
// UI
import NFrame from 'core/ui/base/NFrame.vue';
import UI_KeySlot from 'core/ui/object/KeySlot.vue'
// ASSETS
// STORE
import { useTestKeySlotStore } from "store/core/TestKeySolt";

</script>

<script setup lang="ts">
const props = withDefaults(defineProps<FrameProps>(), {})
const { options } = toRefs(props.frame!)
// Store对象
const store = useTestKeySlotStore()

</script>

<template>
  <NFrame v-on="props.frame!.eventObject" :title="'KeySlot'" :left="options.left" :top="options.top">
    <template #button>
      <button @click="store.showEquipSlot()">装备槽重置</button>
      <button @click="store.showGemSlot()">宝石槽重置</button>
    </template>
    <template #ui>
      <div class='body'>
        <UI_KeySlot :store="store"></UI_KeySlot>
      </div>
    </template>
  </NFrame>
</template>

<style scoped>
.frame {
  width: 800px;
  height: 600px;
  backdrop-filter: blur(10px);
  flex-direction: column;
}

.body {
  width: 250px;
  height: 200px;
  padding: 10px;
  border: 2px, solid, var(--line);
  background: var(--bg-lv2);
}
</style>
<script lang="ts">
// VUE
import { ref,withDefaults, toRefs } from 'vue'
// OBJECT
import { FrameProps } from 'core/object/app'
// UI
import NFrame from 'core/ui/base/NFrame.vue';
import UI_BoxSlot from "core/ui/object/BoxSlot.vue";
// ASSETS
// STORE
import { useTestBoxSlotStore } from "store/core/TestBoxSolt";
</script>

<script setup lang="ts">
// PROPS
const props = withDefaults(defineProps<FrameProps>(), {})
const { options } = toRefs(props.frame!)
// Store对象
const store = useTestBoxSlotStore();

const column = ref(5)

function changeColumn(){
  column.value += 1
  if(column.value == 8) column.value = 5
}

</script>

<template>
  <NFrame v-on="props.frame!.eventObject" :title="'BoxSlot'" :left="options.left" :top="options.top">
    <template #button>
      <button @click="store.createBoxSlot_0()">容器[无上限]</button>
      <button @click="store.createBoxSlot_5()">容器[5]</button>
      <button @click="store.createBoxSlot_30()">容器[30]</button>

      <button @click="changeColumn()">列数[{{column}}]</button>
      <button @click="store.addItem()">添加物品</button>
    </template>
    <template #ui>
      <div class="body">
        <UI_BoxSlot :store="store" :column="column" />
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
  width: 300px;
  height: 250px;
  border: 2px, solid, var(--black);
}
</style>

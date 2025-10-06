<script lang="ts">
// VUE
import { withDefaults, toRefs } from 'vue'
// OBJECT
import { FrameProps } from 'core/object/app'
// UI
import NFrame from 'core/ui/base/NFrame.vue';
import UI_Table from 'core/ui/object/Table.vue'
// STORE
import { useTestTableStore } from "store/core/TestTable";
</script>


<script setup lang="ts">
import { ref } from 'vue'
const props = withDefaults(defineProps<FrameProps>(), {})
const { options } = toRefs(props.frame!)

const tableStore = useTestTableStore()
const rowHeight = ref('30px')

const toggleRowHeight = () => {
  rowHeight.value = rowHeight.value === '30px' ? '40px' : '30px'
}

</script>

<template>
  <NFrame v-on="props.frame!.eventObject" :title="'Table'" :left="options.left" :top="options.top">
    <template #button>
      <button @click="tableStore.resetTable()">重置</button>
      <button @click="tableStore.addItem()">添加属性</button>
      <button @click="tableStore.setItem()">修改属性</button>
      <button @click="toggleRowHeight">行高: [{{ rowHeight }}]</button>
    </template>
    <template #ui>
      <div class='body'>
        <UI_Table :store="tableStore" :rowHeight="rowHeight" />
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
  height: 300px;
  border: 2px, solid, var(--black);
}
</style>
<script lang="ts">
// VUE
// STORE
import { ITable } from "store/storeType";</script>

<script setup lang="ts">
// 父组件响应变量
interface Props {
  store?: ITable;
  rowHeight?: string;
}
const props = withDefaults(defineProps<Props>(), {
  rowHeight: '30px'
});
// 组件响应变量

</script>

<template>
  <div class="table">
    <div
      class="item"
      v-for="[key, value] in store?.table"
      :key="key"
      :style="{ height: props.rowHeight }"
    >
      <span class="key">{{ key }}</span>
      <span class="value">{{ value }}</span>
    </div>
  </div></template>

<style scoped>
.table {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-auto-rows: min-content;
  justify-items: start;
  align-items: start;
  width: 100%;
  height: 100%;
  gap: 3px;
  padding: 3px;
  background: var(--a4);
  overflow: auto;
  border-radius: 5px;
}

.table::-webkit-scrollbar {
  display: none;
}

.item {
  display: flex;
  width: 100%;
  gap: 1px;
  padding: 1px;
  background: var(--b2);
  border: 1px solid var(--black);
  border-radius: 8px;
}

.key {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 45%;
  height: 100%;
  padding: 2px;
  color: var(--black);
  background: var(--b3);
  border: 1px dashed var(--black);
  border-radius: 8px;
  font-size: small;
  font-weight: 600;
}

.value {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 55%;
  height: 100%;
  padding: 2px;
  color: var(--black);
  background: var(--b2);
  border-radius: 8px;
  font-size: small;
  overflow: hidden;
}
</style>

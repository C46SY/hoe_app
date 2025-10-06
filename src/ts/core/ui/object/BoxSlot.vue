<script lang="ts">
// VUE
import { ref, computed } from "vue";
// OBJECT
import { App } from 'core/object/app'
// UI
import Select from "core/ui/Base/Select.vue";
import MiniMenu from 'core/ui/base/MiniMenu.vue';
// STORE
import { IBoxSlot, IMiniMenu } from "store/storeType";
</script>

<script setup lang="ts">
// 父组件响应变量
interface Props {
  store?: IBoxSlot & IMiniMenu;
  column?: number;
}
const props = withDefaults(defineProps<Props>(), {
  column: () => 8,
});

const mainSelect = ref("");
const minorSelect = ref("");

const cardItems = computed(() => {
  return props.store?.boxSlot?.find(mainSelect.value, minorSelect.value);
});

function 复位筛选条件() {
  mainSelect.value = "";
  minorSelect.value = "";
}

const handleClick = (event: MouseEvent, item: string) => {
  const frame = App.createOnlyFrame('MiniMenu', MiniMenu, {
    left: event.clientX,
    top: event.clientY,
    store: props.store
  })
  if (frame) props.store!.select = item
}
</script>

<template>
  <div class="boxslot">
    <div class="control">
      <button class="button" @click="复位筛选条件()">全</button>

      <div class="select">
        <Select v-model="mainSelect" :options="store?.mainSelect"></Select>
        <Select v-model="minorSelect" :options="store?.minorSelect"></Select>
      </div>

      <div class="size" v-if="store?.boxSlot.size != -1">
        {{ `${store?.boxSlot.count}/${store?.boxSlot.size}` }}
      </div>
    </div>

    <div class="container" :style="{ 'grid-template-columns': `repeat(${column}, 1fr)` }">
      <div class="slot" v-for="card in cardItems" :key="card.guid" v-if="store?.boxSlot.size == -1">
        <div class="item">
          <img :src="card.pic" @click.right="(event) => handleClick(event, card.guid!)" />
        </div>
      </div>
      <div class="slot" v-for="id in props.store?.boxSlot.size" :key="id" v-else>
        <div class="item">
          <img :src="cardItems![id - 1].pic" v-if="id <= cardItems!.length"
            @click.right="(event) => handleClick(event, cardItems![id - 1].guid!)" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.boxslot {
  display: flex;
  flex-flow: column;
  height: 100%;
  width: 100%;
  user-select: none;
}

.control {
  display: flex;
  height: 30px;
  width: 100%;
  padding: 3px;
  gap: 2px;
}

.control .button {
  display: flex;
  width: 25px;
  height: 100%;
  justify-content: center;
  align-items: center;

  font-size: small;
  font-weight: 500;

  background: var(--b2);
  border: 1px solid var(--black);
  border-radius: 3px;
}

.control .button:active {
  background: var(--b3);
}

.control .select {
  display: flex;
  flex: 1;
  gap: 2px;
}

.control .size {
  display: flex;
  width: 70px;
  justify-content: center;
  align-items: center;
  font-size: small;
  border: 1px dashed var(--black);
  border-radius: 3px;
  background: var(--b3);
}

/** ===============================   */
.select :deep(.select) {
  width: 100%;

  justify-content: center;
  align-items: center;

  background: var(--b2);
  border: 1px solid var(--black);
  border-radius: 3px;

  appearance: none;
  font-size: x-small;
}

.select :deep(.select:active) {
  background: var(--b3);
}

.select :deep(.select.is-open) {
  background: var(--b2);
}

.select :deep(.select-dropdown) {
  border: 1px solid var(--black);
  background: var(--b2);
}

.select :deep(.select-option) {
  border: 1px dashed var(--black);
  background: var(--b2);
  justify-content: center;
  align-items: center;
  font-size: x-small;
}

.select :deep(.select-option:hover) {
  background: var(--b1);
}

.select :deep(.disabled) {
  background: var(--b3);
}

/** ===============================   */

.container {
  display: grid;
  grid-auto-rows: min-content;

  height: 100%;
  width: 100%;

  /* 根据内容高度自动调整 */

  overflow: auto;
  gap: 2px;
  padding: 2px;

  justify-items: start;
  align-items: start;

  background: var(--a4);
  border-radius: 5px;
}

.container::-webkit-scrollbar {
  width: 0px;
}

.slot {
  display: flex;
  height: 100%;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 8px;
}

img {
  display: flex;
  height: 100%;
  width: 100%;
  border-radius: 5px;
}

.item {
  display: flex;
  height: 100%;
  width: 100%;
  border-radius: 5px;
  border: 1px solid var(--black);
}
</style>

<script lang="ts">
// VUE
// OBJECT
import { App } from 'core/object/app'

// UI
import MiniMenu from 'core/ui/base/MiniMenu.vue';
// STORE
import { IKeySlot, IMiniMenu } from "store/storeType";
</script>

<script setup lang="ts">
// 父组件响应变量
interface Props {
  store?: IKeySlot & IMiniMenu;
}
const props = withDefaults(defineProps<Props>(), {});

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
  <div class="keyslot" v-if="store">
    <div class="row" v-for="key in store.keySlot?.Keys" :key="key" @click.right="(event) => handleClick(event, key)">
      <img v-if="store.keySlot?.get(key)?.pic" :src="store.keySlot.get(key)!.pic" />
      <div v-else class="img_null">{{ key }}</div>
      <div class="name">{{ store.keySlot?.get(key)?.name || '空' }}</div>
    </div>
  </div>
</template>

<style scoped>
.keyslot {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-auto-rows: min-content;

  height: 100%;
  width: 100%;
  overflow: auto;
  gap: 3px;
  padding: 3px;
  background: var(--a4);
  border-radius: 5px;
}


.keyslot::-webkit-scrollbar {
  display: none;
}

.keyslot img {
  display: flex;
  height: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  border: 1px solid var(--black);
}

.keyslot .row {
  display: flex;
  width: 100%;
  height: 40px;
  gap: 3px;

  padding: 2px;
  border-radius: 8px;
  background: var(--b2);
  border: 1px solid var(--black);
}



.row:hover {
  border-color: var(--c2);
}


.name {
  display: flex;
  width: 100%;
  height: 100%;

  justify-content: center;
  align-items: center;

  font-size: small;
  text-overflow: ellipsis;

  border-radius: 6px;
  background: var(--b2);
  color: var(--black);
}

.img_null {
  display: flex;
  height: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 8px;

  color: var(--black);
  background: var(--b3);
  border: 1px dashed var(--black);

  justify-content: center;
  align-items: center;

  font-size: small;
  text-overflow: ellipsis;
}
</style>

<script setup lang="ts">
// OBJECT
import { App } from 'core/object/app';
// UI
import CoreObject from 'core/ui/CoreObject.vue';
import GameObject from 'game/ui/GameObject.vue';
import SaveData from 'core/ui/base/SaveData.vue';
</script>

<template>
  <div class="menu">
    <button @click="App.createFrame('SaveData', SaveData)">DATA</button>
    <button @click="App.createFrame('CoreObject', CoreObject)">CORE</button>
    <button @click="App.createFrame('GameObject', GameObject)">GAME</button>
    <button @click="">MOD</button>
  </div>
</template>

<style scoped>
/* 触发区域 */
.menu {
  display: flex;
  width: 100%;
  height: 50px;
  flex-flow: row;
  background: var(--a4);
  align-items: center;
  padding: 10px;
  gap: 10px;

  border-bottom: 3px solid var(--black);
}

button {
  width: 100px;
  height: 30px;
  background: var(--a2);
  text-align: center;
  border-radius: 5px;
  font-weight: 400;
  border: 2px solid var(--black);
}

button:active{
  background: var(--a3);
}
</style>
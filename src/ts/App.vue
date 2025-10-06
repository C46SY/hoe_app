<script lang="ts">
// VUE
// OBJECT
import { App } from "bin/core/object/app";
import { GAME } from "./core/object/data";
// UI
import GameMenu from "core/ui/GameMenu.vue";
import MessageWindow from "core/ui/MessageWindow.vue";

// OTHERS

// 加载MOD
import "mod/XJ01/Card/Equip";
</script>

<script setup lang="ts">
const frames = App.getFrames();
GAME.init();
</script>

<template>
  <!-- 菜单栏 - 固定在顶部 -->
  <GameMenu />
  <!-- 消息窗口 - 固定在右下角 -->
  <MessageWindow />

  <!-- 使用Teleport将所有Frame组件传送到#app -->
  <Teleport to="#app">
    <component v-for="frame in frames" :key="frame.guid" :is="frame.component" v-bind="frame.props" />
  </Teleport>
</template>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  /* 调色盘 */
  --black: hsl(0, 0%, 10%);
  --white: hsl(0, 0%, 95%);

  /* 主色调 */
  --a1: hsl(30, 30%, 70%);
  --a2: hsl(30, 30%, 55%);
  --a3: hsl(30, 30%, 40%);
  --a4: hsl(30, 30%, 25%);

  /* 辅助色 */
  --b1: hsl(30, 20%, 70%);
  --b2: hsl(30, 20%, 55%);
  --b3: hsl(30, 20%, 40%);
  --b4: hsl(30, 20%, 25%);

  /* 强调色 */
  --c1: hsl(150, 50%, 80%);
  --c2: hsl(150, 50%, 60%);
  --c3: hsl(150, 50%, 40%);
  --c4: hsl(150, 50%, 20%);

  /* 功能色 */
  --success: hsl(120, 50%, 40%);
  --warning: hsl(45, 90%, 50%);
  --error: hsl(0, 70%, 50%);
  --info: hsl(200, 80%, 50%);

  --shadow: rgba(0, 0, 0, 0.4);

  /* 尺寸构成 */
  --width:360px;
  --height:640px;

  --title-text:30px;
  --title-null:15px;

  --button-width:200px;
}

html {
  width: 100%;
  height: 100%;
}

body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background: var(--a3);
  overflow: hidden;
  font-family: "Microsoft YaHei", "Segoe UI", Tahoma, Geneva, Verdana,
    sans-serif;
}

/* #app 作为根容器 */
#app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background: var(--a3);
  position: relative;
  overflow: hidden;
}
</style>

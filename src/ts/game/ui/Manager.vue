<script lang="ts">
// VUE
import { toRefs } from 'vue'
// OBJECT
import { FrameProps } from 'core/object/app'
import { Equip } from "game/object/card/equip";
import { Manager_Equit, Manager } from 'game/object/card/manager'
// UI
import Frame from 'core/ui/base/Frame.vue'
import TitleBar from 'core/ui/base/TitleBar.vue'
</script>


<script setup lang="ts">
// 数据类型为Container  容器
interface TableFrameProps extends FrameProps {
  data: Manager<Equip>
}
const props = withDefaults(defineProps<TableFrameProps>(), {
  data: () => Manager_Equit
})

// 计算属性：根据data对象生成title
const titile = '资源注册表'
const { frame } = toRefs(props)
const { options } = toRefs(props.frame)



</script>

<template>
  <Frame class="Manager" :left="options.left" :top="options.top">
    <!-- 标题栏 -->
    <TitleBar :title="titile" :left="options.left" :top="options.top" v-on="frame.eventObject" />

  </Frame>
</template>

<style scoped>
table {
  display: flex;
  flex: 1;
  flex-flow: column;
  width: 100%;
  border-collapse: collapse;
}

thead {
  display: flex;
  flex-flow: column;
  flex: 0.15;
  background-color: #353535;
  color: white;
}

tbody {
  display: flex;
  flex: 1;
  flex-flow: column;
  width: 100%;
  overflow-y: auto;
  /* 保留滚动功能 */
  scrollbar-width: none;
  /* Firefox */

  color: rgb(199, 195, 195);
}

thead tr {
  display: flex;
  flex-flow: row;
  width: 100%;
  height: 50%;
  align-items: center;
}

thead th {
  height: 100%;
  padding: 0 15px;
  font-weight: 600;
  text-align: center;
}

thead select {
  height: 100%;
  width: 100%;
  text-align: center;
  appearance: none;
  /* 隐藏默认箭头 */
  background-color: #353535;

  font-size: inherit;
  /* 关键属性 */
  font-family: inherit;
  /* 连带继承字体 */
  color: inherit;

  border: 0;
}

.注册表 {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
}

.序号 {
  flex: 0.1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.图片 {
  flex: 0.2;
  display: flex;
  justify-content: center;
  align-items: center;
}

.名称 {
  flex: 0.2;
  display: flex;
  justify-content: center;
  align-items: center;
}

.说明 {
  flex: 0.5;
  display: flex;
  justify-content: center;
  align-items: center;
}



.标题栏 .名称 {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.标题栏 .说明 {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

tbody tr {
  display: flex;
  min-height: 20%;
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.3s;
}

tbody tr:hover {
  background-color: #6583a1;
}

tbody th {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 15px;
}

/* 图片样式 */
table img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #6b6666;
}


/* 响应式设计 */
@media (max-width: 768px) {

  .标题栏 th,
  .列表 th {
    padding: 0 8px;
    font-size: 14px;
  }

  .图片 {
    width: 40px;
    height: 40px;
  }
}

.frame {
  width: 600px;
  height: 600px;
  backdrop-filter: blur(10px);
  flex-direction: column;
}

.title-bar {
  height: 10%
}
</style>
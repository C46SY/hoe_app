<script lang="ts">
// VUE
import { ref,withDefaults, toRefs } from 'vue'
// OBJECT
import { FrameProps } from 'core/object/app'
// UI
import NFrame from 'core/ui/base/NFrame.vue';
import UI_Card from 'core/ui/object/Card.vue'

// STORE
import { useTestCardStore } from "store/core/TestCard.ts";
</script>

<script setup lang="ts">
// PROPS
const props = withDefaults(defineProps<FrameProps>(), {})
const { options } = toRefs(props.frame!)

const store = useTestCardStore()
store.init()

const t1 = ref(true)
const t2 = ref(true)

function 更改UI类型A() {
  t1.value = true
  t2.value = true
}
function 更改UI类型B() {
  t1.value = false
  t2.value = false
}
function 更改UI类型C() {
  t1.value = true
  t2.value = false
}
function 更改UI类型D() {
  t1.value = false
  t2.value = true
}


</script>

<template>
  <NFrame v-on="props.frame!.eventObject" :title="'Card'" :left="options.left" :top="options.top">
    <template #button>
      <button @click="更改UI类型A()">UI类型[全部](完整面板)</button>
      <button @click="更改UI类型B()">UI类型[t0](对话框)</button>
      <button @click="更改UI类型C()">UI类型[t0+t1](简易面板)</button>
      <button @click="更改UI类型D()">UI类型[t0+t2](背包、商店)</button>
    </template>
    <template #ui>
      <UI_Card :store="store" :t1="t1" :t2='t2' :auto="false" />
    </template>
  </NFrame>
</template>

<style scoped>
.frame {
  width: 800px;
  height: 600px;
}
</style>
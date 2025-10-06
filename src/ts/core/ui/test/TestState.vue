<script lang="ts">
// VUE
import { ref, toRefs } from 'vue'
// OBJECT
import { FrameProps } from 'core/object/app'
import { StateMachine, BaseStateMachine } from 'core/object/StateMachine'



import { Delay } from 'core/object/tools'
// UI
import NFrame from '../base/NFrame.vue';
// STORE
</script>

<script setup lang="ts">
interface Props extends FrameProps {
  data: StateMachine
}
const props = withDefaults(defineProps<Props>(), {
  data: () => new BaseStateMachine(),
})
const { data: sm } = toRefs(props)
const { options } = toRefs(props.frame!)
const wait: number = 200
const alive = ref(false)
// 启动状态机
const start = async (_event: MouseEvent) => {
  alive.value = true
  while (alive.value) {
    await Delay(wait)
    sm.value.update()
    refresh()
  }
}

// 暂停状态机
const stop = (_event: MouseEvent) => {
  alive.value = false
}

// 重置状态机
const reset = (_event: MouseEvent) => {
  if (!alive.value) {
    sm.value.init()
    refresh()
  }
}

function refresh() {
  stateType.value = sm.value.currentState!.type
}

const stateType = ref('')
</script>

<template>
  <NFrame v-on="props.frame!.eventObject" :left="options.left" :top="options.top">
    <template #button>
      <button @click="start" v-if="!alive">start</button>
      <button @click="stop" v-if="alive">stop</button>
      <button @click="reset">reset</button>
    </template>
    <template #ui>
      <div class='body'>
        <div class="stateType">{{ stateType }}</div>
      </div>
    </template>
  </NFrame>
</template>

<style scoped>
.frame {
  width: 800px;
  height: 600px;
}
.stateType{
  font-size: x-large;
}
</style>
<script lang="ts">
// VUE
import { ref,withDefaults, toRefs } from 'vue'
// OBJECT
import { FrameProps } from 'core/object/app'
// UI
import NFrame from 'core/ui/base/NFrame.vue';
import UIPlay from 'core/ui/base/Play.vue';

// STORE
</script>

<script setup lang="ts">
// PROPS
const props = withDefaults(defineProps<FrameProps>(), {})
const { options } = toRefs(props.frame!)

const play = ref()

</script>

<template>
  <NFrame v-on="props.frame!.eventObject" :title="'Play'" :left="options.left" :top="options.top">
    <template #button>
      <button @click="play.number([111, 222, 333])">显示数字</button>
    </template>
    <template #ui>
      <div class='play_area'>
        <UIPlay ref="play" />
      </div>
    </template>
  </NFrame>
</template>

<style scoped>
.frame {
  position: fixed;
  width: 800px;
  height: 600px;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
}

.play_area {
  width: 300px;
  height: 400px;
  padding: 10px;
  border: 1px solid var(--black);
}

</style>
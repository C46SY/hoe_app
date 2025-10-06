<script lang="ts">
// VUE
import { toRefs } from 'vue'
// OBJECT
import { App,FrameProps } from 'core/object/app'
// UI
import NFrame from 'core/ui/base/NFrame.vue';
import TestTable from 'core/ui/test/TestTable.vue';
import TestBoxSlot from 'core/ui/test/TestBoxSlot.vue';
import TestKeySlot from 'core/ui/test/TestKeySlot.vue';
import TestCard from 'core/ui/test/TestCard.vue';


import TestMiniMenu from 'core/ui/test/TestMiniMenu.vue';
import TestPlay from 'core/ui/test/TestPlay.vue';
import TestState from 'core/ui/test/TestState.vue';

</script>

<script setup lang="ts">
// PROPS
const props = withDefaults(defineProps<FrameProps>(), {})
const { options } = toRefs(props.frame!)
</script>


<template>
    <NFrame v-on="props.frame!.eventObject" :title="'CoreObject'" :left="options.left" :top="options.top">
        <template #button>
            <button @click="App.createFrame('TestTable', TestTable)">TABLE</button>
            <button @click="App.createFrame('TestKeySlot', TestKeySlot)">KEY-SLOT</button>
            <button @click="App.createFrame('TestBoxSlot', TestBoxSlot)">BOX-SLOT</button>
            <button @click="App.createFrame('TestCard', TestCard)">CARD</button>

            <button @click="App.createFrame('TestMiniMenu', TestMiniMenu)">MiniMenu</button>
            <button @click="App.createFrame('TestPlay', TestPlay)">PLAY</button>
            <button @click="App.createFrame('TestState', TestState)">STATE</button>

        </template>
    </NFrame>
</template>

<style scoped>
.miniRole {
    width: 250px;
    height: 100px;

    border: 2px solid var(--line);
    background: var(--bg-lv2);
}

.frame {
    width: 800px;
    height: 600px;
    backdrop-filter: blur(10px);
    flex-direction: column;
}
</style>
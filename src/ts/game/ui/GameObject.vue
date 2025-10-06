<script lang="ts">
// VUE
import { toRefs } from 'vue'
// OBJECT
import { App, FrameProps } from 'core/object/app'
// UI
import NFrame from 'core/ui/base/NFrame.vue';

import TestMiniRole from 'game/ui/test/TestMiniRole.vue';
import TestBoard from 'game/ui/test/TestBoard.vue';
import TestEquip from 'game/ui/test/TestEquip.vue'
import TestRole from 'game/ui/test/TestRole.vue'
</script>


<script setup lang="ts">
// PROPS
const props = withDefaults(defineProps<FrameProps>(), {})
const { options } = toRefs(props.frame!)

</script>




<template>
    <NFrame v-on="props.frame!.eventObject" :title="'CoreObject'" :left="options.left" :top="options.top">
       <template #button>
            <button @click="App.createFrame('Equip', TestEquip)">Equip</button>
            <button @click="App.createFrame('Role', TestRole)">Role</button>
            <button @click="App.createFrame('MiniRole', TestMiniRole)">MiniRole</button>
            <button @click="App.createFrame('Board', TestBoard)">Board</button>
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
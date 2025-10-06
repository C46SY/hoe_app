<script lang="ts">
// VUE
import { ref, Ref,toRefs } from "vue"
// OBJECT
import { FrameProps } from 'core/object/app'
import { Slot } from 'core/object/slot';
import { Role } from 'game/object/card/role';
import { Equip } from 'game/object/card/equip';
import { Skill } from 'game/object/card/skill';
import { Status } from 'game/object/card/status';
import { RPG_TPGame } from "game/object/table/RPG_TPGame"
// UI
import NFrame from 'core/ui/base/NFrame.vue';
import MiniRole from 'game/ui/MiniRole.vue';
import UICard from 'core/ui/object/Card.vue'
// ASSETS
import img_lxy from "assets/XJ/李逍遥.png"
import img_lyr from "assets/XJ/林月如.png"
import img_zle from "assets/XJ/赵灵儿.png"
</script>

<script setup lang="ts">
// PROPS
const props = withDefaults(defineProps<FrameProps>(), {})
const { options } = toRefs(props.frame!)

type MiniRoleInstance = InstanceType<typeof MiniRole>
const mr: Ref<MiniRoleInstance | null> = ref(null)


class newRole extends Role {
    _initTable() { }
    _initEquipSlot(): Slot<Equip> | undefined {
        return undefined
    }
    _initSkillSlot(): Slot<Skill> | undefined {
        return undefined
    }
    _initStatusSlot(): Slot<Status> | undefined {
        return undefined
    }
    _initSlot(): void { }
    initType() { }
    _getMud(_name: string): number { return 1 }
}

let kr: newRole | undefined

/** 空角色 */
async function br1() {
    mr.value?.setRole()
    await mr.value?.Refresh()
}

const imgs = [img_lxy, img_lyr, img_zle]

/** 绑定角色 */
async function br2() {
    kr = new newRole()
    kr.set(RPG_TPGame.Att.HP_MAX, 1000)
    kr.set(RPG_TPGame.Att.MP_MAX, 1000)
    kr.set(RPG_TPGame.Att.HP, Math.floor(Math.random() * 1000))
    kr.set(RPG_TPGame.Att.MP, Math.floor(Math.random() * 1000))
    kr.set(RPG_TPGame.Att.SP, Math.floor(Math.random() * 1000))
    kr.pic = imgs[Math.floor(Math.random() * 3)]

    mr.value?.setRole(kr)
    await mr.value?.Refresh()
}

/** 数值变化 */
async function br3() {
    if (!kr) return
    kr.set(RPG_TPGame.Att.HP, Math.floor(Math.random() * 1000))
    kr.set(RPG_TPGame.Att.MP, Math.floor(Math.random() * 1000))
    kr.set(RPG_TPGame.Att.SP, Math.floor(Math.random() * 1000))
    await mr.value?.Refresh()
}
</script>


<template>
    <NFrame v-on="props.frame!.eventObject" :title="'CoreObject'" :left="options.left" :top="options.top">
      <template #button>
            <button @click="br1()">仅显示标题</button>
            <button @click="br2()">绑定角色</button>
            <button @click="br3()">数值变化</button>
        </template>
        <template #ui>
            <UICard ref="mr"></UICard>
        </template>
    </NFrame>
</template>

<style scoped>
.frame {
    width: 800px;
    height: 600px;
    backdrop-filter: blur(10px);
    flex-direction: column;
}
</style>
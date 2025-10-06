<script lang="ts">
// VUE
import { ref, Ref, toRefs, nextTick } from "vue"
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
// ASSETS
import img_lxy from "assets/XJ/李逍遥.png"
import img_lyr from "assets/XJ/林月如.png"
import img_zle from "assets/XJ/赵灵儿.png"
// STORE
import { StoreTestMiniRole } from "game/store/TestMiniRole"
import { GAME } from "bin/core/object/data";
</script>

<script setup lang="ts">
// PROPS
const props = withDefaults(defineProps<FrameProps>(), {})
const { options } = toRefs(props.frame!)

type MiniRoleInstance = InstanceType<typeof MiniRole>

const mr: Ref<MiniRoleInstance | null> = ref(null)

const roleGuid = ref('')

const store = StoreTestMiniRole()

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

const imgs = [img_lxy, img_lyr, img_zle]

/** 绑定角色 */
async function br1() {
  kr = new newRole()
  kr.set(RPG_TPGame.Att.HP_MAX, 1000)
  kr.set(RPG_TPGame.Att.MP_MAX, 1000)
  kr.set(RPG_TPGame.Att.HP, Math.floor(Math.random() * 1000))
  kr.set(RPG_TPGame.Att.MP, Math.floor(Math.random() * 1000))
  kr.set(RPG_TPGame.Att.SP, Math.floor(Math.random() * 10000))
  kr.pic = imgs[Math.floor(Math.random() * 3)]
  GAME.add(kr)
  console.log(kr.guid)
  roleGuid.value = kr.guid
  await nextTick()
  await mr.value?.refresh()
}

const lock = ref(true)
/** 角色数值变化 */
async function br2() {
  if(!lock.value) return
  lock.value = false

  const role = GAME.get(roleGuid.value)
  let n = 0
  while (n < 1000) {
    role!.alter(RPG_TPGame.Att.SP, 200)
    if (n % 20 === 0) {
      role!.alter(RPG_TPGame.Att.HP, Math.floor((Math.random() - 0.5) * 500))
      role!.alter(RPG_TPGame.Att.MP, Math.floor((Math.random() - 0.5) * 500))
    }
    await mr.value?.refresh()
    n += 1
  }
  
  lock.value = true
}

</script>


<template>
  <NFrame v-on="props.frame!.eventObject" :title="'CoreObject'" :left="options.left" :top="options.top">
    <template #button>
      <button @click="br1()">新角色</button>
      <button @click="br2()">数值变化</button>
    </template>
    <template #ui>
      <div class='miniRole'>
        <MiniRole ref="mr" :guid="roleGuid" :store="store"></MiniRole>
      </div>
    </template>
  </NFrame>
</template>

<style scoped>
.frame {
  width: 800px;
  height: 600px;
}

.miniRole {
  width: 120px;
  height: 120px;

  background: var(--bg-lv2);

  justify-content: center;
  align-items: center;
}
</style>
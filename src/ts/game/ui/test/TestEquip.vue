<script lang="ts">
// VUE
import { ref, provide,toRefs } from "vue";
// OBJECT
import { Card } from "core/object/card";
import { KeySlot } from "core/object/slot";
import { Frame ,FrameProps} from "core/object/app";
import { Msg } from "core/object/message";
import { Equip } from "game/object/card/equip";
// UI
import NFrame from 'core/ui/base/NFrame.vue';
import UICard from "core/ui/object/Card.vue";
// ASSETS
import eq_img from "assets/青锋剑.png";
</script>

<script setup lang="ts">
// PROPS
const props = withDefaults(defineProps<FrameProps>(), {})
const { options } = toRefs(props.frame!)
//======================================
// 强化槽
//======================================
class NewSlot extends KeySlot<Card> {
  constructor(type:string,keyList: Array<string>){
    super()
    this.type = type
    this.setKeys(keyList)
  }
  getKey(card: Card): string {
    return card.name;
  }
  check_add(_card: Card): Msg {
    return new Msg();
  }
  check_remove(_card: Card): Msg {
    return new Msg();
  }
  _add_after(_card: Card): void {}
  _remove_after(_card: Card): void {}
}

const equip = new Equip("武器");
equip.pic = eq_img;
equip.des ="名家精心打造的剑，轻薄锋利。";
equip
  .tableAttr({
    ["类型"]: "单手剑",
    ["投掷伤害"]: 177,
  })
  .tableEnhance_Add({
    ["武术"]: 75,
    ["身法"]: 15,
  })
  .tableNeed({
    ["等级"]: 15,
  });
const 宝石 = ["红", "蓝", "黄"];
const 符文 = ["天", "地", "人"];
equip.addSlot(new NewSlot('宝石',宝石));
equip.addSlot(new NewSlot('符文',符文));

provide("Equip", equip);

const frame = new Frame(Test);

const v1 = ref("ATTR");
const v2 = ref(["ADD"]);
const v3 = ref(new Array(0));

function 重置() {
  v2.value = ["ADD"];
  v3.value = [];
}
function 添加表格() {
  const tn = "NEED";
  if (v2.value.indexOf(tn) == -1) {
    v2.value = [...v2.value, tn];
    console.log(v2.value);
  }
}

let f1 = true
function 添加KeySlot() {
    if (f1){
        v3.value = ['宝石'];
        f1 = false
    }else{
        v3.value = ['宝石','符文'];
    }
}
</script>

<template>
  <NFrame v-on="props.frame!.eventObject" :title="'CoreObject'" :left="options.left" :top="options.top">
    <template #button>
      <button @click="重置()">重置</button>
      <button @click="添加表格()">表格{{v2}}</button>
      <button @click="添加KeySlot()">强化槽{{v3}}</button>
    </template>
    <template #ui>
      <UICard :CARD="'Equip'" :t2="false" :TABLE_MAIN="v1" :TABLE_LIST="v2" :KEY_SLOT="v3" />
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

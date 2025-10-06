<script lang="ts">
// VUE
import { computed } from "vue";
// OBJECT
// UI
import UITable from "core/ui/object/Table.vue";
import UIKeySlot from "core/ui/object/KeySlot.vue";
import UIBoxSlot from "core/ui/object/BoxSlot.vue";
// STORE
import { ICard } from "store/storeType";
</script>

<script setup lang="ts">
// 响应式参数
interface Props {
  store?: ICard;
  t1?: boolean;
  t2?: boolean;
  auto?: boolean;
  CARD?: string;
  TABLE_MAIN?: string;
  TABLE_LIST?: string[];
  KEY_SLOT?: string[];
}
const props = withDefaults(defineProps<Props>(), {
  t1: () => true,
  t2: () => true,
  auto: () => true,
  CARD: () => "",
  TABLE_MAIN: () => "",
  TABLE_LIST: () => [],
  KEY_SLOT: () => [],
});

const onT1 = computed(() => {
  if (props.auto) {
    const nkeysolt = props.store?.listKeySlot.length
    const nboxsolt = props.store?.listBoxSlot.length
    return !(nkeysolt == 0 && nboxsolt == 0)
  } else {
    return props.t1
  }
})

const onT2 = computed(() => {
  if (props.auto) {
    const nboxsolt = props.store?.listBoxSlot.length
    return !(nboxsolt == 0)
  } else {
    return props.t2
  }
})

enum CARDTPYE {
  t0 = 0,
  t0t1 = 1,
  t0t2 = 2,
  t0t1t2 = 3,
}

const onType = computed(() => {
  if (onT1.value && onT2.value) {
    return CARDTPYE.t0t1t2
  }
  if (!onT1.value && !onT2.value) {
    return CARDTPYE.t0
  }
  if (onT1.value && !onT2.value) {
    return CARDTPYE.t0t1
  }
  if (!onT1.value && onT2.value) {
    return CARDTPYE.t0t2
  }
})


const height = 540
const p0 = 15
const p1 = 42.5
const p2 = 42.5

const card_style = computed(() => {
  switch (onType.value) {
    case CARDTPYE.t0t1t2:
      return { height: `${height}px` };
    case CARDTPYE.t0t1:
      return { height: `${height * (p0 + p1) / 100}px` };
    case CARDTPYE.t0t2:
      return { height: `${height * (p0 + p2) / 100}px` };
    case CARDTPYE.t0:
      return { height: `${height * p0 / 100}px` };
  }
});

const t0_style = computed(() => {
  switch (onType.value) {
    case CARDTPYE.t0t1t2:
      return { height: `${p0}%` };
    case CARDTPYE.t0t1:
      return { height: `${p0 / (p0 + p1) * 100}%` };
    case CARDTPYE.t0t2:
      return { height: `${p0 / (p0 + p2) * 100}%` };
    case CARDTPYE.t0:
      return { height: "100%" };
  }
});

const t1_style = computed(() => {
  switch (onType.value) {
    case CARDTPYE.t0t1t2:
      return { height: `${p1}%` };
    case CARDTPYE.t0t1:
      return { height: `${p1 / (p0 + p1) * 100}%` };
  }
});

const t2_style = computed(() => {
  switch (onType.value) {
    case CARDTPYE.t0t1t2:
      return { height: `${p2}%` };
    case CARDTPYE.t0t2:
      return { height: `${p2 / (p0 + p2) * 100}%` };
  }
});



//--------------------------------------
// 翻页符号
enum buttonType {
  null = 0,
  min = 1,
  middle = 2,
  max = 3,
}

//--------------------------------------
// Table 翻页
const tableButtonType = computed(() => {
  const max = props.store?.listTable.length!
  const index = props.store?.listTable.indexOf(props.store.table!.name)!
  if (max <= 1) {
    return buttonType.null;
  }
  if (index >= max - 1) {
    return buttonType.max;
  }
  if (index == 0) {
    return buttonType.min;
  }
  return buttonType.middle;
});

const rightTalbeButton = computed(() => {
  switch (tableButtonType.value) {
    case buttonType.null:
      return "";
    case buttonType.max:
      return "▷";
    default:
      return "▶";
  }
});

const leftTalbeButton = computed(() => {
  switch (tableButtonType.value) {
    case buttonType.null:
      return "";
    case buttonType.min:
      return "◁";
    default:
      return "◀";
  }
});

//--------------------------------------
// keyslot 翻页
const keySlotButtonType = computed(() => {
  const max = props.store?.listKeySlot.length!
  const index = props.store?.listKeySlot.indexOf(props.store.keyslot!.name)!
  if (max <= 1) {
    return buttonType.null;
  }
  if (index >= max - 1) {
    return buttonType.max;
  }
  if (index == 0) {
    return buttonType.min;
  }
  return buttonType.middle;
});

const rightKeySlotButton = computed(() => {
  switch (keySlotButtonType.value) {
    case buttonType.null:
      return "";
    case buttonType.max:
      return "▷";
    default:
      return "▶";
  }
});

const leftKeySlotButton = computed(() => {
  switch (keySlotButtonType.value) {
    case buttonType.null:
      return "";
    case buttonType.min:
      return "◁";
    default:
      return "◀";
  }
});
//--------------------------------------
// boxslot 翻页
const boxSlotButtonType = computed(() => {
  const max = props.store?.listBoxSlot.length!
  if (max <= 1) {
    return buttonType.null;
  }
  const index = props.store?.listBoxSlot.indexOf(props.store.boxslot!.name)!
  if (index >= max - 1) {
    return buttonType.max;
  }
  if (index == 0) {
    return buttonType.min;
  }
  return buttonType.middle;
});

const rightBoxSlotButton = computed(() => {
  switch (boxSlotButtonType.value) {
    case buttonType.null:
      return "";
    case buttonType.max:
      return "▷";
    default:
      return "▶";
  }
});

const leftBoxSlotButton = computed(() => {
  switch (boxSlotButtonType.value) {
    case buttonType.null:
      return "";
    case buttonType.min:
      return "◁";
    default:
      return "◀";
  }
});

</script>

<template>
  <div class="card" :style="card_style" v-if="store">

    <div class="t0" :style="t0_style">
      <div class="pic"><img :src="store!.card?.pic" /></div>
      <div class="des">{{ store!.card?.des }}</div>
    </div>

    <div class="t1" v-if="onT1" :style="t1_style">
      <!-- TABLE -->
      <div class="box">
        <div class="card-control">
          <button class="table-button" @click="store.preTable()">
            {{ leftTalbeButton }}
          </button>
          <div class="table-name">{{ store.table?.name }}</div>
          <button class="table-button" @click="store.nextTable()">
            {{ rightTalbeButton }}
          </button>
        </div>
        <div class="ui">
          <UITable :store="store" :rowHeight="'25px'" />
        </div>
      </div>

      <!-- KEYSLOT -->
      <div class="box">
        <div class="card-control">
          <button class="table-button" @click="store.preKeySlot()">
            {{ leftKeySlotButton }}
          </button>
          <div class="table-name">{{ store.keyslot?.name }}</div>
          <button class="table-button" @click="store.nextKeySlot()">
            {{ rightKeySlotButton }}
          </button>
        </div>
        <div class="ui">
          <UIKeySlot :store="store.storeKeySlot.get(store.keyslot?.name!)" />
        </div>
      </div>
    </div>

    <div class="t2" v-if="onT2" :style="t2_style">
      <div class="box">
        <div class="card-control">
          <button class="table-button" @click="store.preBoxSlot()">
            {{ leftBoxSlotButton }}
          </button>
          <div class="table-name">{{ store.boxslot?.name }}</div>
          <button class="table-button" @click="store.nextBoxSlot()">
            {{ rightBoxSlotButton }}
          </button>
        </div>
        <div class="ui">
          <UIBoxSlot :store="store.storeBoxSlot.get(store.boxslot?.name!)" :column="8" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  flex-flow: column;
  width: 350px;

  background: var(--a2);
  padding: 5px;
  gap: 3px;

  border: 2px solid var(--black);
  border-radius: 5px;

  user-select: none;
}

.t0 {
  display: flex;
  flex-flow: row;
  width: 100%;
  gap: 3px;
}

.t1 {
  display: flex;
  width: 100%;
  gap: 3px;
}

.t2 {
  display: flex;
  width: 100%;
  gap: 3px;
}

.pic {
  display: flex;
  height: 100%;
  aspect-ratio: 1/1;
  border: 2px solid var(--black);
  border-radius: 5px;
}

.pic img {
  border-radius: 5px;
}

.des {
  display: flex;
  flex: 1;
  height: 100%;

  padding: 5px;
  border-radius: 5px;
  border: 1px solid var(--black);

  font-size: small;

  word-wrap: break-word;
  word-break: break-all;

  background: var(--a1);
}

.box {
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 100%;
  background: var(--a3);
  border-radius: 5px;

  border: 1.5px solid var(--black);
  padding: 3px;
  padding-bottom: 3px;
  gap: 1px;
}


.card-control {
  display: flex;
  flex-flow: row;
  height: 15%;
  width: 100%;
  border-bottom: 1px solid var(--black);
  gap: 10px;
  padding: 3px;
}

.table-button {
  display: flex;
  height: 100%;
  width: 10%;
  font-size: small;
  font-weight: 900;

  align-items: center;
  justify-content: center;

  background: var(--a3);
  border: 0px;
  border-radius: 5px;

  user-select: none;
}

.table-name {
  display: flex;
  height: 100%;
  width: 100%;

  font-size: small;
  font-weight: 600;
  align-items: center;
  justify-content: center;

  color: var(--text);
  border-radius: 5px;

  user-select: none;
}

.ui {
  display: flex;
  height: 85%;
  width: 100%;
}
</style>

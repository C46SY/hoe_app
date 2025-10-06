<script lang="ts">
// TAURI
import { resourceDir, appDataDir, appLocalDataDir } from '@tauri-apps/api/path';
// VUE
import { ref,toRefs, onMounted } from 'vue'
// OBJECT
import { App,FrameProps } from 'core/object/app'
import { Table } from '../object/table';
import { GAME } from 'core/object/data';
import { Card } from 'core/object/card';
import { KeySlot, BoxSlot } from 'core/object/slot';
// UI
import NFrame from 'core/ui/base/NFrame.vue';
import SaveData from 'core/ui/base/SaveData.vue';

// FILE
</script>

<script setup lang="ts">
// PROPS
const props = withDefaults(defineProps<FrameProps>(), {})
const { options } = toRefs(props.frame!)

const test = ref('')
const resourcePath = ref('')
const appDataPath = ref('')
const appLocalPath = ref('')
onMounted(async () => {
    resourcePath.value = await resourceDir()
    appDataPath.value = await appDataDir()
    appLocalPath.value = await appLocalDataDir()
})

function test1(): void {
    test.value = 'savedata'
}

async function test2(): Promise<any> {
    class TA extends Table {
        constructor() {
            super()
            this.name = 'TA'
            this.add('hp', 100)
            this.add('mp', 100)
        }
    }

    class TB extends Table {
        constructor() {
            super()
            this.name = 'TB'
            this.add('exp', 500)
            this.add('lv', 3)
        }
    }

    class KSLOT extends KeySlot<Equip> {
        name: string = '装备栏'
        constructor() {
            super()
            this.setKeys(['武器', '防具', '饰品'])
        }
        getKey(card: Equip): string {
            return card.name
        }
    }

    class BSLOT extends BoxSlot<Item> {
        name: string = '背包'
        find(_main: string, _minor: string): Item[] {
            return []
        }
    }

    class Role extends Card { }
    class Equip extends Card {
        constructor() {
            super()
            GAME.add(this)
        }
        public static create(type: string) {
            const ep = new Equip()
            ep.name = type
            return ep
        }
    }
    class Item extends Card {
        constructor() {
            super()
            GAME.add(this)
        }
        public static create(type: string) {
            const ep = new Equip()
            ep.name = type
            return ep
        }
    }

    const ES = new KSLOT()
    const IS = new BSLOT()

    const ta = new TA()
    const tb = new TB()
    const role = new Role()

    const e1 = Equip.create('武器')
    const e2 = Equip.create('防具2')

    const i1 = Item.create('道具1')
    const i2 = Item.create('道具2')

    ES.add(e1)
    ES.add(e2)

    IS.add(i1)

    role.addTable(ta)
    role.addTable(tb)
    GAME.add(role)
    role.addSlot(ES)
    role.addSlot(IS)

    GAME.saveCard(role)

    IS.add(i2)
    GAME.save(0)
    GAME.reset()

    GAME.load(0)

}

</script>


<template>
    <NFrame v-on="props.frame!.eventObject" :title="'CoreObject'" :left="options.left" :top="options.top">
        <template #button>
            <button @click="test = 'path'">路径一览</button>
            <button @click="App.createFrame('savedata',SaveData)">存档文件夹</button>
            <button @click="test2()">测试</button>
        </template>
        <template #ui>
            <div class='test' v-if="test == 'path'">
                <div class="item">
                    <div class="path_type">resourcePath</div>
                    <div class="path">{{ resourcePath }}</div>
                </div>
                <div class="item">
                    <div class="path_type">appDataPath</div>
                    <div class="path">{{ appDataPath }}</div>
                </div>
                <div class="item">
                    <div class="path_type">appLocalPath</div>
                    <div class="path">{{ appLocalPath }}</div>
                </div>
            </div>
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

.test {
    width: 500px;
    display: flex;
    flex-flow: column;
    border: 1px solid var(--black);
    padding: 10px;
    gap: 10px;
}

.item {
    display: flex;
    flex-flow: row;
    width: 100%;
    gap: 5px;
}

.path_type {
    display: flex;
    width: 25%;
    height: 50px;
    font-size: medium;

    justify-content: center;
    align-items: center;

    border: 1px dashed var(--black);
}

.path {
    display: flex;
    width: 75%;
    font-size: small;
    /** 文本偏移3px */
    text-indent: 5px;
    justify-content: start;
    align-items: center;
    border: 1px dashed var(--black);
}
</style>
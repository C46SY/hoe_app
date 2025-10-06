<script lang="ts">
// VUE
import { ref, computed } from 'vue'
// OBJECT
// STORE
import { IMiniRole } from "game/store/TestMiniRole"
// GSAP
import { gsap } from "gsap";
// 动画参数
const fps = 30
const frameTime = 1000 / fps // 16.67ms
// 变化速度
// 等待帧
const wait = () => new Promise(resolve => setTimeout(resolve, frameTime))
</script>

<template>
    <div class='miniRole'>
        <div class='C C1'>
            <div class="SP" :style="style_sp"></div>
        </div>
        <div class='C C2'>
            <div class='LEFT'>
                <div class='HP' :style="style_hp"></div>
            </div>
            <div class='RIGHT'>
                <div class='MP' :style="style_mp"></div>
            </div>
        </div>
        <div class='C C3' @click="test()">
            <img class='IMG' v-if="roleimg" :src='roleimg' />
            <div class='IMG' v-else></div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    guid?: string
    store?: IMiniRole
}
const props = withDefaults(defineProps<Props>(), {
    guid: undefined
})


let test_lock = true
async function test(): Promise<void> {
    if (test_lock) {
        test_lock = false
        let n = 0
        while (n < 1000) {
            value_sp.value += 0.02
            value_hp.value += 0.04
            value_mp.value += 0.05
            if (value_sp.value > 1.000001) {
                value_sp.value = 0
            }
            if (value_hp.value > 1.000001) {
                value_hp.value = 0
            }
            if (value_mp.value > 1.000001) {
                value_mp.value = 0
            }
            await wait()
            n += 1
        }
        test_lock = true
    }
}

const value_sp = ref(0)
const value_hp = ref(0)
const value_mp = ref(0)

const style_sp = computed(() => {
    const right = (1 - value_sp.value) * 180
    const left = 360 - right
    return {
        '--sp-right': `${right}deg`,
        '--sp-left': `${left}deg`
    };
})

const style_hp = computed(() => {
    const hp = value_hp.value * 180 + 180
    return {
        '--hp': `${hp}deg`,
    };
})

const style_mp = computed(() => {
    const mp = (1 - value_mp.value) * 180
    return {
        '--mp': `${mp}deg`,
    };
})



// 图像
const roleimg = computed(() => {
    if (props.guid) {
        return props.store!.getPic(props.guid)
    } else {
        return undefined
    }
})


async function refresh() {
    const guid = props.guid
    const store = props.store!
    const targetHP = store.getHp(guid)
    const targetMP = store.getMp(guid)
    const targetSP = store.getSp(guid)

    // 100%跑1秒
    const hpChange = Math.abs(targetHP - value_hp.value)
    const mpChange = Math.abs(targetMP - value_mp.value)
    const spChange = Math.abs(targetSP - value_sp.value)

    const tl = gsap.timeline()

    if (hpChange > 0.01) {
        tl.to(value_hp, {
            value: targetHP,
            duration: hpChange,
            ease: "power1.out"
        }, 0)
    }

    if (mpChange > 0.01) {
        tl.to(value_mp, {
            value: targetMP,
            duration: mpChange,
            ease: "power1.out"
        }, 0)
    }

    if (spChange > 0.01) {
        tl.to(value_sp, {
            value: targetSP,
            duration: spChange,
            ease: "power1.out"
        }, 0)
    }

    return new Promise(resolve => {
        tl.eventCallback("onComplete", resolve)
    })
}
defineExpose({
    refresh
})
</script>



<style scoped>
.miniRole {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
}

.C {
    display: flex;
    border: 2px solid var(--black);
    overflow: hidden;
    border-radius: 50%;
}

.C1 {
    width: 95%;
    height: 95%;
    background: var(--black);
    justify-content: center;
    align-items: center;
}

/* 中间层容器 */
.C2 {
    position: absolute;
    width: 85%;
    height: 85%;
    background: var(--a2);
}

/* 内层容器 */
.C3 {
    position: absolute;
    width: 70%;
    height: 70%;
    justify-content: center;
    align-items: center;
}

/* SP进度条 - 使用极坐标思路的60°扇形 */
.SP {
    width: 100%;
    height: 100%;
    background: conic-gradient(from 0deg at 50% 50%,
            rgb(16, 66, 6) 0deg var(--sp-right),
            rgb(67, 255, 83) var(--sp-right) var(--sp-left),
            rgb(16, 66, 6) var(--sp-left) 360deg);
}

.LEFT {
    display: flex;
    height: 100%;
    width: 50%;
    border-right: 1px solid var(--black);
}

.RIGHT {
    display: flex;
    height: 100%;
    width: 50%;
    border-left: 1px solid var(--black);
}


/* HP进度条 */
.HP {
    width: 100%;
    height: 100%;
    background: conic-gradient(from 0deg at 100% 50%,
            #e92f32 180deg var(--hp),
            /* 绿色扇形区域 */
            #832324 0deg
            /* 其余部分为黑色 */
        );
}

/* MP进度条 */
.MP {
    width: 100%;
    height: 100%;
    background: conic-gradient(from 0deg at 0% 50%,
            #22677c 0deg var(--mp),
            /* 绿色扇形区域 */
            #3fc1e9 0deg
            /* 其余部分为黑色 */
        );
}


.IMG {
    width: 100%;
    height: 100%;
    background: var(--a2);
}
</style>
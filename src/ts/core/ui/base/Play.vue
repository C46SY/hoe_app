<!-- 前端动画组件 -->
<script lang="ts">
// VUE
import { ref } from 'vue'
// OBJECT
// UI
// STORE

import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(SplitText)
</script>

<script setup lang="ts">

const numbers = ref<number[]>([])


const area = ref<HTMLElement>()
const tl = ref<HTMLElement[]>([])


async function setNumbers(_numbers: number[] | number) {
    if (typeof _numbers === 'number') {
        numbers.value = [_numbers]
    } else {
        numbers.value = _numbers
    }
}


async function number(_numbers: number[] | number) {
    await setNumbers(_numbers)
    // 获取区域尺寸
    const width = area.value!.offsetWidth * 0.9;
    const height = area.value!.offsetHeight * 0.9;

    // 数字逐个显示
    for (const item of tl.value) {
        // 初始化显示
        await gsap.set(item, {
            opacity: 1,
            border: "1px solid red",
        });

        // 随机位置
        const randomX = (Math.random() - 0.5) * width;
        const randomY = (Math.random() - 0.5) * height;
        await gsap.set(item, {
            x: randomX * 0.8,
            y: randomY * 0.8,
        });

        // 字符组个出现
        let split = SplitText.create(item, { type: "chars" });
        await gsap.from(split.chars, {
            duration: 0.2,
            fontSize: '20px',
            y: -50,
            x: 50,
            autoAlpha: 0,
            stagger: 0.05
        });

        // 字符隐去
        await gsap.to(item, { duration: 0.3, opacity: 0 })
    }
}

defineExpose({
    number,
    setNumbers
})
</script>

<template>
    <div ref="area" class="AnimatedText">
        <span class="chars" ref="tl" v-for="item in numbers" :key="item">{{ item }}</span>
    </div>
</template>


<style scoped>
.AnimatedText {
    display: flex;
    position: relative;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
    padding: 10px;
}

.chars {
    display: inline-block;
    position: absolute;
    font-size: 30px;
    opacity: 0;

}
</style>

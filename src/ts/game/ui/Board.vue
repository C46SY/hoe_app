<script lang="ts">
// VUE
import { ref } from 'vue'
// UI
import MiniRole from 'game/ui/MiniRole.vue';
</script>

<script setup lang="ts">

class vt {
  x: number
  y: number
  z: number
  constructor(x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
  }

  mul(p: number) {
    return new vt(this.x * p, this.y * p, this.z * p)
  }
  add(v: vt) {
    return new vt(this.x + v.x, this.y + v.y, this.z + v.z)
  }


  static get vo() {
    return new vt(0, 0, 0)
  }

  static get vx() {
    return new vt(1, 0, 1)
  }

  static get vy() {
    return new vt(0, 1, -1)
  }

  static get vz() {
    return new vt(1, 1, 0)
  }
}


function getPoints(r: number) {
  //返回满足下列条件的点
  let points = new Array<vt>()

  // 原点
  points.push(vt.vo)

  // a = 0 ,b=0,c=0
  for (let i = 1; i <= r; i++) {
    points.push(new vt(i, 0, 0))
    points.push(new vt(0, i, 0))
    points.push(new vt(0, 0, i))
    points.push(new vt(-i, 0, 0))
    points.push(new vt(0, -i, 0))
    points.push(new vt(0, 0, -i))
  }

  // 满足所有 p1+p2 <= r p1>0 p2>0  p1,p2在abc中选两个
  for (let a = 1; a <= r; a++) {
    for (let b = 1; b <= r; b++) {
      if (a + b <= r) {
        points.push(new vt(a, 0, -b))
        points.push(new vt(-a, 0, b))
        points.push(new vt(0, a, -b))
        points.push(new vt(0, -a, b))
        points.push(new vt(a, -b, 0))
        points.push(new vt(-a, b, 0))
      }
    }
  }
  return points
}

// 地图尺寸
const radius = 3
// 瓷片大小
const size = 40

const items = new Array<number>(3 * radius * (radius + 1) + 1)
const points = getPoints(radius)
const board = ref<HTMLElement | null>(null)



function style_chunk(index: number) {
  // 获取当前chunk的坐标
  const point = points[index]
  console.log(point)
  let px = 0
  let py = 0
  // 获取board的实际尺寸
  const boardRect = board.value?.getBoundingClientRect()
  px = (boardRect?.width || 0) / 2
  py = (boardRect?.height || 0) / 2

  // 计算vx偏移量
  px += point.x * size * Math.sin(Math.PI / 6)
  py -= point.x * size * Math.cos(Math.PI / 6)
  // 计算vy偏移量
  px += point.y * size * Math.sin(Math.PI / 6)
  py += point.y * size * Math.cos(Math.PI / 6)
  // 计算vz偏移量
  px -= point.z * size

  const chunkSize = size * 1.1
  return {
    width: `${chunkSize}px`,
    height: `${chunkSize}px`,
    left: `${px}px`,
    top: `${py}px`
  };
}

</script>

<template>
  <div class='board' ref='board'>
    <div class='chunk' v-for='(item, index) in items' :key='`chunk_${index}`' :style="style_chunk(index)"
      v-on:mousemove="console.log(index,points[index].x, points[index].y, points[index].z)">
      <div class ='role'>
        <MiniRole ref="mr" v-if="Math.random() > 0.8"></MiniRole>
      </div>
    </div>
  </div>
</template>

<style scoped>
.board {
  position: relative;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(10px);
  flex-direction: column;

  background: hsl(180, 3%, 41%);

  overflow: hidden;

  /** 文字无法选中 */
  user-select: none;  
}

.chunk {
  display: flex;
  position: absolute;
  transform: translate(-50%, -50%);
  background: hsl(0, 0%, 19%);
  clip-path: polygon(50% 0%, calc(50% + 43.301%) 25%, calc(50% + 43.301%) 75%, 50% 100%, calc(50% - 43.301%) 75%, calc(50% - 43.301%) 25%);
  
  align-items: center;
  justify-content: center;

}
.chunk:hover{
   background: hsl(0, 0%, 31%);
}

.role{
  width: 80%;
  height: 80%;
}

.role:hover{
  width: 90%;
  height: 90%;
}
</style>
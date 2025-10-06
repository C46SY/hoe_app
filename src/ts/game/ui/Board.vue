<script lang="ts">
import { computed, reactive, ref } from 'vue'

type GameState = 'playing' | 'win' | 'lose'

interface HexCell {
  q: number
  r: number
  s: number
  index: number
}

const HEX_DIRECTIONS = [
  { q: 1, r: 0, s: -1 },
  { q: 1, r: -1, s: 0 },
  { q: 0, r: -1, s: 1 },
  { q: -1, r: 0, s: 1 },
  { q: -1, r: 1, s: 0 },
  { q: 0, r: 1, s: -1 }
]

function axialDistance(a: HexCell, b: HexCell) {
  return Math.max(Math.abs(a.q - b.q), Math.abs(a.r - b.r), Math.abs(a.s - b.s))
}

function generateHexGrid(radius: number): HexCell[] {
  const cells: HexCell[] = []
  let index = 0
  for (let q = -radius; q <= radius; q++) {
    const r1 = Math.max(-radius, -q - radius)
    const r2 = Math.min(radius, -q + radius)
    for (let r = r1; r <= r2; r++) {
      const s = -q - r
      cells.push({ q, r, s, index: index++ })
    }
  }
  return cells
}
</script>

<script setup lang="ts">
const radius = 6
const minSize = 35
const maxSize = 110
const sizeStep = 6
const initialObstacleRatio = 0.14

const cells = generateHexGrid(radius)
const centerCell = cells.find((cell) => cell.q === 0 && cell.r === 0 && cell.s === 0) ?? cells[0]
const cellSize = ref(60)
const blocked = reactive(new Set<number>())
const catIndex = ref(centerCell.index)
const gameState = ref<GameState>('playing')

const totalCells = cells.length
const hexHeight = computed(() => cellSize.value * 2)
const hexWidth = computed(() => Math.sqrt(3) * cellSize.value)

const layout = computed(() => {
  const positions = cells.map((cell) => ({
    x: hexWidth.value * (cell.q + cell.r / 2),
    y: (3 / 2) * cellSize.value * cell.r
  }))

  const xs = positions.map((position) => position.x)
  const ys = positions.map((position) => position.y)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)

  const offsetPositions = positions.map((position) => ({
    left: position.x - minX + hexWidth.value / 2,
    top: position.y - minY + hexHeight.value / 2
  }))

  return {
    positions: offsetPositions,
    width: maxX - minX + hexWidth.value,
    height: maxY - minY + hexHeight.value
  }
})

const boardInnerStyle = computed(() => ({
  width: `${layout.value.width}px`,
  height: `${layout.value.height}px`
}))

const message = computed(() => {
  switch (gameState.value) {
    case 'win':
      return '恭喜，你成功围住了猫咪！'
    case 'lose':
      return '糟糕，猫咪逃出了包围圈。'
    default:
      return ''
  }
})

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function handleWheel(event: WheelEvent) {
  event.preventDefault()
  const direction = event.deltaY > 0 ? -1 : 1
  cellSize.value = clamp(cellSize.value + direction * sizeStep, minSize, maxSize)
}

function getNeighbours(index: number) {
  const current = cells[index]
  const neighbours: number[] = []
  for (const direction of HEX_DIRECTIONS) {
    const q = current.q + direction.q
    const r = current.r + direction.r
    const s = current.s + direction.s
    const neighbour = cells.find((cell) => cell.q === q && cell.r === r && cell.s === s)
    if (neighbour) {
      neighbours.push(neighbour.index)
    }
  }
  return neighbours
}

const catNeighbours = getNeighbours(centerCell.index)

function styleChunk(index: number) {
  const position = layout.value.positions[index]

  return {
    width: `${hexWidth.value}px`,
    height: `${hexHeight.value}px`,
    left: `${position.left}px`,
    top: `${position.top}px`
  }
}

function isBlocked(index: number) {
  return blocked.has(index)
}

function seedObstacles() {
  const desiredObstacles = Math.max(8, Math.round(totalCells * initialObstacleRatio))
  const availableIndices = cells
    .map((cell) => cell.index)
    .filter((index) => index !== centerCell.index)

  while (blocked.size < desiredObstacles && availableIndices.length > 0) {
    const pickIndex = Math.floor(Math.random() * availableIndices.length)
    const candidate = availableIndices.splice(pickIndex, 1)[0]

    if (catNeighbours.includes(candidate)) {
      const blockedNeighbours = catNeighbours.filter((neighbour) => neighbour === candidate || blocked.has(neighbour))
      if (blockedNeighbours.length >= catNeighbours.length - 1) {
        continue
      }
    }

    blocked.add(candidate)
  }
}

function generateInitialObstacles() {
  const maxAttempts = 20
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    blocked.clear()
    seedObstacles()
    if (bfsToEdge(centerCell.index)) {
      return
    }
  }

  // Fallback to the last attempt even if no escape route was found to avoid infinite loops
}

function bfsToEdge(startIndex: number) {
  const visited = new Set<number>()
  const queue: number[] = []
  const parent = new Map<number, number | null>()

  queue.push(startIndex)
  visited.add(startIndex)
  parent.set(startIndex, null)

  while (queue.length > 0) {
    const current = queue.shift() as number
    const cell = cells[current]
    if (axialDistance(cell, centerCell) >= radius) {
      return { goal: current, parent }
    }

    for (const neighbour of getNeighbours(current)) {
      if (visited.has(neighbour) || isBlocked(neighbour)) continue
      visited.add(neighbour)
      parent.set(neighbour, current)
      queue.push(neighbour)
    }
  }

  return null
}

function reconstructPath(goal: number, parent: Map<number, number | null>) {
  const path: number[] = []
  let current: number | null = goal
  while (current !== null) {
    path.unshift(current)
    current = parent.get(current) ?? null
  }
  return path
}

function moveCat() {
  if (gameState.value !== 'playing') return

  const currentCell = cells[catIndex.value]
  if (axialDistance(currentCell, centerCell) >= radius) {
    gameState.value = 'lose'
    return
  }

  const result = bfsToEdge(catIndex.value)
  if (!result) {
    gameState.value = 'win'
    return
  }

  const path = reconstructPath(result.goal, result.parent)
  if (path.length <= 1) {
    gameState.value = 'lose'
    return
  }

  catIndex.value = path[1]

  const newCell = cells[catIndex.value]
  if (axialDistance(newCell, centerCell) >= radius) {
    gameState.value = 'lose'
  }
}

function handleChunkClick(index: number) {
  if (gameState.value !== 'playing') return
  if (index === catIndex.value) return
  if (isBlocked(index)) return

  blocked.add(index)

  const neighbours = getNeighbours(catIndex.value)
  const hasMove = neighbours.some((neighbour) => !isBlocked(neighbour))
  if (!hasMove) {
    gameState.value = 'win'
    return
  }

  moveCat()
}

function resetGame() {
  blocked.clear()
  catIndex.value = centerCell.index
  gameState.value = 'playing'
  generateInitialObstacles()
}

defineExpose({
  resetGame,
  gameState,
  cellSize
})

resetGame()
</script>

<template>
  <div class="board" @wheel.prevent="handleWheel">
    <button type="button" class="board__restart" @click="resetGame">重新开始</button>

    <div class="board__inner" :style="boardInnerStyle">
      <div
        v-for="(_, index) in totalCells"
        :key="`chunk_${index}`"
        class="chunk"
        :class="{
          'chunk--cat': index === catIndex,
          'chunk--blocked': blocked.has(index),
          'chunk--disabled': gameState !== 'playing' || index === catIndex || blocked.has(index)
        }"
        :style="styleChunk(index)"
        @click="handleChunkClick(index)"
      >
        <div v-if="index === catIndex" class="cat">🐱</div>
      </div>
    </div>

    <p class="board__hint">滚动鼠标滚轮缩放格子大小，点击空格封住道路。</p>

    <div v-if="gameState !== 'playing'" class="overlay">
      <div class="overlay__content">
        <p>{{ message }}</p>
        <button type="button" @click="resetGame">重新开始</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.board {
  position: relative;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at top, hsl(200, 44%, 32%), hsl(210, 30%, 18%));
  overflow: hidden;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.board__inner {
  position: relative;
}

.board__restart {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 2;
  border: none;
  border-radius: 999px;
  padding: 0.35rem 1.2rem;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.board__restart:hover {
  background: rgba(0, 0, 0, 0.8);
}

.board__hint {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.9rem;
  background: rgba(0, 0, 0, 0.3);
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  pointer-events: none;
}

.chunk {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(-50%, -50%);
  background: hsl(168, 42%, 62%);
  box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.08);
  transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  clip-path: polygon(
    50% 0%,
    calc(50% + 43.301%) 25%,
    calc(50% + 43.301%) 75%,
    50% 100%,
    calc(50% - 43.301%) 75%,
    calc(50% - 43.301%) 25%
  );
  cursor: pointer;
}

.chunk:hover {
  background: hsl(168, 52%, 72%);
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.4);
}

.chunk--blocked {
  background: hsl(8, 80%, 44%);
  box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.35);
}

.chunk--cat {
  background: hsl(47, 100%, 57%);
  box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.35);
}

.chunk--disabled {
  cursor: not-allowed;
}

.cat {
  font-size: 1.6rem;
}

.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
  z-index: 3;
}

.overlay__content {
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 1.5rem 2rem;
  border-radius: 12px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.overlay__content button {
  border: none;
  border-radius: 999px;
  padding: 0.5rem 1.5rem;
  background: hsl(32, 100%, 50%);
  color: #1b1b1b;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s ease;
}

.overlay__content button:hover {
  background: hsl(32, 100%, 60%);
}
</style>

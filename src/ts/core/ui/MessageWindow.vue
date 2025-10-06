<script setup lang="ts">
// VUE
import { ref, onMounted, onUnmounted } from 'vue'
// OBJECT
import { MessageManager } from 'core/object/tools'

// 行为参数
const UNIFIED_DURATION = 2000  // 统一显示时间（毫秒）

// 消息接口
interface Message {
  id: string
  text: string
  type: 'info' | 'success' | 'warning' | 'error'
  duration: number
  timer?: number
}

// 响应式数据
const messages = ref<Message[]>([])

// 添加消息
const addMessage = (message: Omit<Message, 'id'>) => {
  const id = Date.now().toString()
  
  // 所有消息都使用统一的显示时间，强制自动消失
  const newMessage: Message = { ...message, id, duration: UNIFIED_DURATION }
  
  messages.value.push(newMessage)
  
  // 设置自动消失 - 所有消息都自动消失
  newMessage.timer = setTimeout(() => {
    removeMessage(id)
  }, UNIFIED_DURATION)
}

// 移除消息
const removeMessage = (id: string) => {
  const index = messages.value.findIndex(msg => msg.id === id)
  if (index > -1) {
    const message = messages.value[index]
    if (message.timer) {
      clearTimeout(message.timer)
    }
    messages.value.splice(index, 1)
  }
}

// 获取消息图标
const getMessageIcon = (type: string) => {
  switch (type) {
    case 'success': return '✅'
    case 'warning': return '⚠️'
    case 'error': return '❌'
    default: return 'ℹ️'
  }
}

// 监听消息事件
onMounted(() => {
  MessageManager.onShowMessage(addMessage)
})

onUnmounted(() => {
  // 清理所有定时器
  messages.value.forEach(msg => {
    if (msg.timer) {
      clearTimeout(msg.timer)
    }
  })
})
</script>

<template>
  <div class="message-window">
    <TransitionGroup name="message" tag="div" class="message-list">
      <div 
        v-for="message in messages"
        :key="message.id"
        :class="['message-item', `message-${message.type}`]"
        @click="removeMessage(message.id)"
      >
        <div class="message-icon">{{ getMessageIcon(message.type) }}</div>
        <div class="message-text">{{ message.text }}</div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.message-window {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-end;
}

.message-item {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 180px;
  max-width: 300px;
  padding: 6px 12px;
  border-radius: 5px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  pointer-events: auto;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.message-item:hover {
  transform: translateX(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

/* 消息类型样式 */
.message-info {
  background: rgba(100, 150, 255, 0.9);
  border-left: 3px solid #4a90e2;
  color: black;
}

.message-success {
  background: rgba(46, 204, 113, 0.9);
  border-left: 3px solid #27ae60;
  color: black;
}

.message-warning {
  background: rgba(255, 193, 7, 0.9);
  border-left: 3px solid #f39c12;
  color: black;
}

.message-error {
  background: rgba(231, 76, 60, 0.9);
  border-left: 3px solid #c0392b;
  color: black;
}

.message-icon {
  font-size: 12px;
  flex-shrink: 0;
}

.message-text {
  flex: 1;
  font-size: 11px;
  line-height: 1.2;
  word-break: break-word;
}

/* 动画效果 */
.message-enter-active,
.message-leave-active {
  transition: all 0.3s ease;
}

.message-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.message-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.message-move {
  transition: transform 0.3s ease;
}
</style> 
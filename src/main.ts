import { createApp } from "vue";
import { createPinia } from 'pinia'
import App from "./ts/App.vue";

// 修改程序界面设置
// 1. 禁用鼠标右键菜单
document.addEventListener('contextmenu', (e) => e.preventDefault());


// 创建 Pinia 实例
const pinia = createPinia()

// 创建 Vue 应用
const app = createApp(App)

// 使用 Pinia
app.use(pinia)

// 挂载应用
app.mount('#app')
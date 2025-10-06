<!-- 通用下拉菜单 -->
<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  options: {
    type: Array,
    default: () => [],
    required: true,
  },
  maxHeight: {
    type: String,
    default: "200px",
  },
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(false);
const selectWrapper = ref(null);

const selectedValue = computed(() => {
  return props.modelValue;
});

function toggleDropdown() {
  if (props.options.length == 0) {
    isOpen.value = false;
  } else {
    isOpen.value = !isOpen.value;
  }
}

function selectOption(option) {
  emit("update:modelValue", option);
  isOpen.value = false;
}

function handleClickOutside(event) {
  if (selectWrapper.value && !selectWrapper.value.contains(event.target)) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="ui-select" ref="selectWrapper">
    <!-- 自定义触发按钮 -->
    <div
      class="select"
      :class="{ 'is-open': isOpen, 'disabled': options.length == 0 }"
      @click="toggleDropdown"
    >
      {{ selectedValue }}
    </div>

    <!-- 下拉菜单 -->
    <div
      v-show="isOpen"
      class="select-dropdown"
      :style="{ maxHeight: maxHeight }"
    >
      <div
        v-for="(option, index) in options"
        :key="index"
        class="select-option"
        :class="{ 'is-selected': option === modelValue }"
        @click="selectOption(option)"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.ui-select {
  display: flex;
  position: relative;

  height: 100%;
  width: 100%;
}

.select {
  display: flex;
  height: 100%;
  width: 100%;
}

.select-dropdown {
  display: flex;
  flex-flow: column;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  border-radius: 0 0 4px 4px;

  padding: 2px;
  gap: 2px;
  z-index: 1000;
  overflow-y: auto;
}

.select-option {
  display: flex;
}
</style>

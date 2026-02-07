<script setup lang="ts">
import { Laptop, Moon, Sun } from '@icon-park/vue-next'
import { useColorMode } from '@vueuse/core'

const mode = useColorMode({
  emitAuto: true,
})

function toggleTheme() {
  if (mode.value === 'auto') {
    mode.value = 'light'
  }
  else if (mode.value === 'light') {
    mode.value = 'dark'
  }
  else { mode.value = 'auto' }
}
</script>

<template>
  <button class="theme-toggle" :title="`Toggle Theme (${mode})`" @click="toggleTheme()">
    <Laptop v-if="mode === 'auto'" size="18" />
    <Moon v-else-if="mode === 'dark'" size="18" />
    <Sun v-else size="18" />
  </button>
</template>

<style scoped lang="scss">
.theme-toggle {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  cursor: pointer;
  color: var(--el-text-color-primary);
  transition: color 0.3s;

  &:hover {
    color: var(--el-color-primary);
  }
}
</style>

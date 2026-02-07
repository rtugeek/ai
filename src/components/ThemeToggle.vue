<script setup lang="ts">
import { Moon, Sun } from '@icon-park/vue-next'
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <button class="theme-toggle" title="Toggle Theme" @click="toggleDark()">
    <Moon v-if="isDark" size="18" />
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

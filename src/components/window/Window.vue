<script setup lang="ts">
import '@/assets/main.css'
</script>

<template>
  <div class="window">
    <slot name="title" />
    <div class="window-body">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
.window {
    box-sizing: border-box;
    width: 100vw;
    height: 100vh;
    font-size: 16px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: var(--background-color);
    color: var(--color);
}
.window-body{
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100vw;
  overflow: auto;
  height: var(--window-body-height);
}
</style>

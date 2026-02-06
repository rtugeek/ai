<script setup lang="ts">
</script>

<template>
  <div class="window">
    <slot name="title" />
    <div class="window-body">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.window-body{
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100vw;
  overflow: auto;
  height: calc(100vh - var(--window-title-bar-height));
}
</style>

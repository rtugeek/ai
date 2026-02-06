<script setup lang="ts">
defineProps({
  src: {
    type: String,
    required: true,
  },
  glowColor: {
    type: String,
  },
})
</script>

<template>
  <img class="emoji-logo" :src="src" :style="{ filter: glowColor ? `drop-shadow(0 3px 0.5rem ${glowColor})` : 'none' }">
</template>

<style scoped lang="scss">
.emoji-logo{
  height: 1.6rem;
  width: auto;
  color: #3d88d7;
}
</style>

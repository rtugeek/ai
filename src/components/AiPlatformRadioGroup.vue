<script setup lang="ts">
import type { AIPlatform } from '@/widgets/ai/ChatGptConfig'

const model = defineModel({ default: 'chatgpt' })

function onPlatformClick(platform: AIPlatform) {
  model.value = platform
}
</script>

<template>
  <div class="flex gap-6 platform-radio-group">
    <div class="flex gap-1 cursor-pointer" :class="{ active: model == 'chatgpt' }" @click="onPlatformClick('chatgpt')">
      <img src="@/assets/chatgpt-icon.png" class="logo">ChatGPT - OpenAI
    </div>
    <div class="flex gap-1 cursor-pointer" :class="{ active: model == 'gemini' }" @click="onPlatformClick('gemini')">
      <img src="@/assets/google-gemini-icon.png" class="logo"> Gemini - Google
    </div>
  </div>
</template>

<style scoped lang="scss">
.platform-radio-group{
  img {
    width: 28px;
    height: 28px;
    filter: grayscale(100%);
    transition: all 0.3s ease;
  }

  .active {
    color: #409eff;
    img {
      filter: grayscale(0%);
    }
  }
}
</style>

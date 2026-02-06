<script setup lang="ts">
import type { AiPlatform } from '@/utils/AiUtils'

const props = defineProps({
  maxCount: {
    type: Number,
    default: 1,
  },
})
const model = defineModel({ default: ['deepseek'] })
function onPlatformClick(platform: AiPlatform) {
  if (props.maxCount === 1) {
    model.value = [platform]
  }
  else {
    if (model.value.includes(platform)) {
      if (model.value.length > 1) {
        model.value = model.value.filter(item => item !== platform)
      }
    }
    else {
      if (model.value.length >= props.maxCount) {
        model.value.shift()
      }
      model.value.push(platform)
    }
  }
}
</script>

<template>
  <div class="flex gap-6 platform-radio-group">
    <div
      class="flex gap-1 cursor-pointer" :class="{ active: model.includes('deepseek') }"
      @click="onPlatformClick('deepseek')"
    >
      <img src="@/assets/deepseek.png" class="logo" alt="DeepSeek"> DeepSeek
    </div>
    <div class="flex gap-1 cursor-pointer" :class="{ active: model.includes('chatgpt') }" @click="onPlatformClick('chatgpt')">
      <img src="@/assets/chatgpt-icon.png" alt="ChatGPT" class="logo">ChatGPT
    </div>
    <div class="flex gap-1 cursor-pointer" :class="{ active: model.includes('gemini') }" @click="onPlatformClick('gemini')">
      <img src="@/assets/google-gemini-icon.png" alt="Gemini" class="logo"> Gemini
    </div>
  </div>
</template>

<style scoped lang="scss">
.platform-radio-group {
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

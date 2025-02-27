<script setup lang="ts">
import { computed, nextTick, onMounted, watch } from 'vue'
import type { AiPlatform } from '@/utils/AiUtils'
import { AiUtils } from '@/utils/AiUtils'
import 'driver.js/dist/driver.css'
import { delay } from '@widget-js/core'
import { driver } from 'driver.js'
import { storeToRefs } from 'pinia'
import { useConfigStore } from '@/store/useConfigStore'

const model = defineModel<AiPlatform>()
const selectedAiService = computed(() => {
  return AiUtils.get(model.value)
})

const config = useConfigStore()
const { tipProgress } = storeToRefs(config)

async function showTip() {
  await delay(3000)
  if (tipProgress.value == 1) {
    const driverObj = driver({
      allowClose: false,
      showButtons: ['next'],
      doneBtnText: '知道了',
      onNextClick: () => {
        tipProgress.value = 2
        driverObj.moveNext()
      },
      onCloseClick: () => {
        driverObj.destroy()
      },
      steps: [{
        element: '#ai-select',
        popover: {
          title: '选择您的AI服务',
          description: '支持切换DeepSeek、Kimi、豆包等国内主流AI服务',
        },
      }],
    })
    driverObj.drive()
  }
}

watch(tipProgress, () => {
  showTip()
})

onMounted(async () => {
  await nextTick()
  showTip()
})
</script>

<template>
  <el-select id="ai-select" v-model="model" placeholder="选择AI平台">
    <template #label>
      <div class="flex items-center gap-2">
        <img :src="selectedAiService.logo" class="logo" alt="ai.name"> {{ selectedAiService.name }}
      </div>
    </template>
    <el-option-group label="国内AI">
      <el-option v-for="ai in AiUtils.chinaAiServices" :key="ai.value" :label="ai.name" :value="ai.value">
        <div class="flex items-center gap-2">
          <img :src="ai.logo" class="logo" alt="ai.name"> {{ ai.name }}
        </div>
      </el-option>
    </el-option-group>
    <el-option-group label="国外AI（需要科学上网）">
      <el-option v-for="ai in AiUtils.usAiServices" :key="ai.value" :label="ai.name" :value="ai.value">
        <div class="flex items-center gap-2">
          <img :src="ai.logo" class="logo" alt="ai.name"> {{ ai.name }}
        </div>
      </el-option>
    </el-option-group>
  </el-select>
</template>

<style scoped lang="scss">
.logo{
  width: 24px;
  height: 24px;
}
</style>

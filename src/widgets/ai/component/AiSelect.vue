<script setup lang="ts">
import { computed, nextTick, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { delay } from '@widget-js/core'
import { driver } from 'driver.js'
import type { AiPlatform } from '@/utils/AiUtils'
import { AiUtils } from '@/utils/AiUtils'
import 'driver.js/dist/driver.css'
import { useConfigStore } from '@/store/useConfigStore'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
      doneBtnText: t('know'),
      onNextClick: () => {
        tipProgress.value = 2
        driverObj.moveNext()
      },
      onCloseClick: () => {
        driverObj.destroy()
      },
      steps: [{
        element: '.ai-select',
        popover: {
          title: t('selectAiTitle'),
          description: t('selectAiDesc'),
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
  <el-select v-model="model" class="ai-select" :placeholder="t('selectAiPlaceholder')">
    <template #label>
      <div class="flex items-center gap-2">
        <img :src="selectedAiService.logo" class="logo" alt="ai.name"> {{ selectedAiService.name }}
      </div>
    </template>
    <el-option-group :label="t('usAi')">
      <el-option v-for="ai in AiUtils.usAiServices" :key="ai.value" :label="ai.name" :value="ai.value">
        <div class="flex items-center gap-2">
          <img :src="ai.logo" class="logo" alt="ai.name"> {{ ai.name }}
        </div>
      </el-option>
    </el-option-group>
    <el-option-group :label="t('chinaAi')">
      <el-option v-for="ai in AiUtils.chinaAiServices" :key="ai.value" :label="ai.name" :value="ai.value">
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

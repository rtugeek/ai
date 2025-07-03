<script setup lang="ts">
import { GridTwo, LayoutTwo, Pin, Pushpin, Setting, WebPage } from '@icon-park/vue-next'
import { storeToRefs } from 'pinia'
import { BrowserWindowApi, WidgetApi, delay } from '@widget-js/core'
import { driver } from 'driver.js'
import { nextTick, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useConfigStore } from '@/store/useConfigStore'

const configStore = useConfigStore()
const { alwaysTop, pageCount, tipProgress } = storeToRefs(configStore)
const { t } = useI18n()
async function showTip() {
  await delay(1000)
  if (tipProgress.value == 2) {
    const driverObj = driver({
      allowClose: false,
      showButtons: ['next'],
      doneBtnText: t('know'),
      onNextClick: () => {
        tipProgress.value = 3
        driverObj.moveNext()
      },
      onCloseClick: () => {
        driverObj.destroy()
      },
      steps: [{
        element: '#two-line',
        popover: {
          title: t('twoLineTitle'),
          description: t('twoLineDesc'),
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
  <div class="setting-header">
    <div class="banner" @click="BrowserWindowApi.openUrl('https://widgetjs.cn', { external: true })">
      <img src="@/assets/robot.png">{{ t('aiAssistant') }}
    </div>
    <div class="ml-auto">
      <el-tooltip :content="t('singlePage')">
        <el-button :type="pageCount == 1 ? 'primary' : ''" @click="pageCount = 1">
          <WebPage />
        </el-button>
      </el-tooltip>
      <el-tooltip :content="t('twoLine')">
        <el-button id="two-line" :type="pageCount == 2 ? 'primary' : ''" @click="pageCount = 2">
          <LayoutTwo />
        </el-button>
      </el-tooltip>
      <el-tooltip :content="t('fourGrid')">
        <el-button :type="pageCount == 4 ? 'primary' : ''" @click="pageCount = 4">
          <GridTwo />
        </el-button>
      </el-tooltip>
      <el-tooltip :content="t('setting')">
        <el-button @click="WidgetApi.openConfigPage()">
          <Setting />
        </el-button>
      </el-tooltip>
      <el-tooltip :content="t('alwaysTop')">
        <el-button :type="alwaysTop ? 'primary' : ''" @click="alwaysTop = !alwaysTop">
          <Pushpin v-if="alwaysTop" /><Pin v-else />
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<style scoped lang="scss">
.setting-header{
  z-index: 2;
  align-items: center;
  display: flex;
  .banner{
    display: flex;
    align-items: center;
    color: white;
    cursor: pointer;
    gap: 0.5rem;
    font-weight: bold;
    font-size: 1rem;
    img{
      width: 24px;
    }
  }

}
</style>

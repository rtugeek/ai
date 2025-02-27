<script setup lang="ts">
import { GridTwo, LayoutTwo, Pin, Pushpin, Setting, WebPage } from '@icon-park/vue-next'
import { storeToRefs } from 'pinia'
import { BrowserWindowApi, WidgetApi, delay } from '@widget-js/core'
import { driver } from 'driver.js'
import { nextTick, onMounted, watch } from 'vue'
import { useConfigStore } from '@/store/useConfigStore'

const configStore = useConfigStore()
const { alwaysTop, pageCount, tipProgress } = storeToRefs(configStore)
async function showTip() {
  await delay(1000)
  if (tipProgress.value == 2) {
    const driverObj = driver({
      allowClose: false,
      showButtons: ['next'],
      doneBtnText: '知道了',
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
          title: '设置双行布局',
          description: '设置双行布局，可以同时使用两个AI服务，对比效果',
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
      <img src="@/assets/widget.png">AI 助手
    </div>
    <div class="ml-auto">
      <el-tooltip content="单页布局">
        <el-button :type="pageCount == 1 ? 'primary' : ''" @click="pageCount = 1">
          <WebPage />
        </el-button>
      </el-tooltip>
      <el-tooltip content="双行布局">
        <el-button id="two-line" :type="pageCount == 2 ? 'primary' : ''" @click="pageCount = 2">
          <LayoutTwo />
        </el-button>
      </el-tooltip>
      <el-tooltip content="四格布局">
        <el-button :type="pageCount == 4 ? 'primary' : ''" @click="pageCount = 4">
          <GridTwo />
        </el-button>
      </el-tooltip>
      <el-tooltip content="设置">
        <el-button @click="WidgetApi.openConfigPage()">
          <Setting />
        </el-button>>
      </el-tooltip>
      <el-tooltip content="置顶">
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

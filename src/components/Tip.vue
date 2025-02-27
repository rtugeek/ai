<script setup lang="ts">
import { WidgetApi } from '@widget-js/core'
import { useWidgetParams } from '@widget-js/vue3'
import { storeToRefs } from 'pinia'
import { useConfigStore } from '@/store/useConfigStore'

const widgetParams = useWidgetParams()
const configStore = useConfigStore()
const { tipProgress } = storeToRefs(configStore)
function closeTip() {
  tipProgress.value = 1
}

function openSetting() {
  WidgetApi.openConfigPage(widgetParams.id)
}
</script>

<template>
  <div v-if="tipProgress == 0" class="tips">
    <h3>使用说明</h3>
    <ol>
      <li>默认快捷键 <b class="blue">Win + Alt + C</b></li>
      <li><b>ChatGPT</b>、<b>Gemini</b>需要科学上网才能正常使用</li>
      <li>科学上网IP需要避开香港、澳门等不能使用的区域</li>
    </ol>
    <div class="button">
      <el-button type="warning" @click="openSetting">
        设置页面
      </el-button>
      <el-button type="primary" @click="closeTip">
        知道了
      </el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tips{
  display: flex;
  position: absolute;
  width: calc(100% - 16px * 2);
  height: calc(100% - 16px * 2);
  background: white;
  flex-direction: column;
  font-weight: normal;
  justify-content: center;
  align-items: center;
  z-index: 100;
  gap: 1rem;
  b.blue{
    color: #0099ff
  }
  font-size: 18px;

  .button{
    display: flex;
  }

  ol{
    max-width: 500px;
  }
  h3{
    font-size: 20px;
    font-weight: 600;
    margin: 0;
    padding: 0;
  }

}
</style>

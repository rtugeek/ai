<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { WidgetApi } from '@widget-js/core'
import { useWidgetParams } from '@widget-js/vue3'
import AiPlatformRadioGroup from '@/components/AiPlatformRadioGroup.vue'
import { useConfig } from '@/composition/useConfig'

const widgetParams = useWidgetParams()
const showTip = useStorage('tip-3', true)
const { config } = useConfig()
function closeTip() {
  showTip.value = false
}

function openSetting() {
  WidgetApi.openConfigPage(widgetParams.id)
}
</script>

<template>
  <div v-if="showTip" class="tips">
    <h3>使用说明</h3>
    <ol>
      <li>组件需要科学上网才能正常使用</li>
      <li>科学上网IP需要避开香港、澳门等不能使用的区域</li>
    </ol>
    <el-form-item label="选择AI平台">
      <AiPlatformRadioGroup v-model="config.platform" />
    </el-form-item>
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
  justify-content: center;
  align-items: center;
  z-index: 100;
  gap: 1rem;
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

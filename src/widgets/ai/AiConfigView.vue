<script lang="ts" setup>
import { reactive } from 'vue'
import { WidgetBindShortcutField, WidgetConfigOption, useWidgetParams } from '@widget-js/vue3'
import { storeToRefs } from 'pinia'
import { useConfigStore } from '@/store/useConfigStore'
import AiPlatformRadioGroup from '@/components/AiPlatformRadioGroup.vue'

const widgetParams = useWidgetParams()
const configStore = useConfigStore()
const { config, position } = storeToRefs(configStore)

const widgetConfigOption = reactive(new WidgetConfigOption({
  custom: true,
}))
function save() {
  window.close()
}
</script>

<template>
  <widget-edit-dialog
    :widget-params="widgetParams"
    :option="widgetConfigOption"
    @confirm="save"
  >
    <template #custom>
      <el-form :label-width="90" label-position="left">
        <el-form-item label="AI平台">
          <AiPlatformRadioGroup v-model="config.platform" />
        </el-form-item>
        <el-form-item label="呼出快捷键">
          <WidgetBindShortcutField v-model="config.shortcut" />
        </el-form-item>
        <el-form-item label="代理协议">
          <el-radio-group v-model="config.protocol">
            <el-radio label="http">
              HTTP
            </el-radio>
            <el-radio label="https">
              HTTPS
            </el-radio>
            <el-radio label="sock4">
              SOCK4
            </el-radio>
            <el-radio label="sock5">
              SOCK5
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="代理服务器">
          <el-input v-model="config.host" class="flex-1" placeholder="如：127.0.0.1" />
        </el-form-item>
        <el-form-item label="代理端口">
          <el-input v-model="config.port" style="width: 50px" placeholder="如：7890" />
        </el-form-item>
        <el-form-item label="窗口位置">
          <el-radio-group v-model="position">
            <el-radio value="left" label="左侧" />
            <el-radio value="right" label="右侧" />
          </el-radio-group>
        </el-form-item>
      </el-form>
    </template>
  </widget-edit-dialog>
</template>

<style scoped>

</style>

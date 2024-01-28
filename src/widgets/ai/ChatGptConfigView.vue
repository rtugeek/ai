<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { BindShortcutField, WidgetConfigOption, useWidget } from '@widget-js/vue3'
import { ChatGptConfigData } from '@/widgets/model/ChatGptConfigData'

const shortcut = ref('Meta+Alt+C')

const { widgetData, widgetParams, save } = useWidget(ChatGptConfigData, {
  loadDataByWidgetName: true,
  onDataLoaded: async (data) => {
    shortcut.value = data?.shortcut ?? ''
  },
})

const widgetConfigOption = reactive(new WidgetConfigOption({
  custom: true,
}))
</script>

<template>
  <widget-edit-dialog
    v-model="widgetData"
    :widget-params="widgetParams"
    :option="widgetConfigOption"
    @apply="save"
    @confirm="save({ closeWindow: true })"
  >
    <template #custom>
      <el-form :label-width="90" label-position="left">
        <el-form-item label="呼出快捷键">
          <BindShortcutField v-model="shortcut" />
        </el-form-item>
        <el-form-item label="代理协议">
          <el-radio-group v-model="widgetData.protocol">
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
          <el-input v-model="widgetData.host" class="flex-1" placeholder="如：127.0.0.1" />
        </el-form-item>
        <el-form-item label="代理端口">
          <el-input v-model="widgetData.port" style="width: 50px" placeholder="如：7890" />
        </el-form-item>
      </el-form>
    </template>
  </widget-edit-dialog>
</template>

<style scoped>

</style>

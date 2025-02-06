<script lang="ts" setup>
import { WidgetBindShortcutField } from '@widget-js/vue3'
import { storeToRefs } from 'pinia'
import { useConfigStore } from '@/store/useConfigStore'
import AiPlatformRadioGroup from '@/components/AiPlatformRadioGroup.vue'

const configStore = useConfigStore()
const { config, position, platforms } = storeToRefs(configStore)
</script>

<template>
  <widget-base-dialog title="组件设置">
    <template #body>
      <el-form :label-width="140" label-position="left">
        <el-form-item label="AI平台（可选2个）">
          <AiPlatformRadioGroup v-model="platforms" :max-count="2" />
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
  </widget-base-dialog>
</template>

<style scoped>

</style>

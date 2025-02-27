<script lang="ts" setup>
import { WidgetBindShortcutField } from '@widget-js/vue3'
import { storeToRefs } from 'pinia'
import { useConfigStore } from '@/store/useConfigStore'

const configStore = useConfigStore()
const { config, position, windowWidthRatio } = storeToRefs(configStore)
</script>

<template>
  <widget-base-dialog title="组件设置">
    <template #body>
      <el-form :label-width="140" label-position="left">
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
        <el-form-item label="窗口大小">
          <el-radio-group v-model="windowWidthRatio">
            <el-radio :value="0.2" label="20%" />
            <el-radio :value="0.3" label="30%" />
            <el-radio :value="0.4" label="40%" />
            <el-radio :value="0.5" label="50%" />
          </el-radio-group>
        </el-form-item>
      </el-form>
    </template>
  </widget-base-dialog>
</template>

<style scoped>

</style>

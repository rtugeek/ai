<script lang="ts" setup>
import { WidgetBindShortcutField, useWidgetProxyConfig } from '@widget-js/vue3'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useConfigStore } from '@/store/useConfigStore'

const configStore = useConfigStore()
const { config: proxyConfig } = useWidgetProxyConfig()
const { config, position, windowWidthRatio } = storeToRefs(configStore)
const { t } = useI18n()
</script>

<template>
  <widget-base-dialog :title="t('configTitle')">
    <template #body>
      <el-form :label-width="140" label-position="left">
        <el-form-item :label="t('shortcut')">
          <WidgetBindShortcutField v-model="config.shortcut" />
        </el-form-item>
        <el-form-item :label="t('position')">
          <el-radio-group v-model="position">
            <el-radio value="left">
              {{ t('left') }}
            </el-radio>
            <el-radio value="right">
              {{ t('right') }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <WidgetProxyField v-model:host="proxyConfig.host" v-model:protocol="proxyConfig.protocol" v-model:port="proxyConfig.port" :label-width="140" />
        <el-form-item :label="t('windowSize')">
          <el-radio-group v-model="windowWidthRatio">
            <el-radio :value="0.2">
              {{ t('percent20') }}
            </el-radio>
            <el-radio :value="0.3">
              {{ t('percent30') }}
            </el-radio>
            <el-radio :value="0.4">
              {{ t('percent40') }}
            </el-radio>
            <el-radio :value="0.5">
              {{ t('percent50') }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </template>
  </widget-base-dialog>
</template>

<style>
.title-bar{
  app-region: drag;
}
.actions{
  app-region: no-drag;
  cursor: pointer;
}
</style>

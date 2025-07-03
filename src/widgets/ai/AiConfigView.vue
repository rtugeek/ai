<script lang="ts" setup>
import { WidgetBindShortcutField } from '@widget-js/vue3'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useConfigStore } from '@/store/useConfigStore'

const configStore = useConfigStore()
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
        <el-form-item :label="t('protocol')">
          <el-radio-group v-model="config.protocol">
            <el-radio label="http">
              {{ t('http') }}
            </el-radio>
            <el-radio label="https">
              {{ t('https') }}
            </el-radio>
            <el-radio label="sock4">
              {{ t('sock4') }}
            </el-radio>
            <el-radio label="sock5">
              {{ t('sock5') }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="t('host')">
          <el-input v-model="config.host" class="flex-1" :placeholder="`${t('host')} 127.0.0.1`" />
        </el-form-item>
        <el-form-item :label="t('port')">
          <el-input v-model="config.port" style="width: 50px" :placeholder="`${t('port')} 7890`" />
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

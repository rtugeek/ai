<script lang="ts" setup>
import { useAppLanguage } from '@widget-js/vue3'
import consola from 'consola'
import { i18n } from '@/i18n'

function updateLang(lang: string) {
  i18n.global.locale = lang
}
useAppLanguage({
  onLoad: (lang) => {
    consola.info(`Language: ${lang}`)
    updateLang(lang)
  },
  onChange: (lang) => {
    updateLang(lang)
    consola.info(`Language changed to: ${lang}`)
  },
})
</script>

<template>
  <router-view />
</template>

<style lang="scss">
@import "common/css/common.css";
</style>

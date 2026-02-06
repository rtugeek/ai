<script setup lang="ts">
import { ref } from 'vue'

const model = defineModel<string>()
const languages = ref([
  { value: 'en', label: 'English' },
  { value: 'zh', label: '中文' },
  { value: 'es', label: 'Español' },
  { value: 'hi', label: 'हिन्दी' },
  { value: 'ar', label: 'العربية' },
  { value: 'pt', label: 'Português' },
  { value: 'bn', label: 'বাংলা' },
  { value: 'ru', label: 'Русский' },
  { value: 'ja', label: '日本語' },
  { value: 'pa', label: 'ਪੰਜਾਬੀ' },
  { value: 'de', label: 'Deutsch' },
  { value: 'ko', label: '한국어' },
  { value: 'fr', label: 'Français' },
  { value: 'te', label: 'తెలుగు' },
  { value: 'mr', label: 'मराठी' },
  { value: 'ta', label: 'தமிழ்' },
  { value: 'ur', label: 'اردو' },
  { value: 'it', label: 'Italiano' },
  { value: 'tr', label: 'Türkçe' },
  { value: 'fa', label: 'فارسی' },
])
</script>

<template>
  <el-select v-model="model" filterable placeholder="选择语言">
    <el-option
      v-for="language in languages"
      :key="language.value"
      :label="language.label"
      :value="language.value"
    />
  </el-select>
</template>

<style scoped lang="scss">

</style>

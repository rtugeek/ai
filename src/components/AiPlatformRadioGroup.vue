<script setup lang="ts">
const model = defineModel({ default: 'chatgpt' })
</script>

<template>
  <el-radio-group v-model="model">
    <el-radio value="chatgpt">
      ChatGPT - OpenAI
    </el-radio>
    <el-radio value="gemini">
      Gemini - Google
    </el-radio>
  </el-radio-group>
</template>

<style scoped lang="scss">

</style>

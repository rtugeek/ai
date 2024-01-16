<script setup lang="ts">
import { ref } from 'vue'

const showTips = ref<boolean>(true)
if (localStorage.getItem('tips')) {
  showTips.value = false
}
function closeTip() {
  localStorage.setItem('tips', 'false')
  showTips.value = false
}
</script>

<template>
  <div v-if="showTips" class="tips">
    <h3>使用说明</h3>
    <ol>
      <li>1.组件需要科学上网才能正常使用</li>
      <li>2.科学上网在 鼠标右键 -> 设置 中设置</li>
      <li>3.上网IP需要避开香港、澳门等不能使用的区域</li>
    </ol>
    <div class="button">
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
  ol{
    max-width: 400px;

  }
  h3{
    font-size: 20px;
    font-weight: 600;
    margin: 0;
    padding: 0;
  }

}
</style>

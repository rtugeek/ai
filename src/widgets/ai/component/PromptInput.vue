<script setup lang="ts">
import { Send } from '@icon-park/vue-next'
import { useMagicKeys, useThrottleFn } from '@vueuse/core'
import { watchEffect } from 'vue'

const emits = defineEmits(['send'])
const model = defineModel<string>()
const { shift, enter } = useMagicKeys()

const send = useThrottleFn(() => {
  emits('send')
}, 500)

watchEffect(() => {
  if (shift.value && enter.value) {
    send()
  }
})
</script>

<template>
  <div class="prompt-wrapper">
    <div class="prompt-input">
      <textarea v-model="model" placeholder="给 AI们 发送消息，按 Shift+回车 发送" />
      <div class="send" @click="send">
        <Send size="24" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.prompt-input{
  position: absolute;
  bottom: 16px;
  height: calc(160px - 16px);
  border-radius: 4px;
  transform: translateX(-50%);
  box-sizing: border-box;
  width: var(--widget-inner-width);
  left: 50%;
  z-index: 99;
  textarea{
    resize: none;
    width: 100%;
    font-size: 1rem;
    height: 100%;
    border-radius: 4px;
    box-sizing: border-box;
    background: #f5f5f5;
    padding: 16px;
    border: #bdbdbd 1px solid;
    transition: box-shadow 0.3s ease;
    outline: none;
    &::placeholder{
      color: #969696;
    }
  }

  .send{
    cursor: pointer;
    background: #fc7e4c;
    width: 44px;
    height: 44px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: whitesmoke;
    position: absolute;
    right: 12px;
    bottom: 12px;
    border-radius: 50%;
  }
}

@media (prefers-color-scheme: dark) {
  .prompt-input{
    textarea {
      border: #616168 1px solid;
      background: #3f3f44;
      color: #dcdce5
    }
  }
}
</style>

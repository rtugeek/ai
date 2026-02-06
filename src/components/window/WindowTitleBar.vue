<script setup lang="ts">
import { CloseSmall, Minus, SquareSmall } from '@icon-park/vue-next'
import { BrowserWindowApi } from '@widget-js/core'

defineProps({ title: String })
async function toggleMaximize() {
  (await BrowserWindowApi.isMaximized()) ? BrowserWindowApi.unmaximize() : BrowserWindowApi.maximize()
}

function close() {
  BrowserWindowApi.close()
}
</script>

<template>
  <div v-drag-window class="window-title-bar" @dblclick="toggleMaximize">
    <slot name="title">
      <div class="title">
        <slot name="logo" />
        <div class="title">
          {{ title }}
        </div>
      </div>
    </slot>
    <div class="buttons">
      <div class="button minimize" @click="BrowserWindowApi.minimize()">
        <Minus />
      </div>
      <div class="button maximize" @click="toggleMaximize">
        <SquareSmall />
      </div>
      <div class="button close" @click="close">
        <CloseSmall />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.window-title-bar{
  display: flex;
  width: 100vw;
  height: var(--window-title-bar-height);
  padding: 6px 16px;
  background: var(--surface-background);
  box-sizing: border-box;
  color: var(--color);
  font-weight: bold;
  z-index: 2;
  align-items: center;
  border-bottom: var(--surface-border);
  .title{
    display: flex;
    gap: 0.5rem;
    justify-items: center;
    align-items: center;
  }
  .buttons{
    margin-left: auto;
    display: flex;
    gap:8px;
  }
  .button {
    cursor: pointer;
    width: 18px;
    height: 18px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;

    color: white;
    transition: background 0.3s;
    &.minimize{
      background: #f2b63e;
      &:hover {
        filter: drop-shadow(0 2px 5px #f2b63e);
      }
    }
    &.close{
      background: #ed4f4a;
      &:hover {
        filter: drop-shadow(0 2px 5px #ed4f4a);
      }
    }
    &.maximize{
      background: #5adc41;
      &:hover {
        filter: drop-shadow(0 2px 5px #5adc41);
      }
    }
  }
}
</style>

<template>
  <!--    <chatgpt-search-widget></chatgpt-search-widget>-->
  <webview class=".webview" src="https://chat.openai.com/"
           enableblinkfeatures="PreciseMemoryInfo, CSSVariables"
           :style="{...sizeStyle,backgroundColor:'#fff'}"
           disablewebsecurity></webview>
  <div class="">test</div>
</template>

<script lang="ts" setup>
import {BrowserWindowApi, Channel, ElectronUtils, WidgetData} from "@widget-js/core";
import {useIpcListener, useWidget} from "@widget-js/vue3";

const preloadPath = ElectronUtils.getAPI().preloadPath;
const {widgetData, widgetParams, sizeStyle} = useWidget(WidgetData);
useIpcListener(Channel.BROWSER_WINDOW, async (args) => {
  const event = args[0];
  console.log(event);
  if (event == "blur") {
    await BrowserWindowApi.hide();
  }
})
</script>

<style scoped>

</style>

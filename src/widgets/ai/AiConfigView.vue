<template>
  <widget-edit-dialog :widget-params="widgetParams" :option="widgetConfigOption"
                      :widget-data="widgetData"
                      @confirm="onSaveClick()">
    <template v-slot:form>
      <el-form :label-width="90" label-position="left">
        <el-form-item label="呼出快捷键">
          <bind-shortcut-field v-model:shortcut="shortcut"></bind-shortcut-field>
        </el-form-item>

        <el-form-item label="代理规则">
          <el-input v-model="proxyRule" placeholder="如：http://127.0.0.1:7890"/>
        </el-form-item>
      </el-form>
    </template>
  </widget-edit-dialog>
</template>

<script lang="ts" setup>
import {reactive, ref, watch} from "vue";
import {BindShortcutField, useWidget, WidgetConfigOption} from "@widget-js/vue3";
import {HostedWidgetApi, WidgetData, WidgetDataApi} from "@widget-js/core";

const shortcut = ref("Ctrl+Space");
const proxyRule = ref("");

const {widgetData, widgetParams} = useWidget(WidgetData, {
  onDataLoaded: async (data) => {
    const id = widgetParams.id!;
    const hostedWidget = await HostedWidgetApi.getHostedWidget(id);
    shortcut.value = hostedWidget.shortcut ?? "";
    proxyRule.value = hostedWidget.proxy ?? "";

    watch(shortcut, (newValue) => {
      console.log(newValue);
      HostedWidgetApi.registerActiveShortcut(widgetParams.id!, shortcut.value)
    })
  }
});

const widgetConfigOption = reactive(new WidgetConfigOption({
  custom: true,
  preview: false,
}));


async function onSaveClick() {
  await WidgetDataApi.save(this.widgetData);
  await HostedWidgetApi.setProxy(widgetParams.id!, proxyRule.value);
  window.close();
}

</script>

<style scoped>

</style>

<template>
  <widget-edit-dialog :widget-params="widgetParams" :option="widgetConfigOption"
                      :widget-data="widgetData"
                      @apply="onApplyClick"
                      @confirm="onSaveClick">
    <template v-slot:form>
      <el-form :label-width="90" label-position="left">
        <el-form-item label="呼出快捷键">
          <bind-shortcut-field v-model="shortcut"></bind-shortcut-field>
        </el-form-item>
        <el-form-item label="代理协议">
          <el-radio-group v-model="widgetData.protocol">
            <el-radio label="http">HTTP</el-radio>
            <el-radio label="https">HTTPS</el-radio>
            <el-radio label="sock4">SOCK4</el-radio>
            <el-radio label="sock5">SOCK5</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="代理服务器">
          <el-input class="flex-1" v-model="widgetData.host" placeholder="如：127.0.0.1"/>
        </el-form-item>
        <el-form-item label="代理端口">
          <el-input style="width: 50px" v-model="widgetData.port" placeholder="如：7890"/>
        </el-form-item>
      </el-form>
    </template>
  </widget-edit-dialog>
</template>

<script lang="ts" setup>
import {reactive, ref} from "vue";
import {WidgetDataApi} from "@widget-js/core";
import {BindShortcutField, useWidget, WidgetConfigOption} from "@widget-js/vue3";
import {ChatGptConfigData} from "@/widgets/model/ChatGptConfigData";

const shortcut = ref("Meta+Alt+C");

const {widgetData, widgetParams} = useWidget(ChatGptConfigData, {
  loadDataByWidgetName: true,
  onDataLoaded: async (data) => {
    shortcut.value = data?.shortcut ?? "";
  }
});

const widgetConfigOption = reactive(new WidgetConfigOption({
  custom: true,
  preview: false,
}));

async function onApplyClick() {
  widgetData.value.shortcut = shortcut.value
  console.log('id', widgetData.value);
  console.log('id', widgetParams.id);
  await WidgetDataApi.saveByName(widgetData.value);
}

async function onSaveClick() {
  await onApplyClick();
  window.close();
}

</script>

<style scoped>

</style>

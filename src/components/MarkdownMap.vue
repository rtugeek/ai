<script setup lang="ts">
import { OneToOne, ZoomIn, ZoomOut } from '@icon-park/vue-next'
import { useDebounceFn, useThrottleFn } from '@vueuse/core'
import { delay } from '@widget-js/core'
import { Transformer } from 'markmap-lib'
import { Markmap } from 'markmap-view'
import { nextTick, onMounted, onUpdated, useTemplateRef } from 'vue'

const props = defineProps({
  markdown: {
    type: String,
    default: '### Loading',
  },
})
const emits = defineEmits(['nodeClick'])
let mm: Markmap
const transformer = new Transformer()
const svgRef = useTemplateRef<HTMLElement>('svgRef')

async function update() {
  await nextTick()
  const { root } = transformer.transform(props.markdown)
  mm.setData(root)
  await delay(1000)
  mm.fit()
}
const updateThrottle = useThrottleFn(update, 500)
const updateDebounce = useDebounceFn(update, 500)

onMounted(async () => {
  mm = Markmap.create(svgRef.value)
  await update()
  svgRef.value!.addEventListener('click', (event) => {
    const data = event.target
    if (data instanceof HTMLElement && data?.textContent) {
      const eventData = {
        text: data?.textContent,
        x: event.clientX,
        y: event.clientY,
      }
      emits('nodeClick', eventData)
    }
  })
})

onUpdated(() => {
  updateThrottle()
  updateDebounce()
})

function zoomIn() {
  mm.rescale(1.2)
}

function zoomOut() {
  mm.rescale(0.8)
}

function fit() {
  mm.fit()
}

defineExpose({
  zoomIn,
  zoomOut,
  fit,
})
</script>

<template>
  <div class="mind-map-wrapper">
    <svg ref="svgRef" />
    <div class="tools">
      <el-button-group>
        <el-button size="small" @click="zoomIn">
          <ZoomIn size="18" />
        </el-button>
        <el-button size="small" @click="zoomOut">
          <ZoomOut size="18" />
        </el-button>
        <el-button size="small" @click="fit">
          <OneToOne size="18" />
        </el-button>
      </el-button-group>
    </div>
  </div>
</template>

<style lang="scss">
.mind-map-wrapper{
  position: relative;
  width: 100vw;
  overflow: hidden;
  height: 100%;
  .tools{
    position: absolute;
    bottom: 10px;
    right: 10px;
  }
  svg{
    width: 100%;
    height: 100%;
  }
}
foreignObject{
  cursor: pointer;
  div{
    user-select: none;
  }
}
</style>

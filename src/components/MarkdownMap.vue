<script setup lang="ts">
import { Download, OneToOne, ZoomIn, ZoomOut } from '@icon-park/vue-next'
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

function exportToImage() {
  const svg = svgRef.value
  if (!svg)
    return

  const serializer = new XMLSerializer()
  const source = serializer.serializeToString(svg)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = new Image()

  const { width, height } = svg.getBoundingClientRect()
  const scale = 2
  canvas.width = width * scale
  canvas.height = height * scale

  img.onload = () => {
    if (ctx) {
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.scale(scale, scale)
      ctx.drawImage(img, 0, 0)
      const a = document.createElement('a')
      a.download = 'mindmap.png'
      a.href = canvas.toDataURL('image/png')
      a.click()
    }
  }
  img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(source)))}`
}

defineExpose({
  zoomIn,
  zoomOut,
  fit,
  exportToImage,
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
        <el-button size="small" @click="exportToImage">
          <Download size="18" />
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
    text {
      fill: currentColor;
    }
  }
}
foreignObject{
  cursor: pointer;
  color: var(--color);
  div{
    user-select: none;
  }
}
</style>

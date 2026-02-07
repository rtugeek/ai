<script setup lang="ts">
import { Attention, Copy, Download, OneToOne, ZoomIn, ZoomOut } from '@icon-park/vue-next'
import { ElNotification } from 'element-plus'
import mermaid from 'mermaid'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useDark } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  code?: string
}>()

const { t } = useI18n()
const isDark = useDark()
const mermaidRef = ref<HTMLElement>()
const containerRef = ref<HTMLElement>()
const error = ref('')

// Zoom and Pan state
const scale = ref(1)
const translateX = ref(0)
const translateY = ref(0)
const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)

const transformStyle = computed(() => ({
  transform: `translate(${translateX.value}px, ${translateY.value}px) scale(${scale.value})`,
  transformOrigin: 'center center',
  transition: isDragging.value ? 'none' : 'transform 0.1s ease-out',
}))

function copy() {
  if (!props.code) {
    return
  }
  navigator.clipboard.writeText(props.code)
  ElNotification({
    title: t('notice'),
    message: t('copySuccess'),
    type: 'success',
    position: 'bottom-right',
  })
}

function zoomIn() {
  scale.value = Math.min(5, scale.value + 0.1)
}

function zoomOut() {
  scale.value = Math.max(0.1, scale.value - 0.1)
}

function fitView() {
  if (!containerRef.value || !mermaidRef.value) { return }

  const containerRect = containerRef.value.getBoundingClientRect()
  const contentRect = mermaidRef.value.getBoundingClientRect()

  if (contentRect.width === 0 || contentRect.height === 0) { return }

  const currentScale = scale.value
  const naturalWidth = contentRect.width / currentScale
  const naturalHeight = contentRect.height / currentScale

  const padding = 20
  const scaleX = (containerRect.width - padding * 2) / naturalWidth
  const scaleY = (containerRect.height - padding * 2) / naturalHeight

  scale.value = Math.min(scaleX, scaleY, 1)
  translateX.value = 0
  translateY.value = 0
}

function exportToPng() {
  if (!mermaidRef.value) { return }

  const svg = mermaidRef.value.querySelector('svg')
  if (!svg) {
    ElNotification({
      title: t('error'),
      message: t('svgNotFound'),
      type: 'error',
      position: 'bottom-right',
    })
    return
  }

  // Use clone to modify attributes for export without affecting UI
  const clone = svg.cloneNode(true) as SVGElement

  // Reset styles that might constrain size
  clone.style.maxWidth = 'none'
  clone.style.width = 'auto'
  clone.style.height = 'auto'

  let width = 0
  let height = 0
  const viewBox = clone.getAttribute('viewBox')

  if (viewBox) {
    const parts = viewBox.split(/\s+|,/).filter(Boolean).map(Number)
    if (parts.length === 4) {
      width = parts[2]
      height = parts[3]
      // Explicitly set width/height to match viewBox to ensure full rendering
      clone.setAttribute('width', `${width}px`)
      clone.setAttribute('height', `${height}px`)
    }
  }

  // Fallback if no viewBox or parsing failed
  if (!width || !height) {
    const rect = svg.getBoundingClientRect()
    width = rect.width
    height = rect.height
  }

  const serializer = new XMLSerializer()
  const source = serializer.serializeToString(clone)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = new Image()

  // High resolution
  const scale = 2
  canvas.width = width * scale
  canvas.height = height * scale

  img.onload = () => {
    if (ctx) {
      // Keep transparent background (do not fillRect)
      ctx.scale(scale, scale)
      ctx.drawImage(img, 0, 0)

      const a = document.createElement('a')
      a.download = `mermaid-chart-${Date.now()}.png`
      a.href = canvas.toDataURL('image/png')
      a.click()
    }
  }

  img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(source)))}`
}

async function render() {
  if (!mermaidRef.value || !props.code) {
    return
  }

  mermaid.initialize({
    startOnLoad: false,
    theme: isDark.value ? 'dark' : 'default',
    themeVariables: isDark.value
      ? {
          darkMode: true,
          background: '#1a1a1a',
          primaryColor: '#818cf8',
          lineColor: '#e5e7eb',
        }
      : undefined,
  })

  try {
    await mermaid.parse(props.code)
    // Reset content
    mermaidRef.value.removeAttribute('data-processed')
    mermaidRef.value.innerHTML = props.code

    await mermaid.run({
      nodes: [mermaidRef.value],
    })
    error.value = ''
  }
  catch (e) {
    console.error('Mermaid rendering failed:', e)
    error.value = (e as Error).message
  }
}

// Mouse Event Handlers
function onMouseDown(e: MouseEvent) {
  // Only handle left click
  if (e.button !== 0) { return }

  e.preventDefault()
  isDragging.value = true
  startX.value = e.clientX - translateX.value
  startY.value = e.clientY - translateY.value

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

function onMouseMove(e: MouseEvent) {
  if (!isDragging.value) { return }

  e.preventDefault()
  translateX.value = e.clientX - startX.value
  translateY.value = e.clientY - startY.value
}

function onMouseUp() {
  isDragging.value = false
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
}

function onWheel(e: WheelEvent) {
  // Only zoom if Ctrl is pressed
  if (e.ctrlKey) {
    e.preventDefault()
    const zoomSensitivity = 0.00001
    // Use deltaY for zoom direction
    const delta = -e.deltaY * zoomSensitivity
    // Limit scale between 0.1 and 5
    const newScale = Math.max(0.1, Math.min(5, scale.value + delta * 500)) // Adjusted sensitivity
    scale.value = newScale
  }
}

onMounted(async () => {
  await nextTick()
  render()
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
})

watch(isDark, () => {
  render()
})

watch(() => props.code, () => {
  render()
})
</script>

<template>
  <div
    ref="containerRef"
    class="result flex-2"
    :class="{ 'is-dragging': isDragging }"
    @mousedown="onMouseDown"
    @wheel="onWheel"
  >
    <div :style="transformStyle" class="transform-container">
      <pre ref="mermaidRef" class="mermaid-content" />
    </div>

    <div v-if="error" class="error-toast">
      <Attention theme="outline" size="16" fill="#ed4f4a" class="mr-1 mt-1" />
      <span class="error-text">{{ error }}</span>
    </div>

    <div class="toolbar">
      <div class="btn-icon" :title="t('zoomIn')" @click.stop="zoomIn">
        <ZoomIn />
      </div>
      <div class="btn-icon" :title="t('zoomOut')" @click.stop="zoomOut">
        <ZoomOut />
      </div>
      <div class="btn-icon" :title="t('fitView')" @click.stop="fitView">
        <OneToOne />
      </div>
      <div class="btn-icon" :title="t('exportPng')" @click.stop="exportToPng">
        <Download />
      </div>
      <div class="btn-icon" :title="t('copy')" @click.stop="copy">
        <Copy />
      </div>
    </div>

    <div class="controls-hint">
      {{ t('controlsHint') }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.result {
  border: var(--surface-border);
  border-radius: 8px;
  position: relative;
  flex: 2;
  overflow: hidden;
  cursor: grab;
  user-select: none;

  &.is-dragging {
    cursor: grabbing;
  }

  .transform-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .mermaid-content {
    font-family: inherit;
  }

  .toolbar {
    position: absolute;
    top: 12px;
    right: 12px;
    display: flex;
    gap: 8px;
    z-index: 10;
  }

  .btn-icon {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    opacity: 0.6;
    font-size: 18px;
    cursor: pointer;
    border-radius: 4px;
    border: var(--surface-border);
    background-color: var(--surface);
    transition: all 0.2s;
    color: var(--color);

    &:hover {
      opacity: 1;
      background-color: var(--surface-background);
    }
  }

  .controls-hint {
    position: absolute;
    bottom: 8px;
    right: 12px;
    font-size: 12px;
    opacity: 0.5;
    pointer-events: none;
    background-color: var(--surface);
    padding: 2px 6px;
    border-radius: 4px;
    color: var(--color);
  }

  .error-toast {
    position: absolute;
    top: 12px;
    left: 12px;
    background: var(--surface);
    border: 1px solid #ed4f4a;
    color: var(--color);
    padding: 8px 12px;
    border-radius: 4px;
    z-index: 20;
    max-width: 80%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    justify-items: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    font-size: 12px;

    .error-text {
      flex: 1;
      word-break: break-all;
      white-space: pre-wrap;
    }
  }
}
</style>

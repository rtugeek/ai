<template>
  <div class="root h-full w-full flex-col items-center align-center">
    <div
      :class="{
        'widget-container': true,
        focus: bgHover && !widgetHover && !isWidgetHide
      }"
      @mouseenter="widgetMouseEnter"
      @mouseleave="widgetMouseLeave"
      ref="widgetContainer"
      :style="{
        transform: `translate3d(0,${widgetYTransition}px,0)`
      }"
    >
      <transition name="fade">
        <div v-if="loading" class="skeleton" :style="skeletonSizeStyle">
          <el-skeleton :rows="skeletonCount" animated />
        </div>
      </transition>

      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import {BrowserWindowApi} from '@widget-js/core'
import {TransitionPresets, useElementSize, useTransition, useWindowSize} from '@vueuse/core'
import {computed, nextTick, ref} from 'vue'
import {Close, Pin, Pushpin, Refresh, SettingTwo} from '@icon-park/vue-next'

export default {
  name: 'OverlapWrapper',
  components: { Close, Refresh, SettingTwo, Pin, Pushpin },
  props: {
    isAutoHide: {
      type: Boolean,
      default: false
    },
    showConfigButton: {
      type: Boolean,
      default: false
    },
    isFocused: {
      type: Boolean,
      default: false
    },
    isAlwaysOnTop: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    skeletonCount: {
      type: Number,
      default: 4
    }
  },
  emits: ['update:isFocused', 'update:isAlwaysOnTop', 'refresh'],
  setup(props, context) {
    const { width: windowWidth, height: windowHeight } = useWindowSize({
      includeScrollbar: false
    })
    const isFocusedModel = computed({
      set: (newValue) => {
        context.emit('update:isFocused', newValue)
      },
      get: () => {
        return props.isFocused
      }
    })

    const isAlwaysOnTopModel = computed({
      set: (newValue) => {
        context.emit('update:isAlwaysOnTop', newValue)
      },
      get: () => {
        return props.isAlwaysOnTop
      }
    })
    const padding = ref(8)
    const extraHeight = ref(32)
    const bgHover = ref(false)
    const widgetHover = ref(false)
    const widgetY = ref(0)
    const hotspot = ref()
    const widgetContainer = ref()
    const containerSize = useElementSize(widgetContainer)
    const hideWidget = () => {
      widgetY.value = -widgetHeight.value - extraHeight.value - padding.value
    }

    const showWidget = () => {
      widgetY.value = 0
    }

    context.expose({
      hideWidget,
      showWidget
    })
    const widgetYTransition = useTransition(widgetY, {
      duration: 500,
      transition: TransitionPresets.easeOutCubic,
      onFinished: () => {}
    })
    const widgetHeight = computed(() => {
      return windowHeight.value - padding.value * 2 - extraHeight.value
    })

    return {
      widgetYTransition,
      widgetHover,
      widgetY,
      widgetHeight,
      bgHover,
      hotspot,
      containerSize,
      hideWidget,
      showWidget,
      isFocusedModel,
      padding,
      windowWidth,
      isAlwaysOnTopModel,
      windowHeight
    }
  },
  watch: {
    async isAutoHide(newValue) {
      if (newValue) {
      } else {
        this.showWidget()
      }
    },
    async isWidgetHide(newValue) {
      if (newValue) {
        BrowserWindowApi.setIgnoreMouseEvent(true)
        await BrowserWindowApi.setResizable(false)
        this.showContextMenu = false
      } else {
        await BrowserWindowApi.setResizable(true)
      }
    },
    dataLoaded(newValue) {
      if (newValue) {
        this.widgetUrl = this.getWidgetUrl()
      }
    }
  },
  async mounted() {
    await nextTick()
    if (this.isAutoHide) {
      this.hideWidget()
    }
    this.alwaysOnTop = await BrowserWindowApi.isAlwaysOnTop()
  },
  methods: {
    refreshClick() {
      this.$emit('refresh')
    },
    setAlwaysOnTop(alwaysOnTop: boolean) {
      BrowserWindowApi.setAlwaysOnTop(alwaysOnTop)
      this.isAlwaysOnTopModel = alwaysOnTop
    },
    widgetMouseLeave() {
      this.widgetHover = false
    },
    widgetMouseEnter() {
      BrowserWindowApi.setIgnoreMouseEvent(false)
      this.widgetHover = true
    },
    bgMouseEnter() {
      this.bgHover = true
      BrowserWindowApi.setIgnoreMouseEvent(this.isWidgetHide)
    },
    bgMouseLeave() {
      this.bgHover = false
      BrowserWindowApi.setIgnoreMouseEvent(this.isWidgetHide)
    },
    hotspotMouseEnter() {
      console.log('hotspotMouseEnter')
      this.isFocusedModel = true
      BrowserWindowApi.setIgnoreMouseEvent(false)
    },
    hotspotMouseLeave() {
      this.isFocusedModel = false
      if (this.isWidgetHide) {
        BrowserWindowApi.setIgnoreMouseEvent(true)
      }
    },
    hotspotClick() {
      this.showWidget()
    }
  },
  computed: {
    isWidgetHide() {
      return this.widgetY < -this.widgetHeight + 24
    },
    containerStyle() {
      const paddingStr = this.padding + 'px'
      return {
        padding: paddingStr
      }
    },
    sizeStyle() {
      return { width: `${this.windowWidth}px`, height: `${this.windowHeight}px` }
    },
    paddingPx() {
      return this.padding + 'px'
    },
    skeletonSizeStyle() {
      return { width: `${this.windowWidth - 32}px`, height: `${this.windowHeight - 32}px` }
    }
  }
}
</script>

<style lang="scss" scoped>
$padding: v-bind(paddingPx);
$width: calc(100% - $padding - $padding);
$titleBarHeight: 28px;
.hide {
  opacity: 0;
  transition-property: opacity;
  transition-duration: 0.3s;
}

.actions {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  top: 0;
  position: absolute;
  width: 100%;
  gap: 6px;
  height: $titleBarHeight;
  .icon {
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 16px;
    cursor: pointer;
    padding: 4px;
    z-index: 1;
  }
}

.hotspot {
  width: 42px;
  cursor: pointer;
  display: flex;
  z-index: 2;
  justify-content: center;
  align-content: center;
  position: absolute;
  top: 4px;
  align-items: center;
  left: 50%;
  transform: translateX(-50%);
  height: 8px;
  .handler {
    width: 32px;
    height: 4px;
    background-color: white;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.52);
    border-radius: 50px;
  }
}

.widget-container {
  flex-direction: column;
  align-content: center;
  inset: 36px 8px 8px 8px;
  align-items: center;
  transition-property: background-color;
  transition-duration: 0.3s;
  position: absolute;
  border-radius: 8px;
  display: flex;
}

.skeleton {
  position: relative;
  width: 100%;
  border-radius: 16px;
  display: flex;
  padding: 16px;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.2));
}
</style>

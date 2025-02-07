import { computed, ref, watch } from 'vue'
import { BrowserWindowApi } from '@widget-js/core'
import { TransitionPresets, useStorage, useTransition, watchArray } from '@vueuse/core'
import type { WindowPosition } from '@/store/useConfigStore'
import type { AIPlatform } from '@/widgets/ai/AiConfig'

export function useWindowState() {
  const x = ref(100)
  const position = useStorage<WindowPosition>('window-position', 'right')
  const platforms = useStorage<AIPlatform[]>('platforms', ['deepseek'])
  const windowWidth = computed(() => {
    if (platforms.value.length == 1) {
      return screen.width / 3
    }
    else {
      return screen.width / 2
    }
  })

  async function setup() {
    BrowserWindowApi.setResizable(false)
    let x = screen.availWidth - windowWidth.value
    if (position.value == 'left') {
      x = 0
    }
    BrowserWindowApi.setBounds({
      x,
      y: 0,
      width: windowWidth.value,
      height: screen.availHeight,
    })
  }

  const toX = computed(() => {
    if (position.value == 'left') {
      return -100
    }
    else {
      return 100
    }
  })

  const animationX = useTransition(x, {
    duration: 500,
    transition: TransitionPresets.easeInOutCubic,
  })
  const isShowing = computed(() => {
    return x.value == 0
  })

  watch(animationX, async () => {
    if (animationX.value == toX.value) {
      await BrowserWindowApi.blur()
      BrowserWindowApi.hide()
    }
  })

  watchArray([position, windowWidth], () => {
    setup()
  })

  function show() {
    BrowserWindowApi.show()
    x.value = 0
  }

  function hide() {
    BrowserWindowApi.focus()
    x.value = toX.value
  }

  return { x, animationX, isShowing, setup, show, hide }
}

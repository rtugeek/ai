import { computed, ref, watch } from 'vue'
import { BrowserWindowApi } from '@widget-js/core'
import { TransitionPresets, useStorage, useTransition } from '@vueuse/core'
import type { WindowPosition } from '@/store/useConfigStore'

export function useWindowState() {
  const x = ref(100)
  const position = useStorage<WindowPosition>('window-position', 'right')
  const windowWidth = screen.width / 3
  async function setup() {
    await BrowserWindowApi.setup({
      width: windowWidth,
      height: screen.availHeight,
      resizable: false,
      alwaysOnTop: true,
    })
    setPosition()
  }

  function setPosition() {
    let x = screen.availWidth - windowWidth
    if (position.value == 'left') {
      x = 0
    }
    BrowserWindowApi.setPosition({
      x,
      y: 0,
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

  watch(animationX, () => {
    if (animationX.value == toX.value) {
      BrowserWindowApi.hide()
    }
  })

  watch(position, () => {
    setPosition()
  })

  function show() {
    BrowserWindowApi.show()
    x.value = 0
  }

  function hide() {
    x.value = toX.value
  }

  return { x, animationX, isShowing, setup, show, hide }
}

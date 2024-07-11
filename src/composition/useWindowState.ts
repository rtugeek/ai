import { computed, ref, watch } from 'vue'
import { BrowserWindowApi } from '@widget-js/core'
import { TransitionPresets, useTransition } from '@vueuse/core'

export function useWindowState() {
  const x = ref(100)
  const animationX = useTransition(x, {
    duration: 500,
    transition: TransitionPresets.easeInOutCubic,
  })
  const isShowing = computed(() => {
    return x.value == 0
  })
  watch(animationX, () => {
    if (animationX.value == 100) {
      BrowserWindowApi.hide()
    }
  })

  function show() {
    BrowserWindowApi.show()
    x.value = 0
  }

  function hide() {
    x.value = 100
  }

  return { x, animationX, isShowing, show, hide }
}

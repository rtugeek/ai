import { createI18n } from 'vue-i18n'

export const i18n = createI18n({
  locale: 'en',
  datetimeFormats: {
    en: {
      short: { year: 'numeric', month: 'short', day: 'numeric' },
      yearMonth: { year: 'numeric', month: 'short' },
      long: { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short', hour: 'numeric', minute: 'numeric' },
    },
    zh: {
      yearMonth: { year: 'numeric', month: 'short' },
      short: { year: 'numeric', month: 'short', day: 'numeric' },
      long: { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short', hour: 'numeric', minute: 'numeric' },
    },
  },
  messages: {
    zh: {
      configTitle: '组件设置',
      shortcut: '呼出快捷键',
      protocol: '代理协议',
      http: 'HTTP',
      https: 'HTTPS',
      sock4: 'SOCK4',
      sock5: 'SOCK5',
      host: '代理服务器',
      port: '代理端口',
      position: '窗口位置',
      left: '左侧',
      right: '右侧',
      windowSize: '窗口大小',
      percent20: '20%',
      percent30: '30%',
      percent40: '40%',
      percent50: '50%',
      aiAssistant: 'AI 助手',
      singlePage: '单页布局',
      twoLine: '双行布局',
      fourGrid: '四格布局',
      setting: '设置',
      alwaysTop: '置顶',
      know: '知道了',
      twoLineTitle: '设置双行布局',
      twoLineDesc: '设置双行布局，可以同时使用两个AI服务，对比效果',
      selectAiTitle: '选择AI平台',
      selectAiDesc: '请选择你要使用的AI平台',
      selectAiPlaceholder: '选择AI平台',
      chinaAi: '国内AI',
      usAi: '国外AI（需要科学上网）',
      tipTitle: '使用说明',
      tipShortcut: '默认快捷键',
      tipAbroad: '<b>ChatGPT</b>、<b>Gemini</b>需要科学上网才能正常使用',
      tipRegion: '科学上网IP需要避开香港、澳门等不能使用的区域',
      tipSetting: '设置页面',
    },
    en: {
      configTitle: 'Component Settings',
      shortcut: 'Shortcut',
      protocol: 'Proxy Protocol',
      http: 'HTTP',
      https: 'HTTPS',
      sock4: 'SOCK4',
      sock5: 'SOCK5',
      host: 'Proxy Host',
      port: 'Proxy Port',
      position: 'Window Position',
      left: 'Left',
      right: 'Right',
      windowSize: 'Window Size',
      percent20: '20%',
      percent30: '30%',
      percent40: '40%',
      percent50: '50%',
      aiAssistant: 'AI Box',
      singlePage: 'Single Page',
      twoLine: 'Two-line Layout',
      fourGrid: 'Four-grid Layout',
      setting: 'Settings',
      alwaysTop: 'Always on Top',
      know: 'Got it',
      twoLineTitle: 'Set Two-line Layout',
      twoLineDesc: 'Set two-line layout to use two AI services at the same time for comparison',
      selectAiTitle: 'Select AI Platform',
      selectAiDesc: 'Please select the AI platform you want to use',
      selectAiPlaceholder: 'Select AI Platform',
      chinaAi: 'China AI',
      usAi: 'US AI',
      tipTitle: 'Instructions',
      tipShortcut: 'Default shortcut',
      tipAbroad: 'In China mainland, <b>ChatGPT</b> and <b>Gemini</b> require VPN to work properly',
      tipRegion: 'VPN IP should avoid regions like Hong Kong, Macau, etc.',
      tipSetting: 'Settings Page',
    },
  },
})

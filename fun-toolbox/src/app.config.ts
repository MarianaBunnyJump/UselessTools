export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/settings/index',
    'pages/crusher/index',
    'pages/crusher/animation',
    'pages/life/index',
    'pages/life/share',
    'pages/merit/index',
    'pages/merit/achievement',
    'pages/excuse/index',
    'pages/excuse/result',
    'pages/excuse/favorites',
    'pages/praise/index',
    'pages/praise/result',
    'pages/praise/favorites',
    'pages/wheel/index',
    'pages/wheel/history',
    'pages/mixer/index',
    'pages/bubble/index',
    'pages/about/index',
    'pages/level/index',
    'pages/level/simple-level',
    'pages/user/index',
    'pages/registration/index'
  ],
  subPackages: [
    {
      root: 'pages/study',
      pages: ['classics/index', 'classics-reader/index', 'stroke-card/index', 'copybook/index']
    },
    {
      root: 'pages/text/pinyin-annotate',
      pages: ['index']
    },
    {
      root: 'pages/text/zh-convert',
      pages: ['index']
    },
    {
      root: 'pages/create',
      pages: [
        'perler/index',
        'marquee/index',
        'text-to-image/index',
        'photo-toolbox/index',
        'text-replace/index'
      ]
    },
    {
      root: 'pages/calc',
      pages: ['index/index', 'run/index']
    },
    {
      root: 'pages/fun',
      pages: ['fake-call/index', 'device/index']
    }
  ],
  /* 同声传译插件声明暂缓：需先在 MP 后台「设置→第三方设置→插件管理」添加
   * 「同声传译」（provider: wx069ba97219f66d99）后再恢复以下声明，
   * 未授权时声明会导致整个小程序无法打开：
   *   plugins: { WechatSI: { version: '0.3.6', provider: 'wx069ba97219f66d99' } }
   * 未声明期间朗读功能自动降级（tts.ts try/catch），页面给出提示。 */
  window: {
    navigationStyle: 'custom',
    backgroundColor: '#FFF9F2',
    backgroundTextStyle: 'light',
    navigationBarTextStyle: 'black',
    navigationBarTitleText: '趣工局'
  },
  lazyCodeLoading: 'requiredComponents'
})

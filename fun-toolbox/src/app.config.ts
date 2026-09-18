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
    'pages/wheel/index',
    'pages/wheel/history',
    'pages/mixer/index',
    'pages/about/index'
  ],
  window: {
    navigationStyle: 'custom',
    backgroundColor: '#FFF9F2',
    backgroundTextStyle: 'light',
    navigationBarTextStyle: 'black',
    navigationBarTitleText: '趣工局'
  },
  lazyCodeLoading: 'requiredComponents'
})

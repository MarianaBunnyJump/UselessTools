/* 小程序宣传截图自动化：需开发者工具已开启「安全设置-服务端口」并保持登录
   核心经验（Windows + miniprogram-automator 三大坑）：
   1. launch() 直接 spawn cli.bat 会触发 Node 的 spawn EINVAL（CVE-2024-27980 修复），
      且错误被 SDK 误报为 cliPath 不对 → 用 cmd.exe /c 包一层绕开
   2. 残留实例占用项目时，cli auto 另起的实例拿不到项目（端口活、命令全超时）
      → 拉新前必须 taskkill 全部 DevTools 进程
   3. IDE 启动后要 1~2 分钟完成首次编译，过早连上的会话会被内部重建顶掉
      → 优先 attach 现有稳定会话；重拉后必须连续探活才算健康 */
const automator = require('miniprogram-automator')
const { spawn, exec } = require('child_process')

const CLI = 'D:\\2_DevelopTool\\WxDeveloperTool\\微信web开发者工具\\cli.bat'
const PROJECT = 'E:\\13_AIPrj\\FunToolsDirector\\fun-toolbox'
const OUT = 'E:\\13_AIPrj\\FunToolsDirector\\宣传素材'
const PORT = 9420

const wait = ms => new Promise(r => setTimeout(r, ms))

/* 连续 3 次稳定响应才算会话健康（过滤「起身后被顶掉」的僵尸会话） */
async function assertAlive(mp) {
  let stable = 0
  for (let i = 0; i < 30 && stable < 3; i++) {
    try {
      await mp.evaluate(() => 1)
      stable++
      await wait(800)
    } catch (e) {
      stable = 0
      await wait(2000)
    }
  }
  return stable >= 3
}

async function getMiniprogram() {
  /* 第一优先：现有端口可能有稳定会话（上次跑完 IDE 未关），直接 attach */
  try {
    const mp = await automator.connect({ wsEndpoint: `ws://localhost:${PORT}` })
    if (await assertAlive(mp)) {
      console.log('attached to live session')
      return mp
    }
    try { await mp.disconnect() } catch (e) { /* ignore */ }
    console.log('live session found but not stable, relaunching IDE')
  } catch (e) {
    console.log('no live session, launching IDE')
  }

  /* 清场再拉：残留实例会让新实例变成拿不到项目的空壳 */
  await new Promise(res => exec('taskkill /F /T /IM 微信开发者工具.exe', { windowsHide: true }, () => res()))
  await wait(2500)
  spawn('cmd.exe', ['/c', CLI, 'auto', '--project', PROJECT, '--auto-port', String(PORT)], {
    stdio: 'ignore',
    detached: false
  })

  let mp = null
  for (let i = 0; i < 45; i++) {
    await wait(2000)
    try {
      mp = await automator.connect({ wsEndpoint: `ws://localhost:${PORT}` })
      break
    } catch (err) {
      /* 冷启动 6~12s 正常，继续等 */
    }
  }
  if (!mp) throw new Error('cannot connect to automation port ' + PORT)

  if (!(await assertAlive(mp))) {
    try { await mp.disconnect() } catch (e) { /* ignore */ }
    throw new Error('evaluate channel never became ready')
  }
  console.log('ws session healthy')

  /* 等小程序逻辑层真正启动：页面栈非空 */
  let route = ''
  for (let i = 0; i < 30; i++) {
    try {
      route = await mp.evaluate(() => {
        const p = getCurrentPages()
        return p.length ? p[p.length - 1].route : ''
      })
      if (route) break
    } catch (e) {
      /* retry */
    }
    await wait(1000)
  }
  if (!route) throw new Error('app service did not boot (page stack empty)')
  console.log('booted at', route)
  await wait(2500)
  return mp
}

async function main() {
  let mp = null
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      mp = await getMiniprogram()
      break
    } catch (e) {
      console.log(`launch attempt ${attempt} failed: ${e.message}`)
      if (attempt === 2) throw e
      console.log('cleaning up and retrying...')
      try { await mp.disconnect() } catch (err) { /* ignore */ }
      mp = null
      /* 杀掉坏实例：否则下一次 attach 优先又会连回同一个坏会话 */
      await new Promise(res => exec('taskkill /F /T /IM 微信开发者工具.exe', { windowsHide: true }, () => res()))
      await wait(3000)
    }
  }
  console.log('ready')

  /* 全新模拟器 storage 空白，首页截图会被导引罩层/拖动提示气泡盖住，先静默关掉（写后读回验证） */
  await mp.evaluate(() => {
    wx.setStorageSync('onboarding_done', true)
    wx.setStorageSync('drag_hint_done', true)
  })
  const ok = await mp.evaluate(() => wx.getStorageSync('onboarding_done') === true)
  if (!ok) throw new Error('onboarding flag not persisted, abort to avoid wasted shots')
  console.log('onboarding + drag hint dismissed')

  /* 基础库版本不匹配会导致逻辑层崩（pageStack 空、reLaunch 报 indexOf 错），
     先验证 reLaunch 真能打开首页再开工，避免 14 张全废 */
  await mp.reLaunch('/pages/index/index')
  await wait(2500)
  let bootRoute = ''
  for (let i = 0; i < 15; i++) {
    try {
      bootRoute = await mp.evaluate(() => {
        const p = getCurrentPages()
        return p.length ? p[p.length - 1].route : ''
      })
      if (bootRoute) break
    } catch (e) {
      /* retry */
    }
    await wait(1000)
  }
  if (!bootRoute) {
    try { await mp.disconnect() } catch (e) { /* ignore */ }
    throw new Error('reLaunch failed to boot index page (logic layer dead, check libVersion)')
  }
  console.log('index booted:', bootRoute)

  const shots = [
    { name: '01-首页-网格皮肤', path: '/pages/index/index', settle: 2500 },
    { name: '02-情绪粉碎机', path: '/pages/crusher/index', settle: 2500 },
    { name: '03-电子木鱼', path: '/pages/merit/index', settle: 2000 },
    { name: '04-人生倒计时', path: '/pages/life/index', settle: 2500 },
    { name: '05-白噪音混音台', path: '/pages/mixer/index', settle: 2500 },
    { name: '06-转盘选择器', path: '/pages/wheel/index', settle: 2500 },
    { name: '07-借口生成器', path: '/pages/excuse/index', settle: 2000 },
    { name: '08-无限气泡纸', path: '/pages/bubble/index', settle: 2000 },
    { name: '09-设置页', path: '/pages/settings/index', settle: 2000 },
    { name: '10-关于页', path: '/pages/about/index', settle: 2000 }
  ]

  for (const s of shots) {
    try {
      await mp.reLaunch(s.path)
      await wait(s.settle)
      await mp.screenshot({ path: `${OUT}\\${s.name}.png` })
      console.log('shot ok:', s.name)
    } catch (e) {
      console.log('shot fail:', s.name, e.message)
    }
  }

  /* 换皮肤截图：直接改 storage 后重启首页（皮肤读取于启动时）。
     注意 app 的 storage 封装写入的是 JSON 序列化字符串（get 时 JSON.parse），
     直接写原始字符串会解析失败回落默认皮肤，必须 JSON.stringify */
  try {
    await mp.evaluate(() => {
      wx.setStorageSync('skin_active', JSON.stringify('starry'))
      wx.setStorageSync('skins_owned', JSON.stringify(['grid', 'starry', 'toy', 'tree']))
    })
    await mp.reLaunch('/pages/index/index')
    await wait(3000)
    await mp.screenshot({ path: `${OUT}\\11-首页-星夜皮肤.png` })
    console.log('shot ok: 11-首页-星夜皮肤')

    await mp.evaluate(() => {
      wx.setStorageSync('skin_active', JSON.stringify('tree'))
    })
    await mp.reLaunch('/pages/index/index')
    await wait(3000)
    await mp.screenshot({ path: `${OUT}\\12-首页-圣诞树皮肤.png` })
    console.log('shot ok: 12-首页-圣诞树皮肤')

    await mp.evaluate(() => {
      wx.setStorageSync('skin_active', JSON.stringify('toy'))
    })
    await mp.reLaunch('/pages/index/index')
    await wait(3000)
    await mp.screenshot({ path: `${OUT}\\13-首页-玩具皮肤.png` })
    console.log('shot ok: 13-首页-玩具皮肤')

    /* 还原默认皮肤，避免影响后续使用 */
    await mp.evaluate(() => {
      wx.setStorageSync('skin_active', JSON.stringify('grid'))
    })
    await mp.reLaunch('/pages/index/index')
    await wait(1500)
    await mp.screenshot({ path: `${OUT}\\14-首页-默认确认.png` })
    console.log('shot ok: 14-首页-默认确认')
  } catch (e) {
    console.log('skin shot fail:', e.message)
  }

  await mp.disconnect()
  console.log('done')
}

main().catch(e => {
  console.error('FATAL:', e.message)
  process.exit(1)
})

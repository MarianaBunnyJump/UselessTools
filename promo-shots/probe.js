/* Probe the live automation session on 9420: is the command channel alive? */
const automator = require('miniprogram-automator')

async function tryCmd(label, fn) {
  const t0 = Date.now()
  try {
    const r = await fn()
    console.log(label, 'OK', JSON.stringify(r), 'in', Date.now() - t0, 'ms')
    return true
  } catch (e) {
    console.log(label, 'FAIL:', e.message, 'after', Date.now() - t0, 'ms')
    return false
  }
}

async function main() {
  console.log('connecting to ws://localhost:9420 ...')
  const mp = await automator.connect({ wsEndpoint: 'ws://localhost:9420' })
  console.log('connected')

  await tryCmd('evaluate', () => mp.evaluate(() => 1))
  await tryCmd('pageStack', () => mp.pageStack())
  await tryCmd('systemInfo', () => mp.systemInfo())
  await tryCmd('currentPage', () => mp.currentPage())

  try { await mp.disconnect() } catch (e) { /* ignore */ }
  console.log('probe done')
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1) })

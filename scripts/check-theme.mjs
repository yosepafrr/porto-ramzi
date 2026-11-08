import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { JSDOM } from 'jsdom'
import { createServer } from 'vite'

const key = 'ramzi-portfolio-theme'
const bootstrap = await readFile(new URL('../public/theme-init.js', import.meta.url), 'utf8')
const html = '<!doctype html><html lang="id"><head><meta name="theme-color" content="#101312"></head><body><div id="test-root"></div></body></html>'
for (const [saved, system, expected] of [[null, true, 'light'], [null, false, 'dark'], ['light', false, 'light'], ['dark', true, 'dark'], ['invalid', true, 'light']]) {
  const fixture = new JSDOM(html, { url: 'http://localhost/', runScripts: 'outside-only' })
  fixture.window.matchMedia = () => ({ matches: system })
  if (saved) fixture.window.localStorage.setItem(key, saved)
  fixture.window.eval(bootstrap)
  assert.equal(fixture.window.document.documentElement.dataset.theme, expected)
  assert.equal(fixture.window.document.documentElement.style.colorScheme, expected)
  fixture.window.close()
}
const blocked = new JSDOM(html, { runScripts: 'outside-only' })
blocked.window.eval(bootstrap)
assert.equal(blocked.window.document.documentElement.dataset.theme, 'dark')
blocked.window.close()
console.log('PASS: tema awal mengikuti perangkat/pilihan tersimpan sebelum React; fallback aman tanpa storage/matchMedia.')

const dom = new JSDOM(html, { url: 'http://localhost/', runScripts: 'outside-only' })
globalThis.window = dom.window
globalThis.document = dom.window.document
globalThis.IS_REACT_ACT_ENVIRONMENT = true
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true })
const listeners = new Set()
const media = { matches: true, addEventListener: (_, callback) => listeners.add(callback), removeEventListener: (_, callback) => listeners.delete(callback) }
window.matchMedia = () => media
const { createElement, act } = await import('react')
const { createRoot } = await import('react-dom/client')
const vite = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
let root
try {
  const { default: ThemeToggle } = await vite.ssrLoadModule('/src/components/ThemeToggle.jsx')
  const mount = async () => {
    root = createRoot(document.getElementById('test-root'))
    await act(() => root.render(createElement(ThemeToggle)))
  }
  const state = (theme) => {
    assert.equal(document.documentElement.dataset.theme, theme)
    assert.equal(document.documentElement.style.colorScheme, theme)
    assert.equal(document.querySelector('meta[name="theme-color"]').content, theme === 'light' ? '#f6f7f1' : '#101312')
    assert.equal(document.querySelector('button').getAttribute('aria-label'), theme === 'light' ? 'Aktifkan mode gelap' : 'Aktifkan mode terang')
    assert.equal(document.querySelector('button').getAttribute('aria-pressed'), String(theme === 'light'))
  }
  const system = (matches) => act(() => { media.matches = matches; for (const listener of listeners) listener(media) })
  const click = () => act(() => document.querySelector('button').click())
  const storage = (newValue, eventKey = key) => act(() => window.dispatchEvent(new window.StorageEvent('storage', { key: eventKey, newValue })))
  window.eval(bootstrap)
  await mount()
  state('light')
  await system(false)
  state('dark')
  await click()
  state('light')
  assert.equal(window.localStorage.getItem(key), 'light')
  await system(true)
  await system(false)
  state('light')
  await act(() => root.unmount())
  assert.equal(listeners.size, 0)
  await mount()
  state('light')
  await click()
  state('dark')
  assert.equal(window.localStorage.getItem(key), 'dark')
  await storage('light')
  state('light')
  await storage('dark', 'unrelated-key')
  state('light')
  await storage(null, null)
  state('dark')
  await system(true)
  state('light')
  await act(() => root.unmount())
  window.localStorage.clear()
  Object.defineProperty(window, 'localStorage', { configurable: true, get() { throw new Error('Storage blocked fixture') } })
  await mount()
  state('light')
  await click()
  state('dark')
  console.log('PASS: toggle dua arah, metadata, persistensi/remount, perubahan OS, sinkronisasi tab, cleanup, dan storage diblokir.')
} finally {
  if (root) await act(() => root.unmount())
  await vite.close()
  dom.window.close()
}

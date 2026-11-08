import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import { createServer } from 'vite'
import { portfolioData as data } from '../src/data/portfolioData.js'

// Pemeriksaan lifecycle/state/fokus; jsdom tidak memverifikasi hasil visual,
// top layer browser, native inert/focus trap, atau kualitas frame animasi.
const dom = new JSDOM('<!doctype html><html><body><div id="test-root"></div></body></html>', { url: 'http://localhost/' })
globalThis.window = dom.window
globalThis.document = dom.window.document
globalThis.HTMLElement = dom.window.HTMLElement
globalThis.Element = dom.window.Element
globalThis.SVGElement = dom.window.SVGElement
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window)
globalThis.IS_REACT_ACT_ENVIRONMENT = true
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true })
globalThis.requestAnimationFrame = (callback) => setTimeout(() => callback(performance.now()), 16)
globalThis.cancelAnimationFrame = clearTimeout
window.requestAnimationFrame = globalThis.requestAnimationFrame
window.cancelAnimationFrame = globalThis.cancelAnimationFrame
const media = new Map()
window.matchMedia = (query) => {
  if (!media.has(query)) {
    const listeners = new Set()
    media.set(query, { matches: false, media: query, listeners, addEventListener: (_, callback) => listeners.add(callback), removeEventListener: (_, callback) => listeners.delete(callback), addListener: (callback) => listeners.add(callback), removeListener: (callback) => listeners.delete(callback) })
  }
  return media.get(query)
}
const observers = []
class Observer {
  constructor(callback) { this.callback = callback; this.disconnected = false; observers.push(this) }
  observe(element) { this.element = element }
  disconnect() { this.disconnected = true }
  enter() { this.callback([{ target: this.element, isIntersecting: true }]) }
}
globalThis.IntersectionObserver = Observer
window.IntersectionObserver = Observer
window.HTMLElement.prototype.getBoundingClientRect = function () {
  return { top: this.classList.contains('test-below') ? 1200 : 0, left: 0, width: 500, height: 200, bottom: 200, right: 500 }
}
window.HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); this.querySelector('button')?.focus() }
window.HTMLDialogElement.prototype.close = function () { this.removeAttribute('open') }

const { createElement, useState, act } = await import('react')
const { createRoot } = await import('react-dom/client')
const { renderToStaticMarkup } = await import('react-dom/server')
const root = createRoot(document.getElementById('test-root'))
const vite = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
const component = async (name) => (await vite.ssrLoadModule(`/src/components/${name}.jsx`)).default
const render = (element) => act(() => root.render(element))
const wait = (ms) => act(async () => { await new Promise((resolve) => setTimeout(resolve, ms)) })
const click = (element) => {
  assert.ok(element)
  element.focus()
  return act(() => element.dispatchEvent(new window.MouseEvent('click', { bubbles: true, button: 0 })))
}
const preference = (matches) => act(() => {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)')
  query.matches = matches
  for (const listener of [...query.listeners]) listener(query)
})

try {
  const { default: App } = await vite.ssrLoadModule('/src/App.jsx')
  const page = new JSDOM(renderToStaticMarkup(createElement(App))).window.document
  assert.equal(page.querySelector('.hero-copy').style.opacity, '')
  for (const section of page.querySelectorAll('[data-reveal-state]')) assert.equal(section.getAttribute('data-reveal-state'), 'visible')
  assert.equal(page.querySelector('.page-intro'), null)
  assert.equal(page.querySelectorAll('h1').length, 1)
  for (const anchor of page.querySelectorAll('a[href^="#"]')) assert.ok(page.getElementById(anchor.getAttribute('href').slice(1)))
  assert.ok(page.querySelector('.mobile-menu-shell').hasAttribute('inert'))
  console.log('PASS: SSR/HTML tidak menyembunyikan hero/section; semua anchor valid; menu tertutup inert.')

  const Reveal = await component('Reveal')
  const reveal = (key) => createElement(Reveal, { key, className: 'test-below' }, createElement('button', { id: 'reveal-button' }, 'Test focus'))
  await render(reveal('observer'))
  assert.equal(document.querySelector('[data-reveal-state]').dataset.revealState, 'pending')
  const firstObserver = observers.at(-1)
  await act(() => firstObserver.enter())
  assert.equal(document.querySelector('[data-reveal-state]').dataset.revealState, 'visible')
  assert.equal(firstObserver.disconnected, true)
  await render(reveal('focus'))
  assert.equal(document.querySelector('[data-reveal-state]').dataset.revealState, 'pending')
  await act(() => document.getElementById('reveal-button').focus())
  assert.equal(document.querySelector('[data-reveal-state]').dataset.revealState, 'visible')
  assert.equal(document.querySelector('[data-reveal-state]').style.opacity, '1')
  await render(reveal('preference'))
  assert.equal(document.querySelector('[data-reveal-state]').dataset.revealState, 'pending')
  await preference(true)
  assert.equal(document.querySelector('[data-reveal-state]').dataset.revealState, 'visible')
  assert.equal(document.querySelector('[data-reveal-state]').style.opacity, '1')
  await preference(false)
  assert.equal(document.querySelector('[data-reveal-state]').dataset.revealState, 'visible')
  console.log('PASS: reveal saat masuk viewport/fokus, satu kali, dan perubahan reduced motion langsung menampilkan konten.')

  delete globalThis.IntersectionObserver
  await render(reveal('no-observer'))
  assert.equal(document.querySelector('[data-reveal-state]').dataset.revealState, 'visible')
  globalThis.IntersectionObserver = class { constructor() { throw new Error('Unavailable observer fixture') } }
  await render(reveal('failed-observer'))
  assert.equal(document.querySelector('[data-reveal-state]').dataset.revealState, 'visible')
  globalThis.IntersectionObserver = Observer
  await render(reveal('cleanup'))
  const removedObserver = observers.at(-1)
  await render(createElement('div'))
  assert.equal(removedObserver.disconnected, true)
  console.log('PASS: fallback tanpa/observer gagal tetap terlihat; observer dibersihkan saat unmount.')

  const PageIntro = await component('PageIntro')
  await render(createElement(PageIntro, { key: 'intro-normal' }))
  assert.ok(document.querySelector('.page-intro[aria-hidden="true"]'))
  assert.notEqual(document.body.style.overflow, 'hidden')
  await wait(950)
  assert.equal(document.querySelector('.page-intro'), null)
  await preference(true)
  await render(createElement(PageIntro, { key: 'intro-reduced' }))
  assert.equal(document.querySelector('.page-intro'), null)
  await preference(false)
  assert.equal(document.querySelector('.page-intro'), null)
  console.log('PASS: pembuka selesai otomatis, tidak mengunci halaman, dan dilewati pada reduced motion.')

  const ScrollTools = await component('ScrollTools')
  Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, value: 3000 })
  Object.defineProperty(window, 'scrollY', { configurable: true, writable: true, value: 0 })
  await render(createElement(ScrollTools, { label: data.ui.backToTop }))
  assert.equal(document.querySelector('.floating-top').tabIndex, -1)
  window.scrollY = 750
  await act(async () => { window.dispatchEvent(new window.Event('scroll')); await new Promise((resolve) => setTimeout(resolve, 35)) })
  assert.ok(document.querySelector('.floating-top.is-visible'))
  assert.equal(document.querySelector('.floating-top').tabIndex, 0)
  assert.equal(document.querySelector('.floating-top').getAttribute('href'), '#home')
  window.scrollY = 5000
  await act(async () => { window.dispatchEvent(new window.Event('scroll')); await new Promise((resolve) => setTimeout(resolve, 35)) })
  assert.equal(document.querySelector('.floating-top').style.getPropertyValue('--scroll-progress'), '360deg')
  console.log('PASS: tombol kembali ke atas hanya aktif setelah scroll, target valid, progres dibatasi.')

  const { default: useAnchorFocus } = await vite.ssrLoadModule('/src/hooks/useAnchorFocus.js')
  function AnchorHarness() {
    useAnchorFocus()
    return createElement('div', {}, createElement('a', { href: '#test-section', id: 'anchor-link' }, 'Go'), createElement('section', { id: 'test-section' }, 'Target'))
  }
  await render(createElement(AnchorHarness))
  await click(document.getElementById('anchor-link'))
  assert.equal(document.activeElement.id, 'test-section')
  assert.equal(document.activeElement.tabIndex, -1)
  document.getElementById('anchor-link').focus()
  await act(() => document.getElementById('anchor-link').dispatchEvent(new window.MouseEvent('click', { bubbles: true, button: 0, ctrlKey: true })))
  assert.equal(document.activeElement.id, 'anchor-link')
  console.log('PASS: fokus mengikuti tujuan anchor; klik dengan modifier tidak diambil alih.')

  const Modal = await component('Modal')
  let closeCalls = 0
  function ModalHarness() {
    const [open, setOpen] = useState(false)
    return createElement('div', {}, createElement('button', { id: 'modal-trigger', onClick: () => setOpen(true) }, 'Open'), open && createElement(Modal, { title: 'Test dialog', closeLabel: data.ui.close, onClose: () => { closeCalls += 1; setOpen(false) } }, createElement('p', {}, 'Fixture only')))
  }
  await render(createElement(ModalHarness, { key: 'modal-normal' }))
  document.body.style.overflow = 'auto'
  await click(document.getElementById('modal-trigger'))
  assert.ok(document.querySelector('dialog[open]'))
  assert.equal(document.body.style.overflow, 'hidden')
  await wait(260)
  await click(document.querySelector('dialog .icon-button'))
  if (document.querySelector('dialog')) assert.equal(document.querySelector('dialog').dataset.closing, 'true')
  await wait(330)
  assert.equal(document.querySelector('dialog'), null)
  assert.equal(closeCalls, 1)
  assert.equal(document.body.style.overflow, 'auto')
  assert.equal(document.activeElement.id, 'modal-trigger')
  await click(document.getElementById('modal-trigger'))
  await act(() => document.querySelector('dialog').dispatchEvent(new window.Event('cancel', { cancelable: true })))
  await preference(true)
  assert.equal(document.querySelector('dialog'), null)
  assert.equal(closeCalls, 2)
  await wait(330)
  assert.equal(closeCalls, 2)
  await click(document.getElementById('modal-trigger'))
  await click(document.querySelector('dialog .icon-button'))
  assert.equal(document.querySelector('dialog'), null)
  assert.equal(closeCalls, 3)
  console.log('PASS: modal normal menutup terbatasi, fokus/scroll kembali, reduced motion menutup segera, callback satu kali.')

  await preference(false)
  await click(document.getElementById('modal-trigger'))
  await act(() => document.querySelector('dialog').dispatchEvent(new window.Event('cancel', { cancelable: true })))
  await render(createElement('div'))
  await wait(330)
  assert.equal(closeCalls, 3)
  assert.equal(document.body.style.overflow, 'auto')
  console.log('PASS: unmount saat animasi penutupan membersihkan timer dan tidak memanggil callback lama.')

  await preference(true)
  const Lightbox = await component('Lightbox')
  const images = [1, 2].map((number) => ({ src: `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E#stage6-${number}`, alt: `Test ${number}` }))
  await render(createElement(Lightbox, { images, onClose() {}, ui: data.ui }))
  const viewport = document.querySelector('.lightbox-viewport')
  assert.equal(viewport.tabIndex, 0)
  await act(() => document.querySelector('dialog').dispatchEvent(new window.KeyboardEvent('keydown', { key: '+', bubbles: true })))
  assert.ok(viewport.classList.contains('is-zoomed'))
  viewport.scrollLeft = 90
  viewport.scrollTop = 70
  await click(document.querySelector(`button[aria-label="${data.ui.next}"]`))
  assert.equal(viewport.scrollLeft, 0)
  assert.equal(viewport.scrollTop, 0)
  assert.equal(viewport.classList.contains('is-zoomed'), false)
  assert.equal(document.querySelector('dialog img').alt, 'Test 2')
  await act(() => document.querySelector('dialog').dispatchEvent(new window.KeyboardEvent('keydown', { key: '+', ctrlKey: true, bubbles: true })))
  assert.equal(viewport.classList.contains('is-zoomed'), false)
  await act(() => document.querySelector('dialog').dispatchEvent(new window.KeyboardEvent('keydown', { key: '+', bubbles: true })))
  await act(() => viewport.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })))
  assert.equal(document.querySelector('dialog img').alt, 'Test 2')
  await act(() => document.querySelector('dialog').dispatchEvent(new window.KeyboardEvent('keydown', { key: '0', bubbles: true })))
  assert.equal(viewport.classList.contains('is-zoomed'), false)
  console.log('PASS: area gambar fokusable, pintasan zoom, reset scroll/zoom antar gambar, dan browser zoom tidak diganggu.')
} finally {
  await act(() => root.unmount())
  await vite.close()
  dom.window.close()
}

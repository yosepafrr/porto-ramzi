import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import { createServer } from 'vite'
import { portfolioData } from '../src/data/portfolioData.js'

// Pengujian DOM terarah; jsdom tidak memverifikasi layout/visual browser.
const dom = new JSDOM('<!doctype html><html><body><div id="test-root"></div><section id="home"></section><section id="explore"></section><button id="outside">Outside</button></body></html>', { url: 'http://localhost/' })
globalThis.window = dom.window
globalThis.document = dom.window.document
globalThis.HTMLElement = dom.window.HTMLElement
globalThis.IS_REACT_ACT_ENVIRONMENT = true
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true })
globalThis.requestAnimationFrame = (callback) => setTimeout(callback, 0)
globalThis.cancelAnimationFrame = clearTimeout
let desktopChange
// Regresi fungsional memakai reduced motion; jalur animasi diuji pada Tahap 6.
window.matchMedia = (query) => ({ matches: query.includes('prefers-reduced-motion'), addEventListener: (_, callback) => { if (query.includes('min-width')) desktopChange = callback }, removeEventListener: () => {} })
let exploreTop = 950
document.getElementById('home').getBoundingClientRect = () => ({ top: 0 })
document.getElementById('explore').getBoundingClientRect = () => ({ top: exploreTop })

const { createElement, act } = await import('react')
const { createRoot } = await import('react-dom/client')
const { renderToStaticMarkup } = await import('react-dom/server')
const vite = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
const root = createRoot(document.getElementById('test-root'))
const click = async (element) => act(() => element.dispatchEvent(new window.MouseEvent('click', { bubbles: true })))

try {
  const { default: Navbar } = await vite.ssrLoadModule('/src/components/Navbar.jsx')
  await act(() => root.render(createElement(Navbar, { name: portfolioData.hero.name, navigation: portfolioData.navigation, email: portfolioData.contact.email })))
  const toggle = document.querySelector('.menu-toggle')
  assert.equal(toggle.getAttribute('aria-expanded'), 'false')
  assert.equal(document.querySelector('.desktop-nav [aria-current]').getAttribute('href'), '#home')

  await click(toggle)
  assert.equal(toggle.getAttribute('aria-expanded'), 'true')
  assert.equal(document.activeElement, document.querySelector('#mobile-navigation a'))
  await act(() => document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true })))
  assert.equal(document.querySelector('.mobile-menu-shell').getAttribute('aria-hidden'), 'true')
  assert.ok(document.querySelector('.mobile-menu-shell').hasAttribute('inert'))
  assert.equal(document.activeElement, toggle)
  console.log('PASS: menu terbuka, fokus masuk ke menu, Escape menutup dan mengembalikan fokus.')

  await click(toggle)
  await click(document.querySelector('#mobile-navigation a[href="#explore"]'))
  assert.equal(toggle.getAttribute('aria-expanded'), 'false')
  assert.equal(document.querySelector('.desktop-nav [aria-current]').getAttribute('href'), '#explore')
  await click(toggle)
  await act(() => document.getElementById('outside').dispatchEvent(new window.MouseEvent('pointerdown', { bubbles: true })))
  assert.equal(toggle.getAttribute('aria-expanded'), 'false')
  await click(toggle)
  await act(() => desktopChange({ matches: true }))
  assert.equal(toggle.getAttribute('aria-expanded'), 'false')
  await click(toggle)
  await act(() => document.getElementById('outside').focus())
  assert.equal(toggle.getAttribute('aria-expanded'), 'false')
  console.log('PASS: menu menutup saat navigasi, klik di luar, fokus keluar, dan perpindahan ke desktop.')

  exploreTop = -100
  await act(async () => { window.dispatchEvent(new window.Event('scroll')); await new Promise((resolve) => setTimeout(resolve, 10)) })
  assert.equal(document.querySelector('.desktop-nav [aria-current]').getAttribute('href'), '#explore')
  exploreTop = 950
  await act(async () => { window.dispatchEvent(new window.Event('scroll')); await new Promise((resolve) => setTimeout(resolve, 10)) })
  assert.equal(document.querySelector('.desktop-nav [aria-current]').getAttribute('href'), '#home')
  console.log('PASS: indikator navigasi mengikuti posisi section saat scroll.')

  const { default: ProfileVisual } = await vite.ssrLoadModule('/src/components/ProfileVisual.jsx')
  const renderProfile = (image) => act(() => root.render(createElement(ProfileVisual, { hero: { ...portfolioData.hero, image }, location: portfolioData.contact.location })))
  await renderProfile('')
  assert.equal(document.querySelector('img'), null)
  const initials = portfolioData.hero.name.split(' ').filter(Boolean).map(word => word[0]).slice(0, 2).join('')
  assert.ok(document.querySelector('.portrait-monogram').textContent.includes(initials))
  await renderProfile('/test-portrait.jpg')
  assert.equal(document.querySelector('img').alt, portfolioData.hero.imageAlt)
  await act(() => document.querySelector('img').dispatchEvent(new window.Event('error')))
  assert.equal(document.querySelector('img'), null)
  assert.ok(document.querySelector('.profile-art'))
  await renderProfile('/replacement-portrait.jpg')
  assert.equal(document.querySelector('img').getAttribute('src'), '/replacement-portrait.jpg')
  console.log('PASS: foto kosong/gagal memakai monogram; penggantian path menampilkan foto kembali.')

  const { default: App } = await vite.ssrLoadModule('/src/App.jsx')
  const markup = renderToStaticMarkup(createElement(App))
  const page = new JSDOM(markup).window.document
  assert.equal(page.querySelectorAll('h1').length, 1)
  for (const anchor of page.querySelectorAll('a[href^="#"]')) {
    assert.ok(page.getElementById(anchor.getAttribute('href').slice(1)), anchor.outerHTML)
  }
  if (portfolioData.contact.email) assert.ok(page.querySelector(`a[href="mailto:${portfolioData.contact.email}"]`))
  for (const image of page.querySelectorAll('img')) assert.ok(image.getAttribute('src')?.trim())
  const ids = [...page.querySelectorAll('[id]')].map((element) => element.id)
  assert.equal(ids.length, new Set(ids).size)
  console.log('PASS: App dirender, satu H1, semua target anchor tersedia, email benar, tanpa ID duplikat/gambar kosong.')
} finally {
  await act(() => root.unmount())
  await vite.close()
  dom.window.close()
}

import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import { createServer } from 'vite'
import axe from 'axe-core'
import { portfolioData as data } from '../src/data/portfolioData.js'

const dom = new JSDOM('<!doctype html><html lang="id"><head><title>Portfolio audit</title></head><body><div id="test-root"></div></body></html>', { url: 'http://localhost/', runScripts: 'outside-only' })
globalThis.window = dom.window
globalThis.document = dom.window.document
globalThis.HTMLElement = dom.window.HTMLElement
globalThis.IS_REACT_ACT_ENVIRONMENT = true
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true })
globalThis.requestAnimationFrame = (callback) => setTimeout(callback, 0)
globalThis.cancelAnimationFrame = clearTimeout
window.matchMedia = (query) => ({ matches: query.includes('prefers-reduced-motion'), addEventListener() {}, removeEventListener() {} })
const { createElement, act } = await import('react')
const { createRoot } = await import('react-dom/client')
const { renderToStaticMarkup } = await import('react-dom/server')
const vite = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
let root

try {
  const { default: App } = await vite.ssrLoadModule('/src/App.jsx')
  document.title = data.seo.title
  const description = document.createElement('meta')
  description.name = 'description'
  description.content = data.seo.description
  document.head.append(description)
  document.getElementById('test-root').innerHTML = renderToStaticMarkup(createElement(App))
  assert.equal(document.querySelectorAll('main').length, 1)
  assert.equal(document.querySelectorAll('h1').length, 1)
  const scrollControl = document.querySelector('.floating-top')
  assert.ok(scrollControl.closest('main, footer, nav, header'), 'Kontrol mengambang harus berada dalam landmark')
  // Audit juga keadaan setelah scroll, saat kontrol mengambang bisa diakses.
  scrollControl.setAttribute('aria-hidden', 'false')
  scrollControl.tabIndex = 0
  scrollControl.classList.add('is-visible')
  for (const element of document.querySelectorAll('[aria-labelledby], [aria-describedby], [aria-controls]')) {
    for (const attribute of ['aria-labelledby', 'aria-describedby', 'aria-controls']) {
      for (const id of (element.getAttribute(attribute) || '').split(/\s+/).filter(Boolean)) assert.ok(document.getElementById(id), `${attribute}: ${id}`)
    }
  }
  for (const link of document.querySelectorAll('a[target="_blank"]')) {
    assert.ok(link.relList.contains('noopener') && link.relList.contains('noreferrer'))
  }
  window.eval(axe.source)
  const accessibility = await window.axe.run(document, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] },
    // Aturan ini memerlukan canvas/hit testing/layout browser. Main/H1 sudah
    // diperiksa secara struktural di atas; hasil visual tetap belum disertifikasi.
    rules: {
      'color-contrast': { enabled: false },
      'label-content-name-mismatch': { enabled: false },
      'landmark-one-main': { enabled: false },
      'page-has-heading-one': { enabled: false },
    },
  })
  const violations = accessibility.violations.map(item => ({ id: item.id, impact: item.impact, help: item.help, targets: item.nodes.map(node => node.target) }))
  assert.equal(violations.length, 0, JSON.stringify(violations, null, 2))
  console.log(`PASS: axe-core ${axe.version}: ${accessibility.passes.length} aturan lolos; 0 pelanggaran terdeteksi dalam audit DOM yang dijalankan.`)
  console.log('BATAS AUDIT: contrast, label-in-name, landmark-one-main, dan page-has-heading-one tidak dijalankan di axe karena membutuhkan browser; main/H1 diperiksa struktural. Bukan sertifikasi WCAG.')
  if (accessibility.incomplete.length) console.log('PERLU TINJAUAN MANUAL:', JSON.stringify(accessibility.incomplete.map(item => ({ id: item.id, checks: item.nodes.flatMap(node => [...node.any, ...node.all, ...node.none].map(check => ({ id: check.id, message: check.message, error: check.data?.message }))) }))))

  document.getElementById('test-root').innerHTML = ''
  root = createRoot(document.getElementById('test-root'))
  const { default: Navbar } = await vite.ssrLoadModule('/src/components/Navbar.jsx')
  const { default: useAnchorFocus } = await vite.ssrLoadModule('/src/hooks/useAnchorFocus.js')
  const navigation = { ...data.navigation, links: [{ id: 'home', label: 'Home test', number: '01' }, { id: 'integration-target', label: 'Target test', number: '02' }] }
  function NavigationHarness() {
    useAnchorFocus()
    return createElement('div', {}, createElement(Navbar, { name: data.hero.name, navigation, email: '' }), createElement('main', {}, createElement('section', { id: 'home' }, 'Home fixture'), createElement('section', { id: 'integration-target' }, 'Target fixture')))
  }
  await act(() => root.render(createElement(NavigationHarness)))
  const toggle = document.querySelector('.menu-toggle')
  await act(() => toggle.dispatchEvent(new window.MouseEvent('click', { bubbles: true, button: 0 })))
  assert.equal(toggle.getAttribute('aria-expanded'), 'true')
  const targetLink = document.querySelector('#mobile-navigation a[href="#integration-target"]')
  await act(() => targetLink.dispatchEvent(new window.MouseEvent('click', { bubbles: true, button: 0 })))
  assert.equal(toggle.getAttribute('aria-expanded'), 'false')
  assert.ok(document.querySelector('.mobile-menu-shell').hasAttribute('inert'))
  assert.equal(document.activeElement.id, 'integration-target')
  assert.equal(document.activeElement.tabIndex, -1)
  console.log('PASS: integrasi menu mobile + fokus anchor menutup menu dan memindahkan fokus ke tujuan yang benar.')
} finally {
  if (root) await act(() => root.unmount())
  await vite.close()
  dom.window.close()
}

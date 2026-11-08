import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import { createServer } from 'vite'
import { portfolioData as data } from '../src/data/portfolioData.js'
import { newestFirst, socialLinks, webUrl } from '../src/utils/content.js'

// Fixtures hanya berada di memori pengujian, tidak masuk portfolioData/public.
const dom = new JSDOM('<!doctype html><html><body><div id="test-root"></div></body></html>', { url: 'http://localhost/' })
globalThis.window = dom.window
globalThis.document = dom.window.document
globalThis.HTMLElement = dom.window.HTMLElement
globalThis.IS_REACT_ACT_ENVIRONMENT = true
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true })
globalThis.requestAnimationFrame = (callback) => setTimeout(callback, 0)
globalThis.cancelAnimationFrame = clearTimeout
window.matchMedia = (query) => ({ matches: query.includes('prefers-reduced-motion'), addEventListener() {}, removeEventListener() {} })

// jsdom tidak menyediakan top layer/focus trap dialog browser. Polyfill ini hanya
// memungkinkan pengujian state, tombol tutup, cancel, overflow, dan return focus.
window.HTMLDialogElement.prototype.showModal = function () {
  this.setAttribute('open', '')
  this.querySelector('button')?.focus()
}
window.HTMLDialogElement.prototype.close = function () { this.removeAttribute('open') }

const { createElement, act } = await import('react')
const { createRoot } = await import('react-dom/client')
const { renderToStaticMarkup } = await import('react-dom/server')
const root = createRoot(document.getElementById('test-root'))
const vite = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
const component = async (name) => (await vite.ssrLoadModule(`/src/components/${name}.jsx`)).default
const render = async (Component, props) => act(() => root.render(createElement(Component, props)))
const click = async (element) => {
  assert.ok(element, 'Elemen interaktif tidak ditemukan')
  element.focus()
  await act(() => element.dispatchEvent(new window.MouseEvent('click', { bubbles: true })))
}
const closeDialog = async () => click(document.querySelector(`dialog button[aria-label="${data.ui.close}"]`))
const image1 = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="60"%3E%3Crect width="80" height="60" fill="gray"/%3E%3C/svg%3E#test-1'
const image2 = image1.replace('#test-1', '#test-2')

try {
  const { default: App } = await vite.ssrLoadModule('/src/App.jsx')
  const page = new JSDOM(renderToStaticMarkup(createElement(App))).window.document
  const sectionIds = ['home', 'explore', 'education', 'work-experience', 'social-experience', 'organization-experience', 'skills', 'personal-skills', 'software-skills', 'projects', 'certificates', 'gallery', 'music', 'contact']
  for (const id of sectionIds) assert.ok(page.querySelector(`section#${id}`), id)
  assert.equal(page.querySelectorAll('h1').length, 1)
  const ids = [...page.querySelectorAll('[id]')].map((element) => element.id)
  assert.equal(ids.length, new Set(ids).size)
  for (const anchor of page.querySelectorAll('a[href^="#"]')) assert.ok(page.getElementById(anchor.getAttribute('href').slice(1)), anchor.outerHTML)
  assert.ok(page.querySelector('#explore').textContent.includes(data.about.description))
  assert.equal(page.querySelectorAll('.education-card').length, data.education.length)
  const experiences = [...data.workExperience, ...data.socialExperience, ...data.organizationExperience]
  assert.equal(page.querySelectorAll('.experience-entry').length, experiences.length)
  for (const item of experiences) for (const task of item.responsibilities || []) assert.ok(page.body.textContent.includes(task), task)
  assert.equal(page.querySelectorAll('.hard-skill-card').length, data.hardSkills.length)
  assert.equal(page.querySelectorAll('.personal-skill-card').length, data.personalSkills.length)
  assert.equal(page.querySelectorAll('.software-item').length, data.softwareSkills.length)
  assert.equal(page.querySelectorAll('.certificate-card').length, data.certificates.length)
  assert.equal(page.querySelectorAll('.project-card').length, data.projects.length)
  assert.equal(page.querySelectorAll('.gallery-item').length, data.gallery.filter(item => item.src).length)
  for (const image of page.querySelectorAll('img')) assert.ok(image.getAttribute('src')?.trim())
  for (const audio of page.querySelectorAll('audio')) assert.equal(audio.hasAttribute('autoplay'), false)
  assert.equal(page.querySelectorAll('dialog').length, 0)
  for (const [key, items] of [['organization', data.organizationExperience], ['projects', data.projects], ['gallery', data.gallery.filter(item => item.src)]]) {
    if (!items.length) assert.ok(page.body.textContent.includes(data.sections[key].emptyTitle))
  }
  assert.equal(page.querySelectorAll('#certificates button').length, data.certificates.filter(item => item.image).length)
  if (data.contact.phone) assert.ok(page.querySelector(`a[href="tel:${data.contact.phone.replace(/[^\d+]/g, '')}"]`))
  if (data.contact.email) assert.ok(page.querySelector(`a[href="mailto:${data.contact.email}"]`))
  assert.ok(page.querySelector('footer').textContent.includes(String(new Date().getFullYear())))
  console.log('PASS: semua section/CV tampil, anchor valid, data kosong jujur, kontak/tahun benar, tanpa gambar/audio kosong.')

  assert.equal(webUrl('javascript:alert(1)'), '')
  assert.equal(webUrl('#'), '')
  assert.equal(webUrl(''), '')
  assert.equal(socialLinks({}).length, 0)
  assert.equal(socialLinks({ github: 'https://example.com/test', instagram: 'javascript:alert(1)' }).length, 1)
  const unordered = [{ startDate: '' }, { startDate: '2021-01' }, { startDate: '2025-08' }]
  const ordered = newestFirst(unordered)
  assert.equal(ordered[0].startDate, '2025-08')
  assert.equal(unordered[0].startDate, '')
  console.log('PASS: tautan kosong/tidak valid disembunyikan, urutan tanggal benar tanpa mengubah array sumber.')

  const Projects = await component('Projects')
  const project = { id: 'test-only', title: '__TEST_PROJECT__', description: 'Fixture pengujian saja.', technologies: ['React'], year: 2026, image: '', github: 'javascript:alert(1)', demo: 'https://example.com/test' }
  await render(Projects, { items: [project], heading: data.sections.projects, ui: data.ui })
  document.body.style.overflow = 'auto'
  const projectButton = document.querySelector('.project-open')
  await click(projectButton)
  assert.ok(document.querySelector('dialog[open]'))
  assert.equal(document.body.style.overflow, 'hidden')
  assert.equal(document.querySelector('dialog h2').textContent, project.title)
  assert.ok(document.querySelector('dialog').textContent.includes('React'))
  assert.equal(document.querySelectorAll('dialog a').length, 1)
  assert.equal(document.querySelector('dialog a').rel, 'noopener noreferrer')
  await closeDialog()
  assert.equal(document.querySelector('dialog'), null)
  assert.equal(document.body.style.overflow, 'auto')
  assert.equal(document.activeElement, projectButton)
  await click(projectButton)
  await act(() => document.querySelector('dialog').dispatchEvent(new window.Event('cancel', { cancelable: true })))
  assert.equal(document.querySelector('dialog'), null)
  console.log('PASS: modal proyek, konten/link valid, close/cancel, scroll lock, dan return focus.')

  const Gallery = await component('Gallery')
  const photos = [{ id: 'test-image-1', src: image1, alt: 'Test image one' }, { id: 'test-image-2', src: image2, alt: 'Test image two' }]
  await render(Gallery, { items: photos, heading: data.sections.gallery, ui: data.ui })
  await click(document.querySelector('.gallery-item button'))
  assert.equal(document.querySelector('dialog img').alt, photos[0].alt)
  await click(document.querySelector(`button[aria-label="${data.ui.next}"]`))
  assert.equal(document.querySelector('dialog img').alt, photos[1].alt)
  await act(() => document.querySelector('dialog').dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })))
  assert.equal(document.querySelector('dialog img').alt, photos[0].alt)
  await click(document.querySelector(`button[aria-label="${data.ui.previous}"]`))
  assert.equal(document.querySelector('dialog img').alt, photos[1].alt)
  await click(document.querySelector(`button[aria-label="${data.ui.zoomIn}"]`))
  assert.ok(document.querySelector('.lightbox-viewport.is-zoomed'))
  await click(document.querySelector(`button[aria-label="${data.ui.zoomOut}"]`))
  assert.equal(document.querySelector('.lightbox-viewport.is-zoomed'), null)
  await act(() => document.querySelector('dialog img').dispatchEvent(new window.Event('error')))
  assert.equal(document.querySelector('dialog img'), null)
  assert.ok(document.querySelector('dialog .asset-placeholder'))
  await closeDialog()
  console.log('PASS: lightbox galeri, next/previous, keyboard, wrap, zoom, dan fallback gambar error.')

  const Certificates = await component('Certificates')
  const sampleCertificate = { id: 'test-certificate', name: '__TEST_CERTIFICATE__', date: '2024-11', dateLabel: 'November 2024', image: image1 }
  await render(Certificates, { items: [sampleCertificate], heading: data.sections.certificates, ui: data.ui })
  await click(document.querySelector('.certificate-card button'))
  assert.equal(document.querySelector('dialog img').alt, sampleCertificate.name)
  await closeDialog()
  const ExperienceList = await component('ExperienceList')
  const sampleExperience = { id: 'test-experience-item', role: '__TEST_ROLE__', organization: '__TEST_ORGANIZATION__', responsibilities: ['Fixture responsibility one.', 'Fixture responsibility two.'], images: photos }
  await render(ExperienceList, { id: 'test-experience', items: [sampleExperience], heading: data.sections.social, ui: data.ui })
  assert.equal(document.querySelectorAll('details li').length, sampleExperience.responsibilities.length)
  await click(document.querySelector('.experience-photos button'))
  assert.ok(document.querySelector('dialog[open] img'))
  await closeDialog()
  console.log('PASS: gambar sertifikat/dokumentasi dan tanggung jawab fixture dapat digunakan tanpa bergantung pada jumlah data CV.')

  const AssetImage = await component('AssetImage')
  await render(AssetImage, { src: image1, alt: 'Test', placeholder: data.ui.imageMissing })
  await act(() => document.querySelector('#test-root img').dispatchEvent(new window.Event('error')))
  assert.equal(document.querySelector('#test-root img'), null)
  await render(AssetImage, { src: image2, alt: 'Test replacement', placeholder: data.ui.imageMissing })
  assert.equal(document.querySelector('#test-root img').alt, 'Test replacement')
  const SoftwareSkills = await component('SoftwareSkills')
  const sampleSoftware = { id: 'test-software', name: '__TEST_SOFTWARE__', category: 'Test', logo: image1 }
  await render(SoftwareSkills, { items: [sampleSoftware], heading: data.sections.software, ui: data.ui })
  assert.equal(document.querySelector('.software-logo img').alt, sampleSoftware.name)
  await act(() => document.querySelector('.software-logo img').dispatchEvent(new window.Event('error')))
  assert.equal(document.querySelector('.software-logo img'), null)
  assert.equal(document.querySelector('.software-logo svg'), null)
  console.log('PASS: pergantian path aset dan logo error memakai placeholder, tanpa ikon aplikasi palsu.')

  for (const name of ['Education', 'Skills', 'PersonalSkills', 'SoftwareSkills', 'Projects', 'Certificates', 'Gallery', 'OrganizationExperience']) {
    const Component = await component(name)
    await render(Component, { heading: { title: 'Empty test', eyebrow: 'Test', emptyTitle: data.ui.empty }, ui: data.ui })
    assert.ok(document.querySelector('section'), name)
  }
  console.log('PASS: seluruh daftar section menerima data kosong tanpa error.')
} finally {
  await act(() => root.unmount())
  await vite.close()
  dom.window.close()
}

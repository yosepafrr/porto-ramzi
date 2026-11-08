import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import { createServer } from 'vite'
import { portfolioData as data } from '../src/data/portfolioData.js'
import { formatTime, playableTracks } from '../src/utils/music.js'

// Tidak ada lagu/audio buatan yang ditulis ke public atau konfigurasi.
// jsdom tidak mendekode/memainkan audio; media mock menguji kontrak API/event,
// state player, kontrol, dan penanganan promise secara deterministik.
const dom = new JSDOM('<!doctype html><html><body><div id="test-root"></div></body></html>', { url: 'http://localhost/' })
globalThis.window = dom.window
globalThis.document = dom.window.document
globalThis.HTMLElement = dom.window.HTMLElement
globalThis.IS_REACT_ACT_ENVIRONMENT = true
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true })
globalThis.requestAnimationFrame = (callback) => setTimeout(callback, 0)
globalThis.cancelAnimationFrame = clearTimeout
window.matchMedia = (query) => ({ matches: query.includes('prefers-reduced-motion'), addEventListener() {}, removeEventListener() {} })

const states = new WeakMap()
let nextPlay = null
let totalPlayCalls = 0
function state(audio) {
  if (!states.has(audio)) states.set(audio, { paused: true, ended: false, duration: NaN, currentTime: 0, volume: 1, muted: false, error: null, loadCalls: 0, playCalls: 0, pauseCalls: 0, volumeLocked: false })
  return states.get(audio)
}
const emit = (audio, name) => audio.dispatchEvent(new window.Event(name))
const media = window.HTMLMediaElement.prototype
for (const property of ['paused', 'ended', 'duration', 'error']) Object.defineProperty(media, property, { configurable: true, get() { return state(this)[property] } })
Object.defineProperty(media, 'currentTime', { configurable: true, get() { return state(this).currentTime }, set(value) { assert.ok(Number.isFinite(value)); state(this).currentTime = value; state(this).ended = false } })
for (const property of ['volume', 'muted']) Object.defineProperty(media, property, {
  configurable: true,
  get() { return state(this)[property] },
  set(value) {
    if (property === 'volume' && state(this).volumeLocked) return
    state(this)[property] = value
    emit(this, 'volumechange')
  },
})
media.load = function () {
  Object.assign(state(this), { paused: true, ended: false, duration: NaN, currentTime: 0, error: null, loadCalls: state(this).loadCalls + 1 })
  emit(this, 'loadstart')
}
media.pause = function () {
  const changed = !state(this).paused
  state(this).pauseCalls += 1
  state(this).paused = true
  if (changed) emit(this, 'pause')
}
media.play = function () {
  totalPlayCalls += 1
  state(this).playCalls += 1
  const behavior = nextPlay
  nextPlay = null
  if (behavior?.error) return Promise.reject(behavior.error)
  state(this).paused = false
  state(this).ended = false
  emit(this, 'play')
  if (behavior?.pending) return behavior.pending
  emit(this, 'playing')
  return Promise.resolve()
}

const { createElement, act, StrictMode } = await import('react')
const { createRoot } = await import('react-dom/client')
const { renderToStaticMarkup } = await import('react-dom/server')
const vite = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
const root = createRoot(document.getElementById('test-root'))
const { default: MusicPlayer } = await vite.ssrLoadModule('/src/components/MusicPlayer.jsx')
const props = { heading: data.sections.music, settings: data.musicPlayer }
const tracks = [1, 2, 3].map((number) => ({ id: `test-track-${number}`, title: `__TEST_TRACK_${number}__`, artist: '__TEST_ARTIST__', src: `/test-only-${number}.mp3`, cover: '' }))
const audio = () => document.querySelector('audio')
const playButton = () => document.querySelector('.music-play-button')
const button = (label) => document.querySelector(`button[aria-label="${label}"]`)
const title = () => document.querySelector('.music-track-info h3').textContent
const render = async (items, strict = false) => act(() => root.render(strict ? createElement(StrictMode, {}, createElement(MusicPlayer, { ...props, items })) : createElement(MusicPlayer, { ...props, items })))
const click = async (element) => {
  assert.ok(element && !element.disabled, 'Kontrol tidak ditemukan/disabled')
  await act(async () => { element.dispatchEvent(new window.MouseEvent('click', { bubbles: true })); await Promise.resolve() })
}
const range = async (element, value) => {
  assert.ok(!element.disabled, 'Slider disabled')
  await act(() => {
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(element, String(value))
    element.dispatchEvent(new window.Event('input', { bubbles: true }))
    element.dispatchEvent(new window.Event('change', { bubbles: true }))
  })
}
const metadata = async (duration) => act(() => { state(audio()).duration = duration; emit(audio(), 'loadedmetadata') })
const ended = async () => act(async () => {
  const element = audio()
  Object.assign(state(element), { ended: true, paused: true, currentTime: state(element).duration })
  emit(element, 'timeupdate')
  emit(element, 'pause')
  emit(element, 'ended')
  await Promise.resolve()
})
const deferred = () => {
  let resolve, reject
  const pending = new Promise((yes, no) => { resolve = yes; reject = no })
  return { pending, resolve, reject }
}

try {
  assert.ok(Array.isArray(data.music))
  assert.equal(formatTime(NaN), '0:00')
  assert.equal(formatTime(Infinity), '0:00')
  assert.equal(formatTime(-30), '0:00')
  assert.equal(formatTime(125.9), '2:05')
  assert.equal(playableTracks([null, {}, { src: '   ' }, tracks[0]]).length, 1)
  await render([])
  assert.equal(audio(), null)
  assert.equal(document.querySelectorAll('img').length, 0)
  for (const element of document.querySelectorAll('button, input')) assert.ok(element.disabled)
  assert.ok(document.body.textContent.includes(data.musicPlayer.emptyTitle))
  assert.equal(totalPlayCalls, 0)
  console.log('PASS: playlist kosong tanpa elemen/sumber audio, kontrol disabled, tanpa lagu/cover fiktif.')

  const staticPlayer = new JSDOM(renderToStaticMarkup(createElement(MusicPlayer, { ...props, items: tracks }))).window.document
  assert.equal(staticPlayer.querySelector('audio').hasAttribute('autoplay'), false)
  assert.equal(staticPlayer.querySelector('audio').getAttribute('preload'), 'metadata')
  await render(tracks, true)
  assert.equal(totalPlayCalls, 0)
  assert.equal(state(audio()).paused, true)
  assert.equal(playButton().getAttribute('aria-label'), data.musicPlayer.play)
  assert.equal(state(audio()).volume, data.musicPlayer.initialVolume)
  assert.equal(document.querySelectorAll('.music-playlist-track').length, 3)
  assert.ok(document.querySelector('.music-progress input').disabled)
  console.log('PASS: mount/StrictMode tanpa autoplay; playlist, judul, volume awal, dan preload benar.')

  await render(tracks)
  await metadata(120)
  await click(playButton())
  assert.equal(state(audio()).paused, false)
  assert.ok(document.querySelector('.music-layout.is-playing'))
  assert.equal(playButton().getAttribute('aria-label'), data.musicPlayer.pause)
  await range(document.querySelector('.music-progress input'), 60)
  assert.equal(state(audio()).currentTime, 60)
  assert.equal(document.querySelector('.music-times').textContent, '1:002:00')
  await act(() => { state(audio()).currentTime = 75; emit(audio(), 'timeupdate') })
  assert.equal(document.querySelector('.music-progress input').value, '75')
  await click(playButton())
  assert.equal(state(audio()).paused, true)
  const beforePausedNext = totalPlayCalls
  await click(button(data.musicPlayer.next))
  assert.equal(title(), tracks[1].title)
  assert.equal(totalPlayCalls, beforePausedNext)
  assert.equal(state(audio()).paused, true)
  await click(button(data.musicPlayer.previous))
  assert.equal(title(), tracks[0].title)
  console.log('PASS: play/pause, metadata, seek/timeupdate; next/previous saat dijeda tetap dijeda.')

  await range(document.querySelector('.music-volume input'), 0.3)
  assert.equal(state(audio()).volume, 0.3)
  await click(button(data.musicPlayer.mute))
  assert.equal(state(audio()).muted, true)
  await click(button(data.musicPlayer.unmute))
  assert.equal(state(audio()).muted, false)
  assert.equal(state(audio()).volume, 0.3)
  await range(document.querySelector('.music-volume input'), 0)
  await click(button(data.musicPlayer.unmute))
  assert.equal(state(audio()).volume, 0.3)
  await act(() => { state(audio()).volume = 0.5; emit(audio(), 'volumechange') })
  assert.equal(document.querySelector('.music-volume input').value, '0.5')
  console.log('PASS: volume, mute/unmute, pemulihan volume nol, dan sinkronisasi volumechange.')

  await click(document.querySelectorAll('.music-playlist-track')[1])
  assert.equal(title(), tracks[1].title)
  assert.equal(state(audio()).paused, false)
  assert.equal(document.querySelector('[aria-current="true"] .music-playlist-info strong').textContent, tracks[1].title)
  await click(button(data.musicPlayer.next))
  assert.equal(title(), tracks[2].title)
  assert.equal(state(audio()).paused, false)
  await click(button(data.musicPlayer.next))
  assert.equal(title(), tracks[0].title)
  await metadata(90)
  await ended()
  assert.equal(title(), tracks[1].title)
  assert.equal(state(audio()).paused, false)
  await click(document.querySelectorAll('.music-playlist-track')[2])
  await metadata(90)
  await ended()
  assert.equal(title(), tracks[2].title)
  assert.equal(state(audio()).paused, true)
  assert.equal(playButton().getAttribute('aria-label'), data.musicPlayer.play)
  console.log('PASS: pemilihan playlist, indikator aktif, next wrap, auto-next setelah Play, berhenti di akhir playlist.')

  nextPlay = { error: new window.DOMException('Blocked', 'NotAllowedError') }
  await click(playButton())
  assert.equal(document.querySelector('[role="alert"]').textContent, data.musicPlayer.blockedError)
  assert.equal(state(audio()).paused, true)
  await click(playButton())
  assert.equal(document.querySelector('[role="alert"]'), null)
  await act(() => { state(audio()).error = { code: 4 }; emit(audio(), 'error') })
  assert.equal(document.querySelector('[role="alert"]').textContent, data.musicPlayer.sourceError)
  assert.equal(state(audio()).paused, true)
  const loadsBeforeRetry = state(audio()).loadCalls
  await click(playButton())
  assert.ok(state(audio()).loadCalls > loadsBeforeRetry)
  assert.equal(document.querySelector('[role="alert"]'), null)
  nextPlay = { error: new window.DOMException('Unsupported', 'NotSupportedError') }
  await click(button(data.musicPlayer.next))
  assert.equal(document.querySelector('[role="alert"]').textContent, data.musicPlayer.sourceError)
  console.log('PASS: play() ditolak dan error file/format tertangani; retry memuat ulang tanpa unhandled rejection.')

  const waiting = deferred()
  nextPlay = waiting
  await click(playButton())
  assert.ok(document.querySelector('.audio-spinner'))
  await click(button(data.musicPlayer.next))
  const activeAfterSwitch = title()
  await act(async () => { waiting.reject(new window.DOMException('Old request', 'AbortError')); await Promise.resolve() })
  assert.equal(title(), activeAfterSwitch)
  assert.equal(document.querySelector('[role="alert"]'), null)
  assert.equal(state(audio()).paused, false)
  await click(playButton())
  const pausedRequest = deferred()
  nextPlay = pausedRequest
  await click(playButton())
  await click(playButton())
  await act(async () => { pausedRequest.reject(new window.DOMException('Paused request', 'AbortError')); await Promise.resolve() })
  assert.equal(state(audio()).paused, true)
  assert.equal(document.querySelector('[role="alert"]'), null)
  console.log('PASS: pergantian lagu dan Pause saat play() tertunda mengabaikan hasil/error permintaan lama.')

  await metadata(Infinity)
  assert.ok(document.querySelector('.music-progress input').disabled)
  assert.ok(!document.querySelector('.music-times').textContent.includes('NaN'))
  await metadata(NaN)
  assert.equal(document.querySelector('.music-times').textContent, '0:000:00')
  await metadata(200)
  assert.equal(document.querySelector('.music-progress input').disabled, false)
  state(audio()).volumeLocked = true
  await range(document.querySelector('.music-volume input'), 0.2)
  assert.ok(document.querySelector('.music-volume input').disabled)
  assert.ok(document.body.textContent.includes(data.musicPlayer.deviceVolume))
  console.log('PASS: durasi NaN/Infinity tidak merusak seek; pembatasan volume perangkat memiliki fallback.')

  await click(document.querySelectorAll('.music-playlist-track')[1])
  const selected = title()
  const loadCount = state(audio()).loadCalls
  await render([tracks[2], tracks[1], tracks[0]])
  assert.equal(title(), selected)
  assert.equal(state(audio()).loadCalls, loadCount)
  const beforeRemoval = totalPlayCalls
  await render([tracks[0]])
  assert.equal(title(), tracks[0].title)
  assert.equal(state(audio()).paused, true)
  assert.equal(totalPlayCalls, beforeRemoval)
  assert.ok(button(data.musicPlayer.previous).disabled)
  assert.ok(button(data.musicPlayer.next).disabled)
  const oldAudio = audio()
  await render([])
  assert.equal(audio(), null)
  assert.equal(oldAudio.getAttribute('src'), null)
  assert.equal(state(oldAudio).paused, true)
  await render([null, { id: 'missing-src', src: '' }, tracks[0]])
  assert.equal(document.querySelectorAll('.music-playlist-track').length, 1)
  console.log('PASS: reorder mempertahankan lagu; penghapusan/playlist kosong berhenti aman; record tanpa src dilewati.')
} finally {
  await act(() => root.unmount())
  await vite.close()
  dom.window.close()
}

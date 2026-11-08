import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

// Windows dapat menerima nama dengan kapitalisasi berbeda; hosting Linux tidak.
// Pemeriksaan ini membaca tiap segmen secara case-sensitive pada semua OS.
export function inspectAsset(value, root) {
  if (!value) return { type: 'empty' }
  assert.equal(typeof value, 'string', 'Path aset harus berupa string')
  if (/^https?:\/\//i.test(value)) return { type: 'external', url: new URL(value).href }
  if (/^data:(?:image|audio)\//i.test(value)) return { type: 'inline' }
  assert.ok(value.startsWith('/') && !value.startsWith('//'), `Gunakan path root-relative: ${value}`)
  const decoded = decodeURIComponent(value.split(/[?#]/, 1)[0])
  assert.ok(!decoded.includes('\\') && !decoded.includes('\0'), `Path aset tidak valid: ${value}`)
  const segments = decoded.split('/').filter(Boolean)
  assert.ok(segments.length && !segments.some(part => part === '..' || part === '.'), `Path aset tidak valid: ${value}`)
  const resolvedRoot = fs.realpathSync(root)
  let current = resolvedRoot
  for (const segment of segments) {
    const names = fs.readdirSync(current)
    if (!names.includes(segment)) {
      const differentCase = names.find(name => name.toLowerCase() === segment.toLowerCase())
      throw new Error(differentCase ? `Kapitalisasi path salah: ${value}; gunakan ${differentCase}` : `Aset tidak ditemukan: ${value}`)
    }
    current = path.join(current, segment)
  }
  const real = fs.realpathSync(current)
  assert.ok(real.startsWith(resolvedRoot + path.sep), `Aset berada di luar folder public/build: ${value}`)
  assert.ok(fs.statSync(real).isFile(), `Aset bukan file: ${value}`)
  return { type: 'local', file: real, bytes: fs.statSync(real).size }
}

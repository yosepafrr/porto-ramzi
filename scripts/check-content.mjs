import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { portfolioData as data } from '../src/data/portfolioData.js'
import { webUrl } from '../src/utils/content.js'
import { inspectAsset } from './asset-path.mjs'

const publicRoot = fileURLToPath(new URL('../public/', import.meta.url))
const groups = ['education', 'workExperience', 'socialExperience', 'organizationExperience', 'hardSkills', 'coreSkills', 'personalSkills', 'softwareSkills', 'projects', 'certificates', 'gallery', 'music']
for (const key of groups) {
  assert.ok(Array.isArray(data[key]), `${key} harus berupa array`)
  if (key === 'coreSkills') {
    assert.ok(data[key].every(value => typeof value === 'string' && value.trim()))
    continue
  }
  const ids = new Set()
  for (const item of data[key]) {
    assert.ok(item && typeof item.id === 'string' && item.id.trim(), `${key}: id wajib diisi`)
    assert.ok(!ids.has(item.id), `${key}: id duplikat ${item.id}`)
    ids.add(item.id)
  }
}
const month = /^\d{4}-(0[1-9]|1[0-2])$/
for (const item of [...data.workExperience, ...data.socialExperience, ...data.organizationExperience]) {
  for (const key of ['startDate', 'endDate']) if (item[key]) assert.ok(month.test(item[key]), `${item.id}.${key}: gunakan YYYY-MM`)
  if (item.startDate && item.endDate) assert.ok(item.startDate <= item.endDate, `${item.id}: periode terbalik`)
  assert.ok(Array.isArray(item.responsibilities) && Array.isArray(item.images), `${item.id}: responsibilities/images harus berupa array`)
}
for (const item of data.certificates) if (item.date) assert.ok(month.test(item.date), `${item.id}: gunakan YYYY-MM`)
for (const item of data.education) {
  if (item.startYear && item.endYear) assert.ok(Number.isInteger(item.startYear) && Number.isInteger(item.endYear) && item.startYear <= item.endYear, `${item.id}: tahun pendidikan tidak valid`)
  assert.ok(Array.isArray(item.competencies), `${item.id}: competencies harus berupa array`)
}
for (const item of [...data.hardSkills, ...data.personalSkills, ...data.softwareSkills]) {
  assert.ok(item.name?.trim(), `${item.id}: nama skill belum diisi`)
  for (const key of ['percentage', 'rating', 'progress']) assert.ok(!(key in item), `${item.id}: jangan menambahkan rating/persentase tanpa data pendukung`)
}
assert.ok(data.hero.name.trim() && data.seo.title.trim() && data.seo.description.trim(), 'Nama dan metadata harus tersedia')
if (data.contact.email) assert.ok(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact.email), 'Format email tidak valid')
for (const value of [data.contact.instagram, data.contact.linkedin, data.contact.github, ...(data.contact.otherSocials || []).map(item => item.url), ...data.projects.flatMap(item => [item.github, item.demo])]) {
  if (value) assert.ok(webUrl(value), `URL tidak valid: ${value}`)
}

const totals = { local: 0, empty: 0, external: 0, inline: 0 }
const external = []
function walk(value, label = 'portfolioData') {
  if (Array.isArray(value)) { value.forEach((item, index) => walk(item, `${label}[${index}]`)); return }
  if (!value || typeof value !== 'object') return
  for (const [key, child] of Object.entries(value)) {
    if (['src', 'image', 'logo', 'cover'].includes(key)) {
      assert.equal(typeof child, 'string', `${label}.${key}: path harus berupa string`)
      const result = inspectAsset(child, publicRoot)
      totals[result.type] += 1
      if (result.type === 'external') external.push({ field: `${label}.${key}`, url: result.url })
    } else walk(child, `${label}.${key}`)
  }
}
walk(data)
inspectAsset('/favicon.svg', publicRoot)
assert.throws(() => inspectAsset('/FAVICON.svg', publicRoot), /Kapitalisasi/)
assert.throws(() => inspectAsset('/../package.json', publicRoot), /tidak valid/)
assert.throws(() => inspectAsset('/__missing_quality_control_file__.png', publicRoot), /tidak ditemukan/)
console.log('PASS: struktur/ID/tanggal/kontak/URL, aset lokal dan kapitalisasi, serta metadata konfigurasi valid.')
console.log(JSON.stringify({ assetFields: totals, favicon: 'valid', records: Object.fromEntries(groups.map(key => [key, data[key].length])) }, null, 2))
if (external.length) console.log('BELUM DIVERIFIKASI: aset eksternal memerlukan pemeriksaan HTTP/browser:', JSON.stringify(external))

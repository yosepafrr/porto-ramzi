import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { JSDOM } from 'jsdom'
import { portfolioData as data } from '../src/data/portfolioData.js'
import config from '../vite.config.js'
import { inspectAsset } from './asset-path.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const dist = path.join(root, 'dist')
const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
const doc = new JSDOM(html).window.document
assert.equal(doc.documentElement.lang, 'id')
assert.equal(doc.title, data.seo.title)
assert.equal(doc.querySelector('meta[name="description"]').content, data.seo.description)
assert.ok(doc.querySelector('meta[name="viewport"]'))
assert.ok(!html.includes('__PORTFOLIO_'))
const assets = [...doc.querySelectorAll('script[src], link[href]')].map(element => element.getAttribute('src') || element.getAttribute('href'))
for (const asset of assets) assert.equal(inspectAsset(asset, dist).type, 'local')
const js = fs.readdirSync(path.join(dist, 'assets')).filter(name => name.endsWith('.js')).map(name => fs.readFileSync(path.join(dist, 'assets', name), 'utf8')).join('\n')
for (const fixture of ['__TEST_PROJECT__', '__TEST_TRACK_', '__TEST_CERTIFICATE__', '__TEST_SOFTWARE__', 'test-below', 'Home fixture']) assert.ok(!js.includes(fixture), `Fixture masuk bundle: ${fixture}`)
assert.ok(!js.includes('axe-core'), 'Alat audit tidak boleh masuk runtime bundle')
const css = fs.readdirSync(path.join(dist, 'assets')).filter(name => name.endsWith('.css')).map(name => fs.readFileSync(path.join(dist, 'assets', name), 'utf8')).join('\n')
assert.ok(css.includes('prefers-reduced-motion'))

// Input metadata dengan karakter khusus tidak boleh berubah menjadi markup.
const metadata = config.plugins.find(plugin => plugin.name === 'portfolio-metadata')
const original = data.seo
const special = `Portfolio & <tag> "quote" 'quote' $&`
try {
  data.seo = { title: special, description: special }
  const transformed = metadata.transformIndexHtml(fs.readFileSync(path.join(root, 'index.html'), 'utf8'))
  const escaped = new JSDOM(transformed).window.document
  assert.equal(escaped.title, special)
  assert.equal(escaped.querySelector('meta[name="description"]').content, special)
  assert.equal(escaped.querySelector('tag'), null)
} finally { data.seo = original }
console.log('PASS: HTML production, metadata/escaping, favicon/CSS/JS, reduced-motion CSS, dan isolasi fixture/alat QA valid.')
console.log(JSON.stringify(assets.map(asset => ({ asset, bytes: inspectAsset(asset, dist).bytes })), null, 2))

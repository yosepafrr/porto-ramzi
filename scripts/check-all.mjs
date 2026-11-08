import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
for (const name of ['check-content', 'check-stage2', 'check-stage4', 'check-stage5', 'check-stage6', 'check-stage7', 'check-theme']) {
  console.log(`\n[CHECK] ${name}`)
  const result = spawnSync(process.execPath, [`scripts/${name}.mjs`], { cwd: root, stdio: 'inherit' })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status || 1)
}
console.log('\nPASS: seluruh pemeriksaan otomatis selesai. Pemeriksaan visual/audio nyata tetap terpisah.')

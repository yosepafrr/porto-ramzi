import { motion } from 'framer-motion'
import { Check, Code2, FolderOpen, Layers3 } from 'lucide-react'

// Halaman sementara untuk memeriksa integrasi Tahap 1, sebelum desain Tahap 2.
const checks = [
  { icon: Code2, label: 'React + Vite', detail: 'JavaScript / JSX' },
  { icon: Layers3, label: 'UI dependencies', detail: 'Tailwind CSS · Framer Motion · Lucide' },
  { icon: FolderOpen, label: 'Konten & aset', detail: 'Konfigurasi terpusat, folder aset terpisah' },
]

export default function SetupStatus({ hero }) {
  return (
    <main className="flex min-h-svh items-center justify-center px-5 py-16 sm:px-8">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-12"
        aria-labelledby="setup-heading"
      >
        <p className="mb-8 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-lime-300">
          <span className="h-1.5 w-1.5 rounded-full bg-lime-300" aria-hidden="true" />
          Personal portfolio · Tahap 1
        </p>
        <h1 id="setup-heading" className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {hero.name}
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-7 text-slate-400 sm:text-base">{hero.role}</p>
        <div className="mt-10 space-y-5 border-y border-white/10 py-7">
          {checks.map(({ icon: Icon, label, detail }) => (
            <div key={label} className="flex items-center gap-4">
              <Icon size={20} className="shrink-0 text-slate-400" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{label}</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">{detail}</p>
              </div>
              <Check size={17} className="shrink-0 text-lime-300" aria-hidden="true" />
            </div>
          ))}
        </div>
        <p className="mt-7 text-sm leading-6 text-slate-400">
          Fondasi project telah disiapkan. Halaman ini merupakan tampilan sementara
          untuk verifikasi setup; desain utama dikerjakan pada Tahap 2.
        </p>
      </motion.section>
    </main>
  )
}

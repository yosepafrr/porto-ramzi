# Laporan Tahap 6 — Animation & UI/UX

Tanggal: 7 November 2026.

## Hasil implementasi

Identitas visual dan isi CV dipertahankan. Penyempurnaan berfokus pada animasi
singkat, navigasi, fokus keyboard, dan perilaku yang tetap dapat digunakan saat
gerakan dikurangi.

| Area | Perubahan |
| --- | --- |
| Pembuka | Garis aksen dekoratif singkat; konten langsung dapat dipakai, tanpa scroll lock/layar tunggu |
| Hero | Entrance Framer Motion sekitar 0,5 detik dengan perbedaan waktu kecil antara teks dan foto |
| Section | Reveal sekali saat masuk viewport, memakai opacity/translate ringan |
| Hover | Durasi konsisten, highlight kartu/media, dan indikator fokus; efek gerak hover dibatasi pada pointer yang mendukung |
| Menu mobile | Transisi buka/tutup; konten tertutup memakai inert dan aria-hidden agar tidak menerima fokus keyboard |
| Modal | Animasi masuk/keluar Framer Motion; backdrop bertransisi; penutupan memiliki batas waktu agar tidak tersangkut |
| Lightbox | Pergantian gambar dengan fade/reveal ringan, pintasan zoom, area gambar fokusable, dan reset posisi scroll antar gambar |
| Anchor | Smooth scrolling native dipertahankan; fokus dipindahkan ke tujuan navigasi |
| Kembali ke atas | Tombol mengambang muncul setelah scroll 500px; lingkaran menunjukkan progres halaman |
| Reduced motion | Preferensi sistem dipantau secara langsung; reveal/entrance dilewati, transisi tambahan dinonaktifkan, dan scroll menjadi instan |

Tidak ada pergantian halaman/router yang ditambahkan karena portfolio tetap
single page. Section berpindah melalui anchor yang sudah ada.

## Perilaku dan aksesibilitas

- Reveal dimulai dari konten terlihat pada render statis komponen. Elemen di
  bawah viewport baru disiapkan untuk animasi setelah mount jika observer ada.
  Ini tidak mengubah aplikasi Vite menjadi SSR/prerendered site.
- Tanpa IntersectionObserver, atau jika observer gagal dibuat, konten tetap
  terlihat. Fokus pada konten/section juga langsung menyelesaikan reveal.
- Reveal hanya berjalan sekali. Observer dan animasi dibersihkan saat komponen
  dilepas. Tidak ada animasi scroll yang berjalan terus-menerus untuk setiap kartu.
- Pembuka tidak berisi kontrol atau klaim persentase jaringan; tidak mengunci
  body atau menunda mounting portfolio. Ada cleanup/batas waktu dekorasi.
- Menu tertutup dinonaktifkan secara langsung meskipun transisi visual penutup
  masih berlangsung. Escape tetap mengembalikan fokus ke tombol menu.
- Klik anchor internal memindahkan fokus ke tujuan tanpa mengambil alih URL
  hash atau mekanisme scroll browser. Klik dengan modifier/download/tab baru
  tidak diambil alih.
- Modal tetap memakai native dialog. Selama keluar, konten dialog dinonaktifkan;
  setelah selesai, scroll dan fokus pemicu dipulihkan. Callback penutupan hanya
  dipanggil satu kali. Unmount membersihkan timer/animasi.
- Jika reduced motion diaktifkan saat modal menutup, penutupan diselesaikan
  langsung. Pembuka tidak muncul kembali setelah pernah dilewati/diselesaikan.
- Lightbox: panah berpindah gambar; `+`/`=` memperbesar, `−`/`0` mengembalikan
  ukuran. Shortcut Ctrl/Cmd/Alt tidak diambil alih. Jika gambar diperbesar dan
  area gambar difokuskan, panah dibiarkan untuk panning native.
- Perpindahan gambar mengembalikan zoom dan posisi scroll ke awal agar gambar
  baru tidak muncul dalam posisi terpotong akibat scroll sebelumnya.
- Tidak ada perubahan pada playlist atau lifecycle HTML5 Audio.

## File yang dibuat

- `src/components/Reveal.jsx`: reveal/entrance yang memakai Framer Motion.
- `src/components/PageIntro.jsx`: animasi pembuka dekoratif.
- `src/components/ScrollTools.jsx`: tombol kembali ke atas dan progres scroll.
- `src/hooks/useMotionPreference.js`: preferensi reduced motion yang reaktif.
- `src/hooks/useAnchorFocus.js`: fokus pada tujuan anchor internal.
- `src/utils/motion.js`: durasi dan easing utama.
- `src/interactions.css`: transisi UI, hover, backdrop, menu, serta CSS reduced motion.
- `scripts/check-stage6.mjs`: uji lifecycle, preferensi, fokus, dan interaksi.
- `docs/TAHAP-6.md`: laporan tahap ini.

## File yang diperbarui

- `src/App.jsx`: memasang pembuka, navigasi fokus, dan scroll tools.
- `src/components/Hero.jsx`, `Section.jsx`: memakai reveal bersama.
- `src/components/Navbar.jsx`: panel animasi dan inert untuk menu tertutup.
- `src/components/Modal.jsx`: animasi masuk/keluar dengan penutupan yang terjaga.
- `src/components/Lightbox.jsx`: transisi gambar, pintasan, fokus, reset scroll.
- `src/index.css`: impor stylesheet interaksi.
- `src/data/portfolioData.js`: label bantuan lightbox, tanpa mengubah data CV.
- `package.json`: script `check:stage6`.
- `scripts/check-stage2.mjs`, `check-stage4.mjs`, `check-stage5.mjs`: regresi
  fungsional memakai reduced motion; pengujian jalur animasi dipisah ke Tahap 6.
- `README.md`: status, struktur, dan panduan pemeriksaan.

Tidak ada dependency baru, aset pribadi yang diubah/dihapus, atau deployment.

## Hasil pemeriksaan

- Build awal berhasil setelah integrasi animasi.
- `npm run check:stage2`: berhasil; menu/fokus, indikator navigasi, anchor, dan
  fallback foto hero tetap bekerja dalam pengujian.
- `npm run check:stage4`: berhasil; isi CV, kondisi kosong, modal, lightbox,
  tautan kontak, dan fallback aset tetap bekerja dalam pengujian.
- `npm run check:stage5`: berhasil; regresi kontrol/state audio dan penanganan
  error tidak berubah. Pemutaran MP3 asli tetap belum terverifikasi.
- `npm run check:stage6`: berhasil untuk render statis yang terlihat, reveal
  viewport/fokus, fallback observer, perubahan preferensi, intro yang selesai,
  scroll tools, fokus anchor, penutupan modal, callback/cleanup, serta pintasan
  dan reset lightbox.

Tes memakai jsdom dan simulasi observer/dialog. Tes tersebut tidak mengukur
kualitas frame animasi, tampilan layar nyata, native focus trap/inert, atau
horizontal overflow. Percobaan akses browser Tahap 6 kembali menghasilkan
“The browser access host is unavailable”. Verifikasi visual dan console browser
masih belum dapat dinyatakan lolos.

- `npm run build`: build production akhir berhasil. Semua referensi aset HTML
  tersedia, dan fixture UX tidak masuk bundle production. Data musik/proyek/
  galeri yang belum diberikan tetap kosong.
- HTTP `200`: halaman utama, App, Reveal, PageIntro, ScrollTools, Navbar,
  Modal, Lightbox, hook preferensi/fokus, helper motion, dan stylesheet interaksi.
  Server development yang sudah aktif dipakai kembali tanpa dihentikan.

## Tinjauan manual berikutnya

Buka `http://127.0.0.1:5173/` pada desktop, tablet, dan smartphone. Periksa
pembuka/hero, reveal saat scroll, menu buka/tutup dan Escape, tombol kembali
ke atas, serta navigasi Tab. Setelah foto/proyek asli tersedia, periksa
modal/lightbox dan pintasan zoom. Ulangi dengan preferensi pengurangan gerakan
sistem aktif, termasuk mengubah preferensi saat dialog terbuka.

Tahap 6 berhenti di sini. Tahap 7 (Testing & Quality Control) menunggu persetujuan.

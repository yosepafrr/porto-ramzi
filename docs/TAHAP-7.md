# Laporan Tahap 7 — Testing & Quality Control

Tanggal: 7 November 2026.

Pemeriksaan selesai untuk kode dan konten yang tersedia. Hasil otomatis,
build production, dan uji Chrome berhasil setelah perbaikan di bawah. Hasil ini
tidak menyatakan seluruh media pribadi atau seluruh kriteria aksesibilitas
sudah terverifikasi; batas pemeriksaannya dicatat secara terpisah.

## Temuan dan perbaikan

| Temuan | Perubahan |
| --- | --- |
| Label ARIA pada daftar bidang hero memakai div tanpa semantik yang sesuai | Menggunakan `ul`/`li` dengan label daftar, sambil mempertahankan tampilan |
| Audit Chrome menemukan tombol mengambang di luar landmark saat terlihat | ScrollTools dipindahkan ke dalam `main`; ditambahkan regresi untuk keadaan tombol terlihat |
| Label brand mengabaikan sebagian teks brand yang terlihat | Nama aksesibel kini mengikuti konten link; petunjuk kembali ke beranda tetap tersedia melalui title |
| Tes lama mengunci jumlah item CV, nama/initial, media kosong, serta playlist harus kosong | Asersi mengikuti konfigurasi; uji interaksi memakai fixture yang tidak bergantung pada item CV pertama |

Pada awal inspeksi, layar mobile tampak terpotong. Pengukuran DOM menunjukkan
tidak ada overflow layout; emulasi memiliki visual scale sekitar 1,27.
Setelah mode emulasi dinormalkan ke scale 1, tampilan mobile utuh dan tombol
menu dapat digunakan. Tidak dibuat perubahan CSS untuk menutupi zoom emulasi.

## Hasil otomatis

| Pemeriksaan | Hasil |
| --- | --- |
| `npm run check` | Seluruh suite berhasil |
| `check:content` | Struktur array/ID, tanggal, email/URL, metadata, path dan kapitalisasi aset valid |
| Regresi Tahap 2 | Navbar, fokus, Escape, active state, dan fallback hero berhasil |
| Regresi Tahap 4 | Section/CV, kondisi kosong, modal/lightbox, dokumentasi, gambar error, dan kontak berhasil |
| Regresi Tahap 5 | Simulasi HTML5 Audio: kontrol, seek, volume, playlist, error/promise, reorder, dan penghapusan berhasil |
| Regresi Tahap 6 | Reveal, observer, preferensi, intro, scroll tools, anchor focus, close/cleanup, dan zoom berhasil |
| `check:stage7` | Integrasi menu + fokus anchor berhasil; axe DOM: 39 aturan lolos, 0 pelanggaran terdeteksi dalam cakupan yang dijalankan |
| `npm run build` | Production build berhasil |
| `npm run check:build` | Metadata/escaping, HTML, favicon/CSS/JS, reduced-motion CSS, dan isolasi fixture/alat QA valid |
| `npm ls --depth=0` | Tidak ada dependency invalid/missing |
| Instalasi alat audit | npm melaporkan 0 vulnerabilities |

`npm run check` menjalankan pemeriksaan berurutan agar hasil mudah ditinjau.
Validator aset membaca kapitalisasi setiap segmen path secara eksplisit; nama
yang diterima Windows namun salah pada Linux akan menghasilkan error. String
aset yang masih kosong tetap diperbolehkan.

Audit DOM menggunakan axe-core 4.14.0 dengan tag WCAG 2 A/AA, WCAG 2.1 A/AA,
dan best practices. Aturan color-contrast, label-content-name-mismatch,
landmark-one-main, dan page-has-heading-one tidak dijalankan di axe/jsdom karena
memerlukan canvas/hit testing/layout browser. Struktur main/H1 diperiksa
terpisah, kemudian audit rendering lengkap dijalankan langsung di Chrome.

## Pemeriksaan Chrome nyata

Build production disajikan sementara di `http://127.0.0.1:4173/`. Browser access
host tetap tidak tersedia, tetapi kontrol aplikasi Chrome native berhasil
digunakan setelah koordinasi waktu dengan pengguna.

### Responsive dan overflow

Pengukuran dilakukan pada Chrome Device Toolbar, visual scale 1, DPR 2, dan
tinggi viewport 500px. Ini emulasi lebar layar, bukan pengujian perangkat
Safari/iPhone/Android fisik.

| Lebar viewport | Lebar dokumen | Visual viewport | Elemen utama melewati batas horizontal |
| ---: | ---: | ---: | --- |
| 320px | 320px | 320px | Tidak ada |
| 390px | 390px | 390px | Tidak ada |
| 768px | 768px | 768px | Tidak ada |
| 1440px | 1440px | 1440px | Tidak ada |

Pemeriksaan mencakup header/main/section, container hero, tombol/menu,
kartu pendidikan/skills/software/sertifikat, pengalaman, kontak, dan footer.
Tampilan hero dan menu mobile ditinjau langsung; tampilan desktop juga
ditinjau setelah DevTools ditutup. Teks panjang tidak menambah lebar dokumen
pada ukuran yang diuji.

Menu mobile dapat dibuka. Escape menutup menu, mengembalikan `aria-expanded`
ke false, serta mengembalikan fokus ke tombol “Buka menu navigasi”. Pemeriksaan
scroll melewati seluruh section menghasilkan **0 reveal yang tertinggal pending**.

### Aksesibilitas browser

Engine axe-core yang sama dimuat sementara dari server lokal ke tab pengujian,
tanpa mengubah source/bundle production atau mengirim isi halaman ke layanan
eksternal. Audit mencakup semua aturan dalam tag yang sama, termasuk aturan
yang tidak dapat dinilai pada jsdom.

Setelah perbaikan landmark:

- **46 aturan lolos** pada hasil audit Chrome.
- **0 pelanggaran terdeteksi**.
- **1 jenis pemeriksaan incomplete: color-contrast, pada 7 elemen** karena
  warna latarnya mengandung gradient sehingga axe tidak dapat menentukannya.

Tujuh elemen tersebut adalah dua label topline profil, monogram, caption foto
profil, dan tiga label placeholder gambar sertifikat. Kontras elemen ini
tetap membutuhkan penilaian manual. Tidak diubah menjadi “lolos” hanya untuk
menghilangkan hasil incomplete. Ini bukan sertifikasi WCAG.

### Console dan pemuatan berkas

Console production mula-mula menampilkan 0 pesan. Selama pemeriksaan yang
dilakukan tidak terlihat error runtime aplikasi; keluaran berikutnya merupakan
hasil kueri geometri dan audit QA lokal. Tidak dilakukan pengiriman email,
panggilan telepon, atau pembukaan profil sosial yang belum tersedia.

HTTP production terakhir:

| Resource | Status | Content-Type |
| --- | --- | --- |
| `/` | 200 | HTML |
| `/favicon.svg` | 200 | `image/svg+xml` |
| `/assets/index-D7IgA3KY.js` | 200 | `text/javascript` |
| `/assets/index-DkwWzkQQ.css` | 200 | `text/css` |

Nama hash di atas adalah hasil build sesi ini dan dapat berubah pada build
berikutnya. JavaScript: 415.389 byte, gzip sekitar 131,78 kB; CSS: 46.773 byte,
gzip sekitar 10,81 kB. Angka ini adalah ukuran build, bukan skor Lighthouse
atau pengukuran performa jaringan/perangkat.

## Aset dan fitur yang belum bisa diverifikasi penuh

Konfigurasi saat ini memiliki **17 field path media kosong**: foto hero/About,
12 logo software, dan 3 gambar sertifikat. Tidak ada path media nonkosong yang
rusak pada konfigurasi; favicon dan aset build tersedia.

| Bagian | Status/catatan |
| --- | --- |
| Foto profil/About, galeri, dokumentasi | Placeholder/kondisi kosong diperiksa; foto asli belum ada |
| Logo software | Slot nama/logo diperiksa; keaslian, proporsi, dan kualitas logo belum bisa dinilai |
| Sertifikat | Nama/tanggal tampil; pembacaan tulisan dan pembesaran gambar asli belum bisa dinilai |
| Proyek dan organisasi | Kondisi kosong benar; interaksi dengan data diuji memakai fixture di memori |
| Music Player | Kondisi kosong/silent diperiksa; seluruh kontrol diuji dengan simulasi media, bukan decoding/suara MP3 asli |
| Native modal/lightbox dengan aset asli | Uji state/fokus/close berhasil di jsdom; flow lengkap media asli/native focus trap masih perlu diuji setelah data tersedia |
| Kontak | URL mailto/tel benar; pengiriman/panggilan tidak dilakukan |
| Browser lain/perangkat fisik | Belum diuji; emulasi Chrome tidak membuktikan kompatibilitas Safari/Firefox/semua smartphone |

Setelah media asli dimasukkan, jalankan ulang pemeriksaan serta uji browser
untuk gambar, tulisan sertifikat, cover/MP3, seek/volume, native dialog, dan
perangkat sasaran. Tidak ada foto, proyek, sertifikat, atau lagu fiktif yang
ditambahkan ke portfolio untuk memenuhi tes.

## File yang dibuat/diperbarui

Baru:

- `scripts/asset-path.mjs`: validasi path lokal/case-sensitive.
- `scripts/check-content.mjs`: validasi konfigurasi dan aset.
- `scripts/check-build.mjs`: pemeriksaan output production dan metadata.
- `scripts/check-all.mjs`: runner suite berurutan.
- `scripts/check-stage7.mjs`: audit DOM/ARIA dan integrasi navigasi.
- `docs/TAHAP-7.md`: laporan ini.

Diperbarui:

- `src/App.jsx`: posisi ScrollTools dalam landmark main.
- `src/components/Hero.jsx`, `src/index.css`: semantik daftar bidang.
- `src/components/Navbar.jsx`: nama aksesibel brand.
- `scripts/check-stage2.mjs`, `check-stage4.mjs`, `check-stage5.mjs`: tes tidak
  memaksakan konten/default kosong atau jumlah item tertentu.
- `package.json`, `package-lock.json`: axe-core sebagai dependency development
  dan perintah pemeriksaan baru.
- `README.md`: status, struktur, panduan QC, dan catatan verifikasi.

Tidak ada aset pribadi yang diubah/dihapus, deployment, atau repository baru.
Server preview 4173 milik pengujian sudah dihentikan. Server development yang
sebelumnya aktif tetap berjalan; Chrome kembali ke `http://127.0.0.1:5173/`,
DevTools ditutup, preset emulasi dikembalikan ke iPhone 16/Fit to window, dan
zoom browser dikembalikan ke 90% seperti keadaan awal.

## Menjalankan ulang

```powershell
npm run check
npm run build
npm run check:build
npm run preview
```

Tinjauan manual tujuh elemen gradient dan media/perangkat asli tetap terpisah
dari hasil otomatis. Tahap 8 menunggu persetujuan pengguna.

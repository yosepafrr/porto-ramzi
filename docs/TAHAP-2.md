# Laporan Tahap 2 — Main Design

Tanggal: 7 November 2026.

## Acuan dan arah visual

Acuan utama: [portfolio Eka Wahyu](https://ekawahyu-portofolio.vercel.app).
HTML dan aset CSS/JavaScript publik dapat dibaca melalui HTTP. Analisis
berdasarkan sumber tersebut menunjukkan latar sangat gelap, hero dengan
typography besar, animasi/parallax berlapis, dan navigasi ringkas dengan
indikator aktif. Pemeriksaan visual referensi melalui browser belum tersedia.
Tidak ada kode, foto, atau aset referensi yang dimasukkan ke project.

Interpretasi untuk Ramzi memakai komposisi dua kolom dengan nama besar di kiri
dan bingkai foto/monogram di kanan. Bentuk lengkung, garis orbit, grid halus,
dan serif italic pada monogram memberikan identitas personal. Animasi dibatasi
pada fade dan transisi hover. Tidak ada klaim pekerjaan, statistik, proyek,
status ketersediaan kerja, atau pengalaman baru yang dibuat-buat.

| Elemen | Keputusan |
| --- | --- |
| Latar | Arang `#101312` |
| Teks utama | Off-white `#F1F0E9` |
| Aksen | Hijau limau `#C2ED82` |
| Teks sekunder | `#9A9D95` |
| Typography utama | Segoe UI / system sans-serif, tanpa unduhan font eksternal |
| Typography aksen | Georgia / serif italic |
| Desktop | Hero dua kolom, navbar horizontal |
| Tablet | Spasi dan ukuran tulisan menyesuaikan lebar |
| Mobile `<768px` | Hero satu kolom dan menu hamburger |

Pengantar “Antara logika & imajinasi” merupakan kelanjutan komposisi hero,
menampilkan tiga bidang yang telah diberikan dalam brief. Tombol Explore
menuju pengantar ini selama section portfolio lengkap belum dibuat.

## Hasil implementasi

- Navbar sticky, identitas RS, navigasi aktif, dan tombol email.
- Menu mobile dapat dibuka/ditutup; menutup saat Escape, klik di luar,
  fokus keluar header, memilih tautan, atau pindah ke breakpoint desktop.
- Fokus masuk ke tautan pertama saat menu dibuka dan kembali ke tombol saat
  Escape. Menu bukan modal dan tidak mengunci pengguna dalam siklus Tab.
- Hero menampilkan nama, bidang, ringkasan berdasarkan CV, CTA Explore,
  serta Contact Me melalui alamat email asli.
- ProfileVisual menampilkan foto asli jika diisi. Selama belum ada foto,
  monogram RS dan label placeholder tampil tanpa permintaan gambar kosong.
- Path foto yang gagal dimuat ditangani dengan kembali ke monogram.
- Smooth scrolling, scroll offset untuk header, skip link, fokus terlihat,
  tombol kembali ke atas, dan dukungan prefers-reduced-motion.
- Konten pribadi berada di `portfolioData.js`. Daftar pengalaman, pendidikan,
  proyek, sertifikat, galeri, dan lagu tetap disiapkan untuk tahap berikutnya.
- Favicon dan warna theme browser diselaraskan dengan palet baru.

## File yang dibuat atau diperbarui

| File | Perubahan |
| --- | --- |
| `src/components/Navbar.jsx` | Navbar, menu mobile, dan indikator scroll |
| `src/components/Hero.jsx` | Komposisi hero dan CTA |
| `src/components/ProfileVisual.jsx` | Bingkai foto, monogram, dan penanganan error |
| `src/components/Introduction.jsx` | Pengantar bidang dan baseline halaman |
| `src/App.jsx` | Integrasi komponen dan skip link |
| `src/index.css` | Token warna, typography, komposisi, breakpoint, reduced motion |
| `src/data/portfolioData.js` | Konfigurasi hero, navigasi, dan pengantar |
| `index.html`, `public/favicon.svg` | Penyelarasan warna |
| `package.json`, `package-lock.json` | jsdom sebagai dependency development; script pemeriksaan |
| `scripts/check-stage2.mjs` | Uji DOM terarah |
| `README.md`, `docs/TAHAP-2.md` | Panduan dan laporan |

Tidak ada aset pribadi yang diubah, dipindahkan, atau dihapus. Komponen
SetupStatus Tahap 1 tetap tersimpan, tetapi tidak dirender pada halaman utama.

## Hasil pengujian

| Pemeriksaan | Hasil |
| --- | --- |
| `npm run build` | Berhasil |
| `npm ls --depth=0` | Berhasil, tidak ada dependency invalid/missing |
| Instalasi dependency development | npm melaporkan 0 vulnerabilities |
| `npm run check:stage2` | Seluruh pemeriksaan berhasil |
| Menu mobile: buka, fokus, Escape | Berhasil dalam DOM |
| Menu: navigasi, klik luar, fokus keluar, breakpoint desktop | Berhasil dalam DOM |
| Active navigation saat scroll | Berhasil dalam DOM dengan posisi section disimulasikan |
| Foto kosong, error gambar, dan path pengganti | Berhasil dalam DOM |
| Satu H1, tidak ada ID duplikat, semua target anchor tersedia | Berhasil |
| Tautan email memakai kontak asli | Berhasil |
| HTTP server development | 200 untuk `/`, App, Navbar, Hero, ProfileVisual, Introduction, data, CSS, dan favicon |
| Tampilan desktop/tablet/mobile, overflow, console browser nyata | Belum terverifikasi |

Port 5173 sudah dipakai server lokal yang aktif. Server tersebut berhasil
menyajikan kode terbaru, sehingga tidak dihentikan atau diganti. Buka
`http://127.0.0.1:5173/`; jika server kelak berhenti, jalankan `npm run dev`.

Browser access host masih tidak tersedia pada percobaan Tahap 2. Karena itu,
hasil uji DOM tidak dinyatakan sebagai kelulusan visual atau browser. Pengujian
manual berikut tetap diperlukan: ukuran 320/390px, tablet 768px, desktop
1440px; scroll dan active state; menu keyboard; klik CTA; serta memastikan
tidak ada horizontal overflow atau error console.

## Batas tahap

Tahap 2 berhenti pada desain utama. Tahap 3 (pengisian konten CV lengkap)
menunggu persetujuan. Tidak dilakukan publikasi, pembuatan repository GitHub,
atau deployment Vercel.

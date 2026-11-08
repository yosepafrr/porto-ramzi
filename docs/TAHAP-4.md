# Laporan Tahap 4 — Portfolio Sections

Tanggal: 7 November 2026.

## Hasil implementasi

Desain arang, off-white, dan hijau limau Tahap 2 dipertahankan. Seluruh section
membaca data dari `src/data/portfolioData.js`, dengan heading dan label UI yang
juga dapat diedit di file tersebut. Tidak ada perubahan pada informasi CV.

| Section | Tampilan dan perilaku |
| --- | --- |
| About Me | Ringkasan lengkap, ruang foto asli, identitas, lokasi, dan highlight IPK dari pendidikan |
| Education | Dua kartu pendidikan, periode, jurusan, IPK jika tersedia, dan kompetensi pembelajaran |
| Work Experience | Timeline terbaru dahulu; tiga pekerjaan dengan detail tanggung jawab yang dapat dibuka |
| Social Experience | KKN divisi PDD, tanggung jawab lengkap, dan slot dokumentasi tanpa tanggal/lokasi fiktif |
| Organization Experience | Section terpisah dengan kondisi kosong; otomatis memakai data saat array diisi |
| Skills & Technologies | Enam hard skills dan delapan core skills, tanpa persentase |
| Personal Skills | Delapan kemampuan, deskripsi asli, ikon Lucide, dan efek hover ringan |
| Software Skills | Empat kategori dan 12 nama aplikasi; slot logo kosong yang jelas, tanpa ikon palsu/deskripsi/rating |
| My Works | Kondisi kosong saat ini; kartu, thumbnail, tahun, teknologi, serta modal detail saat proyek asli ditambahkan |
| Certificates & Achievements | Tiga sertifikat beserta tanggal; gambar kosong diberi placeholder; gambar asli dapat dibuka/diperbesar setelah tersedia |
| Personal Gallery | Kondisi kosong saat ini; masonry, caption, lightbox, navigasi, dan zoom setelah foto asli tersedia |
| Contact | Email, telepon, lokasi, dan CTA email; tautan sosial hanya ditampilkan jika URL asli diisi |
| Footer | Nama, tagline, tahun otomatis, navigasi, sosial jika tersedia, dan tombol kembali ke atas |

Hero tetap menjadi pembuka halaman. Pengantar lama `Introduction` tidak lagi
dirender; About Me mengambil anchor `#explore` agar tautan Explore lama tetap
valid dan tidak ada footer di tengah halaman. Komponen lama tetap tersimpan.

Navbar kini memiliki Beranda, Tentang, Pengalaman, Skills, Karya, dan Kontak.
Menu hamburger juga digunakan pada tablet di bawah 1024px agar enam tautan tidak
memaksa header melebar. CSS section menyediakan komposisi desktop, tablet,
mobile, dan penyesuaian tambahan di bawah 400px.

## Gambar dan dialog

- Aset kosong tidak membuat elemen `img` dengan sumber kosong.
- Gambar yang gagal dimuat beralih ke placeholder; pergantian path dapat
  menampilkan gambar baru. Tidak ada foto atau sertifikat buatan.
- Foto dan sertifikat memakai `object-fit: contain`. Foto galeri menggunakan
  rasio aslinya, dengan lazy loading dan decoding async.
- Slot software hanya bertuliskan “Logo” sampai logo resmi ditambahkan.
  Ikon personal skills tidak digunakan untuk menyamar sebagai logo software.
- Tanggung jawab menggunakan elemen `details` dan `summary` agar dapat diakses
  dengan keyboard tanpa menambah JavaScript yang tidak diperlukan.
- Modal memakai elemen native `dialog`, judul yang terhubung, tombol tutup,
  penanganan cancel/Escape, pengembalian fokus, dan penguncian scroll halaman.
- Lightbox mendukung tombol sebelumnya/berikutnya, panah keyboard,
  pembesaran, serta scroll gambar yang diperbesar. Pergantian gambar mereset zoom.
- Lightbox juga tersedia pada dokumentasi pengalaman yang telah memiliki foto.
- Link GitHub/demo dan sosial hanya aktif untuk URL HTTP/HTTPS yang valid;
  tab baru memakai `noopener noreferrer`.

Fitur dasar dialog/lightbox diimplementasikan sekarang agar section fungsional.
Penyempurnaan animasi dan UX tetap mengikuti Tahap 6. Tidak ada audio player
atau autoplay pada Tahap 4.

## Mengisi data yang belum tersedia

1. Letakkan file asli di folder aset yang sesuai.
2. Isi path pada `portfolioData.js` tanpa awalan `public`.
3. Tambahkan record asli pada `projects`, `gallery`, atau
   `organizationExperience` saat datanya tersedia.
4. Untuk sertifikat, isi `certificates[].image`; untuk logo isi
   `softwareSkills[].logo`; untuk dokumentasi isi `images: [{ src, alt, caption }]`.
5. Buka halaman lokal dan periksa aset. Refresh halaman setelah mengganti file
   dengan nama/path yang sama, khususnya jika sebelumnya gagal dimuat.

Skema field lengkap ada pada laporan Tahap 3. Menambah data yang sesuai skema
tidak memerlukan perubahan komponen. Ikon personal skills memakai pemetaan
terbatas untuk menjaga bundle; jika nama ikon baru belum dipetakan, komponen
memakai fallback ikon kemampuan dan pemetaan dapat ditambah di PersonalSkills.

## File yang dibuat atau diperbarui

Komponen baru:

- `About.jsx`, `Education.jsx`.
- `WorkExperience.jsx`, `SocialExperience.jsx`, `OrganizationExperience.jsx`,
  dan `ExperienceList.jsx` bersama.
- `Skills.jsx`, `PersonalSkills.jsx`, `SoftwareSkills.jsx`.
- `Projects.jsx`, `Certificates.jsx`, `Gallery.jsx`.
- `Contact.jsx`, `Footer.jsx`, `SocialLinks.jsx`.
- `Section.jsx`, `AssetImage.jsx`, `Modal.jsx`, `Lightbox.jsx`.

File lain:

- `src/App.jsx`: integrasi section.
- `src/components/Navbar.jsx`: breakpoint menu tablet.
- `src/data/portfolioData.js`: heading section, label UI, navigasi, dan footer.
- `src/portfolio.css`: styling dan breakpoint section baru.
- `src/index.css`: mengimpor stylesheet section.
- `src/utils/content.js`: URL opsional, urutan tanggal, dan tautan sosial.
- `scripts/check-stage4.mjs`, `package.json`: pemeriksaan integrasi Tahap 4.
- `README.md`, `docs/TAHAP-4.md`: panduan dan laporan.

Tidak ada dependency baru atau aset pribadi yang diubah/dihapus. Tidak ada
repository atau deployment yang dibuat.

## Pengujian dan batas verifikasi

- `npm run build`: berhasil.
- `npm run check:stage2`: seluruh pemeriksaan berhasil, termasuk navbar,
  indikator scroll, menu/fokus, dan fallback foto hero.
- `npm run check:stage4`: seluruh pemeriksaan berhasil.
- Uji render memastikan satu H1, ID unik, semua anchor tersedia, serta seluruh
  pendidikan, tanggung jawab, skills, sertifikat, kontak, dan tahun footer benar.
- Uji kondisi kosong mencakup delapan komponen daftar. Portfolio aktual tetap
  tanpa proyek/organisasi/foto fiktif, tanpa sumber gambar/audio kosong.
- Uji interaksi memakai fixture dalam memori: buka/tutup/cancel modal proyek,
  scroll lock dan return focus, link valid, lightbox galeri/certifikat/dokumentasi,
  next/previous, keyboard, zoom, serta fallback foto/logo yang gagal.
- HTTP `200`: halaman utama, App, seluruh komponen section utama, Modal,
  Lightbox, dan stylesheet section pada server development aktif.

Native dialog di jsdom menggunakan polyfill uji yang terbatas. Uji ini tidak
menyatakan focus trap/top layer, Escape browser native, atau layout visual
telah terverifikasi. Percobaan akses browser pada Tahap 4 kembali melaporkan
“The browser access host is unavailable”. Pemeriksaan tampilan nyata,
horizontal overflow, dan console browser masih perlu dilakukan saat akses
browser tersedia.

Untuk tinjauan manual, buka `http://127.0.0.1:5173/` pada 320/390px, tablet
768px, serta desktop 1440px. Periksa navigasi/scroll, tampilan teks panjang,
semua detail tanggung jawab, dan dialog setelah aset asli ditambahkan. Server
yang sudah aktif dipakai kembali tanpa dihentikan.

Tahap 4 berhenti di sini. Tahap 5 (music player) menunggu persetujuan.

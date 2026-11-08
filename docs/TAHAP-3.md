# Laporan Tahap 3 — Content Management

Tanggal: 7 November 2026.

## Hasil pekerjaan

Seluruh informasi yang diberikan dalam brief telah ditempatkan di
`src/data/portfolioData.js`. Desain dan komponen halaman Tahap 2 dipertahankan.
Konten CV baru akan ditampilkan melalui section yang dibuat pada Tahap 4.

| Kategori | Isi |
| --- | --- |
| Profil | Nama, bidang, ringkasan singkat hero, dan ringkasan profesional lengkap About Me |
| Pendidikan | Universitas Siliwangi, Informatika S1, 2022–2026, IPK 3,56/4,00; SMAN 1 Kawali, MIPA, 2019–2021 |
| Kompetensi pendidikan | 5 kompetensi pembelajaran Universitas Siliwangi |
| Pengalaman kerja | 3 pengalaman, terbaru dahulu, masing-masing dengan 5 tanggung jawab |
| Pengalaman sosial | KKN divisi PDD dengan 6 tanggung jawab |
| Pengalaman organisasi | Array kosong, skema sudah disiapkan |
| Hard skills | 6 kemampuan |
| Core skills | 8 kemampuan |
| Personal skills | 8 kemampuan dengan deskripsi asli dan nama ikon Lucide |
| Software skills | 12 aplikasi dalam 4 kategori, tanpa deskripsi/rating/persentase |
| Sertifikat | Google Cloud Skill Boost — November 2024; C++ dan C — Agustus 2023 |
| Kontak | Email, telepon, dan lokasi dari CV |
| Metadata | Judul tab dan deskripsi SEO dikelola melalui `seo` |

Nama dan tanggal sertifikat mengikuti brief; penerbit belum diberikan sehingga
`issuer` tetap kosong. Semua path foto, sertifikat, logo, dan dokumentasi masih
kosong. Tanggal, lokasi, serta desa KKN tidak diisi. Proyek, organisasi, galeri,
lagu, dan tautan media sosial tetap kosong hingga ada data asli.

Nama pekerjaan laboratorium dipertahankan sebagai “Laboratorium Informatika”;
tidak ditambahkan jabatan resmi seperti “Asisten” yang belum diberikan.
Ringkasan singkat pekerjaan merangkum tanggung jawab yang diberikan, tanpa
menambahkan hasil kuantitatif atau klaim pencapaian.

## Panduan mengedit konfigurasi

Edit `src/data/portfolioData.js`, simpan, lalu tinjau halaman lokal. Gunakan
string kosong `''` untuk teks/path opsional dan `[]` untuk daftar tanpa data.
Setiap item objek memakai `id` unik yang stabil. Nama aplikasi dan nama orang
bukan URL; isi tautan hanya jika alamat aslinya sudah tersedia.

### Profil dan pendidikan

- Hero: ubah `hero.name`, `hero.role`, `hero.description`, dan `hero.image`.
  Navbar dan monogram mengambil nama dari `hero.name`.
- About Me: ubah `about.description`, `about.image`, dan `about.imageAlt`.
- Metadata: ubah `seo.title` dan `seo.description`; Vite memasukkannya ke HTML
  development dan production. Karakter HTML di-escape saat proses tersebut.
- Pendidikan: tambah/edit objek di `education`, terbaru terlebih dahulu.
  `startYear`/`endYear` memakai angka tahun; `period` adalah teks tampilan.
  `gpa` memakai teks agar format `3,56/4,00` terjaga; kosongkan jika tidak ada.
  `competencies` adalah array nama kompetensi.

### Pengalaman kerja, KKN, dan organisasi

Gunakan `workExperience`, `socialExperience`, dan `organizationExperience`
secara terpisah. Field setiap pengalaman:

| Field | Penggunaan |
| --- | --- |
| `id` | Identitas unik item |
| `role` | Jabatan/nama pekerjaan yang sebenarnya |
| `organization` | Instansi, organisasi, atau kegiatan |
| `startDate`, `endDate` | Bulan/tahun `YYYY-MM`, atau `''` jika belum diketahui |
| `period` | Teks tampilan, misalnya format bulan dan tahun; sesuaikan saat tanggal diubah |
| `description` | Ringkasan pekerjaan |
| `responsibilities` | Array kalimat tanggung jawab |
| `images` | Array dokumentasi `{ src, alt, caption }` setelah file asli tersedia |
| `location`, `village` | Lokasi/desa untuk KKN jika sudah diketahui |

Urutkan pengalaman bertanggal dari terbaru ke terlama. Jangan mengganti tanggal
yang belum diketahui dengan tanggal hari ini, angka nol, atau “sekarang”.
Untuk organisasi, salin struktur pengalaman yang sesuai, isi dengan informasi
asli, dan tambahkan ke array yang masih kosong.

Foto dokumentasi diletakkan di `public/assets/images/experience/`. Isi `src`
dengan path `/assets/images/experience/` diikuti nama file sebenarnya. Satu foto
dapat juga dicantumkan di `gallery` dengan caption/kategori yang sesuai setelah
section galeri tersedia.

### Skills dan logo software

- `hardSkills`: objek `{ id, name, category }`.
- `coreSkills`: array nama kemampuan.
- `personalSkills`: objek `{ id, name, description, icon }`; `icon` adalah nama
  ekspor Lucide seperti yang sudah dipakai dalam data, bukan emoji atau URL.
- `softwareSkills`: objek `{ id, name, category, logo }`.
  Letakkan logo resmi aplikasi di `public/assets/images/software/`, kemudian
  isi `logo` dengan path file sebenarnya. Biarkan kosong jika belum tersedia.
  Ikon Lucide untuk personal skills tidak dipakai sebagai pengganti logo software.
- Tidak ada field persentase, rating, atau progress bar.

### Sertifikat, proyek, galeri, dan musik

- Sertifikat: `certificates` memakai `{ id, name, issuer, date, dateLabel, image }`.
  `date` memakai `YYYY-MM` dan `dateLabel` memakai teks bulan/tahun. Sesuaikan
  keduanya saat mengedit. Isi `issuer` hanya jika diketahui. Letakkan gambar
  asli di `public/assets/images/certificates/` sebelum mengisi `image`.
- Proyek: isi `projects` dengan `{ id, title, image, description, technologies,
  year, github, demo }`. `technologies` adalah array; tautan yang tidak tersedia
  memakai `''`. Thumbnail berada di `public/assets/images/projects/`.
- Galeri: isi `gallery` dengan `{ id, src, alt, caption, category }`. Gunakan foto
  asli dari folder `public/assets/images/gallery/`.
- Musik: isi `music` dengan `{ id, title, artist, src, cover }`. MP3 berada di
  `public/assets/music/` dan cover berada di `public/assets/covers/`.
- Folder `public` tidak ditulis di URL aset. File yang belum ada tidak diberi
  path contoh pada konfigurasi aktif agar tidak menimbulkan broken image/audio.

Penambahan data tidak otomatis membuat section baru pada Tahap 3. Komponen
portfolio disambungkan pada Tahap 4; player audio dikerjakan pada Tahap 5.

### Kontak dan navigasi

Ubah `contact.email`, `phone`, `location`, `instagram`, `linkedin`, dan `github`.
`otherSocials` dapat diisi objek `{ id, label, url }` untuk tautan tambahan.
Jangan menambahkan tautan `#` atau profil orang lain sebagai placeholder.

`navigation` tetap hanya menuju bagian halaman yang tersedia. Tautan About,
pengalaman, proyek, dan section lain ditambahkan ketika section tersebut dibuat
pada Tahap 4. Teks pengantar hero tersedia di `introduction`.

## File yang diubah/dibuat

- `src/data/portfolioData.js`: profil/CV, skills, sertifikat, kontak, dan metadata.
- `vite.config.js`: membaca metadata terpusat dan meng-escape nilai HTML.
- `index.html`: placeholder metadata yang diisi oleh Vite.
- `README.md`: status dan panduan konfigurasi.
- `docs/TAHAP-3.md`: laporan dan panduan field konten.

Tidak diperlukan dependency baru. Tidak ada perubahan pada komponen, styling,
atau aset pribadi. Tidak dilakukan deployment.

## Pemeriksaan

Pemeriksaan awal data berhasil: ringkasan profesional, pendidikan, nama skills,
seluruh tanggung jawab kerja/KKN, deskripsi personal skills, tanggal sertifikat,
dan kontak sesuai teks brief. ID unik; tanggal bulanan valid; urutan pengalaman
dan sertifikat benar; seluruh ikon personal skills tersedia di Lucide yang
terpasang. Data dan aset yang belum diberikan tetap kosong.

Hasil verifikasi akhir:

- `npm run build`: berhasil.
- `npm run check:stage2`: seluruh pemeriksaan DOM berhasil; navigasi, menu,
  fokus, indikator scroll, dan fallback foto tetap bekerja pada pengujian.
- Metadata hasil build sesuai `seo.title` dan `seo.description`; tidak ada
  placeholder yang tersisa. Semua referensi aset HTML build tersedia.
- Karakter `&`, tanda kutip, dan tanda kurung sudut pada metadata berhasil
  di-escape tanpa berubah menjadi elemen HTML atau mengubah teks aslinya.
- HTTP server development: `200` untuk halaman utama dan file konfigurasi
  data. Metadata development juga telah terisi dari konfigurasi.
- Pemeriksaan visual browser tidak dilakukan pada tahap data ini. Batas
  verifikasi visual dari Tahap 2 masih berlaku; tampilan section CV belum
  diklaim terverifikasi karena komponennya baru dibuat pada Tahap 4.

Tahap 4 menunggu persetujuan pemilik project.

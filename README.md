# Portfolio Ramzi Saputra

Project personal portfolio menggunakan React, Vite, JavaScript (JSX), Tailwind CSS,
Framer Motion, dan Lucide React.

**Status: Tahap 7 — Testing & Quality Control.** Pemeriksaan otomatis,
build production, metadata/aset build, serta uji Chrome sudah dijalankan.
Viewport 320, 390, 768, dan 1440px tidak menunjukkan horizontal overflow.
Audit Chrome melaporkan 46 aturan lolos dan 0 pelanggaran terdeteksi; kontras
pada tujuh elemen berlatar gradient masih memerlukan tinjauan manual.
Media asli belum tersedia, sehingga pemutaran MP3 dan tampilan foto/sertifikat
asli belum dapat dinyatakan terverifikasi.
Lihat [laporan lengkap dan catatan Tahap 7](docs/TAHAP-7.md),
[laporan Tahap 6](docs/TAHAP-6.md),
[laporan/panduan audio Tahap 5](docs/TAHAP-5.md),
[laporan Tahap 4](docs/TAHAP-4.md),
[panduan konten Tahap 3](docs/TAHAP-3.md), dan
[laporan desain Tahap 2](docs/TAHAP-2.md).
Tahap 8 (Deployment) menunggu persetujuan pemilik project. Belum ada publikasi.

## Menjalankan project

Gunakan Node.js 24 LTS dan npm. Versi Node yang dipakai dicatat di `.nvmrc`.

```powershell
cd C:\porto-ramzi
npm install
npm run dev
```

Buka URL `Local` yang dicetak Vite di terminal, biasanya
`http://127.0.0.1:5173`. Jika port terpakai, Vite memilih port berikutnya.

```powershell
npm run build
npm run preview
```

`npm run build` menghasilkan folder `dist/`. `npm run preview` memeriksa hasil
build lokal, biasanya di `http://127.0.0.1:4173`. Hentikan server dengan `Ctrl+C`.
Setelah `package-lock.json` tersedia, gunakan `npm ci` untuk instalasi yang
mengikuti versi dependency terkunci, termasuk pada CI/deployment.

## Struktur awal

```text
public/
  favicon.svg
  assets/
    images/
      profile/
      gallery/
      projects/
      certificates/
      software/
      experience/
    music/
    covers/
src/
  assets/
  components/
    Navbar.jsx
    Hero.jsx
    ProfileVisual.jsx
    About.jsx
    Education.jsx
    WorkExperience.jsx
    SocialExperience.jsx
    OrganizationExperience.jsx
    ExperienceList.jsx
    Skills.jsx
    PersonalSkills.jsx
    SoftwareSkills.jsx
    Projects.jsx
    Certificates.jsx
    Gallery.jsx
    MusicPlayer.jsx
    Contact.jsx
    Footer.jsx
    SocialLinks.jsx
    Section.jsx
    AssetImage.jsx
    Modal.jsx
    Lightbox.jsx
    Reveal.jsx
    PageIntro.jsx
    ScrollTools.jsx
    Introduction.jsx
    SetupStatus.jsx
  data/
    portfolioData.js
  hooks/
    useAudioPlayer.js
    useMotionPreference.js
    useAnchorFocus.js
  App.jsx
  main.jsx
  index.css
  portfolio.css
  music.css
  interactions.css
  utils/
    content.js
    music.js
    motion.js
index.html
vite.config.js
package.json
scripts/
  asset-path.mjs
  check-all.mjs
  check-content.mjs
  check-build.mjs
  check-stage2.mjs
  check-stage4.mjs
  check-stage5.mjs
  check-stage6.mjs
  check-stage7.mjs
docs/
  TAHAP-2.md
  TAHAP-3.md
  TAHAP-4.md
  TAHAP-5.md
  TAHAP-6.md
  TAHAP-7.md
```

Folder kosong memakai `.gitkeep` agar tercatat saat Git dipakai. Tidak ada foto,
logo software, sertifikat, proyek, atau musik buatan. Fixture di script
pengujian tidak masuk ke konfigurasi atau aset portfolio.

## Pengelolaan konten dan aset

### Pemeriksaan menyeluruh

```powershell
npm run check
npm run build
npm run check:build
```

`check` menjalankan validasi konten/aset dan seluruh suite DOM secara berurutan.
Validasi aset memeriksa keberadaan file serta kapitalisasi nama/path agar cocok
di Windows maupun hosting Linux. Path yang masih kosong diperbolehkan.
`check:build` memeriksa hasil `dist/`, metadata/path aset, serta memastikan
fixture dan alat QA tidak masuk bundle aplikasi. Status HTTP dan MIME resource
preview diperiksa secara terpisah pada pengujian Tahap 7.
Jalankan ulang ketiga perintah setelah mengubah kode atau mengisi aset asli.

Audit axe pada jsdom memiliki batas layout/canvas; audit Chrome nyata pada
Tahap 7 dicatat secara terpisah. Hasil ini bukan sertifikasi WCAG. Rincian
pemeriksaan browser dan hal yang masih perlu ditinjau ada di laporan Tahap 7.

Seluruh informasi pribadi dikelola melalui `src/data/portfolioData.js`.
Struktur kategori dan contoh field ada di komentar setiap kategori. Konten CV
yang diberikan sudah dimasukkan pada Tahap 3. Array kosong dan string kosong
menandai konten yang belum diberikan; jangan menggantinya dengan informasi
contoh yang dapat disalahartikan sebagai data asli. Panduan field dan pengisian
tersedia dalam [laporan/panduan konten Tahap 3](docs/TAHAP-3.md).

Letakkan file asli di folder berikut lalu isi path di konfigurasi. Path URL tidak
memakai awalan `public`, misalnya `/assets/images/profile/profile.jpg`.

| Konten | Folder / field konfigurasi |
| --- | --- |
| Foto profil | `public/assets/images/profile/` → `hero.image`, `about.image` |
| Judul tab dan deskripsi SEO | `seo.title`, `seo.description` |
| Foto galeri | `public/assets/images/gallery/` → `gallery` |
| Sertifikat | `public/assets/images/certificates/` → `certificates` |
| Thumbnail proyek | `public/assets/images/projects/` → `projects` |
| Logo software asli | `public/assets/images/software/` → `softwareSkills` |
| Dokumentasi kerja/KKN/organisasi | `public/assets/images/experience/` → `images` pada pengalaman |
| Lagu MP3 | `public/assets/music/` → `music[].src` |
| Cover lagu | `public/assets/covers/` → `music[].cover` |
| Tulisan About Me | `about.description` |
| Pendidikan | `education` |
| Pengalaman kerja | `workExperience`, terbaru terlebih dahulu |
| Pengalaman KKN | `socialExperience`; tanggal/lokasi yang belum tersedia dikosongkan |
| Pengalaman organisasi | `organizationExperience`, biarkan kosong jika belum ada |
| Personal skills | `personalSkills`, tanpa rating/persentase |
| Email, telepon, lokasi, media sosial | `contact`; tautan yang belum tersedia dikosongkan |

Semua section membaca kategori masing-masing dari `portfolioData.js`.
Judul/kondisi kosong ada di `sections`, label antarmuka ada di `ui`, dan
navigasi/footer ada di `navigation` serta `footer`. About memakai `about.title`.
Label dan volume awal player ada di `musicPlayer`; daftar lagunya ada di `music`.
Anchor `#explore` kini menuju About Me. Teks dan komponen `Introduction`
Tahap 2 dipertahankan sebagai arsip, tetapi tidak dirender agar tidak mengulang
pengantar atau footer di tengah halaman.
Vite membaca `seo` untuk mengisi metadata langsung pada HTML development dan
hasil build. Ubah metadata di konfigurasi, bukan placeholder pada `index.html`.
`SetupStatus.jsx` dipertahankan sebagai halaman verifikasi lama dan tidak lagi
ditampilkan. Menaruh file di folder aset perlu disertai path dan item data di
konfigurasi. Setelah diisi, komponen terkait menampilkan aset tersebut.
Pertahankan nama file yang sama persis, termasuk
huruf besar/kecil agar dapat bekerja di hosting Linux.

### Mengganti foto hero

Letakkan foto asli di `public/assets/images/profile/profile.jpg`, lalu isi:

```js
hero: {
  // Pertahankan field hero lainnya.
  image: '/assets/images/profile/profile.jpg',
  imageAlt: 'Foto profil Ramzi Saputra',
}
```

Jika `image` kosong atau file gagal dimuat, monogram dari nama tampil sebagai
fallback. Gambar menggunakan `object-fit: contain` agar proporsinya terjaga.
Tidak ada foto sintetis atau gambar pribadi milik orang lain.

### Memeriksa interaksi Tahap 2

```powershell
npm run check:stage2
```

Pengujian memakai React, jsdom, dan transform JSX dari Vite. Mencakup menu
mobile, fokus keyboard, Escape, klik di luar menu, pergantian breakpoint,
indikator scroll, fallback foto, serta validitas target anchor. Simulasi DOM
ini tidak menggantikan pengujian layout, console, atau interaksi browser nyata.

### Memeriksa section dan interaksi Tahap 4

```powershell
npm run check:stage4
npm run build
```

Pemeriksaan mencakup render seluruh CV, data kosong, target anchor, kontak,
modal proyek, pembukaan sertifikat/dokumentasi, galeri next/previous dan keyboard,
zoom, fallback gambar, pengembalian fokus, serta tautan eksternal yang valid.
Fixture hanya dipakai dalam memori pengujian. Native dialog browser disimulasikan
secara terbatas pada jsdom; focus trap/top layer dan visual tetap perlu diuji di
browser nyata. Rincian tersedia di [laporan Tahap 4](docs/TAHAP-4.md).

### Menambahkan lagu dan cover

1. Simpan MP3 asli di `public/assets/music/` dan cover asli di
   `public/assets/covers/`.
2. Tambahkan objek di array `music` dalam `portfolioData.js`, memakai `id` unik,
   `title`, `artist`, `src`, dan `cover`.
3. Isi `src` dengan `/assets/music/` diikuti nama file MP3 sebenarnya, dan
   `cover` dengan `/assets/covers/` diikuti nama file cover sebenarnya.
   `cover: ''` diperbolehkan; record tanpa `src` dilewati.
4. Buka `http://127.0.0.1:5173/#music`, lalu tekan Putar. Tidak ada autoplay saat
   halaman dibuka. Memilih lagu melalui playlist juga merupakan tindakan Play.

Contoh format berikut adalah template dokumentasi; tambahkan ke konfigurasi
hanya setelah file dan informasi asli tersedia:

```js
music: [
  {
    id: 'lagu-1',
    title: '[JUDUL LAGU ASLI]',
    artist: '[NAMA PENYANYI ASLI]',
    src: '/assets/music/lagu-1.mp3',
    cover: '/assets/covers/cover-1.jpg',
  },
],
```

Hapus atau urutkan objek array untuk mengelola playlist. Setelah Play ditekan,
lagu berikutnya berjalan otomatis hingga lagu terakhir selesai. Tombol next/
previous berputar dalam daftar; ketika dijeda, perpindahan tersebut tetap dijeda.
Volume awal diatur melalui `musicPlayer.initialVolume` dengan nilai `0`–`1`.
Beberapa perangkat membatasi pengaturan volume melalui browser; player memberi
petunjuk penggunaan volume perangkat jika pembatasan terdeteksi. Lihat
[catatan kompatibilitas dan pengujian](docs/TAHAP-5.md).

### Memeriksa Music Player

```powershell
npm run check:stage5
npm run build
```

Uji otomatis memakai simulasi HTMLMediaElement dalam jsdom. Ini memeriksa
interaksi, state, urutan event, dan promise; tidak memverifikasi decoding MP3,
suara speaker, atau kompatibilitas perangkat nyata. Playlist portfolio tetap
kosong hingga lagu asli disediakan.

### Memeriksa animasi dan UX Tahap 6

```powershell
npm run check:stage6
npm run build
```

Uji mencakup lifecycle reveal, fallback observer, fokus keyboard, preferensi
reduced motion yang berubah, pembuka yang selesai otomatis, tombol ke atas,
modal close/cancel dan cleanup, serta pintasan zoom lightbox. Tes ini memakai
jsdom; penampilan/fps animasi, layout, inert, dan focus trap native tetap perlu
diverifikasi di browser nyata.

Animasi inti memakai durasi/easing di `src/utils/motion.js`; hover, menu, backdrop,
dan preferensi CSS ada di `src/interactions.css`. UI lightbox mendukung panah
untuk mengganti gambar, `+`/`−` untuk ukuran, `0` untuk reset, serta Escape untuk
menutup. Saat area gambar diperbesar dan mendapat fokus, panah menggeser gambar.
Pintasan browser seperti Ctrl/Cmd + zoom tetap dibiarkan bekerja.

Tailwind diintegrasikan melalui plugin `@tailwindcss/vite` dan
`@import "tailwindcss"` di `src/index.css`, sesuai
[dokumentasi resmi](https://tailwindcss.com/docs/installation/using-vite).
Tidak diperlukan `tailwind.config.js` untuk setup dasar ini.

## Hasil verifikasi Tahap 1 — 7 November 2026

- Lingkungan: Node.js `24.11.1`, npm `11.6.2`.
- Dependency: React/React DOM `19.3.1`, Vite `8.3.6`, plugin React `6.2.1`,
  Tailwind/plugin Vite `4.3.5`, Framer Motion `14.10.1`, Lucide React `1.70.0`.
- `npm ls --depth=0`: berhasil, tidak ada dependency invalid/missing.
- Instalasi npm melaporkan `0 vulnerabilities`.
- `npm run build`: berhasil; output HTML, CSS, dan JavaScript tersedia di `dist/`.
- Pemeriksaan aset hasil build: semua path aset pada HTML tersedia;
  utility Tailwind yang dipakai komponen berhasil dihasilkan.
- `npm run dev -- --port 5173 --strictPort`: server siap di
  `http://127.0.0.1:5173/`.
- HTTP `200`: halaman utama, entry JSX, App, SetupStatus, konfigurasi data,
  stylesheet, dan favicon.
- Pemeriksaan konfigurasi: seluruh kategori array valid, identitas dasar sesuai
  brief, foto belum diisi, serta proyek dan playlist tetap kosong.
- Browser: belum terverifikasi. Browser access host tidak tersedia dan jalur
  Computer Use Chrome dihentikan karena tidak dapat memastikan URL browser.
  Tampilan visual, console browser, dan responsivitas belum dinyatakan lolos.
- Server development dihentikan setelah pemeriksaan; jalankan `npm run dev`
  untuk membuka kembali halaman lokal.

## Rencana tahap berikutnya

1. **Project setup** — selesai.
2. **Main design** — implementasi selesai; hasil pemeriksaan Chrome ada di Tahap 7.
3. **Content management** — selesai; data CV dan konfigurasi konten terpusat sudah diisi.
4. **Portfolio sections** — implementasi dan uji DOM selesai; media asli masih perlu diisi/diperiksa.
5. **Music player** — implementasi dan uji simulasi API selesai; pemutaran MP3 asli belum terverifikasi.
6. **Animation & UI/UX** — implementasi/uji lifecycle selesai; seluruh reveal selesai pada pemeriksaan Chrome.
7. **Testing** — tahap saat ini; otomatis dan Chrome selesai untuk konten tersedia, dengan catatan media/kontras pada laporan.
8. **Deployment** — GitHub, build final, Vercel, dan verifikasi online.

Setiap tahap memerlukan laporan dan persetujuan sebelum tahap berikutnya.
Panduan GitHub dan deployment Vercel terperinci akan ditambahkan pada Tahap 8.
Project belum dipublikasikan; keberhasilan build setup belum berarti seluruh
portfolio selesai atau deployment final sudah diverifikasi.

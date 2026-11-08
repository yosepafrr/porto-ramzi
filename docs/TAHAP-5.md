# Laporan Tahap 5 — Music Player

Tanggal: 7 November 2026.

## Implementasi

Music Corner ditambahkan sesudah galeri dan sebelum Contact, memakai palet
arang/hijau limau yang sudah ada. Footer memiliki tautan Musik ke `#music`.
Player menggunakan satu elemen HTML5 `audio`, tanpa dependency audio tambahan.

| Fitur | Perilaku |
| --- | --- |
| Play / Pause | Dipicu tombol utama atau baris playlist yang sedang dipilih |
| Next / Previous | Berputar dalam daftar; mempertahankan keadaan Play/Pause |
| Pemilihan playlist | Lagu lain langsung dimuat dan diputar karena dipilih pengguna |
| Lagu selesai | Berlanjut ke lagu berikutnya setelah pengguna memulai Play; berhenti pada akhir playlist |
| Seek / progress | Range yang dapat digeser/dioperasikan dengan keyboard; mengikuti currentTime dan duration |
| Volume | Range 0–100%, mengikuti volume audio aktual |
| Mute / unmute | Memulihkan volume terakhir yang tidak nol ketika diperlukan |
| Informasi | Judul, penyanyi jika tersedia, cover asli, dan waktu berjalan/durasi |
| Indikator | Lagu dipilih, sedang diputar, dijeda, atau memuat; baris aktif ditandai aria-current |
| File error | Pesan ringkas; pengguna dapat mencoba Play lagi atau memilih lagu lain |
| Cover error/kosong | Placeholder tanpa gambar rusak |
| Playlist kosong | Player tetap rapi, semua kontrol nonaktif, tanpa elemen/sumber audio kosong |
| Mobile | Susunan player/playlist menjadi satu kolom; kontrol dan teks menyesuaikan lebar |

Audio tidak memiliki atribut autoplay. Saat data playlist dimuat, efek hanya
memilih sumber dan metadata tanpa memanggil Play. Pemutaran dimulai dari
tindakan pengguna. `preload="metadata"` memberi petunjuk kepada browser untuk
memuat metadata seperlunya, bukan mengunduh seluruh daftar.

Pemanggilan `play()` menangani promise yang ditolak, termasuk pembatasan izin
dan sumber/format yang tidak dapat dimainkan, sesuai
[dokumentasi HTMLMediaElement.play](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play).
Permintaan lama dibatalkan secara logis ketika pengguna menekan Pause,
mengganti lagu, atau meninggalkan player, sehingga hasil promise lama tidak
menimpa status lagu baru.

Volume melalui JavaScript memiliki batas kompatibilitas pada sebagian browser,
seperti dijelaskan di
[dokumentasi HTMLMediaElement.volume](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volume).
Jika nilai volume yang diminta tidak dapat diterapkan, player menampilkan
petunjuk volume perangkat dan menonaktifkan slider yang tidak dapat digunakan.
Perilaku aktual tetap perlu diperiksa pada smartphone pengguna.

## Pengelolaan musik

Seluruh daftar berada pada `portfolioData.music`:

| Field | Isi |
| --- | --- |
| `id` | ID unik dan stabil untuk lagu |
| `title` | Judul lagu asli |
| `artist` | Nama penyanyi; boleh kosong jika belum diberikan |
| `src` | Path MP3 asli, misalnya pola `/assets/music/` diikuti nama file |
| `cover` | Path cover asli dalam `/assets/covers/`; boleh kosong |

Letakkan berkas di `public/assets/music/` dan `public/assets/covers/` sebelum
mengisi path. Jangan menulis awalan `public` pada URL. Samakan kapitalisasi
nama file untuk hosting Linux. Record tanpa sumber audio dilewati.

Urutan array menjadi urutan playlist. Penambahan/penghapusan tidak memerlukan
perubahan JSX. Pengurutan ulang mempertahankan lagu yang masih ada berdasarkan
ID. Jika lagu aktif dihapus, player beralih ke lagu tersedia pertama dalam
keadaan berhenti. Mengosongkan playlist menghentikan audio dan melepas sumber.

`musicPlayer` memuat seluruh label, pesan, dan `initialVolume` (`0`–`1`). Volume
awal diterapkan saat player dimuat, dan tetap dipertahankan saat berpindah lagu.
Tidak ada persistensi atau pemutaran ulang otomatis ketika halaman dibuka ulang.

Playlist aktif tetap `[]` karena belum ada judul, penyanyi, MP3, atau cover asli
yang diberikan. Tidak dibuat/dimasukkan lagu fiktif, cover buatan, maupun file
audio uji ke folder aset. Template pengisian ada di README.

## File yang dibuat atau diperbarui

- `src/components/MusicPlayer.jsx`: section, player, cover, playlist, dan kontrol.
- `src/hooks/useAudioPlayer.js`: lifecycle dan event HTML5 Audio, state, kontrol,
  penanganan error, serta perlindungan terhadap hasil promise lama.
- `src/utils/music.js`: penyaringan sumber, ID, clamp, dan pemformatan waktu.
- `src/music.css`: styling player, range, playlist, dan breakpoint.
- `src/App.jsx`, `src/index.css`: integrasi section dan stylesheet.
- `src/data/portfolioData.js`: heading, konfigurasi player, dan tautan Musik.
- `scripts/check-stage5.mjs`, `package.json`: script pengujian audio.
- `scripts/check-stage2.mjs`, `scripts/check-stage4.mjs`: server uji Vite tidak
  lagi membuka WebSocket agar tidak berebut port saat pemeriksaan dijalankan.
- `README.md`, `docs/TAHAP-5.md`: panduan pengisian dan hasil pemeriksaan.

Tidak diperlukan dependency baru. Tidak ada aset pribadi yang diubah,
dipindahkan, atau dihapus. Tidak dilakukan deployment.

## Hasil pemeriksaan

- `npm run check:stage5`: berhasil untuk kondisi kosong, no-autoplay termasuk
  StrictMode, judul/playlist, metadata, Play/Pause, seek/timeupdate,
  Next/Previous dalam keadaan dijeda, volume/mute, dan volumechange.
- Perpindahan playlist saat berjalan, wrap manual, auto-next setelah Play,
  serta berhenti di lagu terakhir berhasil dalam simulasi.
- Penolakan izin, error file/format, retry sumber, dan permintaan Play yang
  tertunda saat ganti lagu/Pause tertangani tanpa unhandled rejection.
- Durasi NaN/Infinity, volume yang tidak dapat diubah, reorder, penghapusan
  lagu aktif, playlist kosong, dan record tanpa sumber berhasil diuji.
- `npm run check:stage2` dan `npm run check:stage4`: regresi berhasil setelah
  integrasi player; peringatan konflik port WebSocket server uji telah diperbaiki.
- `npm run build`: build production akhir berhasil. Semua referensi aset HTML
  tersedia; fixture judul/penyanyi/path audio uji tidak masuk bundle production.
  Playlist konfigurasi asli tetap kosong dan tautan Musik tersedia.
- HTTP `200`: halaman utama, App, MusicPlayer, hook audio, helper, stylesheet
  musik, dan konfigurasi data pada server development yang sudah aktif.

Uji audio menggunakan simulasi media di jsdom, bukan decoder/perangkat audio
nyata. Browser access host kembali tidak tersedia pada percobaan Tahap 5.
Karena itu, hasil ini tidak menyatakan pemutaran MP3/suara, layout browser,
atau kompatibilitas desktop/smartphone nyata telah terverifikasi.

Setelah lagu asli tersedia, buka `http://127.0.0.1:5173/#music` dan periksa:
halaman mula-mula diam, Play menghasilkan suara, Pause berhenti, ganti lagu,
seek, mute/volume, cover, auto-next, akhir playlist, serta error ketika file
tidak ditemukan. Ulangi pada desktop dan smartphone; gunakan tombol volume
perangkat jika pengaturan lewat browser dibatasi.

Tahap 5 berhenti di sini. Tahap 6 (Animation & UI/UX) menunggu persetujuan.

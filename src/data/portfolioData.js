// Pusat konten portfolio. Gunakan string kosong / array kosong untuk data yang
// belum diberikan. Data profil/CV berikut berasal dari brief pemilik portfolio.
// Tanggal bulanan memakai YYYY-MM; jangan menambahkan hari yang tidak diketahui.
// Path public tidak memakai awalan /public. Contoh:
// /assets/images/profile/profile.jpg atau /assets/music/lagu-1.mp3.
export const portfolioData = {
  // Metadata HTML dibaca Vite dari file ini saat development dan build.
  seo: {
    title: 'Ramzi Saputra | Personal Portfolio',
    description: 'Portfolio Ramzi Saputra — Informatika, teknologi multimedia, dan pengembangan game.',
  },

  // Hero: foto diisi setelah file asli tersedia, agar tidak ada gambar rusak.
  hero: {
    name: 'Ramzi Saputra',
    role: 'Informatics | Multimedia Technology | Game Development',
    greeting: 'Halo, saya',
    description: 'Lulusan Informatika dengan minat pada teknologi multimedia dan pengembangan game. Menghubungkan pemrograman, konten digital, dan ide kreatif menjadi pengalaman yang bermakna.',
    image: '',
    imageAlt: 'Foto profil Ramzi Saputra',
    profileLabel: 'Personal profile',
    photoPlaceholder: 'Foto profil belum ditambahkan',
    exploreLabel: 'Explore My Portfolio',
    contactLabel: 'Contact Me',
    scrollLabel: 'Kenali dunia saya',
  },

  // Navigasi utama; explore menjadi bagian About tanpa memutus anchor Tahap 2.
  navigation: {
    ariaLabel: 'Navigasi utama',
    homeLabel: 'Kembali ke beranda',
    openLabel: 'Buka menu navigasi',
    closeLabel: 'Tutup menu navigasi',
    contactLabel: 'Let’s talk',
    theme: {
      toLight: 'Aktifkan mode terang',
      toDark: 'Aktifkan mode gelap',
    },
    links: [
      { id: 'home', label: 'Beranda', number: '01' },
      { id: 'explore', label: 'Tentang', number: '02' },
      { id: 'experience', label: 'Pengalaman', number: '03' },
      { id: 'skills', label: 'Skills', number: '04' },
      { id: 'projects', label: 'Karya', number: '05' },
      { id: 'contact', label: 'Kontak', number: '06' },
    ],
  },

  // Pengantar Tahap 2 dipertahankan sebagai konfigurasi; About kini memakai explore.
  introduction: {
    eyebrow: 'A little introduction',
    title: 'Antara logika',
    accent: '& imajinasi.',
    description: 'Ketertarikan saya berawal dari teknologi, tumbuh lewat kreativitas, dan terus berkembang melalui hal-hal baru yang saya pelajari.',
    disciplines: [
      { id: 'informatics', number: '01', label: 'Informatics', icon: 'code' },
      { id: 'multimedia', number: '02', label: 'Multimedia Technology', icon: 'layers' },
      { id: 'game', number: '03', label: 'Game Development', icon: 'gamepad' },
    ],
    closing: 'Dibuat dengan rasa ingin tahu.',
    backToTopLabel: 'Kembali ke atas',
  },

  // Judul, label, dan kondisi kosong section. Semua copy dapat diubah di sini.
  sections: {
    about: { eyebrow: '01 / The person behind', title: 'About Me' },
    education: { eyebrow: '02 / The foundations', title: 'Education' },
    work: { eyebrow: '03 / Learning by doing', title: 'Work Experience' },
    social: { eyebrow: '04 / Beyond the screen', title: 'Social Experience' },
    organization: { eyebrow: '05 / Growing together', title: 'Organization Experience', emptyTitle: 'Belum ada pengalaman organisasi yang ditampilkan.' },
    skills: { eyebrow: '06 / Creative meets technical', title: 'Skills & Technologies' },
    personal: { eyebrow: '07 / How I work', title: 'Personal Skills' },
    software: { eyebrow: '08 / The everyday toolkit', title: 'Software Skills' },
    projects: { eyebrow: '09 / Ideas into experiences', title: 'My Works', emptyTitle: 'Belum ada proyek yang ditampilkan.' },
    certificates: { eyebrow: '10 / Keep learning', title: 'Certificates & Achievements', emptyTitle: 'Belum ada sertifikat yang ditampilkan.' },
    gallery: { eyebrow: '11 / Moments along the way', title: 'Personal Gallery', emptyTitle: 'Belum ada foto yang ditampilkan.' },
    music: { eyebrow: '12 / A personal soundtrack', title: 'Music Corner' },
    contact: { eyebrow: '13 / Start a conversation', title: 'Mari terhubung.', description: 'Punya ide, pertanyaan, atau ingin berkenalan? Saya senang mendengarnya.' },
  },

  // Label antarmuka. Placeholder tidak menyerupai aset/sertifikat asli.
  ui: {
    empty: 'Belum ada data yang ditampilkan.',
    imageMissing: 'Gambar belum tersedia',
    documentationMissing: 'Dokumentasi belum ditambahkan',
    certificateMissing: 'Gambar sertifikat belum ditambahkan',
    logoPlaceholder: 'Logo',
    logoMissing: 'Logo resmi belum tersedia',
    responsibilities: 'Lihat tanggung jawab',
    competencies: 'Kompetensi pembelajaran',
    gpa: 'IPK',
    hardSkills: 'Hard Skills',
    coreSkills: 'Core Skills',
    projectDetails: 'Lihat detail proyek',
    github: 'GitHub',
    demo: 'Lihat demo',
    close: 'Tutup',
    previous: 'Gambar sebelumnya',
    next: 'Gambar berikutnya',
    zoomIn: 'Perbesar gambar',
    zoomOut: 'Kembalikan ukuran gambar',
    viewImage: 'Lihat gambar',
    imageViewArea: 'Area gambar; gunakan tombol panah untuk menggeser saat diperbesar',
    imageKeyboardHint: 'Panah: ganti gambar · + / −: ukuran · Escape: tutup',
    email: 'Email',
    phone: 'Telepon',
    location: 'Lokasi',
    emailAction: 'Kirim email',
    backToTop: 'Kembali ke atas',
  },

  // Footer memakai nama dari hero dan tahun otomatis dari sistem.
  footer: {
    tagline: 'Informatics. Multimedia. A little imagination.',
    note: 'Dibuat dengan rasa ingin tahu.',
    navigationLabel: 'Navigasi footer',
    links: [
      { id: 'explore', label: 'Tentang' },
      { id: 'education', label: 'Pendidikan' },
      { id: 'experience', label: 'Pengalaman' },
      { id: 'projects', label: 'Karya' },
      { id: 'certificates', label: 'Sertifikat' },
      { id: 'gallery', label: 'Galeri' },
      { id: 'music', label: 'Musik' },
      { id: 'contact', label: 'Kontak' },
    ],
  },

  // About: ringkasan profesional sesuai CV; foto asli belum tersedia.
  about: {
    title: 'About Me',
    description:
      'Lulusan S1 Program Studi Informatika dengan IPK 3,56/4,00 yang memiliki keahlian dan minat di bidang teknologi multimedia dan pengembangan game. Memiliki pemahaman dalam pemrograman, pengembangan konten digital, serta penerapan teknologi informatika untuk menghasilkan solusi yang kreatif dan inovatif. Memiliki kemampuan problem solving, mampu beradaptasi dengan perkembangan teknologi, serta memiliki semangat untuk terus mempelajari dan mengembangkan kemampuan di bidang teknologi, multimedia, dan game development.',
    image: '',
    imageAlt: 'Foto Ramzi Saputra',
  },

  // Pendidikan: urut terbaru. startYear/endYear hanya menyimpan tahun dari CV.
  // gpa kosong berarti tidak diberikan, bukan nilai nol.
  education: [
    {
      id: 'universitas-siliwangi',
      institution: 'Universitas Siliwangi',
      degree: 'Sarjana (S1)',
      major: 'Informatika',
      startYear: 2022,
      endYear: 2026,
      period: '2022–2026',
      gpa: '3,56/4,00',
      competencies: [
        'Teknologi Multimedia',
        'Pemrograman dan Pengembangan Perangkat Lunak',
        'Pengembangan Konten Digital',
        'Analisis dan Pemecahan Masalah Teknologi',
        'Desain Grafis dan Desain Digital',
      ],
    },
    {
      id: 'sman-1-kawali',
      institution: 'SMAN 1 Kawali',
      degree: '',
      major: 'MIPA',
      startYear: 2019,
      endYear: 2021,
      period: '2019–2021',
      gpa: '',
      competencies: [],
    },
  ],

  // Kerja: urut terbaru berdasarkan startDate. role memakai nama dari brief,
  // tanpa menambahkan jabatan resmi yang tidak diberikan.
  // Dokumentasi: images: [{ src, alt, caption }] setelah foto asli tersedia.
  workExperience: [
    {
      id: 'laboratorium-informatika-unsil',
      role: 'Laboratorium Informatika',
      organization: 'Universitas Siliwangi',
      startDate: '2025-08',
      endDate: '2025-09',
      period: 'Agustus 2025 – September 2025',
      description: 'Mendukung operasional laboratorium komputer, penggunaan fasilitas, dan kelancaran kegiatan praktikum.',
      responsibilities: [
        'Membantu kegiatan operasional dan pengelolaan laboratorium komputer.',
        'Membantu mahasiswa dalam penggunaan perangkat dan fasilitas laboratorium.',
        'Melakukan pengecekan dan perawatan perangkat komputer serta fasilitas laboratorium.',
        'Membantu menyelesaikan kendala teknis terkait perangkat dan software.',
        'Mendukung kelancaran kegiatan praktikum dan aktivitas laboratorium.',
      ],
      images: [],
    },
    {
      id: 'crew-aqua-pasar-senggol',
      role: 'Crew Aqua',
      organization: 'Event Pasar Senggol Bekasi',
      startDate: '2025-07',
      endDate: '2025-08',
      period: 'Juli 2025 – Agustus 2025',
      description: 'Mendukung ketersediaan, penataan, dan distribusi produk Aqua selama event berlangsung.',
      responsibilities: [
        'Bertanggung jawab melakukan pengecekan dan pengisian ulang (restock) produk Aqua selama kegiatan event berlangsung.',
        'Memastikan ketersediaan stok produk agar kebutuhan selama event tetap terpenuhi.',
        'Melakukan penataan dan penyusunan produk agar tetap rapi serta mudah diakses.',
        'Berkoordinasi dengan tim untuk memastikan proses distribusi dan ketersediaan barang berjalan dengan baik.',
        'Membantu menjaga kelancaran operasional selama event berlangsung.',
      ],
      images: [
        { src: '/assets/images/experience/Crew Aqua/WhatsApp Image 2026-11-08 at 00.17.54 (1).jpeg', alt: 'Dokumentasi Crew Aqua di Event Pasar Senggol Bekasi — foto 1' },
        { src: '/assets/images/experience/Crew Aqua/WhatsApp Image 2026-11-08 at 00.17.54.jpeg', alt: 'Dokumentasi Crew Aqua di Event Pasar Senggol Bekasi — foto 2' },
        { src: '/assets/images/experience/Crew Aqua/WhatsApp Image 2026-11-08 at 00.18.15.jpeg', alt: 'Dokumentasi Crew Aqua di Event Pasar Senggol Bekasi — foto 3' },
        { src: '/assets/images/experience/Crew Aqua/WhatsApp Image 2026-11-08 at 00.19.03 (1).jpeg', alt: 'Dokumentasi Crew Aqua di Event Pasar Senggol Bekasi — foto 4' },
        { src: '/assets/images/experience/Crew Aqua/WhatsApp Image 2026-11-08 at 00.19.03.jpeg', alt: 'Dokumentasi Crew Aqua di Event Pasar Senggol Bekasi — foto 5' },
      ],
    },
    {
      id: 'surveyor-iconnet',
      role: 'Surveyor',
      organization: 'ICONNET',
      startDate: '2021-10',
      endDate: '2021-12',
      period: 'Oktober 2021 – Desember 2021',
      description: 'Melakukan survei lokasi dan pencatatan data lapangan untuk kebutuhan pemasangan jaringan ICONNET.',
      responsibilities: [
        'Melakukan survei lokasi untuk kebutuhan pemasangan jaringan ICONNET.',
        'Mengumpulkan dan mencatat data kondisi lokasi secara akurat.',
        'Melakukan pengecekan kelayakan lokasi berdasarkan kondisi lapangan.',
        'Berkoordinasi dengan tim terkait hasil survei dan kondisi lokasi.',
        'Memastikan data hasil survei dapat digunakan sebagai dasar proses pemasangan jaringan.',
      ],
      images: [
        { src: '/assets/images/experience/Iconnet/WhatsApp Image 2026-11-08 at 00.17.51.jpeg', alt: 'Dokumentasi pengalaman Surveyor ICONNET — foto 1' },
        { src: '/assets/images/experience/Iconnet/WhatsApp Image 2026-11-08 at 00.17.52 (1).jpeg', alt: 'Dokumentasi pengalaman Surveyor ICONNET — foto 2' },
        { src: '/assets/images/experience/Iconnet/WhatsApp Image 2026-11-08 at 00.17.52 (2).jpeg', alt: 'Dokumentasi pengalaman Surveyor ICONNET — foto 3' },
        { src: '/assets/images/experience/Iconnet/WhatsApp Image 2026-11-08 at 00.17.52 (3).jpeg', alt: 'Dokumentasi pengalaman Surveyor ICONNET — foto 4' },
        { src: '/assets/images/experience/Iconnet/WhatsApp Image 2026-11-08 at 00.17.52.jpeg', alt: 'Dokumentasi pengalaman Surveyor ICONNET — foto 5' },
        { src: '/assets/images/experience/Iconnet/WhatsApp Image 2026-11-08 at 00.17.53 (1).jpeg', alt: 'Dokumentasi pengalaman Surveyor ICONNET — foto 6' },
        { src: '/assets/images/experience/Iconnet/WhatsApp Image 2026-11-08 at 00.17.53 (2).jpeg', alt: 'Dokumentasi pengalaman Surveyor ICONNET — foto 7' },
        { src: '/assets/images/experience/Iconnet/WhatsApp Image 2026-11-08 at 00.17.53.jpeg', alt: 'Dokumentasi pengalaman Surveyor ICONNET — foto 8' },
      ],
    },
  ],

  // Sosial/KKN: tanggal, lokasi, dan desa belum diberikan.
  // Jangan menyalin tanggal dari pengalaman kerja ke pengalaman sosial.
  socialExperience: [
    {
      id: 'kkn-pdd',
      role: 'Divisi Publikasi, Dekorasi, dan Dokumentasi (PDD)',
      organization: 'Kuliah Kerja Nyata (KKN)',
      startDate: '',
      endDate: '',
      period: '',
      location: '',
      village: '',
      description: 'Kontribusi sosial melalui publikasi, dekorasi, dan dokumentasi kegiatan serta program kerja KKN.',
      responsibilities: [
        'Membuat desain publikasi untuk menyampaikan informasi kegiatan KKN kepada masyarakat.',
        'Mendokumentasikan berbagai kegiatan dan program kerja selama pelaksanaan KKN.',
        'Membuat konten visual berupa poster, banner, dan media publikasi lainnya.',
        'Mengelola dokumentasi foto dan video sebagai arsip kegiatan.',
        'Membantu menyiapkan kebutuhan dekorasi dan visual dalam pelaksanaan acara.',
        'Berkoordinasi dengan anggota kelompok untuk memastikan kebutuhan publikasi dan dokumentasi berjalan dengan baik.',
      ],
      images: [
        { src: '/assets/images/experience/KKN/WhatsApp Image 2026-11-08 at 00.16.06.jpeg', alt: 'Dokumentasi kegiatan Kuliah Kerja Nyata (KKN) — foto 1' },
        { src: '/assets/images/experience/KKN/WhatsApp Image 2026-11-08 at 00.16.07 (1).jpeg', alt: 'Dokumentasi kegiatan Kuliah Kerja Nyata (KKN) — foto 2' },
        { src: '/assets/images/experience/KKN/WhatsApp Image 2026-11-08 at 00.16.07.jpeg', alt: 'Dokumentasi kegiatan Kuliah Kerja Nyata (KKN) — foto 3' },
      ],
    },
  ],

  // Periode organisasi belum diberikan; jangan mengambil tanggal dari nama file foto.
  organizationExperience: [
    {
      id: 'himpunan-mahasiswa-minat-bakat',
      organization: 'Himpunan Mahasiswa',
      role: 'Divisi Minat dan Bakat',
      startDate: '',
      endDate: '',
      period: '',
      description: 'Mewadahi dan mendukung pengembangan minat serta bakat mahasiswa melalui kegiatan olahraga, seni, musik, e-sports, dan kreativitas.',
      responsibilities: [
        'Mengidentifikasi minat dan bakat mahasiswa, misalnya dalam bidang olahraga, seni, musik, e-sports, dan kreativitas.',
        'Menyelenggarakan kegiatan pengembangan bakat, seperti kompetisi olahraga, turnamen e-sports, pentas seni, dan perlombaan lainnya.',
        'Mewadahi dan mendukung potensi mahasiswa agar dapat berkembang melalui kegiatan positif.',
        'Mendorong partisipasi mahasiswa dalam berbagai perlombaan, baik di tingkat program studi, fakultas, universitas, maupun luar kampus.',
        'Mempererat hubungan antaranggota himpunan melalui kegiatan yang bersifat rekreatif, kreatif, dan kompetitif.',
        'Berkolaborasi dengan divisi lain dalam menyelenggarakan program kerja yang berkaitan dengan minat dan bakat mahasiswa.',
      ],
      images: [
        { src: '/assets/images/experience/Organisasi/WhatsApp Image 2026-11-08 at 00.16.03.jpeg', alt: 'Dokumentasi Himpunan Mahasiswa Divisi Minat dan Bakat — foto 1' },
        { src: '/assets/images/experience/Organisasi/WhatsApp Image 2026-11-08 at 00.16.04.jpeg', alt: 'Dokumentasi Himpunan Mahasiswa Divisi Minat dan Bakat — foto 2' },
        { src: '/assets/images/experience/Organisasi/WhatsApp Image 2026-11-08 at 00.16.06.jpeg', alt: 'Dokumentasi Himpunan Mahasiswa Divisi Minat dan Bakat — foto 3' },
      ],
    },
  ],

  // Hard skills: { id, name, category }. Tanpa persentase atau rating.
  hardSkills: [
    { id: 'graphic-digital-design', name: 'Desain Grafis & Desain Digital', category: 'Design' },
    { id: 'ui-ux-design', name: 'UI/UX Design', category: 'Design' },
    { id: 'multimedia-editing', name: 'Pengolahan & Editing Multimedia', category: 'Multimedia' },
    { id: 'basic-programming', name: 'Pemrograman Dasar', category: 'Development' },
    { id: 'digital-content', name: 'Pengembangan Konten Digital', category: 'Multimedia' },
    { id: 'technology-problem-solving', name: 'Analisis & Pemecahan Masalah Teknologi', category: 'Problem Solving' },
  ],

  // Core skills: array nama kemampuan (string).
  coreSkills: [
    'Informatika',
    'Desain Grafis',
    'UI/UX Design',
    'Teknologi Multimedia',
    'Digital Content',
    'Pemrograman',
    'Problem Solving',
    'Microsoft Office',
  ],

  // Personal skills: { id, name, description, icon }. Ikon memakai nama Lucide.
  personalSkills: [
    {
      id: 'communication',
      name: 'Communication Skills',
      description: 'Mampu menyampaikan informasi dan berkomunikasi secara efektif dengan individu maupun tim.',
      icon: 'MessageCircle',
    },
    {
      id: 'teamwork',
      name: 'Teamwork & Collaboration',
      description: 'Mampu bekerja sama dalam tim untuk mencapai tujuan dan menyelesaikan pekerjaan.',
      icon: 'Users',
    },
    {
      id: 'problem-solving',
      name: 'Problem Solving',
      description: 'Mampu menganalisis permasalahan dan mencari solusi yang efektif.',
      icon: 'Lightbulb',
    },
    {
      id: 'adaptability',
      name: 'Adaptability',
      description: 'Cepat beradaptasi dengan lingkungan, situasi, dan tanggung jawab baru.',
      icon: 'RefreshCw',
    },
    {
      id: 'time-management',
      name: 'Time Management',
      description: 'Mampu mengatur prioritas dan menyelesaikan pekerjaan sesuai tenggat waktu.',
      icon: 'Clock3',
    },
    {
      id: 'initiative',
      name: 'Initiative & Proactiveness',
      description: 'Memiliki inisiatif tinggi dalam mengidentifikasi kebutuhan, mengambil tindakan tanpa harus selalu menunggu arahan, serta proaktif mencari peluang untuk meningkatkan efektivitas pekerjaan.',
      icon: 'Zap',
    },
    {
      id: 'attention-to-detail',
      name: 'Attention to Detail',
      description: 'Memiliki ketelitian dalam mengerjakan tugas, mengelola data, dan menyusun dokumen.',
      icon: 'ScanSearch',
    },
    {
      id: 'creativity',
      name: 'Creativity',
      description: 'Memiliki kemampuan berpikir kreatif dalam mengembangkan ide dan menghasilkan solusi.',
      icon: 'Palette',
    },
  ],

  // Software: hanya identitas dan path logo resmi, tanpa deskripsi/rating.
  // Logo belum tersedia. Isi logo setelah file asli ada di images/software/.
  softwareSkills: [
    { id: 'capcut', name: 'CapCut', category: 'Design & Multimedia', logo: '' },
    { id: 'canva', name: 'Canva', category: 'Design & Multimedia', logo: '' },
    { id: 'figma', name: 'Figma', category: 'Design & Multimedia', logo: '' },
    { id: 'tiktok', name: 'TikTok', category: 'Social Media', logo: '' },
    { id: 'instagram', name: 'Instagram', category: 'Social Media', logo: '' },
    { id: 'vscode', name: 'Visual Studio Code', category: 'Development & AI Tools', logo: '' },
    { id: 'antigravity', name: 'Google Antigravity', category: 'Development & AI Tools', logo: '' },
    { id: 'chatgpt', name: 'ChatGPT', category: 'Development & AI Tools', logo: '' },
    { id: 'claude', name: 'Claude', category: 'Development & AI Tools', logo: '' },
    { id: 'word', name: 'Microsoft Word', category: 'Office', logo: '' },
    { id: 'powerpoint', name: 'Microsoft PowerPoint', category: 'Office', logo: '' },
    { id: 'excel', name: 'Microsoft Excel', category: 'Office', logo: '' },
  ],

  // Proyek: { id, title, image, description, technologies: [], year, github, demo }
  // Jangan tambahkan proyek contoh yang dapat disalahartikan sebagai karya asli.
  projects: [],

  // Sertifikat: date = YYYY-MM, dateLabel untuk tampilan. Urut terbaru dahulu.
  // Nama/tanggal dari CV. Penerbit dan gambar tetap kosong karena belum diberikan.
  certificates: [
    {
      id: 'google-cloud-skill-boost',
      name: 'Google Cloud Skill Boost',
      issuer: '',
      date: '2024-11',
      dateLabel: 'November 2024',
      image: '',
    },
    {
      id: 'cpp',
      name: 'C++',
      issuer: '',
      date: '2023-08',
      dateLabel: 'Agustus 2023',
      image: '',
    },
    {
      id: 'c',
      name: 'C',
      issuer: '',
      date: '2023-08',
      dateLabel: 'Agustus 2023',
      image: '',
    },
  ],

  // Galeri: { id, src, alt, caption, category }. Gunakan foto asli.
  gallery: [],

  // Tampilan player. initialVolume = 0 sampai 1, hanya dipakai saat player dimuat.
  musicPlayer: {
    initialVolume: 0.65,
    nowPlaying: 'Now playing',
    emptyTitle: 'Belum ada lagu yang ditampilkan.',
    emptyDescription: 'Playlist masih kosong.',
    emptyCover: 'Personal soundtrack',
    coverPlaceholder: 'Cover belum tersedia',
    untitled: 'Lagu tanpa judul',
    playlist: 'Playlist',
    play: 'Putar',
    pause: 'Jeda',
    previous: 'Lagu sebelumnya',
    next: 'Lagu berikutnya',
    mute: 'Bisukan audio',
    unmute: 'Aktifkan suara',
    seek: 'Posisi lagu',
    volume: 'Volume',
    playing: 'Sedang diputar',
    paused: 'Dijeda',
    ready: 'Siap diputar',
    loading: 'Memuat audio…',
    sourceError: 'Lagu ini belum dapat diputar. Coba lagi atau pilih lagu lain.',
    blockedError: 'Pemutaran belum diizinkan. Tekan Putar untuk mencoba lagi.',
    seekError: 'Posisi lagu belum dapat diubah. Coba lagi setelah audio dimuat.',
    deviceVolume: 'Gunakan tombol volume perangkat untuk mengatur suara.',
  },

  // Musik: { id, title, artist, src, cover }. Gunakan lagu asli dan id unik.
  // src kosong dilewati. Tidak ada autoplay saat halaman/playlist dimuat.
  // Setelah pengguna menekan Play, lagu berikutnya berjalan sampai akhir daftar.
  music: [],

  // Kontak: tautan sosial kosong berarti belum tersedia, bukan URL fiktif.
  contact: {
    email: 'syaputraramzy@gmail.com',
    phone: '+62 853-2064-9461',
    location: 'Ciamis, Indonesia',
    instagram: '',
    linkedin: '',
    github: '',
    otherSocials: [],
  },
}

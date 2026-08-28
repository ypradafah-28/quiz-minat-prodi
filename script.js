/* ============================================================================
   QUIZ MINAT PRODI — script.js
   ----------------------------------------------------------------------------
   Kuis prediksi minat jurusan:
   - 10 bank soal, 5 soal ditampilkan secara acak.
   - 104 program studi dikelompokkan ke 3 rumpun:
       r1 = Saintek & Kesehatan
       r2 = Soshum & Bisnis
       r3 = Agro, Seni & Budaya
   - Tanpa database; semua data tersimpan di file ini.

   ============================================================================
   PANDUAN MEMPERBARUI BANK SOAL & PRODI
   ----------------------------------------------------------------------------
   1) MENAMBAH / MENGUBAH SOAL  →  edit array SOAL_BANK di bawah.
      Setiap soal butuh 4 field:
        id     : nomor urut unik (boleh asal tidak sama).
        teks   : kalimat pertanyaan.
        rumpun : kode rumpun utama soal ("r1", "r2", atau "r3").
        tags   : kata kunci sub-bidang (dipisah spasi). Harus cocok dengan
                 minimal satu tag prodi agar rekomendasi makin akurat.
      Contoh soal baru:
        { id: 11, teks: "Apakah kamu tertarik...?", rumpun: "r1", tags: "it data" }

   2) MENAMBAH / MENGUBAH PRODI  →  edit array PRODI_LIST di bawah.
      Format tiap baris: [ "Nama Prodi", "Fakultas", "Rumpun", "tags" ]
        Rumpun : "r1", "r2", atau "r3"
        tags   : kata kunci sub-bidang, dipisah spasi.
      Contoh prodi baru:
        ["Teknik Nuklir", "FT", "r1", "teknik sains"]

      DAFTAR TAG yang dipakai saat ini:
        it, data, sains, teknik, kesehatan, olahraga, bisnis, akuntansi,
        hukum, sosial, hi, komunikasi, bahasa, psikologi, pendidikan,
        agro, pangan, kuliner, busana, rias, seni, desain, film,
        musik, budaya, pariwisata

   3) MENGUBAH JUMLAH SOAL  →  ubah nilai jumlahSoal di objek KONFIGURASI.
   ========================================================================== */

/* ============ 1. KONFIGURASI UMUM ============ */
const KONFIGURASI = {
  jumlahSoal: 5,          // berapa soal acak yang muncul dari bank soal
  durasiAnalisisMs: 1600, // lama animasi "menganalisis" sebelum hasil tampil
  bobotTag: 3,            // pengali skor untuk prodi yang tag-nya cocok dengan soal
  opsiJawaban: [          // pilihan jawaban: Ya / Ragu-ragu / Tidak
    { label: "Ya",         skor: 2,  emoji: "👍" },
    { label: "Ragu-ragu",  skor: 0,  emoji: "🤔" },
    { label: "Tidak",      skor: -2, emoji: "👎" },
  ],
};

/* ============ 2. RUMPUN PRODI ============ */
const RUMPUN = {
  r1: { nama: "Saintek & Kesehatan", ikon: "🧪" },
  r2: { nama: "Soshum & Bisnis",     ikon: "💼" },
  r3: { nama: "Agro, Seni & Budaya", ikon: "🎨" },
};

/* ============ 3. BANK SOAL (10 SOAL) ============ */
const SOAL_BANK = [
  { id: 1,  teks: "Apakah kamu tertarik merancang perangkat lunak, memrogram komputer, atau menganalisis data digital?", rumpun: "r1", tags: "it data" },
  { id: 2,  teks: "Apakah kamu senang melakukan eksperimen laboratorium dan meneliti fenomena sains?", rumpun: "r1", tags: "sains" },
  { id: 3,  teks: "Apakah kamu berminat membongkar-pasang mesin, merancang bangunan, atau mengulik sistem teknik?", rumpun: "r1", tags: "teknik" },
  { id: 4,  teks: "Apakah kamu ingin bekerja di bidang medis, merawat kesehatan manusia, atau mempelajari ilmu gizi?", rumpun: "r1", tags: "kesehatan" },
  { id: 5,  teks: "Apakah kamu suka mengolah data keuangan, menyusun strategi bisnis, atau menganalisis pasar?", rumpun: "r2", tags: "bisnis akuntansi" },
  { id: 6,  teks: "Apakah kamu tertarik mempelajari hukum, kebijakan publik, isu sosial, atau hubungan internasional?", rumpun: "r2", tags: "hukum sosial hi" },
  { id: 7,  teks: "Apakah kamu senang mempelajari bahasa asing, menulis karya sastra, atau mengolah media komunikasi?", rumpun: "r2", tags: "bahasa komunikasi" },
  { id: 8,  teks: "Apakah kamu menikmati kegiatan menggambar, membuat animasi/film, atau merancang karya desain visual?", rumpun: "r3", tags: "seni desain film" },
  { id: 9,  teks: "Apakah kamu berminat mengajar, mendampingi tumbuh kembang anak, atau memahami psikologi manusia?", rumpun: "r2", tags: "pendidikan psikologi" },
  { id: 10, teks: "Apakah kamu menyukai aktivitas fisik, dunia keolahragaan, atau pengorganisasian industri pariwisata?", rumpun: "r1", tags: "olahraga pariwisata" },
];

/* ============ 4. DAFTAR PRODI (104) ============ */
/* Format baris: [ "Nama Prodi", "Fakultas", "Rumpun", "tag1 tag2" ] */
const PRODI_LIST = [
  // ---------- FBS : Fakultas Bahasa dan Seni ----------
  ["Desain Komunikasi Visual", "FBS", "r3", "seni desain"],
  ["Film dan Animasi", "FBS", "r3", "seni film"],
  ["Musik", "FBS", "r3", "musik seni"],
  ["Pendidikan Bahasa dan Sastra Indonesia", "FBS", "r2", "bahasa pendidikan"],
  ["Pendidikan Bahasa dan Sastra Jawa", "FBS", "r3", "budaya bahasa pendidikan"],
  ["Pendidikan Bahasa Inggris", "FBS", "r2", "bahasa pendidikan"],
  ["Pendidikan Bahasa Jepang", "FBS", "r2", "bahasa pendidikan"],
  ["Pendidikan Bahasa Jerman", "FBS", "r2", "bahasa pendidikan"],
  ["Pendidikan Bahasa Mandarin", "FBS", "r2", "bahasa pendidikan"],
  ["Pendidikan Seni Drama, Tari, dan Musik", "FBS", "r3", "musik seni pendidikan"],
  ["Pendidikan Seni Rupa", "FBS", "r3", "seni pendidikan"],
  ["Sastra Indonesia", "FBS", "r2", "bahasa"],
  ["Sastra Inggris", "FBS", "r2", "bahasa"],
  ["Sastra Jerman", "FBS", "r2", "bahasa"],
  ["Seni Rupa Murni", "FBS", "r3", "seni"],
  // ---------- FEB : Fakultas Ekonomika dan Bisnis ----------
  ["Akuntansi", "FEB", "r2", "bisnis akuntansi"],
  ["Bisnis Digital", "FEB", "r2", "bisnis it"],
  ["Ekonomi", "FEB", "r2", "bisnis"],
  ["Ekonomi Islam", "FEB", "r2", "bisnis"],
  ["Manajemen", "FEB", "r2", "bisnis"],
  ["Pendidikan Administrasi Perkantoran", "FEB", "r2", "bisnis pendidikan"],
  ["Pendidikan Akuntansi", "FEB", "r2", "bisnis akuntansi pendidikan"],
  ["Pendidikan Bisnis", "FEB", "r2", "bisnis pendidikan"],
  ["Pendidikan Ekonomi", "FEB", "r2", "bisnis pendidikan"],
  // ---------- FH : Fakultas Hukum ----------
  ["Ilmu Hukum", "FH", "r2", "hukum"],
  // ---------- FIKK : Fakultas Ilmu Keolahragaan dan Kesehatan ----------
  ["Gizi", "FIKK", "r1", "kesehatan"],
  ["Ilmu Keolahragaan", "FIKK", "r1", "olahraga"],
  ["Manajemen Olahraga", "FIKK", "r1", "olahraga bisnis"],
  ["Masase", "FIKK", "r1", "kesehatan olahraga"],
  ["Pendidikan Jasmani, Kesehatan, dan Rekreasi", "FIKK", "r1", "olahraga pendidikan"],
  ["Pendidikan Kepelatihan Olahraga", "FIKK", "r1", "olahraga pendidikan"],
  // ---------- FIP : Fakultas Ilmu Pendidikan ----------
  ["Bimbingan Dan Konseling", "FIP", "r2", "psikologi pendidikan"],
  ["Manajemen Pendidikan", "FIP", "r2", "pendidikan bisnis"],
  ["Pendidikan Guru PAUD", "FIP", "r2", "pendidikan"],
  ["Pendidikan Guru Sekolah Dasar (PGSD)", "FIP", "r2", "pendidikan"],
  ["Pendidikan Luar Biasa", "FIP", "r2", "pendidikan psikologi"],
  ["Pendidikan Luar Sekolah", "FIP", "r2", "pendidikan"],
  ["Teknologi Pendidikan", "FIP", "r2", "pendidikan it"],
  // ---------- FISIPOL : Fakultas Ilmu Sosial dan Ilmu Politik ----------
  ["Hubungan Internasional", "FISIPOL", "r2", "hi"],
  ["Ilmu Administrasi Negara", "FISIPOL", "r2", "sosial"],
  ["Ilmu Komunikasi", "FISIPOL", "r2", "komunikasi"],
  ["Ilmu Politik", "FISIPOL", "r2", "sosial"],
  ["Pendidikan Geografi", "FISIPOL", "r2", "sosial pendidikan"],
  ["Pendidikan IPS", "FISIPOL", "r2", "sosial pendidikan"],
  ["Pendidikan Pancasila dan Kewarganegaraan", "FISIPOL", "r2", "sosial pendidikan"],
  ["Pendidikan Sejarah", "FISIPOL", "r2", "sosial pendidikan"],
  ["Sains Informasi Geografi", "FISIPOL", "r1", "sains data"],
  ["Sosiologi", "FISIPOL", "r2", "sosial"],
  // ---------- FK : Fakultas Kedokteran ----------
  ["Fisioterapi", "FK", "r1", "kesehatan"],
  ["Kebidanan", "FK", "r1", "kesehatan"],
  ["Kedokteran", "FK", "r1", "kesehatan"],
  ["Kedokteran Gigi", "FK", "r1", "kesehatan"],
  ["Keperawatan", "FK", "r1", "kesehatan"],
  // ---------- FKP : Fakultas Kelautan dan Perikanan ----------
  ["Agribisnis Digital", "FKP", "r3", "agro it"],
  ["Akuakultur", "FKP", "r3", "agro"],
  ["Biosains Hewan", "FKP", "r1", "sains"],
  ["Bioteknologi", "FKP", "r1", "sains"],
  ["Teknologi Pangan dan Hasil Pertanian", "FKP", "r3", "agro pangan"],
  // ---------- FMIPA : Fakultas Matematika dan IPA ----------
  ["Biologi", "FMIPA", "r1", "sains"],
  ["Fisika", "FMIPA", "r1", "sains"],
  ["Geofisika", "FMIPA", "r1", "sains"],
  ["Kecerdasan Artifisial", "FMIPA", "r1", "it data"],
  ["Kimia", "FMIPA", "r1", "sains"],
  ["Matematika", "FMIPA", "r1", "sains data"],
  ["Pendidikan Biologi", "FMIPA", "r1", "sains pendidikan"],
  ["Pendidikan Fisika", "FMIPA", "r1", "sains pendidikan"],
  ["Pendidikan Ilmu Pengetahuan Alam", "FMIPA", "r1", "sains pendidikan"],
  ["Pendidikan Kimia", "FMIPA", "r1", "sains pendidikan"],
  ["Pendidikan Matematika", "FMIPA", "r1", "sains data pendidikan"],
  ["Sains Aktuaria", "FMIPA", "r1", "data bisnis"],
  ["Sains Data", "FMIPA", "r1", "data it"],
  // ---------- FPSI : Fakultas Psikologi ----------
  ["Psikologi", "FPSI", "r2", "psikologi"],
  // ---------- FT : Fakultas Teknik ----------
  ["Pariwisata", "FT", "r3", "pariwisata"],
  ["Pendidikan Tata Boga", "FT", "r3", "kuliner pendidikan"],
  ["Pendidikan Tata Busana", "FT", "r3", "busana pendidikan"],
  ["Pendidikan Tata Rias", "FT", "r3", "rias pendidikan"],
  ["Pendidikan Teknik Bangunan", "FT", "r1", "teknik pendidikan"],
  ["Pendidikan Teknik Elektro", "FT", "r1", "teknik it pendidikan"],
  ["Pendidikan Teknik Mesin", "FT", "r1", "teknik pendidikan"],
  ["Pendidikan Teknologi Informasi", "FT", "r1", "it pendidikan"],
  ["Pendidikan Vokasional Teknologi Otomotif", "FT", "r1", "teknik pendidikan"],
  ["Perencanaan Wilayah dan Kota", "FT", "r1", "teknik"],
  ["Sistem Informasi", "FT", "r1", "it data"],
  ["Teknik Elektro", "FT", "r1", "teknik it"],
  ["Teknik Informatika", "FT", "r1", "it"],
  ["Teknik Mesin", "FT", "r1", "teknik"],
  ["Teknik Metalurgi", "FT", "r1", "teknik sains"],
  ["Teknik Pertambangan", "FT", "r1", "teknik sains"],
  ["Teknik Sipil", "FT", "r1", "teknik"],
  // ---------- FV : Fakultas Vokasi ----------
  ["Administrasi Negara", "FV", "r2", "sosial"],
  ["Analisis Performa Olahraga", "FV", "r1", "olahraga data"],
  ["Arsitektur Bangunan Gedung", "FV", "r1", "teknik"],
  ["Desain Grafis", "FV", "r3", "seni desain"],
  ["Kepelatihan Olahraga", "FV", "r1", "olahraga"],
  ["Manajemen Informatika", "FV", "r1", "it bisnis"],
  ["Produksi Media", "FV", "r3", "film komunikasi"],
  ["Rekayasa Multimedia Edukasi Digital", "FV", "r1", "it pendidikan"],
  ["Tata Boga", "FV", "r3", "kuliner"],
  ["Tata Busana", "FV", "r3", "busana"],
  ["Teknik Listrik", "FV", "r1", "teknik"],
  ["Teknik Mesin", "FV", "r1", "teknik"],
  ["Teknik Sipil", "FV", "r1", "teknik"],
  ["Teknologi Rekayasa Otomotif", "FV", "r1", "teknik"],
  ["Transportasi", "FV", "r1", "teknik"],
];

/* ============ 5. STATE APLIKASI ============ */
let soalAktif = [];       // 5 soal yang terpilih secara acak
let jawaban = [];         // skor jawaban untuk tiap soal (urutan sama dengan soalAktif)
let indexSekarang = 0;    // posisi soal yang sedang ditampilkan (0-4)
let kunciJawaban = false; // mencegah klik ganda saat transisi antar soal

/* ============ 6. REFERENSI ELEMEN DOM ============ */
const el = {
  sectionStart:  document.getElementById("section-start"),
  sectionQuiz:   document.getElementById("section-quiz"),
  sectionAnalis: document.getElementById("section-analyzing"),
  sectionHasil:  document.getElementById("section-result"),
  soalProgress:  document.getElementById("soal-progress"),
  progressFill:  document.getElementById("progress-fill"),
  soalText:      document.getElementById("soal-text"),
  soalOptions:   document.getElementById("soal-options"),
  hasilList:     document.getElementById("result-list"),
  btnMulai:      document.getElementById("btn-mulai"),
  btnUlangi:     document.getElementById("btn-ulangi"),
  btnKembali:    document.getElementById("btn-kembali"),
  canvasPetasan: document.getElementById("canvas-petasan"),
};

/* ============ 7. FUNGSI BANTU ============ */
// Mengacak isi array (Fisher-Yates shuffle)
function acakArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Menampilkan satu "layar" (section) dan menyembunyikan yang lain
function tampilkanSection(target) {
  [el.sectionStart, el.sectionQuiz, el.sectionAnalis, el.sectionHasil].forEach((s) => {
    s.classList.add("hidden");
  });
  target.classList.remove("hidden");
  target.classList.remove("anim-masuk");
  void target.offsetWidth; // paksa reflow agar animasi berjalan ulang
  target.classList.add("anim-masuk");
}

/* ============ 8. ALUR KUIS ============ */
// Memulai / mengulang kuis
function mulaiKuis() {
  hentikanPetasan(); // matikan animasi petasan (jika sedang berjalan)
  // Pilih N soal acak dari bank soal tanpa pengulangan
  soalAktif = acakArray(SOAL_BANK).slice(0, KONFIGURASI.jumlahSoal);
  jawaban = [];
  indexSekarang = 0;
  kunciJawaban = false;

  tampilkanSection(el.sectionQuiz);
  renderSoal(indexSekarang);
}

// Tombol "Kembali" : kembali ke layar awal (mulai kuis)
function kembaliKeAwal() {
  kunciJawaban = false;
  indexSekarang = 0;
  jawaban = [];
  el.progressFill.style.width = "0%";
  el.soalOptions.innerHTML = "";
  tampilkanSection(el.sectionStart);
}

// Menampilkan soal pada indeks tertentu
function renderSoal(idx) {
  const soal = soalAktif[idx];
  const total = soalAktif.length;

  // Teks soal & progres
  el.soalText.textContent = soal.teks;
  el.soalProgress.textContent = `Soal ${idx + 1}/${total}`;
  el.progressFill.style.width = `${((idx + 1) / total) * 100}%`;

  // Bangun tombol opsi jawaban
  el.soalOptions.innerHTML = "";
  KONFIGURASI.opsiJawaban.forEach((opsi) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-btn";
    btn.innerHTML = `
      <span class="option-emoji">${opsi.emoji}</span>
      <span class="option-label">${opsi.label}</span>
    `;
    btn.addEventListener("click", () => pilihOpsi(opsi.skor, btn));
    el.soalOptions.appendChild(btn);
  });

  // Animasi masuk opsi
  el.soalOptions.classList.remove("anim-masuk");
  void el.soalOptions.offsetWidth;
  el.soalOptions.classList.add("anim-masuk");
}

// Dipanggil saat salah satu opsi diklik
function pilihOpsi(skor, btn) {
  if (kunciJawaban) return;
  kunciJawaban = true;

  // Efek visual: opsi terpilih menyala, lainnya meredup
  btn.classList.add("option-selected");
  [...el.soalOptions.children].forEach((b) => {
    if (b !== btn) b.classList.add("option-dim");
  });

  // Simpan jawaban (nilai skor) untuk soal saat ini
  jawaban[indexSekarang] = skor;

  // Beri jeda singkat agar efek terlihat, lalu lanjut ke soal berikutnya
  setTimeout(() => {
    if (indexSekarang + 1 < soalAktif.length) {
      indexSekarang++;
      renderSoal(indexSekarang);
      kunciJawaban = false; // buka kunci untuk soal berikutnya
    } else {
      tampilkanAnalisis(); // semua soal sudah terjawab
    }
  }, 350);
}

// Layar "menganalisis" lalu tampilkan hasil
function tampilkanAnalisis() {
  tampilkanSection(el.sectionAnalis);
  setTimeout(() => {
    const hasil = hitungSkor();
    renderHasil(hasil);
  }, KONFIGURASI.durasiAnalisisMs);
}

/* ============ 9. PERHITUNGAN SKOR & REKOMENDASI ============ */
// Menghitung skor kecocokan untuk setiap prodi
function hitungSkor() {
  return PRODI_LIST.map((prodi) => {
    const tagsProdi = new Set(prodi[3].split(" ").filter(Boolean));
    let skor = 0;

    soalAktif.forEach((soal, qi) => {
      const nilaiJawab = jawaban[qi];

      // (a) Bonus rumpun: prodi yang serumpun dengan soal ikut terangkat
      if (prodi[2] === soal.rumpun) skor += nilaiJawab;

      // (b) Bonus tag: prodi dengan tag yang cocok dengan soal mendapat
      //     bobot lebih besar = nilaiJawab x bobotTag x jumlah tag cocok
      const tagCocok = soal.tags.split(" ").filter((t) => tagsProdi.has(t)).length;
      skor += nilaiJawab * KONFIGURASI.bobotTag * tagCocok;
    });

    return { nama: prodi[0], rumpun: prodi[2], skor };
  });
}

// Mengubah skor mentah menjadi persentase kecocokan (normalisasi min-max)
function kePersen(skorProdi, p) {
  const semuaSkor = skorProdi.map((x) => x.skor);
  const min = Math.min(...semuaSkor);
  const max = Math.max(...semuaSkor);
  const rentang = max - min;
  if (rentang <= 0) return 50; // semua skor sama -> persentase netral
  return Math.round(((p.skor - min) / rentang) * 100);
}

// Menampilkan Top 5 prodi
function renderHasil(skorProdi) {
  // Urutkan dari skor tertinggi; jika skor sama, urutan asli dipertahankan
  const top5 = [...skorProdi].sort((a, b) => b.skor - a.skor).slice(0, 5);

  el.hasilList.innerHTML = "";
  top5.forEach((p, i) => {
    const r = RUMPUN[p.rumpun];
    const persen = kePersen(skorProdi, p);
    const badgeRumpun = p.rumpun === "r1" ? "badge-r1" : p.rumpun === "r2" ? "badge-r2" : "badge-r3";

    const card = document.createElement("div");
    card.className = "result-card anim-masuk";
    card.style.animationDelay = `${i * 130}ms`; // muncul berurutan (stagger)

    // Isi kartu: peringkat, nama prodi, persentase, badge rumpun
    card.innerHTML = `
      <div class="rank-badge rank-${i + 1}">${i + 1}</div>
      <div class="result-info">
        <p class="result-nama">${p.nama}</p>
        <span class="rumpun-badge ${badgeRumpun}">${r.ikon} ${r.nama}</span>
      </div>
      <div class="result-pct">
        <span class="pct-angka">${persen}%</span>
        <div class="pct-track"><div class="pct-fill" style="width:${persen}%"></div></div>
      </div>
    `;
    el.hasilList.appendChild(card);
  });

  tampilkanSection(el.sectionHasil);
  mulaiPetasan(); // 🎆 rayakan hasil dengan animasi petasan
}

/* ============ 11. ANIMASI PETASAN (FIREWORKS) ============ */
// Warna petasan: paduan tema biru + aksen emas & pink agar meriah
const WARNA_PETASAN = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#0ea5e9", "#6366f1", "#fbbf24", "#ffffff", "#f472b6"];
let petasanPartikel = []; // partikel yang sedang meledak / berjatuhan
let petasanAktif = false; // status animasi berjalan

// Membuat satu partikel petasan
function buatPartikelPetasan(x, y, warna) {
  const sudut = Math.random() * Math.PI * 2;
  const kecepatan = 2.5 + Math.random() * 6;
  return {
    x, y,
    vx: Math.cos(sudut) * kecepatan,   // kecepatan sumbu x
    vy: Math.sin(sudut) * kecepatan,   // kecepatan sumbu y
    gravitasi: 0.05,                   // tarikan gravitasi (jatuh ke bawah)
    gesekan: 0.985,                    // memperlambat partikel
    ukuran: 2 + Math.random() * 4,
    warna,
    alpha: 1,
    pudar: 0.008 + Math.random() * 0.014, // kecepatan memudar
    rotasi: Math.random() * Math.PI * 2,
    putaran: Math.random() * 0.2 - 0.1,   // kecepatan berputar
    bentuk: Math.random() < 0.6 ? "kotak" : "bulat",
  };
}

// Meledakkan petasan di satu titik (menghasilkan banyak partikel)
function ledakanPetasan(x, y, jumlah) {
  for (let i = 0; i < jumlah; i++) {
    petasanPartikel.push(
      buatPartikelPetasan(x, y, WARNA_PETASAN[Math.floor(Math.random() * WARNA_PETASAN.length)])
    );
  }
}

// Menggambar semua partikel pada satu frame
function gambarPetasan(ctx) {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  petasanPartikel.forEach((p) => {
    // Fisika partikel: gesekan, gravitasi, lalu geser posisi
    p.vx *= p.gesekan;
    p.vy = p.vy * p.gesekan + p.gravitasi;
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= p.pudar;
    p.rotasi += p.putaran;

    if (p.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.min(p.alpha, 1);
    ctx.fillStyle = p.warna;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotasi);
    if (p.bentuk === "kotak") {
      ctx.fillRect(-p.ukuran / 2, -p.ukuran / 2, p.ukuran, p.ukuran * 1.5);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, p.ukuran / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });
  petasanPartikel = petasanPartikel.filter((p) => p.alpha > 0);
}

// Memulai animasi petasan (dipanggil saat hasil ditampilkan)
function mulaiPetasan() {
  const canvas = el.canvasPetasan;
  if (!canvas || petasanAktif) return;
  petasanAktif = true;

  // Sesuaikan ukuran kanvas dengan layar (tajam di layar retina)
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const DURASI_MS = 4000;   // total durasi animasi (4 detik)
  const INTERVAL_MS = 280;  // jeda rata-rata antar ledakan
  const waktuMulai = performance.now();
  let ledakanBerikutnya = waktuMulai; // ledakan pertama langsung terjadi

  function loop(sekarang) {
    if (!petasanAktif) return; // dihentikan (misal kuis diulang)
    const berjalan = sekarang - waktuMulai;

    // Tembakkan petasan baru secara berkala selama animasi berjalan
    if (berjalan < DURASI_MS && sekarang >= ledakanBerikutnya) {
      const jumlah = 50 + Math.floor(Math.random() * 40);
      const x = 60 + Math.random() * (window.innerWidth - 120);
      const y = 80 + Math.random() * (window.innerHeight * 0.5);
      ledakanPetasan(x, y, jumlah);
      ledakanBerikutnya = sekarang + INTERVAL_MS + Math.random() * 150;
    }

    gambarPetasan(ctx);

    if (berjalan < DURASI_MS || petasanPartikel.length > 0) {
      requestAnimationFrame(loop);
    } else {
      petasanAktif = false;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }

  requestAnimationFrame(loop);
}

// Menghentikan animasi petasan (dipanggil saat kuis diulang / kembali)
function hentikanPetasan() {
  petasanAktif = false;
  petasanPartikel = [];
  const canvas = el.canvasPetasan;
  if (canvas) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

/* ============ 10. INISIALISASI ============ */
el.btnMulai.addEventListener("click", mulaiKuis);
el.btnUlangi.addEventListener("click", mulaiKuis);
el.btnKembali.addEventListener("click", kembaliKeAwal);

/* ============================================================================
   QUIZ MINAT PRODI — script.js
   ----------------------------------------------------------------------------
   Kuis prediksi minat jurusan:
   - 120 bank soal (12 fakultas x 10), 10 ditampilkan secara ADAPTIF/mengerucut.
   - 104 program studi dikelompokkan ke 3 rumpun:
       r1 = Saintek, Kesehatan & Agro
       r2 = Soshum & Bisnis
       r3 = Seni & Budaya
   - Data funfact tiap prodi (INFO_PRODI) dari Buku "Fun Fact Unesa 2025".
   - Tanpa database; semua data tersimpan di file ini.

   ============================================================================
   PANDUAN MEMPERBARUI BANK SOAL & PRODI
   ----------------------------------------------------------------------------
   1) MENAMBAH / MENGUBAH SOAL  →  edit array SOAL_BANK di bawah.
      Setiap soal butuh 5 field:
        id        : nomor urut unik (boleh asal tidak sama).
        teks      : kalimat pertanyaan.
        rumpun    : kode rumpun utama soal ("r1", "r2", atau "r3").
        ringkas   : label singkat minat (dipakai untuk alasan "mengapa cocok").
        tags      : kata kunci sub-bidang (dipisah spasi).
        kataKunci : daftar kata kunci untuk scoring matrix — dicocokkan
                    dengan teks funfact prodi (mata kuliah, prospek, funfact).
      Contoh soal baru:
        { id: 11, teks: "Apakah kamu tertarik...?", rumpun: "r1",
          ringkas: "teknologi & data", tags: "it data",
          kataKunci: ["komputer","program","data"] }

   2) MENAMBAH / MENGUBAH PRODI  →  edit array PRODI_LIST di bawah.
      Format tiap baris: [ "Nama Prodi", "Fakultas", "Rumpun", "tags" ]
        Rumpun : "r1", "r2", atau "r3"
        tags   : kata kunci sub-bidang, dipisah spasi.
      Contoh prodi baru:
        ["Teknik Nuklir", "FT", "r1", "teknik sains"]
      CATATAN: info funfact prodi berada di objek INFO_PRODI (kunci
      "Nama Prodi|FAKULTAS"). Jika prodi baru belum ada di INFO_PRODI,
      hasil akan otomatis memakai teks cadangan (fallback).

      DAFTAR TAG yang dipakai saat ini:
        it, data, sains, teknik, kesehatan, olahraga, bisnis, akuntansi,
        hukum, sosial, hi, komunikasi, bahasa, psikologi, pendidikan,
        agro, pangan, kuliner, busana, rias, seni, desain, film,
        musik, budaya, pariwisata

   3) MENGUBAH JUMLAH SOAL  →  ubah nilai jumlahSoal di objek KONFIGURASI.
   ========================================================================== */

/* ============ 1. KONFIGURASI UMUM ============ */
const KONFIGURASI = {
  jumlahSoal: 10,         // berapa soal yang ditampilkan (dipilih ADAPTIF / mengerucut)
  durasiAnalisisMs: 1600, // lama animasi "menganalisis" sebelum hasil tampil
  bobotTag: 3,            // pengali skor untuk prodi yang tag-nya cocok dengan soal
  opsiJawaban: [          // pilihan jawaban: 5 skala sesuai/tidak sesuai
    { label: "Sangat Sesuai",      skor: 2 },
    { label: "Sesuai",              skor: 1 },
    { label: "Netral",              skor: 0 },
    { label: "Tidak Sesuai",        skor: -1 },
    { label: "Sangat Tidak Sesuai", skor: -2 },
  ],
};

/* ============ 2. RUMPUN PRODI ============ */
const RUMPUN = {
  r1: { nama: "Saintek, Kesehatan & Agro" },
  r2: { nama: "Soshum & Bisnis" },
  r3: { nama: "Seni & Budaya" },
};

/* ============ 3. BANK SOAL (10 SOAL) ============ */
const SOAL_BANK = [
  {
    id: 1, kat: "FBS", rumpun: "r3", tags: "seni desain film musik bahasa budaya",
    ringkas: "seni, bahasa & budaya (FBS)",
    teks: "Apakah kamu suka menggambar atau melukis di waktu senggang?",
    kataKunci: ["seni", "desain", "musik", "menggambar", "melukis", "film", "animasi", "tari", "teater", "drama", "fotografi", "ilustrasi", "grafis", "kreatif", "budaya", "gamelan", "wayang", "lukisan", "karya", "visual", "bahasa", "sastra", "jawa", "guru", "pendidikan", "alat musik", "piano", "menyanyi", "kriya", "mural", "pentas", "vokal", "rupa"],
  },
  {
    id: 2, kat: "FBS", rumpun: "r3", tags: "seni desain film musik bahasa budaya",
    ringkas: "seni, bahasa & budaya (FBS)",
    teks: "Apakah kamu tertarik membuat desain visual seperti poster, logo, atau kemasan produk?",
    kataKunci: ["seni", "desain", "musik", "menggambar", "melukis", "film", "animasi", "tari", "teater", "drama", "fotografi", "ilustrasi", "grafis", "kreatif", "budaya", "gamelan", "wayang", "lukisan", "karya", "visual", "bahasa", "sastra", "jawa", "guru", "pendidikan", "alat musik", "piano", "menyanyi", "kriya", "mural", "pentas", "vokal", "rupa"],
  },
  {
    id: 3, kat: "FBS", rumpun: "r3", tags: "seni desain film musik bahasa budaya",
    ringkas: "seni, bahasa & budaya (FBS)",
    teks: "Apakah kamu suka menonton film dan penasaran bagaimana film atau animasi dibuat?",
    kataKunci: ["seni", "desain", "musik", "menggambar", "melukis", "film", "animasi", "tari", "teater", "drama", "fotografi", "ilustrasi", "grafis", "kreatif", "budaya", "gamelan", "wayang", "lukisan", "karya", "visual", "bahasa", "sastra", "jawa", "guru", "pendidikan", "alat musik", "piano", "menyanyi", "kriya", "mural", "pentas", "vokal", "rupa"],
  },
  {
    id: 4, kat: "FBS", rumpun: "r3", tags: "seni desain film musik bahasa budaya",
    ringkas: "seni, bahasa & budaya (FBS)",
    teks: "Apakah kamu senang bermain alat musik atau bernyanyi?",
    kataKunci: ["seni", "desain", "musik", "menggambar", "melukis", "film", "animasi", "tari", "teater", "drama", "fotografi", "ilustrasi", "grafis", "kreatif", "budaya", "gamelan", "wayang", "lukisan", "karya", "visual", "bahasa", "sastra", "jawa", "guru", "pendidikan", "alat musik", "piano", "menyanyi", "kriya", "mural", "pentas", "vokal", "rupa"],
  },
  {
    id: 5, kat: "FBS", rumpun: "r3", tags: "seni desain film musik bahasa budaya",
    ringkas: "seni, bahasa & budaya (FBS)",
    teks: "Apakah kamu tertarik berlatih menari, berakting, atau bermain teater?",
    kataKunci: ["seni", "desain", "musik", "menggambar", "melukis", "film", "animasi", "tari", "teater", "drama", "fotografi", "ilustrasi", "grafis", "kreatif", "budaya", "gamelan", "wayang", "lukisan", "karya", "visual", "bahasa", "sastra", "jawa", "guru", "pendidikan", "alat musik", "piano", "menyanyi", "kriya", "mural", "pentas", "vokal", "rupa"],
  },
  {
    id: 6, kat: "FBS", rumpun: "r3", tags: "seni desain film musik bahasa budaya",
    ringkas: "seni, bahasa & budaya (FBS)",
    teks: "Apakah kamu suka mempelajari bahasa asing dan ingin lancar berkomunikasi dengannya?",
    kataKunci: ["seni", "desain", "musik", "menggambar", "melukis", "film", "animasi", "tari", "teater", "drama", "fotografi", "ilustrasi", "grafis", "kreatif", "budaya", "gamelan", "wayang", "lukisan", "karya", "visual", "bahasa", "sastra", "jawa", "guru", "pendidikan", "alat musik", "piano", "menyanyi", "kriya", "mural", "pentas", "vokal", "rupa"],
  },
  {
    id: 7, kat: "FBS", rumpun: "r3", tags: "seni desain film musik bahasa budaya",
    ringkas: "seni, bahasa & budaya (FBS)",
    teks: "Apakah kamu tertarik menulis karya sastra seperti cerpen, puisi, atau novel?",
    kataKunci: ["seni", "desain", "musik", "menggambar", "melukis", "film", "animasi", "tari", "teater", "drama", "fotografi", "ilustrasi", "grafis", "kreatif", "budaya", "gamelan", "wayang", "lukisan", "karya", "visual", "bahasa", "sastra", "jawa", "guru", "pendidikan", "alat musik", "piano", "menyanyi", "kriya", "mural", "pentas", "vokal", "rupa"],
  },
  {
    id: 8, kat: "FBS", rumpun: "r3", tags: "seni desain film musik bahasa budaya",
    ringkas: "seni, bahasa & budaya (FBS)",
    teks: "Apakah kamu suka mempelajari budaya dan bahasa daerah, misalnya bahasa Jawa?",
    kataKunci: ["seni", "desain", "musik", "menggambar", "melukis", "film", "animasi", "tari", "teater", "drama", "fotografi", "ilustrasi", "grafis", "kreatif", "budaya", "gamelan", "wayang", "lukisan", "karya", "visual", "bahasa", "sastra", "jawa", "guru", "pendidikan", "alat musik", "piano", "menyanyi", "kriya", "mural", "pentas", "vokal", "rupa"],
  },
  {
    id: 9, kat: "FBS", rumpun: "r3", tags: "seni desain film musik bahasa budaya",
    ringkas: "seni, bahasa & budaya (FBS)",
    teks: "Apakah kamu tertarik menjadi guru bahasa atau seni di sekolah?",
    kataKunci: ["seni", "desain", "musik", "menggambar", "melukis", "film", "animasi", "tari", "teater", "drama", "fotografi", "ilustrasi", "grafis", "kreatif", "budaya", "gamelan", "wayang", "lukisan", "karya", "visual", "bahasa", "sastra", "jawa", "guru", "pendidikan", "alat musik", "piano", "menyanyi", "kriya", "mural", "pentas", "vokal", "rupa"],
  },
  {
    id: 10, kat: "FBS", rumpun: "r3", tags: "seni desain film musik bahasa budaya",
    ringkas: "seni, bahasa & budaya (FBS)",
    teks: "Apakah kamu senang mengabadikan momen lewat fotografi atau videografi?",
    kataKunci: ["seni", "desain", "musik", "menggambar", "melukis", "film", "animasi", "tari", "teater", "drama", "fotografi", "ilustrasi", "grafis", "kreatif", "budaya", "gamelan", "wayang", "lukisan", "karya", "visual", "bahasa", "sastra", "jawa", "guru", "pendidikan", "alat musik", "piano", "menyanyi", "kriya", "mural", "pentas", "vokal", "rupa"],
  },
  {
    id: 11, kat: "FEB", rumpun: "r2", tags: "bisnis akuntansi",
    ringkas: "bisnis, keuangan & ekonomi (FEB)",
    teks: "Apakah kamu suka mengelola uang tabunganmu dengan rapi dan teliti?",
    kataKunci: ["bisnis", "ekonomi", "manajemen", "akuntansi", "keuangan", "wirausaha", "pasar", "pemasaran", "audit", "pajak", "perbankan", "startup", "usaha", "laba", "investasi", "modal", "penjualan", "perusahaan", "harga", "konsumen", "syariah", "zakat", "wakaf", "keuntungan", "uang"],
  },
  {
    id: 12, kat: "FEB", rumpun: "r2", tags: "bisnis akuntansi",
    ringkas: "bisnis, keuangan & ekonomi (FEB)",
    teks: "Apakah kamu tertarik memulai usaha atau bisnis sendiri?",
    kataKunci: ["bisnis", "ekonomi", "manajemen", "akuntansi", "keuangan", "wirausaha", "pasar", "pemasaran", "audit", "pajak", "perbankan", "startup", "usaha", "laba", "investasi", "modal", "penjualan", "perusahaan", "harga", "konsumen", "syariah", "zakat", "wakaf", "keuntungan", "uang"],
  },
  {
    id: 13, kat: "FEB", rumpun: "r2", tags: "bisnis akuntansi",
    ringkas: "bisnis, keuangan & ekonomi (FEB)",
    teks: "Apakah kamu suka menghitung keuntungan dan kerugian sebuah usaha?",
    kataKunci: ["bisnis", "ekonomi", "manajemen", "akuntansi", "keuangan", "wirausaha", "pasar", "pemasaran", "audit", "pajak", "perbankan", "startup", "usaha", "laba", "investasi", "modal", "penjualan", "perusahaan", "harga", "konsumen", "syariah", "zakat", "wakaf", "keuntungan", "uang"],
  },
  {
    id: 14, kat: "FEB", rumpun: "r2", tags: "bisnis akuntansi",
    ringkas: "bisnis, keuangan & ekonomi (FEB)",
    teks: "Apakah kamu tertarik memahami cara kerja bank dan dunia keuangan?",
    kataKunci: ["bisnis", "ekonomi", "manajemen", "akuntansi", "keuangan", "wirausaha", "pasar", "pemasaran", "audit", "pajak", "perbankan", "startup", "usaha", "laba", "investasi", "modal", "penjualan", "perusahaan", "harga", "konsumen", "syariah", "zakat", "wakaf", "keuntungan", "uang"],
  },
  {
    id: 15, kat: "FEB", rumpun: "r2", tags: "bisnis akuntansi",
    ringkas: "bisnis, keuangan & ekonomi (FEB)",
    teks: "Apakah kamu suka mengamati tren pasar dan perilaku pembeli?",
    kataKunci: ["bisnis", "ekonomi", "manajemen", "akuntansi", "keuangan", "wirausaha", "pasar", "pemasaran", "audit", "pajak", "perbankan", "startup", "usaha", "laba", "investasi", "modal", "penjualan", "perusahaan", "harga", "konsumen", "syariah", "zakat", "wakaf", "keuntungan", "uang"],
  },
  {
    id: 16, kat: "FEB", rumpun: "r2", tags: "bisnis akuntansi",
    ringkas: "bisnis, keuangan & ekonomi (FEB)",
    teks: "Apakah kamu membayangkan dirimu menjadi manajer atau pemimpin perusahaan?",
    kataKunci: ["bisnis", "ekonomi", "manajemen", "akuntansi", "keuangan", "wirausaha", "pasar", "pemasaran", "audit", "pajak", "perbankan", "startup", "usaha", "laba", "investasi", "modal", "penjualan", "perusahaan", "harga", "konsumen", "syariah", "zakat", "wakaf", "keuntungan", "uang"],
  },
  {
    id: 17, kat: "FEB", rumpun: "r2", tags: "bisnis akuntansi",
    ringkas: "bisnis, keuangan & ekonomi (FEB)",
    teks: "Apakah kamu tertarik menjadi akuntan, auditor, atau konsultan pajak?",
    kataKunci: ["bisnis", "ekonomi", "manajemen", "akuntansi", "keuangan", "wirausaha", "pasar", "pemasaran", "audit", "pajak", "perbankan", "startup", "usaha", "laba", "investasi", "modal", "penjualan", "perusahaan", "harga", "konsumen", "syariah", "zakat", "wakaf", "keuntungan", "uang"],
  },
  {
    id: 18, kat: "FEB", rumpun: "r2", tags: "bisnis akuntansi",
    ringkas: "bisnis, keuangan & ekonomi (FEB)",
    teks: "Apakah kamu suka mencari ide kreatif untuk berjualan online atau bisnis digital?",
    kataKunci: ["bisnis", "ekonomi", "manajemen", "akuntansi", "keuangan", "wirausaha", "pasar", "pemasaran", "audit", "pajak", "perbankan", "startup", "usaha", "laba", "investasi", "modal", "penjualan", "perusahaan", "harga", "konsumen", "syariah", "zakat", "wakaf", "keuntungan", "uang"],
  },
  {
    id: 19, kat: "FEB", rumpun: "r2", tags: "bisnis akuntansi",
    ringkas: "bisnis, keuangan & ekonomi (FEB)",
    teks: "Apakah kamu tertarik memahami ekonomi syariah seperti zakat dan wakaf?",
    kataKunci: ["bisnis", "ekonomi", "manajemen", "akuntansi", "keuangan", "wirausaha", "pasar", "pemasaran", "audit", "pajak", "perbankan", "startup", "usaha", "laba", "investasi", "modal", "penjualan", "perusahaan", "harga", "konsumen", "syariah", "zakat", "wakaf", "keuntungan", "uang"],
  },
  {
    id: 20, kat: "FEB", rumpun: "r2", tags: "bisnis akuntansi",
    ringkas: "bisnis, keuangan & ekonomi (FEB)",
    teks: "Apakah kamu suka berdiskusi tentang peluang investasi dan perkembangan ekonomi?",
    kataKunci: ["bisnis", "ekonomi", "manajemen", "akuntansi", "keuangan", "wirausaha", "pasar", "pemasaran", "audit", "pajak", "perbankan", "startup", "usaha", "laba", "investasi", "modal", "penjualan", "perusahaan", "harga", "konsumen", "syariah", "zakat", "wakaf", "keuntungan", "uang"],
  },
  {
    id: 21, kat: "FH", rumpun: "r2", tags: "hukum",
    ringkas: "hukum & keadilan (FH)",
    teks: "Apakah kamu tertarik mempelajari hukum dan keadilan?",
    kataKunci: ["hukum", "keadilan", "debat", "pengacara", "advokat", "kasus", "kewarganegaraan", "penegakan hukum", "pajak", "perundangan", "mediator", "undang", "peraturan", "legal", "pengadilan", "persidangan", "pidana", "perdata", "konsultasi"],
  },
  {
    id: 22, kat: "FH", rumpun: "r2", tags: "hukum",
    ringkas: "hukum & keadilan (FH)",
    teks: "Apakah kamu suka berdebat dan mempertahankan argumenmu?",
    kataKunci: ["hukum", "keadilan", "debat", "pengacara", "advokat", "kasus", "kewarganegaraan", "penegakan hukum", "pajak", "perundangan", "mediator", "undang", "peraturan", "legal", "pengadilan", "persidangan", "pidana", "perdata", "konsultasi"],
  },
  {
    id: 23, kat: "FH", rumpun: "r2", tags: "hukum",
    ringkas: "hukum & keadilan (FH)",
    teks: "Apakah kamu tertarik menjadi pengacara atau advokat?",
    kataKunci: ["hukum", "keadilan", "debat", "pengacara", "advokat", "kasus", "kewarganegaraan", "penegakan hukum", "pajak", "perundangan", "mediator", "undang", "peraturan", "legal", "pengadilan", "persidangan", "pidana", "perdata", "konsultasi"],
  },
  {
    id: 24, kat: "FH", rumpun: "r2", tags: "hukum",
    ringkas: "hukum & keadilan (FH)",
    teks: "Apakah kamu suka membaca kasus-kasus hukum dan menganalisisnya?",
    kataKunci: ["hukum", "keadilan", "debat", "pengacara", "advokat", "kasus", "kewarganegaraan", "penegakan hukum", "pajak", "perundangan", "mediator", "undang", "peraturan", "legal", "pengadilan", "persidangan", "pidana", "perdata", "konsultasi"],
  },
  {
    id: 25, kat: "FH", rumpun: "r2", tags: "hukum",
    ringkas: "hukum & keadilan (FH)",
    teks: "Apakah kamu tertarik memahami hak dan kewajiban warga negara?",
    kataKunci: ["hukum", "keadilan", "debat", "pengacara", "advokat", "kasus", "kewarganegaraan", "penegakan hukum", "pajak", "perundangan", "mediator", "undang", "peraturan", "legal", "pengadilan", "persidangan", "pidana", "perdata", "konsultasi"],
  },
  {
    id: 26, kat: "FH", rumpun: "r2", tags: "hukum",
    ringkas: "hukum & keadilan (FH)",
    teks: "Apakah kamu membayangkan dirimu bekerja di bidang penegakan hukum?",
    kataKunci: ["hukum", "keadilan", "debat", "pengacara", "advokat", "kasus", "kewarganegaraan", "penegakan hukum", "pajak", "perundangan", "mediator", "undang", "peraturan", "legal", "pengadilan", "persidangan", "pidana", "perdata", "konsultasi"],
  },
  {
    id: 27, kat: "FH", rumpun: "r2", tags: "hukum",
    ringkas: "hukum & keadilan (FH)",
    teks: "Apakah kamu tertarik mempelajari hukum pajak dan perpajakan?",
    kataKunci: ["hukum", "keadilan", "debat", "pengacara", "advokat", "kasus", "kewarganegaraan", "penegakan hukum", "pajak", "perundangan", "mediator", "undang", "peraturan", "legal", "pengadilan", "persidangan", "pidana", "perdata", "konsultasi"],
  },
  {
    id: 28, kat: "FH", rumpun: "r2", tags: "hukum",
    ringkas: "hukum & keadilan (FH)",
    teks: "Apakah kamu suka memperjuangkan keadilan untuk orang lain?",
    kataKunci: ["hukum", "keadilan", "debat", "pengacara", "advokat", "kasus", "kewarganegaraan", "penegakan hukum", "pajak", "perundangan", "mediator", "undang", "peraturan", "legal", "pengadilan", "persidangan", "pidana", "perdata", "konsultasi"],
  },
  {
    id: 29, kat: "FH", rumpun: "r2", tags: "hukum",
    ringkas: "hukum & keadilan (FH)",
    teks: "Apakah kamu tertarik menjadi mediator atau penengah konflik?",
    kataKunci: ["hukum", "keadilan", "debat", "pengacara", "advokat", "kasus", "kewarganegaraan", "penegakan hukum", "pajak", "perundangan", "mediator", "undang", "peraturan", "legal", "pengadilan", "persidangan", "pidana", "perdata", "konsultasi"],
  },
  {
    id: 30, kat: "FH", rumpun: "r2", tags: "hukum",
    ringkas: "hukum & keadilan (FH)",
    teks: "Apakah kamu suka membaca peraturan dan undang-undang?",
    kataKunci: ["hukum", "keadilan", "debat", "pengacara", "advokat", "kasus", "kewarganegaraan", "penegakan hukum", "pajak", "perundangan", "mediator", "undang", "peraturan", "legal", "pengadilan", "persidangan", "pidana", "perdata", "konsultasi"],
  },
  {
    id: 31, kat: "FIKK", rumpun: "r1", tags: "olahraga kesehatan",
    ringkas: "olahraga & kesehatan (FIKK)",
    teks: "Apakah kamu suka berolahraga secara rutin dan menjaga kebugaran?",
    kataKunci: ["olahraga", "kebugaran", "jasmani", "latihan", "atlet", "pelatih", "fitness", "gym", "prestasi", "fisik", "strength", "conditioning", "kepelatihan", "cabor", "pertandingan", "rekreasi", "event", "gizi", "masase", "performa", "daya tahan", "kecepatan", "pemandu", "terapi"],
  },
  {
    id: 32, kat: "FIKK", rumpun: "r1", tags: "olahraga kesehatan",
    ringkas: "olahraga & kesehatan (FIKK)",
    teks: "Apakah kamu tertarik menjadi pelatih atau pembina atlet?",
    kataKunci: ["olahraga", "kebugaran", "jasmani", "latihan", "atlet", "pelatih", "fitness", "gym", "prestasi", "fisik", "strength", "conditioning", "kepelatihan", "cabor", "pertandingan", "rekreasi", "event", "gizi", "masase", "performa", "daya tahan", "kecepatan", "pemandu", "terapi"],
  },
  {
    id: 33, kat: "FIKK", rumpun: "r1", tags: "olahraga kesehatan",
    ringkas: "olahraga & kesehatan (FIKK)",
    teks: "Apakah kamu senang mengikuti pertandingan atau kejuaraan olahraga?",
    kataKunci: ["olahraga", "kebugaran", "jasmani", "latihan", "atlet", "pelatih", "fitness", "gym", "prestasi", "fisik", "strength", "conditioning", "kepelatihan", "cabor", "pertandingan", "rekreasi", "event", "gizi", "masase", "performa", "daya tahan", "kecepatan", "pemandu", "terapi"],
  },
  {
    id: 34, kat: "FIKK", rumpun: "r1", tags: "olahraga kesehatan",
    ringkas: "olahraga & kesehatan (FIKK)",
    teks: "Apakah kamu tertarik memahami cara melatih kekuatan dan daya tahan tubuh?",
    kataKunci: ["olahraga", "kebugaran", "jasmani", "latihan", "atlet", "pelatih", "fitness", "gym", "prestasi", "fisik", "strength", "conditioning", "kepelatihan", "cabor", "pertandingan", "rekreasi", "event", "gizi", "masase", "performa", "daya tahan", "kecepatan", "pemandu", "terapi"],
  },
  {
    id: 35, kat: "FIKK", rumpun: "r1", tags: "olahraga kesehatan",
    ringkas: "olahraga & kesehatan (FIKK)",
    teks: "Apakah kamu tertarik menjadi guru pendidikan jasmani dan kesehatan?",
    kataKunci: ["olahraga", "kebugaran", "jasmani", "latihan", "atlet", "pelatih", "fitness", "gym", "prestasi", "fisik", "strength", "conditioning", "kepelatihan", "cabor", "pertandingan", "rekreasi", "event", "gizi", "masase", "performa", "daya tahan", "kecepatan", "pemandu", "terapi"],
  },
  {
    id: 36, kat: "FIKK", rumpun: "r1", tags: "olahraga kesehatan",
    ringkas: "olahraga & kesehatan (FIKK)",
    teks: "Apakah kamu membayangkan dirimu menjadi manajer klub atau penyelenggara event olahraga?",
    kataKunci: ["olahraga", "kebugaran", "jasmani", "latihan", "atlet", "pelatih", "fitness", "gym", "prestasi", "fisik", "strength", "conditioning", "kepelatihan", "cabor", "pertandingan", "rekreasi", "event", "gizi", "masase", "performa", "daya tahan", "kecepatan", "pemandu", "terapi"],
  },
  {
    id: 37, kat: "FIKK", rumpun: "r1", tags: "olahraga kesehatan",
    ringkas: "olahraga & kesehatan (FIKK)",
    teks: "Apakah kamu tertarik mempelajari gizi dan makanan sehat untuk atlet?",
    kataKunci: ["olahraga", "kebugaran", "jasmani", "latihan", "atlet", "pelatih", "fitness", "gym", "prestasi", "fisik", "strength", "conditioning", "kepelatihan", "cabor", "pertandingan", "rekreasi", "event", "gizi", "masase", "performa", "daya tahan", "kecepatan", "pemandu", "terapi"],
  },
  {
    id: 38, kat: "FIKK", rumpun: "r1", tags: "olahraga kesehatan",
    ringkas: "olahraga & kesehatan (FIKK)",
    teks: "Apakah kamu tertarik menjadi pemandu kebugaran atau terapis pemulihan (masase)?",
    kataKunci: ["olahraga", "kebugaran", "jasmani", "latihan", "atlet", "pelatih", "fitness", "gym", "prestasi", "fisik", "strength", "conditioning", "kepelatihan", "cabor", "pertandingan", "rekreasi", "event", "gizi", "masase", "performa", "daya tahan", "kecepatan", "pemandu", "terapi"],
  },
  {
    id: 39, kat: "FIKK", rumpun: "r1", tags: "olahraga kesehatan",
    ringkas: "olahraga & kesehatan (FIKK)",
    teks: "Apakah kamu suka menganalisis performa atlet dan menyusun program latihan?",
    kataKunci: ["olahraga", "kebugaran", "jasmani", "latihan", "atlet", "pelatih", "fitness", "gym", "prestasi", "fisik", "strength", "conditioning", "kepelatihan", "cabor", "pertandingan", "rekreasi", "event", "gizi", "masase", "performa", "daya tahan", "kecepatan", "pemandu", "terapi"],
  },
  {
    id: 40, kat: "FIKK", rumpun: "r1", tags: "olahraga kesehatan",
    ringkas: "olahraga & kesehatan (FIKK)",
    teks: "Apakah kamu suka mengajak orang lain hidup aktif dan sehat?",
    kataKunci: ["olahraga", "kebugaran", "jasmani", "latihan", "atlet", "pelatih", "fitness", "gym", "prestasi", "fisik", "strength", "conditioning", "kepelatihan", "cabor", "pertandingan", "rekreasi", "event", "gizi", "masase", "performa", "daya tahan", "kecepatan", "pemandu", "terapi"],
  },
  {
    id: 41, kat: "FIP", rumpun: "r2", tags: "pendidikan",
    ringkas: "pendidikan & mengajar (FIP)",
    teks: "Apakah kamu tertarik menjadi guru atau pendidik suatu hari nanti?",
    kataKunci: ["guru", "pendidikan", "mengajar", "siswa", "sekolah", "paud", "anak", "dosen", "bimbingan", "konseling", "media pembelajaran", "kurikulum", "belajar", "pembelajaran", "berkebutuhan khusus", "slb", "manajemen pendidikan", "luar sekolah", "kampus", "pedagogi", "murid", "mendidik"],
  },
  {
    id: 42, kat: "FIP", rumpun: "r2", tags: "pendidikan",
    ringkas: "pendidikan & mengajar (FIP)",
    teks: "Apakah kamu suka mendampingi anak usia dini belajar dan bermain?",
    kataKunci: ["guru", "pendidikan", "mengajar", "siswa", "sekolah", "paud", "anak", "dosen", "bimbingan", "konseling", "media pembelajaran", "kurikulum", "belajar", "pembelajaran", "berkebutuhan khusus", "slb", "manajemen pendidikan", "luar sekolah", "kampus", "pedagogi", "murid", "mendidik"],
  },
  {
    id: 43, kat: "FIP", rumpun: "r2", tags: "pendidikan",
    ringkas: "pendidikan & mengajar (FIP)",
    teks: "Apakah kamu tertarik mengajar di sekolah dasar?",
    kataKunci: ["guru", "pendidikan", "mengajar", "siswa", "sekolah", "paud", "anak", "dosen", "bimbingan", "konseling", "media pembelajaran", "kurikulum", "belajar", "pembelajaran", "berkebutuhan khusus", "slb", "manajemen pendidikan", "luar sekolah", "kampus", "pedagogi", "murid", "mendidik"],
  },
  {
    id: 44, kat: "FIP", rumpun: "r2", tags: "pendidikan",
    ringkas: "pendidikan & mengajar (FIP)",
    teks: "Apakah kamu suka membantu anak berkebutuhan khusus agar bisa mandiri?",
    kataKunci: ["guru", "pendidikan", "mengajar", "siswa", "sekolah", "paud", "anak", "dosen", "bimbingan", "konseling", "media pembelajaran", "kurikulum", "belajar", "pembelajaran", "berkebutuhan khusus", "slb", "manajemen pendidikan", "luar sekolah", "kampus", "pedagogi", "murid", "mendidik"],
  },
  {
    id: 45, kat: "FIP", rumpun: "r2", tags: "pendidikan",
    ringkas: "pendidikan & mengajar (FIP)",
    teks: "Apakah kamu tertarik mengelola program dan administrasi di lembaga pendidikan?",
    kataKunci: ["guru", "pendidikan", "mengajar", "siswa", "sekolah", "paud", "anak", "dosen", "bimbingan", "konseling", "media pembelajaran", "kurikulum", "belajar", "pembelajaran", "berkebutuhan khusus", "slb", "manajemen pendidikan", "luar sekolah", "kampus", "pedagogi", "murid", "mendidik"],
  },
  {
    id: 46, kat: "FIP", rumpun: "r2", tags: "pendidikan",
    ringkas: "pendidikan & mengajar (FIP)",
    teks: "Apakah kamu suka membuat media pembelajaran yang menarik, seperti video atau permainan edukasi?",
    kataKunci: ["guru", "pendidikan", "mengajar", "siswa", "sekolah", "paud", "anak", "dosen", "bimbingan", "konseling", "media pembelajaran", "kurikulum", "belajar", "pembelajaran", "berkebutuhan khusus", "slb", "manajemen pendidikan", "luar sekolah", "kampus", "pedagogi", "murid", "mendidik"],
  },
  {
    id: 47, kat: "FIP", rumpun: "r2", tags: "pendidikan",
    ringkas: "pendidikan & mengajar (FIP)",
    teks: "Apakah kamu tertarik menjadi guru bimbingan dan konseling?",
    kataKunci: ["guru", "pendidikan", "mengajar", "siswa", "sekolah", "paud", "anak", "dosen", "bimbingan", "konseling", "media pembelajaran", "kurikulum", "belajar", "pembelajaran", "berkebutuhan khusus", "slb", "manajemen pendidikan", "luar sekolah", "kampus", "pedagogi", "murid", "mendidik"],
  },
  {
    id: 48, kat: "FIP", rumpun: "r2", tags: "pendidikan",
    ringkas: "pendidikan & mengajar (FIP)",
    teks: "Apakah kamu suka mempelajari cara orang belajar dengan baik?",
    kataKunci: ["guru", "pendidikan", "mengajar", "siswa", "sekolah", "paud", "anak", "dosen", "bimbingan", "konseling", "media pembelajaran", "kurikulum", "belajar", "pembelajaran", "berkebutuhan khusus", "slb", "manajemen pendidikan", "luar sekolah", "kampus", "pedagogi", "murid", "mendidik"],
  },
  {
    id: 49, kat: "FIP", rumpun: "r2", tags: "pendidikan",
    ringkas: "pendidikan & mengajar (FIP)",
    teks: "Apakah kamu tertarik mendampingi pendidikan di luar sekolah dan masyarakat?",
    kataKunci: ["guru", "pendidikan", "mengajar", "siswa", "sekolah", "paud", "anak", "dosen", "bimbingan", "konseling", "media pembelajaran", "kurikulum", "belajar", "pembelajaran", "berkebutuhan khusus", "slb", "manajemen pendidikan", "luar sekolah", "kampus", "pedagogi", "murid", "mendidik"],
  },
  {
    id: 50, kat: "FIP", rumpun: "r2", tags: "pendidikan",
    ringkas: "pendidikan & mengajar (FIP)",
    teks: "Apakah kamu membayangkan dirimu menjadi dosen yang mengajar di kampus?",
    kataKunci: ["guru", "pendidikan", "mengajar", "siswa", "sekolah", "paud", "anak", "dosen", "bimbingan", "konseling", "media pembelajaran", "kurikulum", "belajar", "pembelajaran", "berkebutuhan khusus", "slb", "manajemen pendidikan", "luar sekolah", "kampus", "pedagogi", "murid", "mendidik"],
  },
  {
    id: 51, kat: "FISIPOL", rumpun: "r2", tags: "sosial hukum hi",
    ringkas: "sosial, politik & pemerintahan (FISIPOL)",
    teks: "Apakah kamu suka mengikuti berita dan isu-isu sosial terkini?",
    kataKunci: ["sosial", "masyarakat", "politik", "pemerintahan", "internasional", "diplomasi", "komunikasi", "media", "sejarah", "sosiologi", "administrasi", "negara", "geografi", "lingkungan", "ips", "berita", "debat", "kebijakan", "publik", "kewarganegaraan", "hubungan internasional", "isu"],
  },
  {
    id: 52, kat: "FISIPOL", rumpun: "r2", tags: "sosial hukum hi",
    ringkas: "sosial, politik & pemerintahan (FISIPOL)",
    teks: "Apakah kamu tertarik memahami cara kerja pemerintahan dan negara?",
    kataKunci: ["sosial", "masyarakat", "politik", "pemerintahan", "internasional", "diplomasi", "komunikasi", "media", "sejarah", "sosiologi", "administrasi", "negara", "geografi", "lingkungan", "ips", "berita", "debat", "kebijakan", "publik", "kewarganegaraan", "hubungan internasional", "isu"],
  },
  {
    id: 53, kat: "FISIPOL", rumpun: "r2", tags: "sosial hukum hi",
    ringkas: "sosial, politik & pemerintahan (FISIPOL)",
    teks: "Apakah kamu suka berdiskusi tentang isu politik dan kebijakan publik?",
    kataKunci: ["sosial", "masyarakat", "politik", "pemerintahan", "internasional", "diplomasi", "komunikasi", "media", "sejarah", "sosiologi", "administrasi", "negara", "geografi", "lingkungan", "ips", "berita", "debat", "kebijakan", "publik", "kewarganegaraan", "hubungan internasional", "isu"],
  },
  {
    id: 54, kat: "FISIPOL", rumpun: "r2", tags: "sosial hukum hi",
    ringkas: "sosial, politik & pemerintahan (FISIPOL)",
    teks: "Apakah kamu tertarik bekerja di hubungan internasional atau diplomasi?",
    kataKunci: ["sosial", "masyarakat", "politik", "pemerintahan", "internasional", "diplomasi", "komunikasi", "media", "sejarah", "sosiologi", "administrasi", "negara", "geografi", "lingkungan", "ips", "berita", "debat", "kebijakan", "publik", "kewarganegaraan", "hubungan internasional", "isu"],
  },
  {
    id: 55, kat: "FISIPOL", rumpun: "r2", tags: "sosial hukum hi",
    ringkas: "sosial, politik & pemerintahan (FISIPOL)",
    teks: "Apakah kamu suka berkomunikasi dan tertarik dengan dunia media?",
    kataKunci: ["sosial", "masyarakat", "politik", "pemerintahan", "internasional", "diplomasi", "komunikasi", "media", "sejarah", "sosiologi", "administrasi", "negara", "geografi", "lingkungan", "ips", "berita", "debat", "kebijakan", "publik", "kewarganegaraan", "hubungan internasional", "isu"],
  },
  {
    id: 56, kat: "FISIPOL", rumpun: "r2", tags: "sosial hukum hi",
    ringkas: "sosial, politik & pemerintahan (FISIPOL)",
    teks: "Apakah kamu tertarik mempelajari sejarah dan perjuangan bangsa?",
    kataKunci: ["sosial", "masyarakat", "politik", "pemerintahan", "internasional", "diplomasi", "komunikasi", "media", "sejarah", "sosiologi", "administrasi", "negara", "geografi", "lingkungan", "ips", "berita", "debat", "kebijakan", "publik", "kewarganegaraan", "hubungan internasional", "isu"],
  },
  {
    id: 57, kat: "FISIPOL", rumpun: "r2", tags: "sosial hukum hi",
    ringkas: "sosial, politik & pemerintahan (FISIPOL)",
    teks: "Apakah kamu suka mengamati kehidupan dan perilaku masyarakat?",
    kataKunci: ["sosial", "masyarakat", "politik", "pemerintahan", "internasional", "diplomasi", "komunikasi", "media", "sejarah", "sosiologi", "administrasi", "negara", "geografi", "lingkungan", "ips", "berita", "debat", "kebijakan", "publik", "kewarganegaraan", "hubungan internasional", "isu"],
  },
  {
    id: 58, kat: "FISIPOL", rumpun: "r2", tags: "sosial hukum hi",
    ringkas: "sosial, politik & pemerintahan (FISIPOL)",
    teks: "Apakah kamu tertarik menjadi pegawai atau pengelola administrasi negara?",
    kataKunci: ["sosial", "masyarakat", "politik", "pemerintahan", "internasional", "diplomasi", "komunikasi", "media", "sejarah", "sosiologi", "administrasi", "negara", "geografi", "lingkungan", "ips", "berita", "debat", "kebijakan", "publik", "kewarganegaraan", "hubungan internasional", "isu"],
  },
  {
    id: 59, kat: "FISIPOL", rumpun: "r2", tags: "sosial hukum hi",
    ringkas: "sosial, politik & pemerintahan (FISIPOL)",
    teks: "Apakah kamu suka mempelajari hubungan manusia dengan lingkungan dan geografi?",
    kataKunci: ["sosial", "masyarakat", "politik", "pemerintahan", "internasional", "diplomasi", "komunikasi", "media", "sejarah", "sosiologi", "administrasi", "negara", "geografi", "lingkungan", "ips", "berita", "debat", "kebijakan", "publik", "kewarganegaraan", "hubungan internasional", "isu"],
  },
  {
    id: 60, kat: "FISIPOL", rumpun: "r2", tags: "sosial hukum hi",
    ringkas: "sosial, politik & pemerintahan (FISIPOL)",
    teks: "Apakah kamu tertarik menjadi guru IPS atau Pendidikan Pancasila dan Kewarganegaraan?",
    kataKunci: ["sosial", "masyarakat", "politik", "pemerintahan", "internasional", "diplomasi", "komunikasi", "media", "sejarah", "sosiologi", "administrasi", "negara", "geografi", "lingkungan", "ips", "berita", "debat", "kebijakan", "publik", "kewarganegaraan", "hubungan internasional", "isu"],
  },
  {
    id: 61, kat: "FK", rumpun: "r1", tags: "kesehatan",
    ringkas: "kedokteran & kesehatan (FK)",
    teks: "Apakah kamu penasaran dengan cara kerja tubuh manusia?",
    kataKunci: ["kesehatan", "dokter", "kedokteran", "perawat", "keperawatan", "pasien", "sakit", "kebidanan", "ibu", "bayi", "gigi", "fisioterapi", "obat", "medis", "rumah sakit", "anatomi", "tubuh", "terapi", "klinis", "pemulihan", "kehamilan"],
  },
  {
    id: 62, kat: "FK", rumpun: "r1", tags: "kesehatan",
    ringkas: "kedokteran & kesehatan (FK)",
    teks: "Apakah kamu tertarik menjadi dokter suatu hari nanti?",
    kataKunci: ["kesehatan", "dokter", "kedokteran", "perawat", "keperawatan", "pasien", "sakit", "kebidanan", "ibu", "bayi", "gigi", "fisioterapi", "obat", "medis", "rumah sakit", "anatomi", "tubuh", "terapi", "klinis", "pemulihan", "kehamilan"],
  },
  {
    id: 63, kat: "FK", rumpun: "r1", tags: "kesehatan",
    ringkas: "kedokteran & kesehatan (FK)",
    teks: "Apakah kamu suka membantu orang yang sedang sakit?",
    kataKunci: ["kesehatan", "dokter", "kedokteran", "perawat", "keperawatan", "pasien", "sakit", "kebidanan", "ibu", "bayi", "gigi", "fisioterapi", "obat", "medis", "rumah sakit", "anatomi", "tubuh", "terapi", "klinis", "pemulihan", "kehamilan"],
  },
  {
    id: 64, kat: "FK", rumpun: "r1", tags: "kesehatan",
    ringkas: "kedokteran & kesehatan (FK)",
    teks: "Apakah kamu tertarik menjadi perawat yang merawat pasien?",
    kataKunci: ["kesehatan", "dokter", "kedokteran", "perawat", "keperawatan", "pasien", "sakit", "kebidanan", "ibu", "bayi", "gigi", "fisioterapi", "obat", "medis", "rumah sakit", "anatomi", "tubuh", "terapi", "klinis", "pemulihan", "kehamilan"],
  },
  {
    id: 65, kat: "FK", rumpun: "r1", tags: "kesehatan",
    ringkas: "kedokteran & kesehatan (FK)",
    teks: "Apakah kamu tertarik membantu ibu hamil dan merawat bayi?",
    kataKunci: ["kesehatan", "dokter", "kedokteran", "perawat", "keperawatan", "pasien", "sakit", "kebidanan", "ibu", "bayi", "gigi", "fisioterapi", "obat", "medis", "rumah sakit", "anatomi", "tubuh", "terapi", "klinis", "pemulihan", "kehamilan"],
  },
  {
    id: 66, kat: "FK", rumpun: "r1", tags: "kesehatan",
    ringkas: "kedokteran & kesehatan (FK)",
    teks: "Apakah kamu suka mempelajari kesehatan gigi dan mulut?",
    kataKunci: ["kesehatan", "dokter", "kedokteran", "perawat", "keperawatan", "pasien", "sakit", "kebidanan", "ibu", "bayi", "gigi", "fisioterapi", "obat", "medis", "rumah sakit", "anatomi", "tubuh", "terapi", "klinis", "pemulihan", "kehamilan"],
  },
  {
    id: 67, kat: "FK", rumpun: "r1", tags: "kesehatan",
    ringkas: "kedokteran & kesehatan (FK)",
    teks: "Apakah kamu tertarik menjadi fisioterapis yang membantu pemulihan pasien?",
    kataKunci: ["kesehatan", "dokter", "kedokteran", "perawat", "keperawatan", "pasien", "sakit", "kebidanan", "ibu", "bayi", "gigi", "fisioterapi", "obat", "medis", "rumah sakit", "anatomi", "tubuh", "terapi", "klinis", "pemulihan", "kehamilan"],
  },
  {
    id: 68, kat: "FK", rumpun: "r1", tags: "kesehatan",
    ringkas: "kedokteran & kesehatan (FK)",
    teks: "Apakah kamu suka mempelajari obat-obatan dan dunia medis?",
    kataKunci: ["kesehatan", "dokter", "kedokteran", "perawat", "keperawatan", "pasien", "sakit", "kebidanan", "ibu", "bayi", "gigi", "fisioterapi", "obat", "medis", "rumah sakit", "anatomi", "tubuh", "terapi", "klinis", "pemulihan", "kehamilan"],
  },
  {
    id: 69, kat: "FK", rumpun: "r1", tags: "kesehatan",
    ringkas: "kedokteran & kesehatan (FK)",
    teks: "Apakah kamu membayangkan dirimu bekerja di rumah sakit?",
    kataKunci: ["kesehatan", "dokter", "kedokteran", "perawat", "keperawatan", "pasien", "sakit", "kebidanan", "ibu", "bayi", "gigi", "fisioterapi", "obat", "medis", "rumah sakit", "anatomi", "tubuh", "terapi", "klinis", "pemulihan", "kehamilan"],
  },
  {
    id: 70, kat: "FK", rumpun: "r1", tags: "kesehatan",
    ringkas: "kedokteran & kesehatan (FK)",
    teks: "Apakah kamu peduli dengan pola hidup sehat dan kebersihan?",
    kataKunci: ["kesehatan", "dokter", "kedokteran", "perawat", "keperawatan", "pasien", "sakit", "kebidanan", "ibu", "bayi", "gigi", "fisioterapi", "obat", "medis", "rumah sakit", "anatomi", "tubuh", "terapi", "klinis", "pemulihan", "kehamilan"],
  },
  {
    id: 71, kat: "FKP", rumpun: "r1", tags: "agro pangan",
    ringkas: "ketahanan pangan & agro (FKP)",
    teks: "Apakah kamu tertarik mempelajari teknologi pengolahan makanan?",
    kataKunci: ["pertanian", "pangan", "teknologi pangan", "akuakultur", "ikan", "budidaya", "ketahanan pangan", "berkebun", "agribisnis", "gizi", "mutu", "bioteknologi", "biosains", "hewan", "industri pangan", "produk pangan", "pengolahan", "perairan", "tanaman", "agro", "makanan"],
  },
  {
    id: 72, kat: "FKP", rumpun: "r1", tags: "agro pangan",
    ringkas: "ketahanan pangan & agro (FKP)",
    teks: "Apakah kamu suka mempelajari cara budidaya ikan atau hasil perairan?",
    kataKunci: ["pertanian", "pangan", "teknologi pangan", "akuakultur", "ikan", "budidaya", "ketahanan pangan", "berkebun", "agribisnis", "gizi", "mutu", "bioteknologi", "biosains", "hewan", "industri pangan", "produk pangan", "pengolahan", "perairan", "tanaman", "agro", "makanan"],
  },
  {
    id: 73, kat: "FKP", rumpun: "r1", tags: "agro pangan",
    ringkas: "ketahanan pangan & agro (FKP)",
    teks: "Apakah kamu ingin ikut membantu ketahanan pangan Indonesia?",
    kataKunci: ["pertanian", "pangan", "teknologi pangan", "akuakultur", "ikan", "budidaya", "ketahanan pangan", "berkebun", "agribisnis", "gizi", "mutu", "bioteknologi", "biosains", "hewan", "industri pangan", "produk pangan", "pengolahan", "perairan", "tanaman", "agro", "makanan"],
  },
  {
    id: 74, kat: "FKP", rumpun: "r1", tags: "agro pangan",
    ringkas: "ketahanan pangan & agro (FKP)",
    teks: "Apakah kamu suka bertani atau berkebun?",
    kataKunci: ["pertanian", "pangan", "teknologi pangan", "akuakultur", "ikan", "budidaya", "ketahanan pangan", "berkebun", "agribisnis", "gizi", "mutu", "bioteknologi", "biosains", "hewan", "industri pangan", "produk pangan", "pengolahan", "perairan", "tanaman", "agro", "makanan"],
  },
  {
    id: 75, kat: "FKP", rumpun: "r1", tags: "agro pangan",
    ringkas: "ketahanan pangan & agro (FKP)",
    teks: "Apakah kamu tertarik berbisnis hasil pertanian atau produk pangan?",
    kataKunci: ["pertanian", "pangan", "teknologi pangan", "akuakultur", "ikan", "budidaya", "ketahanan pangan", "berkebun", "agribisnis", "gizi", "mutu", "bioteknologi", "biosains", "hewan", "industri pangan", "produk pangan", "pengolahan", "perairan", "tanaman", "agro", "makanan"],
  },
  {
    id: 76, kat: "FKP", rumpun: "r1", tags: "agro pangan",
    ringkas: "ketahanan pangan & agro (FKP)",
    teks: "Apakah kamu tertarik mempelajari kandungan gizi dan mutu pangan?",
    kataKunci: ["pertanian", "pangan", "teknologi pangan", "akuakultur", "ikan", "budidaya", "ketahanan pangan", "berkebun", "agribisnis", "gizi", "mutu", "bioteknologi", "biosains", "hewan", "industri pangan", "produk pangan", "pengolahan", "perairan", "tanaman", "agro", "makanan"],
  },
  {
    id: 77, kat: "FKP", rumpun: "r1", tags: "agro pangan",
    ringkas: "ketahanan pangan & agro (FKP)",
    teks: "Apakah kamu suka mempelajari bioteknologi dan rekayasa untuk makhluk hidup?",
    kataKunci: ["pertanian", "pangan", "teknologi pangan", "akuakultur", "ikan", "budidaya", "ketahanan pangan", "berkebun", "agribisnis", "gizi", "mutu", "bioteknologi", "biosains", "hewan", "industri pangan", "produk pangan", "pengolahan", "perairan", "tanaman", "agro", "makanan"],
  },
  {
    id: 78, kat: "FKP", rumpun: "r1", tags: "agro pangan",
    ringkas: "ketahanan pangan & agro (FKP)",
    teks: "Apakah kamu tertarik mempelajari biosains dan dunia hewan?",
    kataKunci: ["pertanian", "pangan", "teknologi pangan", "akuakultur", "ikan", "budidaya", "ketahanan pangan", "berkebun", "agribisnis", "gizi", "mutu", "bioteknologi", "biosains", "hewan", "industri pangan", "produk pangan", "pengolahan", "perairan", "tanaman", "agro", "makanan"],
  },
  {
    id: 79, kat: "FKP", rumpun: "r1", tags: "agro pangan",
    ringkas: "ketahanan pangan & agro (FKP)",
    teks: "Apakah kamu membayangkan dirimu bekerja di industri pangan?",
    kataKunci: ["pertanian", "pangan", "teknologi pangan", "akuakultur", "ikan", "budidaya", "ketahanan pangan", "berkebun", "agribisnis", "gizi", "mutu", "bioteknologi", "biosains", "hewan", "industri pangan", "produk pangan", "pengolahan", "perairan", "tanaman", "agro", "makanan"],
  },
  {
    id: 80, kat: "FKP", rumpun: "r1", tags: "agro pangan",
    ringkas: "ketahanan pangan & agro (FKP)",
    teks: "Apakah kamu tertarik mengembangkan produk pangan baru yang inovatif?",
    kataKunci: ["pertanian", "pangan", "teknologi pangan", "akuakultur", "ikan", "budidaya", "ketahanan pangan", "berkebun", "agribisnis", "gizi", "mutu", "bioteknologi", "biosains", "hewan", "industri pangan", "produk pangan", "pengolahan", "perairan", "tanaman", "agro", "makanan"],
  },
  {
    id: 81, kat: "FMIPA", rumpun: "r1", tags: "sains data teknik",
    ringkas: "matematika, sains & data (FMIPA)",
    teks: "Apakah kamu menikmati pelajaran matematika dan logika?",
    kataKunci: ["matematika", "fisika", "kimia", "biologi", "logika", "eksperimen", "laboratorium", "praktikum", "data", "analisis", "penelitian", "riset", "artifisial", "kecerdasan buatan", "angka", "hitung", "statistika", "sains", "ilmiah", "rumus", "percobaan", "geofisika", "aktuar", "mipa"],
  },
  {
    id: 82, kat: "FMIPA", rumpun: "r1", tags: "sains data teknik",
    ringkas: "matematika, sains & data (FMIPA)",
    teks: "Apakah kamu penasaran dengan fenomena alam dan hukum fisika?",
    kataKunci: ["matematika", "fisika", "kimia", "biologi", "logika", "eksperimen", "laboratorium", "praktikum", "data", "analisis", "penelitian", "riset", "artifisial", "kecerdasan buatan", "angka", "hitung", "statistika", "sains", "ilmiah", "rumus", "percobaan", "geofisika", "aktuar", "mipa"],
  },
  {
    id: 83, kat: "FMIPA", rumpun: "r1", tags: "sains data teknik",
    ringkas: "matematika, sains & data (FMIPA)",
    teks: "Apakah kamu suka melakukan eksperimen di laboratorium?",
    kataKunci: ["matematika", "fisika", "kimia", "biologi", "logika", "eksperimen", "laboratorium", "praktikum", "data", "analisis", "penelitian", "riset", "artifisial", "kecerdasan buatan", "angka", "hitung", "statistika", "sains", "ilmiah", "rumus", "percobaan", "geofisika", "aktuar", "mipa"],
  },
  {
    id: 84, kat: "FMIPA", rumpun: "r1", tags: "sains data teknik",
    ringkas: "matematika, sains & data (FMIPA)",
    teks: "Apakah kamu tertarik mempelajari reaksi dan zat-zat kimia?",
    kataKunci: ["matematika", "fisika", "kimia", "biologi", "logika", "eksperimen", "laboratorium", "praktikum", "data", "analisis", "penelitian", "riset", "artifisial", "kecerdasan buatan", "angka", "hitung", "statistika", "sains", "ilmiah", "rumus", "percobaan", "geofisika", "aktuar", "mipa"],
  },
  {
    id: 85, kat: "FMIPA", rumpun: "r1", tags: "sains data teknik",
    ringkas: "matematika, sains & data (FMIPA)",
    teks: "Apakah kamu suka mengamati makhluk hidup dan keanekaragaman hayati?",
    kataKunci: ["matematika", "fisika", "kimia", "biologi", "logika", "eksperimen", "laboratorium", "praktikum", "data", "analisis", "penelitian", "riset", "artifisial", "kecerdasan buatan", "angka", "hitung", "statistika", "sains", "ilmiah", "rumus", "percobaan", "geofisika", "aktuar", "mipa"],
  },
  {
    id: 86, kat: "FMIPA", rumpun: "r1", tags: "sains data teknik",
    ringkas: "matematika, sains & data (FMIPA)",
    teks: "Apakah kamu tertarik menganalisis data dan membuat prediksi?",
    kataKunci: ["matematika", "fisika", "kimia", "biologi", "logika", "eksperimen", "laboratorium", "praktikum", "data", "analisis", "penelitian", "riset", "artifisial", "kecerdasan buatan", "angka", "hitung", "statistika", "sains", "ilmiah", "rumus", "percobaan", "geofisika", "aktuar", "mipa"],
  },
  {
    id: 87, kat: "FMIPA", rumpun: "r1", tags: "sains data teknik",
    ringkas: "matematika, sains & data (FMIPA)",
    teks: "Apakah kamu membayangkan dirimu menjadi peneliti atau ilmuwan?",
    kataKunci: ["matematika", "fisika", "kimia", "biologi", "logika", "eksperimen", "laboratorium", "praktikum", "data", "analisis", "penelitian", "riset", "artifisial", "kecerdasan buatan", "angka", "hitung", "statistika", "sains", "ilmiah", "rumus", "percobaan", "geofisika", "aktuar", "mipa"],
  },
  {
    id: 88, kat: "FMIPA", rumpun: "r1", tags: "sains data teknik",
    ringkas: "matematika, sains & data (FMIPA)",
    teks: "Apakah kamu tertarik mempelajari kecerdasan buatan (AI)?",
    kataKunci: ["matematika", "fisika", "kimia", "biologi", "logika", "eksperimen", "laboratorium", "praktikum", "data", "analisis", "penelitian", "riset", "artifisial", "kecerdasan buatan", "angka", "hitung", "statistika", "sains", "ilmiah", "rumus", "percobaan", "geofisika", "aktuar", "mipa"],
  },
  {
    id: 89, kat: "FMIPA", rumpun: "r1", tags: "sains data teknik",
    ringkas: "matematika, sains & data (FMIPA)",
    teks: "Apakah kamu suka memecahkan soal dan teka-teki angka?",
    kataKunci: ["matematika", "fisika", "kimia", "biologi", "logika", "eksperimen", "laboratorium", "praktikum", "data", "analisis", "penelitian", "riset", "artifisial", "kecerdasan buatan", "angka", "hitung", "statistika", "sains", "ilmiah", "rumus", "percobaan", "geofisika", "aktuar", "mipa"],
  },
  {
    id: 90, kat: "FMIPA", rumpun: "r1", tags: "sains data teknik",
    ringkas: "matematika, sains & data (FMIPA)",
    teks: "Apakah kamu tertarik menjadi guru matematika atau IPA?",
    kataKunci: ["matematika", "fisika", "kimia", "biologi", "logika", "eksperimen", "laboratorium", "praktikum", "data", "analisis", "penelitian", "riset", "artifisial", "kecerdasan buatan", "angka", "hitung", "statistika", "sains", "ilmiah", "rumus", "percobaan", "geofisika", "aktuar", "mipa"],
  },
  {
    id: 91, kat: "FPSI", rumpun: "r2", tags: "psikologi",
    ringkas: "psikologi & perilaku (FPSI)",
    teks: "Apakah kamu penasaran mengapa orang berperilaku berbeda-beda?",
    kataKunci: ["psikologi", "perilaku", "emosi", "perasaan", "kepribadian", "mental", "mendengarkan", "curhat", "konselor", "bimbingan", "pengembangan diri", "tumbuh kembang", "anak", "remaja", "empati", "karakter", "bakat", "minat", "kejiwaan", "motivasi"],
  },
  {
    id: 92, kat: "FPSI", rumpun: "r2", tags: "psikologi",
    ringkas: "psikologi & perilaku (FPSI)",
    teks: "Apakah kamu suka mendengarkan cerita atau masalah temanmu?",
    kataKunci: ["psikologi", "perilaku", "emosi", "perasaan", "kepribadian", "mental", "mendengarkan", "curhat", "konselor", "bimbingan", "pengembangan diri", "tumbuh kembang", "anak", "remaja", "empati", "karakter", "bakat", "minat", "kejiwaan", "motivasi"],
  },
  {
    id: 93, kat: "FPSI", rumpun: "r2", tags: "psikologi",
    ringkas: "psikologi & perilaku (FPSI)",
    teks: "Apakah kamu tertarik memahami emosi dan perasaan manusia?",
    kataKunci: ["psikologi", "perilaku", "emosi", "perasaan", "kepribadian", "mental", "mendengarkan", "curhat", "konselor", "bimbingan", "pengembangan diri", "tumbuh kembang", "anak", "remaja", "empati", "karakter", "bakat", "minat", "kejiwaan", "motivasi"],
  },
  {
    id: 94, kat: "FPSI", rumpun: "r2", tags: "psikologi",
    ringkas: "psikologi & perilaku (FPSI)",
    teks: "Apakah kamu membayangkan dirimu menjadi psikolog?",
    kataKunci: ["psikologi", "perilaku", "emosi", "perasaan", "kepribadian", "mental", "mendengarkan", "curhat", "konselor", "bimbingan", "pengembangan diri", "tumbuh kembang", "anak", "remaja", "empati", "karakter", "bakat", "minat", "kejiwaan", "motivasi"],
  },
  {
    id: 95, kat: "FPSI", rumpun: "r2", tags: "psikologi",
    ringkas: "psikologi & perilaku (FPSI)",
    teks: "Apakah kamu suka mengamati kepribadian orang di sekitarmu?",
    kataKunci: ["psikologi", "perilaku", "emosi", "perasaan", "kepribadian", "mental", "mendengarkan", "curhat", "konselor", "bimbingan", "pengembangan diri", "tumbuh kembang", "anak", "remaja", "empati", "karakter", "bakat", "minat", "kejiwaan", "motivasi"],
  },
  {
    id: 96, kat: "FPSI", rumpun: "r2", tags: "psikologi",
    ringkas: "psikologi & perilaku (FPSI)",
    teks: "Apakah kamu tertarik membantu orang mengatasi masalah mental dan emosi?",
    kataKunci: ["psikologi", "perilaku", "emosi", "perasaan", "kepribadian", "mental", "mendengarkan", "curhat", "konselor", "bimbingan", "pengembangan diri", "tumbuh kembang", "anak", "remaja", "empati", "karakter", "bakat", "minat", "kejiwaan", "motivasi"],
  },
  {
    id: 97, kat: "FPSI", rumpun: "r2", tags: "psikologi",
    ringkas: "psikologi & perilaku (FPSI)",
    teks: "Apakah kamu suka membaca buku tentang pengembangan diri?",
    kataKunci: ["psikologi", "perilaku", "emosi", "perasaan", "kepribadian", "mental", "mendengarkan", "curhat", "konselor", "bimbingan", "pengembangan diri", "tumbuh kembang", "anak", "remaja", "empati", "karakter", "bakat", "minat", "kejiwaan", "motivasi"],
  },
  {
    id: 98, kat: "FPSI", rumpun: "r2", tags: "psikologi",
    ringkas: "psikologi & perilaku (FPSI)",
    teks: "Apakah kamu tertarik mempelajari tumbuh kembang anak dan remaja?",
    kataKunci: ["psikologi", "perilaku", "emosi", "perasaan", "kepribadian", "mental", "mendengarkan", "curhat", "konselor", "bimbingan", "pengembangan diri", "tumbuh kembang", "anak", "remaja", "empati", "karakter", "bakat", "minat", "kejiwaan", "motivasi"],
  },
  {
    id: 99, kat: "FPSI", rumpun: "r2", tags: "psikologi",
    ringkas: "psikologi & perilaku (FPSI)",
    teks: "Apakah kamu peka terhadap perasaan dan kondisi orang lain?",
    kataKunci: ["psikologi", "perilaku", "emosi", "perasaan", "kepribadian", "mental", "mendengarkan", "curhat", "konselor", "bimbingan", "pengembangan diri", "tumbuh kembang", "anak", "remaja", "empati", "karakter", "bakat", "minat", "kejiwaan", "motivasi"],
  },
  {
    id: 100, kat: "FPSI", rumpun: "r2", tags: "psikologi",
    ringkas: "psikologi & perilaku (FPSI)",
    teks: "Apakah kamu tertarik menjadi konselor atau guru bimbingan dan konseling?",
    kataKunci: ["psikologi", "perilaku", "emosi", "perasaan", "kepribadian", "mental", "mendengarkan", "curhat", "konselor", "bimbingan", "pengembangan diri", "tumbuh kembang", "anak", "remaja", "empati", "karakter", "bakat", "minat", "kejiwaan", "motivasi"],
  },
  {
    id: 101, kat: "FT", rumpun: "r1", tags: "teknik it",
    ringkas: "teknik & teknologi (FT)",
    teks: "Apakah kamu suka membongkar-pasang atau merakit peralatan?",
    kataKunci: ["teknik", "mesin", "sipil", "bangunan", "konstruksi", "elektro", "listrik", "informatika", "komputer", "perencanaan", "wilayah", "kota", "otomotif", "tata boga", "kuliner", "busana", "rias", "memasak", "guru teknik", "insinyur", "mekanik", "metalurgi", "pertambangan", "sistem informasi", "teknologi"],
  },
  {
    id: 102, kat: "FT", rumpun: "r1", tags: "teknik it",
    ringkas: "teknik & teknologi (FT)",
    teks: "Apakah kamu tertarik merancang bangunan dan konstruksi?",
    kataKunci: ["teknik", "mesin", "sipil", "bangunan", "konstruksi", "elektro", "listrik", "informatika", "komputer", "perencanaan", "wilayah", "kota", "otomotif", "tata boga", "kuliner", "busana", "rias", "memasak", "guru teknik", "insinyur", "mekanik", "metalurgi", "pertambangan", "sistem informasi", "teknologi"],
  },
  {
    id: 103, kat: "FT", rumpun: "r1", tags: "teknik it",
    ringkas: "teknik & teknologi (FT)",
    teks: "Apakah kamu tertarik mempelajari kelistrikan dan elektronika?",
    kataKunci: ["teknik", "mesin", "sipil", "bangunan", "konstruksi", "elektro", "listrik", "informatika", "komputer", "perencanaan", "wilayah", "kota", "otomotif", "tata boga", "kuliner", "busana", "rias", "memasak", "guru teknik", "insinyur", "mekanik", "metalurgi", "pertambangan", "sistem informasi", "teknologi"],
  },
  {
    id: 104, kat: "FT", rumpun: "r1", tags: "teknik it",
    ringkas: "teknik & teknologi (FT)",
    teks: "Apakah kamu suka menggunakan komputer dan tertarik dengan dunia IT?",
    kataKunci: ["teknik", "mesin", "sipil", "bangunan", "konstruksi", "elektro", "listrik", "informatika", "komputer", "perencanaan", "wilayah", "kota", "otomotif", "tata boga", "kuliner", "busana", "rias", "memasak", "guru teknik", "insinyur", "mekanik", "metalurgi", "pertambangan", "sistem informasi", "teknologi"],
  },
  {
    id: 105, kat: "FT", rumpun: "r1", tags: "teknik it",
    ringkas: "teknik & teknologi (FT)",
    teks: "Apakah kamu tertarik merancang tata kota dan wilayah?",
    kataKunci: ["teknik", "mesin", "sipil", "bangunan", "konstruksi", "elektro", "listrik", "informatika", "komputer", "perencanaan", "wilayah", "kota", "otomotif", "tata boga", "kuliner", "busana", "rias", "memasak", "guru teknik", "insinyur", "mekanik", "metalurgi", "pertambangan", "sistem informasi", "teknologi"],
  },
  {
    id: 106, kat: "FT", rumpun: "r1", tags: "teknik it",
    ringkas: "teknik & teknologi (FT)",
    teks: "Apakah kamu suka dunia otomotif dan mesin kendaraan?",
    kataKunci: ["teknik", "mesin", "sipil", "bangunan", "konstruksi", "elektro", "listrik", "informatika", "komputer", "perencanaan", "wilayah", "kota", "otomotif", "tata boga", "kuliner", "busana", "rias", "memasak", "guru teknik", "insinyur", "mekanik", "metalurgi", "pertambangan", "sistem informasi", "teknologi"],
  },
  {
    id: 107, kat: "FT", rumpun: "r1", tags: "teknik it",
    ringkas: "teknik & teknologi (FT)",
    teks: "Apakah kamu tertarik belajar tata boga, busana, atau tata rias?",
    kataKunci: ["teknik", "mesin", "sipil", "bangunan", "konstruksi", "elektro", "listrik", "informatika", "komputer", "perencanaan", "wilayah", "kota", "otomotif", "tata boga", "kuliner", "busana", "rias", "memasak", "guru teknik", "insinyur", "mekanik", "metalurgi", "pertambangan", "sistem informasi", "teknologi"],
  },
  {
    id: 108, kat: "FT", rumpun: "r1", tags: "teknik it",
    ringkas: "teknik & teknologi (FT)",
    teks: "Apakah kamu suka memasak dan berkreasi dengan makanan?",
    kataKunci: ["teknik", "mesin", "sipil", "bangunan", "konstruksi", "elektro", "listrik", "informatika", "komputer", "perencanaan", "wilayah", "kota", "otomotif", "tata boga", "kuliner", "busana", "rias", "memasak", "guru teknik", "insinyur", "mekanik", "metalurgi", "pertambangan", "sistem informasi", "teknologi"],
  },
  {
    id: 109, kat: "FT", rumpun: "r1", tags: "teknik it",
    ringkas: "teknik & teknologi (FT)",
    teks: "Apakah kamu tertarik menjadi guru teknik atau vokasi kejuruan?",
    kataKunci: ["teknik", "mesin", "sipil", "bangunan", "konstruksi", "elektro", "listrik", "informatika", "komputer", "perencanaan", "wilayah", "kota", "otomotif", "tata boga", "kuliner", "busana", "rias", "memasak", "guru teknik", "insinyur", "mekanik", "metalurgi", "pertambangan", "sistem informasi", "teknologi"],
  },
  {
    id: 110, kat: "FT", rumpun: "r1", tags: "teknik it",
    ringkas: "teknik & teknologi (FT)",
    teks: "Apakah kamu membayangkan dirimu menjadi seorang insinyur?",
    kataKunci: ["teknik", "mesin", "sipil", "bangunan", "konstruksi", "elektro", "listrik", "informatika", "komputer", "perencanaan", "wilayah", "kota", "otomotif", "tata boga", "kuliner", "busana", "rias", "memasak", "guru teknik", "insinyur", "mekanik", "metalurgi", "pertambangan", "sistem informasi", "teknologi"],
  },
  {
    id: 111, kat: "FV", rumpun: "r1", tags: "teknik seni bisnis",
    ringkas: "keterampilan vokasi siap kerja (FV)",
    teks: "Apakah kamu lebih suka belajar dengan praktik langsung daripada teori?",
    kataKunci: ["praktik", "praktek", "keterampilan", "terapan", "siap kerja", "keahlian", "teknisi", "operator", "magang", "industri", "proyek", "bengkel", "studio", "vokasi", "langsung bekerja", "lulus", "profesional", "produk", "transportasi", "instalasi", "mesin", "desain", "aplikasi", "kejuruan", "skill", "karya nyata"],
  },
  {
    id: 112, kat: "FV", rumpun: "r1", tags: "teknik seni bisnis",
    ringkas: "keterampilan vokasi siap kerja (FV)",
    teks: "Apakah kamu tertarik memiliki keahlian terapan yang siap dipakai di dunia kerja?",
    kataKunci: ["praktik", "praktek", "keterampilan", "terapan", "siap kerja", "keahlian", "teknisi", "operator", "magang", "industri", "proyek", "bengkel", "studio", "vokasi", "langsung bekerja", "lulus", "profesional", "produk", "transportasi", "instalasi", "mesin", "desain", "aplikasi", "kejuruan", "skill", "karya nyata"],
  },
  {
    id: 113, kat: "FV", rumpun: "r1", tags: "teknik seni bisnis",
    ringkas: "keterampilan vokasi siap kerja (FV)",
    teks: "Apakah kamu suka mengerjakan proyek nyata daripada tugas tulis?",
    kataKunci: ["praktik", "praktek", "keterampilan", "terapan", "siap kerja", "keahlian", "teknisi", "operator", "magang", "industri", "proyek", "bengkel", "studio", "vokasi", "langsung bekerja", "lulus", "profesional", "produk", "transportasi", "instalasi", "mesin", "desain", "aplikasi", "kejuruan", "skill", "karya nyata"],
  },
  {
    id: 114, kat: "FV", rumpun: "r1", tags: "teknik seni bisnis",
    ringkas: "keterampilan vokasi siap kerja (FV)",
    teks: "Apakah kamu tertarik menjadi teknisi atau operator yang ahli di bidangnya?",
    kataKunci: ["praktik", "praktek", "keterampilan", "terapan", "siap kerja", "keahlian", "teknisi", "operator", "magang", "industri", "proyek", "bengkel", "studio", "vokasi", "langsung bekerja", "lulus", "profesional", "produk", "transportasi", "instalasi", "mesin", "desain", "aplikasi", "kejuruan", "skill", "karya nyata"],
  },
  {
    id: 115, kat: "FV", rumpun: "r1", tags: "teknik seni bisnis",
    ringkas: "keterampilan vokasi siap kerja (FV)",
    teks: "Apakah kamu suka belajar di bengkel, studio, atau laboratorium praktik?",
    kataKunci: ["praktik", "praktek", "keterampilan", "terapan", "siap kerja", "keahlian", "teknisi", "operator", "magang", "industri", "proyek", "bengkel", "studio", "vokasi", "langsung bekerja", "lulus", "profesional", "produk", "transportasi", "instalasi", "mesin", "desain", "aplikasi", "kejuruan", "skill", "karya nyata"],
  },
  {
    id: 116, kat: "FV", rumpun: "r1", tags: "teknik seni bisnis",
    ringkas: "keterampilan vokasi siap kerja (FV)",
    teks: "Apakah kamu tertarik magang untuk mendapatkan pengalaman kerja nyata?",
    kataKunci: ["praktik", "praktek", "keterampilan", "terapan", "siap kerja", "keahlian", "teknisi", "operator", "magang", "industri", "proyek", "bengkel", "studio", "vokasi", "langsung bekerja", "lulus", "profesional", "produk", "transportasi", "instalasi", "mesin", "desain", "aplikasi", "kejuruan", "skill", "karya nyata"],
  },
  {
    id: 117, kat: "FV", rumpun: "r1", tags: "teknik seni bisnis",
    ringkas: "keterampilan vokasi siap kerja (FV)",
    teks: "Apakah kamu suka membuat karya nyata seperti produk, desain, atau makanan?",
    kataKunci: ["praktik", "praktek", "keterampilan", "terapan", "siap kerja", "keahlian", "teknisi", "operator", "magang", "industri", "proyek", "bengkel", "studio", "vokasi", "langsung bekerja", "lulus", "profesional", "produk", "transportasi", "instalasi", "mesin", "desain", "aplikasi", "kejuruan", "skill", "karya nyata"],
  },
  {
    id: 118, kat: "FV", rumpun: "r1", tags: "teknik seni bisnis",
    ringkas: "keterampilan vokasi siap kerja (FV)",
    teks: "Apakah kamu tertarik bekerja di bidang transportasi dan logistik?",
    kataKunci: ["praktik", "praktek", "keterampilan", "terapan", "siap kerja", "keahlian", "teknisi", "operator", "magang", "industri", "proyek", "bengkel", "studio", "vokasi", "langsung bekerja", "lulus", "profesional", "produk", "transportasi", "instalasi", "mesin", "desain", "aplikasi", "kejuruan", "skill", "karya nyata"],
  },
  {
    id: 119, kat: "FV", rumpun: "r1", tags: "teknik seni bisnis",
    ringkas: "keterampilan vokasi siap kerja (FV)",
    teks: "Apakah kamu membayangkan dirimu langsung bekerja setelah lulus?",
    kataKunci: ["praktik", "praktek", "keterampilan", "terapan", "siap kerja", "keahlian", "teknisi", "operator", "magang", "industri", "proyek", "bengkel", "studio", "vokasi", "langsung bekerja", "lulus", "profesional", "produk", "transportasi", "instalasi", "mesin", "desain", "aplikasi", "kejuruan", "skill", "karya nyata"],
  },
  {
    id: 120, kat: "FV", rumpun: "r1", tags: "teknik seni bisnis",
    ringkas: "keterampilan vokasi siap kerja (FV)",
    teks: "Apakah kamu tertarik menjadi praktisi yang banyak dibutuhkan industri?",
    kataKunci: ["praktik", "praktek", "keterampilan", "terapan", "siap kerja", "keahlian", "teknisi", "operator", "magang", "industri", "proyek", "bengkel", "studio", "vokasi", "langsung bekerja", "lulus", "profesional", "produk", "transportasi", "instalasi", "mesin", "desain", "aplikasi", "kejuruan", "skill", "karya nyata"],
  },
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
  // ---------- FKP : Fakultas Ketahanan Pangan ----------
  ["Agribisnis Digital", "FKP", "r1", "agro it"],
  ["Akuakultur", "FKP", "r1", "agro"],
  ["Biosains Hewan", "FKP", "r1", "sains"],
  ["Bioteknologi", "FKP", "r1", "sains"],
  ["Teknologi Pangan dan Hasil Pertanian", "FKP", "r1", "agro pangan"],
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

/* ============================================================================
   INFO_PRODI - data funfact per prodi dari Buku "Fun Fact Unesa 2025".
   Kunci tiap prodi: "Nama Prodi|FAKULTAS" (sama seperti di PRODI_LIST).
   Field: akreditasi, persiapan (syarat/portofolio), matkul (yang dipelajari),
          funfact (fakta unik), prospek (2-4 opsi karier).
   Cara update: cukup edit nilai string/array di bawah. ==================== */
const INFO_PRODI = {
  "Administrasi Negara|FV": {
    akreditasi: "Baik",
    persiapan:  "Harus mempunyai literasi yang tinggi karena tugas dan referensinya full jurnal berlembar-lembar. Memiliki kemampuan analisis karena akan melakukan observasi. Analisis Jabatan. Kearsipan. Analisis Beban Kerja. Kebijakan Publik. Kompensasi Pegawai.",
    matkul:     "Belajar banyak gak melulu tentang administrasi tapi juga belajar tentang hukum. Belajar berorganisasi karena ada matkulnya juga. Ekspetasinya tidak ada berhitung, ternyata masih ada perpajakan dan statistika. Belajar mengelola sumber daya manusia dan melatih kepemimpinan.",
    funfact:    "Belajar tidak melulu tentang administrasi, tetapi juga tentang hukum dan organisasi. Lulusannya banyak bekerja di pemerintahan.",
    prospek:    ["Pegawai BKD dan BKN", "Arsiparis instansi pemerintahan", "Pendamping pelayanan publik"],
  },
  "Akuntansi|FEB": {
    akreditasi: "Unggul",
    persiapan:  "Harus mulai belajar Excel dasar dan menyiapkan bahasa Inggris dasar karena banyak istilah berbahasa Inggris.",
    matkul:     "Harus mulai belajar excel dasar Prepare bahasa inggris dasar juga karena banyak istilah berbahasa inggris. Selain itu buku yang dipakai dosen untuk bahan ajar kebanyakan buku berbahasa inggris. Update aturan terbaru, terutama untuk matkul pajak.",
    funfact:    "Justru mata kuliah yang sangat menarik adalah mata kuliah yang “tidak akuntansi banget” seperti pajak, akuntansi manajemen, audit dan akuntansi pemerintah. Motto mahasiswa akuntansi: “Balance belum tentu benar, tidak balance sudah pasti salah” Ujian pakai kertas, sedangkan tugas tugas kebanyakan memakai excel Kalkulator jarang dipakai, lebih sering memakai excel.",
    prospek:    ["Auditor", "Konsultan pajak", "Staff finance and", "Accounting"],
  },
  "Bimbingan Dan Konseling|FIP": {
    akreditasi: "Unggul",
    persiapan:  "Kemampuan public speaking Keterampilan administrasi Suka membaca jurnal",
    matkul:     "Teori praktek konseling humanistik Teori praktek konseling kognitif behavior Dinamika kelompok Konseling multibudaya",
    funfact:    "Prodi ini sering melakukan praktek konseling. Meskipun prodi ini memiliki basic di pendidikan, teori psikologi dan keorganisasian juga dipelajari. Prodi yang dikenal jika lulusannya akan menjadi guru BK, nyatanya memiliki peluang yang luas di dunia kerja.",
    prospek:    ["Guru BK", "Konselor Adiksi", "Layanan Test Psikologi"],
  },
  "Biologi|FMIPA": {
    akreditasi: "Unggul",
    persiapan:  "Siapkan mental yang kuat untuk menghadapi gelombang praktikum yang sangat besar, termasuk sering begadang mengerjakan laporan praktikum.",
    matkul:     "Siapkan mental yang kuat untuk menghadapi gelombang praktikum yang sangat besar. Dan setelah praktikum sudah pasti akan sering begadang untuk mengerjakan laprak. Sering sering membaca jurnal dan materi sebelum matkul agar lebih paham saat dosen menjelaskan materi.",
    funfact:    "Semua mata kuliah di biologi ini sangat menarik dan asyik untuk dipelajari. Beberapa mata kuliah favorit adalah mikrobiologi yang nantinya kita akan belajar untuk bagaimana menumbuhkan bakteri, identifikasi bakteri baik secara makroskopis dan mikroskopis. Dan mata kuliah fisiologi hewan yang nantinya kita akan belajar membedah hewan seperti katak, burung, cacing hingga tikus. Anak biologi itu harus siap ribet. Untuk mencari spesimen kadang bisa sampai keluar kota, masuk makam untuk memetik bunga yang hanya ada disana, mencari keong di parit, menghitung biji jagung, belajar bedah hewan dan masih banyak lagi keunikan tugas praktikum biologi.",
    prospek:    ["Bekerja di DLHK (Dinas Lingkungan Hidup)", "Laboran / asisten laboran", "Entrepreneur usaha tanaman", "Dosen dan guru"],
  },
  "Bisnis Digital|FEB": {
    akreditasi: "Baik Sekali",
    persiapan:  "Harus mampu dan mau beradaptasi dengan perkembangan dunia digitalisasi. Minimal sudah menyukai atau bahkan sudah punya jiwa bisnis meskipun tidak yang terlalu menonjol.",
    matkul:     "E-Commerce, di mata kuliah ini kita belajar bagaimana kita bisa memanfaatkan platform online untuk belajar ber transaksi, berjualan secara online/digital dengan memanfaatkan digitalisasi itu sendiri.",
    funfact:    "Belajar manajemen 60:40 sistem informasi, contohnya kita diajarkan bagaimana mengelola pemasaran produk secara digital dan kita juga diajarkan bagaimana membuat sistem e-commerce- nya. Mahasiswa prodi ini sudah mencoba-coba melakukan bisnis/ berjualan di e-commerce, jadi selagi berkuliah juga dapat uang jajan tambahan.",
    prospek:    ["Bidang IT", "Data Analis", "Tecnopreneur", "Digital marketing"],
  },
  "Desain Grafis|FV": {
    akreditasi: "Baik",
    persiapan:  "Portofolio menggambar bebas dan keahilian basic dalam menjalankan software desain (photoshop,illustrator,corell)",
    matkul:     "Menurut saya matkul yang paling menarik ialah mata kuliah infografis, dimana kita belajar motion graphic yang jika kita menekuninya dapat menjadi ladang rupiah bagi kita",
    funfact:    "Satu satunya prodi yang membuat karya mural di parkiran vokasi yang dimana semua mahasiswa desain grafis ikut turut andil dalam hal tersebut. Mahasiswa prodi ini banyak yang membuka jasa desain poster, flyer, dan lain sebagainya yang menghasilkan cuan.",
    prospek:    ["Prospek kerja kami jelas dan sangat dibutuhkan di industri 4.0", "Desainer,illustrator,UI-UX designer,editor dan freelancer tentunya bergaji dollar jika kita pan"],
  },
  "Desain Komunikasi Visual|FBS": {
    akreditasi: "Baik Sekali",
    persiapan:  "Memiliki kemampuan dasar untuk menggambar digital yang dibarengi dengan kreativitas tinggi. Menyiapkan alat-alat untuk menunjang perkuliahan, seperti sketch book, cat poster, water colour, dan oil pastel karena di semester awal, kebanyakan tugasnya gambar tradisional.",
    matkul:     "Banyak sekali mata kuliah yang menarik, diantaranya Fotografi, Videografi, ilustrasi, dll. Namun yang sangat menarik ialah Desain kemasan, dimana nantinya Mata Kuliah ini akan berfokus pada bagaimana Desain kemasan yang menarik, inovatif, dan tentunya juga cocok dan baik untuk produk maupun konsumen.",
    funfact:    "Banyak yang bilang kalau sudah menguasai aplikasi Canva sudah cocok masuk prodi ini, padahal Canva jarang digunakan ketika perkuliahan. Di semester 5 selalu ada studio visit ke luar kota untuk mengunjungi studio desain grafis yang ternama dengan tujuan menyerap informasi di dunia yang lebih profesional. Di DKV Unesa dapat bantuan cat poster dari kampus di semester awal.",
    prospek:    ["Graphic Designer", "Content Creator", "Video editor", "Photographer"],
  },
  "Ekonomi Islam|FEB": {
    akreditasi: "Baik Sekali",
    persiapan:  "Sudah terbiasa dengan ekonomi dasar meskipun di semester awal masih diberikan materi dasar. Mulai belajar bahasa Arab sebagai bekal.",
    matkul:     "Tetap harus sudah terbiasa dengan ekonomi dasar walaupun di semester awal masih diberikan sedikit materi tentang itu. Juga mulai belajar bahasa arab basic karena di ekis sudah pasti akan ada matkul bahasa arab.",
    funfact:    "Di ekis ada mata kuliah manajemen zakat yang nantinya kita akan menganalisa serta memahami ZISWAF (zakat, infak, sadaqah & wakaf) Bisnis tidak hanya urusan untung-rugi, melainkan sejatinya surga dan neraka karena untung-rugi milik Allah, bekerja dengan profesionalitas lah yang paling utama karena ini merupakan bentuk dari kesyukuran kepada Allah. Profit bukanlah menjadi ultimate goals karena transaksi antara penjual dan pembeli didorong dengan niat beribadah.",
    prospek:    ["Staff pengadilan agama", "Perbankan syariah", "Tenaga pengajar", "Konsultan bisnis"],
  },
  "Ekonomi|FEB": {
    akreditasi: "B",
    persiapan:  "Minat yang kuat dalam isu-isu ekonomi dan keuangan. Keterampilan matematika dasar yang baik karena ekonomi sering berhubungan dengan analisis data dan statistik. Pemikiran yang luas dan analitis.",
    matkul:     "Ekonometrika Ekonomi Pariwisata Ekonomi Publik Kewirausahaan Ekonomi Makro dan Mikro Ekonomi Internasional Statistik",
    funfact:    "Banyak mahasiswa yang sudah mencoba investasi saham. Belajar ilmu ekonomi dapat membantu mahasiswa untuk mengelola keuangan pribadi sehari-harinya. Banyak kegiatan yang fokus pada pengembangan minat dan potensi mahasiswa di bidang ekonomi, seperti Pojok Statistik, Kuliah tamu dengan lembaga-lembaga terkait, seminar statistic, dan lain sebagainya.",
    prospek:    ["Analis Keuangan", "Konsultan Bisnis", "Manajer Keuangan", "Ekonom"],
  },
  "Fisika|FMIPA": {
    akreditasi: "Unggul",
    persiapan:  "Belajar mengenai hukum-hukum fisika. (2) Tau dan paham cara penggunaan alat-alat lab fisika. Eksperimen Fisika dan Praktikum FisDas apalagi waktu bikin laporan eksperimen.",
    matkul:     "Mayoritas berkacamata tebal dibanding prodi lain. Mendapat tanggapan bahwa mahasiswanya terlihat serius dan banyak yang pintar karena digadang-gadang akan menjadi Fisikawan. Namun, aslinya sama saja, cuma mungkin lebih tekun karena mata kuliahnya cukup berat.",
    funfact:    "Mayoritas mahasiswanya identik dengan kacamata tebal dan terlihat serius, digadang-gadang menjadi fisikawan hebat.",
    prospek:    ["Prospek kerja prodi ini", "Dimana saja. Tentu diarahkan sesuai penjurusan juga kemampuan agar kedepannya tidak bingung ing", "Ilmuwan, dan kebanyakan lanjut pendidikan S2"],
  },
  "Fisioterapi|FK": {
    akreditasi: "Baik",
    persiapan:  "Yang perlu di persiapkan untuk masuk prodi Fisioterapi yakni di perkuat untuk pelajaran MIPA karena di Fisioterapi akan mempelajari tentang struktur dan fungsi tubuh manusia serta juga mempelajari cara penggunaan alat alat terapi elektro untuk mengoptimalkan pada waktu sesi terapis",
    matkul:     "Anatomi, Fisiologi, Fisika kesehatan dimana mata kuliah tersebut adalah dasar agar kita mempelajari ilmu fisioterapi lebih dalam kembali dan juga bisa menunjang untuk menjadi fisioterapis yang berkompeten",
    funfact:    "S1 Fisioterapi Unesa adalah Prodi S1-FISIOTERAPI pertama di Jawa timur yang berdiri di universitas negeri Program S1 Fisioterapi berfokus pada fisioterapi olahraga prestasi, Fisioterapi Olahraga Rekreasi, Fisioterapi Disabilitas",
    prospek:    ["Tim tenaga kesehatan dalam klub olahraga"],
  },
  "Gizi|FIKK": {
    akreditasi: "Baik Sekali",
    persiapan:  "Mulai biasakan membaca banyak teori-teori seperti anatomi dan fisiologi manusia, ilmu gizi dasar, dan gizi daur kehidupan. Tingkatkan kepercayaan diri dan skill public speaking karena nanti bakal ada praktek penyuluhan atau konseling ke sasaran didik.",
    matkul:     "Penilaian Status Gizi Pada matkul ini nanti, mahasiswa akan diberi soal cerita mengenai z-score, status gizi orang, sampai menganalisis berapa balita yang mengalami gizi buruk, gizi baik, gizi lebih. Diagnosa Gizi Mahasiswa akan diberi berbagai kasus penyakit dan tentunya kita akan mengerjakan kasus tersebut sesuai dengan langkah PAGT (Proses Asuhan Gizi Terstandar).",
    funfact:    "Selain belajar teori, prodi ini juga banyak melakukan praktek, seperti praktek memasak makanan diet untuk pasien penyakit menular maupun tidak menular, praktek penilian status gizi (pengukuran antropometri, klinis, biokimia, dan biofisik), praktek mengembangkan produk makanan, praktek penyuluhan dan konseling, dan mash banyak lagi praktek-praktek yang tentunya seru.",
    prospek:    ["Konsultan gizi di rumah sakit, puskesmas, dan klinik", "Staf penjamin mutu di industri makanan dan minuman", "Perencana menu dan gizi di pusat kesehatan", "Akademisi"],
  },
  "Hubungan Internasional|FISIPOL": {
    akreditasi: "Prodi Baru",
    persiapan:  "Harus mampu berpikir kritis dan peka terhadap permasalahan di sekitar, terutama mengenai persoalan internasional. Calon mahasiswa juga harus mampu berinteraksi dengan orang lain, khususnya dalam mendiskusikan suatu masalah yang terjadi di sekitar kita.",
    matkul:     "Pengantar Ilmu Politik, karena mahasiswa Hubungan Internasional dapat mengerti dan belajar mengenai politik. Pengantar Masyarakat dan Budaya, karena akan belajar mengenai keterkaitan masyarakat dan budaya, baik Indonesia ataupun internasional terhadap permasalahan sosial ataupun sistem-sistem yang diciptakan di tengah masyarakat.",
    funfact:    "Banyak mahasiswa Hubungan Internasional yang mahir berbahasa asing, bahkan multibahasa. Materi perkuliahan yang beragam dan interdisipliner. Memiliki kesempatan magang dan karir yang luas. Mahasiswa Hubungan Internasional bisa mengikuti organisasi internasional seperti AIESEC, dan lainnya.",
    prospek:    ["Diplomat", "Wartawan/Jurnalis", "Staf Kedutaan", "Konsultan Internasional"],
  },
  "Ilmu Administrasi Negara|FISIPOL": {
    akreditasi: "Unggul",
    persiapan:  "Harus banyak mengulik mengenai Administrasi Negara karena banyak yang terkecoh setelah masuk ke jurusan ini karena dikira akan belajar tentang keuangan.",
    matkul:     "Komunikasi Antar Daerah, karena akan belajar mengenai administrasi dan koordinasi dengan daerah lain, juga akan langsung turun lapangan ke desa.",
    funfact:    "Sering disangka akan menjadi PNS Jurusan Administrasi tapi tidak hanya fokus belajar mengenai keuangan Sering disangka akan banyak belajar mengenai persuratan",
    prospek:    ["Konsultan Pemerintahan", "BUMN"],
  },
  "Ilmu Hukum|FH": {
    akreditasi: "Unggul",
    persiapan:  "Harus punya pemikiran \"hukum menurut pribadi masing-masing\" karena di semester awal dosen akan menanyakan pertanyaan ini di hampir setiap mata kuliah.",
    matkul:     "Harus punya pemikiran “hukum menurut pribadi masing masing” karena di semester awal, dosen akan menanyakan pertanyaan ini entah di matkul apapun harus siap ditanya opininya. Juga harus memahami sistem hukum dan peradilan di Indonesia serta berbagai isu hukum yang sedang hangat diperbincangkan.",
    funfact:    "Salah satu matkul yang menarik adalah mata kuliah hukum pajak karena bukan matkul yang “hukum banget”. Isinya hitung-hitungan, dan walau susah dan perlu ketelitian tapi itu menarik dan seru untuk dipelajari. Ada juga Pendidikan dan Latihan Kemahiran Hukum (PLKH) seperti mata kuliah hukum perdata, hukum pidana dan pengadilan tata usaha negara yang pada prakteknya kita akan simulasi sidang di ruang pengadilan milik unesa Faktanya, anak hukum tidak perlu menghafal undang undang yang sebegitu banyaknya. Bahkan saat ujian juga diperbolehkan membuka dan membawa KUHP dan KUHPer. Jadi jangan khawatir atau takut bakal disuruh hafalan pasal. Anak hukum kebanyakan memang menjabat sebagai aktivis kampus karena memang peduli dengan politik kampus, tapi tidak diwajibkan juga. Saat ujian mata kuliah hukum pajak, kita akan diberi kasus dan menghitung pajak tersebut sambil membawa kalkulator. Itu unik karena tandanya mahasiswa hukum tidak hanya bawa undang-undang tapi bawa kalkulator juga.",
    prospek:    ["Staff legal", "Pengacara", "Konsultan hukum", "Mediator"],
  },
  "Ilmu Keolahragaan|FIKK": {
    akreditasi: "Unggul",
    persiapan:  "Jika tidak mempunyai sertifikat prestasi olahraga, minimal mempunyai portofolio keahlian olahraga. Biomekanika, Fisiologi, Kesehatan Olahraga, Olahraga usia dini, Olahraga lansia, Olahraga pada wanita, dan yang paling menarik adalah Sport Teknologi karena terkait perkembangan teknologi yang digunakan unutuk menganalisis performa atlet.",
    matkul:     "Mata kuliah Keolahragaan tapi masuk dalam rumpun saintek. Tidak semua mahasiswa dari prodi yang mempunyai basic olahraga. Pembelajaran 60% teori dan 40% materi.",
    funfact:    "Strength and conditioning. Pelatih fisik. Konsultan olahraga. Personal trainer. Sport industry. Sport enterpreneur. Ahli-ahli fisioterapi dan masase. Pegawai di instansi pemerintahan olahraga.",
    prospek:    ["Strength and conditioning coach", "Pelatih fisik", "Personal trainer", "Konsultan olahraga"],
  },
  "Ilmu Komunikasi|FISIPOL": {
    akreditasi: "B",
    persiapan:  "Kemampuan dan kepercayaan diri berbicara di depan umum. Banyak-banyak mencari tau tren atau fenomena yg sedang terjadi.",
    matkul:     "Di semester pertengahan akan ada mata kuliah MICE (Meetings, Incentives, Conventions, and Exhibitions) dimana kita diharuskan untuk merancang sebuah acara berskala kota, provinsi, atau bahkan nasional dari nol hingga realisasinya di hari H.",
    funfact:    "Dikenal sebagai individu yang mudah bersosialisasi dan terbuka terhadap perbedaan. Pada kenyataannya komunikasi yang tertinggi adalah kemampuan mendengarkan. Meski banyak yang berpendapat bahwa anak introvert tak ‘cocok’ di Ilmu Komunikasi, kenyataannya membuktikan sebaliknya. Terdapat matkul experience yaitu MICE (Meeting, invention, convention dan exhibition) Matakuliah hampir 70% berupa project Tidak bisa sendiri, karena kebanyakan tugas adalah berkelompok",
    prospek:    ["Public Relation", "Content Writer", "Reporter", "Asisten produser"],
  },
  "Ilmu Politik|FISIPOL": {
    akreditasi: "Baik",
    persiapan:  "Harus tau keadaan politik di indonesia, karena setiap hari kita belajar dan membahas tentang pemerintahan yang ada di indonesia. Selain itu, kita juga belajar politik internasional. Maka dari itu kita juga harus update dengan berita di Indonesia maupun internasional.",
    matkul:     "Ada mata kuliah hubungan internasional yang membahas politik luar selain di indonesia, dan setiap selesai penjelasan dari dosen, kelas biasanya dibagi menjadi 2 kelompok untuk debat pro kontra dari apa yang sudah dijelaskan.",
    funfact:    "Mahasiswa ilpol selalu diberikan kesempatan untuk ikut berpartisipasi dalam diskusi politik pemerintahan. Contohnya diskusi diseminasi capres dan cawapres dari pasangan Anies dan Muhaimin serta mengikuti acara Rumah Demokrasi di TVRI JATIM.",
    prospek:    ["Anggota legislatif", "Dosen", "Pengamat politik", "Anggota partai politik"],
  },
  "Kebidanan|FK": {
    akreditasi: "Baik",
    persiapan:  "yang harus disiapkan yang paling utama yaitu niat yang cukup agar dapat survive dalam pembelajaran di masa perkuliahan yang sama saja dengan program studi lainnya, selain niat harus dibekali ilmu yang kuat agar saat menjalani masa perkuliahan tidak terlalu merasa terbebani dengan sering- sering melakukan brain storming dan yang sedang santai-santai waktunya jangan dibuang untuk bersantai-santai, karena perjalanan masih cukup panjang untuk meraih masa depan yang di inginkan.",
    matkul:     "Karena ini kesehatan tentunya mata kuliah yang sangat menarik yaitu tidak jauh-jauh dari materi organ tubuh (Basic Science Midwifery II) dan juga dasar-dasar dalam kebidanan yang harus diketahui, karena hal tersebut sangat-sangat menyenangkan apabila memang dasarnya suka IPA (Ilmu Pengetahuan Alam).",
    funfact:    "1.  Program Studi Kebidanan Unesa yang baru di buka tahun ini memiliki keunggulan dalam upaya promotif dan preventiv dalam kegiatan di masyarakat dan difokuskan dapat menganalisis, melakukan advokasi dan pemberdayaan dalam meningkatkan kesejahteraan keluarga dan masyarakat dan tentunya berdasarkan perkembangan inovasi IPTEK.",
    prospek:    ["Bidan dapat bekerja dirumah sakit", "Bidan dapat bekerja di puskesmas", "Bidan dapat membuka praktek mandiri yang telah memiliki tanda registrasi dan SIPB ( surat Izin", "Bidan dapat"],
  },
  "Kedokteran|FK": {
    akreditasi: "Baik",
    persiapan:  "Siap untuk belajar materi kedokteran yang sangat amat banyak dan complicated karena akan ada banyak hafalan juga. Siapkan waktu. Di prodi ini, waktu diibaratkan kunci. Jadi sebisa mungkin atur waktu sebaik-baiknya. Antara waktu belajar dan waktu main harus seimbang.",
    matkul:     "Anatomi adalah mata kuliah yang penuh keceriaan karena mengajarkan segala hal tentang struktur tubuh manusia, mulai dari yang terlihat di luar hingga detail-detail kecil yang mengagumkan. Mahasiswa kedokteran menggali ilmu anatomi langsung dari guru besar melalui cadaver, memberikan pengalaman belajar yang nyata tentang bentuk tubuh dan komponen di dalamnya. Dalam dunia kedokteran, anatomi menjadi pondasi krusial yang memainkan peran penting dalam membentuk dokter yang kompeten.",
    funfact:    "Kuliah di prodi ini artinya harus belajar selamanya, karena materi dan hal-hal di bidang kesehatan akan terus update setiap harinya. Proses perkuliahan di prodi ini sangat panjang jika dibandingkan dengan prodi lain, karena tidak hanya 4 tahun terus lulus saja, tapi bisa ambil kuliah spesialis atau yang lainnya. Mahasiswa prodi ini jarang ikut UKM karena memang jadwalnya sangat padat. Gak cuma belajar tentang ilmu kesehatan tapi juga ilmu basic kehidupan seperti komunikasi pada sekitar dan juga keterampilan. Selain jadi dokter juga bisa jadi dosen, peneliti dsb. Setelah jadi dokter umum bisa kuliah lagi buat jadi dokter spesialis, seperti spesialis anak, spesialis penyakit dalam, spesialis bedah, dll",
    prospek:    ["Dokter umum", "Dosen", "Peneliti", "Dokter spesialis"],
  },
  "Kepelatihan Olahraga|FV": {
    akreditasi: "Baik",
    persiapan:  "Mempersiapkan video tentang latihan lari, lompat, lempar tangkap sebagai portofolio. Menampilkan cabor pribadi masing-masing. Suka mengajarkan hidup sehat lewat olahraga. Ingin memajukan dunia olahraga Indonesia.",
    matkul:     "Kecepatan, daya tahan dan Pengembangan kepribadian.",
    funfact:    "Prodi ini tidak hanya berorientasi menjadi pelatih yang berfokus untuk mencetak prestasi dari atlet, tetapi juga bagaimana memporsikan latihan fisik dan menjaga mental atlet agar tidak mengalami “burnout”. Pekerjaan sampingan mahasiswa prodi ini biasanya menjadi pelatih di sekolah-sekolah. Prodi ini bisa kuliah di Fakultas Vokasi dan juga di bisa di FIKK. Pelatih club olahrga seperti sepak bola,basket,voli dan lain lain. Pelatih di gym atau tempat kebugaran.",
    prospek:    ["Pelatih klub olahraga (sepak bola, basket, voli)", "Pelatih di gym/tempat kebugaran", "Pemandu kebugaran"],
  },
  "Keperawatan|FK": {
    akreditasi: "Baik",
    persiapan:  "Yang harus disiapkan jika masuk prodi keperawatan tentunya yaitu biaya , walaupun keperawatan unesa tergolong relatif lebih rendah dari kampus lain. lalu kesiapan mental fisik, komunikasi yang baik juga sangat penting untuk diperhatikan , selanjutnya yaitu dapat memanajemen waktu dengan baik.",
    matkul:     "Untuk matkul menarikk sihh bagi saya ada IBD (ilmu beomedik dasar) menantangg sihh karena mempelajari tentang pemahaman lebih dalam tentang tubuhh manusiaa yaa, ada antomi dan fisiologi manusiaa yang jadi favorit anak keperawatan. lalu ada matkul Psikososial dan Budaya dalam keperawatan. karena di keperawatan bukan hanya mempelajari tentang sehat sakitt tapi juga tentang keragaman budaya di indonesia yang berkaitan dengan kesehatan",
    funfact:    "Prodi dengan mahasiswa laki laki yang langka, anak anaknya random bangett kocak kocak. Apalagi dosen nyaa yang seruu sama menginspirasi banget. Kedua anak anaknya kalo nggak kedoktern ya cagur .",
    prospek:    ["Prospek kerjanya sendiri banyakk bangettt tentunya", "Berkerja di rumah sakit", "Perawat ruangan, perawat gawat darurat, perawat ICU, perawat oprasi", "Membuka klinik sendirii"],
  },
  "Kimia|FMIPA": {
    akreditasi: "Unggul",
    persiapan:  "Untuk yang perlu dipersiapkan yang pertama fisik karena di Kimia akan sering di laboratorium dengan kisaran waktu yang bisa dibilang cukup lama.",
    matkul:     "Ada mata kuliah Kimia Organik yang sering digambarkan oleh teman teman dengan mata kuliah yang banyak reaksinya. Tapi di Kimia organik ini juga, kita Belajar Teori dan Juga Praktikum yang tentunya menyenangkan karena ada berbagai judul percobaan yang harus kita coba salah satu contohnya kita belajar pembuatan sabun. Selain di Lab basah ada juga mata kuliah yang menarik yaitu ada Kimia Komputasi jadi kita juga belajar melalui Lab Kering.",
    funfact:    "di prodi Kimia ada Kunjungan Industri nya. Jadi kita belajar tidak hanya dikampus saja, kita juga bisa melihat secara langsung ke industri yang kita tuju. Seperti yang sebelumnya pernah di lakukan itu salah satunya ada kunjungan industri di PT. Amerta Indah Otsuka atau yang sudah familiar mungkin beberapa produknya ada pocari sweet, soyjoy dan beberapa produk lainnya.",
    prospek:    ["Researcher", "Farmakolog", "Analis kimia", "Analis bahan pangan"],
  },
  "Manajemen Informatika|FV": {
    akreditasi: "Baik",
    persiapan:  "Mengetahui bahasa - bahasa pemrograman Mengetahui dasar tentang dunia IT Update mengenai perkembangan teknologi",
    matkul:     "Kecerdasan Buatan / Artificial Intelligence (Al) Pemrograman Web Jaringan Komputer Pengembangan Game • Analisis Big Data",
    funfact:    "Prodi ini mempunyai banyak tugas yang terjun langsung atau praktek sehingga mahasiswa lebih berkompeten. Seperti contoh, membuat web dengan bahasa pemrograman phyton secara berkelompok. Pernah juga mahasiswa disuruh buat game dan VR (virtual reality).",
    prospek:    ["Perancang Web (Web Design)", "Programmmer (Software Developer)", "Konsultan IT", "Dosen"],
  },
  "Manajemen Olahraga|FIKK": {
    akreditasi: "Baik",
    persiapan:  "Memiliki jiwa leadership untuk memimpin suatu event olahraga. Menyukai tantangan karena dalam suatu event, masalah yang terjadi bisa beragam. Suka bersosialisasi. Menyukai apapun yang berbau olahraga, termasuk isu-isu.",
    matkul:     "Teknologi olahraga, karena disitu kita bisa berinovasi dengan membuat alat baru untuk olahraga ke depannya dan mungkin dengan alat yang kita buat bisa sampai di perjual-belikan ke instansi olahraga internasional.",
    funfact:    "Belajar di prodi ini tidak selalu praktek, karena pembelajarannya berfokus pada pembuatan event-event olahraga, mengkoordinir suatu kegiatan olahraga dan menganalisis perkembangan olahraga internasional. Jadi, prodi ini hanya berfokus dalam strategi pemasaran khusus di bidang olahraga.",
    prospek:    ["Instansi olahraga", "Guru olahraga", "Manager di klub olahraga, dan lain sebagainya"],
  },
  "Manajemen Pendidikan|FIP": {
    akreditasi: "Unggul",
    persiapan:  "Mulai memperbanyak literasi mengenai manajemen pendidikan meliputi substansi yang ada pada manajemen pendidikan.",
    matkul:     "Manajemen Start Up Pendidikan Manajemen Diklat E-office Kebijakan pendidikan Sistem Informasi Manajemen, dan lain sebagainya.",
    funfact:    "Wisudawan terbaik 106-109 FIP berasal dari Prodi MP. Terdapat program pertukaran pelajaran luar negeri (Thailand, Malaysia, China), juga ada magang internasional selama 1 semester. Terdapat program PKKM Kementerian, jadi magang di daerah seluruh Indonesia. Prodi ini juga sering dapat rekor MURI. Lulusan prodi ini juga bisa jadi kepala sekolah.",
    prospek:    ["Staff Manajemen Bidang Pendidikan", "Analisis Pendidikan", "Wirausaha Pendidikan"],
  },
  "Manajemen|FEB": {
    akreditasi: "Unggul",
    persiapan:  "Punya niat dan minat di dunia bisnis dan koporasi. Serta punya jiwa wirausaha walaupun sedikit. Terlatih dengan sesuatu yang terencana dan memikirkan resiko. Terlatih dalam kerja tim yang bisa mencapai tujuan yang sama.",
    matkul:     "Beberapa mata kuliah yang menarik untuk dipelajari adalah manajemen penjualan, karena kita akan di dihadapkan pada pengalaman real dengan pelaku usaha dalam membantu pengembangan usaha dan target penjualan usaha tersebut, sebagai gambaran kecil. Yang kedua ada perpajakan yang pastinya belajar terkait PPH, PPN dll. Yang di prodi lain mungkin Gaada, dan ini basic penting bagi yang mau ke arah Tax nantinya",
    funfact:    "Mahasiswa manajemen sangat organisatoris karena ilmu-ilmu yang dipelajari diimplementasikan dengan mengikuti organisasi kampus. Jangan berpikir bahwa di prodi ini tidak ada hitung-hitungannya, karena faktanya, hitungan dan teori hampir balance seperti contoh di matkul manajemen pemasaran. Dalam teori manajemen, kesalahan adalah investasi yang bisa menjadi modal untuk dimanifestasikan menjadi keuntungan dimasa mendatang.",
    prospek:    ["Manajer", "Pengusaha", "Marketing specialist", "Finance"],
  },
  "Masase|FIKK": {
    akreditasi: "Baik",
    persiapan:  "Memahami anatomi tubuh, perlu dihapal sejak awal untuk mempermudah kegiatan perkuliahan. Memperkuat jari-jari tangan dengan latihan handgrip.",
    matkul:     "Anatomi Fisiologi Kinisiologi Masase Dasar Deep Issue Masase Masase Cidera Masase Ibu Hamil Masase Balita Masase Remaja Beauty Masase",
    funfact:    "Karena merupakan prodi baru, banyak mahasiswa yang masih awam mengenai prodi Masase. Banyak yang mengira perkuliahannya akan mudah, padahal tidak semudah itu. Prodi Masase paling cepat menghasilkan pekerjaan dan kerjanya tidak perlu bergantung ke orang lain, cukup bermodalkan handuk dan baby oil saja. Tarif pijat Masase berbeda dengan pijat pada umumnya dan bahkan bisa 4 sampai 5 kali lipat dari tarif pijat normal.",
    prospek:    ["Terapis di sektor kesehatan", "Terapis di sektor olahraga", "Konsultan kebugaran"],
  },
  "Matematika|FMIPA": {
    akreditasi: "Unggul",
    persiapan:  "Ketika ingin mendaftar di program studi Matematika murni, calon mahasiswa baru sebaiknya mempersiapkan pemahaman yang kuat tentang konsep matematika dasar seperti aljabar, kalkulus, dan geometri.",
    matkul:     "Mata kuliah yang menarik ketika kuliah di program studi Matematika murni bisa bervariasi tergantung pada minat dan spesialisasi masing-masing. Namun, beberapa mata kuliah yang umumnya menarik termasuk Teori Bilangan, Analisis Real, Aljabar Abstrak, Geometri Diferensial, dan Pemodelan Matematika.",
    funfact:    "Matematika sendiri adalah bahasa universal yang digunakan dalam berbagai bidang ilmu dan industri, dari fisika hingga keuangan. Jadi tak hanya menghitung matematika tapi kita akan mengerti tentang logika dan analisis.",
    prospek:    ["Analis data", "Ahli keuangan", "Konsultan bisnis", "Pengembang perangkat lunak"],
  },
  "Musik|FBS": {
    akreditasi: "Baik Sekali",
    persiapan:  "Untuk berhasil masuk prodi seni musik, dibutuhkan setidaknya kemampuan memainkan dua instrumen dan pemahaman dalam membaca not balok.",
    matkul:     "Mata kuliah mayor yang selalu ada dari semester 2-5 dan ada banyak tingkatannya. Mata kuliah etnomusikologi yang nanti akan penelitian ke luar daerah untuk meneliti musik etnis atau tradisional.",
    funfact:    "Setiap kelas selalu ada piano untuk menunjang mata kuliah praktek. Ada 1 ruangan khusus alat band dan ada juga 1 ruangan khusus alat musik daerah seperti kolintang, angklung, dan alat keroncong Kuliah selalu bawa alat musik/instrumen, jarang bawa buku catatan. - Selalu ada konser gratis setiap ujian akhir semester, bisa konser dangdut, keroncong, pop maupun jazz.",
    prospek:    ["Penyanyi", "Pemain musik", "Anggota band", "Owner komunitas musik"],
  },
  "Pendidikan Administrasi Perkantoran|FEB": {
    akreditasi: "Unggul",
    persiapan:  "Planning arah karir karena prospek kerjanya beragam, agar bisa lebih fokus ke mata kuliah yang ingin didalami.",
    matkul:     "Planning arah karir, karena prospek kerjanya beragam, jadi dengan adanya plan arah karir yang diinginkan itu bisa lebih fokus ke mata kuliah yang ingin didalami. Baca visi misi prodi serta mengenal kegiatan apa saja yang ada di prodi ini karena banyak sekali kegiatan diluar perkuliahan.",
    funfact:    "Analisa sistem administrasi. Di mata kuliah ini akan banyak belajar sistem administrasi yang diterapkan di kantor atau pelayanan publik. Selain itu, kita juga diberikan project observasi untuk menganalisis sistem administrasi di suatu instansi yang melatih kemampuan mahasiswa untuk problem solving. Manajemen perbekalan. Banyak belajar mengenai sarana dan prasarana yang perlu dipersiapkan di kantor, tata cara pengadaan hingga pengelolaan inventaris perusahaan. Administrasi ekspor impor yang mempelajari mekanisme ekspor dan impor, penyimpanan di gudang/kawasan berikat dan dokumen yang diperlukan dalam ekspor impor. Belum banyak yang tahu jika prodi ini punya kelas internasional yang pembelajarannya memakai bahasa inggris begitu pun UTS dan UAS. Selalu rapi seperti mata kuliah kesekretariatan, mahasiswa diwajibkan memakai heels/fantofel. Prodi ini tidak selalu sama dengan pekerjaan sekretaris meskipun memang sama-sama mempelajari dunia kearsipan, hanya saja teknik serta fungsinya sedikit berbeda. Berbagai ilmu yang diperoleh tidak selalu dapat diaplikasikan di dalam dunia perkantoran, namun juga bisa di bidang lainnya seperti membuat home industry, rumah tangga, dan lain sebagainya.",
    prospek:    ["Guru SMK jurusan MPLB", "Staff administrasi", "Pegawai bank", "Customer service"],
  },
  "Pendidikan Akuntansi|FEB": {
    akreditasi: "Unggul",
    persiapan:  "Banyak mencari referensi mengenai akuntansi. Mulai melatih menggunakan Microsoft Excel. Sering-sering mengerjakan tugas akuntansi agar mengasah ketelitian.",
    matkul:     "Dasar dasar akuntansi Praktikum dasar dasar akuntansi Matematika ekonomi Statistik ekonomi Kurikulum sekolah Dasar dasar perbankan",
    funfact:    "Banyak melakukan kerjasama skala nasional dan internasional untuk mendukung dan mendorong pengembangkan potensi kolaborasi mahasiswa maupun dosen ke berbagai instansi seperti IPB dan kampus kampus lainnya (nasional) serta kerjasama dengan Imam Malik collage, Dubai (internasional). Tidak selalu membawa buku besar karena pembelajaran sudah berjalan mengikuti perkembangan teknologi. Bisa lebih memanage keuangannya sendiri karena mahasiswa prodi ini lebih teliti dalam menyaring dan memperhitungkan hal apa yang akan ia keluarkan dan apa yang akan ia dapatkan.",
    prospek:    ["Guru", "Dosen", "Konsultan keuangan", "Bekerja di bank"],
  },
  "Pendidikan Bahasa Inggris|FBS": {
    akreditasi: "Unggul",
    persiapan:  "Yang paling utama disiapkan adalah kemampuan bahasa Inggris basic (speaking, listening dan writing) serta kepercayaan diri. Kalaupun bahasa Inggris masih belum sepenuhnya bisa, setidaknya harus percaya diri saat berbicara menggunakan bahasa Inggris.",
    matkul:     "Mata kuliah Intercultural Communication yang biasanya dosen akan sharing pengalaman perbedaan budaya yang sangat berpengaruh ke pemahaman bahasa.",
    funfact:    "Punya platform khusus untuk para mahasiswa dan guru bahasa Inggris untuk upload LKPD yang bernama NCELTMAD. Platformnya bisa diakses secara umum dan sudah diakui oleh beberapa lembaga pendidikan. Sering mendatangkan dosen tamu dari luar negeri.",
    prospek:    ["Guru bahasa Inggris", "Private Tutor", "Translator", "Contentwriter"],
  },
  "Pendidikan Bahasa Jepang|FBS": {
    akreditasi: "Unggul",
    persiapan:  "Harus mulai tau basic bahasa jepang seperti huruf, kosakata dasar, ucapan dan lain sebagainya. Tapi tidak perlu kuatir karena akan belajar dari nol",
    matkul:     "Ada mata kebahasaan utama yang sangat menarik untuk dipelajari seperti Hanashikata, Hyoki, Chokai, dan Sakubun.",
    funfact:    "Mahasiswa prodi ini punya branding yang cukup baik di fakultas bahkan univ karena rata rata mahasiswanya magang di Jepang seperti di Hokkaido dan Okinawa.",
    prospek:    ["Guru sekolah", "Guru LPK", "Interpreter", "Hospitality"],
  },
  "Pendidikan Bahasa Jerman|FBS": {
    akreditasi: "B",
    persiapan:  "Bisa belajar secara mandiri seputar dasar bahasa Jerman seperti cara pengucapan abjad bahasa Jerman, kosakata dasar seperti menyapa orang lain, memperkenalkan diri sendiri dan kata benda yang ada di sekitar.",
    matkul:     "Ada mata kuliah “Literatur im Deutsch Unterricht” yaitu matkul mengenal budaya dan kebiasaan yang ada di negara Jerman. Dan juga ada matkul “Reiseleitung” yang kegiatannya menjadi tourguide berbahasa Jerman.",
    funfact:    "Prodi ini aktif memberikan info beasiswa magister, pertukaran mahasiswa serta lowongan kerja ke Jerman yang mencetak banyak sekali prestasi membanggakan",
    prospek:    ["Guru bahasa jerman", "Dosen", "Tenaga Kerja di Jerman"],
  },
  "Pendidikan Bahasa Mandarin|FBS": {
    akreditasi: "Baik Sekali",
    persiapan:  "Mulai belajar nada & pengucapan karena bahasa mandarin itu jika salah nada artinya juga bisa salah.",
    matkul:     "Ada mata kuliah pembelajaran bahasa mandarin untuk anak, karena ini prodi pendidikan jadi juga diajarkan membuat media maupun pembelajaran bahasa mandarin yang semenarik dan sebaik mungkin untuk anak anak.",
    funfact:    "Pasti akan mendapatkan dosen native di setiap semester, jadi kita dapet kesempatan untuk belajar dengan penutur tiongkok asli. Di prodi mandarin juga banyak sekali event budaya, seperti seni lukis tiup dan paper cutting. Tidak hanya itu, terkadang dosen juga menyelipkan pengenalan budaya di kelas seperti pengenalan kerajinan tiongkok dll.",
    prospek:    ["Tour guide mandarin", "Bekerja di perusahaan internasional", "Guru mandarin", "Dosen mandarin"],
  },
  "Pendidikan Bahasa dan Sastra Indonesia|FBS": {
    akreditasi: "Unggul",
    persiapan:  "Niat dan keberanian buat bersuara, karena nantinya kita akan dilatih menjadi pengajar, jadi perlu untuk berani bersuara, berani menjelaskan dan mengajarkan. Suka membaca. Bahkan untuk memahami suatu pengetahuan tidak bisa jika hanya mendengar penjelasan saja, kita juga perlu membaca dari banyak referensi.",
    matkul:     "BIPA (bahasa Indonesia bagi penutur asing). Kita bisa belajar banyak kebudayaan, selain kita harus mengenal budaya Indonesia, kita nantinya juga belajar budaya asing agar kita tau karakteristik dari pelajar asing. Karena di matkul ini mempersiapkan untuk mengajari orang-orang asing berbahasa Indonesia. Karena itu kita harus paham tentang budaya dan bahasa indonesia. BI untuk ABK kita bisa lebih mengeksplor cara komunikasi dengan anak berkebutuhan khusus.",
    funfact:    "Saat pembelajaran BIPA (Bahasa Indonesia bagi Penutur Asing), kita belajar bersama orang asing, belajar mengenal budaya sendiri dan budaya orang luar. Mahasiswa prodi ini memiliki sensitifitas tinggi terhadap bahasa dibandingkan mahasiswa prodi lain.",
    prospek:    ["Pengajar untuk penutur asing", "Sastrawan", "Sutradara", "Copywriter"],
  },
  "Pendidikan Bahasa dan Sastra Jawa|FBS": {
    akreditasi: "Unggul",
    persiapan:  "Setidaknya sudah fasih berbahasa jawa karena berinteraksi didalam maupun diluar perkuliahan selalu memakai bahasa Jawa Krama.",
    matkul:     "Filologi (pengkajian dari naskah naskah kuno) Sastra Jawa Pesisiran (meneliti naskah kuno ber-aksara arab pegon) Kearifan lokal (mempelajari tradisi suatu daerah & keterampilan yang dihasilkan oleh suatu daerah itu)",
    funfact:    "Ada pertukaran dengan mahasiswa china dan madagascar. Perkuliahan sering pulang pagi karna kebanyakan kegiatan dilakukan ketika malam hari. Seperti latihan ludruk, wayang dan karawitan.",
    prospek:    ["Penabuh gamelan", "Sinden", "Dalang", "Budayawan"],
  },
  "Pendidikan Biologi|FMIPA": {
    akreditasi: "Unggul",
    persiapan:  "Prodi ini terdapat praktikum dengan hewan yaitu melakukan pembedahan dan itu diperlukan tingkat keberanian yang tinggi dan tidak boleh jijik.",
    matkul:     "Biodiversitas, karena matkul itu mempelajari tentang bagaimana mengeksplor keanekaragaman dan kepercayaan sekitar yang berhubungan dengan pelestarian lingkungan.",
    funfact:    "Bersentuhan langsung dengan alam karena praktikum lapangannya sering menjelajahi hutan atau sering disebut Jelajah Alam Sekitar. Mahasiswa bisa langsung melihat dan menganalisis tanaman yang ada di pengunungan dan juga menganalisis flora fauna yang sangat unik dan bermacam macam tentunya. Guru, Staff TU Laboran Sekolah Kemendikbud Dosen, dan lain sebagainya.",
    prospek:    ["Guru Biologi", "Laboran sekolah", "Peneliti", "Dosen"],
  },
  "Pendidikan Bisnis|FEB": {
    akreditasi: "Unggul",
    persiapan:  "Mengikuti perkembangan dunia bisnis, mulai membaca berita bisnis atau tren ekonomi terkini agar lebih siap saat kuliah. Mengembangkan kreativitas karena banyak tugas dan proyek yang membutuhkan ide-ide inovatif dalam bisnis. Mengasah kemampuan komunikasi, karena ada fokus pedagogi, kemampuan berbicara dan mengajar penting untuk dipersiapkan.",
    matkul:     "Perilaku Konsumen Strategi Pemasaran Kewirausahaan Manajemen Keuangan",
    funfact:    "Kurikulum yang terintegrasi dengan industri. Kegiatan mahasiswa yang beragam. Fokus pada kewirausahaan, sering mengadakan pelatihan kewirausahaan dan memiliki komunitas bisnis mahasiswa yang aktif untuk menciptakan banyak startup kecil.",
    prospek:    ["Pelatih", "Konsultan Bisnis", "Entrepreneur", "Pegawai di sektor korporat"],
  },
  "Pendidikan Ekonomi|FEB": {
    akreditasi: "Unggul",
    persiapan:  "Belajar ekonomi berarti harus siap bersahabat dengan matematika karena dalam memecahkan masalah perekonomian, diperlukan analisis matematika yang tajam.",
    matkul:     "Teori ekonomi makro dan dasar kependidikan.",
    funfact:    "Prodi ini merupakan domain penelitian lintas disiplin yang memanfaatkan prinsip-prinsip dari bidang matematika, statistik, ilmu politik, dan bahkan psikologi untuk menganalisis perilaku ekonomi. Kegiatan studi melibatkan analisis kebijakan ekonomi, di mana mahasiswa menyelidiki efek langkah-langkah pemerintah terhadap pertumbuhan ekonomi, tingkat inflasi, tingkat pengangguran, dan stabilitas keuangan. Partisipasi dalam studi ekonomi membantu mahasiswa mengasah keterampilan kritis dalam memecahkan masalah berdasarkan data. Prinsip-prinsip ekonomi secara langsung berkaitan dengan kehidupan sehari-hari.",
    prospek:    ["Tenaga pendidik/guru profesional, peneliti ekonomi, hingga manajer dalam bidang pendidikan ekon"],
  },
  "Pendidikan Fisika|FMIPA": {
    akreditasi: "Unggul",
    persiapan:  "Memiliki pemahaman terkait fisika dasar karena ketika di semester awal, kita sudah tidak belajar lagi terkait dasar-dasar fisika di SMA, melainkan sudah ke pemahaman yang lebih luas.",
    matkul:     "IPBA (Ilmu Pengetahuan Bumi Antariksa). Bukan hanya belajar tentang bumi, kita juga akan belajar tentang antariksa. Lalu ada juga argumentasi fisika, dimana kita diharapkan bisa lebih kritis untuk menelaah miskonsepsi dalam ilmu fisika.",
    funfact:    "Kemana-mana bawa laprak atau laporan praktikum. Kebanyakan anak fisika selalu bawa ransel, karena jika bawa totebag khawatirnya skoliosis gara gara keberatan dengan lapraknya sendiri, dan seminggu itu ada 4 laprak yang harus dikerjakan. (ini funfact ga ya?) Selain itu, prodi ini isinya bukan tentang perhitungan saja, tetapi juga praktek untuk membuktikan gaya gravitasi, newton, dan lain sebagainya.",
    prospek:    ["Peneliti mesin/alat di pabrik", "Research and development", "Scientist", "Dosen fisika"],
  },
  "Pendidikan Geografi|FISIPOL": {
    akreditasi: "Unggul",
    persiapan:  "Memiliki kepekaan tinggi terhadap lingkungan alam khususnya ilmu bumi dan bagaimana memahami timbal-balik manusia dengan alam.",
    matkul:     "Kartografi, Sistem Informasi Geografis Dasar dan Lanjut, Penginderaan Jauh, Geografi Kebencanaan, Ilmu Ukur Tanah, dan Kosmografi.",
    funfact:    "Tidak hanya menyelami aspek IPS, tetapi juga mendalami IPA. Mulai dari menghitung debit air, mengukur gelombang tsunami, hingga menentukan kualitas tanah, membuktikan bahwa ilmu Fisika, Kimia, dan Biologi sangat diperlukan di sini.",
    prospek:    ["Guru", "Dosen", "BMKG", "Lembaga penelitian"],
  },
  "Pendidikan Guru PAUD|FIP": {
    akreditasi: "Unggul",
    persiapan:  "Memperbanyak literasi terhadap pengetahuan seputar Anak Usia Dini yang bersumber dari buku hingga jurnal. Menjalin hubungan baik kepada masyarakat terutama kepada para orang tua, karena prodi ini nantinya akan sering mendapatkan pembelajaran terkait menganalisis segala aspek perkembangan hingga segala macam permasalahan pada anak usia dini, tentu diperlukan hubungan yang baik dengan orang tua anak demi menciptakan solusi yang tepat.",
    matkul:     "Media dan sumber belajar AUD merupakan pembelajaran yang dapat meningkatkan kemampuan kita untuk menciptakan media pembelajaran yang menarik bagi anak usia dini. Karya cipta musik AUD yang memberikan kesempatan mahasiswa untuk belajar langsung dalam menyusun lagu yang edukatif pada anak usia dini.",
    funfact:    "Prodi ini sangat dikenal dengan mahasiswanya yang memiliki kesabaran ekstra dan telaten terutama dalam menghadapi anak.",
    prospek:    ["Asesor PAUD", "Instansi pemerintah di bidang Pendidikan", "Unit Pelaksana Teknis bidang pendidikan", "Konsultan Parenting"],
  },
  "Pendidikan Guru Sekolah Dasar (PGSD)|FIP": {
    akreditasi: "Unggul",
    persiapan:  "Memiliki kesabaran yang luas dan hati yang lebih ikhlas karena akan banyak kejadian yang tidak terduga. Harus bisa menjadi ibu dengan 30 kepala dalam sehari.",
    matkul:     "Psikologi pendidikan karena belajar bagaimana psikologi anak SD. Pendidikan Inklusif agar kita bisa tahu bagaimana treatment khusus.",
    funfact:    "Prodi ini tidak hanya belajar hal yang bersifat akademis, tetapi juga belajar hal yang berkaitan dengan perkembangan kepribadian anak. Dikenal dengan prodi yang menyenangkan karena sering berinteraksi dengan anak-anak kecil.",
    prospek:    ["Guru SD", "Dosen", "Guru privat"],
  },
  "Pendidikan IPS|FISIPOL": {
    akreditasi: "Unggul",
    persiapan:  "Harus siap dalam aspek pengetahuan sosial yang luas. Karena prodi ini tidak hanya belajar tentang masalah sosial namun juga ilmu kemaritiman dan ilmu politik",
    matkul:     "Matkul PLK (perkuliahan luar kelas) Pendidikan IPS, dimana mahasiswa dapat melakukan observasi dan penelitian secara langsung di lapangan terkait rumpun yg sesuai dengan prodi ini dan dapat berlatih untuk berkomunikasi dengan masyarakat secara langsung serta dilakukan di luar kota sehingga menarik untuk meneliti kondisi sosial, budaya dan objek geografi dari kondisi masyarakat di lapangan sebenarnya, sehingga matkul PLK ini menjadi pengalaman bermakna bagi mahasiswa IPS untuk terjun penelitian di masyarakat.",
    funfact:    "Ada program “Virery” yaitu mengunjungi museum-museum yang ada di Surabaya. Progam ini dilakukan setiap tahun dengan output artikel/karya tulis hasil riset lapangan. Prodi ini memiliki kedekatan sosial tinggi, memiliki ruang untuk social movement yang kuat terhadap problematika sosial bahkan keuntungan sosial. Mahasiswa prodi ini cenderung punya jiwa humanis yang lebih. Jiwa sosialis mereka yang sangat kental bikin mereka jadi pribadi yang nggak bisa lihat orang lain susah",
    prospek:    ["Prospek kerja di prodi ini", "Guru IPS di jenjang SMP, namun tidak menutup kemungkinan juga, lulusan ini", "Peneliti sosial, pegawai bank dan pekerjaan, wirausahawan, dan sebagainya"],
  },
  "Pendidikan Ilmu Pengetahuan Alam|FMIPA": {
    akreditasi: "Unggul",
    persiapan:  "Tak hanya harus siap balance untuk pemahaman materi biologi, kimia dan fisikanya, namun juga harus mempersiapkan pemahaman yang cukup untuk matematika dasar.",
    matkul:     "Anatomi dan fisiologi hewan Konservasi SDA dan lingkungan Mikrobiologi terapan Kimia bahan pangan",
    funfact:    "Mahasiswa pendidikan IPA tak jarang sering terbalik rumus dan materi saat mengerjakan praktikum serta laprak karena kita dituntut untuk bisa menguasai 3 cabang studi yaitu fisika, biologi dan kimia.",
    prospek:    ["Guru IPA", "Guru lembaga", "Dosen", "Teknisi laboratorium"],
  },
  "Pendidikan Jasmani, Kesehatan, dan Rekreasi|FIKK": {
    akreditasi: "Unggul",
    persiapan:  "Menyiapkan fisik dan juga mental. Karena di prodi ini tidak hanya fisik yang dipersiapkan, melainkan mental sebagai tenaga pendidik yang berorientasi ke guru olahraga.",
    matkul:     "Mata kuliah berkuda Massase (Poin + nya banyak karna merupakan masase kebugaran) Terdapat olahraga pilihan di semester 3 (sesuai minat)",
    funfact:    "Prodi Tertua di FIKK UNESA. Prodi dengan peminatan tinggi di FIKK update di tahun 2022. Kuliah sambil kerja juga sudah biasa di prodi ini karena semasa kuliah sudah ada yang part-time mengajar sesuai cabor di sekolah- sekolah. Ospek Maba rambutnya harus dibotakin. Jarang ada matkul di kelas, kebanyakan praktek jadi sering pakai jersey. Sekalinya ada kelas wajib kemeja berkerah, berdasi, dan pakai fantofel.",
    prospek:    ["Guru PJOK", "Dosen", "Perwira Karir", "Enterpreneur"],
  },
  "Pendidikan Kepelatihan Olahraga|FIKK": {
    akreditasi: "Unggul",
    persiapan:  "Karateristik dalam bidang olahraga harus baik. Memiliki kebugaran jasmani yang bagus. Mampu menguasai cabor umum yang ada di dalam olahraga. Belajar melatih Masase Periodesasi latihan/membuat progam latihan untuk atlet Ilmu gizi (kebutuhan untuk atlet) Membuat RPP",
    matkul:     "Memunculkan inovasi-inovasi baru di bidang olahraga. Seperti contoh, cabang olahraga baru yang belum ada di Indonesia. Salah satu dosen yang mengembangkan olahraga tersebut menamainya dengan olahraga crofball. Tugas praktek mendominasi. Mata kuliah periodesasi menjanjikan mahasiswa menjadi pelatih profesional karena sistem progam latihan yang menggunakan sistem olahraga Eropa. Pelatih (coach) Pendidik (guru)",
    funfact:    "Prodi ini memunculkan inovasi-inovasi baru di bidang olahraga, seperti cabang olahraga baru yang belum ada di Indonesia.",
    prospek:    ["Pelatih (coach)", "Pendidik (guru)", "Pengelola program latihan"],
  },
  "Pendidikan Kimia|FMIPA": {
    akreditasi: "Unggul",
    persiapan:  "Mahasiswa yang daftar di prodi ini wajib hafal minimal tabel periodik golongan 1-8. (2) Tidak boleh takut sama bahan-bahan kimia karena hampir semua bahan kimia memiliki karakteristiknya masing-masing.",
    matkul:     "Salah satunya BioKimia karena dalam matkul tersebut mahasiswa mengetahui berbagai macam metabolisme dalam makhluk hidup yang sangat dipengaruhi oleh reaksi-reaksi kimia. Selain itu ada juga matkul kimia Kuantum yang mana kita bisa menafsirkan cara kerja dan energi dari partikel atom-atom yang dari suatu komponen kimia.",
    funfact:    "Sering melakukan praktikum yang seru seputar dengan materi Kimia yang nantinya akan diajarkan. Ketika orang awam memandang mahasiswa prodi ini, mereka langsung membayangkan sebagai seorang mahasiswa jenius yang menghafal semua rumus kimia.",
    prospek:    ["Prospek kerja prodi ini salah satunya dan paling diandalkan adalah", "Meneruskan", "Tenaga kerja pendidikan baik guru, maupun dosen. Adapun pekerjaan yang relevan juga di lingkup"],
  },
  "Pendidikan Luar Biasa|FIP": {
    akreditasi: "Unggul",
    persiapan:  "Memperbanyak informasi terkait anak-anak berkebutuhan khusus baik melalui pengalaman langsung pada komunitas atau melalui media sosial dan buku.",
    matkul:     "Tumbuh kembang anak berkebutuhan khusus Bahasa isyarat Bbraille Bina diri Bina bicara Bina gerak Orientasi Mobilitas Modifikasi perilaku",
    funfact:    "Prodi ini memiliki jargon “ABK Bisa ABK Istimewa” karena anak berkebutuhan khusus sering dipandang sebelah mata sehingga dibuatnya jargon itu untuk memotivasi ABK dan masyarakat agar tidak skeptis terhadap ABK. Tidak semua orang bisa menjalani di prodi ini karena hanya orang-orang terpanggil dan istimewa dati hati untuk bisa ikhlas memahami kondisi psikolog dan biologis ABK.",
    prospek:    ["Guru SLB", "Guru inklusi", "Dosen", "Interpreter"],
  },
  "Pendidikan Luar Sekolah|FIP": {
    akreditasi: "A",
    persiapan:  "Mental bersosialisasi karena akan sering terlibat dalam masyarakat. Memperkuat bacaan terkait lembaga pendidikan dan masyarakat. Jika dari SMA IPS, lebih ditingkatkan belajar PPKN dan sosiologi karena akan mempermudah untuk memahami prodi ini.",
    matkul:     "Isu Dalam Pendidikan, Pemberdayaan Masyarakat, Difusi Inovasi, Pendidikan Keluarga,",
    funfact:    "PAUD, Antropologi, dsb. Di prodi ini lebih sering dilakukan kuliah lapangan bersama masyarakat. Seperti contoh, menganalisis masyarakat Suku Tengger yang dikaji melalui kacamata sosiologi antropologi, serta melakukan dinas sosial ke kawah ijen bersama Ditjen Paud berupa studi banding.",
    prospek:    ["Bekerja di lembaga swasta dan lembaga swadaya masyarakat (LSM)", "Tentor, pengajar privat, dan lain sebagainya (bidang pendidikan dan sosial)", "Mendirikan lembaga sendiri. Seperti contoh, terdapat lulusan di prodi ini yang", "Dosen namun juga mendirikan PKBM (Pusat Kegiatan Belajar Mengajar) yang memiliki progam Kejar P"],
  },
  "Pendidikan Matematika|FMIPA": {
    akreditasi: "Unggul",
    persiapan:  "Tidak perlu menyiapkan hal yang mendetail. Yang penting niat dan suka sama angka. Meskipun pada faktanya kita tidak hanya belajar menghitung seperti ekspektasi orang-orang pada umumnya tapi juga bagaimana membuktikan bahwa sesuatu itu bernilai benar.",
    matkul:     "Ada mata kuliah RME (Realistic Mathematics Education) yang kita akan belajar bagaimana matematika itu sangat berkaitan dengan kehidupan sehari-hari, disini juga diajarkan bagaimana konsep menyelesaikan sebuah masalah matematika tapi menggunakan logika saja.",
    funfact:    "Di prodi ini, itu belajar arti kehidupan. Contohnya, untuk mendapatkan hasil 10 itu tidak harus 5+5, melainkan bisa juga 9+1, 6+4, dan lain sebagainya, yang berarti untuk mendapatkan solusi, penyelesaian masalah juga bisa beragam. Tidak hanya tentang berhitung saja, tetapi menyelesaikan masalah matematika juga bisa menggunakan logika.",
    prospek:    ["Guru", "Guru lembaga", "Dosen"],
  },
  "Pendidikan Pancasila dan Kewarganegaraan|FISIPOL": {
    akreditasi: "Unggul",
    persiapan:  "Perbanyak membaca buku tentang Indonesia seperti filsafat pancasila, perbandingan ideologi, dan sejarah pemerintahan. Kemampuan analisa kondisi lingkungan terhadap isu-isu pemerintahan dalam negeri.",
    matkul:     "Logika Berpikir Ilmiah merupakan matkul baru yang mengajarkan mahasiswa bagaimana berpikir secara logis.",
    funfact:    "Prodi ini mempelajari semua hal tentang negara Indonesia, termasuk belajar hukum, geografi, sejarah, dan lain sebagainya yang berhubungan dengan bidang sosial dan politik. Selain itu, implementasi yang dilakukan mahasiswa prodi ini bukan sekadar tanggung jawab akademis, tapi juga menjalani beban moral yang lebih besar. Di sini, etika dan moral menjadi landasan kuat dalam setiap aspek pembelajarannya.",
    prospek:    ["Prospek kerja di prodi ini kebanyakan", "Guru ataupun dosen, tapi tidak sedikit juga yang", "Anggota dewan di DPR maupun bekerja di instansi pemerintahan"],
  },
  "Pendidikan Sejarah|FISIPOL": {
    akreditasi: "Unggul",
    persiapan:  "Mempunyai kemampuan dasar keahlian analisis dan observasi karena bakal banyak menganalisis kejadian sejarah. Harus siap untuk membaca buku buku tebal seperti",
    matkul:     "Arkeologi, matkul ini sebagai matkul pembantu dalam keilmuan sejarah. Kurang lebih seperti pada jurusan arkeologi, dimana kita dituntut menganalisis dataran untuk pencarian benda benda bersejarah. Matkul ini nantinya akan praktek langsung di lapangan, sehingga nantinya akan mendapat pengalaman yang mirip dengan sebenarnya. Museologi, ini juga merupakan matkul pembantu dalam keilmuan sejarah. Matkul ini mempelajari manajemen museum dalam menampilkan barang barang berharga. Nantinya akan ada penugasan untuk membuat pameran museum pada akhir minggu perkuliahan.",
    funfact:    "Belajar sejarah bukan sekadar menggali peristiwa masa lalu yang mungkin dianggap membosankan oleh sebagian orang. Sebaliknya, di dalamnya terdapat nilai penting sebagai sarana pembelajaran untuk masa kini dan masa depan. Terlihat dari mata kuliah seperti Sejarah Pergerakan Nasional, di mana kita dapat memahami dampak dan risiko dari peristiwa masa lalu yang bisa saja kembali terulang di masa sekarang dan mendatang.",
    prospek:    ["Tenaga Pendidik", "Tour guide museum", "Bidang Pariwisata", "Budayawan"],
  },
  "Pendidikan Seni Drama, Tari, dan Musik|FBS": {
    akreditasi: "Unggul",
    persiapan:  "Prodi ini sebagai bagian dari pendidikan seni, tak dapat terlepas dari praktik dan portofolio. Penting untuk memfokuskan isi portofolio dengan aktif berpraktik tari, berdrama (monolog), dan bermusik. Menambahkan rekam jejak dengan sertifikat kesenian (drama, tari, musik) akan menjadi nilai tambah, mendukung, dan memperkaya portofolio teman-teman maba.",
    matkul:     "Kebanyakan mahasiswa sendratasik lebih menyukai mata kuliah praktek dibandingkan teori seperti Koreografi, Seni Peran, dan Aransemen musik. Walaupun dengan mata kuliah praktek yang menguras waktu dan tenaga, tapi disini kita ditempa untuk lebih mendalami kesenian dalam segi karya maupun manajemen pementasannya.",
    funfact:    "Selalu ada pentas kolaborasi antar KKM (UKM Prodi) untuk lebih dapat menggali ilmu kesenian seperti pertunjukkan teater. Selalu mengikuti festival seni yang berkaitan dengan prodi bahkan mengadakan festival seni tingkat nasional dengan mencakup seni drama, tari, dan musik.",
    prospek:    ["Guru praktisi seni", "Seniman", "Kritikus seni", "Instansi pemerintahan"],
  },
  "Pendidikan Seni Rupa|FBS": {
    akreditasi: "A",
    persiapan:  "Harus punya skill gambar mumpuni yang siap diaplikasikan kebanyak disiplin lain. Karena di prodi ini tidak hanya menggambar saja, tapi ada seni kriya kayu, seni patung dan lainnya.",
    matkul:     "Mata Kuliah Tinjauan Seni karena tugas akhirnya melakukan kunjungan ke Bali/Jogja untuk memaknai setiap lukisan yang ada di galeri/museum serta dapat berbincang santai bersama para seniman untuk bertukar pikiran.",
    funfact:    "Terdapat acara yang dihadirkan untuk memberikan hiburan sejenak di tengah gempuran tugas kuliah, yaitu SRD Fest yang memberikan kesempatan pada mahasiswa untuk merasakan pengalaman seru DJ bareng di kampus, menantang diri dalam berbagai lomba, dan merasakan kegembiraan melalui game seru. Gedung Seni Rupa adalah satu satunya gedung kampus Lidah Wetan yang tidak pernah mati lampunya karena mahasiswanya selalu berkegiatan nonstop sehingga sudah seperti di rumah sendiri.",
    prospek:    ["Guru Seni Rupa", "Guru privat menggambar", "Seniman", "Designer"],
  },
  "Pendidikan Tata Boga|FT": {
    akreditasi: "A",
    persiapan:  "Tentu saja keterampilan memasak seperti mengolah makanan dengan memperhatikan rasa serta menyajikan makanan dengan memperhatikan estetika.",
    matkul:     "Sebenarnya ada banyak matkul menarik setiap semesternya yang pernah dipelajari, di antaranya: matkul ilmu kesejahteraan keluarga, matkul gelar cipta, dan matkul pastry bakery.",
    funfact:    "Di prodi ini, ada 1 mata kuliah khusus, yaitu mata kuliah gelar cipta yang memberikan kesempatan bagi mahasiswa tata boga untuk menciptakan dan menampilkan produk makanan hasil inovasi tersebut dalam kegiatan gelar cipta yang dihadiri oleh banyak pengunjung. Terdapat usaha katering milik prodi yaitu Boganesa untuk mewadahi hasil olahan mahasiswa tata boga",
    prospek:    ["Guru", "Buka kursus boga", "Eirausaha", "Kerja"],
  },
  "Pendidikan Tata Busana|FT": {
    akreditasi: "B",
    persiapan:  "Mempersiapkan alat dan bahan praktek untuk menunjang perkuliahan di prodi ini. Seperti mesin jahit, alat jahit, alat buat pola dan masih banyak lagi.",
    matkul:     "Busana Custom Made dan busana pengantin, karena di dua matkul itu hasil jadi busana dipertunjukkan. Sehingga bisa memperkenalkan hasil produk secara luas.",
    funfact:    "Tiap baju yang dipakai sering dikira jahit sendiri. Anak busana tidak harus bisa jahit saja, tapi bisa juga jadi anak teknisi mesin jahit.",
    prospek:    ["Desainer, guru SMK busana, pengusaha, fashion stylist, konsultan fashion, dan lain sebagainya"],
  },
  "Pendidikan Tata Rias|FT": {
    akreditasi: "Unggul",
    persiapan:  "Wajib memahami ilmu dan basic skill terutama di bidang kecantikan seperti tata rias wajah, penataan rambut/ hair styling/ coloring, dan masih banyak lagi. Selain itu, modal yang dibutuhkan juga cukup banyak untuk membeli peralatan rias sendiri.",
    matkul:     "Tata Rias Pengantin Jawa, Nusantara & Internasional Tata Rias Fantasi Pewarnaan dan Penataan Rambut Pangkas Rambut Dasar & Design Perawatan Kulit Wajah SPA (Solus Per Aqua) Gizi Kecantikan, dll..",
    funfact:    "Hampir semua mahasiswa di prodi ini mempunyai usaha sendiri, seperti wedding galery, salon kecantikan, freelance hair stylist, MUA, dan lain sebagainya. Oleh karena itu, mereka sudah lebih mandiri dan bisa menghasilkan uang dari bisnisnya.",
    prospek:    ["Guru Kecantikan", "Make-up Artist", "Beautician", "Hair Stylist"],
  },
  "Pendidikan Teknik Bangunan|FT": {
    akreditasi: "Unggul",
    persiapan:  "Tertarik dengan bangunan, mulai dari awal pembuatan hingga selesai. Gemar membaca buku bangunan, fisika, matematika dan punya keterampilan dalam memahami model pembelajaran. Memiliki skill menggambar.",
    matkul:     "Rekayasa Irigasi dan Bangunan air, karena belajar cara melakukan pembangunan di daerah berair dan memahami rekayasa pengairan untuk membuat bangunan di lahan miring.",
    funfact:    "Banyak praktikum di bengkel atau lab yang seru dan unik, cocok bagi mahasiswa yang suka tantangan dan hitung-hitungan. Tak hanya itu, ada juga divisi Sunrise yang rutin terlibat dalam Kompetisi Jembatan Balsa, menambah keseruan di dunia perkuliahan.",
    prospek:    ["Guru SMK", "Dosen", "Pekerja bidang Teknik Sipil (Kontraktor, Pengawas, dll.)", "Pemilik perusahaan"],
  },
  "Pendidikan Teknik Elektro|FT": {
    akreditasi: "A",
    persiapan:  "Hal pertama yang harus dipersiapkan mahasiswa baru adalah sering-sering lah membaca buku tentang “kelistrikan”. Lalu, perkuat pemahaman tentang penghitungan arus, tegangan dan daya serta rumus-rumus seperti hukum ohm, hukum Kirchhoff, hukum Newton dil. Selain itu membaca buku yang bertema Pendidikan seperti strategi pembelajaran, metode pembelajaran, dan lain sebagainya. Sehingga bisa seimbang antara ilmu Pendidikan dan ilmu keteknikannya.",
    matkul:     "Perencanaan dan instalasi listrik tenaga mempelajari tentang bagaimana cara membuat sebuah projek sederhana menggunakan kontak bantu seperti Kontaktor dan Tor untuk menggerakkan motor listrik 3 fasa. Mata kuliah ini sangat menarik karena selain memahami teori tentang instalasi listrik, kita juga dapat mempraktekkan teori tersebut dengan cara membuat sebuah rangkaian DOL untuk menggerakkan motor listrik.",
    funfact:    "Yang melekat dari prodi ini adalah “rasa kekeluargaan” yang sangat kental untuk semua angkatan. (2) Banyak mahasiswa yang tidur di Laboratorium karena projectnya sampai tengah malam. Bahkan, banyak yang berpendapat bahwa lebih baik tidur di lab daripada membayar kos. Tenaga Pendidik (guru, instruktur, dan tutor) di bidang pendidikan teknik elektronika. Teknisi, Pelaksana Pengawas di bidang pendidikan teknik elektronika. Supervisor, advisor di bidang pendidikan teknik elektronika",
    prospek:    ["Tenaga pendidik teknik elektronika", "Teknisi listrik", "Instruktur kejuruan", "Supervisor bidang elektronika"],
  },
  "Pendidikan Teknik Mesin|FT": {
    akreditasi: "Unggul",
    persiapan:  "Harus menyukai matematika dan fisika karena akan sangat banyak dibahas ketika perkuliahan. Memperbaiki skill dasar untuk service motor ataupun mobil yang akan berguna saat praktek nanti.",
    matkul:     "Matkul yang menarik tentunya CAD/CAM yang mempelajari tentang desain mesin",
    funfact:    "Sering dikenal sebagai teknisi motor. Jadi kalo motor sendiri lagi rusak, gak perlu ke bengkel, tinggal diservis sendiri. Sama seperti prodi lain, di prodi ini budaya yang mengedepankan kesolid-an dalam pertemanan. Banyak tugas yang harus diselesaikan secara bersama-sama, sehingga membuat mahasiswa Pendidikan Teknik Mesin suka untuk berkumpul. Tenaga pendidik, guru SMK, instruktur pelatihan kejuruan, supervisor dan servis advisor pada industri manufaktur dan jasa otomotif, tekno-preneurship, peneliti muda, pengerak inovasi industri mikro-menengah, dosen, PNS, dan lain sebagainya.",
    prospek:    ["Tenaga pendidik teknik mesin", "Guru SMK", "Instruktur pelatihan kejuruan", "Supervisor industri manufaktur"],
  },
  "Pendidikan Teknologi Informasi|FT": {
    akreditasi: "B",
    persiapan:  "Mulai membelajari dasar-dasar pemograman, algoritma pemograman, mulai mengenal bahasa bahasa pemograman, dan siap untuk begadang.",
    matkul:     "Jaringan komputer, akan lebih mudah dan menyenangkan jika mempunyai basic dalam network engineer. Apalagi ketika penjurusan, akan lebih ahli lagi kita memahami tentang jaringan komputer lanjut",
    funfact:    "Prodi ini tidak selalu tentang ngoding, banyak sekali yang dapat kita pelajari selain itu, seperti contoh diajarkan bagaimana menjadi pendidik yang baik, membuat UI/UX dengan baik, basis data, dan juga jaringan komputer.",
    prospek:    ["Programmer", "UI designer", "Data analyst", "Software engineer/ developer"],
  },
  "Perencanaan Wilayah dan Kota|FT": {
    akreditasi: "Baik",
    persiapan:  "Pemahaman dasar tentang PWK dan fokus kajiannya. Memperbanyak wawasan tentang isu tata kota, seperti transportasi, perubahan iklim, dan pengelolaan sumber daya. Niat dan motivasi yang kuat untuk menghadapi tantangan kuliah di PWK.",
    matkul:     "Kependudukan dan Perencanaan Tapak, yakni mata kuliah yang membahas proses dan tahapan perencanaan tapak, baik di area perkotaan maupun pedesaan.",
    funfact:    "Memiliki angkatan pertamanya di tahun 2024. Banyak dosen baru di prodi Perencanaan Wilayah dan Kota. Materi perkuliahan berada di antara Arsitektur dan Sipil.",
    prospek:    ["Konsultan", "Instansi Pemerintahan", "Sektor transportasi dan infrastruktur"],
  },
  "Psikologi|FPSI": {
    akreditasi: "B",
    persiapan:  "Memiliki ketertarikan dalam mempelajari perilaku manusia. Memiliki kemampuan berkomunikasi yang baik. Memiliki empati yang tinggi.",
    matkul:     "Psikologi Kepribadian, serta masih ada banyak mata kuliah lainnya yang menarik. Usahakan pendalaman materi di semester 1 karena di semester berikutnya bakal jadi acuan dan akan selalu berkaitan.",
    funfact:    "Banyak yang bilang prodi ini bisa menebak pemikiran seseorang, padahal untuk dapat mendiagnosa bagaimana kepribadian orang, membutuhkan proses yang panjang seperti melalui proses asesmen yang bertahap.",
    prospek:    ["Asisten Psikolog Klinis", "Asesor", "Human Resource Development", "Human Capital, dan masih banyak lagi"],
  },
  "Sains Aktuaria|FMIPA": {
    akreditasi: "Baik",
    persiapan:  "Harus mempelajari mata pelajaran Matematika dan Statistika karena prodi ini berhubungan dengan perhitungan dan memprediksi risiko.",
    matkul:     "Mikro Ekonomi, karena di matkul ini mempelajari mengenai perekonomian suatu perusahaan dan perhitungan detail mengenai perpajakan.",
    funfact:    "Memiliki angkatan pertamanya di tahun 2024, sehingga seluruh mahasiswa di angkatan masuk menggunakan jalur mandiri. Terdapat mata kuliah Mikro Ekonomi yang dosennya berasal dari Fakultas Ekonomika dan Bisnis (FEB) Mahasiswa Sains Aktuaria tidak perlu berasal dari Saintek, semua calon mahasiswa dari bidang keilmuan apapun bisa masuk ke prodi Sains Aktuaria.",
    prospek:    ["Bidang Asuransi", "Akuntan", "Financial Analyst", "Auditor"],
  },
  "Sains Data|FMIPA": {
    akreditasi: "Baik Sekali",
    persiapan:  "Pengetahuan tentang coding, perhitungan dasar, komputer dan software komputer dasar",
    matkul:     "Kecerdasan Artificial Keamanan dan Integritas Data",
    funfact:    "Tak hanya sebagai pengguna, mahasiswa Sains Data juga membuat Artificial Intelligence (AI). Mahasiswa Sains Data tidak sekadar memakai, tetapi juga mempelajari, bahkan membuat model AI dan melatihnya. Laptop adalah sahabat. Dimanapun dan kapanpun harus siap dengan membawa laptop. Akan bertemu dengan coding warna-warni setiap hari. Jika software coding masih menunjukkan warna-warna, maka pekerjaan kita masih normal. Jika warna menunjukkan merah, berarti pekerjaan kita salah atau error.",
    prospek:    ["Data Scientist", "Programmer", "Data Analyst", "Data Engineer"],
  },
  "Sastra Indonesia|FBS": {
    akreditasi: "Unggul",
    persiapan:  "Mulai banyak-banyak membaca novel, cerpen, dan karya sastra lainnya. Karena di sasindo ini akan mengkaji hal-hal seperti itu. Selain itu harus mulai nikmatin pertunjukan-pertunjukan seni, utamanya teater, karena kalian harus siap jatuh cinta dengan itu.",
    matkul:     "Semua matkulnya menarik. Tapi utamanya itu pembahasan mengenai puisi, karena kita akan mengkaji puisi lalu menggali makna-maknanya. Selain itu, ada juga matkul ekranisasi yang outputnya membuat film untuk mendapatkan ilmu langsung tentang bagaimana mengadaptasi sebuah karya sastra tulis menjadi karya sastra visual (film). Sehingga kita juga dapat merasakan proses syuting film dari awal.",
    funfact:    "Ada komunitas penulisan novel yang bernama Rabu Sore dan komunitas teater yang bernama Kaki Langit. Mahasiswa prodi ini selalu meromantisasi hal-hal kecil yang terjadi di dalam hidupnya, yang kemudian diabadikan dalam bentuk karya sastra.",
    prospek:    ["Penggiat seni", "Public relation", "Penulis buku", "Redaktur"],
  },
  "Sastra Inggris|FBS": {
    akreditasi: "Unggul",
    persiapan:  "Harus mulai menyiapkan basic english (Grammar, speaking, writing, critical listening) karena ada ketentuan kelulusan TEP minimal skor 527 untuk mahasiswa sastra inggris. Walaupun sebenarnya ada banyak sekali ‘detail’ lain yang harus tahu tapi itu bisa dipelajari nanti saat pembelajaran dengan dosen.",
    matkul:     "Di prodi ini, peminatannya tidak hanya terbatas di literature dan linguistic saja namun sudah merambah ke budaya populer. Maka dari itu, mata kuliahnya mulai beragam dan sangat menarik untuk dipelajari seperti Language for Media, Language for Tourism, Language for Bussiness, Western Society and Culture, Popular Culture dan Intercultural Communication.",
    funfact:    "Setiap pembelajaran dengan dosen wajib menggunakan bahasa inggris sekalipun itu matkul umum Punya fasilitas Reading Room dengan koleksi lengkap english literature serta english linguistics yang sudah jarang ditemui di toko toko buku. Dan mahasiswanya bisa meminjamnya kapanpun secara gratis. Dibandingkan dengan prodi lintas bahasa yang lain, prodi ini sering mendatangkan dosen native dari luar.",
    prospek:    ["Tour Guide•Transcriber•Content Creator", "Frontliner•Private Tutor•Content Writer", "Digital Marketer •Guru lembaga•Public Relation", "Subtitler"],
  },
  "Sastra Jerman|FBS": {
    akreditasi: "B",
    persiapan:  "Bisa mulai cari cari tau bahasa jerman dasar dan cara pembelajarannya di internet atau bisa cek di instagram @.deutsch_ unesa.",
    matkul:     "Deutsche landeskunde, yang mempelajari budaya dan kultur di jerman dari yang mendasar sampai modern. Tourismus, yang mempelajari bagaimana cara menjadi tour guide berbahasa jerman.",
    funfact:    "Ada komunitas bernama deutsch gemeinschaft yang difasilitaskan kepada mahasiswa sastra jerman diluar akademik untuk bisa explore minat bakat yang pastinya berhubungan dengan kultur dan budaya jerman seperti tanzen (tarian aseli german) dan nuntius (drama aseli german). Translator Tour guide Pejurnalistikan Public relation Kerja di instansi pemerintah maupun swasta yang berkaitan dengan jerman",
    prospek:    ["Translator", "Tour guide", "Jurnalis", "Public relation"],
  },
  "Seni Rupa Murni|FBS": {
    akreditasi: "Unggul",
    persiapan:  "Harus ada minat yang mendalam di dunia seni. jika hanya sekedar suka, pasti ada rasa bosen dan berakhir jadi malas. Beda dengan adanya minat pasti punya niat, dan menjalaninya tidak akan berat hati. Karena di SR sendiri tugasnya selalu praktik dan sering dihadapkan dengan apresiasi seni.",
    matkul:     "Ada beberapa mata kuliah yang menarik untuk dipelajari di SRM. Yang pertama Rupa Dasar 3D atau nirmana, di matkul ini kita belajar tentang komposisi, proporsi, paduan elemen elemen bagaimana sebuah karya itu bisa enak dilihat dari segala sudut. Yang kedua adalah mata kuliah yang bisa teman teman pilih sesuai minat dan fokusnya yaitu mata kuliah pendalaman. Ada beberapa mata kuliah pendalaman yang bisa dipilih seperti 2D Material relief dan 3D material keramik.",
    funfact:    "Di gedung SR punya studio yang cukup lengkap yaitu studio patung, kayu, logam, keramik, lukis, tekstil dan grafis yang buka 24 jam. Maka dari itu kebanyakan dari anak SRM sering lembur di kampus karena bahan serta alat-alat lengkapnya tersedia di studio. Untuk mata kuliah prakteknya, prodi ini lebih ke ‘fine art’ yang fokusnya pada keindahan berdasarkan ekspresi dari senimannya. Berbeda dengan prodi lain yg karya-karyanya boleh dikombinasikan atau bergaya applied art (seni pakai).",
    prospek:    ["Guru kesenian", "Seniman", "Kurator"],
  },
  "Sistem Informasi|FT": {
    akreditasi: "Baik Sekali",
    persiapan:  "Mulai tertarik dengan algoritma, logika, manajemen dan mempunyai kemampuan problem solving karena akan mempelajari statistik, kalkulus, dsb. Mulai tertarik dengan bahasa pemrogaman atau sudah punya basic ngoding karena ini jadi landasan utama dalam perancangan website.",
    matkul:     "Manajemen Proyek adalah salah satu mata kuliah sistem informasi yang mempelajari tentang manajemen sebuah proyek dari awal hingga akhir.",
    funfact:    "Mempunyai komunitas GDSC (Google Developer Student Clubs) yang didukung oleh Google Developers dan merupakan komunitas untuk melakukan pengembangan Google. Dikenal sebagai mahasiswa nolep atau wibu karena sering menyendiri di depan laptop atau komputer.",
    prospek:    ["Web Developer", "Mobile Developer", "System Analis", "Project Manager"],
  },
  "Sosiologi|FISIPOL": {
    akreditasi: "Unggul",
    persiapan:  "Sebelum masuk sosiologi harus mulai rajin baca artikel, majalah, koran atau apapun yang mengangkat topik masalah sosial karena di sosiologi kita akan diajarin untuk peka dengan isu sosial di sekitar. Dan karena sosiologi murni banyak teorinya, jadi bisa mulai cari tahu teori teori ahli. Tapi tetap yang terpenting betah baca, karena di prodi ini kita tidak banyak baca dijamin akan hilang arah.",
    matkul:     "Mata kuliah teori yang terdiri dari teori sosiologi klasik, teori sosiologi modern dan teori sosiologi postmodern ini sangat menarik untuk dipelajari. Di matkul ini kita akan tau basic teori dari jaman Karl Marx sampai teori terbaru. Selain menarik, matkul ini juga penting sekali karena akan menjadi landasan penelitian yang pastinya sebagai anak prodi sosiologi, tidak akan lepas dari penelitian di masyarakat. Lalu ada matkul Sosiologi Virtual yang akan menganalisis fenomena komunitas virtual. Karena kita suda berada di zaman yang masyarakatnya perlahan bergeser ke komunitas online.",
    funfact:    "Di semester genap, kita akan mengikuti program menarik bernama PLK (Perkuliahan Luar Kelas), di mana bahan penelitian kita adalah kelompok masyarakat tertentu. Pengalaman PLK ini terasa seperti menjadi agen rahasia bagi teman-teman sosio, karena dalam penelitian, kita harus bersikap cermat tanpa mengungkapkan bahwa sedang melakukan studi. Oleh karena itu, mahasiswa sosiologi memiliki keahlian beradaptasi yang luar biasa, mampu dengan cepat berbaur dan berinteraksi langsung dengan masyarakat yang menjadi objek penelitian.",
    prospek:    ["People management", "Researcher", "Journalist", "Bussiness analyst"],
  },
  "Tata Boga|FV": {
    akreditasi: "Baik",
    persiapan:  "Mulai mencari tahu mengenai industri kuliner, memahami tren, perkembangan, dan tantangan dalam industri kuliner ; mengembangkan keterampilan kuliner dasar seperti teknik memasak atau pengetahuan tentang bahan baku dan alat; mempersiapkan perlengkapan perlengkapan untuk menunjang dalam praktikum memasak seperti set knife, safety shoes, chef hat dan chef jacket",
    matkul:     "Sugar and confectionery merupakan mata kuliah yang cukup jarang terdapat di universitas lain, di mata kuliah ini kita belajar untuk membuat sebuah produk berbahan dasar gula ataupun coklat baik produk yang berasal Indonesia sampai produk yang berasal dari mancanegara, di akhir mata kuliah pun kita diajarkan untuk menggabungkan jenis permen dengan masakan khas Indonesia, produk yang sudah di buatpun sangat beragam, menarik dan tentu lezat. Matkul pengembangan produk. Pada mata kuliah ini kita dapat mengeksplorasi tren dan inovasi dalam dunia kuliner, termasuk pengembangan menu baru dan penggabungan bahan yang unik.",
    funfact:    "Prodi ini tidak hanya menjadi seorang chef. Prodi ini juga tidak hanya mengembangkan keterampilan dalam memasak dan mengelola dapur, tetapi juga mendapatkan pemahaman mendalam tentang seni kuliner, nutrisi, serta tren dan inovasi dalam dunia makanan.",
    prospek:    ["Chef", "Koki profesional, pengelola Restaurant, konsultan kuliner, pendidik kuliner, pengembangan", "Produk, penulis kuliner, event planner kuliner"],
  },
  "Tata Busana|FV": {
    akreditasi: "Baik",
    persiapan:  "Mengasah keterampilan dan pengetahuan di bidang fashion mulai dari desain, pembuatan pola, menjahit, dan tekstil. Mengikuti perkembangan tren fashion.",
    matkul:     "CAD Manipulating Fabric Draping Kriya tekstil",
    funfact:    "Mempelajari mengenai produksi sekaligus marketing produk fashion. Bekerja sama dengan desainer nasional yaitu Hian Tjen, serta industri memberikan kesempatan bagi mahasiswa untuk berkolaborasi dan mendapatkan pengalaman langsung.",
    prospek:    ["Fashion designer", "Fashion stylist", "Fashion illustrator", "Jurnalis fashion"],
  },
  "Teknik Elektro|FT": {
    akreditasi: "B",
    persiapan:  "Harus memperbanyak membaca buku terutama buku-buku mengenai listrik. Jika masih awal, cukup teori dasarnya saja. Mempunyai tespen dan avometer (anak elektro wajib sekali mempunyai alat ini) tidak perlu mahal-mahal yang terpenting bisa berfungsi dengan baik.",
    matkul:     "Mata kuliah yang menarik bisa beragam tergantung pada minat dan spesialisasi masing-masing mahasiswa. Beberapa mata kuliah yang sering dianggap menarik antara lain sistem kontrol, pemrosesan sinyal, teknik tenaga listrik, konversi energi listrik, elektronika daya, dan robotika dan lain sebagainya. Selain itu, juga terdapat mata kuliah medan elektromagnetik, yang mana matkul ini bisa dikatakan dasar atau bisa dibilang jiwanya teknik elektro.",
    funfact:    "Melakukan workshop dengan perusahaan-perusahaan ternama, salah satunya workshop IEEE yang bertujuan menciptakan inovasi-inovasi terbaru untuk kemanfaatan manusia. Berkesempatan bekerja sama dengan industri luar negeri dan dalam negeri yaitu Sichuan Liyuan New Material Co., Ltd dan PT. LBM Energi Baru Indonesia. Sering disebut sebagai tukang service elektronik karena dianggap pintar mengendalikan listrik dan juga disoraki sebagai putra dari dewa petir.",
    prospek:    ["Teknisi listrik, teknisi radar", "Konsultan listrik", "Ahli robotik", "Electrical designer"],
  },
  "Teknik Informatika|FT": {
    akreditasi: "Baik Sekali",
    persiapan:  "Keterampilan dasar Program Pengetahuan dasar matematika Mampu membuat Problem solving dengan logika dan analisis",
    matkul:     "Jaringan Komputer Keamanan Jariangan Basis Data Pemrograman Berorientasi Objek Desain Perangkat Lunak Rekayasa Perangkat Lunak Teknik Komputasi Digital dll",
    funfact:    "Selalu mendapatkan update tentang teknologi dari berbagai sumber dengan mencoba terlebih dahulu apabila ada trial dan error. Contohnya, mahasiswa prodi ini bisa mencoba website atau aplikasi untuk dicek trial dan errornya sebelum dipublikasikan. Tidak butuh laptop spek sultan karena koneksi lancar merupakan prioritas tertinggi. Materi kuliahnya bisa dipelajari secara otodidak karena materinya banyak ditemukan di internet.",
    prospek:    ["Backend/Fronten Developer", "UI/UX Desainer", "Data Analyst", "System Analyst"],
  },
  "Teknik Listrik|FV": {
    akreditasi: "Baik",
    persiapan:  "Akademis : matematika, fisika, statistika Mencakup sarana pribadi: laptop dengan software yang mendukung, hand-tools , apk software untuk penunjang perkuliahan (autocad, matlab, proteus, psim, cx-programmer)",
    matkul:     "Rangkaian Listrik DC Rangkaian Listrik AC Pengukuran Listrik Elektronika analog dan digital Instalasi Listrik Dasar Elektronika Daya Mesin Listrik DC Mesin Listrik AC Microkontroler Transformator Pembangkit tenaga Listrik Distribusi tenaga Listrik Sistem Proteksi dan Pentanahan Tenaga Listrik Otomasi kelistrikan industri Konversi Tenaga Listrik, dsb.",
    funfact:    "Tidak hanya belajar tentang listrik, tapi juga belajar teknik informatika hingga robotika. Prodi ini tidak hanya relevan, tetapi juga penting dalam mendukung kemajuan teknologi dan keberlanjutan di masa depan. Bisa menjadi teknisi listrik dadakan di rumah apabila terjadi korsleting maupun pemadaman listrik.",
    prospek:    ["Mencakup seluruh bidang dalam industri, perkantoran, hingga enterpreneur", "Engineer Listrik", "Teknisi Listrik", "Desainer sistem kelistrikan"],
  },
  "Teknik Mesin|FT": {
    akreditasi: "Unggul",
    persiapan:  "Jika bukan lulusan dari SMK, maka wajib mempelajari terlebih dulu pelajaran dasar SMK terkait kejuruan teknik mesin. Jika tidak, maka mahasiswa akan kesulitan mengikuti perkuliahan dan beresiko tertinggal.",
    matkul:     "Semua mata kuliahnya menarik, khususnya mata kuliah gambar teknik, karena dibutuhkan keterampilan dan ketelitian.",
    funfact:    "Punya BBM (Bengkel Bantuan Mahasiswa) yang sedang direncanakan untuk hadir ke masyarakat. Komunitas GARNESA yang bergerak di bidang mobil listrik dan mobil hemat energi yang sudah bisa diakses oleh seluruh mahasiswa Unesa. Menerapkan metode pembelajaran yang berpusat pada proyek, dimana mahasiswa diminta untuk merancang, membangun, serta menguji prototipe mesin atau sistem mekanik. Insinyur, project manajer, dan lain-lain yg berhubungan dengan desain mesin, desain gambar, perhitungan komponennya, dan lain sebagainya.",
    prospek:    ["Insinyur mesin", "Project manager", "Desainer produk & manufaktur"],
  },
  "Teknik Mesin|FV": {
    akreditasi: "Baik",
    persiapan:  "Mempersiapkan laptop yang bisa buat install software desain seperti AutoCAD, fusion. Perlu memahami dasar menggambar teknik.",
    matkul:     "Mata kuliah ini mempelajari mengenai proses perancangan elemen-elemen pada mesin mulai dari awal hingga akhir. Mulai seperti pemilihan bahan, penghitungan gaya, tekanan, penentuan ukuran dan dimensi, hingga perancangan.",
    funfact:    "Tak hanya belajar mesin, mahasiswa juga belajar menggambar 3D tentang permesinan di komputer. Porsi praktikum dan studi lapangan yang lebih banyak dibanding dengan prodi S1 Teknik Mesin sehingga prodi ini punya relasi ke dunia kerja yang cukup luas.",
    prospek:    ["Supervisor/Head Division", "Maintenance Engineer", "Welder", "Industrial Designer"],
  },
  "Teknik Sipil|FT": {
    akreditasi: "B",
    persiapan:  "Mengetahui ilmu dasar matematika dan fisika. Membaca buku mengenai teknik sipil. Mempelajari terkait cara pembangunan konstruksi sederhana seperti rumah tinggal karena di awal semester akan belajar hal itu.",
    matkul:     "Mata kuliah yang menarik dalam lingkup Teknik Sipil adalah menghitung RAB bangunan, mempelajari ilmu ukur tanah, rekayasa lalu lintas, manajemen proyek, serta penjadwalan pengendalian proyek.",
    funfact:    "Jika sebuah bangunan dirancang dengan baik dan bagus, arsitek mendapat pujian, tapi jika bangunan itu roboh, sipil mendapat cacian. Pada kenyataannya, semakin sulit desain bangunan, maka akan semakin sulit pula bagi sipil untuk mewujudkannya.",
    prospek:    ["Teknik sipil mempelajari tentang bangunan air, jembatan, jalan, dan gedung. Selain itu teknik s", "Mempelajari tentang", "Manajemen suatu proyek konstruksi. Oleh karena itu, lulusan teknik sipil", "Berkontribusi langsung"],
  },
  "Teknik Sipil|FV": {
    akreditasi: "Baik",
    persiapan:  "Kemampuan Fisika dan Matematika, khususnya fisika, karena teknik sipil akan berkutat dengan struktur. Mempunyai perangkat komputer/laptop yang memadai untuk menjalankan software teknik sipil sebenarnya tidak wajib, tetapi akan sangat membantu jika mahasiswa punya.",
    matkul:     "Mata kuliah rekayasa gempa matkul ini mengajarkan bagaimana dapat merencanakan bangunan yang tahan akan gempa",
    funfact:    "Prodi ini lebih fokus ke bangunan gedung dan dibarengi dengan praktikum yang lebih banyak dari pada teori di ruang kelas. Selain itu juga prodi ini sering ada kunjungan ke proyek konstruksi langsung.",
    prospek:    ["Struktur engineer, site engineer, drafter", "Estimator, surveyor dan PNS"],
  },
  "Teknologi Pendidikan|FIP": {
    akreditasi: "Unggul",
    persiapan:  "Memiliki kemampuan dasar software editing. Memiliki tingkat kreativitas yang tinggi agar modul pembelajaran berbasis teknologi memiliki banyak keunikan.",
    matkul:     "Pengembangan media video / televisi",
    funfact:    "Kuliah di prodi ini memiliki disiplin ilmu yang banyak, seperti Ilmu Komunikasi, Desain Komunikasi Visual, dan Manajemen yang melebur menjadi satu sehingga prospek kerjanya pun sangat luas. Fokus pembelajaran prodi ini berbeda dengan beberapa universitas di Indonesia. Jika di UM berfokus pada produk pembelajaran, sedangkan di Unesa fokusnya pada pengembangan dan pelatihan.",
    prospek:    ["Dalam bidang pendidikan terdapat prospek kerja seperti dosen, guru multimedia, start up/pengemb", "Dalam bidang non pendidikan juga menawarkan prospek kerja seperti fotografer, jurnalis, desaine"],
  },
  "Teknologi Rekayasa Otomotif|FV": {
    akreditasi: "Baik",
    persiapan:  "Memahami dasar Fisika dan Matematika untuk yang memiliki minat pada otomotif. Harus mempersiapkan diri untuk belajar praktik di workshop. Memiliki kemampuan kerja sama untuk tugas kelompok. Mengikuti perkembangan tren teknologi otomotif, seperti kendaraan listrik dan otomasi.",
    matkul:     "Teknologi Otomotif, mempelajari tentang teknologi dalam industri otomotif, seperti sistem mesin, transmisi, suspensi, serta kendaraan listrik dan efisiensi bahan bakar. Sistem Otomotif, mempelajari cara kerja sistem utama kendaraan, seperti penggerak, kelistrikan, dan kontrol, serta bagaimana sistem- sistem ini bekerja bersama agar kendaraan berfungsi dengan baik.",
    funfact:    "Prodi ini menjadi pelopor pendidikan tinggi otomotif berbasis teknologi di Indonesia, dengan fokus pada pengembangan kendaraan masa depan. Mahasiswa Teknologi Rekayasa Otomotif memiliki peluang untuk terlibat dalam kompetisi inovasi otomotif, seperti desain mobil listrik, otomasi kendaraan, dan kendaraan hemat energi.",
    prospek:    ["Bidang Industri Otomotif", "Peneliti", "Pengembang", "Entrepreneur Otomotif"],
  },
  "Transportasi|FV": {
    akreditasi: "Baik",
    persiapan:  "Siap menghadapi perhitungan, dan gambar struktur. Perbanyak membaca jurnal-jurnal tentang ilmu Transportasi, kemudian bisa mulai mencoba menganalisa masalah-masalah Transportasi apa saja yang ada di sekitar kita.",
    matkul:     "Estimasi Biaya Konstruksi, pada matkul ini kita akan belajar untuk bisa menghitung biaya yang diperlukan pada sebuah konstruksi jalan.",
    funfact:    "Prodi ini masih sekeluarga dengan Teknik Sipil, tetapi Prodi ini lebih berfokus pada lingkup Transportasi Darat, contohnya seperti pembangunan Jembatan, pembangunan jalan Tol, pengaspalan jalan, pembangunan Rel Kereta Api, Manajemen Lalu Lintas. Di prodi ini tidak hanya mempelajari tentang Transportasi umum yang kita tahu selama ini, tapi kita juga akan mempelajarai tentang infrastruktur terkait Transportasi itu sendiri.",
    prospek:    ["Prospek Kerja dibidang Transportasi", "Dibidang ketekniksipilan, maupun jasa transportasi. Contohnya PUPR, Dinas Perhubungan, perusaha", "Juga di Perusahaan yang menyangkut Logistik", "Juga di Konsultan konstruksi jalan dan perencana sistem transportasi"],
  },
};


/* ============ 5. STATE APLIKASI ============ */
let soalAktif = [];       // soal yang terpilih (ditambahkan bertahap secara adaptif)
let jawaban = [];         // skor jawaban untuk tiap soal (urutan sama dengan soalAktif)
let indexSekarang = 0;    // posisi soal yang sedang ditampilkan
let kunciJawaban = false; // mencegah klik ganda saat transisi antar soal
let idTerpakai = new Set(); // id soal yang sudah dipakai (agar tidak diulang)
let skorFakultas = {};    // skor sementara per fakultas -> dasar pemilihan soal mengerucut

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

// Nama lengkap fakultas (untuk badge kategori soal)
const FAKULTAS_NAMA = {
  FBS: "Fakultas Bahasa dan Seni",
  FEB: "Fakultas Ekonomika dan Bisnis",
  FH: "Fakultas Hukum",
  FIKK: "Fakultas Ilmu Keolahragaan dan Kesehatan",
  FIP: "Fakultas Ilmu Pendidikan",
  FISIPOL: "Fakultas Ilmu Sosial dan Ilmu Politik",
  FK: "Fakultas Kedokteran",
  FKP: "Fakultas Ketahanan Pangan",
  FMIPA: "Fakultas Matematika dan Ilmu Pengetahuan Alam",
  FPSI: "Fakultas Psikologi",
  FT: "Fakultas Teknik",
  FV: "Fakultas Vokasi",
};

// Pilih satu elemen acak dari array
function pilihAcak(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Pilih soal berikutnya secara ADAPTIF (mengerucut berdasarkan rumpun/fakultas):
//   Soal 1-3  : sampling luas dari 3 rumpun besar (r1, r2, r3) -> deteksi arah minat awal.
//   Soal 4-8  : ambil dari FAKULTAS UNGGULAN (2 teratas) -> soal makin fokus.
//   Soal 9-10 : ambil dari fakultas #1 -> konfirmasi, skor maksimal di soal ke-10.
function pilihSoalBerikutnya(idx) {
  const bank = SOAL_BANK;
  const tersedia = bank.filter((s) => !idTerpakai.has(s.id));

  if (idx < 3) {
    // Fase penyaringan: satu soal tiap rumpun besar
    const urutanRumpun = ["r1", "r2", "r3"];
    let pool = bank.filter((s) => s.rumpun === urutanRumpun[idx] && !idTerpakai.has(s.id));
    if (!pool.length) pool = tersedia;
    return pilihAcak(pool);
  }

  // Fase pengerucutan & konfirmasi
  const peringkat = Object.keys(skorFakultas).sort((a, b) => skorFakultas[b] - skorFakultas[a]);
  const jumlahKandidat = idx >= KONFIGURASI.jumlahSoal - 2 ? 1 : 2;
  let pool = [];
  for (let i = 0; i < Math.min(jumlahKandidat, peringkat.length) && !pool.length; i++) {
    pool = bank.filter((s) => s.kat === peringkat[i] && !idTerpakai.has(s.id));
  }
  if (!pool.length) pool = tersedia;
  return pilihAcak(pool);
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
  jawaban = [];
  indexSekarang = 0;
  kunciJawaban = false;
  idTerpakai = new Set();
  soalAktif = [];

  // Inisialisasi skor sementara per fakultas (untuk pemilihan soal mengerucut)
  skorFakultas = {};
  Object.keys(FAKULTAS_NAMA).forEach((f) => { skorFakultas[f] = 0; });

  // Soal pertama: sampling luas
  const pertama = pilihSoalBerikutnya(0);
  soalAktif.push(pertama);
  idTerpakai.add(pertama.id);

  tampilkanSection(el.sectionQuiz);
  renderSoal(indexSekarang);
}

// Tombol "Kembali" : kembali ke layar awal (mulai kuis)
function kembaliKeAwal() {
  kunciJawaban = false;
  indexSekarang = 0;
  jawaban = [];
  idTerpakai = new Set();
  soalAktif = [];
  skorFakultas = {};
  el.progressFill.style.width = "0%";
  el.soalOptions.innerHTML = "";
  tampilkanSection(el.sectionStart);
}

// Menampilkan soal pada indeks tertentu
function renderSoal(idx) {
  const soal = soalAktif[idx];
  const total = KONFIGURASI.jumlahSoal;

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
  const soal = soalAktif[indexSekarang];
  jawaban[indexSekarang] = skor;

  // Perbarui skor sementara fakultas -> dasar soal berikutnya (mengerucut)
  if (soal.kat && skorFakultas[soal.kat] !== undefined) skorFakultas[soal.kat] += skor;

  // Beri jeda singkat agar efek terlihat, lalu lanjut ke soal berikutnya
  setTimeout(() => {
    if (indexSekarang + 1 < KONFIGURASI.jumlahSoal) {
      indexSekarang++;
      const s = pilihSoalBerikutnya(indexSekarang);
      soalAktif.push(s);
      idTerpakai.add(s.id);
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

// Label tag -> frasa Indonesia (dipakai untuk teks cadangan / alasan cocok)
const TAG_LABEL = {
  it: "teknologi & IT", data: "data & analisis", sains: "sains & penelitian",
  teknik: "teknik & konstruksi", kesehatan: "kesehatan", olahraga: "olahraga & kebugaran",
  bisnis: "bisnis", akuntansi: "akuntansi & keuangan", hukum: "hukum",
  sosial: "sosial & pemerintahan", hi: "hubungan internasional", komunikasi: "komunikasi & media",
  bahasa: "bahasa & sastra", psikologi: "psikologi", pendidikan: "pendidikan",
  agro: "pertanian & pangan", pangan: "teknologi pangan", kuliner: "kuliner",
  busana: "fashion & busana", rias: "tata rias", seni: "seni", desain: "desain",
  film: "film & animasi", musik: "musik", budaya: "budaya", pariwisata: "pariwisata",
};

// Ambil info funfact prodi (aman bila data belum ada)
function infoProdi(nama, fakultas) {
  return INFO_PRODI[nama + "|" + fakultas] || {};
}

// Teks cadangan untuk prodi yang tidak ada di INFO_PRODI
function teksFallback(p) {
  const labelTag = (p.tags || "").split(" ").filter(Boolean)
    .map((t) => TAG_LABEL[t] || t).join(", ");
  const prospekRumpun = {
    r1: ["Praktisi di industri/teknologi", "Peneliti & pengembang", "Tenaga pendidik/dosen"],
    r2: ["Praktisi bisnis/administrasi", "Analis kebijakan", "Tenaga pendidik/dosen"],
    r3: ["Praktisi kreatif/pariwisata", "Wirausaha", "Tenaga pendidik/dosen"],
  };
  return {
    akreditasi: "",
    persiapan: "Informasi syarat khusus & portofolio dapat dicek di laman resmi prodi.",
    matkul: "Fokus pembelajaran pada bidang " + (labelTag || RUMPUN[p.rumpun].nama) + ".",
    funfact: "",
    prospek: prospekRumpun[p.rumpun] || prospekRumpun.r1,
  };
}

// Alasan singkat "mengapa cocok" (dibuat otomatis dari jawaban)
// Alasan singkat "mengapa cocok" — RINGKASAN fokus prodi (bukan hasil pilihan)
function buatAlasan(p) {
  const labelTag = (p.tags || "").split(" ").filter(Boolean)
    .map((t) => TAG_LABEL[t] || t).join(", ");
  if (labelTag) {
    return `Prodi ini berfokus pada bidang ${labelTag}.`;
  }
  return `Prodi ini termasuk rumpun ${RUMPUN[p.rumpun].nama}.`;
}

// Mengamankan teks agar aman dimasukkan ke innerHTML
function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Menghitung skor kecocokan tiap prodi.
// Scoring matrix: kata kunci tiap soal dicocokkan ke KORPUS TEKS FUNFACT prodi
// (persiapan + mata kuliah + funfact + prospek) + tag + bonus rumpun.
function hitungSkor() {
  return PRODI_LIST.map((prodi) => {
    const nama = prodi[0];
    const fakultas = prodi[1];
    const rumpun = prodi[2];
    const info = infoProdi(nama, fakultas);

    // Korpus kata prodi (dari data funfact buku)
    const korpus = [
      nama,
      prodi[3],
      info.persiapan || "",
      info.matkul || "",
      info.funfact || "",
      (info.prospek || []).join(" "),
    ].join(" ").toLowerCase();

    let skor = 0;

    soalAktif.forEach((soal, qi) => {
      const nilai = jawaban[qi];
      if (nilai === 0) return;

      // (a) Bonus rumpun: prodi serumpun dengan soal ikut terangkat
      if (rumpun === soal.rumpun) skor += nilai;

      // (b) Bonus tag: tag prodi cocok dengan tag soal
      const tagsProdi = prodi[3].split(" ").filter(Boolean);
      const tagCocok = soal.tags.split(" ").filter((t) => tagsProdi.includes(t)).length;
      skor += nilai * KONFIGURASI.bobotTag * tagCocok;

      // (c) Scoring matrix: kata kunci soal ditemukan di teks funfact prodi
      const kunciCocok = (soal.kataKunci || [])
        .filter((k) => korpus.includes(k.toLowerCase())).length;
      skor += nilai * kunciCocok;
    });

    return { nama, fakultas, rumpun, skor, info, tags: prodi[3] };
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

// Menampilkan Top 5 prodi — format kartu: Nama+Fakultas, Mengapa cocok,
// Apa yang dipelajari, Syarat Khusus (portofolio), Prospek Karir.
function renderHasil(skorProdi) {
  // Urutkan dari skor tertinggi; jika skor sama, urutan asli dipertahankan
  const top5 = [...skorProdi].sort((a, b) => b.skor - a.skor).slice(0, 5);

  el.hasilList.innerHTML = "";
  top5.forEach((p, i) => {
    const r = RUMPUN[p.rumpun];
    const persen = kePersen(skorProdi, p);
    const badgeRumpun = p.rumpun === "r1" ? "badge-r1" : p.rumpun === "r2" ? "badge-r2" : "badge-r3";
    const info = p.info && p.info.persiapan ? p.info : teksFallback(p);
    const prospek = ((info.prospek && info.prospek.length) ? info.prospek : ["Cek informasi resmi prodi"]).slice(0, 3);

    const card = document.createElement("div");
    card.className = "result-card anim-masuk";
    card.style.animationDelay = `${i * 130}ms`; // muncul berurutan (stagger)

    // Header kartu (klik untuk membuka detail)
    card.innerHTML = `
      <div class="result-head" role="button" tabindex="0" aria-expanded="false" aria-label="Buka detail ${esc(p.nama)}">
        <div class="rank-badge rank-${i + 1}">${i + 1}</div>
        <div class="result-info">
          <p class="result-nama">${esc(p.nama)}</p>
          <span class="result-fakultas">${esc(p.fakultas)}</span>
        </div>
        <div class="result-pct">
          <span class="pct-angka">${persen}%</span>
          <div class="pct-track"><div class="pct-fill" style="width:${persen}%"></div></div>
        </div>
        <span class="chevron">▾</span>
      </div>
      <div class="result-detail hidden">
        <span class="rumpun-badge ${badgeRumpun}">${esc(r.nama)}</span>
        <div class="detail-item">
          <span class="detail-label">Mengapa cocok</span>
          <p>${esc(buatAlasan(p))}</p>
        </div>
        <div class="detail-item">
          <span class="detail-label">Apa yang dipelajari</span>
          <p>${esc(info.matkul || "Fokus pada bidang " + r.nama + ".")}</p>
        </div>
        <div class="detail-item">
          <span class="detail-label">Syarat Khusus</span>
          <p>${esc(info.persiapan || "Tidak ada syarat khusus; cek pengumuman resmi seleksi.")}</p>
        </div>
        <div class="detail-item">
          <span class="detail-label">Prospek Karir</span>
          <ul class="prospek-list">${prospek.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
        </div>
        ${info.funfact ? `<div class="detail-item"><span class="detail-label">Fun Fact</span><p>${esc(info.funfact)}</p></div>` : ""}
        ${info.akreditasi ? `<div class="detail-item"><span class="detail-label">Akreditasi</span><p>${esc(info.akreditasi)}</p></div>` : ""}
      </div>
    `;

    // Buka/tutup detail saat header diklik
    const head = card.querySelector(".result-head");
    const detail = card.querySelector(".result-detail");
    const toggle = () => {
      const terbuka = !detail.classList.contains("hidden");
      detail.classList.toggle("hidden");
      head.setAttribute("aria-expanded", String(!terbuka));
      card.classList.toggle("result-open", !terbuka);
    };
    head.addEventListener("click", toggle);
    head.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
    });

    el.hasilList.appendChild(card);
  });

  tampilkanSection(el.sectionHasil);
  mulaiPetasan(); // rayakan hasil dengan animasi petasan
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

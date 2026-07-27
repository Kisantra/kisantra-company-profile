<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ServiceGranularSeeder extends Seeder
{
    /**
     * Sub-layanan granular hasil pemecahan pilar (Keuangan, Digital, Perizinan, + Perpajakan).
     * Idempotent (updateOrCreate by slug).
     */
    public function run(): void
    {
        $services = array_merge(
            $this->perpajakan(),
            $this->keuangan(),
            $this->digital(),
            $this->perizinan(),
        );

        foreach ($services as $data) {
            $data['slug'] = Str::slug($data['name']);
            $data['is_active'] = true;
            Service::updateOrCreate(['slug' => $data['slug']], $data);
        }

        $this->command->info(count($services) . ' sub-layanan seeded successfully!');
    }

    private function make(string $name, string $subtitle, string $category, string $price, string $priceNote, int $order, string $desc, string $overview, array $features, array $steps, array $examples, array $faqs, array $keywords): array
    {
        return [
            'name' => $name,
            'subtitle' => $subtitle,
            'category' => $category,
            'price' => $price,
            'price_note' => $priceNote,
            'order' => $order,
            'description' => "<p>{$desc}</p>",
            'overview' => $overview,
            'features' => $features,
            'process_steps' => array_map(fn ($s) => ['title' => $s[0], 'description' => $s[1]], $steps),
            'examples' => array_map(fn ($e) => ['title' => $e[0], 'description' => $e[1]], $examples),
            'faqs' => array_map(fn ($f) => ['question' => $f[0], 'answer' => $f[1]], $faqs),
            'search_keywords' => $keywords,
        ];
    }

    private function perpajakan(): array
    {
        return [
            $this->make(
                'Konsultasi & Perencanaan Pajak',
                'Tax planning legal untuk mengoptimalkan beban pajak perusahaan Anda.',
                'Perpajakan', 'Hubungi Kami', 'Sesuai kebutuhan', 6,
                'Konsultasi perpajakan dan perencanaan pajak (tax planning) untuk meminimalkan beban pajak secara legal sesuai regulasi.',
                '<p>Banyak perusahaan membayar pajak lebih besar dari seharusnya karena tidak merencanakan struktur transaksinya.</p><p>Kami membantu menyusun strategi perpajakan yang efisien dan tetap patuh, agar beban pajak optimal tanpa risiko.</p>',
                ['Review posisi perpajakan', 'Strategi efisiensi pajak legal', 'Perencanaan transaksi & struktur', 'Konsultasi berkala'],
                [['Diagnosa', 'Menganalisis kondisi & kewajiban pajak saat ini.'], ['Strategi', 'Menyusun rencana efisiensi pajak yang patuh.'], ['Pendampingan', 'Mengawal penerapan dan meninjau berkala.']],
                [['Efisiensi Pajak Korporasi', 'Penyusunan struktur transaksi yang lebih hemat pajak.'], ['Review Kepatuhan', 'Pemeriksaan potensi risiko sebelum pelaporan.']],
                [['Apakah tax planning legal?', 'Ya, selama sesuai ketentuan. Kami fokus pada efisiensi yang patuh, bukan penghindaran ilegal.']],
                ['tax planning', 'konsultasi pajak', 'efisiensi pajak', 'review pajak'],
            ),
            $this->make(
                'Pendampingan Pemeriksaan Pajak',
                'Dampingan profesional saat perusahaan Anda diperiksa oleh DJP.',
                'Perpajakan', 'Hubungi Kami', 'Sesuai kompleksitas', 7,
                'Pendampingan menyeluruh selama proses pemeriksaan pajak (tax audit) oleh DJP, dari persiapan dokumen hingga pembahasan hasil.',
                '<p>Pemeriksaan pajak menuntut kesiapan dokumen dan argumentasi yang kuat. Kesalahan penanganan bisa berujung koreksi besar.</p><p>Kami mendampingi Anda di setiap tahap pemeriksaan agar hak perpajakan terlindungi dan hasilnya seadil mungkin.</p>',
                ['Persiapan dokumen pemeriksaan', 'Analisis temuan pemeriksa', 'Pendampingan pembahasan', 'Penyusunan tanggapan & sanggahan'],
                [['Persiapan', 'Menyiapkan dokumen dan data yang diminta pemeriksa.'], ['Pendampingan', 'Mendampingi proses pemeriksaan & pembahasan.'], ['Tindak Lanjut', 'Menyusun tanggapan atas hasil pemeriksaan.']],
                [['Pemeriksaan PPN', 'Pendampingan pemeriksaan atas kredit pajak masukan.'], ['Pemeriksaan PPh Badan', 'Dampingan atas koreksi biaya fiskal.']],
                [['Bedanya dengan SP2DK?', 'SP2DK adalah permintaan klarifikasi awal; pemeriksaan pajak adalah proses formal yang lebih mendalam oleh DJP.']],
                ['pemeriksaan pajak', 'tax audit', 'DJP', 'koreksi pajak'],
            ),
        ];
    }

    private function keuangan(): array
    {
        return [
            $this->make(
                'Audit Internal & Operasional',
                'Pemeriksaan kontrol internal untuk menutup celah kebocoran dan risiko.',
                'Keuangan', 'Hubungi Kami', 'Sesuai ruang lingkup', 14,
                'Audit internal atas proses operasional dan keuangan untuk mengidentifikasi risiko, kebocoran, dan area perbaikan.',
                '<p>Tanpa kontrol internal yang sehat, kebocoran dan kesalahan mudah terjadi tanpa disadari.</p><p>Kami memeriksa proses dan kontrol Anda, lalu memberi rekomendasi konkret untuk memperkuatnya.</p>',
                ['Evaluasi kontrol internal', 'Identifikasi risiko & kebocoran', 'Rekonsiliasi & sampling', 'Laporan temuan & rekomendasi'],
                [['Perencanaan Audit', 'Menentukan ruang lingkup dan area berisiko.'], ['Pengujian', 'Menguji proses, dokumen, dan kontrol.'], ['Pelaporan', 'Menyampaikan temuan dan rekomendasi perbaikan.']],
                [['Audit Kas & Persediaan', 'Pemeriksaan pengelolaan kas dan stok.'], ['Review Prosedur', 'Evaluasi SOP keuangan perusahaan.']],
                [['Apakah ini audit resmi (KAP)?', 'Ini audit internal untuk perbaikan manajemen, berbeda dengan audit eksternal oleh Kantor Akuntan Publik.']],
                ['audit internal', 'kontrol internal', 'risiko', 'kebocoran'],
            ),
            $this->make(
                'Valuasi Bisnis & Aset',
                'Penilaian nilai wajar usaha dan aset untuk investasi, akuisisi, atau kemitraan.',
                'Keuangan', 'Hubungi Kami', 'Sesuai kompleksitas', 15,
                'Penilaian nilai (valuasi) bisnis dan aset untuk kebutuhan investasi, akuisisi, penambahan modal, atau kemitraan.',
                '<p>Mengetahui nilai wajar usaha Anda penting saat mencari investor, menjual, atau bermitra.</p><p>Kami menyusun valuasi berbasis data dan metodologi yang diakui, sehingga negosiasi Anda berpijak pada angka yang kuat.</p>',
                ['Analisis laporan keuangan', 'Metode valuasi (DCF, market, aset)', 'Proyeksi & asumsi', 'Laporan valuasi'],
                [['Pengumpulan Data', 'Menghimpun laporan keuangan dan data operasional.'], ['Analisis & Valuasi', 'Menghitung nilai dengan metode yang sesuai.'], ['Laporan', 'Menyusun laporan valuasi yang siap dipakai.']],
                [['Valuasi untuk Investor', 'Penilaian usaha untuk penggalangan modal.'], ['Valuasi Akuisisi', 'Penilaian target akuisisi bisnis.']],
                [['Metode apa yang dipakai?', 'Kami memilih metode yang paling sesuai (arus kas terdiskonto, pendekatan pasar, atau aset) tergantung karakter usaha.']],
                ['valuasi', 'penilaian bisnis', 'akuisisi', 'investasi'],
            ),
            $this->make(
                'Studi Kelayakan Bisnis',
                'Feasibility study berbasis data sebelum Anda mengambil keputusan besar.',
                'Keuangan', 'Hubungi Kami', 'Sesuai ruang lingkup', 16,
                'Penyusunan studi kelayakan (feasibility study) untuk menilai kelayakan usaha, ekspansi, atau proyek baru dari sisi keuangan dan pasar.',
                '<p>Keputusan ekspansi atau proyek baru sebaiknya diuji kelayakannya sebelum modal dikeluarkan.</p><p>Kami menyusun studi kelayakan menyeluruh sehingga Anda mengambil keputusan berbasis data, bukan asumsi.</p>',
                ['Analisis pasar & kompetisi', 'Proyeksi keuangan', 'Analisis kelayakan (BEP, ROI)', 'Rekomendasi keputusan'],
                [['Riset', 'Mengumpulkan data pasar dan operasional.'], ['Analisis', 'Menghitung proyeksi dan indikator kelayakan.'], ['Rekomendasi', 'Menyimpulkan kelayakan dan risikonya.']],
                [['Kelayakan Cabang Baru', 'Menilai kelayakan pembukaan lokasi baru.'], ['Kelayakan Proyek', 'Analisis proyek investasi sebelum eksekusi.']],
                [['Untuk apa studi kelayakan?', 'Untuk menilai apakah usaha/proyek layak dijalankan dan menekan risiko kerugian.']],
                ['studi kelayakan', 'feasibility study', 'proyeksi', 'BEP', 'ROI'],
            ),
            $this->make(
                'Sistem Payroll & Penggajian',
                'Kelola gaji, potongan, dan pajak karyawan secara akurat setiap bulan.',
                'Keuangan', 'Rp 500.000', 'Mulai dari / bulan', 17,
                'Pengelolaan penggajian karyawan secara menyeluruh, termasuk perhitungan gaji, potongan, BPJS, dan PPh 21.',
                '<p>Penggajian manual rawan salah hitung dan menyita waktu, apalagi dengan komponen pajak dan BPJS.</p><p>Kami mengelola payroll Anda secara akurat dan tepat waktu, lengkap dengan slip gaji dan pelaporan terkait.</p>',
                ['Perhitungan gaji & lembur', 'Potongan BPJS & PPh 21', 'Slip gaji karyawan', 'Rekap & pelaporan'],
                [['Setup', 'Menyusun struktur gaji dan komponen potongan.'], ['Proses Bulanan', 'Menghitung dan menyiapkan payroll tiap periode.'], ['Distribusi & Lapor', 'Menerbitkan slip dan rekap untuk pelaporan.']],
                [['Payroll UMKM', 'Penggajian rutin untuk usaha dengan puluhan karyawan.'], ['Integrasi PPh 21', 'Perhitungan pajak karyawan yang akurat.']],
                [['Apakah termasuk BPJS?', 'Ya, perhitungan iuran BPJS Kesehatan dan Ketenagakerjaan dapat kami sertakan.']],
                ['payroll', 'penggajian', 'PPh 21', 'BPJS', 'slip gaji'],
            ),
        ];
    }

    private function digital(): array
    {
        return [
            $this->make(
                'Jasa SEO & SEM',
                'Naikkan peringkat pencarian dan datangkan trafik yang siap membeli.',
                'Digital', 'Rp 1.500.000', 'Mulai dari / bulan', 20,
                'Optimasi mesin pencari (SEO) dan search engine marketing (SEM) untuk meningkatkan visibilitas dan trafik berkualitas.',
                '<p>Muncul di halaman pertama pencarian menentukan apakah calon pelanggan menemukan Anda atau kompetitor.</p><p>Kami mengoptimalkan situs dan kampanye pencarian Anda agar menjangkau audiens yang sedang mencari layanan Anda.</p>',
                ['Riset kata kunci', 'On-page & technical SEO', 'SEO lokal (Google Business)', 'Laporan performa'],
                [['Audit', 'Menganalisis kondisi SEO dan kata kunci target.'], ['Optimasi', 'Memperbaiki konten, teknis, dan struktur situs.'], ['Monitoring', 'Memantau peringkat dan menyesuaikan strategi.']],
                [['SEO Lokal Samarinda', 'Optimasi agar muncul di pencarian & Maps lokal.'], ['Google Ads', 'Kampanye SEM untuk hasil cepat.']],
                [['Kapan hasil terlihat?', 'SEO bersifat jangka menengah (beberapa bulan); SEM/iklan memberi hasil lebih cepat.']],
                ['SEO', 'SEM', 'kata kunci', 'google', 'peringkat'],
            ),
            $this->make(
                'Social Media Management',
                'Kelola media sosial yang konsisten, menarik, dan membangun audiens.',
                'Digital', 'Rp 1.500.000', 'Mulai dari / bulan', 21,
                'Pengelolaan media sosial menyeluruh, dari strategi konten, desain, hingga penjadwalan dan interaksi.',
                '<p>Media sosial yang dikelola asal-asalan justru menurunkan kredibilitas brand.</p><p>Kami menyusun strategi dan konten yang konsisten agar kehadiran sosial Anda menarik dan berdampak.</p>',
                ['Perencanaan konten', 'Desain & copywriting', 'Penjadwalan posting', 'Interaksi & laporan'],
                [['Strategi', 'Menyusun tema, pilar konten, dan jadwal.'], ['Produksi', 'Membuat konten visual dan teks.'], ['Publikasi & Analisis', 'Menerbitkan dan mengukur performa.']],
                [['Instagram Bisnis', 'Pengelolaan feed dan story untuk brand.'], ['Konten Edukasi', 'Konten yang membangun otoritas usaha.']],
                [['Apakah termasuk pembuatan konten?', 'Ya, kami membuat desain dan caption; kebutuhan foto/video produk dibahas saat konsultasi.']],
                ['social media', 'instagram', 'konten', 'medsos'],
            ),
            $this->make(
                'Meta & Google Ads',
                'Iklan berbayar yang terukur untuk mendatangkan leads dan penjualan.',
                'Digital', 'Rp 1.500.000', 'Mulai dari / project', 22,
                'Perencanaan dan pengelolaan iklan berbayar di Meta (Facebook/Instagram) dan Google untuk hasil yang terukur.',
                '<p>Iklan tanpa strategi hanya membakar anggaran. Yang penting adalah penargetan dan optimasi yang tepat.</p><p>Kami merancang, menjalankan, dan mengoptimalkan kampanye iklan Anda agar setiap rupiah bekerja maksimal.</p>',
                ['Riset audiens & penargetan', 'Pembuatan materi iklan', 'Optimasi kampanye', 'Laporan konversi'],
                [['Setup', 'Menyiapkan akun, audiens, dan materi iklan.'], ['Eksekusi', 'Menjalankan kampanye sesuai anggaran.'], ['Optimasi', 'Menyesuaikan agar biaya per hasil menurun.']],
                [['Meta Ads', 'Iklan Instagram/Facebook untuk penjualan produk.'], ['Google Ads', 'Iklan pencarian untuk layanan jasa.']],
                [['Apakah biaya iklan terpisah?', 'Ya, anggaran iklan (ad spend) terpisah dari jasa pengelolaan. Kami bantu tentukan anggaran efektifnya.']],
                ['ads', 'meta ads', 'google ads', 'iklan', 'facebook ads'],
            ),
            $this->make(
                'Brand Identity & Desain',
                'Bangun identitas visual yang konsisten dan mudah diingat.',
                'Digital', 'Rp 2.500.000', 'Mulai dari / project', 23,
                'Perancangan identitas brand, dari logo, palet warna, hingga panduan visual yang konsisten di semua kanal.',
                '<p>Brand yang tidak konsisten sulit diingat dan terlihat kurang profesional.</p><p>Kami menyusun identitas visual yang kuat dan panduannya, sehingga brand Anda tampil rapi di mana pun.</p>',
                ['Desain logo', 'Palet warna & tipografi', 'Brand guideline', 'Aset media sosial'],
                [['Discovery', 'Memahami nilai dan positioning brand.'], ['Desain', 'Merancang logo dan sistem visual.'], ['Guideline', 'Menyusun panduan penggunaan brand.']],
                [['Rebranding UMKM', 'Pembaruan identitas untuk usaha berkembang.'], ['Brand Baru', 'Identitas lengkap untuk usaha yang baru berdiri.']],
                [['Apakah dapat file logo?', 'Ya, Anda menerima file logo dalam berbagai format beserta panduan penggunaannya.']],
                ['branding', 'logo', 'desain', 'brand identity'],
            ),
            $this->make(
                'Pembuatan Website Korporat',
                'Website profesional yang cepat, SEO-friendly, dan mewakili brand Anda.',
                'Digital', 'Rp 3.500.000', 'Mulai dari / project', 24,
                'Pembuatan website korporat/company profile yang modern, cepat, dan dioptimalkan untuk mesin pencari.',
                '<p>Website adalah etalase digital pertama yang dilihat calon klien. Tampilan yang lambat atau usang menurunkan kepercayaan.</p><p>Kami membangun website yang cepat, rapi, dan SEO-friendly, mencerminkan profesionalitas usaha Anda.</p>',
                ['Desain modern & responsif', 'Optimasi kecepatan & SEO', 'Company profile / katalog', 'Integrasi WhatsApp & form'],
                [['Perancangan', 'Menyusun struktur dan tampilan sesuai brand.'], ['Pengembangan', 'Membangun website yang cepat dan responsif.'], ['Peluncuran', 'Menerbitkan situs dan menyerahkan akses.']],
                [['Company Profile', 'Website profil perusahaan yang elegan.'], ['Katalog Produk', 'Situs katalog dengan integrasi WhatsApp.']],
                [['Apakah termasuk domain & hosting?', 'Bisa kami sertakan atau menggunakan milik Anda; dibahas saat konsultasi.']],
                ['website', 'company profile', 'web', 'landing page'],
            ),
            $this->make(
                'Custom ERP Development',
                'Satukan operasional bisnis dalam satu sistem yang dibangun khusus.',
                'Digital', 'Hubungi Kami', 'Sesuai kebutuhan', 25,
                'Pengembangan sistem ERP custom untuk mengintegrasikan dan mengotomasi proses bisnis Anda dalam satu platform.',
                '<p>Data yang tersebar di banyak file dan aplikasi memperlambat dan menyulitkan pengambilan keputusan.</p><p>Kami membangun ERP sesuai alur bisnis Anda, sehingga operasional terpusat, akurat, dan mudah dipantau.</p>',
                ['Modul sesuai kebutuhan', 'Integrasi antar-proses', 'Manajemen hak akses', 'Pelatihan & dukungan'],
                [['Analisis', 'Memetakan proses dan kebutuhan sistem.'], ['Pengembangan', 'Membangun modul sesuai rancangan.'], ['Implementasi', 'Menerapkan sistem dan melatih tim.']],
                [['ERP Distributor', 'Integrasi stok, penjualan, dan keuangan.'], ['Sistem Internal', 'Otomasi proses administrasi perusahaan.']],
                [['Apakah bisa dikustomisasi?', 'Ya, sistem dibangun mengikuti proses bisnis Anda, bukan sebaliknya.']],
                ['ERP', 'sistem', 'otomasi', 'custom software'],
            ),
            $this->make(
                'Dashboard & Visualisasi Data',
                'Pantau KPI bisnis Anda secara real-time dalam satu layar.',
                'Digital', 'Hubungi Kami', 'Sesuai kebutuhan', 26,
                'Pembuatan dashboard interaktif untuk memvisualisasikan data dan KPI bisnis secara real-time.',
                '<p>Data yang menumpuk tanpa visualisasi sulit dijadikan dasar keputusan.</p><p>Kami membangun dashboard yang mengubah data Anda menjadi insight yang mudah dibaca dan dipantau.</p>',
                ['Integrasi sumber data', 'Visualisasi KPI', 'Filter & drill-down', 'Akses multi-user'],
                [['Pemetaan Data', 'Menentukan metrik dan sumber data.'], ['Pembuatan', 'Membangun dashboard interaktif.'], ['Serah Terima', 'Menyerahkan akses dan pelatihan singkat.']],
                [['Dashboard Penjualan', 'Memantau omzet dan tren secara real-time.'], ['Dashboard Keuangan', 'Visualisasi arus kas dan profitabilitas.']],
                [['Data dari mana saja?', 'Dari spreadsheet, database, atau sistem yang sudah Anda gunakan, sesuai ketersediaan.']],
                ['dashboard', 'visualisasi data', 'KPI', 'business intelligence'],
            ),
        ];
    }

    private function perizinan(): array
    {
        return [
            $this->make(
                'Pendirian PT',
                'Dirikan Perseroan Terbatas lengkap dengan akta, SK, NPWP, dan NIB.',
                'Perizinan', 'Hubungi Kami', 'Sesuai paket', 30,
                'Pengurusan pendirian PT (Perseroan Terbatas) secara lengkap, dari akta notaris hingga NIB via OSS.',
                '<p>Mendirikan PT melibatkan banyak tahap: akta, pengesahan Kemenkumham, NPWP, hingga NIB dengan KBLI yang tepat.</p><p>Kami mengurus seluruh prosesnya hingga PT Anda resmi dan siap beroperasi.</p>',
                ['Akta pendirian (notaris)', 'SK Kemenkumham', 'NPWP badan', 'NIB & KBLI 2025 (OSS)'],
                [['Konsultasi', 'Menentukan struktur, nama, dan bidang usaha (KBLI).'], ['Pengurusan', 'Mengurus akta, SK, NPWP, dan NIB.'], ['Serah Terima', 'Menyerahkan seluruh dokumen legal.']],
                [['PT Perdagangan', 'Pendirian PT untuk usaha dagang & distribusi.'], ['PT Jasa', 'Pendirian PT untuk usaha jasa/konsultan.']],
                [['Berapa lama prosesnya?', 'Umumnya beberapa hari hingga minggu tergantung kelengkapan berkas. Kami informasikan estimasinya di awal.']],
                ['pendirian PT', 'akta', 'kemenkumham', 'NIB'],
            ),
            $this->make(
                'Pendirian CV',
                'Bentuk badan usaha CV yang praktis untuk UMKM dan usaha berkembang.',
                'Perizinan', 'Hubungi Kami', 'Sesuai paket', 31,
                'Pengurusan pendirian CV (Persekutuan Komanditer) untuk usaha yang membutuhkan badan hukum praktis.',
                '<p>CV menjadi pilihan populer bagi UMKM karena prosesnya lebih sederhana dari PT.</p><p>Kami mengurus pendirian CV Anda lengkap dengan dokumen dan NIB, siap dipakai berusaha.</p>',
                ['Akta pendirian CV', 'Pendaftaran pengadilan/Kemenkumham', 'NPWP badan', 'NIB & KBLI 2025 (OSS)'],
                [['Konsultasi', 'Menentukan struktur & bidang usaha (KBLI).'], ['Pengurusan', 'Mengurus akta dan pendaftaran.'], ['Serah Terima', 'Menyerahkan dokumen legal CV.']],
                [['CV Dagang', 'Pendirian CV untuk usaha perdagangan.'], ['CV Kontraktor', 'Pendirian CV untuk usaha konstruksi/jasa.']],
                [['CV atau PT, pilih mana?', 'Tergantung skala, kebutuhan modal, dan tanggung jawab hukum. Kami bantu menentukan yang paling sesuai.']],
                ['pendirian CV', 'akta CV', 'badan usaha', 'UMKM'],
            ),
            $this->make(
                'Pengurusan NIB & OSS',
                'Terbitkan Nomor Induk Berusaha dengan KBLI 2025 yang tepat.',
                'Perizinan', 'Rp 500.000', 'Mulai dari', 32,
                'Pengurusan Nomor Induk Berusaha (NIB) melalui sistem OSS, termasuk pemilihan kode KBLI 2025 yang sesuai kegiatan usaha.',
                '<p>NIB adalah identitas berusaha wajib, dan penerbitannya melalui OSS bergantung pada pemilihan kode <strong>KBLI 2025</strong> yang tepat.</p><p>KBLI yang keliru bisa membuat izin tidak sesuai atau menghambat proses. Kami membantu memilih KBLI yang benar dan mengurus NIB Anda hingga terbit.</p>',
                ['Pemilihan & validasi KBLI 2025', 'Pembuatan akun OSS', 'Penerbitan NIB', 'Identifikasi izin berbasis risiko'],
                [['Analisis Usaha', 'Menentukan kode KBLI 2025 yang tepat.'], ['Pengajuan OSS', 'Mendaftarkan dan menerbitkan NIB.'], ['Serah Terima', 'Menyerahkan NIB dan info izin lanjutan.']],
                [['NIB UMKM', 'Penerbitan NIB cepat untuk usaha mikro/kecil.'], ['Penyesuaian KBLI', 'Menyesuaikan KBLI agar sesuai kegiatan nyata.']],
                [['Apa itu KBLI 2025?', 'KBLI (Klasifikasi Baku Lapangan Usaha Indonesia) adalah kode bidang usaha di OSS yang menentukan NIB dan izin berbasis risiko.'], ['Apakah bantu pilih KBLI?', 'Ya, kami analisis kegiatan usaha Anda dan memilih KBLI 2025 yang tepat.']],
                ['NIB', 'OSS', 'KBLI', 'KBLI 2025', 'izin berusaha'],
            ),
            $this->make(
                'Akta Pendirian & Perubahan',
                'Urus akta notaris untuk pendirian maupun perubahan data perusahaan.',
                'Perizinan', 'Hubungi Kami', 'Sesuai kebutuhan', 33,
                'Pengurusan akta notaris untuk pendirian badan usaha maupun perubahan (pengurus, alamat, modal, atau bidang usaha).',
                '<p>Perubahan data perusahaan (pengurus, alamat, modal, atau KBLI) perlu dituangkan dalam akta agar sah secara hukum.</p><p>Kami mengurus akta pendirian maupun perubahan Anda hingga tercatat resmi.</p>',
                ['Akta pendirian', 'Akta perubahan pengurus', 'Perubahan alamat & modal', 'Perubahan bidang usaha (KBLI)'],
                [['Konsultasi', 'Menentukan jenis akta/perubahan yang diperlukan.'], ['Pengurusan', 'Menyusun akta bersama notaris & mendaftarkannya.'], ['Serah Terima', 'Menyerahkan akta yang telah sah.']],
                [['Perubahan Pengurus', 'Akta perubahan direksi/komisaris.'], ['Perubahan KBLI', 'Menambah/menyesuaikan bidang usaha.']],
                [['Kapan perlu akta perubahan?', 'Saat ada perubahan pengurus, alamat, modal, nama, atau bidang usaha perusahaan.']],
                ['akta', 'notaris', 'perubahan perusahaan', 'legalitas'],
            ),
        ];
    }
}

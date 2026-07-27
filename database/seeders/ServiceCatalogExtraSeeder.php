<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ServiceCatalogExtraSeeder extends Seeder
{
    /**
     * Layanan non-perpajakan (Keuangan, Digital, Perizinan) dengan konten halaman detail.
     * Idempotent (updateOrCreate by slug).
     */
    public function run(): void
    {
        $services = [
            [
                'name' => 'Jasa Akuntansi & Keuangan',
                'subtitle' => 'Laporan keuangan standar PSAK yang akurat dan tepat waktu untuk keputusan bisnis yang lebih tajam.',
                'category' => 'Keuangan',
                'price' => 'Rp 750.000',
                'price_note' => 'Mulai dari / bulan',
                'order' => 10,
                'description' => '<p>Penyusunan pembukuan dan laporan keuangan sesuai standar PSAK, dari transaksi harian hingga laporan bulanan dan tahunan yang siap dipakai untuk pengambilan keputusan.</p>',
                'overview' => '<p>Tanpa laporan keuangan yang rapi, keputusan bisnis hanya menjadi tebakan yang mahal. Banyak usaha tumbuh tanpa visibilitas arus kas yang jelas.</p><p>Kisantra mengubah data transaksi Anda menjadi laporan keuangan standar PSAK yang akurat, plus analisis yang membantu Anda memahami kondisi finansial usaha secara nyata.</p>',
                'features' => ['Laporan Laba Rugi & Neraca', 'Analisis Arus Kas (Cash Flow)', 'Valuasi Aset & Bisnis', 'Audit Internal Operasional', 'Sistem Payroll & Penggajian', 'Studi Kelayakan Bisnis'],
                'process_steps' => [
                    ['title' => 'Pengumpulan Data', 'description' => 'Menghimpun transaksi, mutasi, dan dokumen keuangan.'],
                    ['title' => 'Penyusunan Laporan', 'description' => 'Menyusun laporan keuangan sesuai standar PSAK.'],
                    ['title' => 'Analisis & Rekomendasi', 'description' => 'Membaca angka menjadi insight untuk keputusan bisnis.'],
                    ['title' => 'Pelaporan Berkala', 'description' => 'Menyajikan laporan rutin bulanan atau sesuai kebutuhan.'],
                ],
                'examples' => [
                    ['title' => 'Pembukuan Bulanan UMKM', 'description' => 'Pencatatan dan laporan keuangan rutin untuk usaha kecil.'],
                    ['title' => 'Valuasi Bisnis', 'description' => 'Penilaian nilai usaha untuk investasi atau akuisisi.'],
                    ['title' => 'Audit Internal', 'description' => 'Pemeriksaan kontrol internal untuk mencegah kebocoran.'],
                ],
                'faqs' => [
                    ['question' => 'Apakah cocok untuk UMKM?', 'answer' => 'Sangat cocok. Kami menyesuaikan cakupan dengan skala usaha, dari pembukuan sederhana hingga laporan lengkap.'],
                    ['question' => 'Apakah laporannya bisa dipakai untuk pengajuan kredit?', 'answer' => 'Ya. Laporan disusun sesuai standar sehingga dapat digunakan untuk bank maupun investor.'],
                ],
                'search_keywords' => ['akuntansi', 'laporan keuangan', 'PSAK', 'pembukuan', 'audit', 'arus kas'],
            ],
            [
                'name' => 'Digital Marketing',
                'subtitle' => 'Strategi pemasaran berbasis data untuk mendongkrak omset dan brand awareness.',
                'category' => 'Digital',
                'price' => 'Rp 1.500.000',
                'price_note' => 'Mulai dari / project',
                'order' => 11,
                'description' => '<p>Strategi dan eksekusi pemasaran digital menyeluruh, dari SEO dan iklan berbayar hingga pengelolaan media sosial dan brand identity, untuk menjangkau audiens yang tepat.</p>',
                'overview' => '<p>Kehadiran online yang tidak terarah hanya membuang anggaran. Yang dibutuhkan adalah strategi berbasis data, bukan sekadar posting rutin.</p><p>Kami merancang dan menjalankan kampanye digital yang terukur, menghubungkan brand Anda dengan audiens yang relevan dan mengubahnya menjadi pendapatan.</p>',
                'features' => ['SEO & SEM Optimization', 'Social Media Management', 'Meta & Google Ads', 'Brand Identity Design', 'Content Strategy', 'Market Research & Analytics'],
                'process_steps' => [
                    ['title' => 'Riset & Audit', 'description' => 'Menganalisis pasar, kompetitor, dan posisi brand Anda.'],
                    ['title' => 'Strategi', 'description' => 'Menyusun rencana kanal, pesan, dan target yang terukur.'],
                    ['title' => 'Eksekusi Kampanye', 'description' => 'Menjalankan konten, iklan, dan aktivasi digital.'],
                    ['title' => 'Analisis & Optimasi', 'description' => 'Memantau performa dan mengoptimalkan hasil secara berkala.'],
                ],
                'examples' => [
                    ['title' => 'SEO Lokal Samarinda', 'description' => 'Optimasi agar bisnis muncul di pencarian lokal.'],
                    ['title' => 'Kampanye Meta & Google Ads', 'description' => 'Iklan berbayar untuk menaikkan leads dan penjualan.'],
                    ['title' => 'Rebranding UMKM', 'description' => 'Penyusunan identitas visual dan positioning brand.'],
                ],
                'faqs' => [
                    ['question' => 'Apakah termasuk biaya iklan (ad spend)?', 'answer' => 'Biaya jasa terpisah dari anggaran iklan. Kami bantu menentukan anggaran iklan yang efektif saat konsultasi.'],
                    ['question' => 'Berapa lama hasil SEO terlihat?', 'answer' => 'SEO bersifat jangka menengah, umumnya mulai terlihat dalam beberapa bulan; iklan berbayar memberi hasil lebih cepat.'],
                ],
                'search_keywords' => ['digital marketing', 'SEO', 'ads', 'social media', 'branding', 'iklan'],
            ],
            [
                'name' => 'Sistem Digital & ERP',
                'subtitle' => 'Infrastruktur teknologi untuk efisiensi operasional dalam satu dashboard terpusat.',
                'category' => 'Digital',
                'price' => 'Rp 2.500.000',
                'price_note' => 'Mulai dari / system',
                'order' => 12,
                'description' => '<p>Perancangan dan pengembangan sistem digital, mulai dari ERP, website korporat, hingga dashboard data, untuk mengotomasi dan menyatukan proses bisnis Anda.</p>',
                'overview' => '<p>Proses manual yang tersebar di banyak file dan aplikasi memperlambat operasional dan rawan kesalahan.</p><p>Kami membangun sistem yang mengintegrasikan alur kerja bisnis Anda dalam satu platform terpusat, sehingga operasional lebih cepat, akurat, dan mudah dipantau.</p>',
                'features' => ['Custom ERP Development', 'Pembuatan Website Korporat', 'Dashboard Visualisasi Data', 'Cloud Server Setup', 'Integrasi POS & Stok', 'Cybersecurity Audit'],
                'process_steps' => [
                    ['title' => 'Analisis Kebutuhan', 'description' => 'Memetakan proses bisnis dan kebutuhan sistem.'],
                    ['title' => 'Perancangan', 'description' => 'Menyusun arsitektur dan alur sistem.'],
                    ['title' => 'Pengembangan', 'description' => 'Membangun sistem sesuai rancangan yang disepakati.'],
                    ['title' => 'Deployment & Pelatihan', 'description' => 'Menerapkan sistem dan melatih tim Anda.'],
                ],
                'examples' => [
                    ['title' => 'ERP untuk Distributor', 'description' => 'Integrasi stok, penjualan, dan keuangan dalam satu sistem.'],
                    ['title' => 'Website Korporat', 'description' => 'Company profile modern yang cepat dan SEO-friendly.'],
                    ['title' => 'Dashboard Data', 'description' => 'Visualisasi KPI bisnis secara real-time.'],
                ],
                'faqs' => [
                    ['question' => 'Apakah sistem bisa disesuaikan dengan alur kami?', 'answer' => 'Ya, kami membangun sistem custom mengikuti proses bisnis Anda, bukan sebaliknya.'],
                    ['question' => 'Apakah ada dukungan setelah sistem jadi?', 'answer' => 'Kami menyediakan pelatihan dan opsi pemeliharaan sesuai kebutuhan.'],
                ],
                'search_keywords' => ['ERP', 'sistem', 'website', 'dashboard', 'cloud', 'POS'],
            ],
            [
                'name' => 'Administrasi & Legalitas Usaha',
                'subtitle' => 'Pengurusan legalitas dan dokumen usaha hingga siap beroperasi, tanpa ribet.',
                'category' => 'Perizinan',
                'price' => 'Rp 350.000',
                'price_note' => 'Mulai dari / dokumen',
                'order' => 13,
                'description' => '<p>Pengurusan legalitas usaha secara menyeluruh, dari pendirian badan usaha, izin, hingga dokumen operasional agar bisnis Anda berjalan sesuai ketentuan.</p>',
                'overview' => '<p>Legalitas yang tidak beres bisa menghambat kerja sama, tender, hingga akses pembiayaan. Prosesnya sering membingungkan dan memakan waktu.</p><p>Pengurusan NIB melalui OSS mengharuskan pemilihan kode <strong>KBLI 2025</strong> (Klasifikasi Baku Lapangan Usaha Indonesia) yang tepat sesuai kegiatan usaha. KBLI yang keliru dapat menghambat terbitnya izin atau menimbulkan masalah kepatuhan di kemudian hari.</p><p>Kisantra mengurus dokumen legal usaha Anda dari nol hingga siap beroperasi, termasuk membantu menentukan KBLI 2025 yang sesuai, sehingga Anda bisa fokus menjalankan bisnis.</p>',
                'features' => ['Pemilihan & validasi KBLI 2025 (OSS)', 'Izin Usaha (NIB & OSS)', 'Pendirian PT & CV', 'Pembuatan NPWP Pribadi & Badan', 'Pengukuhan PKP', 'Akta Pendirian & Perubahan'],
                'process_steps' => [
                    ['title' => 'Konsultasi', 'description' => 'Menentukan jenis badan usaha dan izin yang dibutuhkan.'],
                    ['title' => 'Penyiapan Berkas', 'description' => 'Menyusun dokumen persyaratan yang diperlukan.'],
                    ['title' => 'Pengajuan', 'description' => 'Mengurus pendaftaran ke instansi terkait.'],
                    ['title' => 'Serah Terima', 'description' => 'Menyerahkan dokumen resmi yang telah terbit.'],
                ],
                'examples' => [
                    ['title' => 'Pemilihan KBLI 2025', 'description' => 'Menentukan & memvalidasi kode KBLI 2025 di OSS agar sesuai kegiatan usaha.'],
                    ['title' => 'Pendirian PT', 'description' => 'Pembuatan akta, SK Kemenkumham, NPWP, dan NIB.'],
                    ['title' => 'NIB via OSS', 'description' => 'Penerbitan Nomor Induk Berusaha untuk UMKM.'],
                ],
                'faqs' => [
                    ['question' => 'Apa itu KBLI dan mengapa penting?', 'answer' => 'KBLI (Klasifikasi Baku Lapangan Usaha Indonesia) adalah kode bidang usaha yang dipakai di OSS untuk menerbitkan NIB dan menentukan perizinan berbasis risiko. Pemilihan KBLI yang tepat menentukan izin apa saja yang usaha Anda butuhkan.'],
                    ['question' => 'Apakah Kisantra membantu memilih KBLI 2025 yang sesuai?', 'answer' => 'Ya. Kami menganalisis kegiatan usaha Anda dan membantu memilih kode KBLI 2025 yang tepat saat pengurusan NIB melalui OSS, agar izin sesuai dan tidak menimbulkan kendala di kemudian hari.'],
                    ['question' => 'Berapa lama pendirian PT?', 'answer' => 'Bervariasi tergantung kelengkapan berkas, umumnya beberapa hari hingga minggu. Kami informasikan estimasinya di awal.'],
                ],
                'search_keywords' => ['KBLI', 'KBLI 2025', 'NIB', 'OSS', 'PT', 'CV', 'legalitas', 'izin usaha', 'akta'],
            ],
        ];

        foreach ($services as $data) {
            $data['slug'] = Str::slug($data['name']);
            $data['is_active'] = true;
            Service::updateOrCreate(['slug' => $data['slug']], $data);
        }

        $this->command->info('Extra service catalog seeded successfully!');
    }
}

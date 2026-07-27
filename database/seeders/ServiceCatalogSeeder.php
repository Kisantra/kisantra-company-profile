<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ServiceCatalogSeeder extends Seeder
{
    /**
     * Contoh layanan perpajakan dengan konten halaman detail lengkap.
     * Idempotent (updateOrCreate by slug). SP2DK tidak diseed karena punya halaman bespoke sendiri (/sp2dk).
     */
    public function run(): void
    {
        $services = [
            [
                'name' => 'Pelaporan SPT Tahunan & Masa',
                'subtitle' => 'Lapor pajak tepat waktu, tanpa ribet dan bebas sanksi keterlambatan.',
                'category' => 'Perpajakan',
                'price' => 'Rp 500.000',
                'price_note' => 'Mulai dari',
                'order' => 1,
                'description' => '<p>Layanan penyusunan dan pelaporan SPT (Surat Pemberitahuan) Tahunan maupun Masa untuk pribadi dan badan, sesuai ketentuan perpajakan yang berlaku.</p>',
                'overview' => '<p>Pelaporan SPT yang benar dan tepat waktu adalah fondasi kepatuhan pajak. Kesalahan atau keterlambatan dapat memicu sanksi administrasi hingga pemeriksaan.</p><p>Kisantra membantu menyusun, menghitung, dan melaporkan SPT Anda secara akurat, sehingga kewajiban pajak beres tanpa Anda perlu pusing dengan detail teknisnya.</p>',
                'features' => ['SPT Tahunan Badan & Pribadi', 'SPT Masa PPN & PPh', 'Rekonsiliasi data & bukti potong', 'Pelaporan via e-Filing / e-Bupot', 'Pengingat jatuh tempo'],
                'process_steps' => [
                    ['title' => 'Pengumpulan Data', 'description' => 'Kami menghimpun laporan keuangan, bukti potong, dan dokumen pendukung.'],
                    ['title' => 'Perhitungan & Penyusunan', 'description' => 'Menghitung kewajiban pajak dan menyusun SPT sesuai ketentuan.'],
                    ['title' => 'Review & Persetujuan', 'description' => 'Anda memeriksa draf SPT sebelum dilaporkan.'],
                    ['title' => 'Pelaporan Resmi', 'description' => 'SPT dilaporkan ke DJP dan Anda menerima bukti lapor.'],
                ],
                'examples' => [
                    ['title' => 'SPT Tahunan PT', 'description' => 'Penyusunan SPT Tahunan badan untuk perusahaan dagang dengan rekonsiliasi fiskal.'],
                    ['title' => 'SPT Masa PPN', 'description' => 'Pelaporan PPN bulanan untuk PKP dengan ratusan faktur.'],
                    ['title' => 'SPT Orang Pribadi', 'description' => 'Pelaporan penghasilan pemilik usaha dan profesional.'],
                ],
                'faqs' => [
                    ['question' => 'Dokumen apa saja yang perlu disiapkan?', 'answer' => 'Laporan keuangan, bukti potong (Bupot), faktur pajak, dan data transaksi terkait. Kami akan memandu daftar lengkapnya.'],
                    ['question' => 'Apakah bisa untuk SPT yang terlambat?', 'answer' => 'Bisa. Kami bantu penyusunan SPT pembetulan maupun pelaporan yang tertunda beserta perhitungan sanksinya.'],
                ],
                'search_keywords' => ['SPT', 'Tahunan', 'Masa', 'e-Filing', 'lapor pajak'],
            ],
            [
                'name' => 'Perhitungan PPN & PPh',
                'subtitle' => 'Hitung PPN dan PPh secara akurat agar setoran pajak tepat, tidak kurang atau lebih.',
                'category' => 'Perpajakan',
                'price' => 'Rp 750.000',
                'price_note' => 'Mulai dari / bulan',
                'order' => 2,
                'description' => '<p>Perhitungan Pajak Pertambahan Nilai (PPN) dan Pajak Penghasilan (PPh) Masa secara berkala untuk memastikan kewajiban pajak dihitung dengan benar.</p>',
                'overview' => '<p>Perhitungan pajak yang keliru berisiko menimbulkan kurang bayar (dan sanksi) atau lebih bayar (arus kas tertahan).</p><p>Kami menghitung PPN dan PPh Masa Anda setiap periode berdasarkan data transaksi, lengkap dengan dokumentasi yang rapi untuk pelaporan.</p>',
                'features' => ['PPN Keluaran & Masukan', 'PPh 21 / 23 / 4(2) / 25', 'Rekonsiliasi faktur pajak', 'Perhitungan angsuran PPh', 'Dokumentasi siap lapor'],
                'process_steps' => [
                    ['title' => 'Input Transaksi', 'description' => 'Menghimpun data penjualan, pembelian, dan pembayaran periode berjalan.'],
                    ['title' => 'Perhitungan Pajak', 'description' => 'Menghitung PPN dan PPh sesuai tarif dan ketentuan.'],
                    ['title' => 'Rekap & Laporan', 'description' => 'Menyusun rekap kewajiban pajak untuk disetor dan dilaporkan.'],
                ],
                'examples' => [
                    ['title' => 'PPN Bulanan PKP', 'description' => 'Rekonsiliasi faktur keluaran-masukan untuk distributor.'],
                    ['title' => 'PPh 21 Karyawan', 'description' => 'Perhitungan PPh 21 bulanan untuk perusahaan dengan puluhan karyawan.'],
                ],
                'faqs' => [
                    ['question' => 'Apakah termasuk pembuatan faktur pajak?', 'answer' => 'Kami dapat membantu rekonsiliasi dan pembuatan e-Faktur sesuai kebutuhan; cakupannya kami sesuaikan saat konsultasi.'],
                ],
                'search_keywords' => ['PPN', 'PPh', 'faktur', 'e-Faktur', 'PPh 21'],
            ],
            [
                'name' => 'Restitusi Pajak',
                'subtitle' => 'Ajukan pengembalian kelebihan pembayaran pajak dengan pendampingan menyeluruh.',
                'category' => 'Perpajakan',
                'price' => 'Hubungi Kami',
                'price_note' => 'Sesuai nilai & kompleksitas',
                'order' => 3,
                'description' => '<p>Pendampingan pengajuan restitusi (pengembalian) kelebihan pembayaran pajak, termasuk penyiapan dokumen dan pendampingan pemeriksaan.</p>',
                'overview' => '<p>Restitusi memungkinkan Anda menarik kembali kelebihan pembayaran pajak, namun prosesnya menuntut dokumentasi yang kuat dan hampir selalu diikuti pemeriksaan oleh DJP.</p><p>Kami menyiapkan berkas, mengawal proses pemeriksaan, dan memaksimalkan peluang restitusi Anda disetujui.</p>',
                'features' => ['Analisis kelayakan restitusi', 'Penyiapan dokumen & bukti', 'Pendampingan pemeriksaan', 'Komunikasi dengan pemeriksa', 'Monitoring hingga pencairan'],
                'process_steps' => [
                    ['title' => 'Analisis Kelayakan', 'description' => 'Menilai potensi dan risiko sebelum pengajuan.'],
                    ['title' => 'Penyiapan Berkas', 'description' => 'Menyusun dokumen dan bukti pendukung restitusi.'],
                    ['title' => 'Pendampingan Pemeriksaan', 'description' => 'Mendampingi proses pemeriksaan oleh DJP.'],
                    ['title' => 'Monitoring Pencairan', 'description' => 'Mengawal proses hingga restitusi cair.'],
                ],
                'examples' => [
                    ['title' => 'Restitusi PPN', 'description' => 'Pengembalian lebih bayar PPN untuk eksportir.'],
                    ['title' => 'Lebih Bayar PPh Badan', 'description' => 'Restitusi kelebihan angsuran PPh perusahaan.'],
                ],
                'faqs' => [
                    ['question' => 'Berapa lama proses restitusi?', 'answer' => 'Bervariasi tergantung jenis pajak dan pemeriksaan, umumnya beberapa bulan. Kami mengawal setiap tahapannya.'],
                    ['question' => 'Apakah restitusi pasti diperiksa?', 'answer' => 'Sebagian besar pengajuan restitusi diikuti pemeriksaan. Karena itu kesiapan dokumen sangat menentukan.'],
                ],
                'search_keywords' => ['restitusi', 'lebih bayar', 'pengembalian pajak', 'PPN'],
            ],
            [
                'name' => 'Keberatan & Banding Pajak',
                'subtitle' => 'Perjuangkan hak Anda atas koreksi pajak melalui keberatan hingga banding.',
                'category' => 'Perpajakan',
                'price' => 'Hubungi Kami',
                'price_note' => 'Sesuai kompleksitas sengketa',
                'order' => 4,
                'description' => '<p>Pendampingan penyelesaian sengketa pajak, mulai dari upaya keberatan atas ketetapan pajak hingga proses banding di Pengadilan Pajak.</p>',
                'overview' => '<p>Ketika hasil pemeriksaan tidak sesuai, Anda berhak mengajukan keberatan dan, bila perlu, banding. Prosesnya teknis dan terikat tenggat yang ketat.</p><p>Kami menyusun argumentasi hukum, dokumen pendukung, dan mendampingi Anda pada setiap tahap agar hak perpajakan Anda terlindungi.</p>',
                'features' => ['Analisis ketetapan pajak', 'Penyusunan surat keberatan', 'Argumentasi & dasar hukum', 'Pendampingan banding', 'Representasi di Pengadilan Pajak'],
                'process_steps' => [
                    ['title' => 'Telaah Ketetapan', 'description' => 'Menganalisis SKP dan dasar koreksi DJP.'],
                    ['title' => 'Penyusunan Keberatan', 'description' => 'Menyiapkan surat keberatan beserta bukti dan argumen.'],
                    ['title' => 'Proses Keberatan', 'description' => 'Mendampingi hingga keputusan keberatan terbit.'],
                    ['title' => 'Banding (bila perlu)', 'description' => 'Menyiapkan dan mendampingi proses banding di Pengadilan Pajak.'],
                ],
                'examples' => [
                    ['title' => 'Keberatan atas SKPKB', 'description' => 'Menyanggah koreksi kurang bayar hasil pemeriksaan.'],
                    ['title' => 'Banding Sengketa PPN', 'description' => 'Pendampingan banding atas sengketa kredit pajak.'],
                ],
                'faqs' => [
                    ['question' => 'Kapan batas waktu mengajukan keberatan?', 'answer' => 'Umumnya 3 bulan sejak tanggal ketetapan. Karena ketat, sebaiknya segera konsultasi begitu menerima SKP.'],
                ],
                'search_keywords' => ['keberatan', 'banding', 'sengketa pajak', 'pengadilan pajak', 'SKP'],
            ],
            [
                'name' => 'Pengurusan NPWP & PKP',
                'subtitle' => 'Urus NPWP dan pengukuhan PKP dengan cepat, benar, dan tanpa bolak-balik.',
                'category' => 'Perpajakan',
                'price' => 'Rp 350.000',
                'price_note' => 'Mulai dari / dokumen',
                'order' => 5,
                'description' => '<p>Pengurusan pendaftaran NPWP (pribadi & badan) dan pengukuhan Pengusaha Kena Pajak (PKP) sesuai persyaratan DJP.</p>',
                'overview' => '<p>NPWP dan status PKP adalah gerbang kepatuhan pajak usaha Anda. Persyaratan yang tidak lengkap sering membuat proses tertunda.</p><p>Kami menyiapkan berkas dan mengurus pendaftaran hingga terbit, sehingga usaha Anda siap beroperasi secara legal.</p>',
                'features' => ['NPWP Pribadi & Badan', 'Pengukuhan PKP', 'Penyiapan berkas persyaratan', 'Aktivasi akun pajak (DJP Online)', 'Konsultasi kewajiban lanjutan'],
                'process_steps' => [
                    ['title' => 'Cek Persyaratan', 'description' => 'Memastikan kelengkapan dokumen sesuai jenis pendaftaran.'],
                    ['title' => 'Pengajuan', 'description' => 'Mendaftarkan NPWP / PKP ke kantor pajak terkait.'],
                    ['title' => 'Aktivasi & Serah Terima', 'description' => 'Mengaktifkan akun pajak dan menyerahkan dokumen kepada Anda.'],
                ],
                'examples' => [
                    ['title' => 'NPWP Badan Baru', 'description' => 'Pendaftaran NPWP untuk PT yang baru berdiri.'],
                    ['title' => 'Pengukuhan PKP', 'description' => 'Pengurusan status PKP agar bisa menerbitkan faktur pajak.'],
                ],
                'faqs' => [
                    ['question' => 'Berapa lama prosesnya?', 'answer' => 'NPWP relatif cepat; pengukuhan PKP dapat memerlukan verifikasi lapangan. Kami informasikan estimasinya saat konsultasi.'],
                ],
                'search_keywords' => ['NPWP', 'PKP', 'pengukuhan', 'daftar pajak'],
            ],
        ];

        foreach ($services as $data) {
            $data['slug'] = Str::slug($data['name']);
            $data['is_active'] = true;
            Service::updateOrCreate(['slug' => $data['slug']], $data);
        }

        $this->command->info('Service catalog seeded successfully!');
    }
}

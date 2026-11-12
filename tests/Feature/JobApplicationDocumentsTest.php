<?php

namespace Tests\Feature;

use App\Filament\Resources\JobPostings\Pages\CreateJobPosting;
use App\Filament\Resources\JobPostings\Pages\EditJobPosting;
use App\Mail\ApplicationConfirmationEmail;
use App\Mail\JobApplicationMail;
use App\Models\JobPosting;
use App\Models\RecruitmentBatch;
use App\Models\User;
use Filament\Forms\Components\Repeater;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request as HttpRequest;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Livewire\Livewire;
use Tests\TestCase;

class JobApplicationDocumentsTest extends TestCase
{
    use RefreshDatabase;

    private const API_URL = 'https://attendance.test/api/job-applications';

    protected function setUp(): void
    {
        parent::setUp();

        config(['services.attendance.job_applications_url' => self::API_URL]);
        Storage::fake('local');
    }

    private function job(array $overrides = []): JobPosting
    {
        return JobPosting::create(array_merge([
            'title' => 'Staf Sistem Digital',
            'description' => '<p>Mengelola sistem internal.</p>',
            'location' => 'Samarinda',
            'division' => 'Sistem Digital',
            'employment_type' => 'full_time',
            'work_type' => 'onsite',
            'status' => 'active',
            'online_test_start_date' => '2026-11-10',
            'online_test_end_date' => '2026-11-14',
            'required_documents' => [
                ['name' => 'KTP', 'required' => true, 'formats' => ['image', 'pdf'], 'description' => 'Scan KTP yang masih berlaku'],
                ['name' => 'CV / Resume', 'required' => true, 'formats' => ['pdf', 'word'], 'description' => null],
                ['name' => 'Sertifikat Keahlian', 'required' => false, 'formats' => ['pdf'], 'description' => null],
            ],
        ], $overrides));
    }

    private function pdf(string $name, int $reportedKb = 0): UploadedFile
    {
        $file = UploadedFile::fake()->createWithContent($name, "%PDF-1.4\n1 0 obj << /Type /Catalog >> endobj\ntrailer << /Root 1 0 R >>\n%%EOF\n");

        return $reportedKb ? $file->size($reportedKb) : $file;
    }

    private function applicant(JobPosting $job, array $overrides = []): array
    {
        return array_merge([
            'job_id' => $job->id,
            'name' => 'Pelamar Uji',
            'email' => 'pelamar@test.dev',
            'phone' => '081234567890',
            'alamat' => 'Jl. Uji No. 1, Samarinda',
            'pendidikan_terakhir' => 'S1',
            'jurusan' => 'Sistem Informasi',
            'tahun_lulus' => '2024',
            'ipk' => '3,5',
            'pengalaman' => 'kurang_dari_1_tahun',
            'siap_tes_online' => '1',
            'persetujuan_data' => '1',
            'source' => 'website',
            'cover_letter' => 'Saya tertarik.',
        ], $overrides);
    }

    /** @return array<string, array{contents: mixed, filename: ?string}> */
    private function multipartParts(HttpRequest $request): array
    {
        return collect($request->data())
            ->mapWithKeys(fn (array $part) => [$part['name'] => ['contents' => $part['contents'], 'filename' => $part['filename'] ?? null]])
            ->all();
    }

    private function fakeApiAccepts(): void
    {
        Http::fake([self::API_URL => Http::response(['success' => true, 'data' => ['id' => 77]], 201)]);
    }

    public function test_karir_page_lists_each_jobs_documents(): void
    {
        $this->withoutVite();
        $this->job();

        $this->get('/karir')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Karir')
                ->has('groups.0.jobs.0.documents', 3)
                ->where('groups.0.jobs.0.documents.0', [
                    'key' => 'ktp',
                    'name' => 'KTP',
                    'required' => true,
                    'description' => 'Scan KTP yang masih berlaku',
                    'accept' => '.pdf,.jpg,.jpeg,.png',
                    'formats_label' => 'PDF, JPG/PNG',
                ])
                ->where('groups.0.jobs.0.documents.1.key', 'cv-resume')
                ->where('groups.0.jobs.0.documents.1.accept', '.pdf,.doc,.docx')
                ->where('groups.0.jobs.0.documents.2.required', false)
                ->where('groups.0.jobs.0.online_test_period', '10–14 November 2026')
                ->where('educationLevels', ['SMA/SMK', 'D1', 'D2', 'D3', 'D4', 'S1', 'S2', 'S3'])
                ->where('experienceOptions.1_tahun_atau_lebih', '≥ 1 tahun'));
    }

    public function test_job_without_configured_documents_asks_for_a_cv_only(): void
    {
        $job = $this->job(['required_documents' => null]);

        $this->assertSame([[
            'key' => 'cv-resume',
            'name' => 'CV / Resume',
            'required' => true,
            'description' => null,
            'extensions' => ['pdf', 'doc', 'docx'],
            'formats_label' => 'PDF, DOC/DOCX',
        ]], $job->documentRequirements());
    }

    public function test_duplicate_document_names_get_distinct_keys(): void
    {
        $job = $this->job(['required_documents' => [
            ['name' => 'Sertifikat', 'formats' => ['pdf']],
            ['name' => 'Sertifikat', 'formats' => ['pdf']],
            ['name' => '', 'formats' => ['pdf']],
        ]]);

        $this->assertSame(['sertifikat', 'sertifikat-2'], array_column($job->documentRequirements(), 'key'));
    }

    public function test_application_sends_every_document_with_its_type(): void
    {
        $this->fakeApiAccepts();
        Mail::fake();
        $job = $this->job();

        $this->from('/karir')->post('/api/apply-job', $this->applicant($job, [
            'documents' => [
                'ktp' => UploadedFile::fake()->image('ktp-saya.jpg'),
                'cv-resume' => $this->pdf('cv.pdf'),
            ],
            'extra_files' => [$this->pdf('portofolio.pdf')],
        ]))->assertRedirect('/karir')->assertSessionHasNoErrors();

        Http::assertSentCount(1);
        Http::assertSent(function (HttpRequest $request) {
            $parts = $this->multipartParts($request);

            return $request->url() === self::API_URL
                && $request->isMultipart()
                && $parts['file_terkait[0]']['filename'] === 'ktp-saya.jpg'
                && $parts['jenis_dokumen[0]']['contents'] === 'KTP'
                && $parts['file_terkait[1]']['filename'] === 'cv.pdf'
                && $parts['jenis_dokumen[1]']['contents'] === 'CV / Resume'
                && $parts['file_terkait[2]']['filename'] === 'portofolio.pdf'
                && $parts['jenis_dokumen[2]']['contents'] === 'Dokumen Lain'
                && ! isset($parts['file_terkait[3]'])
                && $parts['posisi']['contents'] === 'Staf Sistem Digital'
                && $parts['department_id']['contents'] === 2
                && $parts['nama']['contents'] === 'Pelamar Uji'
                && $parts['pendidikan_terakhir']['contents'] === 'S1'
                && $parts['jurusan']['contents'] === 'Sistem Informasi'
                && $parts['tahun_lulus']['contents'] === 2024
                && $parts['ipk']['contents'] === '3.5'
                && $parts['pengalaman']['contents'] === 'kurang_dari_1_tahun'
                && $parts['siap_tes_online']['contents'] === 1
                && $parts['persetujuan_data']['contents'] === 1;
        });

        Mail::assertSent(JobApplicationMail::class, function (JobApplicationMail $mail) {
            $names = array_map(fn ($attachment) => $attachment->as, $mail->attachments());

            return $mail->hasTo('hr.kisantra@gmail.com')
                && $names === ['KTP - ktp-saya.jpg', 'CV - Resume - cv.pdf', 'Dokumen Lain - portofolio.pdf']
                && $mail->data['saved_in_attendance'] === true;
        });
        Mail::assertSent(ApplicationConfirmationEmail::class, function (ApplicationConfirmationEmail $mail) {
            return $mail->hasTo('pelamar@test.dev')
                && $mail->attachments === []
                && array_column($mail->applicationData['documents'], 'label') === ['KTP', 'CV / Resume', 'Dokumen Lain'];
        });

        $this->assertCount(3, Storage::disk('local')->files('job-applications'));
    }

    public function test_emails_render_the_document_list(): void
    {
        $this->fakeApiAccepts();
        $job = $this->job();

        $this->post('/api/apply-job', $this->applicant($job, [
            'documents' => [
                'ktp' => UploadedFile::fake()->image('ktp-saya.png'),
                'cv-resume' => $this->pdf('cv.pdf'),
            ],
        ]))->assertSessionHasNoErrors();

        $messages = app('mailer')->getSymfonyTransport()->messages();
        $this->assertCount(2, $messages);

        $hrBody = $messages[0]->getOriginalMessage()->getHtmlBody();
        $this->assertStringContainsString('S1 – Sistem Informasi', $hrBody);
        $this->assertStringContainsString('2024 · GPA 3.50', $hrBody);
        $this->assertStringContainsString('&lt; 1 tahun', $hrBody);
        $this->assertStringContainsString('Ready (laptop + camera, 10–14 November 2026)', $hrBody);
        $this->assertStringContainsString('KTP', $hrBody);
        $this->assertStringContainsString('ktp-saya.png', $hrBody);
        $this->assertStringContainsString('Attached', $hrBody);

        $confirmation = $messages[1]->getOriginalMessage();
        $this->assertStringContainsString('Dokumen Diterima', $confirmation->getHtmlBody());
        $this->assertStringContainsString('CV / Resume', $confirmation->getHtmlBody());
        $this->assertStringContainsString('Banyak kandidat berkualitas yang melamar untuk posisi ini', $confirmation->getHtmlBody());
        $this->assertStringContainsString('href="mailto:kisantra.official@gmail.com"', $confirmation->getHtmlBody());
        $this->assertStringContainsString('>kisantra.official@gmail.com</a>', $confirmation->getHtmlBody());
        $this->assertStringNotContainsString('recruitment@kisantra.com', $confirmation->getHtmlBody());
        // Only the embedded logo; the applicant's files are not sent back.
        $this->assertCount(1, $confirmation->getAttachments());
    }

    public function test_application_sends_the_job_recruitment_batch(): void
    {
        $this->fakeApiAccepts();
        Mail::fake();
        $batch = RecruitmentBatch::create([
            'name' => 'Batch 2 Recruitment 2026',
            'slug' => 'batch-2-recruitment-2026',
            'status' => 'open',
        ]);
        $job = $this->job(['recruitment_batch_id' => $batch->id]);

        $this->from('/karir')->post('/api/apply-job', $this->applicant($job, [
            'documents' => ['ktp' => $this->pdf('ktp.pdf'), 'cv-resume' => $this->pdf('cv.pdf')],
        ]))->assertSessionHasNoErrors();

        Http::assertSent(fn (HttpRequest $request) => $this->multipartParts($request)['batch']['contents'] === 'Batch 2 Recruitment 2026');
    }

    public function test_application_for_a_job_without_batch_sends_an_empty_batch(): void
    {
        $this->fakeApiAccepts();
        Mail::fake();
        $job = $this->job();

        $this->from('/karir')->post('/api/apply-job', $this->applicant($job, [
            'documents' => ['ktp' => $this->pdf('ktp.pdf'), 'cv-resume' => $this->pdf('cv.pdf')],
        ]))->assertSessionHasNoErrors();

        Http::assertSent(fn (HttpRequest $request) => $this->multipartParts($request)['batch']['contents'] === null);
    }

    public function test_missing_required_document_is_rejected(): void
    {
        $this->fakeApiAccepts();
        Mail::fake();
        $job = $this->job();

        $this->from('/karir')->post('/api/apply-job', $this->applicant($job, [
            'documents' => ['cv-resume' => $this->pdf('cv.pdf')],
        ]))->assertRedirect('/karir')->assertSessionHasErrors(['documents.ktp' => 'KTP wajib diunggah.']);

        Http::assertNothingSent();
        Mail::assertNothingSent();
    }

    public function test_document_in_a_format_the_job_does_not_allow_is_rejected(): void
    {
        $this->fakeApiAccepts();
        $job = $this->job();

        $this->post('/api/apply-job', $this->applicant($job, [
            'documents' => [
                'ktp' => UploadedFile::fake()->image('ktp.jpg'),
                'cv-resume' => UploadedFile::fake()->image('cv.png'),
            ],
        ]))->assertSessionHasErrors(['documents.cv-resume' => 'CV / Resume harus berformat PDF, DOC/DOCX.']);

        Http::assertNothingSent();
    }

    public function test_oversized_document_is_rejected(): void
    {
        $this->fakeApiAccepts();
        $job = $this->job();

        $this->post('/api/apply-job', $this->applicant($job, [
            'documents' => [
                'ktp' => UploadedFile::fake()->image('ktp.jpg'),
                'cv-resume' => $this->pdf('cv.pdf', 6000),
            ],
        ]))->assertSessionHasErrors(['documents.cv-resume' => 'Ukuran CV / Resume maksimal 5 MB.']);
    }

    public function test_personal_details_are_validated_in_indonesian(): void
    {
        $this->fakeApiAccepts();
        $job = $this->job(['required_documents' => null]);

        $this->post('/api/apply-job', $this->applicant($job, [
            'name' => '',
            'email' => 'bukan-email',
            'phone' => str_repeat('1', 21),
            'source' => 'tiktok',
            'documents' => ['cv-resume' => $this->pdf('cv.pdf')],
        ]))->assertSessionHasErrors([
            'name' => 'Nama lengkap wajib diisi.',
            'email' => 'Format email tidak valid.',
            'phone' => 'Nomor telepon maksimal 20 karakter.',
            'source' => 'Pilihan Sumber informasi tidak valid.',
        ]);

        Http::assertNothingSent();
    }

    public function test_too_many_extra_files_are_rejected(): void
    {
        $this->fakeApiAccepts();
        $job = $this->job();

        $this->post('/api/apply-job', $this->applicant($job, [
            'documents' => [
                'ktp' => UploadedFile::fake()->image('ktp.jpg'),
                'cv-resume' => $this->pdf('cv.pdf'),
            ],
            'extra_files' => [$this->pdf('a.pdf'), $this->pdf('b.pdf'), $this->pdf('c.pdf'), $this->pdf('d.pdf')],
        ]))->assertSessionHasErrors(['extra_files' => 'Dokumen tambahan maksimal 3 file.']);

        Http::assertNothingSent();
    }

    public function test_optional_document_can_be_left_out(): void
    {
        $this->fakeApiAccepts();
        Mail::fake();
        $job = $this->job();

        $this->post('/api/apply-job', $this->applicant($job, [
            'documents' => [
                'ktp' => UploadedFile::fake()->image('ktp.jpg'),
                'cv-resume' => $this->pdf('cv.pdf'),
            ],
        ]))->assertSessionHasNoErrors();

        Http::assertSent(function (HttpRequest $request) {
            $parts = $this->multipartParts($request);

            return array_keys(array_filter($parts, fn ($key) => str_starts_with($key, 'jenis_dokumen'), ARRAY_FILTER_USE_KEY)) === ['jenis_dokumen[0]', 'jenis_dokumen[1]'];
        });
    }

    public function test_closed_job_does_not_accept_applications(): void
    {
        $this->fakeApiAccepts();
        Mail::fake();
        $job = $this->job(['status' => 'closed']);

        $this->post('/api/apply-job', $this->applicant($job, [
            'documents' => ['ktp' => UploadedFile::fake()->image('ktp.jpg'), 'cv-resume' => $this->pdf('cv.pdf')],
        ]))->assertSessionHasErrors('server');

        Http::assertNothingSent();
        Mail::assertNothingSent();
    }

    public function test_hr_still_gets_the_application_when_the_api_is_down(): void
    {
        Http::fake([self::API_URL => Http::response(['message' => 'Server Error'], 500)]);
        Mail::fake();
        $job = $this->job();

        $this->post('/api/apply-job', $this->applicant($job, [
            'documents' => ['ktp' => UploadedFile::fake()->image('ktp.jpg'), 'cv-resume' => $this->pdf('cv.pdf')],
        ]))->assertSessionHasNoErrors()->assertSessionHas('success');

        Mail::assertSent(JobApplicationMail::class, fn (JobApplicationMail $mail) => $mail->data['saved_in_attendance'] === false);
    }

    public function test_applicant_sees_an_error_when_no_channel_accepts_the_application(): void
    {
        Http::fake([self::API_URL => Http::response(['message' => 'Server Error'], 500)]);
        Mail::shouldReceive('to')->andThrow(new \RuntimeException('SMTP down'));
        $job = $this->job();

        $this->post('/api/apply-job', $this->applicant($job, [
            'documents' => ['ktp' => UploadedFile::fake()->image('ktp.jpg'), 'cv-resume' => $this->pdf('cv.pdf')],
        ]))->assertSessionHasErrors('server');
    }

    public function test_files_over_the_email_budget_are_listed_but_not_attached(): void
    {
        $this->fakeApiAccepts();
        Mail::fake();
        $job = $this->job(['required_documents' => [
            ['name' => 'CV', 'formats' => ['pdf']],
            ['name' => 'Ijazah Terakhir', 'formats' => ['pdf']],
            ['name' => 'Transkrip Nilai', 'formats' => ['pdf']],
            ['name' => 'Portofolio', 'formats' => ['pdf']],
        ]]);

        $this->post('/api/apply-job', $this->applicant($job, [
            'documents' => [
                'cv' => $this->pdf('cv.pdf', 5000),
                'ijazah-terakhir' => $this->pdf('ijazah.pdf', 5000),
                'transkrip-nilai' => $this->pdf('transkrip.pdf', 5000),
                'portofolio' => $this->pdf('portofolio.pdf', 5000),
            ],
        ]))->assertSessionHasNoErrors();

        Mail::assertSent(JobApplicationMail::class, function (JobApplicationMail $mail) {
            return count($mail->attachments()) === 3
                && array_column($mail->data['documents'], 'attached') === [true, true, true, false];
        });
    }

    public function test_high_school_applicants_do_not_need_a_gpa(): void
    {
        $this->fakeApiAccepts();
        Mail::fake();
        $job = $this->job(['required_documents' => null]);

        $this->post('/api/apply-job', $this->applicant($job, [
            'pendidikan_terakhir' => 'SMA/SMK',
            'jurusan' => 'Akuntansi',
            'ipk' => 'sisa isian lama',
            'documents' => ['cv-resume' => $this->pdf('cv.pdf')],
        ]))->assertSessionHasNoErrors();

        Http::assertSent(fn (HttpRequest $request) => $this->multipartParts($request)['ipk']['contents'] === null);
    }

    public function test_gpa_is_required_from_diploma_level(): void
    {
        $this->fakeApiAccepts();
        $job = $this->job(['required_documents' => null]);

        $this->post('/api/apply-job', $this->applicant($job, [
            'pendidikan_terakhir' => 'D3',
            'ipk' => '',
            'documents' => ['cv-resume' => $this->pdf('cv.pdf')],
        ]))->assertSessionHasErrors(['ipk' => 'IPK wajib diisi untuk jenjang D1 ke atas.']);

        Http::assertNothingSent();
    }

    public function test_application_without_data_consent_is_rejected(): void
    {
        $this->fakeApiAccepts();
        Mail::fake();
        $job = $this->job(['required_documents' => null]);

        $this->post('/api/apply-job', $this->applicant($job, [
            'persetujuan_data' => '0',
            'documents' => ['cv-resume' => $this->pdf('cv.pdf')],
        ]))->assertSessionHasErrors(['persetujuan_data' => 'Centang persetujuan pemrosesan data untuk mengirim lamaran.']);

        Http::assertNothingSent();
        Mail::assertNothingSent();
    }

    public function test_candidate_profile_values_are_validated(): void
    {
        $this->fakeApiAccepts();
        $job = $this->job(['required_documents' => null]);

        $this->post('/api/apply-job', $this->applicant($job, [
            'pendidikan_terakhir' => 'SD',
            'jurusan' => '',
            'tahun_lulus' => '1890',
            'ipk' => '4,2',
            'pengalaman' => '5_tahun',
            'siap_tes_online' => '',
            'documents' => ['cv-resume' => $this->pdf('cv.pdf')],
        ]))->assertSessionHasErrors([
            'pendidikan_terakhir' => 'Pilihan Pendidikan terakhir tidak valid.',
            'jurusan' => 'Jurusan wajib diisi.',
            'tahun_lulus' => 'Tahun lulus harus di antara 1970 dan '.(now()->year + 2).'.',
            'ipk' => 'IPK harus di antara 0 dan 4.',
            'pengalaman' => 'Pilihan Pengalaman tidak valid.',
            'siap_tes_online' => 'Pilih Ya atau Tidak.',
        ]);

        Http::assertNothingSent();
    }

    public function test_online_test_period_label_covers_open_ranges(): void
    {
        $this->assertSame('28 Oktober – 2 November 2026', $this->job(['online_test_start_date' => '2026-10-28', 'online_test_end_date' => '2026-11-02'])->onlineTestPeriodLabel());
        $this->assertSame('mulai 10 November 2026', $this->job(['online_test_end_date' => null])->onlineTestPeriodLabel());
        $this->assertNull($this->job(['online_test_start_date' => null, 'online_test_end_date' => null])->onlineTestPeriodLabel());
    }

    public function test_admin_can_configure_required_documents(): void
    {
        $undoRepeaterFake = Repeater::fake();
        $this->actingAs(User::factory()->create(['email' => 'hr@kisantra.com']));

        Livewire::test(CreateJobPosting::class)
            ->fillForm([
                'title' => 'Staf Administrasi Pajak',
                'division' => 'Administrasi Pajak',
                'location' => 'Samarinda',
                'status' => 'active',
                'work_type' => 'onsite',
                'employment_type' => 'full_time',
                'description' => '<p>Menyusun laporan pajak.</p>',
                'online_test_start_date' => '2026-11-10',
                'online_test_end_date' => '2026-11-14',
                'required_documents' => [
                    ['name' => 'KTP', 'formats' => ['image', 'pdf'], 'required' => true, 'description' => 'Scan KTP'],
                    ['name' => 'NPWP', 'formats' => ['pdf'], 'required' => false, 'description' => null],
                ],
            ])
            ->call('create')
            ->assertHasNoFormErrors();

        $job = JobPosting::sole();
        $this->assertSame(['KTP', 'NPWP'], array_column($job->required_documents, 'name'));
        $this->assertSame(['ktp', 'npwp'], array_column($job->documentRequirements(), 'key'));
        $this->assertFalse($job->documentRequirements()[1]['required']);
        $this->assertSame('10–14 November 2026', $job->onlineTestPeriodLabel());

        Livewire::test(EditJobPosting::class, ['record' => $job->getRouteKey()])
            ->assertSchemaStateSet(['required_documents' => $job->required_documents])
            ->fillForm(['required_documents' => [
                ['name' => 'KTP', 'formats' => ['image'], 'required' => true, 'description' => null],
            ]])
            ->call('save')
            ->assertHasNoFormErrors();

        $this->assertSame([['name' => 'KTP', 'formats' => ['image'], 'required' => true, 'description' => null]], $job->fresh()->required_documents);

        $undoRepeaterFake();
    }

    public function test_admin_cannot_save_a_document_without_name_or_format(): void
    {
        $undoRepeaterFake = Repeater::fake();
        $this->actingAs(User::factory()->create(['email' => 'hr@kisantra.com']));

        Livewire::test(CreateJobPosting::class)
            ->fillForm([
                'title' => 'Staf Administrasi Pajak',
                'division' => 'Administrasi Pajak',
                'location' => 'Samarinda',
                'status' => 'active',
                'work_type' => 'onsite',
                'employment_type' => 'full_time',
                'description' => '<p>Menyusun laporan pajak.</p>',
                'required_documents' => [
                    ['name' => '', 'formats' => [], 'required' => true, 'description' => null],
                ],
            ])
            ->call('create')
            ->assertHasFormErrors(['required_documents.0.name' => 'required', 'required_documents.0.formats' => 'required']);

        $this->assertDatabaseCount('job_postings', 0);

        $undoRepeaterFake();
    }

    public function test_online_test_cannot_end_before_it_starts(): void
    {
        $this->actingAs(User::factory()->create(['email' => 'hr@kisantra.com']));

        Livewire::test(CreateJobPosting::class)
            ->fillForm([
                'title' => 'Staf Administrasi Pajak',
                'division' => 'Administrasi Pajak',
                'location' => 'Samarinda',
                'status' => 'active',
                'work_type' => 'onsite',
                'employment_type' => 'full_time',
                'description' => '<p>Menyusun laporan pajak.</p>',
                'online_test_start_date' => '2026-11-14',
                'online_test_end_date' => '2026-11-10',
            ])
            ->call('create')
            ->assertHasFormErrors(['online_test_end_date' => 'after_or_equal']);

        $this->assertDatabaseCount('job_postings', 0);
    }
}

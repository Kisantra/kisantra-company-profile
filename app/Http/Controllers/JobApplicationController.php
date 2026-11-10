<?php

namespace App\Http\Controllers;

use App\Mail\ApplicationConfirmationEmail;
use App\Mail\JobApplicationMail;
use App\Models\JobPosting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class JobApplicationController extends Controller
{
    /** Extra files an applicant may add on top of the configured documents. */
    private const MAX_EXTRA_FILES = 3;

    private const EXTRA_FILE_LABEL = 'Dokumen Lain';

    /** Gmail rejects messages over 25 MB; attachments grow ~37% when encoded. */
    private const MAIL_ATTACHMENT_LIMIT_BYTES = 15 * 1024 * 1024;

    /** Same values as the attendance API accepts. */
    public const EDUCATION_LEVELS = ['SMA/SMK', 'D1', 'D2', 'D3', 'D4', 'S1', 'S2', 'S3'];

    /** Education level that has no GPA (IPK). */
    private const NO_GPA_LEVEL = 'SMA/SMK';

    public const EXPERIENCE_OPTIONS = [
        'tidak_ada' => 'Tidak ada',
        'kurang_dari_1_tahun' => '< 1 tahun',
        '1_tahun_atau_lebih' => '≥ 1 tahun',
    ];

    private const DEPARTMENT_IDS = [
        'Digital Marketing' => 3,
        'Sistem Digital' => 2,
        'Administrasi Pajak' => 4,
        'HR' => 1,
    ];

    public function store(Request $request)
    {
        $job = JobPosting::active()->with('batch')->find($request->integer('job_id'));

        if (! $job) {
            return back()->withErrors([
                'server' => 'Lowongan ini sudah tidak menerima lamaran. Silakan muat ulang halaman karir.',
            ]);
        }

        // Indonesian applicants write the GPA as "3,50".
        if (is_string($request->input('ipk'))) {
            $request->merge(['ipk' => str_replace(',', '.', trim($request->input('ipk')))]);
        }

        $documents = $job->documentRequirements();
        $validated = $request->validate(...$this->validationRules($documents));

        // Configured documents first, in the admin's order, then the extra files.
        $uploads = [];
        foreach ($documents as $doc) {
            if ($file = $request->file("documents.{$doc['key']}")) {
                $uploads[] = ['label' => $doc['name'], 'file' => $file];
            }
        }
        foreach ($request->file('extra_files', []) as $file) {
            $uploads[] = ['label' => self::EXTRA_FILE_LABEL, 'file' => $file];
        }

        Log::info('[JobApplication] Validation passed', [
            'job_id' => $job->id,
            'documents' => array_column($uploads, 'label'),
        ]);

        try {
            $storedFiles = [];
            foreach ($uploads as $upload) {
                $file = $upload['file'];
                // Private disk: these can be ID cards, so they must not be web-accessible.
                $path = $file->store('job-applications', 'local');
                $storedFiles[] = [
                    'label' => $upload['label'],
                    'name' => $file->getClientOriginalName(),
                    'stored_as' => $path,
                    'path' => Storage::disk('local')->path($path),
                    'mime' => $file->getMimeType(),
                    'size' => $file->getSize(),
                ];
            }

            $sentToApi = $this->sendToAttendance($job, $validated, $uploads);

            [$attachments, $documentList] = $this->mailAttachments($storedFiles);

            $emailData = [
                'job_id' => $job->id,
                'job_title' => $job->title,
                'batch' => $job->batch?->name ?? '-',
                'applicant_name' => $validated['name'],
                'applicant_email' => $validated['email'],
                'applicant_phone' => $validated['phone'],
                'applicant_address' => $validated['alamat'],
                'education' => $validated['pendidikan_terakhir'].' – '.$validated['jurusan'],
                'graduation_year' => $validated['tahun_lulus'],
                'gpa' => isset($validated['ipk']) ? number_format((float) $validated['ipk'], 2) : null,
                'experience' => self::EXPERIENCE_OPTIONS[$validated['pengalaman']],
                'online_test_ready' => (bool) $validated['siap_tes_online'],
                'online_test_period' => $job->onlineTestPeriodLabel(),
                'linkedin_url' => $validated['linkedin_url'] ?? '-',
                'source' => $validated['source'],
                'cover_letter' => $validated['cover_letter'] ?? '-',
                'documents' => $documentList,
                'files' => $attachments,
                'saved_in_attendance' => $sentToApi,
            ];

            try {
                Mail::to('hr.kisantra@gmail.com')->send(new JobApplicationMail($emailData));
                $sentToHr = true;
                Log::info('[JobApplication] HR email sent', ['job_id' => $job->id]);
            } catch (\Exception $e) {
                $sentToHr = false;
                Log::error('[JobApplication] HR email failed', ['job_id' => $job->id, 'message' => $e->getMessage()]);
            }

            // The application is only lost when neither channel received it.
            if (! $sentToApi && ! $sentToHr) {
                throw new \RuntimeException('Neither the attendance API nor the HR email accepted the application.');
            }

            try {
                Mail::to($validated['email'])->send(new ApplicationConfirmationEmail($emailData, $job->title, $validated['name']));
            } catch (\Exception $e) {
                Log::error('[JobApplication] Confirmation email failed', ['job_id' => $job->id, 'message' => $e->getMessage()]);
            }

            return back()->with('success', 'Lamaran berhasil dikirim.');
        } catch (\Exception $e) {
            Log::error('[JobApplication] Failed', ['job_id' => $job->id, 'message' => $e->getMessage()]);

            return back()->withErrors([
                'server' => 'Lamaran gagal terkirim karena gangguan sistem. Silakan coba lagi beberapa saat lagi.',
            ]);
        }
    }

    /**
     * @param  list<array{key: string, name: string, required: bool, description: ?string, extensions: list<string>, formats_label: string}>  $documents
     * @return array{0: array<string, mixed>, 1: array<string, string>, 2: array<string, string>}
     */
    private function validationRules(array $documents): array
    {
        $maxKb = JobPosting::DOCUMENT_MAX_KB;
        $maxLabel = ($maxKb / 1024).' MB';
        $allExtensions = collect(JobPosting::DOCUMENT_FORMATS)->flatMap(fn ($f) => $f['extensions'])->implode(',');

        $rules = [
            'job_id' => 'required|integer',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'alamat' => 'required|string|max:500',
            'pendidikan_terakhir' => ['required', Rule::in(self::EDUCATION_LEVELS)],
            'jurusan' => 'required|string|max:150',
            'tahun_lulus' => 'required|integer|between:1970,'.(now()->year + 2),
            'ipk' => ['exclude_if:pendidikan_terakhir,'.self::NO_GPA_LEVEL, 'required', 'numeric', 'between:0,4'],
            'pengalaman' => ['required', Rule::in(array_keys(self::EXPERIENCE_OPTIONS))],
            'siap_tes_online' => 'required|boolean',
            'persetujuan_data' => 'accepted',
            'linkedin_url' => 'nullable|url|max:255',
            'source' => 'required|in:instagram,website,linkedin,referral,other',
            'cover_letter' => 'nullable|string|max:5000',
            'extra_files' => 'nullable|array|max:'.self::MAX_EXTRA_FILES,
            'extra_files.*' => "file|mimes:{$allExtensions}|max:{$maxKb}",
        ];

        $messages = [
            'required' => ':attribute wajib diisi.',
            'email' => 'Format email tidak valid.',
            'url' => 'Format :attribute tidak valid.',
            'in' => 'Pilihan :attribute tidak valid.',
            // Size rules need one message per value type.
            'max' => [
                'string' => ':attribute maksimal :max karakter.',
                'file' => "Ukuran :attribute maksimal {$maxLabel}.",
                'array' => ':attribute maksimal :max item.',
                'numeric' => ':attribute maksimal :max.',
            ],
            'file' => ':attribute harus berupa file.',
            'uploaded' => ":attribute gagal diunggah. Pastikan ukurannya tidak lebih dari {$maxLabel}.",
            'extra_files.max' => 'Dokumen tambahan maksimal :max file.',
            'pendidikan_terakhir.required' => 'Pilih pendidikan terakhir.',
            'tahun_lulus.integer' => 'Tahun lulus harus berupa angka tahun, contoh 2024.',
            'tahun_lulus.between' => 'Tahun lulus harus di antara 1970 dan :max.',
            'ipk.required' => 'IPK wajib diisi untuk jenjang D1 ke atas.',
            'ipk.numeric' => 'IPK harus berupa angka, contoh 3,50.',
            'ipk.between' => 'IPK harus di antara 0 dan 4.',
            'pengalaman.required' => 'Pilih pengalaman kerja Anda.',
            'siap_tes_online.required' => 'Pilih Ya atau Tidak.',
            'persetujuan_data.accepted' => 'Centang persetujuan pemrosesan data untuk mengirim lamaran.',
            'extra_files.*.mimes' => 'Format dokumen tambahan harus PDF, JPG/PNG, atau DOC/DOCX.',
        ];

        $attributes = [
            'name' => 'Nama lengkap',
            'email' => 'Email',
            'phone' => 'Nomor telepon',
            'alamat' => 'Domisili',
            'pendidikan_terakhir' => 'Pendidikan terakhir',
            'jurusan' => 'Jurusan',
            'tahun_lulus' => 'Tahun lulus',
            'ipk' => 'IPK',
            'pengalaman' => 'Pengalaman',
            'siap_tes_online' => 'Kesiapan tes online',
            'linkedin_url' => 'URL LinkedIn',
            'source' => 'Sumber informasi',
            'cover_letter' => 'Cover letter',
            'extra_files.*' => 'Dokumen tambahan',
        ];

        foreach ($documents as $doc) {
            $field = "documents.{$doc['key']}";
            $rules[$field] = [
                $doc['required'] ? 'required' : 'nullable',
                'file',
                'mimes:'.implode(',', $doc['extensions']),
                "max:{$maxKb}",
            ];
            $messages["{$field}.required"] = "{$doc['name']} wajib diunggah.";
            $messages["{$field}.mimes"] = "{$doc['name']} harus berformat {$doc['formats_label']}.";
            $attributes[$field] = $doc['name'];
        }

        return [$rules, $messages, $attributes];
    }

    /**
     * Each file goes out as file_terkait[i] with its type in jenis_dokumen[i].
     *
     * @param  list<array{label: string, file: \Illuminate\Http\UploadedFile}>  $uploads
     */
    private function sendToAttendance(JobPosting $job, array $validated, array $uploads): bool
    {
        try {
            $request = Http::timeout(60)->acceptJson();

            // Flat keys, because the client reads nested arrays as multipart part definitions.
            $payload = [
                'nama' => $validated['name'],
                'email' => $validated['email'],
                'nomor_telepon' => $validated['phone'],
                'alamat' => $validated['alamat'],
                'pendidikan_terakhir' => $validated['pendidikan_terakhir'],
                'jurusan' => $validated['jurusan'],
                'tahun_lulus' => (int) $validated['tahun_lulus'],
                'ipk' => $validated['ipk'] ?? null,
                'pengalaman' => $validated['pengalaman'],
                'siap_tes_online' => $validated['siap_tes_online'] ? 1 : 0,
                'persetujuan_data' => 1,
                'linkedin_url' => $validated['linkedin_url'] ?? null,
                'sumber' => $validated['source'],
                'cover_letter' => $validated['cover_letter'] ?? null,
                'posisi' => $job->title,
                'department_id' => self::DEPARTMENT_IDS[$job->division] ?? 4,
                // Groups applicants per recruitment wave in attendance and exam.
                'batch' => $job->batch?->name,
            ];

            foreach ($uploads as $i => $upload) {
                $request->attach(
                    "file_terkait[{$i}]",
                    file_get_contents($upload['file']->getRealPath()),
                    $upload['file']->getClientOriginalName()
                );
                $payload["jenis_dokumen[{$i}]"] = $upload['label'];
            }

            $response = $request->post(config('services.attendance.job_applications_url'), $payload);

            if ($response->successful()) {
                Log::info('[JobApplication] Attendance API accepted', ['job_id' => $job->id, 'application_id' => $response->json('data.id')]);

                return true;
            }

            Log::error('[JobApplication] Attendance API rejected', [
                'job_id' => $job->id,
                'status' => $response->status(),
                'errors' => array_keys((array) $response->json('errors', [])),
            ]);
        } catch (\Exception $e) {
            Log::error('[JobApplication] Attendance API unreachable', ['job_id' => $job->id, 'message' => $e->getMessage()]);
        }

        return false;
    }

    /**
     * Attach files in order until the size budget runs out; the email lists the
     * rest with where to find them.
     *
     * @param  list<array{label: string, name: string, stored_as: string, path: string, mime: ?string, size: int|false}>  $storedFiles
     * @return array{0: list<array{path: string, name: string, mime: ?string}>, 1: list<array{label: string, name: string, stored_as: string, attached: bool}>}
     */
    private function mailAttachments(array $storedFiles): array
    {
        $attachments = [];
        $documentList = [];
        $budget = self::MAIL_ATTACHMENT_LIMIT_BYTES;

        foreach ($storedFiles as $file) {
            $attached = $file['size'] !== false && $file['size'] <= $budget;
            if ($attached) {
                $budget -= $file['size'];
                $attachments[] = [
                    'path' => $file['path'],
                    'name' => Str::of($file['label'])->replace(['/', '\\'], '-')->squish().' - '.$file['name'],
                    'mime' => $file['mime'],
                ];
            }
            $documentList[] = ['label' => $file['label'], 'name' => $file['name'], 'stored_as' => $file['stored_as'], 'attached' => $attached];
        }

        return [$attachments, $documentList];
    }
}

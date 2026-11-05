<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class JobPosting extends Model
{
    use HasFactory;

    /** Format groups an admin can allow per document; the attendance API accepts all of them. */
    public const DOCUMENT_FORMATS = [
        'pdf' => ['label' => 'PDF', 'extensions' => ['pdf']],
        'image' => ['label' => 'JPG/PNG', 'extensions' => ['jpg', 'jpeg', 'png']],
        'word' => ['label' => 'DOC/DOCX', 'extensions' => ['doc', 'docx']],
    ];

    /** Suggestions shown while typing a document name in the admin form. */
    public const DOCUMENT_SUGGESTIONS = [
        'CV / Resume', 'Surat Lamaran', 'KTP', 'Kartu Keluarga', 'Ijazah Terakhir', 'Transkrip Nilai',
        'Pas Foto', 'SKCK', 'NPWP', 'Sertifikat Keahlian', 'Surat Keterangan Sehat', 'Portofolio',
    ];

    /** Used when a vacancy has no documents configured. */
    public const DEFAULT_DOCUMENTS = [
        ['name' => 'CV / Resume', 'required' => true, 'formats' => ['pdf', 'word'], 'description' => null],
    ];

    /** Upload limit per file, in kilobytes (matches the attendance API). */
    public const DOCUMENT_MAX_KB = 5120;

    protected $fillable = [
        'title',
        'description',
        'location',
        'employment_type',
        'salary_min',
        'salary_max',
        'requirements',
        'application_deadline',
        'status',
        'work_type',
        'recruitment_batch_id',
        'required_documents',
        'online_test_start_date',
        'online_test_end_date',
    ];

    public function batch()
    {
        return $this->belongsTo(RecruitmentBatch::class, 'recruitment_batch_id');
    }

    protected $casts = [
        'application_deadline' => 'datetime',
        'salary_min' => 'decimal:2',
        'salary_max' => 'decimal:2',
        'required_documents' => 'array',
        'online_test_start_date' => 'date',
        'online_test_end_date' => 'date',
    ];

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeRemote($query)
    {
        return $query->where('work_type', 'remote');
    }

    public function scopeHybrid($query)
    {
        return $query->where('work_type', 'hybrid');
    }

    public function scopeOnsite($query)
    {
        return $query->where('work_type', 'onsite');
    }

    public function getWorkTypeDisplayAttribute()
    {
        return match($this->work_type) {
            'remote' => 'Remote',
            'hybrid' => 'Hybrid',
            'onsite' => 'Di Kantor',
            default => 'Di Kantor'
        };
    }

    public function getEmploymentTypeDisplayAttribute()
    {
        return match($this->employment_type) {
            'full_time' => 'Waktu Penuh',
            'part_time' => 'Paruh Waktu',
            'contract' => 'Kontrak',
            'internship' => 'Magang',
            default => 'Waktu Penuh'
        };
    }

    public function getStatusDisplayAttribute()
    {
        return match($this->status) {
            'draft' => 'Draft',
            'active' => 'Aktif',
            'closed' => 'Ditutup',
            default => 'Draft'
        };
    }

    /**
     * The online test window in Indonesian, e.g. "10–14 November 2026", or null when not scheduled.
     */
    public function onlineTestPeriodLabel(): ?string
    {
        $start = $this->online_test_start_date?->locale('id');
        $end = $this->online_test_end_date?->locale('id');

        if ($start && $end && ! $start->isSameDay($end)) {
            if ($start->isSameMonth($end)) {
                return $start->translatedFormat('j').'–'.$end->translatedFormat('j F Y');
            }

            return $start->isSameYear($end)
                ? $start->translatedFormat('j F').' – '.$end->translatedFormat('j F Y')
                : $start->translatedFormat('j F Y').' – '.$end->translatedFormat('j F Y');
        }

        if ($start) {
            return $end ? $start->translatedFormat('j F Y') : 'mulai '.$start->translatedFormat('j F Y');
        }

        return $end ? 'paling lambat '.$end->translatedFormat('j F Y') : null;
    }

    /**
     * Documents an applicant must (or may) upload, normalised for the form,
     * validation and the attendance API. Each item gets a stable form key.
     *
     * @return list<array{key: string, name: string, required: bool, description: ?string, extensions: list<string>, formats_label: string}>
     */
    public function documentRequirements(): array
    {
        $documents = collect($this->required_documents ?: [])
            ->filter(fn ($doc) => is_array($doc) && filled($doc['name'] ?? null))
            ->values();

        if ($documents->isEmpty()) {
            $documents = collect(self::DEFAULT_DOCUMENTS);
        }

        $usedKeys = [];

        return $documents->map(function (array $doc) use (&$usedKeys) {
            $formats = array_values(array_intersect(array_keys(self::DOCUMENT_FORMATS), (array) ($doc['formats'] ?? [])));
            $formats = $formats ?: ['pdf'];

            $base = Str::slug($doc['name']) ?: 'dokumen';
            $key = $base;
            for ($n = 2; in_array($key, $usedKeys, true); $n++) {
                $key = $base.'-'.$n;
            }
            $usedKeys[] = $key;

            return [
                'key' => $key,
                'name' => trim($doc['name']),
                'required' => (bool) ($doc['required'] ?? true),
                'description' => filled($doc['description'] ?? null) ? trim($doc['description']) : null,
                'extensions' => collect($formats)->flatMap(fn ($f) => self::DOCUMENT_FORMATS[$f]['extensions'])->values()->all(),
                'formats_label' => collect($formats)->map(fn ($f) => self::DOCUMENT_FORMATS[$f]['label'])->implode(', '),
            ];
        })->all();
    }
}
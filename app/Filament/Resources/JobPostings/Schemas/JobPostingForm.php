<?php

namespace App\Filament\Resources\JobPostings\Schemas;

use App\Models\JobPosting;
use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;

use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class JobPostingForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Informasi Posisi')
                    ->description('Informasi dasar tentang posisi pekerjaan')
                    ->columnSpanFull()
                    ->schema([
                        TextInput::make('title')
                            ->label('Judul Posisi')
                            ->required()
                            ->maxLength(255)
                            ->placeholder('contoh: Backend Developer Senior'),
                        
                        Select::make('division')
                            ->label('Divisi/Departemen')
                            ->options([
                                'Digital Marketing' => 'Digital Marketing',
                                'Sistem Digital' => 'Sistem Digital',
                                'Administrasi Pajak' => 'Administrasi Pajak',
                                'HR' => 'HR',
                            ])
                            ->searchable()
                            ->placeholder('Pilih divisi')
                            ->required(),

                        TextInput::make('location')
                            ->label('Lokasi')
                            ->required()
                            ->maxLength(255)
                            ->placeholder('contoh: Jakarta, Surabaya'),
                        
                        Select::make('work_type')
                            ->label('Tipe Kerja')
                            ->options([
                                'onsite' => 'Onsite',
                                'remote' => 'Remote',
                                'hybrid' => 'Hybrid'
                            ])
                            ->default('onsite')
                            ->required(),

                        RichEditor::make('description')
                            ->label('Deskripsi Pekerjaan')
                            ->required()
                            ->placeholder('Jelaskan tanggung jawab, tugas, dan ekspektasi untuk posisi ini...')
                            ->toolbarButtons([
                                'bold',
                                'bulletList',
                                'italic',
                                'link',
                                'orderedList',
                                'redo',
                                'strike',
                                'underline',
                                'undo',
                            ]),
                    ]),

                Section::make('Detail Pekerjaan')
                    ->description('Informasi tambahan tentang pekerjaan')
                    ->columnSpanFull()
                    ->schema([
                        Select::make('employment_type')
                            ->label('Tipe Pekerjaan')
                            ->options([
                                'full_time' => 'Waktu Penuh',
                                'part_time' => 'Paruh Waktu',
                                'contract' => 'Kontrak',
                                'internship' => 'Magang',
                            ])
                            ->default('full_time')
                            ->required(),

                        Select::make('status')
                            ->label('Status')
                            ->options([
                                'draft' => 'Draft',
                                'active' => 'Aktif',
                                'closed' => 'Ditutup'
                            ])
                            ->default('draft')
                            ->required(),

                        Select::make('recruitment_batch_id')
                            ->label('Batch Rekrutmen')
                            ->relationship('batch', 'name')
                            ->searchable()
                            ->preload()
                            ->nullable()
                            ->helperText('Opsional — kelompokkan lowongan ini ke dalam sebuah batch/sesi'),

                        TextInput::make('salary_min')
                            ->label('Gaji Minimum')
                            ->numeric()
                            ->prefix('Rp')
                            ->placeholder('5000000')
                            ->formatStateUsing(fn ($state) => $state ? number_format($state, 0, ',', '.') : null),

                        TextInput::make('salary_max')
                            ->label('Gaji Maksimum')
                            ->numeric()
                            ->prefix('Rp')
                            ->placeholder('8000000')
                            ->formatStateUsing(fn ($state) => $state ? number_format($state, 0, ',', '.') : null),

                        DateTimePicker::make('application_deadline')
                            ->label('Batas Waktu Lamaran')
                            ->placeholder('Pilih tanggal dan waktu')
                            ->native(false)
                            ->displayFormat('d/m/Y H:i')
                            ->helperText('Kosongkan jika tidak ada batas waktu khusus'),

                        RichEditor::make('requirements')
                            ->label('Persyaratan')
                            ->placeholder('Tuliskan persyaratan dan kualifikasi yang dibutuhkan untuk posisi ini...')
                            ->toolbarButtons([
                                'bold',
                                'bulletList',
                                'italic',
                                'link',
                                'orderedList',
                                'redo',
                                'strike',
                                'underline',
                                'undo',
                            ]),
                    ]),
                Section::make('Jadwal Tes Online')
                    ->description('Pelamar ditanya apakah siap mengikuti tes online (dengan laptop dan kamera) pada rentang tanggal ini.')
                    ->columnSpanFull()
                    ->columns(2)
                    ->schema([
                        DatePicker::make('online_test_start_date')
                            ->label('Mulai')
                            ->native(false)
                            ->displayFormat('d/m/Y'),
                        DatePicker::make('online_test_end_date')
                            ->label('Sampai')
                            ->native(false)
                            ->displayFormat('d/m/Y')
                            ->afterOrEqual('online_test_start_date')
                            ->validationMessages(['after_or_equal' => 'Tanggal selesai tidak boleh sebelum tanggal mulai.']),
                    ]),
                Section::make('Dokumen Persyaratan')
                    ->description('Dokumen yang diunggah pelamar di form lamaran. Setiap file maksimal 5 MB dan ikut terkirim ke sistem attendance beserta jenisnya.')
                    ->columnSpanFull()
                    ->schema([
                        Repeater::make('required_documents')
                            ->label('Daftar dokumen')
                            ->schema([
                                TextInput::make('name')
                                    ->label('Nama dokumen')
                                    ->required()
                                    ->maxLength(100)
                                    ->distinct()
                                    ->datalist(JobPosting::DOCUMENT_SUGGESTIONS)
                                    ->placeholder('contoh: KTP'),
                                CheckboxList::make('formats')
                                    ->label('Format yang diterima')
                                    ->options(collect(JobPosting::DOCUMENT_FORMATS)->map(fn (array $format) => $format['label'])->all())
                                    ->default(['pdf'])
                                    ->required()
                                    ->columns(3),
                                Toggle::make('required')
                                    ->label('Wajib diunggah')
                                    ->default(true),
                                TextInput::make('description')
                                    ->label('Keterangan untuk pelamar')
                                    ->maxLength(200)
                                    ->placeholder('contoh: Scan KTP yang masih berlaku')
                                    ->columnSpanFull(),
                            ])
                            ->columns(3)
                            ->default(JobPosting::DEFAULT_DOCUMENTS)
                            ->itemLabel(fn (array $state): ?string => filled($state['name'] ?? null)
                                ? $state['name'].(($state['required'] ?? true) ? ' (wajib)' : ' (opsional)')
                                : null)
                            ->addActionLabel('Tambah dokumen')
                            ->reorderable()
                            ->collapsible()
                            ->maxItems(10)
                            ->helperText('Jika daftar ini kosong, pelamar diminta mengunggah CV / Resume saja.'),
                    ]),
            ]);
    }
}

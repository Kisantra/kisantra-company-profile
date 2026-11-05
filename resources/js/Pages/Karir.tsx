import React, { useEffect, useRef, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { Contact } from '../components/Contact';

interface JobDocument {
    key: string;
    name: string;
    required: boolean;
    description: string | null;
    accept: string;
    formats_label: string;
}

interface JobPosting {
    id: number;
    title: string;
    location: string;
    type: string;
    work_type: string;
    department: string;
    description?: string;
    requirements?: string;
    batch?: string | null;
    online_test_period: string | null;
    documents: JobDocument[];
}

interface BatchInfo {
    name: string;
    slug: string;
    description?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    status: string;
    status_display: string;
}

interface JobGroup {
    batch: BatchInfo | null;
    jobs: JobPosting[];
}

interface ApplicationOptions {
    educationLevels: string[];
    experienceOptions: Record<string, string>;
}

interface KarirProps extends ApplicationOptions {
    groups: JobGroup[];
}

// --- Helpers ---
const fmtDate = (d?: string | null) =>
    d ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d)) : null;

const periodLabel = (b: BatchInfo) => {
    const s = fmtDate(b.start_date);
    const e = fmtDate(b.end_date);
    if (s && e) return `${s} – ${e}`;
    if (s) return `Mulai ${s}`;
    if (e) return `s/d ${e}`;
    return null;
};

const batchBadgeColor: Record<string, string> = {
    open: 'bg-lux-teal/10 text-lux-teal-dark',
    upcoming: 'bg-amber-100 text-amber-700',
    closed: 'bg-neutral-200 text-neutral-600',
};

// --- Hero ---
const Hero = () => (
    <section className="relative h-auto min-h-[500px] md:h-[80vh] md:min-h-[600px] flex items-center justify-center overflow-hidden bg-lux-white pt-32 pb-20 md:pt-20 md:pb-0">
        <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
            <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-lux-teal/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[10%] left-[10%] w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-lux-black/5 rounded-full blur-[60px] md:blur-[100px] pointer-events-none" />
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
            <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-block py-1 px-3 border border-lux-teal text-lux-teal text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] rounded-full mb-6"
            >
                Karir di Kisantra
            </motion.span>
            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl md:text-7xl lg:text-8xl font-black text-lux-black tracking-tight leading-tight md:leading-none mb-6 md:mb-8"
            >
                Bangun Masa Depan <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-lux-teal to-lux-black">Bersama Kami</span>
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="max-w-xl md:max-w-2xl mx-auto text-base md:text-xl text-neutral-500 font-light leading-relaxed px-4 md:px-0"
            >
                Bergabunglah dengan tim visioner yang mendefinisikan ulang standar industri melalui keahlian, integritas, dan inovasi tanpa henti.
            </motion.p>
        </div>
    </section>
);

// --- Application Form Component ---
const MAX_FILE_MB = 5;
const MAX_EXTRA_FILES = 3;
const EXTRA_FILES_ACCEPT = '.pdf,.jpg,.jpeg,.png,.doc,.docx';

const fileSizeLabel = (file: File) =>
    file.size < 1024 * 1024 ? `${Math.max(1, Math.round(file.size / 1024))} KB` : `${(file.size / 1024 / 1024).toFixed(1)} MB`;

/** Returns an error message, or null when the file fits the accept list and size limit. */
const checkFile = (file: File, accept: string, formatsLabel: string): string | null => {
    const ext = '.' + (file.name.split('.').pop() ?? '').toLowerCase();
    if (!accept.split(',').includes(ext)) return `Format file harus ${formatsLabel}.`;
    if (file.size > MAX_FILE_MB * 1024 * 1024) return `Ukuran file maksimal ${MAX_FILE_MB} MB.`;
    return null;
};

const FileChip: React.FC<{ file: File; onRemove: () => void }> = ({ file, onRemove }) => (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white px-3 py-2">
        <div className="flex min-w-0 items-center gap-3">
            <svg className="h-4 w-4 shrink-0 text-lux-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="truncate text-sm font-medium text-lux-black">{file.name}</span>
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-neutral-400">{fileSizeLabel(file)}</span>
        </div>
        <button
            type="button"
            onClick={onRemove}
            aria-label={`Hapus ${file.name}`}
            className="shrink-0 rounded p-1 text-neutral-400 transition-colors hover:text-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-lux-teal"
        >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
);

const pickButtonClass =
    'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border border-lux-black px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-lux-black transition-colors hover:bg-lux-black hover:text-white focus-within:ring-2 focus-within:ring-lux-teal focus-within:ring-offset-2';

const DocumentField: React.FC<{
    doc: JobDocument;
    file: File | undefined;
    error: string | undefined;
    onPick: (file: File) => void;
    onRemove: () => void;
}> = ({ doc, file, error, onPick, onRemove }) => (
    <div data-field-error={error ? true : undefined} className={`rounded-xl border p-4 transition-colors ${error ? 'border-red-300 bg-red-50/50' : 'border-neutral-200 bg-neutral-50'}`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="text-sm font-bold text-lux-black">{doc.name}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${doc.required ? 'text-lux-teal' : 'text-neutral-400'}`}>
                        {doc.required ? 'Wajib' : 'Opsional'}
                    </span>
                </div>
                {doc.description && <p className="mt-1 text-xs leading-relaxed text-neutral-500">{doc.description}</p>}
                <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                    {doc.formats_label} · maks. {MAX_FILE_MB} MB
                </p>
            </div>
            <label className={pickButtonClass}>
                <input
                    type="file"
                    accept={doc.accept}
                    className="sr-only"
                    aria-label={`Unggah ${doc.name}`}
                    onChange={(e) => {
                        const picked = e.target.files?.[0];
                        e.target.value = '';
                        if (picked) onPick(picked);
                    }}
                />
                {file ? 'Ganti file' : 'Pilih file'}
            </label>
        </div>
        {file && (
            <div className="mt-3">
                <FileChip file={file} onRemove={onRemove} />
            </div>
        )}
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
);

const fieldLabelClass = 'text-[10px] md:text-xs font-bold uppercase tracking-widest text-lux-black';

const inputClass = (invalid: boolean) =>
    `w-full bg-neutral-50 border rounded-lg px-4 py-3 focus:outline-none focus:border-lux-teal focus:ring-1 focus:ring-lux-teal transition-all text-sm ${invalid ? 'border-red-400' : 'border-neutral-200'}`;

/** Education level without a GPA; mirrors the server rule. */
const NO_GPA_LEVEL = 'SMA/SMK';

/** Native radios styled as pills, so keyboard use and `required` work as usual. */
const ChoicePills: React.FC<{
    name: string;
    options: { value: string; label: string }[];
    value: string;
    invalid: boolean;
    onChange: (value: string) => void;
}> = ({ name, options, value, invalid, onChange }) => (
    <div className="flex flex-wrap gap-2">
        {options.map((option) => {
            const selected = value === option.value;
            return (
                <label
                    key={option.value}
                    className={`cursor-pointer rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-lux-teal has-[:focus-visible]:ring-offset-2 ${
                        selected
                            ? 'border-lux-black bg-lux-black text-white'
                            : `bg-neutral-50 text-lux-black hover:border-lux-black ${invalid ? 'border-red-400' : 'border-neutral-200'}`
                    }`}
                >
                    <input
                        type="radio"
                        name={name}
                        value={option.value}
                        checked={selected}
                        onChange={() => onChange(option.value)}
                        required
                        className="sr-only"
                    />
                    {option.label}
                </label>
            );
        })}
    </div>
);

type ApplicationFormData = {
    job_id: number;
    name: string;
    email: string;
    phone: string;
    alamat: string;
    pendidikan_terakhir: string;
    jurusan: string;
    tahun_lulus: string;
    ipk: string;
    pengalaman: string;
    siap_tes_online: string;
    linkedin_url: string;
    source: string;
    cover_letter: string;
    documents: Record<string, File>;
    extra_files: File[];
    persetujuan_data: boolean;
};

const JobApplicationForm: React.FC<{ job: JobPosting; options: ApplicationOptions; onBack: () => void; onSubmit: () => void }> = ({
    job,
    options,
    onBack,
    onSubmit,
}) => {
    const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
    const [serverError, setServerError] = useState('');
    const [submitAttempt, setSubmitAttempt] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    const { data, setData, post, processing, progress, errors, clearErrors } = useForm<ApplicationFormData>({
        job_id: job.id,
        name: '',
        email: '',
        phone: '',
        alamat: '',
        pendidikan_terakhir: '',
        jurusan: '',
        tahun_lulus: '',
        ipk: '',
        pengalaman: '',
        siap_tes_online: '',
        linkedin_url: '',
        source: '',
        cover_letter: '',
        documents: {},
        extra_files: [],
        persetujuan_data: false,
    });

    const needsGpa = data.pendidikan_terakhir !== NO_GPA_LEVEL;
    const testPeriod = job.online_test_period;
    // "10–14 November 2026" reads as "pada tanggal …"; open-ended labels ("mulai …") stand alone.
    const testWhen = testPeriod ? (/^\d/.test(testPeriod) ? `pada tanggal ${testPeriod}` : testPeriod) : 'sesuai jadwal dari tim HR';

    // Errors arrive keyed by field path, e.g. "documents.ktp" or "extra_files.1".
    const fieldErrors = errors as Record<string, string | undefined>;
    const generalError = fieldErrors.server ?? serverError;
    const extraFilesError =
        clientErrors.extra_files ??
        fieldErrors.extra_files ??
        Object.entries(fieldErrors).find(([field]) => field.startsWith('extra_files.'))?.[1];

    // After a rejected submit, bring the first problem into view.
    useEffect(() => {
        if (submitAttempt === 0) return;
        const container = scrollRef.current;
        const target = container?.querySelector('[data-field-error]');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        else container?.scrollTo({ top: 0, behavior: 'smooth' });
    }, [submitAttempt]);

    const setClientError = (field: string, message: string | null) =>
        setClientErrors((prev) => {
            const next = { ...prev };
            if (message) next[field] = message;
            else delete next[field];
            return next;
        });

    const pickDocument = (doc: JobDocument, file: File) => {
        clearErrors(`documents.${doc.key}` as keyof ApplicationFormData);
        const problem = checkFile(file, doc.accept, doc.formats_label);
        setClientError(doc.key, problem);
        if (!problem) setData('documents', { ...data.documents, [doc.key]: file });
    };

    const removeDocument = (doc: JobDocument) => {
        const rest = { ...data.documents };
        delete rest[doc.key];
        setData('documents', rest);
    };

    const pickExtraFiles = (picked: File[]) => {
        clearErrors('extra_files');
        const room = MAX_EXTRA_FILES - data.extra_files.length;
        const valid = picked.filter((file) => !checkFile(file, EXTRA_FILES_ACCEPT, 'PDF, JPG/PNG, atau DOC/DOCX'));
        let problem: string | null = null;
        if (valid.length < picked.length) problem = `Sebagian file dilewati: format harus PDF, JPG/PNG, atau DOC/DOCX dan maksimal ${MAX_FILE_MB} MB.`;
        else if (valid.length > room) problem = `Dokumen tambahan maksimal ${MAX_EXTRA_FILES} file.`;
        setClientError('extra_files', problem);
        setData('extra_files', [...data.extra_files, ...valid.slice(0, Math.max(room, 0))]);
    };

    const removeExtraFile = (index: number) => {
        setData('extra_files', data.extra_files.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setServerError('');

        const missing = job.documents.filter((doc) => doc.required && !data.documents[doc.key]);
        if (missing.length > 0) {
            setClientErrors((prev) => ({
                ...prev,
                ...Object.fromEntries(missing.map((doc) => [doc.key, `${doc.name} wajib diunggah.`])),
            }));
            setSubmitAttempt((n) => n + 1);
            return;
        }

        post('/api/apply-job', {
            forceFormData: true,
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                onSubmit();
            },
            onError: (errs) => {
                if (typeof errs === 'object' && Object.keys(errs).length === 0) {
                    setServerError('Gagal mengirim lamaran. Silakan coba lagi.');
                }
                setSubmitAttempt((n) => n + 1);
            },
        });
    };

    const uploadProgress = progress ? Math.round(progress.percentage ?? 0) : 0;

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full min-h-0">
            <div ref={scrollRef} className="p-6 md:p-12 overflow-y-auto custom-scrollbar flex-grow">
                <button
                    type="button"
                    onClick={onBack}
                    className="mb-8 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-neutral-400 hover:text-lux-teal transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Kembali
                </button>

                <h3 className="text-2xl md:text-4xl font-bold text-lux-black mb-2">
                    Lamar Posisi
                </h3>
                <p className="text-neutral-500 text-sm md:text-lg mb-8">
                    {job.title} <span className="text-neutral-300 mx-2">|</span> {job.location}
                </p>

                {generalError && (
                    <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {generalError}
                    </div>
                )}

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-lux-black">Nama Lengkap</label>
                            <input
                                required
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={`w-full bg-neutral-50 border rounded-lg px-4 py-3 focus:outline-none focus:border-lux-teal focus:ring-1 focus:ring-lux-teal transition-all text-sm ${errors.name ? 'border-red-400' : 'border-neutral-200'}`}
                                placeholder="Jhon Doe"
                            />
                            {errors.name && <p data-field-error className="text-red-500 text-xs">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-lux-black">Email</label>
                            <input
                                required
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={`w-full bg-neutral-50 border rounded-lg px-4 py-3 focus:outline-none focus:border-lux-teal focus:ring-1 focus:ring-lux-teal transition-all text-sm ${errors.email ? 'border-red-400' : 'border-neutral-200'}`}
                                placeholder="email@example.com"
                            />
                            {errors.email && <p data-field-error className="text-red-500 text-xs">{errors.email}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-lux-black">Nomor Telepon / WhatsApp</label>
                        <input
                            required
                            type="tel"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            className={`w-full bg-neutral-50 border rounded-lg px-4 py-3 focus:outline-none focus:border-lux-teal focus:ring-1 focus:ring-lux-teal transition-all text-sm ${errors.phone ? 'border-red-400' : 'border-neutral-200'}`}
                            placeholder="+62 8xx xxxx xxxx"
                        />
                        {errors.phone && <p data-field-error className="text-red-500 text-xs">{errors.phone}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-lux-black">Domisili</label>
                        <textarea
                            required
                            rows={2}
                            value={data.alamat}
                            onChange={(e) => setData('alamat', e.target.value)}
                            className={`w-full bg-neutral-50 border rounded-lg px-4 py-3 focus:outline-none focus:border-lux-teal focus:ring-1 focus:ring-lux-teal transition-all resize-none text-sm ${errors.alamat ? 'border-red-400' : 'border-neutral-200'}`}
                            placeholder="Alamat tempat tinggal saat ini, contoh: Jl. Juanda No. 5, Samarinda Ulu, Samarinda"
                        />
                        {errors.alamat && <p data-field-error className="text-red-500 text-xs">{errors.alamat}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="pendidikan_terakhir" className={fieldLabelClass}>Pendidikan Terakhir</label>
                            <div className="relative">
                                <select
                                    id="pendidikan_terakhir"
                                    required
                                    value={data.pendidikan_terakhir}
                                    onChange={(e) => {
                                        const level = e.target.value;
                                        setData((prev) => ({ ...prev, pendidikan_terakhir: level, ipk: level === NO_GPA_LEVEL ? '' : prev.ipk }));
                                    }}
                                    className={`${inputClass(!!errors.pendidikan_terakhir)} appearance-none`}
                                >
                                    <option value="" disabled>Pilih jenjang</option>
                                    {options.educationLevels.map((level) => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-neutral-500">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            {errors.pendidikan_terakhir && <p data-field-error className="text-red-500 text-xs">{errors.pendidikan_terakhir}</p>}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="jurusan" className={fieldLabelClass}>Jurusan</label>
                            <input
                                id="jurusan"
                                required
                                type="text"
                                maxLength={150}
                                value={data.jurusan}
                                onChange={(e) => setData('jurusan', e.target.value)}
                                className={inputClass(!!errors.jurusan)}
                                placeholder="contoh: Akuntansi"
                            />
                            {errors.jurusan && <p data-field-error className="text-red-500 text-xs">{errors.jurusan}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="tahun_lulus" className={fieldLabelClass}>Tahun Lulus</label>
                            <input
                                id="tahun_lulus"
                                required
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]{4}"
                                title="Empat digit tahun, contoh 2024"
                                maxLength={4}
                                value={data.tahun_lulus}
                                onChange={(e) => setData('tahun_lulus', e.target.value.replace(/\D/g, ''))}
                                className={inputClass(!!errors.tahun_lulus)}
                                placeholder="contoh: 2024"
                            />
                            {errors.tahun_lulus && <p data-field-error className="text-red-500 text-xs">{errors.tahun_lulus}</p>}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="ipk" className={fieldLabelClass}>IPK</label>
                            {needsGpa ? (
                                <input
                                    id="ipk"
                                    required
                                    type="text"
                                    inputMode="decimal"
                                    maxLength={4}
                                    value={data.ipk}
                                    onChange={(e) => setData('ipk', e.target.value.replace(/[^\d.,]/g, ''))}
                                    className={inputClass(!!errors.ipk)}
                                    placeholder="contoh: 3,50 (skala 4)"
                                />
                            ) : (
                                <p className="rounded-lg border border-dashed border-neutral-200 px-4 py-3 text-sm text-neutral-500">Tidak perlu diisi untuk SMA/SMK.</p>
                            )}
                            {errors.ipk && <p data-field-error className="text-red-500 text-xs">{errors.ipk}</p>}
                        </div>
                    </div>

                    <fieldset className="space-y-2">
                        <legend className={`${fieldLabelClass} mb-2`}>Pengalaman Kerja</legend>
                        <ChoicePills
                            name="pengalaman"
                            options={Object.entries(options.experienceOptions).map(([value, label]) => ({ value, label }))}
                            value={data.pengalaman}
                            invalid={!!errors.pengalaman}
                            onChange={(value) => setData('pengalaman', value)}
                        />
                        {errors.pengalaman && <p data-field-error className="text-red-500 text-xs">{errors.pengalaman}</p>}
                    </fieldset>

                    <fieldset className="space-y-2">
                        <legend className={`${fieldLabelClass} mb-2`}>Kesiapan Tes Online</legend>
                        <p className="text-sm text-neutral-600">
                            Siap mengikuti tes online {testWhen} dengan laptop dan kamera?
                        </p>
                        <ChoicePills
                            name="siap_tes_online"
                            options={[
                                { value: '1', label: 'Ya' },
                                { value: '0', label: 'Tidak' },
                            ]}
                            value={data.siap_tes_online}
                            invalid={!!errors.siap_tes_online}
                            onChange={(value) => setData('siap_tes_online', value)}
                        />
                        {errors.siap_tes_online && <p data-field-error className="text-red-500 text-xs">{errors.siap_tes_online}</p>}
                    </fieldset>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-lux-black">LinkedIn URL (Opsional)</label>
                            <input
                                type="url"
                                value={data.linkedin_url}
                                onChange={(e) => setData('linkedin_url', e.target.value)}
                                className={`w-full bg-neutral-50 border rounded-lg px-4 py-3 focus:outline-none focus:border-lux-teal focus:ring-1 focus:ring-lux-teal transition-all text-sm ${errors.linkedin_url ? 'border-red-400' : 'border-neutral-200'}`}
                                placeholder="https://linkedin.com/in/username"
                            />
                            {errors.linkedin_url && <p data-field-error className="text-red-500 text-xs">{errors.linkedin_url}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-lux-black">Info Dari Mana?</label>
                            <div className="relative">
                                <select
                                    required
                                    value={data.source}
                                    onChange={(e) => setData('source', e.target.value)}
                                    className={`w-full bg-neutral-50 border rounded-lg px-4 py-3 appearance-none focus:outline-none focus:border-lux-teal focus:ring-1 focus:ring-lux-teal transition-all text-sm ${errors.source ? 'border-red-400' : 'border-neutral-200'}`}
                                >
                                    <option value="" disabled>Pilih Sumber</option>
                                    <option value="instagram">Instagram</option>
                                    <option value="website">Website Perusahaan</option>
                                    <option value="linkedin">LinkedIn</option>
                                    <option value="referral">Teman / Referensi</option>
                                    <option value="other">Lainnya</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-neutral-500">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            {errors.source && <p data-field-error className="text-red-500 text-xs">{errors.source}</p>}
                        </div>
                    </div>

                    <fieldset className="space-y-3">
                        <legend className="mb-1 text-[10px] md:text-xs font-bold uppercase tracking-widest text-lux-black">Dokumen Lamaran</legend>
                        <p className="text-xs text-neutral-500">Unggah satu file untuk setiap dokumen. Ukuran maksimal {MAX_FILE_MB} MB per file.</p>

                        {job.documents.map((doc) => (
                            <DocumentField
                                key={doc.key}
                                doc={doc}
                                file={data.documents[doc.key]}
                                error={clientErrors[doc.key] ?? fieldErrors[`documents.${doc.key}`]}
                                onPick={(file) => pickDocument(doc, file)}
                                onRemove={() => removeDocument(doc)}
                            />
                        ))}

                        <div data-field-error={extraFilesError ? true : undefined} className={`rounded-xl border border-dashed p-4 ${extraFilesError ? 'border-red-300 bg-red-50/50' : 'border-neutral-300'}`}>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                                        <span className="text-sm font-bold text-lux-black">Dokumen lain</span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Opsional</span>
                                    </div>
                                    <p className="mt-1 text-xs leading-relaxed text-neutral-500">Sertifikat, portofolio, atau dokumen pendukung lain. Maksimal {MAX_EXTRA_FILES} file.</p>
                                    <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-neutral-400">PDF, JPG/PNG, DOC/DOCX · maks. {MAX_FILE_MB} MB</p>
                                </div>
                                {data.extra_files.length < MAX_EXTRA_FILES && (
                                    <label className={pickButtonClass}>
                                        <input
                                            type="file"
                                            multiple
                                            accept={EXTRA_FILES_ACCEPT}
                                            className="sr-only"
                                            aria-label="Unggah dokumen lain"
                                            onChange={(e) => {
                                                const picked = Array.from(e.target.files ?? []);
                                                e.target.value = '';
                                                if (picked.length) pickExtraFiles(picked);
                                            }}
                                        />
                                        Tambah file
                                    </label>
                                )}
                            </div>
                            {data.extra_files.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    {data.extra_files.map((file, idx) => (
                                        <FileChip key={`${file.name}-${idx}`} file={file} onRemove={() => removeExtraFile(idx)} />
                                    ))}
                                </div>
                            )}
                            {extraFilesError && <p className="mt-2 text-xs text-red-600">{extraFilesError}</p>}
                        </div>
                    </fieldset>

                    <div className="space-y-2">
                        <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-lux-black">Cover Letter</label>
                        <textarea
                            rows={4}
                            value={data.cover_letter}
                            onChange={(e) => setData('cover_letter', e.target.value)}
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 focus:outline-none focus:border-lux-teal focus:ring-1 focus:ring-lux-teal transition-all resize-none text-sm"
                            placeholder="Ceritakan singkat mengapa Anda cocok untuk posisi ini..."
                        />
                        {errors.cover_letter && <p data-field-error className="text-red-500 text-xs">{errors.cover_letter}</p>}
                    </div>

                    <fieldset className="space-y-2">
                        <legend className={`${fieldLabelClass} mb-2`}>Persetujuan</legend>
                        <label
                            data-field-error={errors.persetujuan_data ? true : undefined}
                            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${errors.persetujuan_data ? 'border-red-300 bg-red-50/50' : 'border-neutral-200 bg-neutral-50'}`}
                        >
                            <input
                                type="checkbox"
                                required
                                checked={data.persetujuan_data}
                                onChange={(e) => setData('persetujuan_data', e.target.checked)}
                                className="mt-0.5 h-4 w-4 shrink-0 accent-lux-teal"
                            />
                            <span className="text-sm text-lux-black">Saya menyetujui data saya diproses untuk keperluan rekrutmen Kisantra.</span>
                        </label>
                        {errors.persetujuan_data && <p className="text-red-500 text-xs">{errors.persetujuan_data}</p>}
                    </fieldset>
                </div>
            </div>

            <div className="p-6 md:p-8 border-t border-neutral-100 bg-neutral-50 flex flex-col gap-4">
                {processing && progress && (
                    <div className="w-full mb-2">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-1">
                            <span>Uploading...</span>
                            <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                            <motion.div
                                className="bg-lux-teal h-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${uploadProgress}%` }}
                                transition={{ ease: "easeOut" }}
                            />
                        </div>
                    </div>
                )}

                <div className="flex flex-col-reverse md:flex-row justify-end gap-3 md:gap-4">
                    <button
                        type="button"
                        onClick={onBack}
                        className="w-full md:w-auto px-6 py-3 rounded-xl text-neutral-500 font-bold text-xs uppercase tracking-widest hover:text-lux-black transition-colors border border-neutral-200 md:border-transparent text-center"
                        disabled={processing}
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full md:w-auto px-8 py-3 rounded-xl bg-lux-black text-white font-bold text-xs uppercase tracking-widest hover:bg-lux-teal transition-colors shadow-lg shadow-lux-black/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {processing ? 'Mengirim...' : 'Kirim Lamaran'}
                    </button>
                </div>
            </div>
        </form>
    );
};

// --- Single job row ---
const JobRow: React.FC<{ job: JobPosting; onSelect: () => void }> = ({ job, onSelect }) => (
    <motion.div
        layoutId={`job-card-${job.id}`}
        onClick={onSelect}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group flex flex-col md:flex-row items-stretch md:items-center justify-between py-8 md:py-10 border-b border-neutral-200 hover:border-lux-teal transition-colors duration-300 cursor-pointer"
    >
        <div className="mb-6 md:mb-0">
            <motion.h3 layoutId={`job-title-${job.id}`} className="text-xl md:text-2xl font-bold text-lux-black group-hover:text-lux-teal transition-colors">{job.title}</motion.h3>
            <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-2 text-xs md:text-sm text-neutral-500 font-mono uppercase tracking-wide">
                <span>{job.department}</span>
                <span className="hidden md:inline w-1 h-1 bg-neutral-300 rounded-full" />
                <span className="hidden md:inline">|</span>
                <span>{job.type}</span>
                <span className="bg-neutral-100 text-[10px] px-2 py-0.5 rounded">
                    {job.location}
                </span>
            </div>
        </div>

        <div className="flex items-center gap-4 text-lux-teal md:text-lux-black md:opacity-0 md:group-hover:opacity-100 md:-translate-x-4 md:group-hover:translate-x-0 transition-all duration-300 mt-2 md:mt-0 font-bold text-sm uppercase tracking-widest">
            <span className="md:hidden">Lihat Detail &rarr;</span>
            <span className="hidden md:inline text-xs font-bold uppercase tracking-widest text-lux-black">Lihat Detail</span>
            <div className="hidden md:flex w-10 h-10 rounded-full border border-lux-black items-center justify-center group-hover:bg-lux-black group-hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </div>
        </div>
    </motion.div>
);

// --- Batch header ---
const BatchHeader: React.FC<{ batch: BatchInfo }> = ({ batch }) => {
    const period = periodLabel(batch);
    return (
        <div className="mb-6 border-l-4 border-lux-teal pl-5">
            <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-xl md:text-2xl font-bold text-lux-black">{batch.name}</h3>
                <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] ${batchBadgeColor[batch.status] ?? batchBadgeColor.upcoming}`}>
                    {batch.status_display}
                </span>
            </div>
            {period && (
                <span className="mt-1 block font-mono text-xs uppercase tracking-widest text-neutral-400">{period}</span>
            )}
            {batch.description && <p className="mt-2 max-w-2xl text-sm text-neutral-500">{batch.description}</p>}
        </div>
    );
};

const Jobs: React.FC<{ groups: JobGroup[]; options: ApplicationOptions }> = ({ groups, options }) => {
    const allJobs = groups.flatMap((g) => g.jobs);
    const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleClose = () => {
        setSelectedJob(null);
        setShowApplicationForm(false);
        setSubmitSuccess(false);
    };

    return (
        <section className="py-20 md:py-32 bg-lux-white px-6 md:px-12 relative">
            <div className="max-w-[1200px] mx-auto">
                <div className="text-center mb-12 md:mb-20">
                    <span className="text-lux-teal text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Posisi Terbuka</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-lux-black">Bergabung dengan Tim Kami</h2>
                </div>

                {allJobs.length > 0 ? (
                    <div className="flex flex-col gap-14 md:gap-20">
                        {groups.map((group, gi) => (
                            <div key={gi}>
                                {group.batch ? (
                                    <BatchHeader batch={group.batch} />
                                ) : (
                                    groups.length > 1 && (
                                        <div className="mb-6 border-l-4 border-neutral-300 pl-5">
                                            <h3 className="text-xl md:text-2xl font-bold text-lux-black">Lowongan Lainnya</h3>
                                        </div>
                                    )
                                )}
                                <div className="flex flex-col">
                                    {group.jobs.map((job) => (
                                        <JobRow key={job.id} job={job} onSelect={() => setSelectedJob(job)} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-neutral-400">
                        <p>Saat ini belum ada posisi yang tersedia.</p>
                    </div>
                )}

                <div className="mt-16 md:mt-20 text-center">
                    <p className="text-neutral-500 mb-6 text-sm md:text-base">Mengalami gangguan sistem saat melamar?</p>
                    <a href="mailto:hr.kisantra@gmail.com" className="inline-block border-b-2 border-lux-black pb-1 text-lux-black font-bold text-sm md:text-base uppercase tracking-widest hover:text-lux-teal hover:border-lux-teal transition-colors">
                        Email CV Anda
                    </a>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {selectedJob && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleClose}
                            className="absolute inset-0 bg-lux-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            layoutId={`job-card-${selectedJob!.id}`}
                            className="w-full max-w-3xl bg-white rounded-3xl overflow-hidden relative z-10 shadow-2xl max-h-[90vh] flex flex-col"
                        >
                            {!showApplicationForm && !submitSuccess && (
                                <button
                                    onClick={handleClose}
                                    className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors z-20"
                                >
                                    <svg className="w-5 h-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}

                            <AnimatePresence mode="wait">
                                {submitSuccess ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center justify-center h-full p-8 md:p-12 text-center"
                                    >
                                        <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                            <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-bold text-lux-black mb-4">Lamaran Terkirim!</h3>
                                        <p className="text-neutral-500 max-w-md mb-8 text-sm md:text-base">
                                            Terima kasih telah melamar posisi {selectedJob!.title}. Tim HR kami akan mereview aplikasi Anda dan menghubungi jika kualifikasi sesuai.
                                        </p>
                                        <button
                                            onClick={handleClose}
                                            className="px-8 py-3 rounded-xl bg-lux-black text-white font-bold text-xs uppercase tracking-widest hover:bg-lux-teal transition-colors"
                                        >
                                            Tutup
                                        </button>
                                    </motion.div>
                                ) : showApplicationForm ? (
                                    <motion.div
                                        key="form"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="flex-1 min-h-0 flex flex-col"
                                    >
                                        <JobApplicationForm
                                            job={selectedJob!}
                                            options={options}
                                            onBack={() => setShowApplicationForm(false)}
                                            onSubmit={() => setSubmitSuccess(true)}
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="details"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="flex-1 min-h-0 flex flex-col"
                                    >
                                        <div className="p-6 md:p-12 overflow-y-auto custom-scrollbar flex-grow pt-12 text-left">
                                            <div className="mb-6 flex flex-wrap gap-2">
                                                <span className="inline-block py-1 px-3 bg-lux-teal/10 text-lux-teal text-[10px] font-bold uppercase tracking-widest rounded-full">
                                                    {selectedJob!.department}
                                                </span>
                                                {selectedJob!.batch && (
                                                    <span className="inline-block py-1 px-3 bg-lux-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                                                        {selectedJob!.batch}
                                                    </span>
                                                )}
                                            </div>
                                            <motion.h3 layoutId={`job-title-${selectedJob!.id}`} className="text-2xl md:text-4xl font-bold text-lux-black mb-4 leading-tight">
                                                {selectedJob!.title}
                                            </motion.h3>

                                            <div className="flex flex-wrap gap-3 md:gap-4 text-xs md:text-sm text-neutral-500 font-mono uppercase tracking-wide mb-8 md:mb-10 border-b border-neutral-100 pb-6 md:pb-8">
                                                <div className="flex items-center gap-2 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-100">
                                                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                    {selectedJob!.type}
                                                </div>
                                                <div className="flex items-center gap-2 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-100">
                                                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                                    {selectedJob!.work_type}
                                                </div>
                                                <div className="flex items-center gap-2 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-100">
                                                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                    {selectedJob!.location}
                                                </div>
                                            </div>

                                            <div className="space-y-8 text-neutral-600 leading-relaxed md:text-base text-sm">
                                                <div>
                                                    <h4 className="font-bold text-lux-black text-base md:text-lg mb-3">Deskripsi Pekerjaan</h4>
                                                    <div
                                                        className="text-sm md:text-base text-neutral-600 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_li]:mb-1 [&_strong]:font-bold [&_b]:font-bold"
                                                        dangerouslySetInnerHTML={{ __html: selectedJob!.description || "Deskripsi tidak tersedia." }}
                                                    />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-lux-black text-base md:text-lg mb-3">Kualifikasi</h4>
                                                    <div
                                                        className="text-sm md:text-base text-neutral-600 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_li]:mb-1 [&_strong]:font-bold [&_b]:font-bold"
                                                        dangerouslySetInnerHTML={{ __html: selectedJob!.requirements || "Kualifikasi tidak tersedia." }}
                                                    />
                                                </div>
                                                {selectedJob!.online_test_period && (
                                                    <div>
                                                        <h4 className="font-bold text-lux-black text-base md:text-lg mb-3">Jadwal Tes Online</h4>
                                                        <p className="text-sm md:text-base text-neutral-600">
                                                            {selectedJob!.online_test_period.charAt(0).toUpperCase() + selectedJob!.online_test_period.slice(1)}. Siapkan laptop dan kamera untuk mengikuti tes.
                                                        </p>
                                                    </div>
                                                )}
                                                {selectedJob!.documents.length > 0 && (
                                                    <div>
                                                        <h4 className="font-bold text-lux-black text-base md:text-lg mb-3">Dokumen yang Perlu Disiapkan</h4>
                                                        <ul className="divide-y divide-neutral-100 border-y border-neutral-100">
                                                            {selectedJob!.documents.map((doc) => (
                                                                <li key={doc.key} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3">
                                                                    <span className="text-sm md:text-base text-lux-black">
                                                                        {doc.name}
                                                                        {doc.description && <span className="block text-xs text-neutral-500">{doc.description}</span>}
                                                                    </span>
                                                                    <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                                                                        {doc.formats_label} · {doc.required ? <span className="text-lux-teal">Wajib</span> : 'Opsional'}
                                                                    </span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-6 md:p-8 border-t border-neutral-100 bg-neutral-50 flex flex-col-reverse md:flex-row justify-end gap-3 md:gap-4 shrink-0">
                                            <button
                                                onClick={handleClose}
                                                className="w-full md:w-auto px-6 py-3 rounded-xl text-neutral-500 font-bold text-xs uppercase tracking-widest hover:text-lux-black transition-colors border border-neutral-200 md:border-transparent text-center"
                                            >
                                                Tutup
                                            </button>
                                            <button
                                                onClick={() => setShowApplicationForm(true)}
                                                className="w-full md:w-auto px-8 py-3 rounded-xl bg-lux-black text-white font-bold text-xs uppercase tracking-widest hover:bg-lux-teal transition-colors shadow-lg shadow-lux-black/20 text-center"
                                            >
                                                Lamar Posisi Ini
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};

const Karir: React.FC<KarirProps> = ({ groups, educationLevels, experienceOptions }) => {
    return (
        <>
            <Head>
                <title>Karir & Lowongan Kerja</title>
                <meta name="description" content="Bergabunglah dengan tim Kisantra. Temukan peluang karir menarik di bidang konsultan pajak, keuangan, dan teknologi di Samarinda." />
                <meta name="keywords" content="Lowongan Kerja Samarinda, Karir Konsultan, Loker Akuntan Samarinda, Job Vacancy Kisantra, Karir IT Samarinda" />
            </Head>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-lux-white min-h-screen text-lux-black selection:bg-lux-teal selection:text-white"
            >
                <Navbar />
                <main>
                    <Hero />
                    <Jobs groups={groups} options={{ educationLevels, experienceOptions }} />
                </main>
                <Contact />
            </motion.div>
        </>
    );
};

export default Karir;

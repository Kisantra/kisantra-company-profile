import React, { useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import { motion, useScroll, useTransform, useReducedMotion, MotionConfig, MotionValue, Variants } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { Contact } from '../components/Contact';

const HERO_IMG = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1600&auto=format&fit=crop';
const EXPO = [0.16, 1, 0.3, 1] as const;
const WA_LINK = `https://wa.me/6281180009787?text=${encodeURIComponent('Halo Kisantra, saya ingin konsultasi Pendampingan SP2DK.')}`;

const causes = [
  'Ketidaksesuaian data antara SPT dan data pihak ketiga (Faktur, Bukti Potong, maupun data perbankan).',
  'Omzet, penghasilan, atau pajak yang dilaporkan dinilai tidak wajar.',
  'Indikasi ketidakpatuhan atau potensi kekurangan pembayaran pajak.',
  'Aktivitas usaha yang terdeteksi namun belum dilaporkan dalam kewajiban perpajakan.',
  'Perbedaan data yang dimiliki DJP dengan data yang dilaporkan Wajib Pajak.',
];

const risks = [
  'Pemeriksaan pajak lebih lanjut oleh DJP.',
  'Koreksi pajak yang menyebabkan kekurangan pembayaran.',
  'Sanksi administrasi sesuai ketentuan perpajakan.',
  'Potensi sengketa pajak.',
  'Terganggunya aktivitas dan operasional bisnis.',
];

const benefits = [
  'Review dan analisis data perpajakan secara menyeluruh.',
  'Penyusunan klarifikasi dan tanggapan yang tepat kepada DJP.',
  'Pendampingan penuh selama komunikasi dengan petugas pajak.',
  'Identifikasi dan mitigasi potensi risiko perpajakan.',
  'Solusi strategis yang sesuai dengan kondisi usaha Anda.',
];

const steps = [
  { n: '01', title: 'Konsultasi Awal', desc: 'Memahami isi SP2DK dan memetakan risiko yang perlu ditindaklanjuti.' },
  { n: '02', title: 'Review & Analisis Data', desc: 'Memeriksa dokumen, laporan pajak, dan data pendukung terkait.' },
  { n: '03', title: 'Penyusunan Klarifikasi', desc: 'Menyiapkan tanggapan dan dokumen pendukung untuk DJP.' },
  { n: '04', title: 'Pendampingan Komunikasi', desc: 'Mendampingi penyampaian klarifikasi ke petugas pajak.' },
  { n: '05', title: 'Monitoring Hingga Selesai', desc: 'Mengawal proses sampai memperoleh penyelesaian dari KPP.' },
];

const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
const rise: Variants = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EXPO } } };

/* ---------------------------------- Hero ---------------------------------- */
const heroParent: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } };
const fadeUp: Variants = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EXPO } } };
const lineMask: Variants = { hidden: { y: '115%' }, show: { y: 0, transition: { duration: 0.9, ease: EXPO } } };

const Hero: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.22]);
  const glowY = useTransform(scrollYProgress, [0, 1], ['0%', '45%']);

  return (
    <section ref={ref} className="relative flex min-h-[92vh] items-end overflow-hidden bg-lux-black text-white">
      <motion.img
        src={HERO_IMG}
        alt="Meja kerja penanganan dokumen dan perhitungan pajak"
        loading="eager"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.3, ease: 'easeOut' }}
        style={{ y: reduce ? 0 : imgY, scale: reduce ? 1.05 : imgScale }}
        className="absolute inset-0 h-full w-full object-cover will-change-transform"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-lux-black via-lux-black/90 to-lux-black/50" />
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.06] mix-blend-screen" />
      <motion.div style={{ y: reduce ? 0 : glowY }} className="pointer-events-none absolute -right-40 top-1/4 h-[36rem] w-[36rem] rounded-full bg-lux-teal/15 blur-[130px]" />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-16 pt-40 md:px-12 md:pb-24">
        <motion.div initial="hidden" animate="show" variants={heroParent} className="max-w-4xl">
          <motion.span variants={fadeUp} className="mb-7 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-lux-teal">
            <span className="h-px w-8 bg-lux-teal" />
            Pendampingan Pemeriksaan Pajak
          </motion.span>

          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            <span className="block overflow-hidden pb-1">
              <motion.span variants={lineMask} className="block">Jasa Pendampingan SP2DK</motion.span>
            </span>
            <span className="block overflow-hidden pb-1">
              <motion.span variants={lineMask} className="block font-serif font-normal italic text-lux-teal">Profesional</motion.span>
            </span>
            <span className="block overflow-hidden pb-1">
              <motion.span variants={lineMask} className="block">untuk Pemeriksaan Pajak</motion.span>
            </span>
          </h1>

          <motion.p variants={fadeUp} className="mt-7 max-w-md text-base leading-relaxed text-white/60 md:text-lg">
            Ditangani dengan tepat, SP2DK selesai tanpa drama. Kisantra mendampingi Anda dari analisis
            data hingga komunikasi dengan DJP.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <motion.a
              whileTap={{ scale: 0.97 }}
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-lux-teal px-9 py-[18px] text-sm font-bold uppercase tracking-[0.14em] text-lux-black shadow-[0_18px_45px_-12px_rgba(20,184,166,0.65)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-lux-teal-light"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              Konsultasi via WhatsApp
            </motion.a>
            <motion.a
              whileTap={{ scale: 0.97 }}
              href="#proses"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-7 py-[18px] text-xs font-bold uppercase tracking-[0.15em] text-white/80 transition-colors duration-300 hover:border-lux-teal hover:text-lux-teal"
            >
              Lihat Proses
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/* --------------------------- Marquee definition --------------------------- */
const Definition: React.FC = () => {
  const item = (
    <span className="mx-6 flex shrink-0 items-center gap-6 text-sm font-bold uppercase tracking-[0.14em] md:text-base">
      SP2DK
      <span className="text-lux-black/40">·</span>
      Surat Permintaan Penjelasan atas Data dan/atau Keterangan
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-lux-black" />
    </span>
  );
  const half = (
    <div className="flex shrink-0" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <React.Fragment key={i}>{item}</React.Fragment>
      ))}
    </div>
  );
  return (
    <div className="overflow-hidden bg-lux-teal py-5 text-lux-black">
      <div className="flex w-max animate-marquee will-change-transform">
        {half}
        {half}
      </div>
    </div>
  );
};

/* -------------------------------- Penyebab -------------------------------- */
const Causes: React.FC = () => (
  <section className="w-full bg-lux-white py-24 md:py-32">
    <div className="mx-auto grid max-w-[1400px] gap-14 px-6 md:px-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
      <div className="lg:sticky lg:top-32 lg:self-start">
        <span className="mb-4 block text-xs font-bold uppercase tracking-[0.28em] text-lux-teal">Kenapa terbit?</span>
        <h2 className="text-3xl font-bold leading-[1.08] tracking-tight text-lux-black md:text-5xl">
          <span className="font-serif font-normal italic text-lux-teal">Penyebab umum</span> diterbitkannya SP2DK
        </h2>
        <p className="mt-6 max-w-md text-base leading-relaxed text-neutral-500">
          KPP menerbitkan SP2DK untuk meminta klarifikasi atas data atau transaksi yang dinilai belum
          sesuai dengan pelaporan perpajakan Anda.
        </p>

        <div className="mt-8 flex items-start gap-4 rounded-2xl border border-lux-teal/25 bg-lux-teal/5 p-6">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lux-teal/15 text-lux-teal-dark">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </span>
          <p className="text-sm leading-relaxed text-neutral-600">
            Menerima SP2DK bukan bukti pelanggaran. Ini proses klarifikasi yang perlu ditanggapi
            dengan tepat dan didukung data yang memadai.
          </p>
        </div>
      </div>

      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
        {causes.map((c, i) => (
          <motion.div
            key={i}
            variants={rise}
            className="flex items-start gap-6 border-t border-neutral-200 py-7 last:border-b md:gap-10"
          >
            <span className="font-serif text-3xl italic leading-none text-lux-teal md:text-4xl">0{i + 1}</span>
            <p className="pt-1 text-base leading-relaxed text-neutral-700 md:text-lg">{c}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

/* --------------------------------- Risiko --------------------------------- */
const RiskRow: React.FC<{ text: string; index: number }> = ({ text, index }) => (
  <motion.div
    variants={rise}
    className="group relative flex items-center gap-6 py-7 md:gap-12"
  >
    <motion.span
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: EXPO }}
      className="absolute inset-x-0 top-0 h-px origin-left bg-white/12"
    />
    <span className="w-8 shrink-0 font-mono text-sm text-amber-400">0{index + 1}</span>
    <p className="text-xl font-medium leading-snug text-white/85 transition-colors duration-300 group-hover:text-white md:text-3xl">
      {text}
    </p>
  </motion.div>
);

const Risks: React.FC = () => (
  <section className="relative w-full overflow-hidden bg-lux-black py-24 text-white md:py-32">
    <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.06] mix-blend-screen" />
    <div className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-amber-500/10 blur-[130px]" />

    <div className="relative mx-auto max-w-[1400px] px-6 md:px-12">
      <div className="mb-16 max-w-3xl">
        <span className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-amber-400">
          <span className="h-px w-8 bg-amber-400" />
          Taruhannya
        </span>
        <h2 className="text-3xl font-bold leading-[1.05] tracking-tight md:text-6xl">
          Diabaikan atau salah direspons, risikonya berlipat.
        </h2>
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="border-b border-white/12"
      >
        {risks.map((r, i) => (
          <RiskRow key={i} text={r} index={i} />
        ))}
      </motion.div>
    </div>
  </section>
);

/* -------------------------------- Benefits -------------------------------- */
const Benefits: React.FC = () => (
  <section className="w-full bg-lux-white py-24 md:py-32">
    <div className="mx-auto max-w-[1400px] px-6 md:px-12">
      <div className="max-w-3xl">
        <span className="mb-4 block text-xs font-bold uppercase tracking-[0.28em] text-lux-teal">Bersama Kisantra</span>
        <h2 className="text-3xl font-bold leading-[1.1] tracking-tight text-lux-black md:text-5xl">
          Hadapi SP2DK dengan{' '}
          <span className="font-serif font-normal italic text-lux-teal">lebih tenang</span> dan terarah.
        </h2>
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="mt-14 grid gap-x-16 gap-y-2 md:grid-cols-2"
      >
        {benefits.map((b, i) => (
          <motion.div key={i} variants={rise} className="flex items-start gap-5 border-t border-neutral-200 py-6">
            <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lux-teal text-white">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </span>
            <p className="text-base font-medium leading-relaxed text-neutral-700 md:text-lg">{b}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

/* --------------------------------- Proses --------------------------------- */
const StepNode: React.FC<{
  n: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduce: boolean | null;
}> = ({ n, index, total, progress, reduce }) => {
  const at = total > 1 ? index / (total - 1) : 0;
  const fill = useTransform(progress, [Math.max(0, at - 0.1), Math.min(1, at + 0.02)], [0, 1]);
  const backgroundColor = useTransform(fill, [0, 1], ['#fafafa', '#14b8a6']);
  const borderColor = useTransform(fill, [0, 1], ['#e5e5e5', '#14b8a6']);
  const color = useTransform(fill, [0, 1], ['#737373', '#ffffff']);
  const cls = 'relative z-10 flex h-14 w-14 items-center justify-center rounded-full border font-mono text-sm font-bold';

  if (reduce) {
    return <span className={`${cls} border-lux-teal bg-lux-teal text-white`}>{n}</span>;
  }
  return <motion.span style={{ backgroundColor, borderColor, color }} className={cls}>{n}</motion.span>;
};

const Process: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 65%'] });
  const lineScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="proses" className="w-full bg-neutral-50/70 py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-6 md:px-12">
        <div className="mb-16 max-w-2xl md:mb-20">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.28em] text-lux-teal">Proses Pendampingan</span>
          <h2 className="text-3xl font-bold leading-[1.1] tracking-tight text-lux-black md:text-5xl">
            Terstruktur, dari analisis sampai selesai
          </h2>
        </div>

        {/* Desktop: horizontal stepper */}
        <div ref={ref} className="relative hidden lg:block">
          <div className="absolute inset-x-[10%] top-7 h-px bg-neutral-200">
            <motion.div style={{ scaleX: reduce ? 1 : lineScaleX }} className="absolute inset-0 origin-left bg-lux-teal" />
          </div>
          <div className="grid grid-cols-5 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: EXPO }}
                className="flex flex-col items-center px-2 text-center"
              >
                <StepNode n={s.n} index={i} total={steps.length} progress={scrollYProgress} reduce={reduce} />
                <h3 className="mt-8 text-base font-bold leading-snug tracking-tight text-lux-black">{s.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-neutral-500">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile / tablet: vertical list */}
        <div className="space-y-8 lg:hidden">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: EXPO }}
              className="flex items-start gap-5"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-lux-teal/40 bg-lux-teal/5 font-mono text-sm font-bold text-lux-teal-dark">
                {s.n}
              </span>
              <div className="pt-1">
                <h3 className="text-lg font-bold tracking-tight text-lux-black">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------------------------------- Biaya --------------------------------- */
const priceFactors = [
  'Tingkat kompleksitas kasus',
  'Jumlah data yang dianalisis',
  'Ruang lingkup pendampingan',
];

const Pricing: React.FC = () => (
  <section className="w-full bg-lux-white py-24 md:py-32">
    <div className="mx-auto max-w-[1100px] px-6 md:px-12">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: EXPO }}
        >
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.28em] text-lux-teal">Estimasi Biaya</span>
          <h2 className="text-4xl font-bold leading-[1.0] tracking-tight text-lux-black md:text-6xl">
            Harga yang <span className="font-serif font-normal italic text-lux-teal">proporsional.</span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-neutral-500 md:text-lg">
            Setiap kasus SP2DK berbeda. Biaya ditentukan oleh tingkat kompleksitas, jumlah data yang
            dianalisis, dan ruang lingkup pendampingan.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: EXPO }}
          className="rounded-[1.75rem] border border-neutral-200 bg-white p-8 shadow-[0_30px_70px_-40px_rgba(10,10,10,0.18)] md:p-10"
        >
          <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">Yang menentukan biaya</span>

          <ul className="mt-6 space-y-5 border-b border-neutral-100 pb-7">
            {priceFactors.map((f, i) => (
              <li key={f} className="flex items-center gap-5">
                <span className="font-mono text-sm text-lux-teal-dark">0{i + 1}</span>
                <span className="text-base font-medium text-neutral-700">{f}</span>
              </li>
            ))}
          </ul>

          <motion.a
            whileTap={{ scale: 0.98 }}
            href="#konsultasi"
            className="group mt-7 flex w-full items-center justify-center gap-2.5 rounded-full bg-lux-teal py-4 text-xs font-bold uppercase tracking-[0.15em] text-lux-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-lux-teal-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-teal focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Minta Penawaran
            <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
          <p className="mt-4 text-center text-xs text-neutral-400">Tim kami akan menghubungi Anda untuk analisis awal.</p>
        </motion.div>
      </div>
    </div>
  </section>
);

/* ---------------------------------- Form ---------------------------------- */
const ConsultForm: React.FC = () => {
  const [form, setForm] = useState({ nama: '', email: '', telepon: '', kota: '', perusahaan: '', detail: '' });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const message =
      `Halo Kisantra, saya ingin konsultasi *Pendampingan SP2DK*.\n\n` +
      `Nama Lengkap: ${form.nama}\n` +
      `Email: ${form.email}\n` +
      `No. HP/WA: ${form.telepon}\n` +
      `Kota: ${form.kota}\n` +
      `Nama Perusahaan: ${form.perusahaan || '-'}\n\n` +
      `Detail Permasalahan:\n${form.detail}`;
    window.open(`https://wa.me/6281180009787?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  const field =
    'w-full border-0 border-b border-white/15 bg-transparent px-0 py-3 text-white placeholder:text-white/30 transition-colors focus:border-lux-teal focus:outline-none';
  const label = 'mb-1 block text-[11px] font-bold uppercase tracking-[0.18em] text-white/40';

  return (
    <section id="konsultasi" className="relative w-full overflow-hidden bg-lux-black py-24 text-white md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.06] mix-blend-screen" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-lux-teal/15 blur-[130px]" />

      <div className="relative mx-auto grid max-w-[1400px] gap-14 px-6 md:px-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: EXPO }}
          className="lg:sticky lg:top-32 lg:self-start"
        >
          <span className="mb-5 block text-xs font-bold uppercase tracking-[0.28em] text-lux-teal">Konsultasi Sekarang</span>
          <h2 className="text-3xl font-bold leading-[1.05] tracking-tight md:text-5xl">
            Jangan tunggu sampai membesar.
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-white/55">
            Isi formulir, dan tim Kisantra akan segera menghubungi Anda untuk analisis awal serta solusi
            yang sesuai dengan kebutuhan Anda.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {['Analisis Data', 'Klarifikasi ke DJP', 'Pendampingan Penuh'].map((t) => (
              <span key={t} className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-medium text-white/55">{t}</span>
            ))}
          </div>
        </motion.div>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: EXPO }}
        >
          <div className="grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2">
            <div>
              <label className={label}>Nama Lengkap</label>
              <input required type="text" value={form.nama} onChange={set('nama')} className={field} placeholder="Nama Anda" />
            </div>
            <div>
              <label className={label}>Email</label>
              <input required type="email" value={form.email} onChange={set('email')} className={field} placeholder="email@contoh.com" />
            </div>
            <div>
              <label className={label}>No. HP / WhatsApp</label>
              <input required type="tel" value={form.telepon} onChange={set('telepon')} className={field} placeholder="08xxxxxxxxxx" />
            </div>
            <div>
              <label className={label}>Kota</label>
              <input required type="text" value={form.kota} onChange={set('kota')} className={field} placeholder="mis. Samarinda" />
            </div>
            <div className="sm:col-span-2">
              <label className={label}>Nama Perusahaan <span className="font-normal normal-case tracking-normal text-white/25">(opsional)</span></label>
              <input type="text" value={form.perusahaan} onChange={set('perusahaan')} className={field} placeholder="Nama perusahaan atau usaha" />
            </div>
            <div className="sm:col-span-2">
              <label className={label}>Detail Permasalahan</label>
              <textarea required rows={3} value={form.detail} onChange={set('detail')} className={`${field} resize-none`} placeholder="Ceritakan singkat isi SP2DK dan kondisi usaha Anda." />
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="mt-10 flex w-full items-center justify-center gap-2.5 rounded-full bg-lux-teal py-4 text-xs font-bold uppercase tracking-[0.15em] text-lux-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-lux-teal-light sm:w-auto sm:px-10"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            Konsultasi via WhatsApp
          </motion.button>
          <p className="mt-4 text-xs text-white/35">Tombol membuka WhatsApp dengan data yang sudah Anda isi.</p>
        </motion.form>
      </div>
    </section>
  );
};

const SP2DK: React.FC = () => {
  return (
    <>
      <Head>
        <title>Jasa Pendampingan SP2DK Profesional — Kisantra Consult Samarinda</title>
        <meta
          name="description"
          content="Jasa pendampingan SP2DK profesional dari Kisantra Consult di Samarinda: analisis data, penyusunan klarifikasi, hingga pendampingan komunikasi dengan DJP untuk meminimalkan risiko perpajakan."
        />
        <meta name="keywords" content="Pendampingan SP2DK, Jasa SP2DK Samarinda, Konsultan Pajak SP2DK, Pemeriksaan Pajak, Klarifikasi SP2DK DJP, Kisantra Consult" />
      </Head>

      <MotionConfig reducedMotion="user">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="min-h-screen bg-lux-white text-lux-black selection:bg-lux-teal selection:text-white"
        >
          <Navbar theme="dark" />
          <main>
            <Hero />
            <Definition />
            <Causes />
            <Risks />
            <Benefits />
            <Process />
            <Pricing />
            <ConsultForm />
          </main>
          <Contact />
        </motion.div>
      </MotionConfig>
    </>
  );
};

export default SP2DK;

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent, Variants } from 'framer-motion';

interface Sector {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  services: string[];
  icon: React.ReactNode;
}

const svg = { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 1.5, className: 'h-full w-full' } as const;

// 8 sektor unggulan — "Apa yang kami kerjakan untuk setiap sektor".
const sectors: Sector[] = [
  {
    id: '01',
    title: 'Trading Batu Bara & Komoditas',
    subtitle: 'Commodity & Coal Trading',
    summary: 'Pendampingan menyeluruh untuk perusahaan perdagangan komoditas — dari pelaporan pajak hingga legalitas usaha.',
    icon: (
      <svg {...svg}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    ),
    services: [
      'Pelaporan PPh Badan & PPN',
      'Tax planning transaksi komoditas',
      'Penyusunan laporan keuangan tahunan',
      'Pengurusan legalitas & perizinan usaha',
    ],
  },
  {
    id: '02',
    title: 'Kesehatan',
    subtitle: 'Healthcare & Medical',
    summary: 'Perizinan, sistem informasi, dan kepatuhan pajak untuk fasilitas serta tenaga kesehatan.',
    icon: (
      <svg {...svg}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    services: [
      'Perizinan operasional fasilitas kesehatan',
      'Pengurusan SIMRS',
      'Kepatuhan pajak badan & tenaga medis',
      'Branding & digital marketing kesehatan',
    ],
  },
  {
    id: '03',
    title: 'Agen Perkapalan & Logistik',
    subtitle: 'Shipping & Logistics',
    summary: 'Administrasi perpajakan dan perizinan khusus untuk jasa kepelabuhanan serta rantai logistik.',
    icon: (
      <svg {...svg}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    services: [
      'Pelaporan PPh Badan & PPN',
      'Tax planning',
      'Pengurusan SIUPAL',
      'Administrasi perpajakan jasa kepelabuhanan',
      'Penyusunan company profile perusahaan',
    ],
  },
  {
    id: '04',
    title: 'Konstruksi & Kontraktor',
    subtitle: 'Construction & Contracting',
    summary: 'Legalitas, perpajakan, dan pendampingan kepatuhan untuk proyek pemerintah maupun swasta.',
    icon: (
      <svg {...svg}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
      </svg>
    ),
    services: [
      'Pengurusan legalitas usaha konstruksi',
      'Administrasi perpajakan',
      'Penyusunan laporan keuangan',
      'Kepatuhan proyek pemerintah & swasta',
    ],
  },
  {
    id: '05',
    title: 'UMKM',
    subtitle: 'Small & Medium Enterprise',
    summary: 'Dari pendirian usaha hingga pengembangan bisnis — pendampingan lengkap untuk UMKM.',
    icon: (
      <svg {...svg}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.999 2.999 0 004.5 0 2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72l1.189-1.19A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72M6.75 12h3.75a.75.75 0 01.75.75V21" />
      </svg>
    ),
    services: [
      'Pendirian badan usaha & NIB',
      'Pendampingan perpajakan UMKM',
      'Penyusunan laporan keuangan',
      'Konsultasi pengembangan bisnis',
    ],
  },
  {
    id: '06',
    title: 'Restoran, Kafe & F&B',
    subtitle: 'Restaurant, Café & F&B',
    summary: 'Pajak, keuangan, legalitas, hingga pemasaran digital untuk bisnis kuliner Anda.',
    icon: (
      <svg {...svg}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V21m0-10.5a4.5 4.5 0 10-9 0m9 0a4.5 4.5 0 00-9 0m0 0V21m9-10.5h1.5a2.25 2.25 0 010 4.5H15.75M6.75 6.75V4.5m4.5 2.25V4.5" />
      </svg>
    ),
    services: [
      'Pengelolaan perpajakan usaha',
      'Penyusunan laporan keuangan',
      'Legalitas bisnis',
      'Pengelolaan media sosial & iklan digital',
    ],
  },
  {
    id: '07',
    title: 'Event Organizer',
    subtitle: 'Event & Creative',
    summary: 'Legalitas, pelaporan pajak, dan produksi konten kreatif untuk setiap penyelenggaraan event.',
    icon: (
      <svg {...svg}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
    ),
    services: [
      'Pengurusan legalitas usaha EO',
      'Pelaporan pajak setiap proyek',
      'Social media handling',
      'Produksi konten kreatif',
      'Strategi promosi digital tiap event',
    ],
  },
  {
    id: '08',
    title: 'Startup & Perusahaan Jasa',
    subtitle: 'Startup & Services',
    summary: 'Pendirian PT, kepatuhan, dan strategi digital untuk mendukung pertumbuhan startup.',
    icon: (
      <svg {...svg}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    ),
    services: [
      'Pendirian PT & NIB',
      'Penyusunan laporan keuangan',
      'Kepatuhan perpajakan',
      'Penyusunan company profile',
      'Strategi digital marketing pertumbuhan',
    ],
  },
];

// Scroll height (in vh) allotted to each sector while the section is pinned.
const STEP_VH = 52;

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.03 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

const SectorContent: React.FC<{ sector: Sector }> = ({ sector }) => (
  <motion.div variants={container} initial="hidden" animate="show" exit={{ opacity: 0, y: -18, transition: { duration: 0.22 } }}>
    <motion.div variants={item} className="mb-8 flex items-center gap-5">
      <div className="h-12 w-12 shrink-0 text-lux-teal">{sector.icon}</div>
      <div>
        <span className="block font-mono text-xs tracking-[0.2em] text-neutral-400">SEKTOR {sector.id}</span>
        <span className="mt-1 block text-[11px] font-bold uppercase tracking-[0.28em] text-lux-teal">{sector.subtitle}</span>
      </div>
    </motion.div>

    <motion.h4 variants={item} className="mb-5 text-4xl font-bold leading-[1.05] tracking-tight text-lux-black lg:text-5xl">
      {sector.title}
    </motion.h4>
    <motion.p variants={item} className="mb-10 max-w-xl text-lg leading-relaxed text-neutral-500">
      {sector.summary}
    </motion.p>

    <motion.div variants={item} className="mb-3 flex items-center gap-4">
      <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-lux-teal">Yang kami kerjakan</span>
      <span className="h-px flex-1 bg-neutral-200" />
    </motion.div>

    <div className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
      {sector.services.map((service, i) => (
        <motion.div key={service} variants={item} className="flex items-center gap-4 border-b border-neutral-200/80 py-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lux-teal/10 font-mono text-xs font-bold tabular-nums text-lux-teal">
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="text-base font-semibold leading-snug text-lux-black">{service}</span>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export const Portfolio: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(0);

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (!Number.isFinite(p)) return;
    const idx = Math.min(sectors.length - 1, Math.max(0, Math.floor(p * sectors.length)));
    setActive(idx);
  });

  const current = sectors[active] ?? sectors[0];

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const top = window.scrollY + el.getBoundingClientRect().top;
    const pin = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((i + 0.5) / sectors.length) * pin, behavior: 'smooth' });
  };

  return (
    <div className="relative mb-32 md:mb-48">
      {/* ===== Desktop: pinned light panel — static index + scroll-swapped content ===== */}
      <div ref={trackRef} className="relative hidden lg:block" style={{ height: `${sectors.length * STEP_VH}vh` }}>
        <div className="sticky top-0 flex h-screen items-center">
          <div className="relative grid w-full grid-cols-12">
            {/* Static index */}
            <div className="col-span-5 flex gap-7 pr-8">
              <div className="relative w-px shrink-0 self-stretch bg-neutral-200">
                <motion.div className="absolute inset-x-0 top-0 h-full origin-top bg-lux-teal" style={{ scaleY: scrollYProgress }} />
              </div>

              <div className="flex-1">
                <span className="mb-4 block text-xs font-bold uppercase tracking-[0.4em] text-lux-teal">Portofolio Sektor</span>
                <h3 className="mb-7 text-3xl font-bold leading-[1.05] tracking-tight text-lux-black">
                  Yang kami kerjakan untuk{' '}
                  <span className="font-serif font-normal italic text-lux-teal">setiap sektor.</span>
                </h3>

                <div className="mb-8 flex items-baseline gap-2">
                  <div className="relative h-9 w-10 overflow-hidden">
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={current.id}
                        initial={{ y: '100%' }}
                        animate={{ y: '0%' }}
                        exit={{ y: '-110%' }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 block text-4xl font-bold leading-none tracking-tighter text-lux-black tabular-nums"
                      >
                        {current.id}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <span className="text-sm font-medium text-neutral-300">/ 08</span>
                </div>

                <nav className="flex flex-col gap-2.5">
                  {sectors.map((sector, i) => {
                    const isActive = i === active;
                    return (
                      <button key={sector.id} type="button" onClick={() => goTo(i)} className="group flex items-center gap-4 text-left">
                        <span className="relative flex h-5 w-7 shrink-0 items-center">
                          {isActive ? (
                            <motion.span
                              layoutId="navDash"
                              transition={{ type: 'spring', stiffness: 480, damping: 38 }}
                              className="absolute left-0 h-[2px] w-7 rounded-full bg-lux-teal"
                            />
                          ) : (
                            <span className="h-[2px] w-3 rounded-full bg-neutral-300 transition-all duration-300 group-hover:w-5 group-hover:bg-neutral-400" />
                          )}
                        </span>
                        <span
                          className={`origin-left transition-all duration-500 ease-out ${
                            isActive
                              ? 'text-2xl font-bold leading-tight tracking-tight text-lux-black'
                              : 'text-[15px] font-medium tracking-tight text-neutral-400 group-hover:text-neutral-600'
                          }`}
                        >
                          {sector.title}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Scroll-swapped content */}
            <div className="relative col-span-7 min-h-[460px] border-l border-neutral-200/70 pl-10 xl:pl-16">
              <AnimatePresence mode="wait">
                <SectorContent key={current.id} sector={current} />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Mobile / tablet: compact accordion ===== */}
      <div className="lg:hidden">
        <span className="mb-4 block text-xs font-bold uppercase tracking-[0.4em] text-lux-teal">Portofolio Sektor</span>
        <h3 className="mb-8 text-3xl font-bold leading-[1.08] tracking-tight text-lux-black">
          Yang kami kerjakan untuk <span className="font-serif font-normal italic text-lux-teal">setiap sektor.</span>
        </h3>

        <div className="divide-y divide-neutral-100 border-y border-neutral-100">
          {sectors.map((sector, i) => {
            const isOpen = i === mobileOpen;
            return (
              <div key={sector.id}>
                <button type="button" onClick={() => setMobileOpen(isOpen ? -1 : i)} className="flex w-full items-center gap-4 py-5 text-left">
                  <span className={`font-mono text-xs ${isOpen ? 'text-lux-teal' : 'text-neutral-300'}`}>{sector.id}</span>
                  <span
                    className={`flex-1 tracking-tight transition-all duration-500 ${
                      isOpen ? 'text-xl font-bold text-lux-black' : 'text-base font-medium text-neutral-500'
                    }`}
                  >
                    {sector.title}
                  </span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                      isOpen ? 'rotate-45 border-lux-teal bg-lux-teal text-white' : 'border-neutral-300 text-neutral-400'
                    }`}
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-7 pl-8">
                        <span className="mb-3 block text-[11px] font-bold uppercase tracking-[0.25em] text-lux-teal">{sector.subtitle}</span>
                        <p className="mb-5 text-sm leading-relaxed text-neutral-500">{sector.summary}</p>
                        <div className="space-y-0">
                          {sector.services.map((service, s) => (
                            <div key={service} className="flex items-center gap-3.5 border-t border-neutral-200/80 py-3.5">
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lux-teal/10 font-mono text-[11px] font-bold tabular-nums text-lux-teal">
                                {String(s + 1).padStart(2, '0')}
                              </span>
                              <span className="text-[15px] font-semibold leading-snug text-lux-black">{service}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Closing line — the six core services behind every sector */}
      <div className="mt-14 border-t border-neutral-100 pt-8">
        <p className="max-w-3xl text-sm leading-relaxed text-neutral-500 md:text-base">
          <span className="font-semibold text-lux-black">Enam layanan inti</span> hadir di setiap sektor — Pajak,
          Akuntansi, Legalitas, Perizinan, Company Profile, dan Digital Marketing.
        </p>
      </div>
    </div>
  );
};

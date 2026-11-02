import React, { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

// "Indeks sektor": all eight sectors are listed at once in large type. The
// selected one turns black and its services show in the panel beside it
// (desktop) or below it (mobile accordion).

interface Sector {
  id: string;
  title: string;
  summary: string;
  services: string[];
}

const sectors: Sector[] = [
  {
    id: '01',
    title: 'Trading Batu Bara & Komoditas',
    summary: 'Pendampingan menyeluruh untuk perusahaan perdagangan komoditas, dari pelaporan pajak hingga legalitas usaha.',
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
    summary: 'Perizinan, sistem informasi, dan kepatuhan pajak untuk fasilitas serta tenaga kesehatan.',
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
    summary: 'Administrasi perpajakan dan perizinan khusus untuk jasa kepelabuhanan serta rantai logistik.',
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
    summary: 'Legalitas, perpajakan, dan pendampingan kepatuhan untuk proyek pemerintah maupun swasta.',
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
    summary: 'Dari pendirian usaha hingga pengembangan bisnis, pendampingan lengkap untuk UMKM.',
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
    summary: 'Pajak, keuangan, legalitas, hingga pemasaran digital untuk bisnis kuliner Anda.',
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
    summary: 'Legalitas, pelaporan pajak, dan produksi konten kreatif untuk setiap penyelenggaraan event.',
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
    summary: 'Pendirian PT, kepatuhan, dan strategi digital untuk mendukung pertumbuhan startup.',
    services: [
      'Pendirian PT & NIB',
      'Penyusunan laporan keuangan',
      'Kepatuhan perpajakan',
      'Penyusunan company profile',
      'Strategi digital marketing pertumbuhan',
    ],
  },
];

const waLink = (sector: Sector) =>
  'https://wa.me/6281180009787?text=' +
  encodeURIComponent(`Halo Kisantra, saya ingin konsultasi untuk usaha di sektor ${sector.title}.`);

// Inactive sector names: #8c8a83 keeps 3.3:1 on the page background, enough
// for text at this size and weight.
const INACTIVE = 'text-[#8c8a83]';

const SectorDetail: React.FC<{ sector: Sector; compact?: boolean }> = ({ sector, compact = false }) => (
  <>
    <p className={`leading-relaxed text-neutral-600 ${compact ? 'text-sm' : 'mt-3 text-base md:text-lg'}`}>{sector.summary}</p>
    <p className={`font-bold text-lux-black ${compact ? 'mt-5 text-sm' : 'mt-8 text-sm'}`}>Yang kami kerjakan</p>
    <ul className="mt-2">
      {sector.services.map((service) => (
        <li
          key={service}
          className={`border-t border-neutral-200 font-semibold leading-snug text-lux-black ${compact ? 'py-3 text-[15px]' : 'py-4 text-base'}`}
        >
          {service}
        </li>
      ))}
    </ul>
    <a
      href={waLink(sector)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Konsultasi via WhatsApp untuk sektor ${sector.title}`}
      className={`inline-flex min-h-[48px] items-center justify-center rounded-xl bg-lux-black px-6 text-sm font-bold text-white transition-colors hover:bg-lux-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-teal focus-visible:ring-offset-2 ${
        compact ? 'mt-5' : 'mt-8'
      }`}
    >
      Konsultasi untuk sektor ini
    </a>
  </>
);

export const Portfolio: React.FC = () => {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(3);
  const [mobileOpen, setMobileOpen] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = sectors[active];

  // Tabs pattern: arrow keys move between sectors, Home/End jump to the ends.
  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const last = sectors.length - 1;
    const next =
      e.key === 'ArrowDown' || e.key === 'ArrowRight'
        ? (i === last ? 0 : i + 1)
        : e.key === 'ArrowUp' || e.key === 'ArrowLeft'
          ? (i === 0 ? last : i - 1)
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? last
              : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="relative mb-32 md:mb-48">
      <div className="mb-10 flex flex-col gap-4 lg:mb-14 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <h3 className="max-w-3xl text-[clamp(2rem,3.8vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.04em] text-lux-black">
          Yang kami kerjakan untuk setiap sektor.
        </h3>
        <p className="max-w-md text-base leading-relaxed text-neutral-600 md:text-lg lg:pb-1">
          Pilih sektor usaha Anda untuk melihat layanan yang biasa kami tangani di sektor itu.
        </p>
      </div>

      {/* ===== Desktop: index + detail panel ===== */}
      <div className="hidden gap-16 lg:grid lg:grid-cols-[1.15fr_1fr] xl:gap-24">
        <div role="tablist" aria-label="Sektor usaha" aria-orientation="vertical" className="flex flex-col">
          {sectors.map((sector, i) => {
            const on = i === active;
            return (
              <button
                key={sector.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`sektor-tab-${sector.id}`}
                aria-selected={on}
                aria-controls="sektor-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className="group flex items-baseline gap-5 rounded-md py-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-teal focus-visible:ring-offset-4 focus-visible:ring-offset-lux-white"
              >
                <span className={`w-7 shrink-0 text-sm font-semibold tabular-nums ${on ? 'text-lux-teal-dark' : 'text-neutral-500'}`}>{sector.id}</span>
                <span
                  className={`text-[clamp(1.75rem,3vw,2.9rem)] font-bold leading-[1.15] tracking-[-0.04em] transition-colors duration-200 ${
                    on ? 'text-lux-black' : `${INACTIVE} group-hover:text-neutral-600`
                  }`}
                >
                  {sector.title}
                </span>
              </button>
            );
          })}
        </div>

        <div className="self-start lg:sticky lg:top-28">
          <div id="sektor-panel" role="tabpanel" aria-labelledby={`sektor-tab-${current.id}`} className="border-t-2 border-lux-black pt-6">
            {/* Keyed remount: the new sector replaces the old one at once and
                only fades in, so the WhatsApp link never points at a sector
                the visitor has already left. */}
            <motion.div
              key={current.id}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <p className="text-sm text-neutral-600">
                Sektor {current.id} dari {String(sectors.length).padStart(2, '0')}
              </p>
              <h4 className="mt-2 text-3xl font-extrabold leading-tight tracking-[-0.03em] text-lux-black xl:text-4xl">{current.title}</h4>
              <SectorDetail sector={current} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* ===== Mobile / tablet: accordion ===== */}
      <div className="border-b border-neutral-200 lg:hidden">
        {sectors.map((sector, i) => {
          const open = i === mobileOpen;
          return (
            <div key={sector.id} className="border-t border-neutral-200">
              <h4>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`sektor-mobile-${sector.id}`}
                  onClick={() => setMobileOpen(open ? -1 : i)}
                  className="flex min-h-[56px] w-full items-baseline gap-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-teal"
                >
                  <span className={`w-6 shrink-0 text-sm font-semibold tabular-nums ${open ? 'text-lux-teal-dark' : 'text-neutral-500'}`}>{sector.id}</span>
                  <span className={`flex-1 text-2xl font-bold leading-tight tracking-[-0.03em] ${open ? 'text-lux-black' : INACTIVE}`}>{sector.title}</span>
                  <span aria-hidden="true" className={`text-2xl leading-none text-neutral-500 transition-transform duration-200 ${open ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
              </h4>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    id={`sektor-mobile-${sector.id}`}
                    initial={reduce ? false : { height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    transition={{ duration: reduce ? 0 : 0.25, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="pb-7 pl-10">
                      <SectorDetail sector={sector} compact />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <p className="mt-14 max-w-3xl border-t border-neutral-200 pt-8 text-sm leading-relaxed text-neutral-600 md:text-base">
        <span className="font-semibold text-lux-black">Enam layanan inti hadir di setiap sektor:</span> pajak, akuntansi, legalitas, perizinan,
        company profile, dan digital marketing.
      </p>
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion, MotionValue, useMotionValue, useReducedMotion, useScroll, useTransform } from 'framer-motion';

// ---------------------------------------------------------------------------
// Hero "Kepingan yang tersusun": cards for Kisantra's own deliverables (SPT,
// laporan keuangan, akta, website, ...) fly into an ordered grid as the
// visitor scrolls, acting out the headline ("akhirnya beres"). The scene is
// pinned with position: sticky. In the assembled grid each column is one
// service area, matching the list that appears beside it.
// ---------------------------------------------------------------------------

const WA_NUMBER = '6281180009787';

type Category = 'Perpajakan' | 'Keuangan' | 'Perizinan' | 'Digital';
type Kind = 'spt' | 'faktur' | 'sp2dk' | 'labaRugi' | 'neraca' | 'slipGaji' | 'akta' | 'nib' | 'sertifikat' | 'website' | 'sosmed' | 'iklan';

interface TileDef {
  kind: Kind;
  cat: Category;
  title: string;
}

const T: Record<Kind, TileDef> = {
  spt: { kind: 'spt', cat: 'Perpajakan', title: 'SPT Tahunan Badan' },
  faktur: { kind: 'faktur', cat: 'Perpajakan', title: 'Faktur Pajak PPN' },
  sp2dk: { kind: 'sp2dk', cat: 'Perpajakan', title: 'Tanggapan SP2DK' },
  labaRugi: { kind: 'labaRugi', cat: 'Keuangan', title: 'Laporan Laba Rugi' },
  neraca: { kind: 'neraca', cat: 'Keuangan', title: 'Neraca' },
  slipGaji: { kind: 'slipGaji', cat: 'Keuangan', title: 'Slip Gaji' },
  akta: { kind: 'akta', cat: 'Perizinan', title: 'Akta Pendirian PT' },
  nib: { kind: 'nib', cat: 'Perizinan', title: 'Nomor Induk Berusaha' },
  sertifikat: { kind: 'sertifikat', cat: 'Perizinan', title: 'Sertifikat Standar' },
  website: { kind: 'website', cat: 'Digital', title: 'Website Usaha' },
  sosmed: { kind: 'sosmed', cat: 'Digital', title: 'Media Sosial' },
  iklan: { kind: 'iklan', cat: 'Digital', title: 'Iklan Meta & Google' },
};

const CATEGORIES: { name: Category; anchor: string }[] = [
  { name: 'Perpajakan', anchor: 'perpajakan' },
  { name: 'Keuangan', anchor: 'keuangan' },
  { name: 'Perizinan', anchor: 'perizinan' },
  { name: 'Digital', anchor: 'digital' },
];

// Starting pose of the tiles visible on load. x, y and w are percentages of
// the scene; rx, ry, rz are degrees.
interface Scatter {
  x: number;
  y: number;
  w: number;
  rx: number;
  ry: number;
  rz: number;
}

interface Layout {
  tiles: TileDef[]; // array order is the grid cell, row by row
  cols: number;
  cellW: number; // % of scene width
  gap: number; // % of scene width
  centerX: number; // % of scene width
  centerY: number; // % of scene height
  rotateX: number;
  rotateZ: number;
  scale: number;
  scatter: Record<number, Scatter>;
}

// Desktop: one column per service area, in the same order as the list.
const DESKTOP: Layout = {
  tiles: [T.spt, T.labaRugi, T.akta, T.website, T.faktur, T.neraca, T.nib, T.sosmed, T.sp2dk, T.slipGaji, T.sertifikat, T.iklan],
  cols: 4,
  cellW: 12.6,
  gap: 1.4,
  centerX: 31.5,
  centerY: 52,
  rotateX: 40,
  rotateZ: -20,
  scale: 1.02,
  scatter: {
    0: { x: 4, y: 22, w: 12, rx: 10, ry: -14, rz: -6 },
    3: { x: 84, y: 19, w: 12, rx: -8, ry: 16, rz: 5 },
    5: { x: 5, y: 60, w: 11.5, rx: 14, ry: -10, rz: 4 },
    6: { x: 83.5, y: 58, w: 11.5, rx: 12, ry: 14, rz: -5 },
    8: { x: 12.5, y: 79, w: 11, rx: 18, ry: -8, rz: -3 },
    11: { x: 76, y: 79, w: 11, rx: 18, ry: 10, rz: 4 },
  },
};

// Mobile: one row per service area.
const MOBILE: Layout = {
  tiles: [T.spt, T.faktur, T.labaRugi, T.slipGaji, T.akta, T.nib, T.website, T.sosmed],
  cols: 2,
  cellW: 36,
  gap: 3,
  centerX: 47,
  centerY: 33,
  rotateX: 38,
  rotateZ: -18,
  scale: 1,
  scatter: {
    0: { x: 4, y: 77, w: 36, rx: 16, ry: -10, rz: -6 },
    6: { x: 58, y: 75, w: 36, rx: 14, ry: 12, rz: 5 },
    3: { x: 30, y: 88, w: 34, rx: 22, ry: -6, rz: -2 },
  },
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const useIsDesktop = () => {
  const query = '(min-width: 1024px)';
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return matches;
};

// Grid cell for a tile: left in % of scene width, vertical offset from the
// scene's centre in vw (tile height follows its width, so rows use vw too).
const gridCell = (index: number, layout: Layout) => {
  const rows = Math.ceil(layout.tiles.length / layout.cols);
  const cellH = layout.cellW * 0.75;
  const gridW = layout.cols * layout.cellW + (layout.cols - 1) * layout.gap;
  const gridH = rows * cellH + (rows - 1) * layout.gap;
  const col = index % layout.cols;
  const row = Math.floor(index / layout.cols);
  return {
    x: layout.centerX - gridW / 2 + col * (layout.cellW + layout.gap),
    yOffsetVw: -gridH / 2 + row * (cellH + layout.gap),
  };
};

/* ------------------------------ Tile faces ------------------------------ */
// Sizes use cqw (the tile is a size container) so the cards stay legible
// while they grow from their scattered size into the grid.

const INK_SOFT = 'bg-[#e4dfd3]';

const Line: React.FC<{ w?: string; className?: string }> = ({ w = '100%', className = '' }) => (
  <span className={`block h-[3cqw] rounded-full ${INK_SOFT} ${className}`} style={{ width: w }} />
);

const Check: React.FC = () => (
  <svg viewBox="0 0 16 16" className="h-[6cqw] w-[6cqw] shrink-0" aria-hidden="true">
    <circle cx="8" cy="8" r="7" fill="currentColor" />
    <path d="M4.8 8.3l2.2 2.1 4.2-4.6" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Status: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="mt-auto flex items-center gap-[2cqw] text-[5.4cqw] font-semibold text-lux-teal-dark">
    <Check />
    {children}
  </span>
);

const BAR_WIDTHS = [3, 1, 2, 1, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1];
const QR = [
  '1110111', '1010101', '1110111', '0001000', '1101011', '0110110', '1011101',
];

const Body: React.FC<{ def: TileDef }> = ({ def }) => {
  switch (def.kind) {
    case 'spt':
      return (
        <>
          <span className="flex flex-col gap-[3cqw]">
            <Line />
            <Line w="85%" />
            <Line w="60%" />
          </span>
          <Status>Sudah dilaporkan</Status>
        </>
      );
    case 'faktur':
      return (
        <span className="flex flex-col gap-[3cqw]">
          {[70, 55, 62].map((w, i) => (
            <span key={i} className="flex items-center justify-between gap-[4cqw]">
              <Line w={`${w}%`} />
              <Line w="18%" />
            </span>
          ))}
          <span className="mt-[1cqw] flex items-center justify-between border-t border-[#d9d3c4] pt-[3cqw]">
            <span className="text-[5.2cqw] font-semibold text-neutral-600">PPN</span>
            <span className="block h-[3.4cqw] w-[24%] rounded-full bg-lux-teal-dark" />
          </span>
        </span>
      );
    case 'sp2dk':
      return (
        <>
          <span className="flex flex-col gap-[3cqw]">
            <Line />
            <Line w="78%" />
          </span>
          <Status>Terkirim ke KPP</Status>
        </>
      );
    case 'labaRugi':
      return (
        <span className="flex h-full items-end gap-[3cqw] border-b border-[#d9d3c4] pb-[1px]">
          {[38, 50, 44, 62, 56, 80].map((h, i, arr) => (
            <span
              key={i}
              className={`block flex-1 rounded-t-[1cqw] ${i === arr.length - 1 ? 'bg-lux-teal-dark' : INK_SOFT}`}
              style={{ height: `${h}%` }}
            />
          ))}
        </span>
      );
    case 'neraca':
      return (
        <span className="grid h-full grid-cols-[1fr_auto_1fr] items-start gap-[3cqw]">
          {['Aset', 'Pasiva'].map((label, i) => (
            <span key={label} className={`flex flex-col gap-[2.6cqw] ${i === 1 ? 'col-start-3' : ''}`}>
              <span className="text-[5cqw] font-semibold text-neutral-600">{label}</span>
              <Line />
              <Line w="80%" />
              <span className="mt-[1cqw] block h-[3.4cqw] w-full rounded-full bg-neutral-400" />
            </span>
          ))}
          <span className="col-start-2 row-start-1 self-end pb-[1cqw] text-[12cqw] font-bold leading-none text-lux-teal-dark">=</span>
        </span>
      );
    case 'slipGaji':
      return (
        <span className="flex flex-col gap-[2.6cqw]">
          {['Gaji pokok', 'Tunjangan', 'PPh 21'].map((label, i) => (
            <span key={label} className="flex items-center justify-between gap-[4cqw]">
              <span className="text-[5.2cqw] font-medium text-neutral-600">{label}</span>
              <span className={`block h-[3cqw] rounded-full ${i === 2 ? 'bg-lux-teal-dark' : INK_SOFT}`} style={{ width: ['30%', '22%', '16%'][i] }} />
            </span>
          ))}
        </span>
      );
    case 'akta':
      return (
        <span className="relative flex h-full flex-col gap-[3cqw]">
          <Line />
          <Line w="70%" />
          <span className="absolute bottom-0 right-0 -rotate-[9deg] rounded-[1.4cqw] border-[0.9cqw] border-lux-teal-dark px-[3cqw] py-[0.6cqw] text-[6.4cqw] font-extrabold tracking-[0.12em] text-lux-teal-dark">
            BERES
          </span>
        </span>
      );
    case 'nib':
      return (
        <>
          <span className="flex h-[14cqw] items-stretch gap-[0.9cqw]">
            {BAR_WIDTHS.map((w, i) => (
              <span key={i} className="block bg-lux-black/80" style={{ width: `${w * 0.8}cqw` }} />
            ))}
          </span>
          <Status>Terbit via OSS</Status>
        </>
      );
    case 'sertifikat':
      return (
        <span className="flex h-full items-start gap-[4cqw]">
          <span className="grid shrink-0 grid-cols-7 gap-[0.6cqw]" aria-hidden="true">
            {QR.join('').split('').map((c, i) => (
              <span key={i} className={`block h-[2.6cqw] w-[2.6cqw] ${c === '1' ? 'bg-lux-black/80' : 'bg-transparent'}`} />
            ))}
          </span>
          <span className="flex flex-1 flex-col gap-[3cqw] pt-[1cqw]">
            <Line />
            <Line w="70%" />
            <span className="text-[5.2cqw] font-semibold text-lux-teal-dark">Risiko rendah</span>
          </span>
        </span>
      );
    case 'website':
      return (
        <span className="flex h-full flex-col overflow-hidden rounded-[2cqw] border border-[#e4dfd3]">
          <span className="flex items-center border-b border-[#e4dfd3] bg-[#f6f4ee] px-[3cqw] py-[1.6cqw]">
            <span className="rounded-full bg-white px-[3cqw] text-[4.6cqw] font-medium text-neutral-600">tokoanda.com</span>
          </span>
          <span className="flex flex-1 flex-col justify-center gap-[2.4cqw] px-[4cqw]">
            <Line w="72%" className="bg-neutral-400" />
            <Line w="50%" />
            <span className="mt-[1cqw] block h-[5cqw] w-[30%] rounded-[1.2cqw] bg-lux-teal-dark" />
          </span>
        </span>
      );
    case 'sosmed':
      return (
        <span className="flex flex-col gap-[3cqw]">
          <span className="flex items-center gap-[2.4cqw]">
            <span className="block h-[7cqw] w-[7cqw] rounded-full bg-lux-teal-dark" />
            <span className="text-[5.2cqw] font-semibold text-neutral-600">@usahaanda</span>
          </span>
          <span className="grid grid-cols-3 gap-[1.6cqw]">
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className={`block aspect-square rounded-[1cqw] ${INK_SOFT}`} />
            ))}
          </span>
        </span>
      );
    case 'iklan':
      return (
        <svg viewBox="0 0 100 44" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
          {[11, 22, 33].map((y) => (
            <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="#e4dfd3" strokeWidth="0.8" />
          ))}
          <path d="M0 38 L18 33 L34 35 L52 24 L68 26 L84 14 L100 8" fill="none" stroke="#0f766e" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
      );
  }
};

const TileFace: React.FC<{ def: TileDef }> = ({ def }) => (
  <div className="@container h-full w-full">
    <div className="flex h-full flex-col bg-[#fffdf8] p-[7cqw] text-lux-black">
      <span className="text-[5cqw] font-semibold leading-none text-neutral-500">{def.cat}</span>
      <span className="mt-[2cqw] text-[7.4cqw] font-bold leading-[1.15] tracking-[-0.02em]">{def.title}</span>
      <span className="mt-[4.5cqw] flex min-h-0 flex-1 flex-col">
        <Body def={def} />
      </span>
    </div>
  </div>
);

/* --------------------------------- Tile --------------------------------- */

const Tile: React.FC<{ def: TileDef; index: number; layout: Layout; t: MotionValue<number>; dimmed: boolean }> = ({
  def,
  index,
  layout,
  t,
  dimmed,
}) => {
  const cell = gridCell(index, layout);
  const s = layout.scatter[index];

  // Tiles without a starting pose rise into their cell while the grid forms.
  const enter = (v: number) => clamp01((v - 0.45) / 0.45);
  const left = useTransform(t, (v) => `${s ? lerp(s.x, cell.x, v) : cell.x}%`);
  const top = useTransform(t, (v) =>
    s
      ? `calc(${lerp(s.y, layout.centerY, v)}% + ${lerp(0, cell.yOffsetVw, v)}vw)`
      : `calc(${layout.centerY}% + ${cell.yOffsetVw + (1 - enter(v)) * 6}vw)`,
  );
  const width = useTransform(t, (v) => `${s ? lerp(s.w, layout.cellW, v) : layout.cellW}%`);
  const rotateX = useTransform(t, (v) => (s ? lerp(s.rx, 0, v) : 0));
  const rotateY = useTransform(t, (v) => (s ? lerp(s.ry, 0, v) : 0));
  const rotate = useTransform(t, (v) => (s ? lerp(s.rz, 0, v) : 0));
  const opacity = useTransform(t, (v) => (s ? 1 : enter(v)));

  return (
    <motion.div className="absolute aspect-[4/3]" style={{ left, top, width, rotateX, rotateY, rotate, opacity, transformPerspective: 900 }}>
      <div
        className={`h-full w-full overflow-hidden rounded-[5%/6.67%] border border-[#e7e2d6] shadow-[0_10px_24px_-14px_rgba(20,20,20,0.3)] transition-opacity duration-300 ${
          dimmed ? 'opacity-30' : 'opacity-100'
        }`}
      >
        <TileFace def={def} />
      </div>
    </motion.div>
  );
};

/* ------------------------------ Hero copy ------------------------------- */

const HeroCopy: React.FC = () => {
  const [need, setNeed] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = need.trim();
    if (!text) {
      setError('Tulis kebutuhan Anda dulu, misalnya "dirikan PT dan bikin website".');
      inputRef.current?.focus();
      return;
    }
    setError('');
    const message = `Halo Kisantra, saya ingin konsultasi: ${text}`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center px-6 text-center">
      <h1 className="text-[clamp(2.1rem,6.4vw,6rem)] font-extrabold leading-[1.06] tracking-[-0.045em] text-lux-black">
        Urusan bisnis Anda,
        <br />
        <mark className="rounded-[0.18em] bg-teal-300 px-[0.14em] text-inherit">akhirnya</mark> beres.
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-600 md:mt-6 md:text-lg">
        Pajak, laporan keuangan, perizinan, sampai website dan pemasaran digital. Diurus satu tim di Samarinda untuk UMKM dan
        perusahaan di Kalimantan Timur.
      </p>
      <form onSubmit={submit} noValidate className="mt-7 w-full max-w-xl md:mt-8">
        <div className="flex flex-col gap-2 rounded-2xl border border-neutral-300 bg-white p-2 transition-shadow focus-within:border-lux-teal-dark focus-within:ring-2 focus-within:ring-lux-teal/40 sm:flex-row sm:items-center">
          <label htmlFor="hero-need" className="sr-only">
            Kebutuhan Anda
          </label>
          <input
            id="hero-need"
            ref={inputRef}
            value={need}
            onChange={(e) => {
              setNeed(e.target.value);
              if (error) setError('');
            }}
            placeholder="Contoh: dirikan PT dan bikin website"
            aria-invalid={Boolean(error)}
            aria-describedby="hero-need-hint"
            className="min-h-[48px] flex-1 rounded-xl bg-transparent px-4 text-base text-lux-black placeholder:text-neutral-500 focus:outline-none"
          />
          <button
            type="submit"
            className="min-h-[48px] rounded-xl bg-lux-black px-6 text-sm font-bold text-white transition-colors hover:bg-lux-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-teal focus-visible:ring-offset-2"
          >
            Tanya via WhatsApp
          </button>
        </div>
        <p id="hero-need-hint" aria-live="polite" className={`mt-3 text-sm ${error ? 'font-medium text-red-700' : 'text-neutral-500'}`}>
          {error || 'Konsultasi awal gratis.'}
        </p>
      </form>
    </div>
  );
};

/* ------------------------- Service areas (end) -------------------------- */

const AreaList: React.FC<{ active: Category | null; setActive: (c: Category | null) => void; compact: boolean }> = ({
  active,
  setActive,
  compact,
}) => (
  <div>
    <ul className={compact ? 'grid grid-cols-2 gap-x-4' : ''}>
      {CATEGORIES.map((c) => {
        const on = active === c.name;
        return (
          <li key={c.name}>
            <Link
              href={`/layanan#${c.anchor}`}
              onMouseEnter={() => setActive(c.name)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(c.name)}
              onBlur={() => setActive(null)}
              className={`group inline-flex items-center rounded-md font-bold tracking-[-0.04em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-teal ${
                compact ? 'py-1 text-[1.9rem] leading-[1.15]' : 'text-[clamp(2.4rem,4.4vw,4.25rem)] leading-[1.12]'
              } ${active === null || on ? 'text-lux-black' : 'text-neutral-500'}`}
            >
              <span aria-hidden="true" className={`inline-block overflow-hidden transition-all duration-300 ${on ? 'w-[1.1em] opacity-100' : 'w-0 opacity-0'}`}>
                →
              </span>
              {c.name}
            </Link>
          </li>
        );
      })}
    </ul>
    <p className={`max-w-md leading-relaxed text-neutral-600 ${compact ? 'mt-3 text-sm' : 'mt-8 text-base'}`}>
      <strong className="font-bold text-lux-black">Empat bidang, satu tim.</strong> Pilih bidang untuk melihat layanannya.
    </p>
    <Link
      href="/layanan"
      className={`inline-block font-bold text-lux-black underline decoration-[1.5px] underline-offset-4 transition-colors hover:text-lux-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-teal ${
        compact ? 'mt-3 text-sm' : 'mt-5 text-base'
      }`}
    >
      Lihat semua layanan
    </Link>
  </div>
);

/* --------------------------------- Scene -------------------------------- */

// The tile plane: flat while tiles are scattered, tilted into a receding grid
// once they have landed.
const TilePlane: React.FC<{ t: MotionValue<number>; layout: Layout; active: Category | null }> = ({ t, layout, active }) => {
  const rotateX = useTransform(t, [0, 1], [0, layout.rotateX]);
  const rotate = useTransform(t, [0, 1], [0, layout.rotateZ]);
  const scale = useTransform(t, [0, 1], [1, layout.scale]);
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ rotateX, rotate, scale, transformPerspective: 1400, transformOrigin: `${layout.centerX}% ${layout.centerY}%` }}
    >
      {layout.tiles.map((def, i) => (
        <Tile key={`${def.kind}-${i}`} def={def} index={i} layout={layout} t={t} dimmed={active !== null && def.cat !== active} />
      ))}
    </motion.div>
  );
};

export const Hero: React.FC = () => {
  const reduce = useReducedMotion();
  const isDesktop = useIsDesktop();
  const layout = isDesktop ? DESKTOP : MOBILE;
  const [active, setActive] = useState<Category | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });

  // Assembly runs over the first 60% of the pinned scroll.
  const t = useTransform(scrollYProgress, (v) => easeInOut(clamp01((v - 0.06) / 0.54)));
  const copyOpacity = useTransform(scrollYProgress, [0.02, 0.2], [1, 0]);
  const copyY = useTransform(scrollYProgress, [0, 0.2], [0, -60]);
  const copyVisibility = useTransform(scrollYProgress, (v) => (v < 0.22 ? 'visible' : 'hidden'));
  const hintOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const areaOpacity = useTransform(scrollYProgress, [0.52, 0.68], [0, 1]);
  const areaX = useTransform(scrollYProgress, [0.52, 0.68], [30, 0]);
  const areaVisibility = useTransform(scrollYProgress, (v) => (v > 0.5 ? 'visible' : 'hidden'));

  const settled = useMotionValue(1);

  // Reduced motion: no pinning or flying tiles. The copy comes first, then the
  // assembled grid with the service areas, both static.
  if (reduce) {
    return (
      <section ref={sectionRef} className="relative bg-lux-white">
        <div className="pb-16 pt-32 md:pt-40">
          <HeroCopy />
        </div>
        <div className="relative h-[85svh] overflow-hidden">
          <TilePlane t={settled} layout={layout} active={active} />
          {isDesktop && <div className="pointer-events-none absolute inset-y-0 left-[54%] right-0 bg-gradient-to-r from-lux-white/0 via-lux-white via-30% to-lux-white" />}
          <div className={isDesktop ? 'absolute left-[63%] top-1/2 -translate-y-1/2 pr-8' : 'absolute inset-x-0 bottom-0 bg-gradient-to-t from-lux-white via-lux-white/95 to-lux-white/0 px-6 pb-8 pt-16'}>
            <AreaList active={active} setActive={setActive} compact={!isDesktop} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative h-[230vh] bg-lux-white lg:h-[260vh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <TilePlane t={t} layout={layout} active={active} />

        {isDesktop && (
          <motion.div
            className="pointer-events-none absolute inset-y-0 left-[54%] right-0 bg-gradient-to-r from-lux-white/0 via-lux-white via-30% to-lux-white"
            style={{ opacity: areaOpacity }}
          />
        )}

        {/* Desktop: centred in the space between the navbar and the scroll
            hint. Mobile keeps it top-aligned so the tiles below stay clear. */}
        <motion.div
          className="pointer-events-none absolute inset-0 flex flex-col pt-[clamp(6.5rem,15vh,9.5rem)] lg:justify-center lg:pb-12 lg:pt-20"
          style={{ opacity: copyOpacity, y: copyY, visibility: copyVisibility }}
        >
          <div className="pointer-events-auto">
            <HeroCopy />
          </div>
        </motion.div>

        <div className={isDesktop ? 'absolute left-[63%] top-1/2 -translate-y-1/2 pr-8' : 'absolute inset-x-0 bottom-0'}>
          <motion.div
            className={isDesktop ? '' : 'bg-gradient-to-t from-lux-white via-lux-white/95 to-lux-white/0 px-6 pb-8 pt-16'}
            style={{ opacity: areaOpacity, x: areaX, visibility: areaVisibility }}
          >
            <AreaList active={active} setActive={setActive} compact={!isDesktop} />
          </motion.div>
        </div>

        <motion.p
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center"
          style={{ opacity: hintOpacity }}
        >
          <span className="rounded-full bg-lux-white/95 px-3 py-1 text-xs font-semibold tracking-wide text-neutral-600">Gulir ke bawah</span>
        </motion.p>
      </div>
    </section>
  );
};

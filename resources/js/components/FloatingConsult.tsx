import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const WA_LINK =
  'https://wa.me/6281180009787?text=' +
  encodeURIComponent('Halo Kisantra, saya ingin konsultasi gratis mengenai pajak, keuangan, atau legalitas usaha saya.');
const STORAGE_KEY = 'kisantra_consult_collapsed';
const EXPO = [0.16, 1, 0.3, 1] as const;

const WaGlyph: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

const PulseRings: React.FC<{ reduce: boolean; color?: string }> = ({ reduce, color = 'bg-lux-teal/40' }) => {
  if (reduce) return null;
  return (
    <>
      {[0, 1].map((i) => (
        <motion.span
          key={i}
          className={`absolute inset-0 rounded-full ${color}`}
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.9, opacity: 0 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay: i * 1.2 }}
        />
      ))}
    </>
  );
};

const Card: React.FC<{ onClose: () => void; reduce: boolean }> = ({ onClose, reduce }) => (
  <motion.div
    role="complementary"
    aria-label="Ajakan konsultasi gratis"
    initial={{ opacity: 0, y: 26, scale: 0.96 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 26, scale: 0.96 }}
    transition={{ duration: reduce ? 0.2 : 0.55, ease: EXPO }}
    className="pointer-events-auto relative w-[19.5rem] max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-[1.75rem] bg-lux-black p-6 text-white shadow-[0_30px_70px_-20px_rgba(10,10,10,0.55)] ring-1 ring-white/10"
  >
    <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.07] mix-blend-screen" />
    <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-lux-teal/25 blur-[80px]" />

    <button
      onClick={onClose}
      aria-label="Tutup"
      className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-teal"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12M6 18L18 6" />
      </svg>
    </button>

    <div className="relative">
      <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-lux-teal">
        <span className="relative flex h-2 w-2">
          {!reduce && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lux-teal opacity-70" />}
          <span className="relative inline-flex h-2 w-2 rounded-full bg-lux-teal" />
        </span>
        Tanya Kisantra
      </span>

      <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight">
        Konsultasi <span className="font-serif font-normal italic text-lux-teal">gratis</span>
      </h2>
      <p className="mt-2.5 text-sm leading-relaxed text-white/60">
        Diskusikan kebutuhan pajak, keuangan, & legalitas usaha Anda. Tanpa biaya.
      </p>

      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-5 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-lux-teal px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-lux-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-lux-teal-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-teal focus-visible:ring-offset-4 focus-visible:ring-offset-lux-black"
      >
        <span className="relative flex h-5 w-5 items-center justify-center">
          <PulseRings reduce={reduce} color="bg-lux-black/30" />
          <WaGlyph className="relative h-5 w-5" />
        </span>
        Chat via WhatsApp
      </a>

      <p className="mt-3 text-center text-[11px] text-white/40">Balasan cepat pada jam kerja.</p>
    </div>
  </motion.div>
);

const Bubble: React.FC<{ onOpen: () => void; reduce: boolean }> = ({ onOpen, reduce }) => (
  <motion.button
    onClick={onOpen}
    aria-label="Buka ajakan konsultasi gratis"
    initial={{ opacity: 0, scale: 0.4 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.4 }}
    transition={{ duration: reduce ? 0.2 : 0.45, ease: EXPO }}
    className="group pointer-events-auto relative flex h-14 w-14 items-center justify-center rounded-full bg-lux-teal text-lux-black shadow-[0_16px_40px_-12px_rgba(20,184,166,0.7)] transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-teal focus-visible:ring-offset-2 focus-visible:ring-offset-lux-white"
  >
    <PulseRings reduce={reduce} />
    <WaGlyph className="relative h-6 w-6" />
    <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full bg-lux-black px-3.5 py-2 text-xs font-semibold text-white opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
      Konsultasi gratis
    </span>
  </motion.button>
);

export const FloatingConsult: React.FC = () => {
  const reduce = useReducedMotion() ?? false;
  const [ready, setReady] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(STORAGE_KEY) === '1');
    } catch {
      /* ignore */
    }
    const t = setTimeout(() => setReady(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const setState = (isCollapsed: boolean) => {
    setCollapsed(isCollapsed);
    try {
      localStorage.setItem(STORAGE_KEY, isCollapsed ? '1' : '0');
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-end px-5 pb-5 md:px-8 md:pb-8">
      <AnimatePresence mode="wait">
        {ready &&
          (collapsed ? (
            <Bubble key="bubble" reduce={reduce} onOpen={() => setState(false)} />
          ) : (
            <Card key="card" reduce={reduce} onClose={() => setState(true)} />
          ))}
      </AnimatePresence>
    </div>
  );
};

export default FloatingConsult;

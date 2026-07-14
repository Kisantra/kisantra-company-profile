import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, Variants } from 'framer-motion';
import { Link } from '@inertiajs/react';

// ---------------------------------------------------------------------------
// Interactive service showcase (right column).
// An editorial, art-directed carousel of the three pillars the headline
// promises — Pajak, Finansial & Pemasaran Digital — each with high-resolution,
// on-theme stock imagery. Auto-rotates, pauses on hover, and is clickable, so a
// visitor immediately grasps what Kisantra Consult does, right from the hero.
// ---------------------------------------------------------------------------
type Pillar = {
  tab: string;
  kicker: string;
  title: string;
  desc: string;
  image: string;
};

const pillars: Pillar[] = [
  {
    tab: 'Pajak',
    kicker: 'Perpajakan & Kepatuhan',
    title: 'Konsultasi Perpajakan',
    desc: 'Kepatuhan dan perencanaan pajak yang efisien untuk setiap skala bisnis.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1920&auto=format&fit=crop',
  },
  {
    tab: 'Finansial',
    kicker: 'Akuntansi & Audit',
    title: 'Manajemen Finansial',
    desc: 'Laporan keuangan dan analitik bisnis yang akurat serta terukur.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1920&auto=format&fit=crop',
  },
  {
    tab: 'Digital',
    kicker: 'Marketing & Teknologi',
    title: 'Pemasaran Digital',
    desc: 'Strategi dan transformasi digital untuk mendorong pertumbuhan.',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1920&auto=format&fit=crop',
  },
];

const DURATION = 5000;

const ServiceShowcase: React.FC = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-advance; restarts whenever the active slide changes or hover toggles.
  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => {
      setActive((prev) => (prev + 1) % pillars.length);
    }, DURATION);
    return () => clearTimeout(id);
  }, [active, paused]);

  const current = pillars[active];

  return (
    <div
      className="group/show relative w-full h-[50vh] sm:h-[56vh] lg:h-[64vh] rounded-[2rem] overflow-hidden ring-1 ring-black/5 shadow-2xl shadow-black/10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Crossfading high-res images with a slow Ken Burns drift */}
      <AnimatePresence>
        <motion.img
          key={active}
          src={current.image}
          alt={current.title}
          loading={active === 0 ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={active === 0 ? 'high' : 'auto'}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 0.9 }, scale: { duration: 7, ease: 'easeOut' } }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Legibility gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-lux-black/90 via-lux-black/20 to-lux-black/40" />

      {/* Corner ticks — quiet viewfinder framing */}
      <div className="pointer-events-none absolute top-5 left-5 h-5 w-5 border-l border-t border-white/30" />
      <div className="pointer-events-none absolute bottom-5 right-5 h-5 w-5 border-r border-b border-white/30" />

      {/* Top row — brand wordmark + editorial slide counter */}
      <div className="absolute top-0 inset-x-0 p-6 sm:p-7 flex items-start justify-between gap-3">
        <span className="inline-flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-lux-teal" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/90">Kisantra Consult</span>
        </span>

        <div className="flex items-baseline gap-1.5 text-white">
          <div className="relative h-7 sm:h-9 w-7 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={active}
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                exit={{ y: '-110%', opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 font-serif text-2xl sm:text-3xl leading-none"
              >
                0{active + 1}
              </motion.span>
            </AnimatePresence>
          </div>
          <span className="font-serif text-sm text-white/40">/ 0{pillars.length}</span>
        </div>
      </div>

      {/* Bottom block — animated caption + numbered selector */}
      <div className="absolute bottom-0 inset-x-0 p-6 sm:p-7">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mb-6 sm:mb-7"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-7 bg-lux-teal" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-lux-teal">{current.kicker}</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white leading-[1.15]">{current.title}</h3>
            <p className="mt-2.5 text-xs sm:text-sm text-white/65 leading-relaxed max-w-sm line-clamp-2">{current.desc}</p>
          </motion.div>
        </AnimatePresence>

        {/* Numbered selector with a filling progress underline */}
        <div className="flex items-end gap-5 sm:gap-8">
          {pillars.map((p, i) => (
            <button
              key={p.tab}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Tampilkan ${p.title}`}
              aria-pressed={i === active}
              className="group/tab relative flex-1 pb-3 text-left"
            >
              <span
                className={`block font-serif text-xs mb-1 transition-colors duration-300 ${
                  i === active ? 'text-lux-teal' : 'text-white/40'
                }`}
              >
                0{i + 1}
              </span>
              <span
                className={`block text-[11px] sm:text-xs font-bold uppercase tracking-[0.12em] transition-colors duration-300 ${
                  i === active ? 'text-white' : 'text-white/50 group-hover/tab:text-white/80'
                }`}
              >
                {p.tab}
              </span>
              {/* baseline + active fill */}
              <span className="absolute bottom-0 left-0 right-0 h-px bg-white/15" />
              {i === active && (
                <motion.span
                  key={`fill-${active}-${paused}`}
                  className="absolute bottom-0 left-0 h-px bg-lux-teal"
                  initial={{ width: '0%' }}
                  animate={{ width: paused ? '35%' : '100%' }}
                  transition={{ duration: paused ? 0.4 : DURATION / 1000, ease: paused ? 'easeOut' : 'linear' }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Full text to type out once
  const text = "Sinergi Strategis: Pajak, Finansial, & Pemasaran Digital.";
  const characters = Array.from(text);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.8,
      }
    }
  };

  const charVariants: Variants = {
    hidden: { opacity: 0, display: "none" },
    visible: {
      opacity: 1,
      display: "inline",
      transition: { duration: 0.01 }
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center overflow-hidden px-6 md:px-12 pt-28 pb-20 lg:pt-20 bg-lux-white"
    >

      {/* Background layer — grain + animated teal glow + drifting grid */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 z-10 opacity-30 bg-grain mix-blend-multiply pointer-events-none"></div>

        <motion.div
          className="absolute top-1/2 right-0 lg:right-[8%] w-[80vw] h-[80vw] md:w-[600px] md:h-[600px] bg-gradient-to-tr from-lux-teal-light to-transparent rounded-full opacity-30 blur-[100px]"
          style={{ x: '15%', y: '-50%' }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.4, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.div
          className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] opacity-[0.05]"
          animate={{
            x: ["0%", "-2%"],
            y: ["0%", "-2%"]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
          style={{
            backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px),
                                  linear-gradient(to bottom, #000 1px, transparent 1px)`,
            backgroundSize: '120px 120px',
            maskImage: 'radial-gradient(circle at center, black 30%, transparent 70%)'
          }}
        />
      </div>

      {/* Content grid — text left, interactive showcase right */}
      <motion.div
        style={{ y: yText, opacity }}
        className="relative z-10 w-full max-w-[1400px] mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">

          {/* LEFT — Text column */}
          <div className="flex flex-col text-center lg:text-left">

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="mb-6 flex justify-center lg:justify-start"
            >
              <span className="inline-flex items-center gap-2.5 rounded-full border border-neutral-200 bg-white/60 px-4 py-1.5 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-lux-teal" />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-lux-teal">
                  Konsultan Bisnis, Pajak &amp; Keuangan
                </span>
              </span>
            </motion.div>

            {/* Heading (typewriter) */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-2xl mx-auto lg:mx-0"
            >
              <h1 className="font-bold text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[4rem] leading-[1.1] text-lux-black tracking-tighter break-words min-h-[4.4em] sm:min-h-[3.6em] lg:min-h-[3.8em]">
                {characters.map((char, i) => (
                  <motion.span key={i} variants={charVariants}>
                    {char}
                  </motion.span>
                ))}
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block w-1.5 md:w-2 h-8 sm:h-10 lg:h-12 bg-lux-teal ml-1 align-middle"
                />
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 3.5, ease: "easeOut" }}
              className="mt-6 md:mt-8 max-w-xl mx-auto lg:mx-0"
            >
              <p className="text-base md:text-lg text-neutral-500 font-medium tracking-wide leading-relaxed">
                Partner strategis <span className="text-lux-black font-bold">konsultan bisnis di Samarinda</span>. Mengintegrasikan regulasi, manajemen finansial, dan inovasi digital untuk bisnis di Kalimantan Timur.
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 4.2, ease: "easeOut" }}
              className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                href="/kontak"
                className="group relative inline-flex items-center justify-center px-8 py-3 font-medium tracking-widest text-white transition-all duration-300 bg-lux-black border border-lux-black rounded-full hover:bg-lux-teal hover:border-lux-teal"
              >
                <span className="relative z-10 text-xs md:text-sm uppercase">
                  Hubungi Kami
                </span>
              </Link>

              <Link
                href="/tentang-kami"
                className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium tracking-widest text-lux-black transition duration-300 ease-out border border-neutral-300 rounded-full hover:border-lux-black"
              >
                <span className="absolute inset-0 w-full h-full bg-lux-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></span>
                <span className="relative z-10 text-xs md:text-sm uppercase group-hover:text-white transition-colors duration-300">
                  Tentang Kami
                </span>
              </Link>
            </motion.div>
          </div>

          {/* RIGHT — Interactive image showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md mx-auto lg:max-w-none lg:mx-0"
          >
            {/* Deliberate offset double-frame for depth (intentional, not a glow) */}
            <div className="hidden sm:block absolute inset-0 translate-x-3 translate-y-3 rounded-[2rem] border border-lux-teal/40 -z-10" />

            <ServiceShowcase />
          </motion.div>

        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-lux-black opacity-40"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-[10px] uppercase tracking-widest font-semibold">Scroll</span>
      </motion.div>
    </section>
  );
};

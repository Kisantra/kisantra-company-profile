import React, { useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, Variants } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { Contact } from '../components/Contact';

interface ServiceItem {
  id: number;
  name: string;
  subtitle?: string | null;
  slug: string;
  category: string;
  description?: string;
  price?: string;
  price_note?: string;
  features: string[];
  hero_image?: string | null;
}

interface Props {
  services?: ServiceItem[];
}

const CATEGORY_ORDER = ['Perpajakan', 'Keuangan', 'Perizinan', 'Digital'];
const EXPO = [0.16, 1, 0.3, 1] as const;
const rise: Variants = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EXPO } } };
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const strip = (html?: string) => (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const Arrow: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const ServiceCard: React.FC<{ s: ServiceItem }> = ({ s }) => (
  <motion.div variants={rise}>
    <Link
      href={`/layanan/${s.slug}`}
      className="group flex h-full flex-col justify-between gap-6 rounded-3xl border border-neutral-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-lux-teal/60 hover:shadow-[0_24px_60px_-24px_rgba(10,10,10,0.18)]"
    >
      <div>
        <h3 className="text-xl font-bold leading-snug tracking-tight text-lux-black transition-colors duration-300 group-hover:text-lux-teal">
          {s.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-500">{s.subtitle || strip(s.description)}</p>
        {s.features?.length > 0 && (
          <ul className="mt-5 space-y-2">
            {s.features.slice(0, 3).map((f, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-neutral-600">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-lux-teal" />
                {f}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex items-end justify-between gap-3 border-t border-neutral-100 pt-5">
        <div>
          {s.price_note && <span className="block text-[10px] font-semibold uppercase tracking-widest text-neutral-400">{s.price_note}</span>}
          <span className="text-sm font-bold text-lux-black">{s.price || 'Hubungi Kami'}</span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-lux-black transition-colors group-hover:text-lux-teal">
          Detail
          <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  </motion.div>
);

const Layanan: React.FC<Props> = ({ services = [] }) => {
  const grouped = useMemo(() => {
    const map: Record<string, ServiceItem[]> = {};
    services.forEach((s) => {
      (map[s.category] ||= []).push(s);
    });
    return CATEGORY_ORDER.filter((c) => map[c]?.length).map((c) => ({ category: c, items: map[c] }));
  }, [services]);

  return (
    <>
      <Head>
        <title>Layanan Konsultan Pajak, Keuangan & Bisnis</title>
        <meta name="description" content="Layanan lengkap Kisantra Consult di Samarinda: perpajakan, keuangan, perizinan, dan solusi digital untuk pertumbuhan bisnis Anda." />
        <meta name="keywords" content="Jasa Pajak Samarinda, Konsultan Keuangan, Perizinan Usaha, Jasa SP2DK, Layanan Kisantra Consult" />
      </Head>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-lux-white text-lux-black selection:bg-lux-teal selection:text-white"
      >
        <Navbar />

        <header className="px-6 pt-36 pb-12 md:px-12 md:pt-44">
          <div className="mx-auto max-w-[1400px]">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="mb-4 block text-xs font-bold uppercase tracking-[0.3em] text-lux-teal">Layanan Kami</span>
              <h1 className="max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight text-lux-black md:text-6xl lg:text-7xl">
                Solusi menyeluruh untuk{' '}
                <span className="font-serif font-normal italic text-lux-teal">bisnis Anda</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-neutral-500 md:text-lg">
                Dari perpajakan hingga transformasi digital, ditangani langsung oleh konsultan berpengalaman
                di Samarinda dan Kalimantan Timur.
              </p>
            </motion.div>
          </div>
        </header>

        <main className="px-6 pb-24 md:px-12">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-16 md:gap-24">
            {/* Featured — SP2DK */}
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: EXPO }}>
              <Link href="/sp2dk" className="group relative block overflow-hidden rounded-[2rem] bg-lux-black p-8 text-white md:p-12">
                <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.06] mix-blend-screen" />
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-lux-teal/20 blur-[110px]" />
                <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                  <div className="max-w-xl">
                    <span className="mb-3 block text-xs font-bold uppercase tracking-[0.28em] text-lux-teal">Layanan Unggulan</span>
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Pendampingan SP2DK</h2>
                    <p className="mt-4 text-base leading-relaxed text-white/60">
                      Dampingi pemeriksaan pajak SP2DK secara profesional, dari analisis data sampai komunikasi dengan DJP.
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-2.5 rounded-full bg-lux-teal px-7 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-lux-black transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-lux-teal-light">
                    Lihat Detail
                    <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.div>

            {/* Catalog by category */}
            {grouped.map((group) => (
              <section key={group.category}>
                <div className="mb-8 flex items-baseline gap-4">
                  <h2 className="text-2xl font-bold tracking-tight text-lux-black md:text-3xl">{group.category}</h2>
                  <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">{group.items.length} layanan</span>
                </div>
                <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((s) => (
                    <ServiceCard key={s.id} s={s} />
                  ))}
                </motion.div>
              </section>
            ))}

            {grouped.length === 0 && (
              <div className="rounded-3xl border border-dashed border-neutral-300 bg-white/50 px-6 py-20 text-center">
                <h3 className="text-lg font-bold text-lux-black">Daftar layanan sedang disiapkan</h3>
                <p className="mt-2 text-sm text-neutral-500">
                  Sementara ini, hubungi kami langsung untuk kebutuhan layanan Anda, atau lihat{' '}
                  <Link href="/sp2dk" className="font-semibold text-lux-teal hover:underline">Pendampingan SP2DK</Link>.
                </p>
              </div>
            )}
          </div>
        </main>

        <Contact />
      </motion.div>
    </>
  );
};

export default Layanan;

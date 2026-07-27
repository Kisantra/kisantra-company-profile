import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence, MotionConfig, Variants } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { Contact } from '../components/Contact';

interface Step { title: string; description?: string }
interface Example { title: string; description?: string }
interface Faq { question: string; answer?: string }
interface Related { id: number; name: string; slug: string; category: string; price?: string; price_note?: string }

interface ServiceData {
  id: number;
  name: string;
  subtitle?: string | null;
  slug: string;
  category: string;
  hero_image?: string | null;
  description?: string;
  overview?: string;
  price?: string;
  price_note?: string;
  features: string[];
  process_steps: Step[];
  examples: Example[];
  faqs: Faq[];
  seo_description?: string | null;
}

interface Props {
  service: ServiceData;
  related?: Related[];
}

const WA_NUMBER = '6281180009787';
const EXPO = [0.16, 1, 0.3, 1] as const;
const rise: Variants = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EXPO } } };
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

const waLink = (name: string) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Halo Kisantra, saya ingin konsultasi layanan ${name}.`)}`;

const pad = (n: number) => String(n).padStart(2, '0');

const WaIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

const ArrowRight: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const MastheadDecor: React.FC = () => (
  <motion.div
    aria-hidden="true"
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1.1, delay: 0.35, ease: EXPO }}
    className="pointer-events-none absolute right-0 top-1/2 hidden h-[32rem] w-[34rem] -translate-y-1/2 lg:block xl:w-[42rem]"
  >
    <div className="absolute right-10 top-10 h-56 w-56 rounded-full bg-lux-teal/10 blur-[90px]" />
    <svg viewBox="0 0 480 480" fill="none" className="absolute inset-0 h-full w-full">
      <defs>
        <pattern id="msd-grid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M15 10v10M10 15h10" stroke="#0a0a0a" strokeOpacity="0.16" strokeWidth="1" strokeLinecap="round" />
        </pattern>
        <radialGradient id="msd-fade" cx="80%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="68%" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="msd-mask"><rect width="480" height="480" fill="url(#msd-fade)" /></mask>
      </defs>
      <g mask="url(#msd-mask)">
        <rect width="480" height="480" fill="url(#msd-grid)" />
        <circle cx="474" cy="26" r="250" stroke="#14b8a6" strokeOpacity="0.16" strokeWidth="1.5" fill="none" />
        <circle cx="474" cy="26" r="168" stroke="#14b8a6" strokeOpacity="0.1" strokeWidth="1.5" fill="none" />
        <g stroke="#14b8a6" strokeWidth="1.6" strokeLinecap="round">
          <path d="M345 130v10M340 135h10" />
          <path d="M435 160v10M430 165h10" />
        </g>
        <circle cx="405" cy="75" r="14" stroke="#14b8a6" strokeOpacity="0.4" strokeWidth="1.2" fill="none" />
        <circle cx="405" cy="75" r="4" fill="#14b8a6" />
      </g>
    </svg>
  </motion.div>
);

const contentClass =
  'max-w-[68ch] text-base leading-relaxed text-neutral-600 md:text-lg ' +
  '[&>p:first-of-type]:text-lg [&>p:first-of-type]:leading-relaxed [&>p:first-of-type]:text-neutral-800 [&>p:first-of-type]:md:text-xl ' +
  '[&_p]:mb-5 [&_strong]:font-bold [&_strong]:text-lux-black ' +
  '[&_a]:font-bold [&_a]:text-lux-teal-dark [&_a:hover]:underline ' +
  '[&_ul]:my-5 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-6 ' +
  '[&_li]:marker:text-lux-teal ' +
  '[&_h2]:mt-9 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-lux-black ' +
  '[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-lux-black';

const Chapter: React.FC<{ index: string; title: React.ReactNode; children: React.ReactNode }> = ({ index, title, children }) => (
  <motion.section
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: '-80px' }}
    variants={stagger}
    className="border-t border-neutral-200 pt-8 md:pt-10"
  >
    <motion.div variants={rise} className="mb-8 flex items-baseline gap-4 md:gap-5">
      <span className="font-serif text-xl italic leading-none text-lux-teal md:text-2xl">{index}</span>
      <h2 className="text-[1.6rem] font-bold leading-tight tracking-tight text-lux-black md:text-[2rem]">{title}</h2>
    </motion.div>
    {children}
  </motion.section>
);

const FaqRow: React.FC<{ faq: Faq; defaultOpen?: boolean }> = ({ faq, defaultOpen }) => {
  const [open, setOpen] = useState(Boolean(defaultOpen));
  return (
    <div className="border-b border-neutral-200 first:border-t">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors focus-visible:outline-none focus-visible:text-lux-teal-dark hover:text-lux-teal-dark"
      >
        <span className="text-base font-semibold text-lux-black md:text-lg">{faq.question}</span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.25, ease: EXPO }} className="relative flex h-6 w-6 shrink-0 items-center justify-center text-lux-teal" aria-hidden="true">
          <span className="absolute h-[2px] w-3.5 rounded-full bg-current" />
          <span className="absolute h-3.5 w-[2px] rounded-full bg-current" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && faq.answer && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: EXPO }} className="overflow-hidden">
            <p className="pb-5 pr-8 text-sm leading-relaxed text-neutral-500 md:text-base">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ServiceDetail: React.FC<Props> = ({ service, related = [] }) => {
  const body = service.overview || service.description || '';
  const metaDesc = service.seo_description || (service.description || '').replace(/<[^>]+>/g, ' ').trim().slice(0, 160) || service.name;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  // Dynamic chapter numbering, only for present sections.
  const present = [
    body && 'overview',
    service.features.length > 0 && 'features',
    service.process_steps.length > 0 && 'process',
    service.examples.length > 0 && 'examples',
    service.faqs.length > 0 && 'faqs',
  ].filter(Boolean) as string[];
  const num = (key: string) => pad(present.indexOf(key) + 1);

  return (
    <>
      <Head>
        <title>{`${service.name} — Kisantra Consult Samarinda`}</title>
        <meta name="description" content={metaDesc} />
        <meta property="og:title" content={service.name} />
        <meta property="og:type" content="website" />
        {service.hero_image && <meta property="og:image" content={service.hero_image} />}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Beranda', item: `${origin}/` },
              { '@type': 'ListItem', position: 2, name: 'Layanan', item: `${origin}/layanan` },
              { '@type': 'ListItem', position: 3, name: service.name, item: `${origin}/layanan/${service.slug}` },
            ],
          })}
        </script>
        {service.faqs.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: service.faqs.map((f) => ({
                '@type': 'Question',
                name: f.question,
                acceptedAnswer: { '@type': 'Answer', text: f.answer || '' },
              })),
            })}
          </script>
        )}
      </Head>

      <MotionConfig reducedMotion="user">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="min-h-screen bg-lux-white text-lux-black selection:bg-lux-teal selection:text-white">
          <Navbar />

          {/* Masthead */}
          <header className="px-6 pt-32 md:px-12 md:pt-40">
            <div className="mx-auto max-w-[1280px]">
              <nav aria-label="Breadcrumb" className="mb-10 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-400">
                <Link href="/" className="transition-colors hover:text-lux-teal">Beranda</Link>
                <span className="text-neutral-300">/</span>
                <Link href="/layanan" className="transition-colors hover:text-lux-teal">Layanan</Link>
                <span className="text-neutral-300">/</span>
                <span className="text-lux-teal">{service.category}</span>
              </nav>

              <div className="relative">
                <MastheadDecor />
                <div className="relative z-10">
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="mb-5 block text-xs font-bold uppercase tracking-[0.3em] text-lux-teal">
                    {service.category}
                  </motion.span>

                  <div className="overflow-hidden pb-1">
                    <motion.h1
                      initial={{ y: '108%' }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.8, ease: EXPO }}
                      className="max-w-4xl text-[2.6rem] font-bold leading-[1.02] tracking-tight text-lux-black sm:text-5xl md:text-6xl lg:text-7xl"
                    >
                      {service.name}
                    </motion.h1>
                  </div>

                  {service.subtitle && (
                    <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: EXPO }} className="mt-7 max-w-2xl text-lg leading-relaxed text-neutral-500 md:text-xl">
                      {service.subtitle}
                    </motion.p>
                  )}

                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3, ease: EXPO }} className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
                    <a
                      href={waLink(service.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-lux-teal px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] text-lux-black shadow-[0_16px_40px_-14px_rgba(20,184,166,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-lux-teal-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-teal focus-visible:ring-offset-4 focus-visible:ring-offset-lux-white"
                    >
                      <WaIcon className="h-5 w-5" />
                      Konsultasi via WhatsApp
                    </a>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-400">{service.price_note || 'Estimasi'}</span>
                      <span className="text-lg font-bold tracking-tight text-lux-black">{service.price || 'Hubungi Kami'}</span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {service.hero_image && (
                <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.35, ease: EXPO }} className="mt-14 overflow-hidden rounded-[2rem] shadow-[0_40px_90px_-40px_rgba(10,10,10,0.3)]">
                  <img src={service.hero_image} alt={service.name} className="aspect-[16/9] w-full object-cover" loading="eager" />
                </motion.div>
              )}
            </div>
          </header>

          {/* Body — asymmetric two-column with sticky summary */}
          <div className="px-6 py-20 md:px-12 md:py-28">
            <div className="mx-auto grid max-w-[1280px] gap-x-16 gap-y-14 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-x-24">
              {/* Sticky summary (right on desktop, surfaced early on mobile) */}
              <aside className="lg:col-start-2 lg:row-start-1">
                <div className="lg:sticky lg:top-28">
                  <div className="relative overflow-hidden rounded-[1.75rem] bg-lux-black p-8 text-white ring-1 ring-white/10">
                    <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.06] mix-blend-screen" />
                    <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-lux-teal/20 blur-[100px]" />
                    <div className="relative">
                      <span className="block text-[11px] font-bold uppercase tracking-[0.28em] text-lux-teal">{service.price_note || 'Estimasi Biaya'}</span>
                      <div className="mt-2 text-4xl font-bold tracking-tight md:text-[2.75rem]">{service.price || 'Hubungi Kami'}</div>
                      <p className="mt-4 text-sm leading-relaxed text-white/55">
                        Biaya menyesuaikan kebutuhan dan kompleksitas kasus Anda.
                      </p>

                      <a
                        href={waLink(service.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group mt-7 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-lux-teal px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-lux-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-lux-teal-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-teal focus-visible:ring-offset-4 focus-visible:ring-offset-lux-black"
                      >
                        <WaIcon className="h-5 w-5" />
                        Minta Penawaran
                      </a>

                      <dl className="mt-8 divide-y divide-white/10 border-t border-white/10 text-sm">
                        {[
                          ['Kategori', service.category],
                          ['Konsultasi awal', 'Gratis'],
                          ['Wilayah', 'Samarinda & Kaltim'],
                        ].map(([k, v]) => (
                          <div key={k} className="flex items-center justify-between gap-4 py-3.5">
                            <dt className="text-white/45">{k}</dt>
                            <dd className="font-semibold text-white">{v}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Content chapters */}
              <div className="flex flex-col gap-16 md:gap-20 lg:col-start-1 lg:row-start-1">
                {body && (
                  <Chapter index={num('overview')} title="Ringkasan layanan">
                    <motion.div variants={rise}>
                      <div className={contentClass} dangerouslySetInnerHTML={{ __html: body }} />
                    </motion.div>
                  </Chapter>
                )}

                {service.features.length > 0 && (
                  <Chapter index={num('features')} title="Yang Anda dapatkan">
                    <ul className="grid gap-x-12 sm:grid-cols-2">
                      {service.features.map((f, i) => (
                        <motion.li key={i} variants={rise} className="flex items-start gap-3.5 border-t border-neutral-200 py-4">
                          <svg className="mt-0.5 h-5 w-5 shrink-0 text-lux-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-base font-medium leading-snug text-neutral-700">{f}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </Chapter>
                )}

                {service.process_steps.length > 0 && (
                  <Chapter index={num('process')} title="Alur pengerjaan">
                    <ol className="relative">
                      <motion.span
                        aria-hidden="true"
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: EXPO }}
                        style={{ transformOrigin: 'top' }}
                        className="pointer-events-none absolute left-5 top-4 bottom-6 w-px bg-neutral-200 md:left-[22px]"
                      />
                      {service.process_steps.map((s, i) => (
                        <motion.li key={i} variants={rise} className="relative flex gap-5 pb-9 last:pb-0 md:gap-7">
                          <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-lux-white font-mono text-xs font-bold text-lux-teal md:h-11 md:w-11 md:text-sm">
                            {pad(i + 1)}
                          </span>
                          <div className="pt-1.5">
                            <h3 className="text-lg font-bold tracking-tight text-lux-black md:text-xl">{s.title}</h3>
                            {s.description && <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-neutral-500 md:text-base">{s.description}</p>}
                          </div>
                        </motion.li>
                      ))}
                    </ol>
                  </Chapter>
                )}

                {service.examples.length > 0 && (
                  <Chapter index={num('examples')} title="Contoh penerapan">
                    <div className="border-t border-neutral-200">
                      {service.examples.map((e, i) => (
                        <motion.div key={i} variants={rise} className="flex gap-5 border-b border-neutral-200 py-6 md:gap-8">
                          <span className="w-10 shrink-0 font-serif text-2xl italic leading-none text-lux-teal/70 md:text-3xl">{pad(i + 1)}</span>
                          <div>
                            <h3 className="text-lg font-bold tracking-tight text-lux-black md:text-xl">{e.title}</h3>
                            {e.description && <p className="mt-1.5 text-sm leading-relaxed text-neutral-500 md:text-base">{e.description}</p>}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Chapter>
                )}

                {service.faqs.length > 0 && (
                  <Chapter index={num('faqs')} title="Pertanyaan umum">
                    <div>
                      {service.faqs.map((f, i) => (
                        <FaqRow key={i} faq={f} defaultOpen={i === 0} />
                      ))}
                    </div>
                  </Chapter>
                )}
              </div>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <section className="px-6 pb-24 md:px-12">
              <div className="mx-auto max-w-[1280px]">
                <div className="mb-2 flex items-baseline justify-between gap-4 border-t border-neutral-200 pt-10">
                  <h2 className="text-2xl font-bold tracking-tight text-lux-black md:text-3xl">
                    Layanan {service.category} <span className="font-serif font-normal italic text-lux-teal">lainnya</span>
                  </h2>
                  <Link href="/layanan" className="hidden shrink-0 text-xs font-bold uppercase tracking-[0.12em] text-neutral-400 transition-colors hover:text-lux-teal sm:inline">Semua layanan</Link>
                </div>
                <div>
                  {related.map((r) => (
                    <Link
                      key={r.id}
                      href={`/layanan/${r.slug}`}
                      className="group flex items-center justify-between gap-6 border-b border-neutral-200 py-6 transition-colors hover:border-lux-teal/40"
                    >
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-lux-teal">{r.category}</span>
                        <h3 className="mt-1.5 truncate text-xl font-bold tracking-tight text-lux-black transition-colors group-hover:text-lux-teal md:text-2xl">{r.name}</h3>
                      </div>
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-neutral-300 text-lux-black transition-all duration-300 group-hover:border-lux-teal group-hover:bg-lux-teal group-hover:text-lux-black">
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          <Contact />
        </motion.div>
      </MotionConfig>
    </>
  );
};

export default ServiceDetail;

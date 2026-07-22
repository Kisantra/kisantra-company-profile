import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, Variants } from 'framer-motion';

const services = ['Perpajakan', 'Keuangan', 'Digital Marketing', 'Sistem Digital', 'Administrasi'];

interface ContactLink {
  label: string;
  sub: string;
  href: string;
  internal?: boolean;
  icon: React.ReactNode;
}

const contacts: ContactLink[] = [
  {
    label: 'Email',
    sub: 'kisantra.official@gmail.com',
    href: 'mailto:kisantra.official@gmail.com',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    sub: '@kisantra.official',
    href: 'https://www.instagram.com/kisantra.official/',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.332.014 7.052.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.332 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: 'Lokasi Kantor',
    sub: 'Samarinda, Kalimantan Timur',
    href: 'https://maps.app.goo.gl/uruyuiRPund8uwAm7',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: 'Website Resmi',
    sub: 'Lihat layanan lengkap',
    href: '/layanan',
    internal: true,
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 010 18M12 3a15 15 0 000 18" />
      </svg>
    ),
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const Profil: React.FC = () => {
  return (
    <>
      <Head>
        <title>Kisantra Consult — Profil & Kontak</title>
        <meta
          name="description"
          content="Kisantra Consult — konsultan bisnis, pajak, dan keuangan di Samarinda. Hubungi kami untuk konsultasi via WhatsApp, email, atau kunjungi kantor kami."
        />
        <meta name="robots" content="noindex, follow" />
      </Head>

      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-lux-black px-5 py-14 text-white selection:bg-lux-teal selection:text-lux-black">
        {/* Ambience */}
        <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.07] mix-blend-screen" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-lux-teal/20 blur-[110px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-lux-teal/10 blur-[100px]" />

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 flex w-full max-w-md flex-col items-center text-center"
        >
          {/* Logo */}
          <motion.div variants={item}>
            <Link href="/" aria-label="Kisantra Consult">
              <picture>
                <source srcSet="/image/Logo/Logo Horizontal - Copy.webp" type="image/webp" />
                <img src="/image/Logo/Logo Horizontal.png" alt="Kisantra Consult" className="h-11 w-auto" />
              </picture>
            </Link>
          </motion.div>

          {/* Tagline */}
          <motion.span variants={item} className="mt-7 text-[11px] font-bold uppercase tracking-[0.3em] text-lux-teal">
            Konsultan Bisnis · Pajak · Keuangan
          </motion.span>
          <motion.span variants={item} className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-white/40">
            Samarinda — Kalimantan Timur
          </motion.span>

          {/* Summary */}
          <motion.p variants={item} className="mt-6 max-w-sm text-sm leading-relaxed text-white/70">
            Kisantra Consult adalah mitra strategis bisnis Anda di Samarinda — mulai dari perpajakan,
            keuangan, legalitas usaha, hingga transformasi digital, dikelola langsung oleh konsultan
            berpengalaman.
          </motion.p>

          {/* Service chips */}
          <motion.div variants={item} className="mt-6 flex flex-wrap justify-center gap-2">
            {services.map((s) => (
              <span
                key={s}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/70"
              >
                {s}
              </span>
            ))}
          </motion.div>

          {/* Primary CTA — WhatsApp */}
          <motion.a
            variants={item}
            href="https://wa.me/6281180009787?text=Halo%20Kisantra%20Consult%2C%20saya%20ingin%20berkonsultasi."
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-lux-teal px-6 py-4 text-sm font-bold uppercase tracking-[0.12em] text-lux-black shadow-[0_16px_40px_-16px_rgba(20,184,166,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-lux-teal-light"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            Konsultasi Gratis via WhatsApp
          </motion.a>

          {/* Contact links */}
          <div className="mt-4 w-full space-y-3">
            {contacts.map((c) => {
              const inner = (
                <span className="flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-left backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-lux-teal/40 hover:bg-white/[0.08]">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lux-teal/15 text-lux-teal">
                    {c.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-white">{c.label}</span>
                    <span className="block truncate text-xs text-white/50">{c.sub}</span>
                  </span>
                  <svg className="h-4 w-4 shrink-0 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              );

              return (
                <motion.div key={c.label} variants={item}>
                  {c.internal ? (
                    <Link href={c.href} className="group block">
                      {inner}
                    </Link>
                  ) : (
                    <a href={c.href} target="_blank" rel="noopener noreferrer" className="group block">
                      {inner}
                    </a>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Footer */}
          <motion.div variants={item} className="mt-10 flex flex-col items-center gap-2">
            <p className="max-w-xs text-[11px] leading-relaxed text-white/35">
              Jln. Suryanta, Gg. Kopta, Air Putih, Kec. Samarinda Ulu, Kota Samarinda, Kalimantan Timur 75243
            </p>
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/25">
              © {new Date().getFullYear()} Kisantra Consult
            </span>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default Profil;

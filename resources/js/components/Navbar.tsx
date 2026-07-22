import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion, Variants } from 'framer-motion';
import { Link, router, usePage } from '@inertiajs/react';

interface SubItem {
  label: string;
  sub: string;
  href: string;
}
interface MenuItem {
  label: string;
  href: string;
  children?: SubItem[];
}

const menuItems: MenuItem[] = [
  { label: 'Beranda', href: '/' },
  { label: 'Tentang Kami', href: '/tentang-kami' },
  {
    label: 'Layanan',
    href: '/layanan',
    children: [
      { label: 'Semua Layanan', sub: 'Pajak, keuangan, digital & administrasi', href: '/layanan' },
      { label: 'Pendampingan SP2DK', sub: 'Untuk pemeriksaan pajak', href: '/sp2dk' },
    ],
  },
  { label: 'Wawasan', href: '/articles' },
  { label: 'Karir', href: '/karir' },
  { label: 'Pengumuman', href: '/pengumuman' },
  { label: 'Kontak', href: '/kontak' },
];

const pathActive = (url: string, href: string) => (href === '/' ? url === '/' : url.startsWith(href));
const itemActive = (url: string, item: MenuItem) =>
  pathActive(url, item.href) || (item.children?.some((c) => pathActive(url, c.href)) ?? false);

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-teal focus-visible:ring-offset-4 focus-visible:ring-offset-transparent';

/* --------------------------- Desktop dropdown ----------------------------- */
const DesktopDropdown: React.FC<{ item: MenuItem; url: string; base: string; glow: string }> = ({ item, url, base, glow }) => {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const active = itemActive(url, item);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          setOpen(false);
          (e.currentTarget.querySelector('a[data-trigger]') as HTMLElement | null)?.focus();
        }
      }}
    >
      <Link
        href={item.href}
        data-trigger=""
        aria-haspopup="true"
        aria-expanded={open}
        className={`${base} ${glow} ${FOCUS_RING} inline-flex items-center gap-1.5 rounded-sm ${active ? 'text-lux-teal' : 'text-lux-black hover:text-lux-teal'}`}
      >
        {item.label}
        <motion.svg animate={{ rotate: open ? 180 : 0 }} transition={{ duration: reduce ? 0 : 0.25 }} className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </motion.svg>
        <span className={`absolute -bottom-1.5 left-0 h-0.5 rounded-full bg-lux-teal transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full group-focus-visible:w-full'}`} />
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : 8 }}
            transition={{ duration: reduce ? 0.12 : 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 top-full z-50 w-[19rem] -translate-x-1/2 pt-4"
          >
            <div className="rounded-2xl border border-neutral-200/70 bg-lux-white/95 p-2 shadow-[0_28px_70px_-24px_rgba(10,10,10,0.22)] backdrop-blur-xl">
              {item.children!.map((child, ci) => {
                const cActive = pathActive(url, child.href);
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={() => setOpen(false)}
                    className={`group/item relative flex items-center justify-between gap-8 rounded-lg px-4 py-4 transition-colors duration-200 focus-visible:bg-neutral-50 focus-visible:outline-none ${ci > 0 ? 'border-t border-neutral-100' : ''}`}
                  >
                    <span className="min-w-0">
                      <span className={`block text-[15px] font-semibold tracking-tight transition-colors duration-200 ${cActive ? 'text-lux-teal-dark' : 'text-lux-black group-hover/item:text-lux-teal-dark'}`}>
                        {child.label}
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-neutral-500">{child.sub}</span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={`text-lg leading-none text-lux-teal-dark transition-all duration-300 ${cActive ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover/item:translate-x-0 group-hover/item:opacity-100'}`}
                    >
                      &rarr;
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* --------------------------- Mobile accordion ----------------------------- */
const MobileAccordion: React.FC<{ item: MenuItem; index: number; url: string; onNavigate: () => void }> = ({ item, index, url, onNavigate }) => {
  const reduce = useReducedMotion();
  const [expanded, setExpanded] = useState(itemActive(url, item));
  const active = itemActive(url, item);
  const panelId = `submenu-${item.label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        aria-controls={panelId}
        className="group flex w-full items-baseline gap-4 rounded-sm py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-teal"
      >
        <span className={`font-mono text-xs ${active ? 'text-lux-teal' : 'text-white/40'}`}>0{index + 1}</span>
        <span className={`flex-1 text-3xl font-bold tracking-tight transition-colors duration-300 sm:text-4xl ${active ? 'text-lux-teal' : 'text-white group-hover:text-lux-teal'}`}>
          {item.label}
        </span>
        <motion.span animate={{ rotate: expanded ? 45 : 0 }} transition={{ duration: reduce ? 0 : 0.25 }} className="relative mt-1 flex h-6 w-6 shrink-0 items-center justify-center text-white/50" aria-hidden="true">
          <span className="absolute h-[2px] w-4 rounded-full bg-current" />
          <span className="absolute h-4 w-[2px] rounded-full bg-current" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-1 pb-4 pl-9">
              {item.children!.map((child) => {
                const cActive = pathActive(url, child.href);
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={onNavigate}
                    className="group/sub flex items-center justify-between gap-4 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/5 focus-visible:bg-white/10 focus-visible:outline-none"
                  >
                    <span className="min-w-0">
                      <span className={`block text-lg font-semibold ${cActive ? 'text-lux-teal' : 'text-white/90 group-hover/sub:text-lux-teal'}`}>{child.label}</span>
                      <span className="block text-xs text-white/55">{child.sub}</span>
                    </span>
                    <span aria-hidden="true" className="shrink-0 text-base leading-none text-white/45 transition-all duration-200 group-hover/sub:translate-x-0.5 group-hover/sub:text-lux-teal">
                      &rarr;
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const { url } = usePage();

  const isActive = (href: string) => pathActive(url, href);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', isOpen);
    return () => document.body.classList.remove('overflow-hidden');
  }, [isOpen]);

  useEffect(() => {
    const onStart = () => {
      setIsNavigating(true);
      setIsOpen(false);
    };
    const onFinish = () => setIsNavigating(false);
    const removeStart = router.on('start', onStart);
    const removeFinish = router.on('finish', onFinish);
    return () => {
      removeStart();
      removeFinish();
    };
  }, []);

  const overlayVariants: Variants = {
    closed: { opacity: 0, y: '-100%', transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } },
    open: { opacity: 1, y: '0%', transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } },
  };
  const listVariants: Variants = {
    closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
    open: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } },
  };
  const itemVariants: Variants = {
    closed: { y: 30, opacity: 0 },
    open: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } },
  };

  const deskLinkBase = 'group relative text-sm font-semibold tracking-tight transition-colors duration-300';
  const glow = 'drop-shadow-[0_1px_3px_rgba(255,255,255,0.95)]';

  return (
    <>
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="fixed left-0 top-0 z-[200] h-1 w-full origin-left bg-lux-teal"
          />
        )}
      </AnimatePresence>

      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className={`fixed inset-x-0 top-0 z-50 bg-transparent transition-all duration-300 ${scrolled ? 'py-4' : 'py-5 md:py-6'}`}
      >
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 md:px-12">
          <Link href="/" className={`group block shrink-0 rounded-sm ${FOCUS_RING}`} aria-label="Kisantra Consult, ke Beranda">
            <picture>
              <source srcSet="/image/Logo/Logo Horizontal - Copy.webp" type="image/webp" />
              <source srcSet="/image/Logo/Logo Horizontal.png" type="image/png" />
              <img
                src="/image/Logo/Logo Horizontal.png"
                alt="Kisantra Consult"
                className={`w-auto drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] transition-all duration-300 group-hover:scale-105 ${scrolled ? 'h-8' : 'h-9 md:h-10'}`}
              />
            </picture>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex xl:gap-9" aria-label="Navigasi utama">
            {menuItems.slice(0, -1).map((item) => {
              if (item.children) {
                return <DesktopDropdown key={item.href} item={item} url={url} base={deskLinkBase} glow={glow} />;
              }
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined} className={`${deskLinkBase} ${glow} ${FOCUS_RING} rounded-sm ${active ? 'text-lux-teal' : 'text-lux-black hover:text-lux-teal'}`}>
                  {item.label}
                  <span className={`absolute -bottom-1.5 left-0 h-0.5 rounded-full bg-lux-teal transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full group-focus-visible:w-full'}`} />
                </Link>
              );
            })}

            <Link
              href="/kontak"
              aria-current={isActive('/kontak') ? 'page' : undefined}
              className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.12em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-teal focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${isActive('/kontak') ? 'bg-lux-teal text-white' : 'bg-lux-black text-white hover:bg-lux-teal'}`}
            >
              Kontak
            </Link>
          </nav>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`group ml-auto flex flex-col items-end gap-[6px] rounded-sm p-2 transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-teal lg:hidden`}
            aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={isOpen}
          >
            <span className={`h-[2px] bg-lux-black drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] transition-all duration-300 ${isOpen ? 'w-7 translate-y-[8px] rotate-45' : 'w-7 group-hover:bg-lux-teal'}`} />
            <span className={`h-[2px] bg-lux-black drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] transition-all duration-300 ${isOpen ? 'w-7 opacity-0' : 'w-5 group-hover:w-7 group-hover:bg-lux-teal'}`} />
            <span className={`h-[2px] bg-lux-black drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] transition-all duration-300 ${isOpen ? 'w-7 -translate-y-[8px] -rotate-45' : 'w-4 group-hover:w-7 group-hover:bg-lux-teal'}`} />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-lux-black/95 backdrop-blur-xl lg:hidden"
          >
            <motion.nav
              variants={listVariants}
              initial="closed"
              animate="open"
              exit="closed"
              aria-label="Navigasi utama"
              className="flex flex-1 flex-col justify-center gap-1 px-8 py-28 sm:px-12"
            >
              {menuItems.map((item, i) => {
                if (item.children) {
                  return (
                    <motion.div key={item.href} variants={itemVariants}>
                      <MobileAccordion item={item} index={i} url={url} onNavigate={() => setIsOpen(false)} />
                    </motion.div>
                  );
                }
                const active = isActive(item.href);
                return (
                  <motion.div key={item.href} variants={itemVariants}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      aria-current={active ? 'page' : undefined}
                      className="group flex items-baseline gap-4 rounded-sm border-b border-white/10 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-teal"
                    >
                      <span className={`font-mono text-xs ${active ? 'text-lux-teal' : 'text-white/40'}`}>0{i + 1}</span>
                      <span className={`text-3xl font-bold tracking-tight transition-colors duration-300 sm:text-4xl ${active ? 'text-lux-teal' : 'text-white group-hover:text-lux-teal'}`}>
                        {item.label}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.nav>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }} className="px-8 pb-10 sm:px-12">
              <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">Samarinda, Kalimantan Timur</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

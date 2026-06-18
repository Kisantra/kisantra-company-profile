import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { Contact } from '../components/Contact';

interface Attachment {
  name: string;
  url: string | null;
  description?: string | null;
}

interface Announcement {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  featured_image?: string | null;
  content: string;
  is_pinned: boolean;
  published_at: string | null;
  attachments: Attachment[];
}

interface RelatedAnnouncement {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  featured_image?: string | null;
  published_at: string | null;
}

interface PengumumanDetailProps {
  announcement: Announcement;
  related_announcements?: RelatedAnnouncement[];
}

const formatDate = (date: string | null) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(date));
};

const readingTime = (html: string) => {
  const words = html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

// --- Reading progress bar ---
const ProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-lux-teal" />;
};

// --- Share controls ---
const ShareBar: React.FC<{ title: string }> = ({ title }) => {
  const [copied, setCopied] = React.useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const enc = encodeURIComponent(url);
  const encTitle = encodeURIComponent(title);

  const copy = () => {
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const linkClass =
    'flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-lux-black transition-all duration-300 hover:border-lux-teal hover:bg-lux-teal hover:text-white';

  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">Bagikan</span>
      <div className="flex items-center gap-2">
        <button onClick={copy} className={linkClass} title={copied ? 'Tersalin!' : 'Salin tautan'} aria-label="Salin tautan">
          {copied ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
          )}
        </button>
        <a href={`https://wa.me/?text=${encTitle}%20${enc}`} target="_blank" rel="noreferrer" className={linkClass} aria-label="WhatsApp">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
        </a>
        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc}`} target="_blank" rel="noreferrer" className={linkClass} aria-label="LinkedIn">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
        </a>
      </div>
    </div>
  );
};

const AttachmentRow: React.FC<{ file: Attachment }> = ({ file }) => (
  <a
    href={file.url ?? '#'}
    target="_blank"
    rel="noreferrer"
    download
    className="group flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-4 transition-all duration-300 hover:border-lux-teal/60 hover:shadow-[0_16px_40px_-20px_rgba(10,10,10,0.18)]"
  >
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lux-teal/10 text-lux-teal-dark">
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    </span>
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-bold text-lux-black group-hover:text-lux-teal">{file.name}</p>
      {file.description && <p className="truncate text-xs text-neutral-500">{file.description}</p>}
    </div>
    <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-400 group-hover:text-lux-teal">
      Unduh
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    </span>
  </a>
);

// --- Sidebar ---
const Sidebar: React.FC<{ related: RelatedAnnouncement[] }> = ({ related }) => (
  <aside className="space-y-8 lg:sticky lg:top-32">
    {related.length > 0 && (
      <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-6 md:p-8">
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-lux-teal">Baca Juga</span>
        <h3 className="mb-6 text-2xl font-bold tracking-tight text-lux-black">Pengumuman Lainnya</h3>
        <div className="flex flex-col gap-6">
          {related.map((item) => (
            <Link key={item.id} href={`/pengumuman/${item.slug}`} className="group flex items-start gap-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-200">
                {item.featured_image ? (
                  <img src={item.featured_image} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-100 to-lux-teal/10">
                    <svg className="h-5 w-5 text-lux-teal/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h4 className="line-clamp-2 text-sm font-bold leading-tight text-lux-black transition-colors group-hover:text-lux-teal">
                  {item.title}
                </h4>
                <span className="mt-1 block font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                  {formatDate(item.published_at)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )}

    {/* Contact CTA */}
    <div className="relative overflow-hidden rounded-2xl bg-lux-black p-6 text-white md:p-8">
      <div className="absolute right-0 top-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full bg-lux-teal/20 blur-3xl" />
      <h4 className="relative z-10 mb-2 text-lg font-bold">Ada pertanyaan?</h4>
      <p className="relative z-10 mb-6 text-sm leading-relaxed text-neutral-400">
        Tim kami siap membantu Anda. Hubungi Kisantra Consult untuk informasi lebih lanjut.
      </p>
      <Link
        href="/kontak"
        className="relative z-10 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-lux-teal py-3 text-xs font-bold uppercase tracking-widest text-lux-black transition-colors hover:bg-lux-teal-light"
      >
        Hubungi Kami
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
      </Link>
    </div>
  </aside>
);

const PengumumanDetail: React.FC<PengumumanDetailProps> = ({ announcement, related_announcements = [] }) => {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 160]);
  const heroFade = useTransform(scrollY, [0, 400], [1, 0]);
  const hasImage = Boolean(announcement.featured_image);

  return (
    <>
      <Head>
        <title>{announcement.title}</title>
        <meta name="description" content={announcement.excerpt ?? announcement.title} />
        <meta property="og:title" content={announcement.title} />
        <meta property="og:type" content="article" />
        {announcement.featured_image && <meta property="og:image" content={announcement.featured_image} />}
      </Head>

      <ProgressBar />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-lux-white text-lux-black selection:bg-lux-teal selection:text-white"
      >
        <Navbar />

        {/* --- Immersive Hero --- */}
        <header className="relative h-[62vh] min-h-[460px] w-full overflow-hidden bg-lux-black md:h-[74vh]">
          {hasImage ? (
            <motion.div style={{ y: heroY }} className="absolute inset-0">
              <img src={announcement.featured_image!} alt={announcement.title} className="h-full w-full object-cover opacity-60" loading="eager" />
              <div className="absolute inset-0 bg-gradient-to-t from-lux-black via-lux-black/40 to-lux-black/30" />
            </motion.div>
          ) : (
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-lux-black via-neutral-900 to-lux-teal-dark/40" />
              <div className="absolute inset-0 bg-grain opacity-[0.08] mix-blend-screen" />
            </div>
          )}

          <motion.div style={{ opacity: heroFade }} className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-[1400px] px-6 pb-14 md:px-12 md:pb-20">
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-white/80">
                <Link href="/pengumuman" className="transition-colors hover:text-lux-teal">Pengumuman</Link>
                {announcement.is_pinned && (
                  <>
                    <span className="text-lux-teal">•</span>
                    <span className="inline-flex items-center gap-1.5 text-lux-teal">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><path d="M6 2a1 1 0 00-1 1v18l7-5 7 5V3a1 1 0 00-1-1H6z" /></svg>
                      Disematkan
                    </span>
                  </>
                )}
              </div>

              <h1 className="mt-5 max-w-4xl font-serif text-4xl font-black leading-[1.05] tracking-tight text-white drop-shadow-2xl md:text-6xl lg:text-7xl">
                {announcement.title}
              </h1>

              <div className="mt-6 flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-white/70">
                <span>{formatDate(announcement.published_at)}</span>
                <span className="h-1 w-1 rounded-full bg-white/40" />
                <span>{readingTime(announcement.content)} menit baca</span>
              </div>
            </div>
          </motion.div>
        </header>

        {/* --- Body (wide, article-style grid) --- */}
        <main className="relative z-10 -mt-12 rounded-t-[3rem] bg-lux-white pb-24 pt-16 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:pt-24">
          <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 md:px-12 lg:grid-cols-12 lg:gap-20">
            {/* Main content */}
            <div className="col-span-1 lg:col-span-8">
              {announcement.excerpt && (
                <p className="mb-10 font-serif text-2xl leading-snug text-lux-black md:text-3xl first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-6xl first-letter:font-black first-letter:text-lux-teal">
                  {announcement.excerpt}
                </p>
              )}

              <article
                className="max-w-none text-lg leading-relaxed text-neutral-600
                  [&_p]:mb-5 [&_p]:leading-relaxed
                  [&_strong]:font-bold [&_strong]:text-lux-black
                  [&_a]:font-bold [&_a]:text-lux-teal [&_a:hover]:underline
                  [&_p>a:only-child]:mt-3 [&_p>a:only-child]:inline-flex [&_p>a:only-child]:items-center [&_p>a:only-child]:gap-2 [&_p>a:only-child]:rounded-full [&_p>a:only-child]:bg-lux-black [&_p>a:only-child]:px-8 [&_p>a:only-child]:py-4 [&_p>a:only-child]:text-xs [&_p>a:only-child]:font-bold [&_p>a:only-child]:uppercase [&_p>a:only-child]:tracking-[0.15em] [&_p>a:only-child]:text-white [&_p>a:only-child]:no-underline [&_p>a:only-child]:shadow-lg [&_p>a:only-child]:shadow-lux-black/10 [&_p>a:only-child]:transition-all [&_p>a:only-child]:duration-300 hover:[&_p>a:only-child]:bg-lux-teal hover:[&_p>a:only-child]:text-lux-black hover:[&_p>a:only-child]:no-underline hover:[&_p>a:only-child]:-translate-y-0.5 hover:[&_p>a:only-child]:shadow-xl
                  [&_ul]:my-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6
                  [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6
                  [&_li]:pl-1 [&_li]:marker:text-lux-teal
                  [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-lux-black md:[&_h2]:text-3xl
                  [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-lux-black
                  [&_blockquote]:my-6 [&_blockquote]:rounded-r-xl [&_blockquote]:border-l-4 [&_blockquote]:border-lux-teal [&_blockquote]:bg-neutral-50 [&_blockquote]:px-6 [&_blockquote]:py-4 [&_blockquote]:font-serif [&_blockquote]:text-lux-black/80
                  [&_img]:my-6 [&_img]:w-full [&_img]:rounded-2xl [&_img]:shadow-lg"
                dangerouslySetInnerHTML={{ __html: announcement.content }}
              />

              {/* Attachments */}
              {announcement.attachments.length > 0 && (
                <section className="mt-12 rounded-3xl border border-neutral-200 bg-neutral-50/60 p-6 md:p-8">
                  <h2 className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-lux-teal">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    Lampiran ({announcement.attachments.length})
                  </h2>
                  <div className="flex flex-col gap-3">
                    {announcement.attachments.map((file, i) => (
                      <AttachmentRow key={i} file={file} />
                    ))}
                  </div>
                </section>
              )}

              {/* Footer: share + back */}
              <div className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-neutral-200 pt-8 sm:flex-row sm:items-center">
                <ShareBar title={announcement.title} />
                <Link
                  href="/pengumuman"
                  className="inline-flex items-center gap-2 rounded-full bg-lux-black px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-lux-teal"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                  Kembali ke Pengumuman
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-span-1 lg:col-span-4">
              <Sidebar related={related_announcements} />
            </div>
          </div>
        </main>

        <Contact />
      </motion.div>
    </>
  );
};

export default PengumumanDetail;

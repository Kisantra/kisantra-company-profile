import React, { useEffect, useRef, useState } from 'react';
import ReactGA from 'react-ga4';

// "Film filosofi": the philosophy statement, proven by the company profile
// video. A chapter bar under the player follows playback and lets visitors
// jump to any of the video's 10 chapters. The video repeats this section's
// wording (chapter 02) and values (chapter 08), so it lives here rather than
// as a separate block.

const VIDEO_SRC = '/video/kisantra-profil.mp4';
const POSTER_SRC = '/video/kisantra-profil-poster.jpg';
const VIDEO_SECONDS = 43;
const WA_LINK =
  'https://wa.me/6281180009787?text=' +
  encodeURIComponent('Halo Kisantra, saya sudah menonton video profil dan ingin konsultasi.');

// Start times (s) measured from the slide changes in kisantra-profil.mp4.
// Update these if the video is re-edited.
const CHAPTERS = [
  { title: 'Pembuka', start: 0 },
  { title: 'Filosofi', start: 3 },
  { title: 'Sinergi Strategis', start: 8.25 },
  { title: 'Layanan', start: 11.25 },
  { title: 'Dalam Angka', start: 20.5 },
  { title: 'Sektor', start: 22.5 },
  { title: 'Wilayah', start: 27 },
  { title: 'Nilai Kami', start: 31.5 },
  { title: 'Kontak', start: 34.25 },
  { title: 'Sampai Jumpa', start: 37.25 },
];
const FALLBACK_DURATION = 42.88;

const VALUES = [
  { title: 'Transparansi', desc: 'Kejujuran data adalah fondasi dari setiap strategi yang kami buat.' },
  { title: 'Presisi', desc: 'Detail kecil menciptakan dampak besar dalam perpajakan dan keuangan.' },
  { title: 'Adaptabilitas', desc: 'Dunia digital berubah cepat; kami memastikan Anda tetap relevan.' },
];

type Status = 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error';

const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const formatDuration = (s: number) => formatTime(Math.round(s));

const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path d="M8 5.5v13a1 1 0 0 0 1.52.85l10.4-6.5a1 1 0 0 0 0-1.7L9.52 4.65A1 1 0 0 0 8 5.5z" fill="currentColor" />
  </svg>
);

export const Philosophy: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(FALLBACK_DURATION);
  const started = status === 'loading' || status === 'playing' || status === 'paused';

  const chapterEnd = (i: number) => (i + 1 < CHAPTERS.length ? CHAPTERS[i + 1].start : duration);
  const current = CHAPTERS.reduce((acc, c, i) => (time >= c.start ? i : acc), 0);

  const playFrom = (seconds?: number) => {
    const video = videoRef.current;
    if (!video) return;
    if (seconds !== undefined) {
      video.currentTime = seconds;
      setTime(seconds);
    } else if (status === 'ended') {
      video.currentTime = 0;
      setTime(0);
    }
    setStatus('loading');
    video
      .play()
      .then(() => video.focus({ preventScroll: true }))
      .catch(() => setStatus('paused'));
  };

  // Pause once the player is mostly out of view so audio never keeps running
  // for a section the visitor has left.
  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && !video.paused) video.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} aria-labelledby="filosofi-title" className="bg-lux-white px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-10 grid gap-6 lg:mb-12 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:gap-16">
          <h2
            id="filosofi-title"
            className="text-[clamp(2rem,4.4vw,4rem)] font-extrabold leading-[1.08] tracking-[-0.04em] text-lux-black"
          >
            Bisnis bukan sekadar transaksi, melainkan <span className="text-lux-teal-dark">arsitektur kepercayaan.</span>
          </h2>
          <p className="max-w-lg text-base leading-relaxed text-neutral-600 md:text-lg lg:pb-2">
            <strong className="font-bold text-lux-black">Lihat cara kami bekerja dalam {VIDEO_SECONDS} detik.</strong> Dari layanan,
            sektor yang kami tangani, sampai wilayah kerja kami di Kalimantan dan Jawa.
          </p>
        </div>

        {/* Player */}
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-lux-black ring-1 ring-neutral-200 md:rounded-3xl">
          <video
            ref={videoRef}
            className="h-full w-full object-cover focus-visible:outline-none"
            src={VIDEO_SRC}
            poster={POSTER_SRC}
            preload="metadata"
            playsInline
            controls={started}
            aria-label="Video profil Kisantra Consult"
            onLoadedMetadata={(e) => {
              if (Number.isFinite(e.currentTarget.duration)) setDuration(e.currentTarget.duration);
            }}
            onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
            onSeeked={(e) => setTime(e.currentTarget.currentTime)}
            onWaiting={() => setStatus((s) => (s === 'playing' ? 'loading' : s))}
            onPlaying={() => {
              setStatus('playing');
              ReactGA.event({ category: 'Video', action: 'play', label: 'Profil Kisantra' });
            }}
            onPause={(e) => {
              if (!e.currentTarget.ended) setStatus((s) => (s === 'idle' ? s : 'paused'));
            }}
            onEnded={() => {
              setStatus('ended');
              setTime(duration);
              ReactGA.event({ category: 'Video', action: 'complete', label: 'Profil Kisantra' });
            }}
            onError={() => setStatus('error')}
          />

          {status === 'idle' && (
            // The poster's left panel is empty between "01" and "Pajak.", so
            // the control sits there instead of over the slide's text.
            <button
              type="button"
              onClick={() => playFrom()}
              aria-label={`Putar video profil Kisantra, ${VIDEO_SECONDS} detik`}
              className="group absolute left-[5%] top-[42%] flex items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-lux-teal focus-visible:ring-offset-2 md:left-[3.5%] md:top-[44%] md:bg-lux-white/95 md:py-2 md:pl-2 md:pr-5"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-teal-300 text-lux-black transition-transform duration-300 group-hover:scale-105 md:h-14 md:w-14 lg:h-16 lg:w-16">
                <PlayIcon className="ml-0.5 h-5 w-5 md:h-6 md:w-6" />
              </span>
              <span className="hidden text-left md:block">
                <span className="block text-sm font-bold text-lux-black lg:text-base">Putar video</span>
                <span className="block text-xs text-neutral-600 lg:text-sm">{formatDuration(duration)}</span>
              </span>
            </button>
          )}

          {status === 'loading' && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center" role="status">
              <span className="h-12 w-12 rounded-full border-4 border-white/30 border-t-white motion-safe:animate-spin" aria-hidden="true" />
              <span className="sr-only">Memuat video</span>
            </div>
          )}

          {status === 'ended' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-lux-white/95 px-6 text-center">
              <p className="text-xl font-extrabold tracking-[-0.03em] text-lux-black md:text-3xl">Siap membereskan urusan bisnis Anda?</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-lux-black px-6 text-sm font-bold text-white transition-colors hover:bg-lux-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-teal focus-visible:ring-offset-2"
                >
                  Konsultasi gratis via WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => playFrom(0)}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-neutral-300 px-6 text-sm font-bold text-lux-black transition-colors hover:border-lux-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-teal"
                >
                  <PlayIcon className="h-4 w-4" />
                  Putar ulang
                </button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-lux-black/90 px-6 text-center" role="alert">
              <p className="text-lg font-bold text-white">Video tidak dapat diputar.</p>
              <p className="max-w-sm text-sm text-white/75">Periksa koneksi lalu muat ulang halaman, atau buka videonya langsung.</p>
              <a
                href={VIDEO_SRC}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 text-sm font-bold text-teal-300 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Buka video
              </a>
            </div>
          )}
        </div>

        {/* Chapter bar: segment widths follow chapter length. */}
        <div className="mt-5" aria-hidden="true">
          <div className="flex h-1.5 gap-[3px]">
            {CHAPTERS.map((c, i) => {
              const end = chapterEnd(i);
              const fill = Math.min(1, Math.max(0, (time - c.start) / (end - c.start)));
              return (
                <span
                  key={c.title}
                  onClick={() => playFrom(c.start)}
                  className="relative block cursor-pointer overflow-hidden rounded-full bg-neutral-200"
                  style={{ flex: end - c.start }}
                >
                  <span className="absolute inset-y-0 left-0 bg-lux-teal-dark" style={{ width: `${fill * 100}%` }} />
                </span>
              );
            })}
          </div>
        </div>

        <ol className="mt-4 grid grid-cols-2 gap-x-6 sm:grid-cols-3 lg:grid-cols-5" aria-label="Bab video">
          {CHAPTERS.map((c, i) => {
            const on = (status !== 'idle' || time > 0) && i === current;
            return (
              <li key={c.title}>
                <button
                  type="button"
                  onClick={() => playFrom(c.start)}
                  aria-current={on ? 'true' : undefined}
                  aria-label={`Putar bab ${c.title}, mulai ${formatTime(c.start)}`}
                  className={`flex min-h-[44px] w-full items-center gap-3 rounded-md text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-teal ${
                    on ? 'font-bold text-lux-black' : 'text-neutral-600 hover:text-lux-black'
                  }`}
                >
                  <span className={`w-9 shrink-0 tabular-nums ${on ? 'text-lux-teal-dark' : 'text-neutral-500'}`}>{formatTime(c.start)}</span>
                  {c.title}
                </button>
              </li>
            );
          })}
        </ol>

        <div className="mt-14 grid gap-8 border-t border-neutral-200 pt-10 md:mt-16 md:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.title}>
              <h3 className="text-xl font-bold text-lux-black">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

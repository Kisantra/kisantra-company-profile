import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, useInView, useSpring, AnimatePresence } from 'framer-motion';
import { Head } from '@inertiajs/react';
import { Navbar } from '../components/Navbar';
import { Contact } from '../components/Contact';
import { Portfolio } from '../components/Portfolio';
import { geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';

const stats = [
  { label: 'Proyek Selesai', value: '500+' },
  { label: 'Klien Korporasi', value: '150+' },
  { label: 'Wilayah Layanan', value: 'Global' },
];

// Using jsDelivr for better reliability and CORS support
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

const locations = [
  {
    id: 'samarinda',
    name: 'Samarinda',
    role: 'Headquarters',
    desc: 'Pusat operasional utama. Fokus pada sektor pertambangan & konstruksi.',
    coordinates: [117.1536, -0.5022] as [number, number],
  },
  {
    id: 'jakarta',
    name: 'Jakarta',
    role: 'Representative Office',
    desc: 'Hubungan investor & klien korporasi multinasional.',
    coordinates: [106.8456, -6.2088] as [number, number],
  },
  {
    id: 'surabaya',
    name: 'Surabaya',
    role: 'Commercial Hub',
    desc: 'Pusat perdagangan strategis dan gerbang logistik wilayah Timur Indonesia.',
    coordinates: [112.7521, -7.2575] as [number, number],
  },
  {
    id: 'balikpapan',
    name: 'Balikpapan',
    role: 'Industrial Hub',
    desc: 'Gerbang utama industri migas dan logistik alat berat Kalimantan Timur.',
    coordinates: [116.8312, -1.2379] as [number, number],
  },
  {
    id: 'banjarmasin',
    name: 'Banjarmasin',
    role: 'Trading Branch',
    desc: 'Sentra perdagangan komoditas dan transportasi logistik sungai.',
    coordinates: [114.5901, -3.3186] as [number, number],
  },
  {
    id: 'sukabumi',
    name: 'Sukabumi',
    role: 'Operational Unit',
    desc: 'Dukungan operasional untuk manufaktur dan agribisnis Jawa Barat.',
    coordinates: [106.9279, -6.9215] as [number, number],
  }
];

const clientLogos = [
  { name: "34", image: "/image/Home/Client/34.png" },
  { name: "Barakka", image: "/image/Home/Client/Barakka.png" },
  { name: "CV Dahana", image: "/image/Home/Client/CV DAHANA.png" },
  { name: "Etam Post", image: "/image/Home/Client/Etam Post.png" },
  { name: "JSM", image: "/image/Home/Client/JSM@4x.png" },
  { name: "LC", image: "/image/Home/Client/LC.png" },
  { name: "PT Nawa", image: "/image/Home/Client/logo-pt-nawa.png" },
  { name: "LSP", image: "/image/Home/Client/LSP.png" },
  { name: "MBM", image: "/image/Home/Client/MBM.png" },
  { name: "Persiba", image: "/image/Home/Client/PERSIBA.png" },
  { name: "Playmaker", image: "/image/Home/Client/Playmaker.png" },
  { name: "RSMM", image: "/image/Home/Client/RSMM.png" },
  { name: "SB", image: "/image/Home/Client/SB.png" },
];

const pillars = [
  {
    title: "Integritas Lokal",
    desc: "Berakar kuat di Samarinda, kami memahami seluk-beluk ekonomi Kalimantan Timur lebih dari siapapun.",
    speed: 0.1,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  {
    title: "Standar Global",
    desc: "Metodologi kami mengacu pada standar internasional untuk memastikan bisnis Anda siap bersaing di kancah global.",
    speed: 0.2,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    )
  },
  {
    title: "Sinergi Digital",
    desc: "Pajak dan Keuangan tidak lagi terpisah dari teknologi. Kami menyatukan ketiganya dalam satu ekosistem.",
    speed: 0.15,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  }
];

// Highlighter Component for Vision Text
const Highlight = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.span
      className="relative inline-block z-0"
    >
      <motion.span
        variants={{
          rest: { clipPath: "inset(0 100% 0 0)" },
          hover: { clipPath: "inset(0 0% 0 0)" }
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="absolute inset-0 bg-lux-teal/20 -z-10 -skew-x-6 transform scale-y-90 rounded-sm"
      />
      <span className="relative z-10">{children}</span>
    </motion.span>
  );
};

export const AboutSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const narrativeRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  const [geographies, setGeographies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const narrativeScroll = useScroll({
    target: narrativeRef,
    offset: ["start 80%", "end 20%"]
  });

  const springConfig = { damping: 30, stiffness: 100 };
  const smoothProgress = useSpring(scrollYProgress, springConfig);

  const imageY = useTransform(smoothProgress, [0, 1], [0, -150]);
  const bgTextX = useTransform(smoothProgress, [0, 1], ["5%", "-20%"]);
  const bgTextX2 = useTransform(smoothProgress, [0, 1], ["-20%", "5%"]);

  // Dynamic Pattern Animation Transforms
  const patternRotate = useTransform(smoothProgress, [0, 1], [0, 60]);
  const patternY = useTransform(smoothProgress, [0, 1], [-30, 30]);

  // Other Pattern Parallax
  const dotY = useTransform(smoothProgress, [0, 1], [0, -50]);
  const topoY = useTransform(smoothProgress, [0, 1], [0, 30]);

  // Scrubbing effect for text
  const textOpacity = useTransform(narrativeScroll.scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);
  const textScale = useTransform(narrativeScroll.scrollYProgress, [0, 0.5, 1], [0.98, 1, 0.98]);

  // Map Data Fetching
  useEffect(() => {
    setIsLoading(true);
    fetch(geoUrl)
      .then(res => res.json())
      .then(data => {
        // Use World Atlas 50m - ID 360 is Indonesia
        const countries = (feature(data, data.objects.countries) as any).features;
        const indonesia = countries.filter((d: any) => d.id === "360" || d.id === 360);

        if (indonesia.length > 0) {
          setGeographies(indonesia);
        } else {
          console.warn("Indonesia feature not found in map data");
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error loading map data:", err);
        setIsLoading(false);
      });
  }, []);

  // Map Projection Setup
  const projection = useMemo(() => {
    // Mercator projection centered on Indonesia
    return geoMercator()
      .center([118, -2.5]) // Centered
      .scale(800) // Zoomed out to show entire archipelago (Aceh to Papua)
      .translate([400, 200]); // Center in 800x400 viewBox
  }, []);

  const pathGenerator = useMemo(() => geoPath().projection(projection), [projection]);

  return (
    <section ref={containerRef} id="about" className="relative bg-lux-white w-full py-32 md:py-64 overflow-clip">

      {/* --- SECTION PATTERNS --- */}

      {/* 1. Hero Area: Dynamic Geometric Pattern (Replacing Grid) */}
      <motion.div
        style={{ rotate: patternRotate, y: patternY }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.04, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute -top-[10%] -right-[15%] w-[800px] h-[800px] md:w-[1200px] md:h-[1200px] pointer-events-none z-0"
      >
        <svg viewBox="0 0 1000 1000" className="w-full h-full text-lux-black overflow-visible">
          {/* Concentric Geometric Rings */}
          <circle cx="500" cy="500" r="250" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="500" cy="500" r="350" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="12 12" />
          <circle cx="500" cy="500" r="450" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />

          {/* Decorative Orbiting Elements */}
          <circle cx="500" cy="150" r="8" fill="currentColor" />
          <circle cx="850" cy="500" r="15" fill="none" stroke="currentColor" strokeWidth="2" />

          {/* Structural Lines */}
          <line x1="500" y1="200" x2="500" y2="800" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.5" />
          <line x1="200" y1="500" x2="800" y2="500" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.5" />

          {/* Outer Arc */}
          <path d="M 200 500 A 300 300 0 0 1 800 500" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="20 20" opacity="0.4" />
        </svg>
      </motion.div>

      {/* Subtle Radial Gradient for Depth (Retained from previous design) */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-lux-teal/5 rounded-full blur-[120px] mix-blend-multiply translate-x-1/2 -translate-y-1/2 pointer-events-none" />


      {/* 2. Middle Area: Dot Matrix (Vision/Mission) */}
      <motion.div
        style={{ y: dotY }}
        className="absolute top-[30%] left-0 w-full h-[30%] pointer-events-none z-0 overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(#14b8a6 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)'
          }}
        />
      </motion.div>

      {/* 3. Bottom Area: Topographic Contours (Map/Pillars) */}
      <motion.div
        style={{ y: topoY }}
        className="absolute bottom-0 left-0 w-full h-[40%] pointer-events-none z-0 overflow-hidden opacity-[0.03]"
      >
        <svg className="w-full h-full text-lux-black" preserveAspectRatio="none">
          <defs>
            <pattern id="topo-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <path d="M0 100 C 50 0 80 0 100 0 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          {/* Using a repeating SVG background image for reliable scaling */}
          <rect width="100%" height="100%" fill="url(#topo-pattern)" />
        </svg>
        <div className="absolute inset-0" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'20\' viewBox=\'0 0 100 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.735-5.197-1.575-8.209-2.737-9.846-3.796-16.733-5.59-25.395-5.59-8.736 0-14.773 1.543-23.754 4.542-.713.238-1.424.478-2.13.716l-3.238.969h-.615z\' fill=\'%23000000\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
          backgroundSize: '200px 40px',
          opacity: 0.5
        }} />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-lux-teal-dark/5 rounded-full blur-[100px] mix-blend-multiply -translate-x-1/3 translate-y-1/3" />
      </motion.div>

      {/* --- TEXTUAL BACKGROUND ELEMENTS --- */}

      {/* 1. Top Scrolling Text */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none select-none overflow-hidden opacity-[0.02] z-0">
        <motion.span
          style={{ x: bgTextX }}
          className="absolute top-20 left-0 text-[25vw] font-black whitespace-nowrap tracking-tighter will-change-transform"
        >
          STRATEGY • INTEGRITY • GROWTH
        </motion.span>
      </div>

      {/* 2. Bottom Scrolling Text (Reverse) */}
      <div className="absolute bottom-0 left-0 w-full h-full pointer-events-none select-none overflow-hidden opacity-[0.02] z-0">
        <motion.span
          style={{ x: bgTextX2 }}
          className="absolute bottom-40 right-0 text-[18vw] font-black whitespace-nowrap tracking-tighter will-change-transform"
        >
          PRECISION • COMPLIANCE • SCALE
        </motion.span>
      </div>


      {/* --- CONTENT LAYERS --- */}

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">

        {/* Hero Editorial Block */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-56">
          <div className="lg:col-span-7 relative z-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-4 mb-10">
                <motion.span
                  initial={{ width: 0 }}
                  animate={isInView ? { width: 40 } : {}}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-[1px] bg-lux-teal"
                ></motion.span>
                <span className="font-bold text-xs uppercase tracking-[0.4em] text-lux-teal">
                  The Essence of Kisantra
                </span>
              </div>
              <h2 className="font-bold text-6xl md:text-8xl lg:text-9xl leading-[0.8] tracking-tighter text-lux-black mb-12">
                Membangun <br />
                <span className="font-serif italic font-normal text-lux-teal-dark">Legasi</span> <br />
                Kredibilitas.
              </h2>

              {/* Portfolio Download Button */}
              <motion.a
                href="/files/Company Profile_.pdf"
                target="_blank"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.6 }}
                className="group flex items-center gap-6 mt-12 cursor-pointer w-fit"
              >
                <div className="relative w-16 h-16 rounded-full border border-neutral-200 flex items-center justify-center overflow-hidden group-hover:border-lux-teal transition-colors duration-500 bg-white">
                  <div className="absolute inset-0 bg-lux-teal translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.22,1,0.36,1]" />
                  <svg className="w-6 h-6 text-lux-black relative z-10 group-hover:text-white transition-colors duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm uppercase tracking-[0.2em] text-lux-black group-hover:text-lux-teal transition-colors duration-300">Unduh Portofolio</span>
                  <span className="font-serif italic text-neutral-400 text-sm">Company Profile 2025</span>
                </div>
              </motion.a>
            </motion.div>
          </div>

          <motion.div
            style={{ y: imageY }}
            className="lg:col-span-5 relative lg:translate-y-24"
          >
            <motion.div
              initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
              animate={isInView ? { clipPath: 'inset(0% 0% 0% 0%)' } : {}}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-3xl"
            >
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop"
                alt="Sophisticated Office Space"
                className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-1000 scale-110"
              />
              <div className="absolute inset-0 bg-lux-black/10 mix-blend-multiply" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 1 }}
              className="absolute -bottom-8 -left-8 md:-left-16 bg-lux-black text-white p-12 rounded-2xl hidden md:block max-w-[300px] shadow-2xl"
            >
              <p className="font-serif text-2xl italic leading-tight text-lux-teal-light">
                "Kami melampaui angka untuk menemukan jiwa dalam setiap strategi."
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Narrative Scrubbing Section */}
        <div ref={narrativeRef} className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-32 items-center">
          <div className="lg:col-span-2 hidden lg:block" />
          <motion.div
            style={{ opacity: textOpacity, scale: textScale }}
            className="lg:col-span-9"
          >
            <p className="text-3xl md:text-5xl lg:text-6xl text-lux-black font-light leading-[1.1] tracking-tight mb-16">
              Lahir di Samarinda, <span className="text-lux-teal font-bold">Kisantra Consult</span> mendefinisikan ulang peran penasihat bisnis. Kami percaya bahwa setiap entitas memiliki potensi unik yang memerlukan <span className="italic font-serif">precision-engineered strategy</span> untuk berkembang di lanskap ekonomi yang dinamis.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-16 border-y border-neutral-100">
              {stats.map((stat, i) => (
                <div key={i} className="group cursor-default">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 + 0.5 }}
                    className="text-5xl font-bold text-lux-black mb-3 group-hover:text-lux-teal transition-colors tracking-tighter"
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-bold">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Redesigned Vision & Mission Section */}
        <div className="mb-48 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-0 border-t border-neutral-100">

            {/* Left: The Vision - Sticky Manifesto with Highlight Interaction */}
            <div className="lg:col-span-5 pt-24 lg:pr-16 relative">
              <motion.div
                initial="rest"
                whileHover="hover"
                animate="rest"
                className="sticky top-32 cursor-default"
              >
                <div className="flex items-center gap-4 mb-8">
                  <motion.span
                    initial={{ width: 0 }}
                    whileInView={{ width: 60 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-[2px] bg-lux-teal"
                  />
                  <h5 className="font-bold text-xs uppercase tracking-[0.4em] text-lux-black">Visi Utama</h5>
                </div>

                <h3 className="font-extrabold text-6xl md:text-7xl lg:text-8xl leading-[0.9] text-lux-black mb-10 tracking-tighter">
                  Future <br />
                  <span className="font-serif italic font-normal text-lux-teal">Forward.</span>
                </h3>

                <div className="relative pl-8 border-l border-neutral-200">
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: "100%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="absolute left-[-1px] top-0 w-[2px] bg-lux-teal"
                  />
                  <p className="text-lg md:text-xl text-neutral-500 font-medium leading-relaxed">
                    "Menjadi perusahaan jasa yang <Highlight>transparan, tepercaya, dan dapat diandalkan</Highlight> dalam memberikan solusi <Highlight>perpajakan</Highlight>, <Highlight>perizinan</Highlight>, <Highlight>keuangan</Highlight>, serta <Highlight>digital marketing</Highlight>."
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right: The Mission - Dynamic Offset Layout with Circular Element */}
            <div className="lg:col-span-7 pt-24 lg:pl-16 lg:border-l border-neutral-100 relative">

              {/* Decorative Rotating Badge - Positioned to create visual tension */}
              <motion.div
                className="absolute -right-12 top-0 lg:right-0 lg:top-24 opacity-20 lg:opacity-100 pointer-events-none z-0"
                style={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <svg width="200" height="200" viewBox="0 0 200 200">
                  <defs>
                    <path id="circlePath" d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0" />
                  </defs>
                  <text fill="#0a0a0a" fontSize="12" fontWeight="bold" letterSpacing="4px" className="uppercase font-sans">
                    <textPath href="#circlePath" startOffset="0%">
                      • Misi Strategis • Kisantra Consult • Misi Strategis • Kisantra Consult
                    </textPath>
                  </text>
                  <circle cx="100" cy="100" r="4" fill="#14b8a6" />
                </svg>
              </motion.div>

              {/* Mission Cards - Stacked Layout */}
              <div className="flex flex-col gap-12 relative z-10 mt-12 lg:mt-32">

                {/* Item 1 - Left Aligned */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="bg-white p-8 rounded-[2rem] shadow-sm border border-neutral-100 hover:border-lux-teal/30 hover:shadow-xl transition-all duration-500 lg:w-[80%]"
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="w-10 h-10 rounded-full bg-lux-black text-white flex items-center justify-center font-bold text-sm">01</span>
                    <div className="w-2 h-2 rounded-full bg-lux-teal" />
                  </div>
                  <h4 className="text-3xl font-sans font-bold text-lux-black mb-4">Perpajakan & Perizinan</h4>
                  <p className="text-neutral-500 text-sm leading-relaxed">
                    Memberikan solusi kepatuhan pajak yang presisi dan pendampingan perizinan usaha untuk meminimalisir risiko serta mengoptimalkan kewajiban fiskal bisnis Anda.
                  </p>
                </motion.div>

                {/* Item 2 - Right Offset */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="bg-lux-black text-white p-8 rounded-[2rem] shadow-xl shadow-lux-black/10 transition-all duration-500 lg:w-[80%] self-end"
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="w-10 h-10 rounded-full bg-white text-lux-black flex items-center justify-center font-bold text-sm">02</span>
                    <div className="w-2 h-2 rounded-full bg-lux-teal" />
                  </div>
                  <h4 className="text-3xl font-sans font-bold text-white mb-4">Manajemen Keuangan</h4>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    Menyediakan layanan pengelolaan keuangan profesional meliputi pembukuan, laporan keuangan standar PSAK, dan analisis arus kas untuk pengambilan keputusan strategis.
                  </p>
                </motion.div>

                {/* Item 3 - Left Aligned */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="bg-white p-8 rounded-[2rem] shadow-sm border border-neutral-100 hover:border-lux-teal/30 hover:shadow-xl transition-all duration-500 lg:w-[80%]"
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="w-10 h-10 rounded-full bg-lux-black text-white flex items-center justify-center font-bold text-sm">03</span>
                    <div className="w-2 h-2 rounded-full bg-lux-teal" />
                  </div>
                  <h4 className="text-3xl font-sans font-bold text-lux-black mb-4">Transformasi Digital</h4>
                  <p className="text-neutral-500 text-sm leading-relaxed">
                    Mengakselerasi pertumbuhan bisnis melalui strategi digital marketing berbasis data dan pengembangan sistem teknologi terintegrasi untuk efisiensi operasional.
                  </p>
                </motion.div>

              </div>
            </div>
          </div>
        </div>

        {/* Custom D3 Interactive Indonesia Map Section */}
        <div className="mb-64 relative">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 px-4">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-[0.4em] text-lux-teal mb-4 block">Jangkauan & Konektivitas</span>
              <h3 className="font-bold text-4xl md:text-5xl leading-tight text-lux-black tracking-tight">
                Dari Samarinda, <br />Melayani <span className="text-lux-teal">Indonesia.</span>
              </h3>
            </div>
            <p className="text-neutral-500 max-w-sm text-sm font-medium leading-relaxed mt-6 md:mt-0">
              Jaringan strategis kami memastikan setiap klien, dimanapun berada, mendapatkan standar layanan premium yang sama.
            </p>
          </div>

          <div className="w-full aspect-[2/1] bg-neutral-50 rounded-[2rem] border border-neutral-100 relative overflow-hidden group shadow-inner">

            {/* Map Container */}
            <div className="absolute inset-0 flex items-center justify-center">
              {isLoading ? (
                <div className="flex items-center gap-4 text-neutral-400">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-xs uppercase tracking-widest font-sans">Memuat Peta...</span>
                </div>
              ) : (
                <svg viewBox="0 0 800 400" className="w-full h-full" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.05))' }}>
                  {/* Render Geographies */}
                  <g className="transition-opacity duration-1000">
                    {geographies.map((geo, i) => {
                      const d = pathGenerator(geo);
                      return (
                        <path
                          key={`path-${i}`}
                          d={d || ""}
                          fill="#d4d4d4"
                          stroke="#fafafa"
                          strokeWidth="0.5"
                          className="hover:fill-neutral-400 transition-colors duration-300 ease-out cursor-pointer outline-none"
                        />
                      );
                    })}
                  </g>

                  {/* Render Markers */}
                  {locations.map((loc) => {
                    const [x, y] = projection(loc.coordinates) || [0, 0];
                    const isActive = activeLocation === loc.id;

                    // Don't render markers if projection returns 0,0 (off screen/invalid)
                    if (!x || !y || isNaN(x) || isNaN(y)) return null;

                    return (
                      <g
                        key={loc.id}
                        onMouseEnter={() => setActiveLocation(loc.id)}
                        onMouseLeave={() => setActiveLocation(null)}
                        style={{ cursor: 'pointer' }}
                      >
                        {/* Pulse Animation */}
                        <circle cx={x} cy={y} r={isActive ? 12 : 6} fill="#14b8a6" fillOpacity="0.2">
                          <animate attributeName="r" from="6" to="20" dur="2s" repeatCount="indefinite" />
                          <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
                        </circle>

                        {/* Core Dot */}
                        <circle
                          cx={x}
                          cy={y}
                          r={isActive ? 6 : 4}
                          fill={isActive ? "#0a0a0a" : "#14b8a6"}
                          stroke="#fff"
                          strokeWidth="1.5"
                          className="transition-all duration-300"
                        />
                      </g>
                    );
                  })}
                </svg>
              )}
            </div>

            {/* Tooltip Layer - Pure React Floating UI */}
            <div className="absolute inset-0 pointer-events-none">
              <AnimatePresence>
                {locations.map((loc) => {
                  const [x, y] = projection(loc.coordinates) || [0, 0];

                  if (!x || !y) return null;

                  // Convert SVG coordinates to percentage for DOM positioning
                  const leftPct = (x / 800) * 100;
                  const topPct = (y / 400) * 100;

                  return activeLocation === loc.id && (
                    <motion.div
                      key={loc.id}
                      initial={{ opacity: 0, y: "calc(-100% - 12px)", scale: 0.9 }}
                      animate={{ opacity: 1, y: "calc(-100% - 24px)", scale: 1 }}
                      exit={{ opacity: 0, y: "calc(-100% - 12px)", scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      style={{
                        left: `${leftPct}%`,
                        top: `${topPct}%`,
                        x: '-50%',
                      }}
                      className="absolute bg-white/95 backdrop-blur-md p-5 rounded-xl shadow-2xl border border-neutral-100 w-64 pointer-events-none z-50 origin-bottom"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-lux-black text-lg">{loc.name}</span>
                        {loc.role.includes('Head') && <span className="text-[9px] bg-lux-black text-white px-2 py-0.5 rounded-full uppercase tracking-wider">HQ</span>}
                      </div>
                      <span className="block text-xs font-bold uppercase tracking-widest text-lux-teal mb-2">{loc.role}</span>
                      <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                        {loc.desc}
                      </p>
                      {/* Triangle arrow */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white/95" />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Decorative Grid Lines */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
              backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />
          </div>
        </div>

        {/* Interactive Sector Portfolio */}
        <Portfolio />

        {/* Staggered Floating Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16 relative">
          {pillars.map((pillar, i) => {
            // Each card moves at a slightly different rate
            const cardY = useTransform(smoothProgress, [0.4, 1], [0, -100 * pillar.speed * 10]);

            return (
              <motion.div
                key={i}
                style={{ y: cardY }}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 1, delay: i * 0.2, ease: [0.22, 1, 0.36, 1] }}
                className={`group p-12 rounded-[3.5rem] bg-white border border-neutral-100 hover:border-lux-teal/20 shadow-sm hover:shadow-2xl hover:shadow-lux-teal/5 transition-all duration-700`}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-14 h-14 bg-lux-black text-white rounded-2xl flex items-center justify-center mb-12 group-hover:bg-lux-teal transition-colors duration-500 shadow-lg"
                >
                  {pillar.icon}
                </motion.div>
                <h4 className="text-3xl font-bold text-lux-black mb-6 tracking-tighter">{pillar.title}</h4>
                <p className="text-neutral-500 font-light text-lg leading-relaxed">
                  {pillar.desc}
                </p>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  className="h-[1px] bg-neutral-100 mt-10 group-hover:bg-lux-teal/30 transition-colors"
                />
              </motion.div>
            );
          })}
        </div>

        {/* New Services Overview Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="my-32 md:my-48 relative"
        >
          <div className="absolute inset-0 bg-lux-black rounded-[2.5rem] transform -rotate-1 opacity-5" />
          <div className="relative bg-lux-black rounded-[2.5rem] p-10 md:p-20 overflow-hidden text-white flex flex-col lg:flex-row items-center justify-between gap-12 shadow-2xl">
            {/* Decor */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-lux-teal rounded-full blur-[100px] opacity-20" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-lux-teal-dark rounded-full blur-[100px] opacity-20" />

            <div className="relative z-10 max-w-2xl">
              <span className="text-lux-teal font-bold text-xs uppercase tracking-[0.3em] mb-6 block">Ekspertise Kami</span>
              <h3 className="font-bold text-4xl md:text-5xl leading-[1.1] mb-6 tracking-tight">
                Layanan Menyeluruh untuk <br /><span className="text-lux-teal font-serif italic font-normal">Performa Puncak.</span>
              </h3>
              <p className="text-neutral-400 font-light text-lg leading-relaxed max-w-lg">
                Kami memadukan konsultasi pajak presisi, manajemen keuangan strategis, dan solusi digital inovatif dalam satu atap untuk akselerasi bisnis Anda.
              </p>
            </div>

            <motion.a
              href="#services"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative z-10 group flex items-center gap-4 bg-white text-lux-black px-10 py-5 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-lux-teal hover:text-white transition-all duration-300 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
            >
              <span>Lihat Layanan</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.a>
          </div>
        </motion.div>

        {/* Sophisticated Client Slider */}
        <div className="mb-32 md:mb-48 border-t border-neutral-100 pt-16">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 px-4">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-[0.4em] text-lux-teal mb-4 block">Kepercayaan & Reputasi</span>
              <h3 className="font-bold text-3xl md:text-5xl leading-tight text-lux-black tracking-tight">
                Partners of <span className="text-lux-teal italic font-serif">Note.</span>
              </h3>
            </div>
          </div>

          <div className="relative w-full overflow-hidden space-y-8 md:space-y-12">
            <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-lux-white to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-lux-white to-transparent pointer-events-none" />

            {/* Row 1 - Left */}
            <div className="flex overflow-hidden">
              <motion.div
                className="flex gap-16 md:gap-24 items-center shrink-0 pl-16 md:pl-24"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
              >
                {[...clientLogos, ...clientLogos, ...clientLogos].map((client, index) => (
                  <div key={`r1-${index}`} className="group w-32 md:w-40 opacity-40 hover:opacity-100 transition-opacity duration-500 grayscale hover:grayscale-0">
                    <img src={client.image} alt={client.name} className="w-full h-auto object-contain" />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Row 2 - Right */}
            <div className="flex overflow-hidden">
              <motion.div
                className="flex gap-16 md:gap-24 items-center shrink-0 pl-16 md:pl-24"
                animate={{ x: ["-50%", "0%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 50 }}
              >
                {[...clientLogos, ...clientLogos, ...clientLogos].reverse().map((client, index) => (
                  <div key={`r2-${index}`} className="group w-28 md:w-36 opacity-30 hover:opacity-100 transition-opacity duration-500 grayscale hover:grayscale-0">
                    <img src={client.image} alt={client.name} className="w-full h-auto object-contain" />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Row 3 - Left */}
            <div className="flex overflow-hidden">
              <motion.div
                className="flex gap-16 md:gap-24 items-center shrink-0 pl-16 md:pl-24"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 45 }}
              >
                {[...clientLogos, ...clientLogos, ...clientLogos].map((client, index) => (
                  <div key={`r3-${index}`} className="group w-32 md:w-40 opacity-40 hover:opacity-100 transition-opacity duration-500 grayscale hover:grayscale-0">
                    <img src={client.image} alt={client.name} className="w-full h-auto object-contain" />
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

      </div>

      {/* Aesthetic Noise & Gradient Overlays */}
      <div className="absolute top-0 left-0 w-full h-full bg-grain opacity-[0.03] pointer-events-none mix-blend-overlay" />
      <div className="absolute bottom-0 left-0 w-full h-96 bg-gradient-to-t from-lux-white via-lux-white/80 to-transparent pointer-events-none z-20" />
    </section>
  );
};

const About: React.FC = () => {
  return (
    <>
      <Head>
        <title>Tentang Kami</title>
        <meta name="description" content="Mengenal lebih dekat Kisantra Consult, perusahaan konsultan yang berdedikasi membangun legasi bisnis melalui integritas dan inovasi di Samarinda." />
        <meta name="keywords" content="Profil Kisantra, Sejarah Kisantra, Visi Misi Kisantra, Konsultan Terpercaya Samarinda, Lokasi Kisantra" />
      </Head>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-lux-white min-h-screen text-lux-black selection:bg-lux-teal selection:text-white"
      >
        <Navbar />
        <main>
          <AboutSection />
        </main>
        <Contact />
      </motion.div>
    </>
  );
};

export default About;

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Head } from '@inertiajs/react';
import { Navbar } from '../components/Navbar';
import { Contact } from '../components/Contact';
import { ServiceCTA } from '../components/ServiceCTA';

// --- Data Structures ---
const workflowSteps = [
  {
    step: "01",
    title: "Konsultasi",
    desc: "Diskusi mendalam untuk memetakan kebutuhan & tantangan.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    )
  },
  {
    step: "02",
    title: "Asesmen",
    desc: "Audit data internal untuk identifikasi risiko & peluang.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    )
  },
  {
    step: "03",
    title: "Implementasi",
    desc: "Eksekusi strategi perpajakan & sistem dengan presisi.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    )
  },
  {
    step: "04",
    title: "Evaluasi",
    desc: "Monitoring berkala & laporan performa transparan.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  }
];

const services = [
  {
    id: "01",
    title: "Perpajakan",
    subtitle: "Tax Compliance & Strategy",
    desc: "Kepatuhan pajak menyeluruh untuk menekan risiko sengketa & denda.",
    price: "1.500.000",
    priceUnit: "/ bulan",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000&auto=format&fit=crop",
    features: [
      "Pelaporan SPT Tahunan & Masa",
      "Perhitungan PPN & PPh",
      "Review & Audit Kepatuhan",
      "Pendampingan Pemeriksaan Pajak",
      "Konsultasi Sengketa & Keberatan",
      "Tax Planning Korporasi"
    ]
  },
  {
    id: "02",
    title: "Keuangan",
    subtitle: "Financial Advisory & Audit",
    desc: "Laporan keuangan standar PSAK yang akurat & tepat waktu.",
    price: "750.000",
    priceUnit: "/ bulan",
    image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=1000&auto=format&fit=crop",
    features: [
      "Laporan Laba Rugi & Neraca",
      "Analisis Arus Kas",
      "Valuasi Aset & Bisnis",
      "Audit Internal Operasional"
    ]
  },
  {
    id: "03",
    title: "Digital Marketing",
    subtitle: "Growth & Performance",
    desc: "Strategi pemasaran berbasis data untuk mendongkrak omset.",
    price: "1.500.000",
    priceUnit: "/ project",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
    features: [
      "SEO & SEM Optimization",
      "Social Media Management",
      "Meta & Google Ads",
      "Brand Identity Design"
    ]
  },
  {
    id: "04",
    title: "Sistem Digital",
    subtitle: "Automation & ERP",
    desc: "Infrastruktur teknologi untuk efisiensi operasional terpusat.",
    price: "2.500.000",
    priceUnit: "/ system",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop",
    features: [
      "Custom ERP Development",
      "Pembuatan Website Korporat",
      "Dashboard Visualisasi Data",
      "Cloud Server Setup"
    ]
  },
  {
    id: "05",
    title: "Administrasi",
    subtitle: "Licensing & Legal Setup",
    desc: "Pengurusan legalitas & dokumen usaha hingga siap beroperasi.",
    price: "350.000",
    priceUnit: "/ dokumen",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1000&auto=format&fit=crop",
    features: [
      "Pembuatan NPWP Pribadi & Badan",
      "Pengukuhan PKP",
      "Pendirian PT & CV",
      "Izin Usaha (NIB & OSS)"
    ]
  }
];

export const ServicesSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // --- Parallax Background Animations ---
  const textX1 = useTransform(scrollYProgress, [0, 1], ["-10%", "-30%"]);
  const textX2 = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={containerRef} id="services" className="relative w-full bg-lux-white pt-32 pb-24 overflow-hidden">

      {/* --- Dynamic Background Layer --- */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-grain opacity-[0.03] mix-blend-multiply" />
        <div className="absolute top-[5%] left-0 w-full opacity-[0.02] select-none whitespace-nowrap">
          <motion.div style={{ x: textX1 }} className="text-[12vw] font-black leading-none tracking-tighter text-lux-black">
            TAX • AUDIT • STRATEGY • COMPLIANCE • GROWTH •
          </motion.div>
        </div>
        <div className="absolute bottom-[20%] left-0 w-full opacity-[0.02] select-none whitespace-nowrap">
          <motion.div style={{ x: textX2 }} className="text-[12vw] font-black leading-none tracking-tighter text-lux-black">
            SYSTEMS • DIGITAL • FINANCE • AUTOMATION • ERP •
          </motion.div>
        </div>
      </div>

      <div className="relative z-10">

        {/* --- 1. Introductory Header --- */}
        <div className="px-6 md:px-12 mb-20 max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center"
          >
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-lux-teal mb-4 block">
              Layanan & Proses
            </span>
            <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl text-lux-black mb-8 tracking-tight">
              Our Services in Samarinda
            </h2>
            <p className="text-neutral-500 max-w-2xl mx-auto mt-4">
              Solusi bisnis terintegrasi dari konsultan pajak dan keuangan terbaik di Samarinda untuk pertumbuhan perusahaan Anda.
            </p>
          </motion.div>
        </div>

        {/* --- 2. Workflow Process --- */}
        <div className="px-6 md:px-12 max-w-[1400px] mx-auto mb-32">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-[28px] left-[12%] right-[12%] h-[2px] bg-neutral-100 -z-10" />

            {workflowSteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="flex flex-col items-center text-center group cursor-default"
              >
                <div className="w-14 h-14 rounded-full bg-white border border-neutral-200 text-lux-teal flex items-center justify-center shadow-lg mb-6 z-10 group-hover:scale-110 group-hover:border-lux-teal transition-all duration-300">
                  {step.icon}
                </div>
                <span className="text-xs font-bold text-neutral-300 uppercase tracking-widest mb-2">{step.step}</span>
                <h4 className="text-lg font-bold text-lux-black mb-2">{step.title}</h4>
                <p className="text-sm text-neutral-500 leading-relaxed max-w-[200px]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- 3. Expanded Services List --- */}
        <div className="px-6 md:px-12 max-w-[1400px] mx-auto space-y-32">
          {services.map((service, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col lg:flex-row gap-12 lg:gap-24 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}
              >
                {/* Image Side */}
                <div className="w-full lg:w-1/2 relative group">
                  <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/3] shadow-2xl shadow-lux-black/10">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-lux-black/10 group-hover:bg-transparent transition-colors duration-500" />
                  </div>
                  {/* Decorative Elements */}
                  <div className={`absolute -z-10 w-full h-full top-6 ${isEven ? 'left-6' : 'right-6'} border-2 border-lux-teal/20 rounded-[2.5rem]`} />
                </div>

                {/* Content Side */}
                <div className="w-full lg:w-1/2">
                  <span className="text-lux-teal text-xs font-bold uppercase tracking-widest mb-3 block">
                    {service.id} — {service.subtitle}
                  </span>
                  <h3 className="text-4xl lg:text-5xl font-bold text-lux-black mb-6 leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-neutral-500 text-lg leading-relaxed mb-8">
                    {service.desc}
                  </p>

                  <div className="mb-10">
                    <h4 className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-neutral-400 mb-6">
                      <span className="w-8 h-[1px] bg-neutral-200"></span>
                      What You Get
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                      {service.features.map((f, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-lux-teal/10 flex items-center justify-center shrink-0 mt-[1px]">
                            <svg className="w-3 h-3 text-lux-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-neutral-600">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-8 border-t border-neutral-100">
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Starting Investment</span>
                      <div className="text-3xl font-bold text-lux-black tracking-tight">
                        <span className="text-lg text-neutral-400 mr-1">IDR</span>
                        {service.price}
                        <span className="text-sm font-normal text-neutral-500 ml-1">{service.priceUnit}</span>
                      </div>
                    </div>

                    <a
                      href={`https://wa.me/6281180009787?text=Halo%20Kisantra%2C%20saya%20tertarik%20dengan%20layanan%20${encodeURIComponent(service.title)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center bg-lux-black text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-lux-teal transition-colors duration-300 shadow-xl shadow-lux-black/10"
                    >
                      Book Consultation
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

const Layanan: React.FC = () => {
  return (
    <>
      <Head>
        <title>Layanan Konsultan Pajak & Keuangan</title>
        <meta name="description" content="Layanan komprehensif mulai dari kepatuhan pajak, audit, hingga digital marketing dan sistem ERP untuk mengoptimalkan performa bisnis Anda." />
        <meta name="keywords" content="Jasa Pajak Samarinda, Konsultan Keuangan, Jasa Audit, Digital Marketing Samarinda, Pembuatan Sistem ERP, Layanan Kisantra" />
      </Head>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-lux-white min-h-screen text-lux-black selection:bg-lux-teal selection:text-white"
      >
        <Navbar />
        <main>
          <ServicesSection />
          <ServiceCTA />
        </main>
        <Contact />
      </motion.div>
    </>
  );
};

export default Layanan;

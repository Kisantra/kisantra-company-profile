import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Head, usePage } from '@inertiajs/react';
import type { PageProps } from '@inertiajs/core';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Impact } from '../components/Impact';
import { Services } from '../components/Services';
import { Industries } from '../components/Industries';
import { Portfolio } from '../components/Portfolio';
import { Philosophy } from '../components/Philosophy';
import { Insights } from '../components/Insights';
import { Contact } from '../components/Contact';
import { CTA } from '../components/CTA';
import { FAQ } from '@/components/FAQ';
import { SplashScreen } from '../components/SplashScreen';

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  featured_image?: string;
  published_at: string;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}

interface HomePageProps extends PageProps {
  articles: Article[];
}

const App: React.FC = () => {
  const { articles } = usePage<HomePageProps>().props;

  // Only show splash screen on first visit (not on SPA navigation)
  const [loading, setLoading] = useState(() => {
    if (typeof window === 'undefined') return true;
    return !sessionStorage.getItem('splashShown');
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem('splashShown', 'true');
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Konsultan Bisnis, Pajak & Keuangan Samarinda</title>
        <meta name="description" content="Mitra strategis terpercaya untuk solusi perpajakan, audit keuangan, dan transformasi digital bisnis di Samarinda dan Kalimantan Timur." />
        <meta name="keywords" content="Konsultan Samarinda, Jasa Pajak Samarinda, Audit Keuangan, Konsultan Bisnis Kaltim, ERP System Samarinda, Kisantra Consult" />
      </Head>
      <div className="bg-lux-white min-h-screen text-lux-black selection:bg-lux-teal selection:text-white">
        <AnimatePresence mode="wait">
          {loading && <SplashScreen onComplete={handleSplashComplete} />}
        </AnimatePresence>

        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Navbar />

            {/* Native scrolling so position: sticky effects (e.g. Sektor Fokus stacking) work on every device */}
            <main>
              <Hero />
              <Impact />
              <Philosophy />
              <Services />
              <Industries />
              <div className="mx-auto max-w-[1400px] px-6 pt-24 md:px-12 md:pt-32">
                <Portfolio />
              </div>
              <FAQ />
              <CTA />
              <Insights articles={articles} />
              <Contact />
            </main>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default App;

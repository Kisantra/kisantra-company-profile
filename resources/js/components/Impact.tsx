import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

// Optimized Counter Component - uses requestAnimationFrame instead of spring
const Counter: React.FC<{ value: number; suffix?: string; decimals?: number }> = ({ value, suffix = "", decimals = 0 }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "-50px" });
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (!inView) return;

        const duration = 2200;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(Math.floor(value * easeOut * Math.pow(10, decimals)) / Math.pow(10, decimals));

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setDisplayValue(value);
            }
        };

        requestAnimationFrame(animate);
    }, [inView, value, decimals]);

    return <span ref={ref}>{displayValue.toFixed(decimals)}{suffix}</span>;
};

export const Impact: React.FC = () => {
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

    return (
        <section className="py-20 md:py-32 bg-lux-white w-full overflow-hidden border-b border-neutral-200">
            {/* Split Layout: Text Left, Stats Right */}
            <div className="px-6 md:px-12 mb-32 max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

                    {/* Left Column: Narrative Text */}
                    <div className="flex flex-col gap-8 sticky top-32">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2 }}
                            className="font-bold text-4xl md:text-5xl lg:text-6xl leading-tight text-lux-black tracking-tight"
                        >
                            Dampak Terukur bagi Bisnis di <span className="text-lux-teal">Indonesia.</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 0.3 }}
                            className="text-lg md:text-xl text-neutral-600 font-light leading-relaxed max-w-md"
                        >
                            Sebagai partner <span className="text-lux-black font-semibold">konsultan bisnis di Samarinda</span>, kami telah membantu ratusan entitas bisnis di Kalimantan Timur meraih efisiensi fiskal dan transformasi digital yang signifikan.
                        </motion.p>
                    </div>

                    {/* Right Column: Massive Statistics */}
                    <div className="flex flex-col gap-16 md:gap-24">

                        <div className="flex flex-col group cursor-default">
                            <div className="h-[1px] w-full bg-neutral-200 mb-6 group-hover:bg-lux-teal transition-colors duration-500" />
                            <span className="text-7xl md:text-9xl font-bold leading-none mb-4 text-lux-black tracking-tighter group-hover:text-lux-teal transition-colors duration-500">
                                <Counter value={24} suffix=",7" />
                            </span>
                            <span className="text-xs uppercase tracking-[0.2em] text-neutral-500 mt-2 font-medium">Dukungan</span>
                        </div>

                        <div className="flex flex-col group cursor-default">
                            <div className="h-[1px] w-full bg-neutral-200 mb-6 group-hover:bg-lux-teal transition-colors duration-500" />
                            <span className="text-7xl md:text-9xl font-bold leading-none mb-4 text-lux-black tracking-tighter group-hover:text-lux-teal transition-colors duration-500">
                                <Counter value={500} suffix="+" />
                            </span>
                            <span className="text-xs uppercase tracking-[0.2em] text-neutral-500 mt-2 font-medium">Mitra Korporat Lokal</span>
                        </div>

                        <div className="flex flex-col group cursor-default">
                            <div className="h-[1px] w-full bg-neutral-200 mb-6 group-hover:bg-lux-teal transition-colors duration-500" />
                            <span className="text-7xl md:text-9xl font-bold leading-none mb-4 text-lux-black tracking-tighter group-hover:text-lux-teal transition-colors duration-500">
                                <Counter value={98} suffix="%" />
                            </span>
                            <span className="text-xs uppercase tracking-[0.2em] text-neutral-500 mt-2 font-medium">Tingkat Retensi Klien</span>
                        </div>

                    </div>

                </div>
            </div>

            {/* Sophisticated Client Slider */}
            <div className="w-full relative py-24 border-t border-neutral-100">
                <div className="px-6 md:px-12 mb-16 max-w-[1400px] mx-auto text-center">
                    <div className="max-w-xl mx-auto">
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
                            transition={{ repeat: Infinity, ease: "linear", duration: 60 }}
                        >
                            {[...clientLogos, ...clientLogos, ...clientLogos].map((client, index) => (
                                <div key={`r1-${index}`} className="flex items-center justify-center h-20 md:h-24 shrink-0 opacity-50 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0">
                                    <img
                                        src={client.image}
                                        alt={client.name}
                                        loading="lazy"
                                        className="max-h-full w-auto object-contain"
                                    />
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Row 2 - Right */}
                    <div className="flex overflow-hidden">
                        <motion.div
                            className="flex gap-16 md:gap-24 items-center shrink-0 pl-16 md:pl-24"
                            animate={{ x: ["-50%", "0%"] }}
                            transition={{ repeat: Infinity, ease: "linear", duration: 75 }}
                        >
                            {[...clientLogos, ...clientLogos, ...clientLogos].reverse().map((client, index) => (
                                <div key={`r2-${index}`} className="flex items-center justify-center h-20 md:h-24 shrink-0 opacity-50 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0">
                                    <img
                                        src={client.image}
                                        alt={client.name}
                                        loading="lazy"
                                        className="max-h-full w-auto object-contain"
                                    />
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Row 3 - Left */}
                    <div className="flex overflow-hidden">
                        <motion.div
                            className="flex gap-16 md:gap-24 items-center shrink-0 pl-16 md:pl-24"
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{ repeat: Infinity, ease: "linear", duration: 65 }}
                        >
                            {[...clientLogos, ...clientLogos, ...clientLogos].map((client, index) => (
                                <div key={`r3-${index}`} className="flex items-center justify-center h-20 md:h-24 shrink-0 opacity-50 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0">
                                    <img
                                        src={client.image}
                                        alt={client.name}
                                        loading="lazy"
                                        className="max-h-full w-auto object-contain"
                                    />
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};
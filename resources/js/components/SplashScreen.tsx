import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-lux-black text-lux-white"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
    >
      <div className="relative overflow-hidden p-4">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 h-[2px] bg-lux-teal"
        />
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
            className="font-bold text-6xl md:text-8xl lg:text-9xl tracking-tighter text-white"
          >
            KISANTRA
          </motion.h1>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex justify-between mt-2"
        >
          <span className="text-xs uppercase tracking-[0.4em] text-lux-teal">Samarinda</span>
          <span className="text-xs uppercase tracking-[0.4em] text-lux-teal">Est. 2026</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

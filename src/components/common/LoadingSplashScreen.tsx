import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  durationMs?: number;
  onFinish?: () => void;
};

export function LoadingSplashScreen({ durationMs = 1300, onFinish }: Props) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onFinish) onFinish();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [durationMs, onFinish]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden select-none">
          {/* Main Pure White Curtain Panel */}
          <motion.div
            initial={{ y: '0%' }}
            exit={{ y: '-100%' }}
            transition={{
              duration: 0.85,
              ease: [0.76, 0, 0.24, 1], // Custom theatrical curtain cubic-bezier
            }}
            className="absolute inset-0 bg-white flex flex-col items-center justify-center p-6 pointer-events-auto"
          >
            {/* Pure Logo Only (No text, No card, No box) */}
            <motion.div
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 flex flex-col items-center"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{
                  type: 'spring',
                  damping: 26,
                  stiffness: 160,
                  mass: 1.0,
                }}
              >
                <img
                  src="/miraiway-logo.png"
                  alt="MiraiWay Logo"
                  className="h-24 md:h-28 w-auto object-contain"
                />
              </motion.div>
            </motion.div>

            {/* Bottom Ultra-Thin Minimal Progress Line */}
            <motion.div
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute bottom-16 w-36 h-1 rounded-full bg-slate-100 overflow-hidden"
            >
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: durationMs / 1000, ease: [0.16, 1, 0.3, 1] }}
                className="h-full bg-[#0071E3] rounded-full"
              />
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const LOADING_PHASES = [
  'Pumping air pressure (7.5 PSI)...',
  'Polishing composite leather grains...',
  'Coordinating Bandra Court grid...',
  'Applying atmospheric resistance...',
  'Deploying streetball metrics...',
  'Aligning joint release angles...',
  'HoopHub connection established!'
];

export default function BasketballLoader() {
  const [percent, setPercent] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);
  
  const [telemetry, setTelemetry] = useState({
    angle: '48.2°',
    velocity: '7.8 m/s',
    spin: '240 rpm',
    rimClearance: '12 cm'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsDone(true), 700);
          return 100;
        }
        const remaining = 100 - prev;
        const speed = Math.max(1, Math.floor(remaining * 0.12));
        const increment = Math.min(speed, Math.floor(Math.random() * 9) + 1);
        return prev + increment;
      });
    }, 85);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const expectedIndex = Math.min(
      LOADING_PHASES.length - 1,
      Math.floor((percent / 100) * LOADING_PHASES.length)
    );
    if (expectedIndex !== phaseIndex) {
      setPhaseIndex(expectedIndex);
      setTelemetry({
        angle: `${(45 + Math.random() * 8).toFixed(1)}°`,
        velocity: `${(7.0 + Math.random() * 1.5).toFixed(1)} m/s`,
        spin: `${Math.floor(200 + Math.random() * 80)} rpm`,
        rimClearance: `${Math.floor(8 + Math.random() * 10)} cm`
      });
    }
  }, [percent, phaseIndex]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          id="basketball-preloader"
          initial={{ opacity: 1, scale: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 1.04,
            y: -80,
            filter: 'blur(12px)',
            transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] }
          }}
          className="fixed inset-0 z-[99999] bg-[#050505] flex flex-col items-center justify-center select-none overflow-hidden"
        >
          {/* Futuristic tactical grid coordinate system */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#ff5500_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {/* Neon orange glow bloom */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-orange-600/[0.04] pointer-events-none blur-[120px] animate-pulse" />

          {/* Concentric orbital rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-dashed border-orange-500/[0.04] pointer-events-none"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-orange-500/[0.06] pointer-events-none"
          />

          {/* MAIN COURT GRAPHIC CONTAINER */}
          <div className="relative flex flex-col items-center justify-center p-8 max-w-lg w-full">
            
            {/* Top label */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-2 mb-6"
            >
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-orange-500/60" />
              <span className="text-[8px] font-mono tracking-[6px] font-black text-orange-500/80 uppercase">HoopHub Lab</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-orange-500/60" />
            </motion.div>

            {/* PORTRAIT COURT ARC & ANIMATED SHOTS CONTAINER */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="h-[200px] w-[340px] relative bg-gradient-to-b from-white/[0.015] to-transparent border border-white/[0.05] rounded-3xl p-4 overflow-hidden flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_20px_40px_rgba(0,0,0,0.6)]"
            >
              {/* Backboard & Net Rim Group */}
              <div className="absolute right-10 top-[60px] flex flex-col items-center z-10">
                <div className="w-[50px] h-[36px] border border-orange-500/40 bg-black/50 backdrop-blur-sm rounded-sm flex items-center justify-center relative shadow-[0_4px_12px_rgba(249,115,22,0.15)]">
                  <div className="w-5 h-4 border border-orange-500/50 absolute bottom-1 rounded-xs" />
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-3 h-1.5 bg-zinc-800" />
                </div>
                
                <div className="absolute -left-5 top-7 flex flex-col items-center">
                  <div className="w-[18px] h-[3px] bg-orange-500 rounded-full shadow-[0_0_8px_#ff5500,0_1px_4px_#ff5500]" />
                  <motion.svg 
                    viewBox="0 0 40 50" 
                    className="w-[18px] h-[22px] origin-top text-orange-400"
                    animate={{
                      scaleY: [1.0, 1.0, 1.3, 0.9, 1.0],
                      scaleX: [1.0, 1.0, 0.8, 1.1, 1.0],
                    }}
                    transition={{
                      duration: 1.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      times: [0, 0.42, 0.52, 0.65, 1.0]
                    }}
                  >
                    <path d="M 5,2 L 15,18 L 25,18 L 35,2 M 15,18 L 8,36 M 25,18 L 32,36 M 5,2 L 20,38 L 35,2 M 8,36 L 20,48 L 32,36 M 20,18 L 20,48" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeOpacity="0.55"
                    />
                  </motion.svg>
                </div>
              </div>

              {/* TACTICAL NEON TRAJECTORY LINE */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <linearGradient id="grad-trajectory" x1="0%" y1="100%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#3f3f46" />
                    <stop offset="50%" stopColor="#ea580c" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>
                <path 
                  d="M 50 140 Q 150 20 270 91" 
                  fill="none" 
                  stroke="url(#grad-trajectory)" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 3" 
                  opacity="0.4"
                />
                {/* Prediction arc dots */}
                {[0.15, 0.35, 0.55, 0.75, 0.9].map((t, i) => {
                  const x = 50 + (270 - 50) * t;
                  const y = 140 + (91 - 140) * t + 4 * t * (t - 1) * -300 * (1 - t);
                  return (
                    <circle key={i} cx={x} cy={y} r="2" fill="#f97316" opacity={0.25 + i * 0.1} />
                  );
                })}
              </svg>

              {/* HIGH-ARCH BALL ANIMATION */}
              <motion.div
                animate={{
                  x: [-120, -50, 60, 100, -120],
                  y: [50, -60, -12, 45, 50],
                  scale: [1.0, 0.94, 0.76, 0.85, 1.0],
                  rotate: [0, 240, 520, 720, 0],
                  opacity: [0, 1, 1, 0, 0]
                }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.1, 0.42, 0.58, 1.0]
                }}
                className="w-8 h-8 absolute origin-center z-20"
              >
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_12px_rgba(234,88,12,0.7)]">
                  <circle cx="50" cy="50" r="46" fill="#f97316" stroke="#1c1917" strokeWidth="5" />
                  <path d="M 4 50 Q 50 48 96 50" fill="none" stroke="#1c1917" strokeWidth="4.5" />
                  <path d="M 50 4 Q 48 50 50 96" fill="none" stroke="#1c1917" strokeWidth="4.5" />
                  <path d="M 18 18 Q 45 45 18 82" fill="none" stroke="#1c1917" strokeWidth="4.5" />
                  <path d="M 82 18 Q 55 45 82 82" fill="none" stroke="#1c1917" strokeWidth="4.5" />
                  <path d="M 30 20 A 30 30 0 0 1 70 20" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="4" />
                </svg>
              </motion.div>

              {/* Swish ripple */}
              <motion.div
                animate={{
                  scale: [0.3, 1.3, 1.6, 0.5],
                  opacity: [0, 0.8, 0, 0]
                }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeOut",
                  times: [0, 0.43, 0.54, 1.0]
                }}
                className="absolute right-[108px] top-[80px] w-12 h-12 rounded-full border border-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.4)] pointer-events-none z-0"
              />

              {/* TELEMETRY DATABOX */}
              <div className="absolute top-3 left-4 flex gap-4 text-[7.5px] font-mono text-zinc-500 bg-neutral-950/70 backdrop-blur-sm p-1.5 rounded-lg border border-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                <div>
                  <span className="text-zinc-600 uppercase">ANGLE:</span> <span className="text-orange-400 font-bold">{telemetry.angle}</span>
                </div>
                <div>
                  <span className="text-zinc-600 uppercase">VEL:</span> <span className="text-orange-400 font-bold">{telemetry.velocity}</span>
                </div>
                <div>
                  <span className="text-zinc-600 uppercase">SPIN:</span> <span className="text-orange-400 font-bold">{telemetry.spin}</span>
                </div>
              </div>

              {/* Grid identifier */}
              <div className="absolute bottom-2.5 left-4 text-[7px] font-mono text-zinc-600 font-black tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-bounce" />
                DRAFT BAY 04 / PHYSICS CALIBRATION
              </div>
            </motion.div>

            {/* PROGRESS LOADING SLATE */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 text-center space-y-3 w-72"
            >
              <div className="font-display text-white text-[1.5rem] tracking-[1.5px] uppercase font-bold leading-none select-none flex items-center justify-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="inline-block text-orange-500 text-2xl"
                >🏀</motion.span>
                HoopHub
              </div>
              <div className="text-[8.5px] font-mono text-zinc-600 tracking-widest uppercase">
                Advanced Basketball Physics Sandbox
              </div>

              {/* Premium percentage progress bar */}
              <div className="w-full h-[5px] bg-white/[0.04] rounded-full overflow-hidden mt-3 relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ ease: 'easeOut', duration: 0.15 }}
                  className="h-full bg-gradient-to-r from-orange-600 via-amber-500 to-[#d4f82a] shadow-[0_0_12px_rgba(249,115,22,0.8)]"
                />
                {/* Shimmering pulse head */}
                <motion.div
                  style={{ left: `${percent}%` }}
                  className="absolute top-0 h-full w-4 bg-gradient-to-r from-white/30 to-transparent blur-sm -translate-x-2"
                />
              </div>

              {/* Phase label + percent */}
              <div className="flex items-center justify-between font-mono text-[8px] text-zinc-400 w-full mt-1 uppercase tracking-wider font-bold h-4">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={phaseIndex}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25 }}
                    className="text-zinc-500 truncate max-w-[200px] text-left"
                  >
                    {LOADING_PHASES[phaseIndex]}
                  </motion.span>
                </AnimatePresence>
                <span className="text-orange-500 font-black text-right tabular-nums">{percent}%</span>
              </div>
            </motion.div>

          </div>

          {/* Footer telemetry */}
          <div className="absolute bottom-6 flex items-center justify-between w-full px-8 text-zinc-700 font-mono text-[8px] uppercase tracking-widest font-black">
            <span>Bandra East Gym Outpost</span>
            <div className="flex items-center gap-2">
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="text-orange-600"
              >●</motion.span>
              <span>EXPERIMENTAL PHYSICS LAB V1.0.8</span>
            </div>
            <span>EST. 2026</span>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}

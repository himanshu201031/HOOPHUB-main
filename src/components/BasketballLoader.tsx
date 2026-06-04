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
  
  // Tactical telemetry that flickers dynamically
  const [telemetry, setTelemetry] = useState({
    angle: '48.2°',
    velocity: '7.8 m/s',
    spin: '240 rpm',
    rimClearance: '12 cm'
  });

  useEffect(() => {
    // Smooth percentage increment
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
    // Update progress phases
    const expectedIndex = Math.min(
      LOADING_PHASES.length - 1,
      Math.floor((percent / 100) * LOADING_PHASES.length)
    );
    if (expectedIndex !== phaseIndex) {
      setPhaseIndex(expectedIndex);
      
      // Randomize telemetry slightly for authentic tactical vibe
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
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            y: -100,
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
          }}
          className="fixed inset-0 z-[99999] bg-[#060606] flex flex-col items-center justify-center select-none overflow-hidden"
        >
          {/* Futuristic tactical grid coordinate system */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ff5500_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {/* Subtle concentric orbital radar line background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-orange-500/[0.02] animate-pulse pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-dashed border-orange-500/[0.015] pointer-events-none" />

          {/* MAIN COURT GRAPHIC CONTAINER */}
          <div className="relative flex flex-col items-center justify-center p-8 max-w-lg w-full">
            
            {/* PORTRAIT COURT ARC & ANIMATED SHOTS CONTAINER */}
            <div className="h-[200px] w-[340px] relative border border-white/[0.02] bg-white/[0.01] rounded-3xl p-4 overflow-hidden flex items-center justify-center">
              
              {/* Backboard & Net Rim Group (Anchored at Right Side of the Court Area) */}
              <div className="absolute right-10 top-[60px] flex flex-col items-center z-10">
                {/* Visual Glassmorphic Backboard */}
                <div className="w-[50px] h-[36px] border border-orange-500/30 bg-black/40 backdrop-blur-sm rounded-sm flex items-center justify-center relative shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                  {/* Inner targeting square orange line */}
                  <div className="w-5 h-4 border border-orange-500/40 absolute bottom-1 rounded-xs" />
                  
                  {/* Heavy orange backboard mount point */}
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-3 h-1.5 bg-zinc-800" />
                </div>
                
                {/* Steel Orange Rim Bracket */}
                <div className="absolute -left-5 top-7 flex flex-col items-center">
                  {/* Rim line representation */}
                  <div className="w-[18px] h-[3px] bg-orange-500 rounded-full shadow-[0_1px_4px_#ff5500]" />
                  
                  {/* Dynamically reacting Net SVG */}
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
                      times: [0, 0.42, 0.52, 0.65, 1.0] // Net responds exactly when the basketball drops through at ~0.45s boundary
                    }}
                  >
                    {/* Woven street basket mesh cords */}
                    <path d="M 5,2 L 15,18 L 25,18 L 35,2 M 15,18 L 8,36 M 25,18 L 32,36 M 5,2 L 20,38 L 35,2 M 8,36 L 20,48 L 32,36 M 20,18 L 20,48" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeOpacity="0.45"
                    />
                  </motion.svg>
                </div>
                
              </div>

              {/* TACTICAL TRAJECTORY GUIDELINE ACCENT */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                <path 
                  d="M 50 140 Q 150 20 270 91" 
                  fill="none" 
                  stroke="url(#grad-trajectory)" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 3" 
                />
                <defs>
                  <linearGradient id="grad-trajectory" x1="0%" y1="100%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#71717a" />
                    <stop offset="100%" stopColor="#f3500d" />
                  </linearGradient>
                </defs>
              </svg>

              {/* HIGH-ARCH TRAJECTORY SHOOTING BALL GRAPHIC */}
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
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_8px_rgba(234,88,12,0.45)]">
                  <circle cx="50" cy="50" r="46" fill="#f97316" stroke="#1c1917" strokeWidth="5" />
                  <path d="M 4 50 Q 50 48 96 50" fill="none" stroke="#1c1917" strokeWidth="4.5" />
                  <path d="M 50 4 Q 48 50 50 96" fill="none" stroke="#1c1917" strokeWidth="4.5" />
                  <path d="M 18 18 Q 45 45 18 82" fill="none" stroke="#1c1917" strokeWidth="4.5" />
                  <path d="M 82 18 Q 55 45 82 82" fill="none" stroke="#1c1917" strokeWidth="4.5" />
                  {/* Bright leather sheen highlighting */}
                  <path d="M 30 20 A 30 30 0 0 1 70 20" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="4" />
                </svg>
              </motion.div>

              {/* Dynamic Swoosh Swish Impact Wave Ripple */}
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
                className="absolute right-[108px] top-[80px] w-12 h-12 rounded-full border border-orange-600 pointer-events-none z-0"
              />

              {/* TELEMETRY FLICKERING DATABOX overlay inside court box */}
              <div className="absolute top-3 left-4 flex gap-4 text-[7.5px] font-mono text-zinc-500 bg-neutral-950/40 p-1.5 rounded-lg border border-white/[0.02]">
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

              {/* Tactical court grid identifier in watermarked margin */}
              <div className="absolute bottom-2.5 left-4 text-[7px] font-mono text-zinc-600 font-black tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-bounce" />
                DRAFT BAY 04 / PHYSICS CALIBRATION
              </div>
            </div>

            {/* PROGRESS LOADING SLATE (HOOP-HUB DESIGN) */}
            <div className="mt-8 text-center space-y-3 w-72">
              <div className="flex items-center justify-center gap-2">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-orange-500/40" />
                <span className="text-[9px] font-mono tracking-[4px] font-black text-orange-500 uppercase">
                  INITIALIZING RUN
                </span>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-orange-500/40" />
              </div>

              <div className="font-display text-white text-[1.5rem] tracking-[1.5px] uppercase font-bold leading-none select-none">
                HoopHub Lab
              </div>

              {/* Premium micro percentage progress-bar slider */}
              <div className="w-full h-[4px] bg-white/[0.04] rounded-full overflow-hidden mt-2 relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-orange-600 to-amber-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]"
                />
              </div>

              {/* Realtime progress label & percentage indicator details */}
              <div className="flex items-center justify-between font-mono text-[8px] text-zinc-400 w-full mt-1 uppercase tracking-wider font-bold h-4">
                <span className="text-zinc-500 truncate max-w-[210px] text-left">{LOADING_PHASES[phaseIndex]}</span>
                <span className="text-orange-500 font-black text-right">{percent}%</span>
              </div>
            </div>

          </div>

          {/* Aesthetic footer telemetry and platform credits */}
          <div className="absolute bottom-6 flex items-center justify-between w-full px-8 text-zinc-600 font-mono text-[8px] uppercase tracking-widest font-black">
            <span>Bandra East Gym Outpost</span>
            <div className="flex items-center gap-2">
              <span className="animate-pulse text-orange-600">●</span>
              <span>EXPERIMENTAL PHYSICS LAB V1.0.8</span>
            </div>
            <span>EST. 2026</span>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}

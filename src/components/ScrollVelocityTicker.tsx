import React, { useEffect, useRef } from 'react';

interface ScrollVelocityTickerProps {
  items?: string[];
  baseSpeed?: number; // px per frame
  className?: string;
}

const DEFAULT_ITEMS = [
  '🏀 HOOPHUB', 'STREETBALL PHYSICS', 'COURT COMMAND', 'DROP STEP',
  'PICK & ROLL', 'TRIPLE THREAT', 'FAST BREAK', 'SLAM DUNK'
];

export default function ScrollVelocityTicker({
  items = DEFAULT_ITEMS,
  baseSpeed = 0.7,
  className = ''
}: ScrollVelocityTickerProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);
  const rafRef = useRef<number>(0);
  const lastScrollY = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleScroll = () => {
      const dy = window.scrollY - lastScrollY.current;
      velocityRef.current = dy * 0.08;
      lastScrollY.current = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const totalWidth = track.scrollWidth / 2;

    const animate = () => {
      velocityRef.current *= 0.92; // dampen
      const speed = baseSpeed + Math.abs(velocityRef.current);
      xRef.current -= speed;
      if (Math.abs(xRef.current) >= totalWidth) {
        xRef.current = 0;
      }
      track.style.transform = `translateX(${xRef.current}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [baseSpeed]);

  const allItems = [...items, ...items]; // duplicate for seamless loop

  return (
    <div className={`relative overflow-hidden py-4 border-y border-white/[0.06] select-none ${className}`}>
      {/* Fade masks */}
      <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

      <div ref={trackRef} className="flex items-center gap-0 will-change-transform whitespace-nowrap">
        {allItems.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 px-5 text-[11px] font-black uppercase tracking-[4px] text-zinc-600 font-mono"
          >
            {item}
            <span className="text-orange-600/60 text-[8px]">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

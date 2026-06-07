import React, { useEffect, useRef, useState } from 'react';

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
  const [isHovered, setIsHovered] = useState(false);

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
      const speed = (isHovered ? 0.2 : baseSpeed) + Math.abs(velocityRef.current);
      xRef.current -= speed;
      if (Math.abs(xRef.current) >= totalWidth) {
        xRef.current = 0;
      }
      track.style.transform = `translateX(${xRef.current}px) translateZ(0)`;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [baseSpeed, isHovered]);

  const allItems = [...items, ...items]; // duplicate for seamless loop

  return (
    <div 
      className={`relative overflow-hidden py-5 border-y border-orange-500/20 select-none bg-gradient-to-r from-[#0a0a0a] via-neutral-900/80 to-[#0a0a0a] ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated glow bar */}
      <div className="absolute inset-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent animate-pulse" />
      
      {/* Fade masks */}
      <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-[#0a0a0a] via-neutral-900/90 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-[#0a0a0a] via-neutral-900/90 to-transparent z-10 pointer-events-none" />

      <div ref={trackRef} className="flex items-center gap-0 will-change-transform whitespace-nowrap">
        {allItems.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-4 px-6 text-[11px] font-black uppercase tracking-[5px] font-mono transition-all duration-300"
            style={{
              background: 'linear-gradient(90deg, #ffffff, #ff964f, #ffffff)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: isHovered ? 'brightness(1.3) hue-rotate(20deg)' : 'brightness(1)',
              transform: isHovered ? 'scale(1.02)' : 'scale(1)'
            }}
          >
            {item}
            <span className="text-orange-600/80 text-[9px] animate-pulse">●</span>
          </span>
        ))}
      </div>
    </div>
  );
}

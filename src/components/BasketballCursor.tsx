import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TrailDot {
  id: number;
  x: number;
  y: number;
  scale: number;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export default function BasketballCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState<TrailDot[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isBallHovered, setIsBallHovered] = useState(false);
  const [isCanvasHovered, setIsCanvasHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const trailRef = useRef<TrailDot[]>([]);
  const trailCounter = useRef(0);
  const requestRef = useRef<number | null>(null);
  const targetPos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Detect mouse move
    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Check if mouse is hovering over empty canvas space
      const target = e.target as HTMLElement;
      if (target) {
        const isOverMainCanvas = 
          target === document.body || 
          target === document.documentElement ||
          target.id === 'landing-app-root' ||
          target.id === 'main-content-timeline' ||
          !target.closest('button, a, input, select, textarea, [role="button"], label, nav, footer, .p-1, .p-2, .p-3, .p-4, .p-5, .p-6, .p-8, .bg-neutral-900, .bg-neutral-950, .bg-neutral-900\\/5, .rounded-xl, .rounded-2xl, .rounded-3xl');
        
        setIsCanvasHovered(isOverMainCanvas);
      }

      // Add trailing spark
      if (Math.random() > 0.45) {
        trailCounter.current += 1;
        const newDot: TrailDot = {
          id: trailCounter.current,
          x: e.clientX,
          y: e.clientY,
          scale: 1.0 + Math.random() * 0.8,
        };
        trailRef.current = [...trailRef.current.slice(-12), newDot];
        setTrail(trailRef.current);
      }
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);
    
    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      
      const newRipple: Ripple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY
      };
      
      setRipples(prev => [...prev.slice(-4), newRipple]);
    };

    const handleMouseUp = () => setIsClicking(false);

    // Dynamic hover bindings for interactive links, buttons, dials, option values
    const setupIntersections = () => {
      const interactives = document.querySelectorAll(
        'button, a, input, select, textarea, [role="button"], [data-cursor-hover]'
      );
      
      const onEnter = () => setIsHovered(true);
      const onLeave = () => setIsHovered(false);

      interactives.forEach((el) => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });

      return () => {
        interactives.forEach((el) => {
          el.removeEventListener('mouseenter', onEnter);
          el.removeEventListener('mouseleave', onLeave);
        });
      };
    };

    // Listen to custom Three.js raycasting hovers over the 3D ball
    const handle3D_BallHover = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent && customEvent.detail) {
        setIsBallHovered(!!customEvent.detail.hovered);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('3d-ball-hover', handle3D_BallHover);

    // Initial setup
    const cleanInteractives = setupIntersections();

    // Secondary periodic setup in case DOM updates (e.g. view changes)
    const interval = setInterval(setupIntersections, 2000);

    // Smooth physics lerp loop
    const updateCursor = () => {
      const dx = targetPos.current.x - currentPos.current.x;
      const dy = targetPos.current.y - currentPos.current.y;
      
      // Slower, smooth floating spring-like lag
      currentPos.current.x += dx * 0.16;
      currentPos.current.y += dy * 0.16;
      
      setPosition({ x: currentPos.current.x, y: currentPos.current.y });

      // Decay trails over time
      if (trailRef.current.length > 0) {
        trailRef.current = trailRef.current
          .map(dot => ({ ...dot, scale: dot.scale - 0.08 }))
          .filter(dot => dot.scale > 0);
        setTrail(trailRef.current);
      }

      requestRef.current = requestAnimationFrame(updateCursor);
    };
    requestRef.current = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('3d-ball-hover', handle3D_BallHover);
      cleanInteractives();
      clearInterval(interval);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isVisible]);

  // Clean stale click ripples after their 1s fade action completes
  const onRippleComplete = (id: number) => {
    setRipples(prev => prev.filter(r => r.id !== id));
  };

  if (!isVisible) return null;

  const isAnyHovered = isHovered || isBallHovered;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100000] hidden md:block">
      
      {/* 1. SEAMLESS TRAILING SPARKS (KINETIC DOTS) */}
      {trail.map((dot) => (
        <div
          key={dot.id}
          style={{
            position: 'absolute',
            left: dot.x,
            top: dot.y,
            transform: `translate(-50%, -50%) scale(${dot.scale})`,
            opacity: dot.scale,
          }}
          className="w-1.5 h-1.5 bg-orange-500 rounded-full mix-blend-screen shadow-[0_0_6px_#ff5500] transition-opacity duration-100"
        />
      ))}

      {/* 2. DYNAMIC COURT RIPPLES ON CLICK */}
      <AnimatePresence>
        {ripples.map((rip) => (
          <motion.div
            key={rip.id}
            initial={{ scale: 0.1, opacity: 0.9 }}
            animate={{ scale: 2.4, opacity: 0 }}
            onAnimationComplete={() => onRippleComplete(rip.id)}
            transition={{ duration: 0.8, ease: [0.1, 0.8, 0.25, 1] }}
            style={{
              position: 'absolute',
              left: rip.x,
              top: rip.y,
              transform: 'translate(-50%, -50%)',
            }}
            className="w-16 h-16 pointer-events-none flex items-center justify-center mix-blend-screen"
          >
            {/* Outer expanding orange circle rim */}
            <div className="absolute inset-0 border-2 border-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
            {/* Inner dashed tactical court grid lines */}
            <div className="absolute inset-2 border border-dashed border-orange-400/60 rounded-full animate-[spin_5s_linear_infinite]" />
            {/* Center target circle representing the bottom of the hoop */}
            <div className="absolute w-4 h-4 rounded-full border border-amber-500/40 bg-orange-500/10" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* 3. THE MAIN BASKETBALL MOUSE CURSOR & HOOP TARGET LOBBY */}
      <div
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          transform: `translate(-50%, -50%) scale(${isClicking ? 0.82 : isAnyHovered ? 1.35 : 1.0})`,
        }}
        className="w-5.5 h-5.5 flex items-center justify-center pointer-events-none transition-transform duration-100 ease-out"
      >
        {/* Flat Vector Basketball SVG */}
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_2px_5px_rgba(234,88,12,0.7)] animate-[spin_4s_linear_infinite]">
          {/* Base basketball leather circle */}
          <circle cx="50" cy="50" r="44" fill="#f97316" stroke="#000000" strokeWidth="6.5" />
          {/* Authentic black seams crosslines */}
          <path d="M 6 50 H 94" stroke="#000000" strokeWidth="6.5" />
          <path d="M 50 6 V 94" stroke="#000000" strokeWidth="6.5" />
          <path d="M 18 18 Q 45 45 18 82" fill="none" stroke="#000000" strokeWidth="6.5" />
          <path d="M 82 18 Q 55 45 82 82" fill="none" stroke="#000000" strokeWidth="6.5" />
          {/* Highlights & gloss dome sheen */}
          <path d="M 28 18 A 28 28 0 0 1 72 18" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="4.5" />
        </svg>

        {/* Dynamic target hoop dashed spinner when hovering clickable keys */}
        <div
          style={{
            transform: `translate(-50%, -50%) scale(${isAnyHovered ? 1.15 : 0.0})`,
            opacity: isAnyHovered ? 0.9 : 0,
          }}
          className="absolute left-1/2 top-1/2 w-11 h-11 border-2 border-dashed border-orange-500/80 rounded-full animate-[spin_12s_linear_infinite] transition-all duration-300"
        />

        {/* Outer subtle net mesh pattern layer on hover */}
        {isAnyHovered && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 border border-zinc-500/30 rounded-full bg-orange-500/5 backdrop-blur-[0.5px] transition-all duration-300 animate-pulse" />
        )}
      </div>

    </div>
  );
}

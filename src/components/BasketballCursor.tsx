import React, { useEffect, useRef } from 'react';
import { playSwoosh } from '../utils/audio';

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  rotation: number;
}

export default function BasketballCursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const targetHoopRef = useRef<HTMLDivElement>(null);
  const netOverlayRef = useRef<HTMLDivElement>(null);

  const targetPos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });
  
  const sparks = useRef<Spark[]>([]);
  const ripples = useRef<Ripple[]>([]);
  
  const isHovered = useRef(false);
  const isClicking = useRef(false);
  const isBallHovered = useRef(false);
  const isVisible = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle Resize
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse events
    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible.current) {
        isVisible.current = true;
        if (containerRef.current) containerRef.current.style.opacity = '1';
      }

      // Add sparks dynamically on movement
      if (Math.random() > 0.4) {
        sparks.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          alpha: 1.0,
          size: 1.5 + Math.random() * 2.0
        });
      }
    };

    const handleMouseEnter = () => {
      isVisible.current = true;
      if (containerRef.current) containerRef.current.style.opacity = '1';
    };

    const handleMouseLeave = () => {
      isVisible.current = false;
      if (containerRef.current) containerRef.current.style.opacity = '0';
    };

    const handleMouseDown = (e: MouseEvent) => {
      isClicking.current = true;
      playSwoosh();

      // Trigger a court ripple
      ripples.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 4,
        maxRadius: 65,
        alpha: 0.9,
        rotation: Math.random() * Math.PI
      });

      updateCursorStyles();
    };

    const handleMouseUp = () => {
      isClicking.current = false;
      updateCursorStyles();
    };

    // Listen to custom Three.js raycasting hovers
    const handle3D_BallHover = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent && customEvent.detail) {
        isBallHovered.current = !!customEvent.detail.hovered;
        updateCursorStyles();
      }
    };

    // Update active visual styles on cursor elements
    const updateCursorStyles = () => {
      const cursor = cursorRef.current;
      const hoop = targetHoopRef.current;
      const net = netOverlayRef.current;
      if (!cursor) return;

      const hovered = isHovered.current || isBallHovered.current;
      let scale = 1.0;
      if (isClicking.current) scale = 0.82;
      else if (hovered) scale = 1.35;

      cursor.style.transform = `translate(-50%, -50%) scale(${scale})`;

      if (hoop) {
        hoop.style.transform = `translate(-50%, -50%) scale(${hovered ? 1.15 : 0.0})`;
        hoop.style.opacity = hovered ? '0.9' : '0';
      }

      if (net) {
        net.style.opacity = hovered ? '1' : '0';
      }
    };

    // Check hovered elements
    const checkHover = () => {
      const interactives = document.querySelectorAll(
        'button, a, input, select, textarea, [role="button"], [data-cursor-hover]'
      );

      const onEnter = () => {
        isHovered.current = true;
        updateCursorStyles();
      };
      const onLeave = () => {
        isHovered.current = false;
        updateCursorStyles();
      };

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

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('3d-ball-hover', handle3D_BallHover);

    let cleanInteractives = checkHover();
    const interval = setInterval(() => {
      cleanInteractives();
      cleanInteractives = checkHover();
    }, 2000);

    // Main animation loop (optimized standard loop)
    let animationFrameId: number;

    const render = () => {
      // Lerp mouse coordinates
      const dx = targetPos.current.x - currentPos.current.x;
      const dy = targetPos.current.y - currentPos.current.y;
      currentPos.current.x += dx * 0.18;
      currentPos.current.y += dy * 0.18;

      // Update positions of DOM cursor elements
      if (cursorRef.current) {
        cursorRef.current.style.left = `${currentPos.current.x}px`;
        cursorRef.current.style.top = `${currentPos.current.y}px`;
      }
      if (targetHoopRef.current) {
        targetHoopRef.current.style.left = `${currentPos.current.x}px`;
        targetHoopRef.current.style.top = `${currentPos.current.y}px`;
      }
      if (netOverlayRef.current) {
        netOverlayRef.current.style.left = `${currentPos.current.x}px`;
        netOverlayRef.current.style.top = `${currentPos.current.y}px`;
      }

      // Draw trails on Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // A. Draw Sparks
      for (let i = sparks.current.length - 1; i >= 0; i--) {
        const spark = sparks.current[i];
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.alpha -= 0.04;

        if (spark.alpha <= 0) {
          sparks.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = spark.alpha;
        ctx.fillStyle = '#f97316';
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#ff5500';
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.size * spark.alpha, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // B. Draw Ripples
      for (let i = ripples.current.length - 1; i >= 0; i--) {
        const ripple = ripples.current[i];
        ripple.radius += (ripple.maxRadius - ripple.radius) * 0.08;
        ripple.alpha -= 0.025;
        ripple.rotation += 0.01;

        if (ripple.alpha <= 0) {
          ripples.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = ripple.alpha;
        ctx.translate(ripple.x, ripple.y);

        // 1. Outer rim
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(249, 115, 22, 0.6)';
        ctx.beginPath();
        ctx.arc(0, 0, ripple.radius, 0, Math.PI * 2);
        ctx.stroke();

        // 2. Dashed inner court grid
        ctx.save();
        ctx.rotate(ripple.rotation);
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(0, 0, Math.max(2, ripple.radius - 8), 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // 3. Center target hoop
        ctx.fillStyle = 'rgba(249, 115, 22, 0.1)';
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
        ctx.beginPath();
        ctx.arc(0, 0, Math.min(ripple.radius * 0.25, 8), 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('3d-ball-hover', handle3D_BallHover);
      cleanInteractives();
      clearInterval(interval);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ opacity: 0, transition: 'opacity 0.3s ease-in-out' }}
      className="fixed inset-0 pointer-events-none z-[100000] hidden md:block"
    >
      {/* HTML5 Canvas overlay for hyper-efficient rendering of sparks and ripples */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Dynamic target hoop dashed spinner when hovering clickable elements */}
      <div
        ref={targetHoopRef}
        style={{
          opacity: 0,
          transform: 'translate(-50%, -50%) scale(0)'
        }}
        className="absolute w-12 h-12 border-2 border-dashed border-orange-500/80 rounded-full animate-[spin_12s_linear_infinite] transition-all duration-300 pointer-events-none"
      />

      {/* Outer net pattern glow overlay */}
      <div
        ref={netOverlayRef}
        style={{
          opacity: 0,
          transform: 'translate(-50%, -50%)'
        }}
        className="absolute w-9 h-9 border border-zinc-500/30 rounded-full bg-orange-500/5 backdrop-blur-[0.5px] transition-all duration-300 animate-pulse pointer-events-none"
      />

      {/* The main basketball cursor DOM node */}
      <div
        ref={cursorRef}
        style={{
          transform: 'translate(-50%, -50%) scale(1)'
        }}
        className="absolute w-6 h-6 flex items-center justify-center pointer-events-none transition-transform duration-100 ease-out"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_2px_5px_rgba(234,88,12,0.7)] animate-[spin_4s_linear_infinite]"
        >
          {/* Base basketball leather */}
          <circle cx="50" cy="50" r="44" fill="#f97316" stroke="#000000" strokeWidth="6.5" />
          {/* Seams */}
          <path d="M 6 50 H 94" stroke="#000000" strokeWidth="6.5" />
          <path d="M 50 6 V 94" stroke="#000000" strokeWidth="6.5" />
          <path d="M 18 18 Q 45 45 18 82" fill="none" stroke="#000000" strokeWidth="6.5" />
          <path d="M 82 18 Q 55 45 82 82" fill="none" stroke="#000000" strokeWidth="6.5" />
          {/* Dome shine highlighting */}
          <path d="M 28 18 A 28 28 0 0 1 72 18" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="4.5" />
          {/* Central pointer dot for exact alignment click */}
          <circle cx="50" cy="50" r="4.5" fill="#ffffff" />
        </svg>
      </div>
    </div>
  );
}

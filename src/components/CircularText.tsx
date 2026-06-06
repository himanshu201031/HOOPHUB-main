import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "motion/react";

type HoverEffect = "slowDown" | "speedUp" | "pause" | "goBonkers" | undefined;

interface CircularTextProps {
  text: string;
  spinDuration?: number;
  onHover?: HoverEffect;
  className?: string;
}

export default function CircularText({
  text = "",
  spinDuration = 20,
  onHover,
  className = ""
}: CircularTextProps) {
  const controls = useAnimation();
  const [currentRotation, setCurrentRotation] = useState(0);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rotationRef = useRef(0);
  const isRunning = useRef(true);

  useEffect(() => {
    let start: number | null = null;
    let raf: number;
    const totalDuration = spinDuration * 1000;

    function step(timestamp: number) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const rotation = ((elapsed % totalDuration) / totalDuration) * 360;
      rotationRef.current = rotation;
      if (isRunning.current) {
        raf = requestAnimationFrame(step);
      }
    }

    raf = requestAnimationFrame(step);
    
    controls.start({
      rotate: [0, 360],
      transition: {
        duration: spinDuration,
        ease: "linear",
        repeat: Infinity
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      isRunning.current = false;
    };
  }, [spinDuration, controls]);

  const handleMouseEnter = () => {
    if (!onHover) return;
    if (onHover === "pause") {
      controls.stop();
    } else if (onHover === "speedUp") {
      controls.start({
        rotate: [rotationRef.current, rotationRef.current + 360],
        transition: { duration: spinDuration / 4, ease: "linear", repeat: Infinity }
      });
    } else if (onHover === "slowDown") {
      controls.start({
        rotate: [rotationRef.current, rotationRef.current + 360],
        transition: { duration: spinDuration * 3, ease: "linear", repeat: Infinity }
      });
    } else if (onHover === "goBonkers") {
      controls.start({
        rotate: [0, 360],
        transition: { duration: 0.4, ease: "linear", repeat: Infinity }
      });
    }
  };

  const handleMouseLeave = () => {
    if (!onHover) return;
    controls.start({
      rotate: [rotationRef.current, rotationRef.current + 360],
      transition: { duration: spinDuration, ease: "linear", repeat: Infinity }
    });
  };

  const characters = text.split("");
  const angleStep = 360 / characters.length;

  return (
    <motion.div
      className={`relative w-full h-full flex items-center justify-center cursor-pointer select-none ${className}`}
      animate={controls}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {characters.map((char, i) => (
        <span
          key={i}
          className="absolute text-[10px] font-black tracking-widest uppercase leading-none"
          style={{
            transformOrigin: "0 50px",
            transform: `rotate(${i * angleStep}deg) translateY(-50px)`,
            left: "50%",
            top: "50%",
            marginLeft: "-0.3em",
            marginTop: "-0.5em"
          }}
        >
          {char}
        </span>
      ))}
    </motion.div>
  );
}

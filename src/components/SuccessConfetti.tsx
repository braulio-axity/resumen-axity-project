import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface SuccessConfettiProps {
  show: boolean;
  onComplete?: () => void;
}

export function SuccessConfetti({ show, onComplete }: SuccessConfettiProps) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    color: string;
    delay: number;
  }>>([]);

  useEffect(() => {
    if (show) {
      const colors = [
        'var(--axity-purple)',
        'var(--axity-violet)', 
        'var(--axity-magenta)',
        'var(--axity-orange)',
        'var(--axity-mint)',
        'var(--axity-blue)'
      ];

      const newParticles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5
      }));

      setParticles(newParticles);

      // Clear particles after animation
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-3 h-3 rounded-full"
              style={{
                backgroundColor: particle.color,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
              initial={{ 
                scale: 0,
                y: 0,
                rotate: 0,
                opacity: 1
              }}
              animate={{ 
                scale: [0, 1, 0.5, 0],
                y: [0, -100, -200, -400],
                rotate: [0, 180, 360, 540],
                opacity: [1, 1, 0.8, 0]
              }}
              transition={{
                duration: 2.5,
                delay: particle.delay,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
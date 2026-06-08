"use client";
import React, { useEffect, useRef } from "react";
import { MotionValue } from "framer-motion";

interface ParticleTrailProps {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  smoothX: MotionValue<number>;
  smoothY: MotionValue<number>;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  decay: number;
}

export const ParticleTrail: React.FC<ParticleTrailProps> = ({
  mouseX,
  mouseY,
  smoothX,
  smoothY,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const tick = () => {
      // Sync canvas dimensions with viewport
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const currentMouseX = mouseX.get();
      const currentMouseY = mouseY.get();

      // Calculate pointer movement speed
      const dx = currentMouseX - lastMousePosRef.current.x;
      const dy = currentMouseY - lastMousePosRef.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy);

      // Spawn a new particle if moving and under the limit (max 20)
      if (speed > 1.5 && particlesRef.current.length < 20) {
        particlesRef.current.push({
          x: smoothX.get(),
          y: smoothY.get(),
          // Eject particles slightly backwards from motion vector with random dispersion
          vx: -dx * 0.15 + (Math.random() - 0.5) * 1.2,
          vy: -dy * 0.15 + (Math.random() - 0.5) * 1.2,
          size: Math.random() * 3.5 + 1.5,
          life: 1.0,
          decay: 0.025 + Math.random() * 0.02, // fades in 0.5s - 1s (approx 30-60 frames)
        });
      }

      lastMousePosRef.current = { x: currentMouseX, y: currentMouseY };

      // Update and draw particles
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.95; // apply friction
        p.vy *= 0.95;
        p.life -= p.decay;

        // Draw soft glowing orb
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(217, 179, 255, ${p.life})`;
        ctx.shadowColor = "#d9b3ff";
        ctx.shadowBlur = p.size * 2;
        ctx.fill();
        ctx.shadowBlur = 0; // reset shadow state
      });

      // Filter out dead particles
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [mouseX, mouseY, smoothX, smoothY]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 99997,
        mixBlendMode: "screen",
      }}
    />
  );
};

export default ParticleTrail;

"use client";
import { useEffect, useRef } from "react";
import styles from "./CinematicLayer.module.css";

interface Particle {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  opacitySpeed: number;
  color: [number, number, number];
  phase: number;
  phaseSpeed: number;
}

const CinematicLayer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];

    // Color palette: warm orange glow + cold blue monitor + cream
    const palette: [number, number, number][] = [
      [232, 101, 42],   // orange
      [245, 137, 58],   // orange warm
      [255, 180, 80],   // amber
      [58, 140, 223],   // monitor blue
      [240, 232, 216],  // cream/white
      [200, 160, 100],  // warm golden
    ];

    const createParticles = () => {
      particles = [];
      const count = Math.min(Math.floor((width * height) / 8000), 220);
      for (let i = 0; i < count; i++) {
        const color = palette[Math.floor(Math.random() * palette.length)];
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: Math.random(),
          baseX: Math.random() * width,
          baseY: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.08 - 0.04,
          size: Math.random() * 3.5 + 0.5,
          opacity: Math.random() * 0.6 + 0.1,
          opacitySpeed: (Math.random() * 0.004 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
          color,
          phase: Math.random() * Math.PI * 2,
          phaseSpeed: Math.random() * 0.008 + 0.003,
        });
      }
    };

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createParticles();
    };

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX / width;
      mouseRef.current.targetY = e.clientY / height;
    };

    const handleTouch = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouseRef.current.targetX = e.touches[0].clientX / width;
        mouseRef.current.targetY = e.touches[0].clientY / height;
      }
    };

    const drawParticle = (p: Particle) => {
      const parallaxX = (mouseRef.current.x - 0.5) * p.z * 60;
      const parallaxY = (mouseRef.current.y - 0.5) * p.z * 40;
      const px = p.x + parallaxX;
      const py = p.y + parallaxY;

      const gSize = p.size * (4 + p.z * 8);
      const gradient = ctx!.createRadialGradient(px, py, 0, px, py, gSize);
      const [r, g, b] = p.color;
      const alpha = Math.max(0, Math.min(1, p.opacity));

      gradient.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
      gradient.addColorStop(0.3, `rgba(${r},${g},${b},${alpha * 0.4})`);
      gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);

      ctx!.globalCompositeOperation = "screen";
      ctx!.beginPath();
      ctx!.arc(px, py, gSize, 0, Math.PI * 2);
      ctx!.fillStyle = gradient;
      ctx!.fill();
    };

    const animate = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;

      // Smooth mouse follow
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      ctx!.clearRect(0, 0, width, height);

      for (const p of particles) {
        // Sine-wave floating motion
        p.x = p.baseX + Math.sin(t * p.phaseSpeed + p.phase) * 80;
        p.y += p.vy;
        p.y = ((p.y % height) + height) % height;
        p.baseX += p.vx;
        p.baseX = ((p.baseX % width) + width) % width;

        // Breathe opacity
        p.opacity += p.opacitySpeed;
        if (p.opacity > 0.7 || p.opacity < 0.05) p.opacitySpeed *= -1;

        drawParticle(p);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("touchmove", handleTouch, { passive: true });
    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("touchmove", handleTouch);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
};

export default CinematicLayer;

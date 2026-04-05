"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  angle: number;
}

const PARTICLE_COUNT = 50;
const PARTICLE_COUNT_MOBILE = 25;

function createParticle(width: number, height: number): Particle {
  // Spawn from edges
  const edge = Math.random();
  let x: number, y: number;
  if (edge < 0.25) { x = 0; y = Math.random() * height; }
  else if (edge < 0.5) { x = width; y = Math.random() * height; }
  else if (edge < 0.75) { x = Math.random() * width; y = 0; }
  else { x = Math.random() * width; y = height; }

  const targetX = width * 0.5;
  const targetY = height * 0.5;
  const angle = Math.atan2(targetY - y, targetX - x);

  return {
    x, y,
    size: 2 + Math.random() * 3,
    opacity: 0.15 + Math.random() * 0.35,
    speed: 0.2 + Math.random() * 0.4,
    angle,
  };
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animFrameRef = useRef<number>(0);

  const initParticles = useCallback((width: number, height: number) => {
    const isMobile = width < 768;
    const count = isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT;
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      particles.push(createParticle(width, height));
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = rect.width;
      canvas.height = rect.height;
      initParticles(canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width * 0.5;
      const centerY = canvas.height * 0.5;
      const mouse = mouseRef.current;

      particlesRef.current.forEach((p, i) => {
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;

        // Mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80 && dist > 0) {
          const force = (80 - dist) / 80;
          p.x += (dx / dist) * force * 2;
          p.y += (dy / dist) * force * 2;
        }

        // Fade near center
        const distToCenter = Math.sqrt((p.x - centerX) ** 2 + (p.y - centerY) ** 2);
        const fadeRadius = 80;
        const alpha = distToCenter < fadeRadius
          ? p.opacity * (distToCenter / fadeRadius)
          : p.opacity;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 136, ${alpha})`;
        ctx.fill();

        // Respawn
        if (distToCenter < 30 || p.x < -20 || p.x > canvas.width + 20 || p.y < -20 || p.y > canvas.height + 20) {
          particlesRef.current[i] = createParticle(canvas.width, canvas.height);
        }
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
      style={{ width: "100%", height: "100%", pointerEvents: "auto" }}
    />
  );
}

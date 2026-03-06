import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  fadeSpeed: number;
  isFadingIn: boolean;
  maxOpacity: number;
}

export const ParticleCanvas = ({ theme }: { theme: 'light' | 'dark' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationFrameId = useRef<number>(0);

  const createParticle = (width: number, height: number, initialY?: number): Particle => {
    const sizeGroups = [
      { min: 2, max: 4 },
      { min: 5, max: 7 },
      { min: 8, max: 12 }
    ];
    const group = sizeGroups[Math.floor(Math.random() * sizeGroups.length)];
    const size = Math.random() * (group.max - group.min) + group.min;
    
    return {
      x: Math.random() * width,
      y: initialY !== undefined ? initialY : Math.random() * height,
      size: size,
      speedY: -(Math.random() * 0.5 + 0.2), // Slow upward movement
      speedX: (Math.random() - 0.5) * 0.2, // Slight horizontal drift
      opacity: 0,
      fadeSpeed: Math.random() * 0.01 + 0.005,
      isFadingIn: true,
      maxOpacity: Math.random() * 0.5 + 0.3 // Ensure visibility
    };
  };

  const initParticles = (width: number, height: number) => {
    const particleCount = Math.floor((width * height) / 15000); // Density based on screen size
    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push(createParticle(width, height));
    }
    particles.current = newParticles;
  };

  const updateParticles = (width: number, height: number) => {
    particles.current.forEach((p, index) => {
      p.y += p.speedY;
      p.x += p.speedX;

      // Opacity logic for fade in/out
      if (p.isFadingIn) {
        p.opacity += p.fadeSpeed;
        if (p.opacity >= p.maxOpacity) {
          p.opacity = p.maxOpacity;
          p.isFadingIn = false;
        }
      } else {
        // Start fading out when near the top
        if (p.y < height * 0.2) {
          p.opacity -= p.fadeSpeed;
        }
      }

      // Respawn logic
      if (p.y < -p.size || p.opacity <= 0) {
        particles.current[index] = createParticle(width, height, height + p.size);
      }
    });
  };

  const drawParticles = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.current.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      
      // Mix of white and pastel pink
      const isPink = i % 3 === 0;
      const color = isPink ? '255, 193, 204' : '255, 255, 255';
      
      // Add glow effect
      ctx.shadowBlur = p.size * 2.5; 
      ctx.shadowColor = `rgba(${color}, ${p.opacity * 0.9})`;
      
      ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
      ctx.fill();
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const animate = () => {
      updateParticles(canvas.width, canvas.height);
      drawParticles(canvas, ctx);
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

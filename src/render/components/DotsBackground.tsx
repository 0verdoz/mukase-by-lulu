import React, { useEffect, useRef } from 'react';

interface DotsBackgroundProps {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
}

export const DotsBackground: React.FC<DotsBackgroundProps> = ({
  dotSize = 1.75,
  gap = 26,
  baseColor = 'rgba(120, 113, 108, 0.22)',
  activeColor = 'rgba(234, 88, 12, 0.65)', // warm terracotta / ember
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 120,
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / gap) + 1;
      const rows = Math.ceil(height / gap) + 1;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const originX = i * gap;
          const originY = j * gap;

          // Gentle ambient drift wave ("little bit of move")
          const waveX = Math.sin(time + originY * 0.02) * 1.8;
          const waveY = Math.cos(time + originX * 0.02) * 1.8;

          let posX = originX + waveX;
          let posY = originY + waveY;

          // Mouse proximity reaction (Framer Dots style interaction)
          const dx = mouse.x - posX;
          const dy = mouse.y - posY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let currentSize = dotSize;
          let isHovered = false;

          if (dist < mouse.radius) {
            const force = (1 - dist / mouse.radius);
            const angle = Math.atan2(dy, dx);
            // Gentle displacement away from cursor
            posX -= Math.cos(angle) * force * 14;
            posY -= Math.sin(angle) * force * 14;
            currentSize = dotSize + force * 2.2;
            isHovered = true;
          }

          ctx.beginPath();
          ctx.arc(posX, posY, currentSize, 0, Math.PI * 2);
          ctx.fillStyle = isHovered ? activeColor : baseColor;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [dotSize, gap, baseColor, activeColor]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-90 transition-opacity duration-700"
    />
  );
};

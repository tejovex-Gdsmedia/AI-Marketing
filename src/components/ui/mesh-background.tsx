'use client';

import { useEffect, useRef } from 'react';

export default function MeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const cols = 16;
    const rows = 10;
    const points: { x: number; y: number; ox: number; oy: number }[] = [];

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        points.push({
          x: (w / (cols - 1)) * i,
          y: (h / (rows - 1)) * j,
          ox: (w / (cols - 1)) * i,
          oy: (h / (rows - 1)) * j,
        });
      }
    }

    let t = 0;
    let animId: number;

    const draw = () => {
      ctx.fillStyle = '#0a0a0c';
      ctx.fillRect(0, 0, w, h);
      t += 0.008;

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        p.x = p.ox + Math.sin(t + i * 0.5) * 40 + Math.sin(t * 0.7 + i) * 25;
        p.y = p.oy + Math.cos(t * 0.6 + i * 0.4) * 30 + Math.cos(t + i) * 20;
      }

      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 0.8;

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }

      points.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      for (let i = 0; i < points.length; i++) {
        const idx = i;
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        points[i].ox = (w / (cols - 1)) * col;
        points[i].oy = (h / (rows - 1)) * row;
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

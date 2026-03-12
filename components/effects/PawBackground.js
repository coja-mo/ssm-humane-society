'use client';
import { useEffect, useRef } from 'react';

const PAW_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor"><ellipse cx="50" cy="65" rx="22" ry="18"/><ellipse cx="28" cy="38" rx="10" ry="13" transform="rotate(-15 28 38)"/><ellipse cx="72" cy="38" rx="10" ry="13" transform="rotate(15 72 38)"/><ellipse cx="18" cy="55" rx="9" ry="11" transform="rotate(-25 18 55)"/><ellipse cx="82" cy="55" rx="9" ry="11" transform="rotate(25 82 55)"/></svg>`;

export default function PawBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const pawsRef = useRef([]);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = document.documentElement.scrollHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Create floating paws
    const count = Math.floor((w * h) / 80000);
    pawsRef.current = Array.from({ length: Math.min(count, 40) }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: 12 + Math.random() * 20,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.008,
      speed: 0.15 + Math.random() * 0.4,
      opacity: 0.04 + Math.random() * 0.06,
      baseOpacity: 0.04 + Math.random() * 0.06,
      drift: Math.random() * Math.PI * 2,
      driftSpeed: 0.002 + Math.random() * 0.004,
    }));

    // Create paw image
    const img = new Image();
    const blob = new Blob([PAW_SVG.replace('currentColor', 'rgba(41,171,226,1)')], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    img.src = url;

    function drawPaw(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;
      ctx.drawImage(img, -p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y + window.scrollY;

      pawsRef.current.forEach(p => {
        // Float upward slowly
        p.y -= p.speed;
        p.drift += p.driftSpeed;
        p.x += Math.sin(p.drift) * 0.5;
        p.rotation += p.rotSpeed;

        // Mouse interaction — glow brighter near cursor
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const force = (200 - dist) / 200;
          p.opacity = Math.min(0.3, p.baseOpacity + force * 0.2);
          p.x += dx * force * 0.015;
          p.y += dy * force * 0.015;
        } else {
          p.opacity += (p.baseOpacity - p.opacity) * 0.02;
        }

        // Reset when off screen
        if (p.y < -50) {
          p.y = h + 50;
          p.x = Math.random() * w;
        }
        if (p.x < -50) p.x = w + 50;
        if (p.x > w + 50) p.x = -50;

        drawPaw(p);
      });

      animRef.current = requestAnimationFrame(animate);
    }

    img.onload = () => { animate(); };

    function handleMove(e) {
      const rect = canvas.getBoundingClientRect();
      if (e.touches) {
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = e.touches[0].clientY;
      } else {
        mouseRef.current.x = e.clientX;
        mouseRef.current.y = e.clientY;
      }
    }

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove, { passive: true });

    // Resize observer for page height changes
    const ro = new ResizeObserver(() => { resize(); });
    ro.observe(document.body);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      ro.disconnect();
      URL.revokeObjectURL(url);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}

'use client';
import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(pointer: coarse)').matches) {
      if (el) el.style.display = 'none';
      return;
    }

    let x = -500, y = -500;
    let cx = -500, cy = -500;
    let raf;

    function onMove(e) {
      x = e.clientX;
      y = e.clientY;
    }

    function animate() {
      cx += (x - cx) * 0.08;
      cy += (y - cy) * 0.08;
      el.style.left = cx + 'px';
      el.style.top = cy + 'px';
      raf = requestAnimationFrame(animate);
    }

    window.addEventListener('mousemove', onMove);
    animate();

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="cursor-glow" aria-hidden="true" />;
}

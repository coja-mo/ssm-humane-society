'use client';
import { useEffect } from 'react';

export default function useScrollReveal() {
  useEffect(() => {
    const observed = new Set();

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

    function scanAndObserve() {
      const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger');
      els.forEach(el => {
        if (!observed.has(el)) {
          observed.add(el);
          obs.observe(el);
        }
      });
    }

    // Initial scan
    scanAndObserve();

    // Watch for dynamically added elements
    const mutObs = new MutationObserver(() => {
      scanAndObserve();
    });
    mutObs.observe(document.body, { childList: true, subtree: true });

    return () => {
      obs.disconnect();
      mutObs.disconnect();
    };
  }, []);
}

'use client';
import { useState, useEffect, useCallback } from 'react';

/**
 * Debounce hook — returns a debounced version of the value.
 * Useful for search inputs that trigger API calls.
 * @param {any} value - Value to debounce
 * @param {number} delay - Delay in ms (default 300)
 * @returns {any}
 */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

/**
 * Local storage hook with SSR safety.
 * @param {string} key - Storage key
 * @param {any} initialValue - Default value
 * @returns {[any, Function]}
 */
export function useLocalStorage(key, initialValue) {
  const [stored, setStored] = useState(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const val = value instanceof Function ? value(stored) : value;
      setStored(val);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(val));
      }
    } catch (err) {
      console.warn(`useLocalStorage: failed to set "${key}"`, err);
    }
  }, [key, stored]);

  return [stored, setValue];
}

/**
 * Copy to clipboard hook.
 * @returns {{ copied: boolean, copy: (text: string) => void }}
 */
export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  return { copied, copy };
}

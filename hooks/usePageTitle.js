'use client';
import { useEffect } from 'react';

const SITE_NAME = 'SSM Humane Society';

/**
 * Sets the document title for client-side pages.
 * Since our pages are 'use client', we use this hook to set per-page titles.
 * Format: "Page Title | SSM Humane Society"
 * @param {string} title - The page title
 */
export default function usePageTitle(title) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | ${SITE_NAME}`;
    }
    return () => {
      document.title = `${SITE_NAME} — Find Your Furever Friend`;
    };
  }, [title]);
}

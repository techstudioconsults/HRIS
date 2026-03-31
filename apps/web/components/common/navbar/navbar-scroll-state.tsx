'use client';

import { useEffect } from 'react';

const NAV_SCROLL_THRESHOLD = 20;

export const NavbarScrollState = () => {
  useEffect(() => {
    const navRoot = document.getElementById('site-navbar-root');
    const navPanel = document.getElementById('site-navbar-panel');

    if (!navRoot || !navPanel) {
      return;
    }

    const syncState = () => {
      const isScrolled = window.scrollY > NAV_SCROLL_THRESHOLD;
      const value = isScrolled ? 'true' : 'false';
      navRoot.dataset.scrolled = value;
      navPanel.dataset.scrolled = value;
    };

    syncState();
    window.addEventListener('scroll', syncState, { passive: true });

    return () => {
      window.removeEventListener('scroll', syncState);
    };
  }, []);

  return null;
};

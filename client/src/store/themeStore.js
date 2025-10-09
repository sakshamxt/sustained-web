// src/store/themeStore.js - NEW FILE

import { create } from 'zustand';

const useThemeStore = create((set, get) => ({
  theme: localStorage.getItem('vite-ui-theme') || 'light', // Default to light theme

  setTheme: (newTheme) => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      set({ theme: 'system' });
      localStorage.setItem('vite-ui-theme', 'system');
      return;
    }

    root.classList.add(newTheme);
    set({ theme: newTheme });
    localStorage.setItem('vite-ui-theme', newTheme);
  },

  // A function to apply the theme when the app loads
  applyTheme: () => {
    const storedTheme = localStorage.getItem('vite-ui-theme') || 'light';
    get().setTheme(storedTheme);
  }
}));

// Apply the theme on initial load
useThemeStore.getState().applyTheme();

export default useThemeStore;
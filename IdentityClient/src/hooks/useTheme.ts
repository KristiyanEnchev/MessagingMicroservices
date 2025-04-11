import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectIsDarkTheme,
  toggleTheme,
  setTheme
} from '@/services/theme/themeSlice';

export const useTheme = () => {
  const dispatch = useAppDispatch();
  
  // Theme selector
  const isDarkMode = useAppSelector(selectIsDarkTheme);
  
  // Apply theme class to HTML element on mount and when theme changes
  useEffect(() => {
    // Apply theme to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Apply theme color meta tag
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        isDarkMode ? '#111827' : '#f9fafb'
      );
    }
  }, [isDarkMode]);
  
  /**
   * Toggle between dark and light mode
   */
  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };
  
  /**
   * Set specific theme mode
   */
  const setDarkMode = (value: boolean) => {
    dispatch(setTheme(value));
  };
  
  /**
   * Initialize theme based on user preference
   */
  const initializeTheme = () => {
    // If no theme is set, check user preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    dispatch(setTheme(prefersDark));
  };
  
  return {
    // Theme state
    isDarkMode,
    
    // Theme actions
    toggleTheme: handleToggleTheme,
    setDarkMode,
    initializeTheme,
  };
};
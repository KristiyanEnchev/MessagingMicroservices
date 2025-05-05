import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectIsDarkTheme,
  toggleTheme,
  setTheme
} from '@/services/theme/themeSlice';

export const useTheme = () => {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector(selectIsDarkTheme);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        isDarkMode ? '#111827' : '#f9fafb'
      );
    }
  }, [isDarkMode]);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const setDarkMode = (value: boolean) => {
    dispatch(setTheme(value));
  };

  const initializeTheme = () => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    dispatch(setTheme(prefersDark));
  };

  return {
    isDarkMode,
    toggleTheme: handleToggleTheme,
    setDarkMode,
    initializeTheme,
  };
};

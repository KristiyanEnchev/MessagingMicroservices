import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  isDark: boolean;
  theme: string;
}

const getPreferredColorScheme = (): boolean => {
  try {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch (e) {
    return false;
  }
};

const initialState: ThemeState = {
  isDark: getPreferredColorScheme(),
  theme: getPreferredColorScheme() ? 'dark' : 'light'
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDark = !state.isDark;
      state.theme = state.isDark ? 'dark' : 'light';

      try {
        if (state.isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) { }
    },
    setTheme: (state, action: PayloadAction<boolean>) => {
      state.isDark = action.payload;
      state.theme = state.isDark ? 'dark' : 'light';

      try {
        if (state.isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) { }
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;

export const syncThemeWithDOM = (isDark: boolean) => {
  try {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {
    console.error('Failed to sync theme with DOM:', e);
  }
};

export default themeSlice.reducer;

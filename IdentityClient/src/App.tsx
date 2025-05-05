import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store/index';
import { AppRoutes } from './routes';
import { useEffect } from 'react';
import { syncThemeWithDOM } from '@/services/theme/themeSlice';
import { restoreAuthState } from '@/services/auth/authSlice';

const LoadingState = () => (
  <div className="flex items-center justify-center h-screen bg-background">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
  </div>
);

const AppStateInitializer = () => {
  const isDark = store.getState().theme?.isDark;

  useEffect(() => {
    syncThemeWithDOM(isDark);
    store.dispatch(restoreAuthState());
  }, []);

  return null;
};

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingState />} persistor={persistor}>
        <AppStateInitializer />
        <BrowserRouter future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}>
          <AppRoutes />
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
            }}
          />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;

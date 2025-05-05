import { toast as hotToast, Toaster, ToastBar } from 'react-hot-toast';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  X 
} from 'lucide-react';

export const Toast = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        style: {
          background: 'var(--background)',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: '500',
        },
        success: {
          style: {
            background: 'rgb(220, 252, 231)',
            borderColor: 'rgb(134, 239, 172)',
            color: 'rgb(22, 101, 52)',
          },
        },
        error: {
          style: {
            background: 'rgb(254, 226, 226)',
            borderColor: 'rgb(252, 165, 165)',
            color: 'rgb(153, 27, 27)',
          },
        },
        loading: {
          style: {
            background: 'rgb(224, 242, 254)',
            borderColor: 'rgb(125, 211, 252)',
            color: 'rgb(14, 118, 168)',
          },
        },
        custom: {
          style: {
            background: 'rgb(254, 249, 195)',
            borderColor: 'rgb(253, 224, 71)',
            color: 'rgb(133, 77, 14)',
          },
        },
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ message }) => (
            <>
              {t.type === 'success' && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
              {t.type === 'error' && (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              {t.type === 'loading' && (
                <Info className="w-5 h-5 text-blue-600" />
              )}
              {t.type === 'custom' && (
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              )}
              <div className="flex-1">{message}</div>
              <button
                onClick={() => hotToast.dismiss(t.id)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
};

export const showToast = {
  success: (message: string) => hotToast.success(message),
  error: (message: string) => hotToast.error(message),
  loading: (message: string) => hotToast.loading(message),
  warning: (message: string) => hotToast.custom(message),
  info: (message: string) => hotToast.custom(message, {
    style: {
      background: 'rgb(224, 242, 254)',
      borderColor: 'rgb(125, 211, 252)',
      color: 'rgb(14, 118, 168)',
    },
    icon: <Info className="w-5 h-5 text-blue-600" />,
  }),
};
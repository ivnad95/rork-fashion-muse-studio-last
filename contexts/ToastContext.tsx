import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast, { ToastType } from '@/components/Toast';

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('info');
  const [toastDuration, setToastDuration] = useState(3000);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration: number = 3000) => {
      setToastMessage(message);
      setToastType(type);
      setToastDuration(duration);
      setToastVisible(true);
    },
    []
  );

  const hideToast = useCallback(() => {
    setToastVisible(false);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast
        message={toastMessage}
        type={toastType}
        duration={toastDuration}
        visible={toastVisible}
        onHide={hideToast}
      />
    </ToastContext.Provider>
  );
}

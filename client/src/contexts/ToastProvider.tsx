import {
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import { Toast, type ToastMessage } from 'primereact/toast';
import { ToastContext } from './toast-context';

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const toastRef = useRef<Toast>(null);

  const showToast = useCallback((message: ToastMessage) => {
    toastRef.current?.show(message);
  }, []);

  const showSuccess = useCallback(
    (summary: string, detail?: string) => {
      showToast({
        severity: 'success',
        summary,
        detail,
        life: 3000,
      });
    },
    [showToast],
  );

  const showError = useCallback(
    (summary: string, detail?: string) => {
      showToast({
        severity: 'error',
        summary,
        detail,
        life: 4000,
      });
    },
    [showToast],
  );

  const showInfo = useCallback(
    (summary: string, detail?: string) => {
      showToast({
        severity: 'info',
        summary,
        detail,
        life: 3000,
      });
    },
    [showToast],
  );

  const value = useMemo(
    () => ({
      showSuccess,
      showError,
      showInfo,
    }),
    [showSuccess, showError, showInfo],
  );

  return (
    <ToastContext.Provider value={value}>
      <Toast ref={toastRef} position="top-right" />
      {children}
    </ToastContext.Provider>
  );
}
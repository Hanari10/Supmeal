import { createContext } from 'react';

export interface ToastContextValue {
  showSuccess: (summary: string, detail?: string) => void;
  showError: (summary: string, detail?: string) => void;
  showInfo: (summary: string, detail?: string) => void;
}

export const ToastContext = createContext<ToastContextValue | undefined>(
  undefined,
);
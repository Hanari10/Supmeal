import React from 'react';
import ReactDOM from 'react-dom/client';
import { PrimeReactProvider } from 'primereact/api';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';
import { router } from './router';
import { ToastProvider } from './contexts/ToastProvider';

import 'primereact/resources/themes/lara-light-green/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PrimeReactProvider value={{ ripple: true }}>
      <ToastProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ToastProvider>
    </PrimeReactProvider>
  </React.StrictMode>,
);
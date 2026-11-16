// Einstieg des Clients (F01): gespeichertes Theme wiederherstellen, Router aufbauen, App rendern.
// TanStack Query übernimmt die Server-Aufrufe (F05, F06).

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createAppRouter } from './router.tsx';
import { restoreTheme } from './theme.ts';
import './styles.css';

restoreTheme();
const router = createAppRouter();
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);

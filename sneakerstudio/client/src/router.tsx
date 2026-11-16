// Routen der App (F01): die App-Shell als Rahmen, darin die Seiten.

import { createRootRoute, createRoute, createRouter, type RouterHistory } from '@tanstack/react-router';
import { ActivationPage } from './ActivationPage.tsx';
import { AppShell } from './AppShell.tsx';
import { HomePage } from './HomePage.tsx';
import { LoginPage } from './LoginPage.tsx';
import { RegistrationPage } from './RegistrationPage.tsx';
import { WelcomePage } from './WelcomePage.tsx';

const rootRoute = createRootRoute({ component: AppShell });

const routeTree = rootRoute.addChildren([
  createRoute({ getParentRoute: () => rootRoute, path: '/', component: HomePage }),
  createRoute({ getParentRoute: () => rootRoute, path: '/registrieren', component: RegistrationPage }),
  // Ziel des Links aus der Bestätigungsmail: /aktivieren?token=…
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/aktivieren',
    validateSearch: (search: Record<string, unknown>) => ({
      token: typeof search.token === 'string' ? search.token : '',
    }),
    component: ActivationPage,
  }),
  createRoute({ getParentRoute: () => rootRoute, path: '/anmelden', component: LoginPage }),
  createRoute({ getParentRoute: () => rootRoute, path: '/willkommen', component: WelcomePage }),
]);

// Ohne history nutzt der Router die Browser-Adresse; Tests übergeben eine Memory-History.
export function createAppRouter(history?: RouterHistory) {
  return createRouter({ routeTree, history });
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}

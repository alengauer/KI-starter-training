import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppShell } from './AppShell.tsx';

const MAX = {
  salutation: 'mr',
  firstName: 'Max',
  lastName: 'Mustermann',
  street: 'Bahnhofsplatz',
  houseNumber: '1',
  postalCode: '96444',
  city: 'Coburg',
  email: 'max@example.de',
  phone: null,
};
const fetchMock = vi.fn<(url: string, init?: RequestInit) => Promise<Response>>();

// Simuliert /api/session: angemeldet als customer bzw. abgemeldet (null); DELETE meldet ab.
function sessionOf(customer: typeof MAX | null) {
  fetchMock.mockImplementation(async (_url, init) => {
    if (init?.method === 'DELETE') return new Response(null, { status: 204 });
    return new Response(JSON.stringify({ customer }), { status: 200 });
  });
}

function renderShell(path = '/') {
  const rootRoute = createRootRoute({ component: AppShell });
  const router = createRouter({
    routeTree: rootRoute.addChildren([
      createRoute({ getParentRoute: () => rootRoute, path: '/', component: () => <p>Seiteninhalt</p> }),
      createRoute({ getParentRoute: () => rootRoute, path: '/konto', component: () => <p>Kontoseite</p> }),
    ]),
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  render(
    <QueryClientProvider client={new QueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

describe('F01 App-Shell', () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
    vi.stubGlobal('matchMedia', () => ({ matches: false })); // Systemeinstellung: hell
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
    sessionOf(null);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('zeigt die Wortmarke als Link zur Startseite', async () => {
    renderShell();

    const wordmark = await screen.findByRole('link', { name: 'SneakerStudio' });
    expect(wordmark.getAttribute('href')).toBe('/');
  });

  it('zeigt die aktuelle Seite im Inhaltsbereich', async () => {
    renderShell();

    expect((await screen.findByRole('main')).textContent).toContain('Seiteninhalt');
  });

  it('wechselt per Umschalter den Modus, passt die Beschriftung an und speichert die Wahl', async () => {
    renderShell();

    fireEvent.click(await screen.findByRole('button', { name: 'Zum dunklen Design wechseln' }));

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('sneakerstudio-theme')).toBe('dark');
    fireEvent.click(screen.getByRole('button', { name: 'Zum hellen Design wechseln' }));
    expect(document.documentElement.dataset.theme).toBe('light');
  });
});

describe('F08 Anmeldung im Header (UC 1.5.1, UC 1.5.4, UC 1.6.1)', () => {
  beforeEach(() => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('zeigt abgemeldet "Anmelden" mit dem Ziel /anmelden', async () => {
    sessionOf(null);
    renderShell();

    expect((await screen.findByRole('link', { name: 'Anmelden' })).getAttribute('href')).toBe('/anmelden');
    expect(screen.queryByRole('button', { name: 'Abmelden' })).toBeNull();
  });

  it('zeigt angemeldet die persönliche Anrede und "Abmelden"', async () => {
    sessionOf(MAX);
    renderShell();

    expect(await screen.findByText('Herr Mustermann')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Abmelden' })).toBeTruthy();
    expect(screen.queryByRole('link', { name: 'Anmelden' })).toBeNull();
  });

  it('meldet ab und zeigt danach die Startseite', async () => {
    sessionOf(MAX);
    renderShell('/konto');

    fireEvent.click(await screen.findByRole('button', { name: 'Abmelden' }));

    expect(await screen.findByText('Seiteninhalt')).toBeTruthy();
    expect(await screen.findByRole('link', { name: 'Anmelden' })).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledWith('/api/session', expect.objectContaining({ method: 'DELETE' }));
  });
});

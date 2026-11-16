import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createMemoryHistory } from '@tanstack/react-router';
import { cleanup, render, screen } from '@testing-library/react';
import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createAppRouter } from './router.tsx';

const fetchMock = vi.fn<(url: string, init: RequestInit) => Promise<Response>>();
const respond = (status: number) => new Response('{}', { status });

function openActivationLink(token = 'abc123') {
  const history = createMemoryHistory({ initialEntries: [`/aktivieren?token=${token}`] });
  render(
    <StrictMode>
      <QueryClientProvider client={new QueryClient()}>
        <RouterProvider router={createAppRouter(history)} />
      </QueryClientProvider>
    </StrictMode>,
  );
}

describe('F06 Aktivierungsseite (Fachkonzept 1.3, UC 1.3.4)', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    // Die Sitzungsabfrage des Headers meldet „abgemeldet“; fetchMock sieht nur die Aktivierung.
    vi.stubGlobal('fetch', (url: string, init: RequestInit) =>
      url === '/api/session' ? Promise.resolve(respond(401)) : fetchMock(url, init),
    );
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('aktiviert beim Öffnen genau einmal mit dem Token aus dem Link', async () => {
    fetchMock.mockResolvedValue(respond(200));
    openActivationLink('abc123');
    await screen.findByRole('heading', { name: 'Konto erfolgreich aktiviert!' });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('/api/activations');
    expect(init.method).toBe('POST');
    expect(JSON.parse(String(init.body))).toEqual({ token: 'abc123' });
  });

  it('zeigt während der Prüfung "Dein Konto wird aktiviert …"', async () => {
    fetchMock.mockReturnValue(new Promise(() => {}));
    openActivationLink();

    expect(await screen.findByText('Dein Konto wird aktiviert …')).toBeTruthy();
  });

  it('begrüßt nach erfolgreicher Aktivierung und bietet "Jetzt anmelden" an (UC 1.5.5)', async () => {
    fetchMock.mockResolvedValue(respond(200));
    openActivationLink();

    expect(await screen.findByRole('heading', { name: 'Konto erfolgreich aktiviert!' })).toBeTruthy();
    expect(screen.getByText('Willkommen bei SneakerStudio. Viel Spaß beim Entdecken!')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Jetzt anmelden' }).getAttribute('href')).toBe('/anmelden');
  });

  it('meldet einen abgelaufenen Link, das gelöschte Konto und bietet die Neuregistrierung an', async () => {
    fetchMock.mockResolvedValue(respond(410));
    openActivationLink();

    expect(await screen.findByRole('heading', { name: 'Dein Bestätigungslink ist abgelaufen.' })).toBeTruthy();
    expect(screen.getByText('Dein Kundenkonto wurde gelöscht.')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Neues Kundenkonto erstellen' }).getAttribute('href')).toBe(
      '/registrieren',
    );
  });

  it('meldet einen unbekannten Link als ungültig', async () => {
    fetchMock.mockResolvedValue(respond(404));
    openActivationLink();

    expect(await screen.findByRole('heading', { name: 'Dieser Bestätigungslink ist ungültig.' })).toBeTruthy();
  });

  it('meldet einen unerwarteten Fehler', async () => {
    fetchMock.mockResolvedValue(respond(500));
    openActivationLink();

    expect(
      await screen.findByRole('heading', {
        name: 'Die Aktivierung ist fehlgeschlagen. Bitte versuche es später erneut.',
      }),
    ).toBeTruthy();
  });
});

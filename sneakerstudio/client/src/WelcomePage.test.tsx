import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createMemoryHistory } from '@tanstack/react-router';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createAppRouter } from './router.tsx';

const MAX = {
  salutation: 'mr',
  firstName: 'Max',
  lastName: 'Mustermann',
  street: 'Bahnhofsplatz',
  houseNumber: '1',
  postalCode: '96444',
  city: 'Coburg',
  email: 'max@example.de',
  phone: '+4995619600',
};

function openWelcomePage(customer: Record<string, unknown> | null) {
  vi.stubGlobal('fetch', async () => new Response(JSON.stringify({ customer }), { status: 200 }));
  const router = createAppRouter(createMemoryHistory({ initialEntries: ['/willkommen'] }));
  render(
    <QueryClientProvider client={new QueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
  return router;
}

describe('F09 Willkommensseite (UC 1.6.1–1.6.3)', () => {
  beforeEach(() => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it.each([
    ['mr', 'Willkommen, Herr Mustermann!'],
    ['ms', 'Willkommen, Frau Mustermann!'],
    ['unspecified', 'Willkommen, Max Mustermann!'],
  ])('begrüßt bei Anrede "%s" mit "%s"', async (salutation, greeting) => {
    openWelcomePage({ ...MAX, salutation });

    expect((await screen.findByRole('heading', { level: 1 })).textContent).toBe(greeting);
  });

  it('zeigt die gespeicherten Kontaktdaten', async () => {
    openWelcomePage(MAX);
    await screen.findByRole('heading', { name: 'Deine Kontaktdaten' });

    for (const text of ['Herr', 'Max Mustermann', 'Bahnhofsplatz 1', '96444 Coburg', 'max@example.de', '+4995619600']) {
      expect(screen.getByText(text)).toBeTruthy();
    }
    expect(screen.queryByText(/Passwort/)).toBeNull();
  });

  it('zeigt die Telefonnummer nur, wenn sie hinterlegt ist', async () => {
    openWelcomePage({ ...MAX, phone: null });
    await screen.findByRole('heading', { name: 'Deine Kontaktdaten' });

    expect(screen.queryByText('Telefonnummer')).toBeNull();
  });

  it('führt zur Startseite', async () => {
    openWelcomePage(MAX);

    expect((await screen.findByRole('link', { name: 'Zur Startseite' })).getAttribute('href')).toBe('/');
  });

  it('leitet ohne Anmeldung zur Anmeldeseite', async () => {
    const router = openWelcomePage(null);

    expect(await screen.findByRole('heading', { level: 1, name: 'Anmelden' })).toBeTruthy();
    expect(router.state.location.pathname).toBe('/anmelden');
  });
});

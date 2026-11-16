import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createMemoryHistory } from '@tanstack/react-router';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createAppRouter } from './router.tsx';

const fetchMock = vi.fn<(url: string, init: RequestInit) => Promise<Response>>();
const respond = (status: number, body: unknown = {}) => new Response(JSON.stringify(body), { status });
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
// Wer laut GET /api/session angemeldet ist – nach erfolgreicher Anmeldung der Kunde.
let sessionCustomer: typeof MAX | null = null;

function loginSucceeds() {
  fetchMock.mockResolvedValue(respond(200, { customer: MAX }));
  sessionCustomer = MAX;
}

async function openLoginPage() {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <RouterProvider router={createAppRouter(createMemoryHistory({ initialEntries: ['/anmelden'] }))} />
    </QueryClientProvider>,
  );
  await screen.findByRole('heading', { level: 1, name: 'Anmelden' });
}

function enter(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

const submitButton = () => screen.getByRole<HTMLButtonElement>('button', { name: 'Anmelden' });

function signIn() {
  enter('E-Mail-Adresse', 'max@example.de');
  enter('Passwort', 'Sneaker1!');
  fireEvent.click(submitButton());
}

describe('F08 Anmeldeseite (UC 1.5.1–1.5.3)', () => {
  beforeEach(async () => {
    fetchMock.mockReset();
    sessionCustomer = null;
    // GET /api/session liefert sessionCustomer (anfangs niemand); alle anderen Aufrufe prüft fetchMock.
    vi.stubGlobal('fetch', (url: string, init?: RequestInit) =>
      url === '/api/session' && !init?.method
        ? Promise.resolve(respond(200, { customer: sessionCustomer }))
        : fetchMock(url, init ?? {}),
    );
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    await openLoginPage();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('zeigt E-Mail-Adresse und Passwort mit Kennzeichnung für Passwort-Manager', () => {
    expect(screen.getByLabelText('E-Mail-Adresse').getAttribute('autocomplete')).toBe('email');
    const password = screen.getByLabelText('Passwort');
    expect(password.getAttribute('type')).toBe('password');
    expect(password.getAttribute('autocomplete')).toBe('current-password');
  });

  it('aktiviert "Anmelden" erst, wenn beide Felder ausgefüllt sind', () => {
    expect(submitButton().disabled).toBe(true);

    enter('E-Mail-Adresse', 'max@example.de');
    expect(submitButton().disabled).toBe(true);

    enter('Passwort', 'Sneaker1!');
    expect(submitButton().disabled).toBe(false);

    enter('E-Mail-Adresse', '   ');
    expect(submitButton().disabled).toBe(true);
  });

  it('sendet die Anmeldung und öffnet danach die Willkommensseite', async () => {
    loginSucceeds();
    signIn();

    expect(await screen.findByRole('heading', { level: 1, name: 'Willkommen, Herr Mustermann!' })).toBeTruthy();
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('/api/session');
    expect(init.method).toBe('POST');
    expect(JSON.parse(String(init.body))).toEqual({ email: 'max@example.de', password: 'Sneaker1!' });
  });

  it('zeigt nach der Anmeldung sofort die persönliche Anrede im Header', async () => {
    loginSucceeds();
    signIn();

    expect(await screen.findByText('Herr Mustermann')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Abmelden' })).toBeTruthy();
  });

  it('zeigt "Du wirst angemeldet …" und sperrt den Button, solange die Prüfung läuft', async () => {
    fetchMock.mockReturnValue(new Promise(() => {}));
    signIn();

    expect(await screen.findByText('Du wirst angemeldet …')).toBeTruthy();
    expect(submitButton().disabled).toBe(true);
  });

  it.each([
    [401, 'E-Mail-Adresse oder Passwort ist falsch'],
    [403, 'Bitte bestätige zuerst deine E-Mail-Adresse über den Link in unserer E-Mail.'],
    [429, 'Zu viele Anmeldeversuche. Bitte versuche es in 15 Minuten erneut.'],
  ])('zeigt bei %i den Hinweis "%s"', async (status, hint) => {
    fetchMock.mockResolvedValue(respond(status, { error: hint }));
    signIn();

    expect((await screen.findByRole('alert')).textContent).toBe(hint);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Anmelden');
  });

  it('meldet einen unerwarteten Fehler', async () => {
    fetchMock.mockResolvedValue(respond(500));
    signIn();

    expect((await screen.findByRole('alert')).textContent).toBe(
      'Die Anmeldung ist fehlgeschlagen. Bitte versuche es später erneut.',
    );
  });

  it('bietet "Noch kein Konto? Registrieren" an', () => {
    expect(screen.getByRole('link', { name: 'Registrieren' }).getAttribute('href')).toBe('/registrieren');
  });
});

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createMemoryHistory } from '@tanstack/react-router';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
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
  phone: null,
};

// GET /api/session liefert den angemeldeten Kunden bzw. null.
function renderAt(path: string, customer: typeof MAX | null = null) {
  vi.stubGlobal('fetch', async () => new Response(JSON.stringify({ customer }), { status: 200 }));
  render(
    <QueryClientProvider client={new QueryClient()}>
      <RouterProvider router={createAppRouter(createMemoryHistory({ initialEntries: [path] }))} />
    </QueryClientProvider>,
  );
}

const hero = async () => within(await screen.findByRole('main'));

describe('F02 Startseite (UC 1.1.1)', () => {
  beforeEach(() => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('zeigt die Überschrift aus der Design-Vorlage', async () => {
    renderAt('/');

    expect((await screen.findByRole('heading', { level: 1 })).textContent).toBe('Dein Sneaker. Dein Style.');
  });

  it('zeigt die Option "Neues Kundenkonto erstellen" mit dem Ziel /registrieren', async () => {
    renderAt('/');

    const option = await screen.findByRole('link', { name: 'Neues Kundenkonto erstellen' });
    expect(option.getAttribute('href')).toBe('/registrieren');
  });

  it('öffnet beim Klick auf die Option die Registrierung', async () => {
    renderAt('/');

    fireEvent.click(await screen.findByRole('link', { name: 'Neues Kundenkonto erstellen' }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Konto erstellen' })).toBeTruthy();
  });
});

describe('F07 Landing Page (UC 1.4.1, UC 1.4.2)', () => {
  beforeEach(() => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('bietet neben der Registrierung "Anmelden" an', async () => {
    renderAt('/');

    expect((await hero()).getByRole('link', { name: 'Anmelden' }).getAttribute('href')).toBe('/anmelden');
  });

  it('zeigt angemeldeten Kunden "Zu meinem Konto" statt der Einstiege', async () => {
    renderAt('/', MAX);

    const main = await hero();
    expect((await main.findByRole('link', { name: 'Zu meinem Konto' })).getAttribute('href')).toBe('/willkommen');
    expect(main.queryByRole('link', { name: 'Neues Kundenkonto erstellen' })).toBeNull();
    expect(main.queryByRole('link', { name: 'Anmelden' })).toBeNull();
  });

  it('zeigt die vier Werte', async () => {
    renderAt('/');

    const values = within(await screen.findByRole('list', { name: 'Unsere Werte' })).getAllByRole('listitem');
    expect(values.map((value) => value.textContent)).toEqual([
      'Individuell gestalten',
      'Hochwertig kaufen',
      'Persönlich erleben',
      'Nachhaltig handeln',
    ]);
  });

  it('erklärt den Ablauf in drei Schritten', async () => {
    renderAt('/');

    await screen.findByRole('heading', { name: "So einfach geht's" });
    for (const text of [
      'Registrieren',
      'Gib deine Kontaktdaten ein und wähle ein Passwort.',
      'E-Mail bestätigen',
      'Klicke innerhalb von 24 Stunden auf den Link in unserer E-Mail.',
      'Loslegen',
      'Melde dich an und starte dein Sneaker-Erlebnis.',
    ]) {
      expect(screen.getByText(text)).toBeTruthy();
    }
  });

  it('zeigt die vier Vorteile aus der Design-Vorlage', async () => {
    renderAt('/');

    await screen.findByRole('heading', { name: 'Deine Vorteile auf einen Blick' });
    for (const text of [
      'Schnell & einfach',
      'In wenigen Schritten zum eigenen Konto.',
      'Sicher & vertrauenswürdig',
      'Höchste Sicherheitsstandards für deine Daten.',
      'Persönlich & individuell',
      'Maßgeschneiderte Empfehlungen und Angebote.',
      'Sofort startklar',
      'Direkter Zugriff auf alle Funktionen und exklusive Vorteile.',
    ]) {
      expect(screen.getByText(text)).toBeTruthy();
    }
  });
});

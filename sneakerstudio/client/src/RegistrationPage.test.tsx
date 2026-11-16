import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createMemoryHistory, createRootRoute, createRouter } from '@tanstack/react-router';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RegistrationPage } from './RegistrationPage.tsx';

const VALID_CONTACT: Record<string, string> = {
  Anrede: 'ms',
  Vorname: 'Erika',
  Nachname: 'Mustermann',
  Straße: 'Hauptstraße',
  Hausnummer: '12a',
  PLZ: '96444',
  Ort: 'Coburg',
  'E-Mail-Adresse': 'erika@example.de',
};
const VALID_PASSWORD: Record<string, string> = { Passwort: 'Sneaker1!', 'Passwort wiederholen': 'Sneaker1!' };

function enter(label: string, value: string) {
  const field = screen.getByLabelText(label);
  fireEvent.change(field, { target: { value } });
  fireEvent.blur(field);
}

function enterAll(values: Record<string, string>) {
  for (const [label, value] of Object.entries(values)) enter(label, value);
}

const submitButton = () => screen.getByRole<HTMLButtonElement>('button', { name: 'Konto anlegen' });

// Die Seite allein in einem kleinen Test-Router – ohne Header und dessen Sitzungsabfrage.
async function renderPage() {
  const router = createRouter({
    routeTree: createRootRoute({ component: RegistrationPage }),
    history: createMemoryHistory({ initialEntries: ['/registrieren'] }),
  });
  render(
    <QueryClientProvider client={new QueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
  await screen.findByRole('heading', { level: 1, name: 'Konto erstellen' });
}

describe('F03 Formular Kontaktdaten (UC 1.1.2)', () => {
  beforeEach(async () => {
    await renderPage();
  });

  afterEach(() => {
    cleanup();
  });

  it('zeigt alle Kontaktfelder; die Anrede bietet Herr, Frau und Keine Angabe', () => {
    for (const label of [...Object.keys(VALID_CONTACT), 'Telefonnummer (optional)']) {
      expect(screen.getByLabelText(label)).toBeTruthy();
    }
    const options = [...screen.getByLabelText<HTMLSelectElement>('Anrede').options].filter((o) => !o.disabled);
    expect(options.map((o) => o.textContent)).toEqual(['Herr', 'Frau', 'Keine Angabe']);
  });

  it('bietet "Bereits ein Konto? Anmelden" an (UC 1.5.1)', () => {
    expect(screen.getByRole('link', { name: 'Anmelden' }).getAttribute('href')).toBe('/anmelden');
  });

  it('zeigt keinen Hinweis, solange das Feld nicht verlassen wurde', () => {
    fireEvent.change(screen.getByLabelText('E-Mail-Adresse'), { target: { value: 'max@domain' } });

    expect(screen.queryByText('Bitte gib eine gültige E-Mail-Adresse ein')).toBeNull();
  });

  it.each([
    ['Anrede', '', 'Bitte wähle eine Anrede aus'],
    ['Vorname', '', 'Bitte fülle alle Pflichtfelder aus'],
    ['Straße', 'Hauptstr.', 'Die Straße darf nur Buchstaben, Leerzeichen und Bindestriche enthalten'],
    ['Hausnummer', '12 a', 'Die Hausnummer darf nur Ziffern, Buchstaben, / und - enthalten'],
    ['PLZ', '1011', 'Bitte gib Deine korrekte Postleitzahl ein'],
    ['Ort', 'Musterstadt', 'Bitte gib einen existierenden Ort in Deutschland ein'],
    ['E-Mail-Adresse', 'max@domain', 'Bitte gib eine gültige E-Mail-Adresse ein'],
    ['Telefonnummer (optional)', '0151 1234567', 'Bitte gib eine gültige Telefonnummer mit der Vorwahl +49 ein'],
  ])('zeigt beim Verlassen von "%s" mit "%s" den Hinweis "%s"', (label, value, hint) => {
    enter(label, value);

    const field = screen.getByLabelText(label);
    expect(field.getAttribute('aria-invalid')).toBe('true');
    expect(document.getElementById(field.getAttribute('aria-describedby') ?? '')?.textContent).toBe(hint);
  });

  it('meldet an der PLZ, wenn PLZ und Ort nicht zusammenpassen (UC 1.1.2.3)', () => {
    enter('PLZ', '80331');
    enter('Ort', 'Berlin');

    expect(screen.getByText('Bitte gib Deine korrekte Postleitzahl ein')).toBeTruthy();
  });

  it('entfernt den Hinweis, sobald die Eingabe gültig ist', () => {
    enter('E-Mail-Adresse', 'max@domain');
    enter('E-Mail-Adresse', 'max@domain.de');

    expect(screen.queryByText('Bitte gib eine gültige E-Mail-Adresse ein')).toBeNull();
    expect(screen.getByLabelText('E-Mail-Adresse').getAttribute('aria-invalid')).toBeNull();
  });

  it('aktiviert "Konto anlegen" erst, wenn alle Pflichtfelder gültig sind', () => {
    const { Ort, ...withoutCity } = VALID_CONTACT;
    enterAll({ ...withoutCity, ...VALID_PASSWORD });
    expect(submitButton().disabled).toBe(true);

    enter('Ort', Ort ?? '');
    expect(submitButton().disabled).toBe(false);
  });

  it('blockiert nicht bei leerer, aber bei ungültiger Telefonnummer (UC 1.1.2.6)', () => {
    enterAll({ ...VALID_CONTACT, ...VALID_PASSWORD });
    expect(submitButton().disabled).toBe(false);

    enter('Telefonnummer (optional)', '0151');
    expect(submitButton().disabled).toBe(true);

    enter('Telefonnummer (optional)', '+49 151 1234567');
    expect(submitButton().disabled).toBe(false);
  });
});

describe('F04 Passwort festlegen (UC 1.2.1, UC 1.2.2)', () => {
  const HELP = 'Mindestens 8 Zeichen, ein Sonderzeichen, ein Großbuchstabe und eine Zahl';
  const RULE =
    'Das Passwort muss mindestens 8 Zeichen lang sein und mindestens ein Sonderzeichen, einen Großbuchstaben sowie eine Zahl enthalten';
  const MISMATCH = 'Die Passwörter stimmen nicht überein';
  const describedText = (label: string) =>
    document.getElementById(screen.getByLabelText(label).getAttribute('aria-describedby') ?? '')?.textContent;

  beforeEach(async () => {
    await renderPage();
  });

  afterEach(() => {
    cleanup();
  });

  it('maskiert beide Felder und kennzeichnet sie für Passwort-Manager als neues Passwort', () => {
    for (const label of Object.keys(VALID_PASSWORD)) {
      const field = screen.getByLabelText(label);
      expect(field.getAttribute('type')).toBe('password');
      expect(field.getAttribute('autocomplete')).toBe('new-password');
    }
  });

  it('zeigt die Regeln als Hilfetext und ersetzt ihn bei ungültigem Passwort durch den Hinweis', () => {
    expect(describedText('Passwort')).toBe(HELP);

    enter('Passwort', 'sneaker1!');

    expect(describedText('Passwort')).toBe(RULE);
    expect(screen.queryByText(HELP)).toBeNull();
  });

  it('meldet eine abweichende Wiederholung nach dem Verlassen', () => {
    enter('Passwort', 'Sneaker1!');
    enter('Passwort wiederholen', 'Sneaker1?');

    expect(describedText('Passwort wiederholen')).toBe(MISMATCH);
  });

  it('bewertet die Wiederholung neu, sobald sich das Passwort ändert', () => {
    enter('Passwort', 'Sneaker1!');
    enter('Passwort wiederholen', 'Sneaker2!');
    expect(screen.getByText(MISMATCH)).toBeTruthy();

    enter('Passwort', 'Sneaker2!');
    expect(screen.queryByText(MISMATCH)).toBeNull();
  });

  it('aktiviert "Konto anlegen" nur mit gültigem und übereinstimmendem Passwort', () => {
    enterAll(VALID_CONTACT);
    expect(submitButton().disabled).toBe(true);

    enter('Passwort', 'Sneaker1!');
    expect(submitButton().disabled).toBe(true);

    enter('Passwort wiederholen', 'Sneaker1!');
    expect(submitButton().disabled).toBe(false);

    enter('Passwort', 'sneaker1!');
    expect(submitButton().disabled).toBe(true);
  });
});

describe('F05 Kontoanlage beauftragen (UC 1.3.1, UC 1.3.2)', () => {
  const fetchMock = vi.fn<(url: string, init: RequestInit) => Promise<Response>>();
  const respond = (status: number, body: unknown = {}) => new Response(JSON.stringify(body), { status });

  function fillAndSubmit() {
    enterAll({ ...VALID_CONTACT, ...VALID_PASSWORD });
    fireEvent.click(submitButton());
  }

  beforeEach(async () => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
    await renderPage();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('sendet die Daten ohne Passwort-Wiederholung an POST /api/registrations', async () => {
    fetchMock.mockResolvedValue(respond(201));
    fillAndSubmit();
    await screen.findByText('Deine Kontaktdaten wurden erfolgreich verifiziert.');

    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('/api/registrations');
    expect(init.method).toBe('POST');
    expect(JSON.parse(String(init.body))).toEqual({
      salutation: 'ms',
      firstName: 'Erika',
      lastName: 'Mustermann',
      street: 'Hauptstraße',
      houseNumber: '12a',
      postalCode: '96444',
      city: 'Coburg',
      email: 'erika@example.de',
      phone: '',
      password: 'Sneaker1!',
    });
  });

  it('zeigt "in Bearbeitung" und sperrt den Button, solange die Kontoanlage läuft', async () => {
    let finish: (response: Response) => void = () => {};
    fetchMock.mockReturnValue(new Promise((resolve) => (finish = resolve)));
    fillAndSubmit();

    expect(await screen.findByText('Deine Kontoanlage ist in Bearbeitung.')).toBeTruthy();
    expect(submitButton().disabled).toBe(true);

    finish(respond(201));
    expect(await screen.findByText('Deine Kontaktdaten wurden erfolgreich verifiziert.')).toBeTruthy();
  });

  it('ersetzt das Formular nach erfolgreicher Verifizierung durch die Bestätigung', async () => {
    fetchMock.mockResolvedValue(respond(201));
    fillAndSubmit();

    expect(await screen.findByRole('heading', { name: 'Bitte bestätige deine E-Mail-Adresse' })).toBeTruthy();
    expect(
      screen.getByText('Wir haben dir eine E-Mail mit einem Bestätigungslink gesendet. Der Link ist 24 Stunden gültig.'),
    ).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Konto anlegen' })).toBeNull();
  });

  it('zeigt eine bereits registrierte E-Mail-Adresse am Feld und entfernt den Hinweis bei Änderung', async () => {
    fetchMock.mockResolvedValue(respond(409, { errors: { email: 'Diese E-Mail-Adresse ist bereits registriert' } }));
    fillAndSubmit();

    expect(await screen.findByText('Diese E-Mail-Adresse ist bereits registriert')).toBeTruthy();
    expect(submitButton().disabled).toBe(true);

    enter('E-Mail-Adresse', 'erika.neu@example.de');
    expect(screen.queryByText('Diese E-Mail-Adresse ist bereits registriert')).toBeNull();
    expect(submitButton().disabled).toBe(false);
  });

  it('meldet einen unerwarteten Fehler und erlaubt einen neuen Versuch', async () => {
    fetchMock.mockResolvedValue(respond(500));
    fillAndSubmit();

    expect(
      await screen.findByText('Die Kontoanlage ist fehlgeschlagen. Bitte versuche es später erneut.'),
    ).toBeTruthy();
    expect(submitButton().disabled).toBe(false);
  });
});

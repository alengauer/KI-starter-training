// Kontoaktivierung (F06, Fachkonzept 1.3): Der Klick auf den Link in der Bestätigungsmail genügt –
// die Seite aktiviert das Konto beim Öffnen und zeigt das Ergebnis (Folie 8, Schritt 5).

import { useQuery } from '@tanstack/react-query';
import { Link, useSearch } from '@tanstack/react-router';
import type { ReactNode } from 'react';

type ActivationResult = 'activated' | 'expired' | 'invalid';

const BUTTON_CLASS =
  'mt-8 inline-block rounded-md bg-primary px-6 py-3 text-sm font-bold tracking-wider text-on-primary uppercase hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent';

async function activateAccount(token: string): Promise<ActivationResult> {
  const response = await fetch('/api/activations', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ token }),
  });
  if (response.ok) return 'activated';
  if (response.status === 410) return 'expired';
  if (response.status === 404) return 'invalid';
  throw new Error(`Aktivierung fehlgeschlagen: HTTP ${response.status}`);
}

export function ActivationPage() {
  const { token } = useSearch({ from: '/aktivieren' });
  // Als Query: genau ein Aufruf je Link, auch wenn React die Seite doppelt einbindet (StrictMode).
  // Kein automatisches Neuladen – ein abgelaufenes Konto ist nach dem ersten Aufruf bereits gelöscht.
  const activation = useQuery({
    queryKey: ['activation', token],
    queryFn: () => activateAccount(token),
    retry: false,
    staleTime: Infinity,
  });

  if (activation.isPending) {
    return (
      <Card>
        <p role="status" className="text-muted">
          Dein Konto wird aktiviert …
        </p>
      </Card>
    );
  }

  if (activation.data === 'activated') {
    return (
      <Card>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="mx-auto size-16 text-accent"
          aria-hidden="true"
        >
          <circle cx="24" cy="24" r="22" />
          <path d="m15 24.5 6 6 12-13" strokeWidth={2} />
        </svg>
        <h1 className="mt-6 text-2xl font-extrabold tracking-tight">Konto erfolgreich aktiviert!</h1>
        <p className="mt-3 text-muted">Willkommen bei SneakerStudio. Viel Spaß beim Entdecken!</p>
        <Link to="/anmelden" className={BUTTON_CLASS}>
          Jetzt anmelden
        </Link>
      </Card>
    );
  }

  if (activation.data === 'expired') {
    return (
      <Card>
        <h1 className="text-2xl font-extrabold tracking-tight">Dein Bestätigungslink ist abgelaufen.</h1>
        <p className="mt-3 text-muted">Dein Kundenkonto wurde gelöscht.</p>
        <Link to="/registrieren" className={BUTTON_CLASS}>
          Neues Kundenkonto erstellen
        </Link>
      </Card>
    );
  }

  return (
    <Card>
      <h1 className="text-2xl font-extrabold tracking-tight">
        {activation.data === 'invalid'
          ? 'Dieser Bestätigungslink ist ungültig.'
          : 'Die Aktivierung ist fehlgeschlagen. Bitte versuche es später erneut.'}
      </h1>
    </Card>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <section className="mx-auto max-w-2xl rounded-xl border border-line bg-surface p-8 text-center">{children}</section>
  );
}

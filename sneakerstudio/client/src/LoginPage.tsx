// Anmeldung (F08, UC 1.5.1–1.5.3): Formular „Anmelden“; nach Erfolg geht es zur Willkommensseite (F09).
// Die Hinweise zu falschen Angaben, nicht aktiviertem Konto und Sperre liefert der Server.

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { sessionQuery, type Customer } from './session.ts';

const CONTROL_CLASS =
  'mt-1 block w-full rounded-md border border-field-line bg-field px-3 py-2 text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

type LoginResult = { signedIn: true; customer: Customer } | { signedIn: false; hint: string };

async function signIn(credentials: { email: string; password: string }): Promise<LoginResult> {
  const response = await fetch('/api/session', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (response.ok) return { signedIn: true, customer: ((await response.json()) as { customer: Customer }).customer };
  if (response.status === 401 || response.status === 403 || response.status === 429) {
    const { error } = (await response.json()) as { error: string };
    return { signedIn: false, hint: error };
  }
  throw new Error(`Anmeldung fehlgeschlagen: HTTP ${response.status}`);
}

export function LoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useMutation({
    mutationFn: signIn,
    onSuccess: (result) => {
      if (!result.signedIn) return;
      // Header und Willkommensseite kennen den Kunden sofort, ohne erneute Abfrage.
      queryClient.setQueryData(sessionQuery.queryKey, result.customer);
      void navigate({ to: '/willkommen' });
    },
  });
  const canSubmit = email.trim() !== '' && password !== '' && !login.isPending;
  const hint = login.isError
    ? 'Die Anmeldung ist fehlgeschlagen. Bitte versuche es später erneut.'
    : login.data?.signedIn === false
      ? login.data.hint
      : null;

  return (
    <section className="mx-auto max-w-md">
      <h1 className="text-3xl font-extrabold tracking-tight">Anmelden</h1>
      <div className="mt-4 h-1 w-12 bg-brand" aria-hidden="true" />

      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          if (canSubmit) login.mutate({ email, password });
        }}
        className="mt-8 space-y-5 rounded-xl border border-line bg-surface p-6 sm:p-8"
      >
        <div>
          <label htmlFor="email" className="text-sm font-medium">
            E-Mail-Adresse
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={CONTROL_CLASS}
          />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-medium">
            Passwort
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={CONTROL_CLASS}
          />
        </div>

        {hint && (
          <p role="alert" className="text-sm text-danger">
            {hint}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-md bg-primary px-6 py-3 text-sm font-bold tracking-wider text-on-primary uppercase enabled:hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            Anmelden
          </button>
          {login.isPending && (
            <p role="status" className="text-sm text-muted">
              Du wirst angemeldet …
            </p>
          )}
        </div>
      </form>

      <p className="mt-6 text-sm text-muted">
        Noch kein Konto?{' '}
        <Link to="/registrieren" className="font-semibold text-accent hover:underline">
          Registrieren
        </Link>
      </p>
    </section>
  );
}

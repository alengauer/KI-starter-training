// Willkommensseite (F09, UC 1.6.1–1.6.3): persönliche Begrüßung und Übersicht der gespeicherten Kontaktdaten.
// Nur für angemeldete Kunden – alle anderen werden zur Anmeldung geleitet (und kommen danach hierher zurück).

import { SALUTATIONS, formatAddressee } from '@sneakerstudio/shared/contact';
import { useQuery } from '@tanstack/react-query';
import { Link, Navigate } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { sessionQuery } from './session.ts';

export function WelcomePage() {
  const session = useQuery(sessionQuery);

  if (session.isPending) return null;
  if (!session.data) return <Navigate to="/anmelden" replace />;

  const customer = session.data;
  const salutation = SALUTATIONS.find((option) => option.value === customer.salutation)?.label;

  return (
    <section>
      <h1 className="text-3xl font-extrabold tracking-tight">Willkommen, {formatAddressee(customer)}!</h1>
      <div className="mt-4 h-1 w-12 bg-brand" aria-hidden="true" />

      <div className="mt-8 max-w-2xl rounded-xl border border-line bg-surface p-6 sm:p-8">
        <h2 className="text-sm font-semibold tracking-wider text-muted uppercase">Deine Kontaktdaten</h2>
        <dl className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-[10rem_1fr]">
          <Entry term="Anrede">{salutation}</Entry>
          <Entry term="Name">
            {customer.firstName} {customer.lastName}
          </Entry>
          <Entry term="Adresse">
            <span className="block">
              {customer.street} {customer.houseNumber}
            </span>
            <span className="block">
              {customer.postalCode} {customer.city}
            </span>
          </Entry>
          <Entry term="E-Mail-Adresse">{customer.email}</Entry>
          {customer.phone && <Entry term="Telefonnummer">{customer.phone}</Entry>}
        </dl>
      </div>

      <Link
        to="/"
        className="mt-8 inline-block rounded-md bg-primary px-6 py-3 text-sm font-bold tracking-wider text-on-primary uppercase hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        Zur Startseite
      </Link>
    </section>
  );
}

function Entry({ term, children }: { term: string; children: ReactNode }) {
  return (
    <>
      <dt className="text-sm text-muted">{term}</dt>
      <dd className="font-medium">{children}</dd>
    </>
  );
}

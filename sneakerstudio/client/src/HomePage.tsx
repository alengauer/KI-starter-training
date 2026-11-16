// Startseite als Landing Page (F02, F07; UC 1.1.1, 1.4.1, 1.4.2): Einstiege für neue und bestehende Kunden,
// Werte, Ablauf der Registrierung und Vorteile aus der Design-Vorlage (Folie 1 und 8).

import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { sessionQuery } from './session.ts';

const FOCUS_RING = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent';
const PRIMARY_BUTTON = `inline-block rounded-md bg-primary px-6 py-3 text-sm font-bold tracking-wider text-on-primary uppercase hover:brightness-110 ${FOCUS_RING}`;
const SECONDARY_BUTTON = `inline-block rounded-md border border-field-line px-6 py-3 text-sm font-bold tracking-wider uppercase hover:border-accent ${FOCUS_RING}`;

const VALUES = [
  { title: 'Individuell gestalten', icon: <path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3zM14.5 7.5l3 3" /> },
  {
    title: 'Hochwertig kaufen',
    icon: <path d="M2 3h3l2.6 12.4a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.8L21 7H6M9 20.5h.01M18 20.5h.01" />,
  },
  { title: 'Persönlich erleben', icon: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /> },
  { title: 'Nachhaltig handeln', icon: <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3z" /> },
];

const STEPS = [
  { title: 'Registrieren', text: 'Gib deine Kontaktdaten ein und wähle ein Passwort.' },
  { title: 'E-Mail bestätigen', text: 'Klicke innerhalb von 24 Stunden auf den Link in unserer E-Mail.' },
  { title: 'Loslegen', text: 'Melde dich an und starte dein Sneaker-Erlebnis.' },
];

const BENEFITS = [
  {
    title: 'Schnell & einfach',
    text: 'In wenigen Schritten zum eigenen Konto.',
    icon: <path d="M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM12 9v4l2.5 2.5M10 2h4" />,
  },
  {
    title: 'Sicher & vertrauenswürdig',
    text: 'Höchste Sicherheitsstandards für deine Daten.',
    icon: <path d="M7 11h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2zM8 11V7a4 4 0 0 1 8 0v4" />,
  },
  {
    title: 'Persönlich & individuell',
    text: 'Maßgeschneiderte Empfehlungen und Angebote.',
    icon: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0" />,
  },
  {
    title: 'Sofort startklar',
    text: 'Direkter Zugriff auf alle Funktionen und exklusive Vorteile.',
    icon: <path d="M5 8h14l-1 13H6L5 8zM9 8V6a3 3 0 0 1 6 0v2" />,
  },
];

export function HomePage() {
  const session = useQuery(sessionQuery);

  return (
    <>
      <section className="relative py-12 sm:py-20">
        {/* Dezenter Farbverlauf als grafischer Akzent – keine Produktfotos (F07, offene Bildrechte). */}
        <div
          className="pointer-events-none absolute -top-24 right-0 -z-10 size-96 rounded-full bg-brand/20 blur-3xl"
          aria-hidden="true"
        />
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
          Dein Sneaker. <span className="text-brand">Dein Style.</span>
        </h1>
        <div className="mt-6 h-1 w-12 bg-brand" aria-hidden="true" />
        <p className="mt-6 max-w-xl text-lg text-muted">
          Willkommen bei SneakerStudio. Erstelle dein Konto und erlebe Sneaker ganz neu.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          {session.data ? (
            <Link to="/willkommen" className={PRIMARY_BUTTON}>
              Zu meinem Konto
            </Link>
          ) : (
            <>
              <Link to="/registrieren" className={PRIMARY_BUTTON}>
                Neues Kundenkonto erstellen
              </Link>
              <Link to="/anmelden" className={SECONDARY_BUTTON}>
                Anmelden
              </Link>
            </>
          )}
        </div>
      </section>

      <ul aria-label="Unsere Werte" className="grid gap-6 border-y border-line py-10 md:grid-cols-4">
        {VALUES.map((value) => (
          <li key={value.title} className="flex items-center gap-4 md:flex-col md:text-center">
            <IconCircle>{value.icon}</IconCircle>
            <span className="text-sm font-semibold tracking-wider uppercase">{value.title}</span>
          </li>
        ))}
      </ul>

      <section className="py-16">
        <h2 className="text-2xl font-extrabold tracking-tight">So einfach geht's</h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span
                className="grid size-10 shrink-0 place-items-center rounded-full bg-primary font-bold text-on-primary"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-muted">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="pb-8">
        <h2 className="text-2xl font-extrabold tracking-tight">Deine Vorteile auf einen Blick</h2>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {BENEFITS.map((benefit) => (
            <li key={benefit.title} className="rounded-xl border border-line bg-surface p-6">
              <IconCircle>{benefit.icon}</IconCircle>
              <h3 className="mt-4 font-semibold">{benefit.title}</h3>
              <p className="mt-1 text-sm text-muted">{benefit.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

// Linien-Icon im Kreis wie in der Vorlage.
function IconCircle({ children }: { children: ReactNode }) {
  return (
    <span className="grid size-14 shrink-0 place-items-center rounded-full border border-accent/40 text-accent">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-7"
        aria-hidden="true"
      >
        {children}
      </svg>
    </span>
  );
}

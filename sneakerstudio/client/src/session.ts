// Sitzung im Client (F08): Wer ist angemeldet? Grundlage für Header, Willkommensseite (F09) und Landing Page (F07).

import type { NormalizedContact } from '@sneakerstudio/shared/contact';
import { queryOptions } from '@tanstack/react-query';

export type Customer = NormalizedContact;

// Liefert den angemeldeten Kunden oder null, wenn niemand angemeldet ist.
export const sessionQuery = queryOptions({
  queryKey: ['session'],
  queryFn: async (): Promise<Customer | null> => {
    const response = await fetch('/api/session');
    if (response.status === 401) return null;
    if (!response.ok) throw new Error(`Sitzung konnte nicht geladen werden: HTTP ${response.status}`);
    return ((await response.json()) as { customer: Customer }).customer;
  },
  retry: false,
});

export async function signOut(): Promise<void> {
  const response = await fetch('/api/session', { method: 'DELETE' });
  if (!response.ok) throw new Error(`Abmelden fehlgeschlagen: HTTP ${response.status}`);
}

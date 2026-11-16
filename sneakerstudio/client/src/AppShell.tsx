// App-Shell (F01): Header mit Wortmarke, Anmeldestatus (F08) und Theme-Umschalter, darunter die aktuelle Seite.

import { formatAddressee } from '@sneakerstudio/shared/contact';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, Outlet, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { sessionQuery, signOut } from './session.ts';
import { currentTheme, toggleTheme, type Theme } from './theme.ts';

const FOCUS_RING = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent';
const HEADER_ACTION = `rounded-md border border-line px-3 py-1.5 text-sm font-semibold hover:border-accent ${FOCUS_RING}`;

export function AppShell() {
  const [theme, setTheme] = useState<Theme>(currentTheme);
  const toggleLabel = theme === 'dark' ? 'Zum hellen Design wechseln' : 'Zum dunklen Design wechseln';
  const session = useQuery(sessionQuery);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const logout = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.setQueryData(sessionQuery.queryKey, null);
      void navigate({ to: '/' });
    },
  });

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <Link to="/" className={`rounded text-xl font-extrabold tracking-tight text-fg uppercase ${FOCUS_RING}`}>
            Sneaker<span className="text-brand">Studio</span>
          </Link>
          <div className="flex items-center gap-3">
            {session.data ? (
              <>
                <span className="text-sm text-muted">{formatAddressee(session.data)}</span>
                <button
                  type="button"
                  onClick={() => logout.mutate()}
                  disabled={logout.isPending}
                  className={HEADER_ACTION}
                >
                  Abmelden
                </button>
              </>
            ) : (
              !session.isPending && (
                <Link to="/anmelden" className={HEADER_ACTION}>
                  Anmelden
                </Link>
              )
            )}
            <button
              type="button"
              onClick={() => setTheme(toggleTheme())}
              aria-label={toggleLabel}
              title={toggleLabel}
              className={`rounded-full border border-line p-2 text-muted hover:text-fg ${FOCUS_RING}`}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <Outlet />
      </main>
    </div>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" className="size-5" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" className="size-5" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

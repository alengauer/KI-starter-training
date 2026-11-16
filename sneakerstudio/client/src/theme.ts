// Theme (F01): folgt der Systemeinstellung (das CSS wertet sie aus, solange kein data-theme gesetzt ist).
// Eine Wahl über den Umschalter setzt data-theme und wird im Browser gespeichert.

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'sneakerstudio-theme';

function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark';
}

function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isTheme(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function restoreTheme(): void {
  const stored = readStoredTheme();
  if (stored) document.documentElement.dataset.theme = stored;
}

export function currentTheme(): Theme {
  const applied = document.documentElement.dataset.theme;
  if (isTheme(applied)) return applied;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function toggleTheme(): Theme {
  const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Speicher blockiert: Die Wahl gilt dann nur bis zum Neuladen.
  }
  return next;
}

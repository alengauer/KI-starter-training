import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { currentTheme, restoreTheme, toggleTheme } from './theme.ts';

const STORAGE_KEY = 'sneakerstudio-theme';

function mockSystemTheme(theme: 'light' | 'dark') {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query === '(prefers-color-scheme: dark)' && theme === 'dark',
  }));
}

describe('F01 Theme', () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('folgt ohne gespeicherte Wahl der Systemeinstellung', () => {
    mockSystemTheme('dark');
    restoreTheme();

    expect(document.documentElement.dataset.theme).toBeUndefined();
    expect(currentTheme()).toBe('dark');
  });

  it('übernimmt beim Start die gespeicherte Wahl', () => {
    mockSystemTheme('dark');
    localStorage.setItem(STORAGE_KEY, 'light');
    restoreTheme();

    expect(document.documentElement.dataset.theme).toBe('light');
    expect(currentTheme()).toBe('light');
  });

  it('ignoriert ungültige gespeicherte Werte', () => {
    mockSystemTheme('light');
    localStorage.setItem(STORAGE_KEY, 'pink');
    restoreTheme();

    expect(currentTheme()).toBe('light');
  });

  it('wechselt beim Umschalten den Modus und speichert die Wahl', () => {
    mockSystemTheme('light');

    expect(toggleTheme()).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');

    expect(toggleTheme()).toBe('light');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('light');
  });

  it('funktioniert auch, wenn der Browser-Speicher blockiert ist', () => {
    mockSystemTheme('dark');
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Speicher blockiert');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Speicher blockiert');
    });

    restoreTheme();
    expect(toggleTheme()).toBe('light');
    expect(currentTheme()).toBe('light');
  });
});

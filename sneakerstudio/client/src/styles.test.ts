import { describe, expect, it } from 'vitest';
import css from './styles.css?raw';

type Mode = 'light' | 'dark';

// Liest "--color-<name>: light-dark(<hell>, <dunkel>);" bzw. "--color-<name>: <wert>;" aus styles.css.
function readTokens(source: string): Record<string, Record<Mode, string>> {
  const tokens: Record<string, Record<Mode, string>> = {};
  for (const [, name = '', value = ''] of source.matchAll(/--color-([a-z-]+):\s*([^;]+);/g)) {
    const [, light = value, dark = value] = value.match(/^light-dark\((#\w+),\s*(#\w+)\)$/) ?? [];
    tokens[name] = { light, dark };
  }
  return tokens;
}

function luminance(hex: string): number {
  const [r = 0, g = 0, b = 0] = [1, 3, 5].map((i) => {
    const channel = parseInt(hex.slice(i, i + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (lighter + 0.05) / (darker + 0.05);
}

const tokens = readTokens(css);

describe('F01 Design-Tokens', () => {
  it('entsprechen der Token-Tabelle aus F01 (Dark aus der Vorlage, Light abgeleitet)', () => {
    expect(tokens).toEqual({
      bg: { light: '#f1f2f6', dark: '#020716' },
      surface: { light: '#ffffff', dark: '#061226' },
      field: { light: '#f6f7fa', dark: '#0a192d' },
      'field-line': { light: '#7c8595', dark: '#5b6b82' },
      line: { light: '#d9dce3', dark: '#1e2a3b' },
      fg: { light: '#07122a', dark: '#f7fafc' },
      muted: { light: '#545a66', dark: '#a9aebb' },
      primary: { light: '#0656c0', dark: '#0656c0' },
      'on-primary': { light: '#ffffff', dark: '#ffffff' },
      brand: { light: '#0656c0', dark: '#0874e0' },
      accent: { light: '#0656c0', dark: '#2f86ee' },
      danger: { light: '#b42318', dark: '#f97066' },
    });
  });

  describe.each(['light', 'dark'] as const)('Kontraste im Modus "%s" (WCAG AA)', (mode) => {
    const color = (name: string) => tokens[name]?.[mode] ?? '';

    it.each([
      ['fg', 'bg'],
      ['fg', 'surface'],
      ['fg', 'field'],
      ['muted', 'bg'],
      ['muted', 'surface'],
      ['accent', 'bg'],
      ['accent', 'surface'],
      ['danger', 'bg'],
      ['danger', 'surface'],
      ['danger', 'field'],
      ['on-primary', 'primary'],
    ])('Text "%s" auf "%s" mindestens 4,5 : 1', (text, background) => {
      expect(contrast(color(text), color(background))).toBeGreaterThanOrEqual(4.5);
    });

    it('Wortmarke "brand" (große Schrift) auf "bg" mindestens 3 : 1', () => {
      expect(contrast(color('brand'), color('bg'))).toBeGreaterThanOrEqual(3);
    });

    it.each(['surface', 'field'])('Feldrahmen "field-line" zu "%s" mindestens 3 : 1 (WCAG 1.4.11)', (background) => {
      expect(contrast(color('field-line'), color(background))).toBeGreaterThanOrEqual(3);
    });
  });
});

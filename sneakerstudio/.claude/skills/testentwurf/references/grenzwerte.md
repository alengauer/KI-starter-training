# Grenzwertanalyse

Grundlage: ISTQB CTFL 4.0, Grenzwertanalyse (boundary value analysis). Nur für Klassen mit Ordnung: Längen, Zahlen, Zeiten.

## Prinzip

- Fehler häufen sich an den Rändern von Klassen, z. B. `>` statt `>=`.
- Grenzwert: kleinster oder größter Wert einer Klasse.
- **2-Wert-Variante (Standard):** je Grenze der Grenzwert und sein nächster Nachbar in der angrenzenden Klasse.
- **3-Wert-Variante:** je Grenze der Grenzwert und beide Nachbarn. Verwenden, wenn der Auftrag sie verlangt oder das Risiko hoch ist.
- Überdeckung = getestete Grenzwerte (und Nachbarn) / identifizierte Grenzwerte (und Nachbarn).

## Vorgehen

1. Von den Äquivalenzklassen ausgehen; nur geordnete Klassen betrachten.
2. Je Grenze die Werte bestimmen; Einheit nennen (Zeichen, Ziffern, Sekunden).
3. Jeder Grenzwert-Testfall verletzt höchstens die geprüfte Grenze; alle anderen Regeln sind erfüllt.
4. Soll-Länge eintragen; nachgezählt wird mit dem Prüfscript (`SKILL.md`, Abschnitt 3).

## Beispiele aus dem Fallbeispiel

| Regel | 2-Wert | 3-Wert (zusätzlich) | Testdaten |
|---|---|---|---|
| Passwort mindestens 8 Zeichen (UC 1.2.1) | 7, 8 | 9 | `Abcde1!` (7), `Abcdef1!` (8), `Abcdefg1!` (9) |
| Telefon: +49 und 3–15 Ziffern (F03) | 2, 3, 15, 16 Ziffern | 4, 14 | `+4912` (2), `+49123` (3), `+49123456789012345` (15), `+491234567890123456` (16) |
| Bestätigungslink 24 Stunden gültig (F06) | 24:00:00 h und Nachbar – Klassenzugehörigkeit von 24:00:00 ungeregelt | 23:59:59 h, 24:00:00 h, 24:00:01 h (Auflösung in Sekunden als Annahme) | Linkalter über steuerbare Uhr einstellen |

Hinweise:
- Telefon: Die Soll-Länge zählt die gesamte Eingabe (`+49123` = 6 Zeichen); die Regel zählt nur Ziffern nach +49. Beides in der Tabelle unterscheiden (Klasse „3 Ziffern nach +49“).
- Link: Ob der Link bei genau 24:00:00 noch gilt, regelt die Anforderung nicht – Klärungsfrage, nicht selbst entscheiden.

## Fallstricke

- Längen nie schätzen. Modelle zählen Zeichen unzuverlässig; jede Eingabe nachzählen oder mit dem Script prüfen.
- „Zeichen“: `Ab1!😀😀` hat 6 Zeichen, belegt aber 8 UTF-16-Einheiten. Welche Zählweise gilt, ist eine Klärungsfrage.
- Obergrenze fehlt (z. B. Passwort ohne Maximallänge): keine erfinden; als offene Frage melden.
- Grenzwert nicht isoliert testbar, weil eine andere Regel den Wert erzwingt: Konflikt benennen statt einen Testfall mit zwei Verstößen zu bauen.

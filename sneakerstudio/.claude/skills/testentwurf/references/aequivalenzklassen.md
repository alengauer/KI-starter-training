# Äquivalenzklassenbildung

Grundlage: ISTQB CTFL 4.0, Äquivalenzklassenbildung (equivalence partitioning).

## Prinzip

- Eingaben, die das System gleich verarbeiten soll, bilden eine Klasse. Ein Vertreter je Klasse genügt.
- Gültige Klassen: Werte, die angenommen werden. Ungültige Klassen: Werte, die abgelehnt werden.
- Jede Klasse leitet sich aus einer Regel der Anforderung ab; die Regel mit Fundstelle nennen.
- Überdeckung = getestete Klassen / identifizierte Klassen. Ziel: 100 %.

## Vorgehen

1. Je Feld alle Regeln sammeln (Pflicht, Format, Zeichenarten, Wertelisten, Abhängigkeiten).
2. Je Regel mindestens eine gültige und eine ungültige Klasse bilden.
3. Gültige Klassen dürfen in einem Testfall kombiniert werden.
4. Ungültige Klassen einzeln testen: je Testfall genau eine Regel verletzen, sonst verdeckt ein Fehler den anderen.
5. Klassen mit Ordnung (Längen, Zahlen, Zeiten) brauchen zusätzlich Grenzwerte; welche Anleitung dafür gilt, steht im Wegweiser `SKILL.md`.

## Beispiel: PLZ im Registrierungsformular (F03)

Regel: Pflicht; genau 5 Ziffern; im PLZ-Verzeichnis; passt zum Ort. Hinweis: „Bitte gib Deine korrekte Postleitzahl ein“.

| Klasse | gültig/ungültig | Vertreter |
|---|---|---|
| K1 5 Ziffern, im Verzeichnis, passt zum Ort | gültig | `96444` mit Coburg |
| K2 leer | ungültig | `<leer>` |
| K3 4 Ziffern | ungültig | `9644` |
| K4 6 Ziffern | ungültig | `964440` |
| K5 mit Buchstabe | ungültig | `9644A` |
| K6 5 Ziffern, nicht im Verzeichnis | ungültig | `12345` |
| K7 im Verzeichnis, passt nicht zum Ort | ungültig | `80331` mit Coburg |

Zusätzlich prüfen: Leerzeichen am Rand werden laut F03 vor der Prüfung entfernt (`␣96444` → gültig). Wird dieses Verhalten nicht beschrieben, als Annahme ausweisen.

## Beispiel: Passwort (UC 1.2.1)

Gültig: mindestens 8 Zeichen mit Sonderzeichen, Großbuchstabe und Ziffer (`Abcdef1!`). Ungültig, je eine Regel verletzt: zu kurz (`Abcde1!`), ohne Sonderzeichen (`Sneakers1`), ohne Großbuchstabe (`sneaker1!`), ohne Ziffer (`Sneakers!`), leer.

## Fallstricke

- Führende Null: `01067` ist Text; wird die PLZ als Zahl verarbeitet, geht die Null verloren.
- Zeichenarten ohne Definition (Sonderzeichen, Umlaute als Großbuchstaben): nicht selbst festlegen, sondern Klärungsfrage.
- Groß-/Kleinschreibung bei Wertelisten (Ort „coburg“): nur testen, was die Anforderung regelt; sonst Annahme.

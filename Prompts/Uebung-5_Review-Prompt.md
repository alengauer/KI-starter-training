# Übung 5 – Review-Prompt für den KI-Vergleich

- Chat: neuer Chat mit dem Übungsmodell, erst nach Abschluss der eigenen Prüfung (Arbeitsschritt 4)
- Enthalten: Teil A (Prüfgrundlage), Teil B (Auftrag), Teil C (Vorbedingung) und Teil D (Testfallsatz mit Abschlusssatz)

Den Inhalt des Kastens vollständig kopieren.

```text
Du prüfst Testfälle gegen eine Spezifikation.

Prüfgrundlage:
- PLZ: Pflichtfeld; genau 5 Ziffern; muss im PLZ-Verzeichnis stehen und zum Ort passen. Hinweis an der PLZ: „Bitte gib Deine korrekte Postleitzahl ein“. Sind PLZ und Ort bekannt, passen aber nicht zusammen, erscheint der Hinweis an der PLZ.
- E-Mail: Pflichtfeld; 6–320 Zeichen; Format „name@domain.tld“, Top-Level-Kennung aus mindestens 2 Buchstaben. Hinweis: „Bitte gib eine gültige E-Mail-Adresse ein“.
- Telefon: optional (leer erlaubt); sonst nach Normalisierung „+49“ gefolgt von 3–15 Ziffern. Hinweis: „Bitte gib eine gültige Telefonnummer mit der Vorwahl +49 ein“.
- Passwort: mindestens 8 Zeichen, mindestens ein Sonderzeichen, ein Großbuchstabe (Ä, Ö, Ü eingeschlossen) und eine Ziffer. Sonderzeichen = weder Buchstabe noch Ziffer noch Leerzeichen. Hinweis: „Das Passwort muss mindestens 8 Zeichen lang sein und mindestens ein Sonderzeichen, einen Großbuchstaben sowie eine Zahl enthalten“. Unter dem Feld steht dauerhaft der Hilfetext „Mindestens 8 Zeichen, ein Sonderzeichen, ein Großbuchstabe und eine Zahl“; nach Verlassen des Felds mit ungültigem Passwort wird er durch den Hinweis ersetzt.
- Passwort wiederholen: identisch mit dem Passwort. Hinweis nach Verlassen des Felds: „Die Passwörter stimmen nicht überein“.
- Button „Konto anlegen“: nur aktiv, wenn alle Felder gültig sind. Hinweise erscheinen, sobald ein ungültiges Feld verlassen wurde.
- PLZ-Verzeichnis (Auszug): 35390 Gießen · 44135 Dortmund · 44575 Castrop-Rauxel · 60311 Frankfurt am Main · 80331 München · 88662 Überlingen · 90402 Nürnberg · 96047 Bamberg · 96444 Coburg · 96450 Coburg · 97070 Würzburg

Auftrag der Testfallerstellung:
„Erstelle Testfälle für das Formular ‚Konto erstellen‘. F04 Passwort vollständig: alle Äquivalenzklassen der Passwortregel, 2-Wert-Grenzwertanalyse der Länge, Passwort-Wiederholung. F03: ausgewählte Fälle zu PLZ/Ort, E-Mail und Telefon, keine Vollständigkeit gefordert. Erwartete Hinweise wörtlich aus der Spezifikation.“

Testfälle:
Vorbedingung aller Testfälle: Formular „Konto erstellen“ geöffnet; alle nicht genannten Felder gültig befüllt mit dem Referenzdatensatz: Frau · Erika · Mustermann · Musterweg · 12a · 96450 · Coburg · erika.mustermann@example.de · Telefon leer · Passwort und Wiederholung „Sneaker#2026“. Bei Passwort-Testfällen wird die Wiederholung identisch befüllt, sofern nicht anders angegeben. Prüfung jeweils nach Verlassen des Felds.

| ID | Bezug | Technik / Klasse | Testdaten | Erwartetes Ergebnis |
|---|---|---|---|---|
| TC-01 | F03 PLZ | ÄK gültig: PLZ bekannt, passt zum Ort | PLZ 96450, Ort Coburg | Kein Hinweis; Button „Konto anlegen“ aktiv |
| TC-02 | F03 PLZ | ÄK ungültig: 4 Ziffern | PLZ 9645 | Hinweis an der PLZ: „Bitte gib Deine korrekte Postleitzahl ein“; Button inaktiv |
| TC-03 | F03 Ort | ÄK gültig: Ort mit Bindestrich | PLZ 44135, Ort Castrop-Rauxel | Kein Hinweis; Button aktiv |
| TC-04 | F03 PLZ/Ort | ÄK ungültig: PLZ und Ort bekannt, passen nicht zusammen | PLZ 80331, Ort Nürnberg | Hinweis an der PLZ: „Bitte gib Deine korrekte Postleitzahl ein“; kein Hinweis am Ort; Button inaktiv |
| TC-05 | F03 E-Mail | ÄK ungültig: ohne Top-Level-Kennung | erika@example | Hinweis: „Die E-Mail-Adresse muss eine Länderkennung wie .de enthalten“; Button inaktiv |
| TC-06 | F03 Telefon | GWA: kleinster gültiger Wert | +4912 (2 Ziffern nach +49) | Kein Hinweis; Button aktiv |
| TC-07 | F04 Passwort | GWA: Länge 7 (ungültig) | Abcde1! (7 Zeichen) | Hinweis: „Das Passwort muss mindestens 8 Zeichen lang sein und mindestens ein Sonderzeichen, einen Großbuchstaben sowie eine Zahl enthalten“; Button inaktiv |
| TC-08 | F04 Passwort | GWA: Länge 8 (gültig) | Abcdef1! (8 Zeichen) | Kein Hinweis; Hilfetext bleibt sichtbar; Button aktiv |
| TC-09 | F04 Passwort | ÄK ungültig: ohne Sonderzeichen | Abcdefg1 (8 Zeichen) | Hinweis zur Passwortregel (Wortlaut wie TC-07); Button inaktiv |
| TC-10 | F04 Passwort | ÄK ungültig: ohne Großbuchstabe | abcdef1! (8 Zeichen) | Hinweis zur Passwortregel (Wortlaut wie TC-07); Button inaktiv |
| TC-11 | F04 Passwort | ÄK gültig: Umlaut als einziger Großbuchstabe | Äpfelbaum7# (11 Zeichen) | Kein Hinweis; Button aktiv |
| TC-12 | F04 Passwort | ÄK ungültig: nur Buchstaben und Ziffern | Sommer2026 (10 Zeichen) | Hinweis zur Passwortregel (Wortlaut wie TC-07); Button inaktiv |
| TC-13 | F04 Wiederholung | ÄK ungültig: Wiederholung weicht ab | Passwort Sneaker#2026, Wiederholung Sneaker#2025 | Eine Fehlermeldung wird angezeigt |

Abschlusssatz der KI-Ausgabe: „Alle Äquivalenzklassen und Grenzwerte der Passwortregel sind abgedeckt.“

Gib eine Tabelle aus: Testfall-ID (oder "fehlt") | Fehlermuster | Begründung mit wörtlichem Zitat aus der Prüfgrundlage | Korrektur.
Prüfe auch, ob Klassen der Passwortregel fehlen.
Melde nur Abweichungen, die sich aus der Prüfgrundlage belegen lassen.
```

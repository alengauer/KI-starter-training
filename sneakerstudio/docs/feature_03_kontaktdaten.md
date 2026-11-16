# F03 Kontaktdaten erfassen

**Use Cases:** 1.1.2 Kontaktdaten eingeben mit 1.1.2.1 Anrede, 1.1.2.2 Straße und Hausnummer, 1.1.2.3 Postleitzahl, 1.1.2.4 Wohnort, 1.1.2.5 E-Mail-Adresse, 1.1.2.6 Telefonnummer; Fachkonzept 1.1 „Kontaktdaten-Verwaltung“
**Design-Vorlage:** Folie 8 – Schritt 2 „Kontodaten“ (Formular „Konto erstellen“)
**Pakete:** shared (Regeln, PLZ-Verzeichnis), client (Formular), server (erneute Prüfung bei der Kontoanlage, F05)

## Ziel
Der Benutzer gibt seine Kontaktdaten im Formular „Konto erstellen“ (Route `/registrieren`) ein. Jede Eingabe wird nach den Regeln der Use Cases geprüft; Client und Server verwenden dieselben Regeln.

## Felder & Regeln
| Feld | Pflicht | Regel | Hinweis | Quelle |
|---|---|---|---|---|
| Anrede | ja | genau eine aus „Herr“, „Frau“, „Keine Angabe“ (Auswahlliste) | „Bitte wähle eine Anrede aus“ | UC 1.1.2.1 |
| Vorname | ja | nicht leer | „Bitte fülle alle Pflichtfelder aus“ | Fachkonzept 1.1 |
| Nachname | ja | nicht leer | „Bitte fülle alle Pflichtfelder aus“ | Fachkonzept 1.1 („Name“) |
| Straße | ja | Buchstaben a–z/A–Z, Umlaute, ß, Leerzeichen, Bindestrich | leer: „Bitte fülle alle Pflichtfelder aus“ · ungültige Zeichen: „Die Straße darf nur Buchstaben, Leerzeichen und Bindestriche enthalten“ | UC 1.1.2.2 |
| Hausnummer | ja | Ziffern, Buchstaben a–z/A–Z, „/“, „-“ | leer: „Bitte fülle alle Pflichtfelder aus“ · ungültige Zeichen: „Die Hausnummer darf nur Ziffern, Buchstaben, / und - enthalten“ | UC 1.1.2.2 |
| PLZ | ja | genau 5 Ziffern; existiert im PLZ-Verzeichnis; passt zum Ort | „Bitte gib Deine korrekte Postleitzahl ein“ | UC 1.1.2.3 |
| Ort | ja | Buchstaben a–z/A–Z, Umlaute, ß, Leerzeichen, Bindestrich; existiert im PLZ-Verzeichnis | leer: „Bitte fülle alle Pflichtfelder aus“ · ungültige Zeichen: „Der Ort darf nur Buchstaben, Leerzeichen und Bindestriche enthalten“ · unbekannt: „Bitte gib einen existierenden Ort in Deutschland ein“ | UC 1.1.2.4 |
| E-Mail | ja | 6–320 Zeichen; Format `name@domain.tld`; Domain endet auf eine Länder- bzw. Top-Level-Kennung aus mind. 2 Buchstaben | „Bitte gib eine gültige E-Mail-Adresse ein“ | UC 1.1.2.5, Fachkonzept 1.1 |
| Telefon | nein | leer erlaubt; sonst nach Normalisierung `+49` gefolgt von 3–15 Ziffern | „Bitte gib eine gültige Telefonnummer mit der Vorwahl +49 ein“ | UC 1.1.2.6, Fachkonzept 1.1 |

## Verhalten
- Eingaben werden vor der Prüfung an Anfang und Ende von Leerzeichen befreit.
- Ein Hinweis erscheint, sobald ein Feld verlassen wurde und ungültig ist, und verschwindet, sobald es gültig ist.
- Der Button „Konto anlegen“ (= „Speichern-Button“ der Use Cases) ist nur aktiv, wenn alle Felder dieses Features und aus F04 gültig sind.
- PLZ ↔ Ort: PLZ unbekannt → Hinweis an der PLZ; Ort unbekannt → Hinweis am Ort; beide bekannt, passen aber nicht zusammen → Hinweis an der PLZ (UC 1.1.2.3: „muss … zum Ort passen“). Vergleich ohne Beachtung von Groß-/Kleinschreibung.
- Telefon-Standardformat: Leerzeichen, „-“, „/“, Klammern und „(0)“ werden entfernt, „0049“ wird zu „+49“. Gespeichert wird die normalisierte Form, z. B. `+49 (0)151 123-456` → `+49151123456`.
- Die E-Mail-Adresse wird klein geschrieben gespeichert (Grundlage der Eindeutigkeitsprüfung in F05).

## PLZ-Verzeichnis (Beispiel-Liste)
- Ca. 30 reale PLZ/Ort-Paare in `shared/` (Entscheidung: kleine Beispiel-Liste statt externem Dienst).
- Enthält gezielt Orte mit Umlauten, ß, Leerzeichen und Bindestrich, z. B. Nürnberg, Gießen, Frankfurt am Main, Castrop-Rauxel, Überlingen.
- Die Straße wird nicht auf Existenz geprüft: „Adresse existiert in Deutschland“ (UC 1.1.2.4) wird auf „PLZ und Ort existieren und passen zusammen“ reduziert.
- Adressen außerhalb der Liste werden abgelehnt. Für den Echtbetrieb wird die Liste durch einen Adressdienst ersetzt (dann über einen Server-Endpunkt).

## Annahmen & offene Punkte
- „Name“ im Fachkonzept = Nachname.
- Umlaute gelten in Groß- und Kleinschreibung (Ä, Ö, Ü, ä, ö, ü).
- Die Hinweise für ungültige Zeichen und unbekannte Orte sind abgeleitet – die Use Cases geben dafür keinen Text vor.
- *Entschieden:* Vorname/Nachname sind nur Pflichtfelder ohne Zeichenregeln (internationale Namen wie „José“ oder „O'Brien“ bleiben möglich).
- *Entschieden:* Straße strikt nach UC – Punkt und Ziffern sind nicht erlaubt, „Hauptstr.“ oder „Straße des 17. Juni“ werden abgelehnt.
- *Entschieden:* Hausnummer strikt nach UC – Leerzeichen sind nicht erlaubt, „12 a“ wird abgelehnt, „12a“ ist gültig.

## Testfälle
- **Unit (shared):** je Feld gültige und ungültige Beispiele inkl. Grenzwerte – E-Mail mit 5/6/320/321 Zeichen und ohne Top-Level-Kennung, Telefon mit 2/3/15/16 Ziffern und ohne +49, PLZ mit 4/5/6 Stellen und mit Buchstaben, Umlaute/ß/Bindestrich in Straße und Ort, Telefon-Normalisierung, PLZ passt/passt nicht zum Ort.
- **Komponente (client):** Hinweis erscheint nach Verlassen eines leeren bzw. ungültigen Felds mit exaktem Text; Button bleibt deaktiviert, bis alle Felder gültig sind; ein leeres Telefonfeld blockiert nicht.
- **API (server):** ungültige Kontaktdaten werden bei der Kontoanlage mit Feldhinweisen abgelehnt (siehe F05).
- **E2E:** Formular vollständig ausfüllen → Button wird aktiv.

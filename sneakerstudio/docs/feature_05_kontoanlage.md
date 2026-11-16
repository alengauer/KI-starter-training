# F05 Kontoanlage

**Use Cases:** 1.3.1 Kontoanlage beauftragen, 1.3.2 Kontaktdaten erfolgreich verifiziert, 1.3.3 Kunde angelegt; Fachkonzept 1.1 („Bestätigungsmeldung nach dem Absenden des Formulars“)
**Design-Vorlage:** Folie 8 – Übergang von Schritt 2 „Kontodaten“ zu Schritt 3 „Bestätigung“
**Pakete:** server (API, Kundenstamm), client (Absenden, Meldungen)

## Ziel
Nach Eingabe von Kontaktdaten und Passwort beauftragt der Benutzer die Kontoanlage. Das System prüft die Daten, stellt die Eindeutigkeit der E-Mail-Adresse im Kundenstamm (ERP) sicher, legt den Kunden an und versendet die Bestätigungsmail (F06).

## Ablauf
1. Klick auf „Konto anlegen“ → Meldung „Deine Kontoanlage ist in Bearbeitung.“ (UC 1.3.1); der Button ist währenddessen gesperrt.
2. Der Server prüft alle Felder mit den gemeinsamen Regeln aus F03 und F04.
3. Der Server prüft die E-Mail-Adresse auf Eindeutigkeit im Kundenstamm (UC 1.3.2).
4. Der Server legt den Kunden mit Status „nicht aktiviert“ an (UC 1.3.3) und versendet die Bestätigungsmail (F06).
5. Der Client ersetzt das Formular durch die Bestätigungsansicht (Folie 8, Schritt 3):
   „Deine Kontaktdaten wurden erfolgreich verifiziert.“ (UC 1.3.2) ·
   „Bitte bestätige deine E-Mail-Adresse“ ·
   „Wir haben dir eine E-Mail mit einem Bestätigungslink gesendet. Der Link ist 24 Stunden gültig.“

## API
`POST /api/registrations`
- Body: `salutation` (`mr` | `ms` | `unspecified`), `firstName`, `lastName`, `street`, `houseNumber`, `postalCode`, `city`, `email`, `phone` (optional), `password`
- `201` – Kunde angelegt, Bestätigungsmail versendet
- `409` – E-Mail-Adresse bereits vorhanden → Hinweis am E-Mail-Feld: „Diese E-Mail-Adresse ist bereits registriert“
- `422` – Validierungsfehler; die Antwort enthält je Feld den Hinweistext aus F03/F04
- `500` – unerwarteter Fehler → Meldung „Die Kontoanlage ist fehlgeschlagen. Bitte versuche es später erneut.“

## Kundenstamm (ERP-Adapter)
- Zugriff nur über ein Adapter-Interface; Implementierung mit `node:sqlite` (Entscheidung: SQLite + Datei-Postfach).
- Gespeichert werden: Anrede, Vor- und Nachname, Adresse, E-Mail (klein geschrieben, eindeutig), Telefon (normalisiert, optional), Passwort-Hash, Status, Hash des Aktivierungs-Tokens, Ablaufzeitpunkt, Anlagezeitpunkt.
- Die Datenbankdatei liegt lokal unter `server/data/` und wird nicht eingecheckt.
- Scheitert der Mailversand, wird die Anlage zurückgenommen, damit die E-Mail-Adresse nicht 24 Stunden blockiert bleibt.

## Annahmen & offene Punkte
- Die Verarbeitung läuft synchron in einem Request; „in Bearbeitung“ ist sichtbar, solange der Request läuft.
- Die Meldungstexte sind abgeleitet – die Use Cases beschreiben nur den Inhalt, keinen Wortlaut.
- Der Hinweis „bereits registriert“ verrät, dass eine Adresse existiert; UC 1.3.2 verlangt diese Rückmeldung ausdrücklich.

## Testfälle
- **API (server):** gültige Anlage → 201, Kunde gespeichert (Status „nicht aktiviert“, Passwort nur als Hash); doppelte E-Mail, auch in anderer Groß-/Kleinschreibung → 409; ungültige Felder → 422 mit Hinweistexten; Fehler beim Mailversand → 500 und kein Kunde gespeichert.
- **Komponente (client):** Während des Absendens erscheint „in Bearbeitung“; nach Erfolg die Bestätigungsansicht; bei 409 der Hinweis am E-Mail-Feld.
- **E2E:** kompletter Ablauf bis zur Bestätigungsansicht; eine zweite Registrierung mit derselben E-Mail zeigt den Hinweis.

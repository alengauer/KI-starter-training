# F09 Willkommensseite

**Use Cases:** 1.6.1 Persönliche Begrüßung, 1.6.2 Übersicht der Kontaktdaten, 1.6.3 Zugriff nur für angemeldete Kunden (Entwurf, `docs/usecases_entwurf.md`); 1.1.2.1 Anrede (Personalisierung der Kommunikation)
**Design-Vorlage:** Folie 8, Schritt 6 („Los geht's – Mein Konto“), Folie 5 („Kundenkonto: Profildaten“)
**Pakete:** shared (Anrede-Logik), client (Seite, Zugriffsschutz), server (Daten über `GET /api/session` aus F08)
**Status:** umgesetzt

## Ziel
Nach der Anmeldung begrüßt SneakerStudio den Kunden persönlich und zeigt ihm seine gespeicherten Kontaktdaten.

## Seite `/willkommen`
- Überschrift mit der Anrede wie in der Bestätigungsmail: „Willkommen, Herr Mustermann!“ · „Willkommen, Frau Mustermann!“ · bei „Keine Angabe“ „Willkommen, Max Mustermann!“
- Karte „Deine Kontaktdaten“: Anrede, Name, Straße und Hausnummer, PLZ und Ort, E-Mail-Adresse, Telefonnummer (nur wenn hinterlegt). Nur lesen – das Passwort erscheint nie.
- Link „Zur Startseite“.
- Nicht angemeldet → Weiterleitung zu `/anmelden`, nach erfolgreicher Anmeldung zurück zu `/willkommen`.

## Technik
- Die Anrede-Logik („Herr Mustermann“ / „Frau Mustermann“ / „Max Mustermann“) zieht aus der Bestätigungsmail (server) nach `shared`, damit Mail, Header und Willkommensseite dieselbe Regel verwenden.
- Der Zugriffsschutz prüft die Sitzung in der Seite und leitet ohne Anmeldung zu `/anmelden` weiter. *Entschieden:* in der Seite statt im Router – gleiches Verhalten für Kunden, ohne den Aufbau des Routers zu ändern.

## Testfälle
- **Unit (shared):** Anrede für Herr, Frau und Keine Angabe; die Bestätigungsmail liefert weiterhin dieselben Texte.
- **Komponente:** Begrüßung je Anrede; alle Kontaktdaten; Telefonnummer nur, wenn vorhanden; kein Passwort.
- **E2E:** Aufruf ohne Anmeldung → Anmeldeseite → nach der Anmeldung Willkommensseite mit Begrüßung.

## Bewusst nicht enthalten
- Mein-Konto-Menü (Bestellungen, Wunschliste …) und das Bearbeiten der Daten – Release 0.2 („Kundenkonto & Profil“).

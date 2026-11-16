# F06 Kontoaktivierung

**Use Cases:** 1.3 Kontoaktivierung (Fachkonzept), 1.3.3 Kunde angelegt (Bestätigungsmail), 1.3.4 Bestätigungsmail zum Kundenkonto versendet; 1.1.2.1 Anrede (Personalisierung der Kommunikation)
**Design-Vorlage:** Folie 8 – Schritt 3 „Bestätigung“ und Schritt 5 „Konto aktiviert“
**Pakete:** server (Mail, Aktivierung, Löschung), client (Aktivierungsseite)

## Ziel
Der Benutzer bestätigt seine E-Mail-Adresse über einen 24 Stunden gültigen Link und aktiviert damit sein Konto. Nicht bestätigte Konten werden nach 24 Stunden gelöscht.

## Bestätigungsmail
- Empfänger: die angegebene E-Mail-Adresse; Betreff: „Bitte bestätige dein SneakerStudio-Kundenkonto“.
- Anrede personalisiert (UC 1.1.2.1): „Hallo Herr Mustermann,“ · „Hallo Frau Mustermann,“ · bei „Keine Angabe“: „Hallo Max Mustermann,“.
- Enthält den Bestätigungslink `<APP_BASE_URL>/aktivieren?token=…` und den Hinweis, dass der Link 24 Stunden gültig ist und das Kundenkonto sonst gelöscht wird (UC 1.3.4).
- Versand über einen Mail-Adapter. Implementierung „Datei-Postfach“: Jede Mail wird als JSON-Datei in `server/data/outbox/` abgelegt und in der Konsole ausgegeben (Entscheidung: SQLite + Datei-Postfach).

## Aktivierungslink
- Token: zufällig (32 Byte), im Kundenstamm nur als Hash gespeichert, gültig 24 Stunden ab Anlage.
- `POST /api/activations` mit `{ token }`:
  - `200` – Konto aktiviert (auch bei erneutem Klick auf einen bereits verwendeten Link)
  - `410` – Link abgelaufen → das Konto wird sofort gelöscht
  - `404` – Link unbekannt

## Aktivierungsseite `/aktivieren`
- Aktiviert beim Öffnen automatisch – der Klick auf den Link genügt (Fachkonzept 1.3).
- Während der Prüfung: „Dein Konto wird aktiviert …“
- Erfolg (Folie 8, Schritt 5): „Konto erfolgreich aktiviert!“ · „Willkommen bei SneakerStudio. Viel Spaß beim Entdecken!“ · Button „Jetzt anmelden“ → `/anmelden` (F08, UC 1.5.5).
- Abgelaufen: „Dein Bestätigungslink ist abgelaufen. Dein Kundenkonto wurde gelöscht.“ · Link „Neues Kundenkonto erstellen“.
- Unbekannt: „Dieser Bestätigungslink ist ungültig.“
- Unerwarteter Fehler (z. B. Server nicht erreichbar): „Die Aktivierung ist fehlgeschlagen. Bitte versuche es später erneut.“
- Pro Link wird genau ein Aktivierungsaufruf gesendet und nicht automatisch wiederholt – ein abgelaufenes Konto ist nach dem ersten Aufruf bereits gelöscht.

## Automatische Löschung
- Ein Aufräum-Job im Server löscht alle 15 Minuten nicht aktivierte Konten, deren Link älter als 24 Stunden ist (Fachkonzept 1.3).

## Annahmen & offene Punkte
- „Jetzt einkaufen“ aus der Vorlage wird zu „Jetzt anmelden“, da es in Release 0.1 noch keinen Shop gibt (Entscheidung vom 26.09.2026).
- Meldungstexte, die nicht aus der Vorlage stammen, sind abgeleitet.

## Testfälle
- **Unit/API (server, mit steuerbarer Uhr):** Mail enthält Anrede, Link und 24-Stunden-Hinweis; Aktivierung innerhalb von 24 Stunden → aktiv; nach 24 Stunden → 410 und Konto gelöscht; unbekannter Token → 404; zweiter Klick → 200; der Aufräum-Job löscht nur abgelaufene, nicht aktivierte Konten.
- **Komponente (client):** Die Aktivierungsseite zeigt je nach Antwort Erfolg, „abgelaufen“ oder „ungültig“.
- **E2E:** Registrierung → Link aus dem Datei-Postfach öffnen → „Konto erfolgreich aktiviert!“.

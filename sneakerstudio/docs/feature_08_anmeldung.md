# F08 Anmeldung

**Use Cases:** 1.5.1 Anmelden, 1.5.2 Nur aktivierte Konten, 1.5.3 Schutz vor Passwort-Raten, 1.5.4 Abmelden, 1.5.5 Nach der Aktivierung anmelden (Entwurf, `docs/usecases_entwurf.md`)
**Design-Vorlage:** Folie 7 (Release 0.1 „Registrierung & Login“), Folie 8 („Bereits ein Konto? Anmelden“), Folie 9 (Sicherheit)
**Pakete:** server (Passwortprüfung, Sitzungen, API), client (Anmeldeseite, Header, Verlinkung)
**Status:** umgesetzt

## Ziel
Registrierte und aktivierte Kunden melden sich mit E-Mail-Adresse und Passwort an und wieder ab.

## Anmeldeseite `/anmelden`
- Überschrift „Anmelden“, Felder „E-Mail-Adresse“ und „Passwort“ (Autofill `email` bzw. `current-password`).
- Button „Anmelden“ nur aktiv, wenn beide Felder ausgefüllt sind; während der Prüfung „Du wirst angemeldet …“, Button gesperrt.
- Erfolg → Willkommensseite bzw. die zuvor aufgerufene geschützte Seite (F09).
- Hinweise:
  - falsche Angaben: „E-Mail-Adresse oder Passwort ist falsch“
  - nicht aktiviert: „Bitte bestätige zuerst deine E-Mail-Adresse über den Link in unserer E-Mail.“
  - gesperrt: „Zu viele Anmeldeversuche. Bitte versuche es in 15 Minuten erneut.“
  - unerwarteter Fehler (abgeleitet): „Die Anmeldung ist fehlgeschlagen. Bitte versuche es später erneut.“
- Link „Noch kein Konto? Registrieren“ → `/registrieren`.

## Änderungen an bestehenden Features
- Header (F01): abgemeldet „Anmelden“; angemeldet der Name („Herr Mustermann“) und „Abmelden“.
- Registrierung (F03): Link „Bereits ein Konto? Anmelden“.
- Aktivierungsseite (F06): Button „Jetzt anmelden“ statt „Zur Startseite“.

## API
- `POST /api/session` mit `{ email, password }` → `200` und Sitzungs-Cookie · `401` falsche Angaben · `403` nicht aktiviert · `429` zu viele Versuche
- `GET /api/session` → `200` mit den Kontaktdaten des angemeldeten Kunden (ohne Passwort) bzw. `{ customer: null }`, wenn niemand angemeldet ist (*Entschieden:* kein 401 – Browser würden jeden Seitenaufruf Abgemeldeter als Fehler protokollieren)
- `DELETE /api/session` → `204`, Sitzung beendet und Cookie gelöscht

## Sicherheit (ohne neue Pakete)
- Sitzung: zufälliger Token (32 Byte) im Cookie `sneakerstudio_session` mit `HttpOnly`, `SameSite=Lax`, `Path=/`, im Echtbetrieb zusätzlich `Secure`. Im Kundenstamm (SQLite) nur als SHA-256-Hash, gültig 8 Stunden.
- Passwortprüfung mit den im Hash gespeicherten scrypt-Parametern (vorbereitet in F04) und zeitkonstantem Vergleich. Bei unbekannter E-Mail wird trotzdem ein Hash berechnet, damit die Antwortzeit nichts verrät.
- Gleicher Hinweis für unbekannte E-Mail-Adresse und falsches Passwort.
- Sperre nach 5 Fehlversuchen je E-Mail-Adresse innerhalb von 15 Minuten; Zähler im Arbeitsspeicher (nach einem Neustart zurückgesetzt).
- CSRF-Schutz über `SameSite=Lax` und eine API, die nur JSON annimmt.

## Testfälle
- **Unit (server):** Passwortprüfung richtig/falsch; Sitzung anlegen, finden, ablaufen lassen, löschen; Sperre nach 5 Fehlversuchen und Freigabe nach 15 Minuten (steuerbare Uhr).
- **API (server):** Anmeldung setzt das Cookie mit `HttpOnly` und `SameSite`; `401` mit identischem Text für falsches Passwort und unbekannte E-Mail; `403` für nicht aktivierte Konten; `429` nach 5 Fehlversuchen; `GET` mit und ohne gültige Sitzung; nach `DELETE` ist die Sitzung ungültig; abgelaufene Sitzung → `{ customer: null }`.
- **Komponente (client):** Button-Freigabe, Hinweise, „Du wirst angemeldet …“, Weiterleitung nach Erfolg; Header abgemeldet/angemeldet; Abmelden.
- **E2E:** Registrierung → Aktivierung → „Jetzt anmelden“ → Anmeldung → Willkommensseite → Abmelden.

## Bewusst nicht enthalten
- „Passwort vergessen“ und „Angemeldet bleiben“ – kein Use Case. Empfehlung: „Passwort vergessen“ im nächsten Release, sonst verlieren Kunden ohne Passwort den Zugang.

## Offene Punkte
- Sitzungsdauer 8 Stunden und Sperre nach 5 Fehlversuchen sind Vorschläge (UC 1.5.3, 1.5.4).
- Der Hinweis „nicht aktiviert“ verrät, dass ein Konto existiert – wie schon die Registrierung (UC 1.3.2).

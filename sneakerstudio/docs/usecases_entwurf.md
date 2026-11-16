# Use Cases – Entwurf (Ergänzung Release 0.1)

> **Status: Entwurf zur fachlichen Freigabe.** Abgeleitet aus `SneakerStudio.pdf` – Folie 7 (Release 0.1: „Registrierung & Login“), Folie 8 (Registrierungsprozess: Aufruf, Konto aktiviert, „Los geht's“), Folie 9 (Sicherheit) – und den Entscheidungen vom 26.09.2026.
> Die Nummerierung setzt das Use-Case-Dokument fort (Story Map Kundenkonto, bisher freie Spalten). Mit *(Vorschlag)* markierte Punkte stehen nicht in der Vorlage und sind besonders zu prüfen.

## 1.4 Landing Page

### 1.4.1 Einstieg für neue und bestehende Kunden
**User Story:** Als Besucher möchte ich auf der Startseite sofort sehen, wie ich ein Konto erstelle oder mich anmelde, damit ich ohne Suchen loslegen kann.

**Akzeptanzkriterien:**
- Die Optionen „Neues Kundenkonto erstellen“ und „Anmelden“ sind auf der Startseite ohne Scrollen sichtbar.
- „Anmelden“ führt zum Anmeldeformular.
- Angemeldete Kunden sehen statt dieser beiden Optionen „Zu meinem Konto“.

**Quelle:** Folie 8, Schritt 1 „Aufruf“ und Startseiten-Mockup; ergänzt UC 1.1.1.

### 1.4.2 Markenversprechen und Vorteile
**User Story:** Als Besucher möchte ich auf einen Blick erfahren, was SneakerStudio bietet und wie die Registrierung abläuft, damit ich mich für ein Konto entscheiden kann.

**Akzeptanzkriterien:**
- Die Werte „Individuell gestalten“, „Hochwertig kaufen“, „Persönlich erleben“ und „Nachhaltig handeln“ werden mit Icon angezeigt.
- Der Ablauf wird in drei Schritten erklärt: „Registrieren“, „E-Mail bestätigen“, „Loslegen“.
- Die Vorteile „Schnell & einfach“, „Sicher & vertrauenswürdig“, „Persönlich & individuell“ und „Sofort startklar“ werden angezeigt.

**Quelle:** Folie 1 (Werte), Folie 8 (Registrierungsprozess, „Vorteile für unsere Kunden“).

## 1.5 Anmeldung

### 1.5.1 Anmelden
**User Story:** Als registrierter Kunde möchte ich mich mit E-Mail-Adresse und Passwort anmelden, damit ich auf mein Kundenkonto zugreifen kann.

**Akzeptanzkriterien:**
- Das Anmeldeformular enthält die Pflichtfelder E-Mail-Adresse und Passwort.
- Der Anmelden-Button wird nur aktiv, wenn beide Felder ausgefüllt sind.
- Nach erfolgreicher Anmeldung wird die Willkommensseite angezeigt.
- Sind E-Mail-Adresse oder Passwort falsch, erscheint der Hinweis „E-Mail-Adresse oder Passwort ist falsch“ – ohne zu verraten, welche Angabe falsch ist.
- Die Registrierung bietet „Bereits ein Konto? Anmelden“, das Anmeldeformular „Noch kein Konto? Registrieren“.

**Quelle:** Folie 7 („Registrierung & Login“), Folie 8, Schritte 1–2 („Bereits ein Konto? Anmelden“).

### 1.5.2 Nur aktivierte Konten
**User Story:** Als System möchte ich nur aktivierte Kundenkonten anmelden, damit die E-Mail-Adresse bestätigt ist, bevor ein Konto genutzt wird.

**Akzeptanzkriterien:**
- Ist das Konto noch nicht aktiviert, erscheint der Hinweis „Bitte bestätige zuerst deine E-Mail-Adresse über den Link in unserer E-Mail.“

**Quelle:** abgeleitet aus 1.3 Kontoaktivierung.

### 1.5.3 Schutz vor Passwort-Raten *(Vorschlag)*
**User Story:** Als Kunde möchte ich, dass mein Konto vor dem Durchprobieren von Passwörtern geschützt ist, damit Fremde keinen Zugriff erhalten.

**Akzeptanzkriterien:**
- Nach 5 fehlgeschlagenen Anmeldungen für dieselbe E-Mail-Adresse innerhalb von 15 Minuten sind weitere Versuche für 15 Minuten gesperrt.
- Während der Sperre erscheint der Hinweis „Zu viele Anmeldeversuche. Bitte versuche es in 15 Minuten erneut.“

**Quelle:** Folie 9 („Höchste Qualität. Maximale Sicherheit.“).

### 1.5.4 Abmelden
**User Story:** Als angemeldeter Kunde möchte ich mich abmelden, damit an diesem Gerät niemand auf mein Konto zugreifen kann.

**Akzeptanzkriterien:**
- Für angemeldete Kunden ist im Header „Abmelden“ sichtbar.
- Nach dem Abmelden wird die Startseite angezeigt; die Willkommensseite ist nicht mehr erreichbar.
- *(Vorschlag)* Eine Anmeldung endet automatisch nach 8 Stunden.

**Quelle:** Folie 9 (Sicherheit, Datenschutz).

### 1.5.5 Nach der Aktivierung anmelden
**User Story:** Als neuer Kunde möchte ich mich nach der Kontoaktivierung direkt anmelden können, damit ich sofort loslegen kann.

**Akzeptanzkriterien:**
- Die Seite „Konto erfolgreich aktiviert!“ bietet den Button „Jetzt anmelden“ an (statt „Zur Startseite“).

**Quelle:** Folie 8, Übergang Schritt 5 → 6; Entscheidung vom 26.09.2026.

## 1.6 Willkommensseite

### 1.6.1 Persönliche Begrüßung
**User Story:** Als angemeldeter Kunde möchte ich persönlich begrüßt werden, damit ich mich willkommen fühle und sehe, dass ich angemeldet bin.

**Akzeptanzkriterien:**
- Nach der Anmeldung wird die Willkommensseite angezeigt.
- Die Begrüßung verwendet die Anrede aus dem Kundenkonto: „Willkommen, Herr Mustermann!“ bzw. „Willkommen, Frau Mustermann!“, bei „Keine Angabe“ „Willkommen, Max Mustermann!“.
- Der Header zeigt den Namen des angemeldeten Kunden.

**Quelle:** Folie 8, Schritt 6 („Los geht's“); UC 1.1.2.1 (Personalisierung der Kommunikation).

### 1.6.2 Übersicht der Kontaktdaten
**User Story:** Als angemeldeter Kunde möchte ich meine gespeicherten Kontaktdaten sehen, damit ich prüfen kann, ob sie stimmen.

**Akzeptanzkriterien:**
- Angezeigt werden Anrede, Vor- und Nachname, Straße und Hausnummer, PLZ und Ort, E-Mail-Adresse und – falls hinterlegt – die Telefonnummer.
- Das Passwort wird nie angezeigt.
- Die Daten sind nur lesbar; Bearbeiten folgt mit „Kundenkonto & Profil“ (Release 0.2).

**Quelle:** Folie 5 („Kundenkonto: Profildaten“), Folie 8, Schritt 6 („Mein Konto – Übersicht“).

### 1.6.3 Zugriff nur für angemeldete Kunden
**User Story:** Als Kunde möchte ich, dass meine Kontodaten nur mir angezeigt werden, damit sie geschützt sind.

**Akzeptanzkriterien:**
- Wer nicht angemeldet ist und die Willkommensseite aufruft, wird zur Anmeldung geleitet und nach erfolgreicher Anmeldung zurück zur Willkommensseite.

**Quelle:** Folie 9 (Datenschutz & Compliance).

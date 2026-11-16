# Test-Gap-Durchlauf: vom Use Case zum E2E-Test

Stand: 16.11.2026 · Fallbeispiel SneakerStudio · OpenWebUI mit Haiku 4.5, nur Chat

## Worum es geht

Der Durchlauf zeigt an einem Beispiel, wie aus Use Cases neue automatisierte Tests entstehen, wenn nur ein Chat zur Verfügung steht. OpenWebUI sieht weder die Anwendung noch das Repository. Deshalb gilt: **Der Mensch ist der Harness.** Er liefert dem Modell den Kontext, führt die Befehle aus, meldet Ergebnisse zurück und entscheidet.

Beispiel ist UC 1.5.3 „Schutz vor Passwort-Raten“: Nach 5 Fehlversuchen ist die Anmeldung 15 Minuten gesperrt. Dafür gibt es Unit-, API- und Komponententests, aber keinen E2E-Test.

## Ablauf im Überblick

| Schritt | Was passiert | Ergebnis |
|---|---|---|
| 1 | Vorhandene Tests auflisten | `testtitel.txt` |
| 2 | Gap-Analyse: Use Cases gegen Testtitel | Tabelle mit Lücken |
| 3 | Testfälle für eine Lücke ableiten | geprüfte Testfalltabelle |
| 4 | Testcode erzeugen lassen | `e2e/login-lock.spec.ts` |
| 5 | Ausführen | Ausgabe von Playwright |
| 6 | Im Fehlerfall zurückmelden und korrigieren | grüner Testlauf |
| 7 | Den Test selbst prüfen (Mutation) | Nachweis, dass der Test Fehler bemerkt |

## So wird das Dokument benutzt

- Jeder Kasten mit einem Prompt wird **als Ganzes** in OpenWebUI kopiert.
- Schritt 1, 2 und 3 beginnen jeweils in einem **neuen Chat**. Schritt 4 und 6 laufen im **selben Chat** wie Schritt 3, damit das Modell die Testfälle noch kennt.
- Alle Befehle laufen im Ordner `sneakerstudio`.
- Nach jedem Schritt steht unter „Prüfen“, worauf der Mensch achtet, bevor es weitergeht.

---

## Schritt 1 · Vorhandene Tests auflisten

**Ziel:** eine Textdatei mit den Kopfzeilen aller vorhandenen Tests als Grundlage für die Gap-Analyse.

**Prompt:**

```
Erstelle einen bash-Befehl (macOS, nur grep), der die Kopfzeilen aller Tests eines TypeScript-Projekts in die Datei testtitel.txt schreibt.

Wo die Tests liegen:
- Vitest: client/src, server/src, shared/src – Dateien *.test.ts und *.test.tsx
- Playwright: e2e – Dateien *.spec.ts

Welche Zeilen Kopfzeilen sind (jeweils am Zeilenanfang, Einrückung erlaubt):
- describe( … und describe.each( …
- it( … und it.each( …
- test( … und test.each( …
- ])( … – dort steht bei mehrzeiligem it.each der Testtitel

Ausgabeformat je Zeile: Pfad/Dateiname:Zeilennummer: Kopfzeile
Beispiel: client/src/theme.test.ts:23:   it('folgt ohne gespeicherte Wahl der Systemeinstellung', () => {

Gib nur den Befehl aus, danach einen zweiten Befehl, der die Anzahl der Zeilen je Verzeichnis (client, server, shared, e2e) zählt, damit ich die Vollständigkeit prüfen kann.
```

Den gelieferten Befehl im Ordner `sneakerstudio` ausführen.

**Beispiel für die Ausgabe:**

```bash
client/src/ActivationPage.test.tsx:22:describe('F06 Aktivierungsseite (Fachkonzept 1.3, UC 1.3.4)', () => {
client/src/ActivationPage.test.tsx:37:  it('aktiviert beim Öffnen genau einmal mit dem Token aus dem Link', async () => {
client/src/ActivationPage.test.tsx:49:  it('zeigt während der Prüfung "Dein Konto wird aktiviert …"', async () => {
```

**Prüfen:** Die Liste muss vollständig sein, sonst meldet die Gap-Analyse Lücken, die es nicht gibt. Drei Stellen werden leicht übersehen:

- die E2E-Tests in `e2e/*.spec.ts` (dort heißt es `test(` statt `it(`)
- die Komponententests in `client/src/*.test.tsx`
- Tests mit mehreren Datensätzen (`it.each(`)

Liefert das Modell keinen brauchbaren Befehl, erfasst dieser alle drei:

```bash
grep -rnE "^\s*((test\.)?describe(\.each)?\(|(test|it)(\.each)?\(|\]\)\()" e2e server/src client/src shared/src > testtitel.txt
```

## Schritt 2 · Gap-Analyse

**Ziel:** eine Tabelle, die jedem Akzeptanzkriterium die vorhandenen Tests zuordnet und Lücken benennt.

**Eingaben:** `docs/usecases_entwurf.md` zwischen `<usecases>` und `</usecases>`, der Inhalt von `testtitel.txt` zwischen `<tests>` und `</tests>`. Im Prompt unten ist beides bereits eingesetzt.

**Prompt:**

```
Rolle: Testanalyst. Unten stehen Use Cases mit Akzeptanzkriterien und die Titel aller vorhandenen Tests. Erstelle eine Tabelle: Use Case | Akzeptanzkriterium | abgedeckt durch (Datei:Zeile) | Ebene (Unit/API/Komponente/E2E) | Lücke. Ordne nur zu, was der Titel eindeutig belegt. Sonst „unklar“. Erfinde keine Tests. Nenne danach die drei wichtigsten E2E-Lücken. 

Gib die Tabelle direkt aus.

<usecases> 

# Use Cases – Entwurf (Ergänzung Release 0.1)

> Status: Entwurf zur fachlichen Freigabe. Abgeleitet aus SneakerStudio.pdf – Folie 7 (Release 0.1: „Registrierung & Login“), Folie 8 (Registrierungsprozess: Aufruf, Konto aktiviert, „Los geht's“), Folie 9 (Sicherheit) – und den Entscheidungen vom 26.09.2026.

> Die Nummerierung setzt das Use-Case-Dokument fort (Story Map Kundenkonto, bisher freie Spalten). Mit *(Vorschlag)* markierte Punkte stehen nicht in der Vorlage und sind besonders zu prüfen.

## 1.4 Landing Page

### 1.4.1 Einstieg für neue und bestehende Kunden

User Story: Als Besucher möchte ich auf der Startseite sofort sehen, wie ich ein Konto erstelle oder mich anmelde, damit ich ohne Suchen loslegen kann.

Akzeptanzkriterien:

- Die Optionen „Neues Kundenkonto erstellen“ und „Anmelden“ sind auf der Startseite ohne Scrollen sichtbar.

- „Anmelden“ führt zum Anmeldeformular.

- Angemeldete Kunden sehen statt dieser beiden Optionen „Zu meinem Konto“.

Quelle: Folie 8, Schritt 1 „Aufruf“ und Startseiten-Mockup; ergänzt UC 1.1.1.

### 1.4.2 Markenversprechen und Vorteile

User Story: Als Besucher möchte ich auf einen Blick erfahren, was SneakerStudio bietet und wie die Registrierung abläuft, damit ich mich für ein Konto entscheiden kann.

Akzeptanzkriterien:

- Die Werte „Individuell gestalten“, „Hochwertig kaufen“, „Persönlich erleben“ und „Nachhaltig handeln“ werden mit Icon angezeigt.

- Der Ablauf wird in drei Schritten erklärt: „Registrieren“, „E-Mail bestätigen“, „Loslegen“.

- Die Vorteile „Schnell & einfach“, „Sicher & vertrauenswürdig“, „Persönlich & individuell“ und „Sofort startklar“ werden angezeigt.

Quelle: Folie 1 (Werte), Folie 8 (Registrierungsprozess, „Vorteile für unsere Kunden“).

## 1.5 Anmeldung

### 1.5.1 Anmelden

User Story: Als registrierter Kunde möchte ich mich mit E-Mail-Adresse und Passwort anmelden, damit ich auf mein Kundenkonto zugreifen kann.

Akzeptanzkriterien:

- Das Anmeldeformular enthält die Pflichtfelder E-Mail-Adresse und Passwort.

- Der Anmelden-Button wird nur aktiv, wenn beide Felder ausgefüllt sind.

- Nach erfolgreicher Anmeldung wird die Willkommensseite angezeigt.

- Sind E-Mail-Adresse oder Passwort falsch, erscheint der Hinweis „E-Mail-Adresse oder Passwort ist falsch“ – ohne zu verraten, welche Angabe falsch ist.

- Die Registrierung bietet „Bereits ein Konto? Anmelden“, das Anmeldeformular „Noch kein Konto? Registrieren“.

Quelle: Folie 7 („Registrierung & Login“), Folie 8, Schritte 1–2 („Bereits ein Konto? Anmelden“).

### 1.5.2 Nur aktivierte Konten

User Story: Als System möchte ich nur aktivierte Kundenkonten anmelden, damit die E-Mail-Adresse bestätigt ist, bevor ein Konto genutzt wird.

Akzeptanzkriterien:

- Ist das Konto noch nicht aktiviert, erscheint der Hinweis „Bitte bestätige zuerst deine E-Mail-Adresse über den Link in unserer E-Mail.“

Quelle: abgeleitet aus 1.3 Kontoaktivierung.

### 1.5.3 Schutz vor Passwort-Raten *(Vorschlag)*

User Story: Als Kunde möchte ich, dass mein Konto vor dem Durchprobieren von Passwörtern geschützt ist, damit Fremde keinen Zugriff erhalten.

Akzeptanzkriterien:

- Nach 5 fehlgeschlagenen Anmeldungen für dieselbe E-Mail-Adresse innerhalb von 15 Minuten sind weitere Versuche für 15 Minuten gesperrt.

- Während der Sperre erscheint der Hinweis „Zu viele Anmeldeversuche. Bitte versuche es in 15 Minuten erneut.“

Quelle: Folie 9 („Höchste Qualität. Maximale Sicherheit.“).

### 1.5.4 Abmelden

User Story: Als angemeldeter Kunde möchte ich mich abmelden, damit an diesem Gerät niemand auf mein Konto zugreifen kann.

Akzeptanzkriterien:

- Für angemeldete Kunden ist im Header „Abmelden“ sichtbar.

- Nach dem Abmelden wird die Startseite angezeigt; die Willkommensseite ist nicht mehr erreichbar.

- *(Vorschlag)* Eine Anmeldung endet automatisch nach 8 Stunden.

Quelle: Folie 9 (Sicherheit, Datenschutz).

### 1.5.5 Nach der Aktivierung anmelden

User Story: Als neuer Kunde möchte ich mich nach der Kontoaktivierung direkt anmelden können, damit ich sofort loslegen kann.

Akzeptanzkriterien:

- Die Seite „Konto erfolgreich aktiviert!“ bietet den Button „Jetzt anmelden“ an (statt „Zur Startseite“).

Quelle: Folie 8, Übergang Schritt 5 → 6; Entscheidung vom 26.09.2026.

## 1.6 Willkommensseite

### 1.6.1 Persönliche Begrüßung

User Story: Als angemeldeter Kunde möchte ich persönlich begrüßt werden, damit ich mich willkommen fühle und sehe, dass ich angemeldet bin.

Akzeptanzkriterien:

- Nach der Anmeldung wird die Willkommensseite angezeigt.

- Die Begrüßung verwendet die Anrede aus dem Kundenkonto: „Willkommen, Herr Mustermann!“ bzw. „Willkommen, Frau Mustermann!“, bei „Keine Angabe“ „Willkommen, Max Mustermann!“.

- Der Header zeigt den Namen des angemeldeten Kunden.

Quelle: Folie 8, Schritt 6 („Los geht's“); UC 1.1.2.1 (Personalisierung der Kommunikation).

### 1.6.2 Übersicht der Kontaktdaten

User Story: Als angemeldeter Kunde möchte ich meine gespeicherten Kontaktdaten sehen, damit ich prüfen kann, ob sie stimmen.

Akzeptanzkriterien:

- Angezeigt werden Anrede, Vor- und Nachname, Straße und Hausnummer, PLZ und Ort, E-Mail-Adresse und – falls hinterlegt – die Telefonnummer.

- Das Passwort wird nie angezeigt.

- Die Daten sind nur lesbar; Bearbeiten folgt mit „Kundenkonto & Profil“ (Release 0.2).

Quelle: Folie 5 („Kundenkonto: Profildaten“), Folie 8, Schritt 6 („Mein Konto – Übersicht“).

### 1.6.3 Zugriff nur für angemeldete Kunden

User Story: Als Kunde möchte ich, dass meine Kontodaten nur mir angezeigt werden, damit sie geschützt sind.

Akzeptanzkriterien:

- Wer nicht angemeldet ist und die Willkommensseite aufruft, wird zur Anmeldung geleitet und nach erfolgreicher Anmeldung zurück zur Willkommensseite.

Quelle: Folie 9 (Datenschutz & Compliance).

</usecases> 



<tests>
client/src/ActivationPage.test.tsx:22:describe('F06 Aktivierungsseite (Fachkonzept 1.3, UC 1.3.4)', () => {
client/src/ActivationPage.test.tsx:37:  it('aktiviert beim Öffnen genau einmal mit dem Token aus dem Link', async () => {
client/src/ActivationPage.test.tsx:49:  it('zeigt während der Prüfung "Dein Konto wird aktiviert …"', async () => {
client/src/ActivationPage.test.tsx:56:  it('begrüßt nach erfolgreicher Aktivierung und bietet "Jetzt anmelden" an (UC 1.5.5)', async () => {
client/src/ActivationPage.test.tsx:65:  it('meldet einen abgelaufenen Link, das gelöschte Konto und bietet die Neuregistrierung an', async () => {
client/src/ActivationPage.test.tsx:76:  it('meldet einen unbekannten Link als ungültig', async () => {
client/src/ActivationPage.test.tsx:83:  it('meldet einen unerwarteten Fehler', async () => {
client/src/styles.test.ts:31:describe('F01 Design-Tokens', () => {
client/src/styles.test.ts:32:  it('entsprechen der Token-Tabelle aus F01 (Dark aus der Vorlage, Light abgeleitet)', () => {
client/src/styles.test.ts:64:    ])('Text "%s" auf "%s" mindestens 4,5 : 1', (text, background) => {
client/src/styles.test.ts:68:    it('Wortmarke "brand" (große Schrift) auf "bg" mindestens 3 : 1', () => {
client/src/styles.test.ts:72:    it.each(['surface', 'field'])('Feldrahmen "field-line" zu "%s" mindestens 3 : 1 (WCAG 1.4.11)', (background) => {
client/src/WelcomePage.test.tsx:30:describe('F09 Willkommensseite (UC 1.6.1–1.6.3)', () => {
client/src/WelcomePage.test.tsx:44:  ])('begrüßt bei Anrede "%s" mit "%s"', async (salutation, greeting) => {
client/src/WelcomePage.test.tsx:50:  it('zeigt die gespeicherten Kontaktdaten', async () => {
client/src/WelcomePage.test.tsx:60:  it('zeigt die Telefonnummer nur, wenn sie hinterlegt ist', async () => {
client/src/WelcomePage.test.tsx:67:  it('führt zur Startseite', async () => {
client/src/WelcomePage.test.tsx:73:  it('leitet ohne Anmeldung zur Anmeldeseite', async () => {
client/src/AppShell.test.tsx:50:describe('F01 App-Shell', () => {
client/src/AppShell.test.tsx:65:  it('zeigt die Wortmarke als Link zur Startseite', async () => {
client/src/AppShell.test.tsx:72:  it('zeigt die aktuelle Seite im Inhaltsbereich', async () => {
client/src/AppShell.test.tsx:78:  it('wechselt per Umschalter den Modus, passt die Beschriftung an und speichert die Wahl', async () => {
client/src/AppShell.test.tsx:90:describe('F08 Anmeldung im Header (UC 1.5.1, UC 1.5.4, UC 1.6.1)', () => {
client/src/AppShell.test.tsx:102:  it('zeigt abgemeldet "Anmelden" mit dem Ziel /anmelden', async () => {
client/src/AppShell.test.tsx:110:  it('zeigt angemeldet die persönliche Anrede und "Abmelden"', async () => {
client/src/AppShell.test.tsx:119:  it('meldet ab und zeigt danach die Startseite', async () => {
client/src/HomePage.test.tsx:31:describe('F02 Startseite (UC 1.1.1)', () => {
client/src/HomePage.test.tsx:41:  it('zeigt die Überschrift aus der Design-Vorlage', async () => {
client/src/HomePage.test.tsx:47:  it('zeigt die Option "Neues Kundenkonto erstellen" mit dem Ziel /registrieren', async () => {
client/src/HomePage.test.tsx:54:  it('öffnet beim Klick auf die Option die Registrierung', async () => {
client/src/HomePage.test.tsx:63:describe('F07 Landing Page (UC 1.4.1, UC 1.4.2)', () => {
client/src/HomePage.test.tsx:73:  it('bietet neben der Registrierung "Anmelden" an', async () => {
client/src/HomePage.test.tsx:79:  it('zeigt angemeldeten Kunden "Zu meinem Konto" statt der Einstiege', async () => {
client/src/HomePage.test.tsx:88:  it('zeigt die vier Werte', async () => {
client/src/HomePage.test.tsx:100:  it('erklärt den Ablauf in drei Schritten', async () => {
client/src/HomePage.test.tsx:116:  it('zeigt die vier Vorteile aus der Design-Vorlage', async () => {
client/src/RegistrationPage.test.tsx:45:describe('F03 Formular Kontaktdaten (UC 1.1.2)', () => {
client/src/RegistrationPage.test.tsx:54:  it('zeigt alle Kontaktfelder; die Anrede bietet Herr, Frau und Keine Angabe', () => {
client/src/RegistrationPage.test.tsx:62:  it('bietet "Bereits ein Konto? Anmelden" an (UC 1.5.1)', () => {
client/src/RegistrationPage.test.tsx:66:  it('zeigt keinen Hinweis, solange das Feld nicht verlassen wurde', () => {
client/src/RegistrationPage.test.tsx:81:  ])('zeigt beim Verlassen von "%s" mit "%s" den Hinweis "%s"', (label, value, hint) => {
client/src/RegistrationPage.test.tsx:89:  it('meldet an der PLZ, wenn PLZ und Ort nicht zusammenpassen (UC 1.1.2.3)', () => {
client/src/RegistrationPage.test.tsx:96:  it('entfernt den Hinweis, sobald die Eingabe gültig ist', () => {
client/src/RegistrationPage.test.tsx:104:  it('aktiviert "Konto anlegen" erst, wenn alle Pflichtfelder gültig sind', () => {
client/src/RegistrationPage.test.tsx:113:  it('blockiert nicht bei leerer, aber bei ungültiger Telefonnummer (UC 1.1.2.6)', () => {
client/src/RegistrationPage.test.tsx:125:describe('F04 Passwort festlegen (UC 1.2.1, UC 1.2.2)', () => {
client/src/RegistrationPage.test.tsx:141:  it('maskiert beide Felder und kennzeichnet sie für Passwort-Manager als neues Passwort', () => {
client/src/RegistrationPage.test.tsx:149:  it('zeigt die Regeln als Hilfetext und ersetzt ihn bei ungültigem Passwort durch den Hinweis', () => {
client/src/RegistrationPage.test.tsx:158:  it('meldet eine abweichende Wiederholung nach dem Verlassen', () => {
client/src/RegistrationPage.test.tsx:165:  it('bewertet die Wiederholung neu, sobald sich das Passwort ändert', () => {
client/src/RegistrationPage.test.tsx:174:  it('aktiviert "Konto anlegen" nur mit gültigem und übereinstimmendem Passwort', () => {
client/src/RegistrationPage.test.tsx:189:describe('F05 Kontoanlage beauftragen (UC 1.3.1, UC 1.3.2)', () => {
client/src/RegistrationPage.test.tsx:209:  it('sendet die Daten ohne Passwort-Wiederholung an POST /api/registrations', async () => {
client/src/RegistrationPage.test.tsx:231:  it('zeigt "in Bearbeitung" und sperrt den Button, solange die Kontoanlage läuft', async () => {
client/src/RegistrationPage.test.tsx:243:  it('ersetzt das Formular nach erfolgreicher Verifizierung durch die Bestätigung', async () => {
client/src/RegistrationPage.test.tsx:254:  it('zeigt eine bereits registrierte E-Mail-Adresse am Feld und entfernt den Hinweis bei Änderung', async () => {
client/src/RegistrationPage.test.tsx:266:  it('meldet einen unerwarteten Fehler und erlaubt einen neuen Versuch', async () => {
client/src/LoginPage.test.tsx:49:describe('F08 Anmeldeseite (UC 1.5.1–1.5.3)', () => {
client/src/LoginPage.test.tsx:68:  it('zeigt E-Mail-Adresse und Passwort mit Kennzeichnung für Passwort-Manager', () => {
client/src/LoginPage.test.tsx:75:  it('aktiviert "Anmelden" erst, wenn beide Felder ausgefüllt sind', () => {
client/src/LoginPage.test.tsx:88:  it('sendet die Anmeldung und öffnet danach die Willkommensseite', async () => {
client/src/LoginPage.test.tsx:99:  it('zeigt nach der Anmeldung sofort die persönliche Anrede im Header', async () => {
client/src/LoginPage.test.tsx:107:  it('zeigt "Du wirst angemeldet …" und sperrt den Button, solange die Prüfung läuft', async () => {
client/src/LoginPage.test.tsx:119:  ])('zeigt bei %i den Hinweis "%s"', async (status, hint) => {
client/src/LoginPage.test.tsx:127:  it('meldet einen unerwarteten Fehler', async () => {
client/src/LoginPage.test.tsx:136:  it('bietet "Noch kein Konto? Registrieren" an', () => {
client/src/theme.test.ts:12:describe('F01 Theme', () => {
client/src/theme.test.ts:23:  it('folgt ohne gespeicherte Wahl der Systemeinstellung', () => {
client/src/theme.test.ts:31:  it('übernimmt beim Start die gespeicherte Wahl', () => {
client/src/theme.test.ts:40:  it('ignoriert ungültige gespeicherte Werte', () => {
client/src/theme.test.ts:48:  it('wechselt beim Umschalten den Modus und speichert die Wahl', () => {
client/src/theme.test.ts:59:  it('funktioniert auch, wenn der Browser-Speicher blockiert ist', () => {
server/src/app.test.ts:20:describe('F05/F06/F08 Server gesamt – Registrierung bis Anmeldung', () => {
server/src/app.test.ts:50:  it('registriert einen Kunden und aktiviert das Konto über den Link aus dem Datei-Postfach', async () => {
server/src/app.test.ts:62:  it('meldet ein aktiviertes Konto an, liefert die Kontaktdaten und meldet wieder ab (F08)', async () => {
server/src/app.test.ts:79:  it('behält registrierte Kunden über einen Neustart (SQLite-Datei)', async () => {
server/src/confirmation-mail.test.ts:12:describe('F06 Bestätigungsmail (UC 1.3.4)', () => {
server/src/confirmation-mail.test.ts:13:  it('geht an die angegebene E-Mail-Adresse', () => {
server/src/confirmation-mail.test.ts:30:  it('enthält den 24 Stunden gültigen Bestätigungslink', () => {
server/src/confirmation-mail.test.ts:37:  it('informiert, dass das Kundenkonto sonst gelöscht wird', () => {
server/src/registration.test.ts:30:describe('F05 API Kontoanlage – POST /api/registrations', () => {
server/src/registration.test.ts:63:  it('legt den Kunden in Speicherform mit Status "nicht aktiviert" an und antwortet mit 201 (UC 1.3.3)', async () => {
server/src/registration.test.ts:85:  it('speichert das Passwort nur als Hash (UC 1.2.1)', async () => {
server/src/registration.test.ts:93:  it('versendet die Bestätigungsmail; der Token des Links ist nur als Hash gespeichert (UC 1.3.3, UC 1.3.4)', async () => {
server/src/registration.test.ts:105:  it('lehnt eine bereits registrierte E-Mail-Adresse unabhängig von Groß-/Kleinschreibung mit 409 ab (UC 1.3.2)', async () => {
server/src/registration.test.ts:115:  it('lehnt ungültige Daten mit 422 und allen Hinweisen ab, ohne etwas anzulegen', async () => {
server/src/registration.test.ts:136:  it('prüft PLZ und Ort gegen das Verzeichnis (UC 1.1.2.3)', async () => {
server/src/registration.test.ts:143:  it('lehnt ein schwaches Passwort ab (UC 1.2.1)', async () => {
server/src/registration.test.ts:150:  it('nimmt die Anlage zurück, wenn der Mailversand scheitert', async () => {
server/src/activation.test.ts:19:describe('F06 API Kontoaktivierung – POST /api/activations (Fachkonzept 1.3)', () => {
server/src/activation.test.ts:67:  it('aktiviert das Konto, wenn der Link innerhalb von 24 Stunden geklickt wird', async () => {
server/src/activation.test.ts:75:  it('antwortet auch beim erneuten Klick mit 200 – auch nach Ablauf der 24 Stunden', async () => {
server/src/activation.test.ts:85:  it('löscht das Konto und antwortet mit 410, wenn der Link abgelaufen ist', async () => {
server/src/activation.test.ts:93:  it.each([{ token: 'unbekannt' }, { token: '' }, {}])('antwortet bei unbekanntem Link %j mit 404', async (body) => {
server/src/activation.test.ts:101:describe('F06 Automatische Löschung – Aufräum-Job (Fachkonzept 1.3)', () => {
server/src/activation.test.ts:108:  it('löscht alle 15 Minuten abgelaufene, nicht aktivierte Konten', async () => {
server/src/activation.test.ts:123:  it('protokolliert Fehler, statt den Server zu beenden', async () => {
server/src/login-throttle.test.ts:8:describe('F08 Schutz vor Passwort-Raten (UC 1.5.3)', () => {
server/src/login-throttle.test.ts:18:  it('erlaubt Anmeldeversuche bei weniger als 5 Fehlversuchen', () => {
server/src/login-throttle.test.ts:24:  it('sperrt nach 5 Fehlversuchen innerhalb von 15 Minuten', () => {
server/src/login-throttle.test.ts:30:  it('sperrt genau 15 Minuten ab dem 5. Fehlversuch', () => {
server/src/login-throttle.test.ts:39:  it('zählt nur Fehlversuche der letzten 15 Minuten', () => {
server/src/login-throttle.test.ts:46:  it('gilt je E-Mail-Adresse, unabhängig von Groß-/Kleinschreibung', () => {
server/src/login-throttle.test.ts:53:  it('setzt die Fehlversuche nach einer erfolgreichen Anmeldung zurück', () => {
server/src/customer-store.test.ts:27:describe('F05 Kundenstamm (UC 1.3.2, UC 1.3.3)', () => {
server/src/customer-store.test.ts:36:  it('legt einen Kunden mit Status "nicht aktiviert" an', async () => {
server/src/customer-store.test.ts:57:  it('speichert die E-Mail-Adresse klein geschrieben', async () => {
server/src/customer-store.test.ts:63:  it('erkennt eine vorhandene E-Mail-Adresse unabhängig von Groß-/Kleinschreibung', async () => {
server/src/customer-store.test.ts:70:  it('lässt keine zweite Anlage mit derselben E-Mail-Adresse zu', async () => {
server/src/customer-store.test.ts:78:  it('löscht einen Kunden', async () => {
server/src/customer-store.test.ts:85:  it('behält vorhandene Kunden, wenn die Datenbank erneut geöffnet wird', async () => {
server/src/customer-store.test.ts:92:  it('findet einen Kunden über den Hash des Aktivierungs-Tokens (F06)', async () => {
server/src/customer-store.test.ts:103:  it('aktiviert einen Kunden (F06)', async () => {
server/src/customer-store.test.ts:110:  it('liefert die Anmeldedaten zu einer E-Mail-Adresse, unabhängig von Groß-/Kleinschreibung (F08)', async () => {
server/src/customer-store.test.ts:122:  it('liefert die Kontaktdaten eines Kunden ohne Passwort (F09)', async () => {
server/src/customer-store.test.ts:139:  it('löscht nur nicht aktivierte Konten, deren Link abgelaufen ist (F06)', async () => {
server/src/session.test.ts:28:describe('F08 API Anmeldung – /api/session (UC 1.5.1–1.5.4)', () => {
server/src/session.test.ts:91:  it('meldet ein aktiviertes Konto an und setzt ein HttpOnly-Sitzungs-Cookie', async () => {
server/src/session.test.ts:105:  it('setzt das Cookie mit "Secure", wenn die App über https läuft', async () => {
server/src/session.test.ts:113:  it('akzeptiert die E-Mail-Adresse unabhängig von Groß-/Kleinschreibung und Leerzeichen', async () => {
server/src/session.test.ts:117:  it('antwortet bei falschem Passwort und unbekannter E-Mail gleich – 401 ohne Cookie', async () => {
server/src/session.test.ts:125:  it('meldet ein nicht aktiviertes Konto nur mit richtigem Passwort als solches (403)', async () => {
server/src/session.test.ts:136:  it('sperrt nach 5 Fehlversuchen – auch das richtige Passwort (429)', async () => {
server/src/session.test.ts:144:  it('liefert per GET die Kontaktdaten der angemeldeten Person – ohne Passwort', async () => {
server/src/session.test.ts:152:  it.each(['', 'sneakerstudio_session=falsch', 'anderes=cookie'])('meldet ohne gültige Sitzung (%j) niemanden als angemeldet', async (cookie) => {
server/src/session.test.ts:156:  it('beendet die Sitzung per DELETE und löscht das Cookie (UC 1.5.4)', async () => {
server/src/session.test.ts:165:  it('beendet die Sitzung automatisch nach 8 Stunden (UC 1.5.4)', async () => {
server/src/password-hash.test.ts:5:describe('F04 Passwort sicher speichern (UC 1.2.1)', () => {
server/src/password-hash.test.ts:6:  it('speichert das Passwort nicht im Klartext', async () => {
server/src/password-hash.test.ts:13:  it('erzeugt für dasselbe Passwort unterschiedliche Hashes (zufälliges Salt)', async () => {
server/src/password-hash.test.ts:19:  it('lässt sich mit den gespeicherten Parametern nachrechnen', async () => {
server/src/password-hash.test.ts:32:describe('F08 Passwort prüfen (UC 1.5.1)', () => {
server/src/password-hash.test.ts:39:  it('erkennt das richtige Passwort', async () => {
server/src/password-hash.test.ts:43:  it.each(['Sneaker1?', 'sneaker1!', 'Sneaker1! ', ''])('lehnt das falsche Passwort "%s" ab', async (attempt) => {
server/src/password-hash.test.ts:47:  it('nutzt die im Hash gespeicherten Parameter', async () => {
server/src/password-hash.test.ts:55:  it.each(['', 'kaputt', 'scrypt$16384$8$5', 'bcrypt$16384$8$5$c2FsdA$a2V5', 'scrypt$16384$8$5$c2FsdA$'])(
server/src/password-hash.test.ts:62:  it('lehnt einen Hash mit ungültigen Parametern ab, ohne abzustürzen', async () => {
server/src/session-store.test.ts:9:describe('F08 Sitzungen (UC 1.5.1, UC 1.5.4)', () => {
server/src/session-store.test.ts:18:  it('legt eine Sitzung an und findet den Kunden über den Token', async () => {
server/src/session-store.test.ts:24:  it('speichert den Token nur als SHA-256-Hash', async () => {
server/src/session-store.test.ts:32:  it('erzeugt für jede Anmeldung einen neuen, zufälligen Token', async () => {
server/src/session-store.test.ts:40:  it('gilt 8 Stunden und endet danach automatisch (UC 1.5.4)', async () => {
server/src/session-store.test.ts:48:  it('findet unbekannte Tokens nicht', async () => {
server/src/session-store.test.ts:52:  it('beendet eine Sitzung beim Abmelden (UC 1.5.4)', async () => {
server/src/mailer.test.ts:9:describe('F06 Datei-Postfach', () => {
server/src/mailer.test.ts:20:  it('legt die Mail als JSON-Datei im Postfach ab und legt das Verzeichnis bei Bedarf an', async () => {
server/src/mailer.test.ts:29:  it('legt jede Mail in einer eigenen Datei ab', async () => {
server/src/mailer.test.ts:37:  it('gibt die Mail in der Konsole aus', async () => {
shared/src/postal-directory.test.ts:5:describe('F03 PLZ-Verzeichnis (UC 1.1.2.3, UC 1.1.2.4)', () => {
shared/src/postal-directory.test.ts:6:  it('enthält nur Einträge, die den Eingaberegeln für PLZ und Ort entsprechen', () => {
shared/src/postal-directory.test.ts:13:  it.each(['10115', '04109', ' 96444 '])('kennt die PLZ "%s"', (postalCode) => {
shared/src/postal-directory.test.ts:17:  it.each(['12345', '00000'])('kennt die PLZ "%s" nicht', (postalCode) => {
shared/src/postal-directory.test.ts:21:  it.each(['Berlin', 'berlin', ' Frankfurt  am Main ', 'Gießen', 'Castrop-Rauxel', 'Überlingen'])(
shared/src/postal-directory.test.ts:28:  it('kennt einen erfundenen Ort nicht', () => {
shared/src/postal-directory.test.ts:37:  ])('PLZ %s passt zu %s', (postalCode, city) => {
shared/src/postal-directory.test.ts:44:  ])('PLZ %s passt nicht zu %s', (postalCode, city) => {
shared/src/contact.test.ts:21:describe('F03 Anrede (UC 1.1.2.1)', () => {
shared/src/contact.test.ts:22:  it('bietet genau Herr, Frau und Keine Angabe an', () => {
shared/src/contact.test.ts:26:  it('akzeptiert jede vorgegebene Anrede', () => {
shared/src/contact.test.ts:30:  it.each(['', 'mrs', 'divers'])('lehnt "%s" mit Hinweis ab', (value) => {
shared/src/contact.test.ts:35:describe('F03 Vorname und Nachname (Fachkonzept 1.1)', () => {
shared/src/contact.test.ts:36:  it.each(['Max', 'José', "O'Brien", 'Anna-Lena'])('akzeptiert "%s"', (value) => {
shared/src/contact.test.ts:40:  it.each(['', '   '])('meldet ein leeres Feld ("%s")', (value) => {
shared/src/contact.test.ts:45:describe('F03 Straße (UC 1.1.2.2)', () => {
shared/src/contact.test.ts:46:  it.each(['Hauptstraße', 'Am Weiher', 'Karl-Marx-Allee', 'Äußere Ringstraße', ' Große Bleichen '])(
shared/src/contact.test.ts:53:  it('akzeptiert Umlaute auch in zerlegter Unicode-Form', () => {
shared/src/contact.test.ts:57:  it.each(['', '  '])('meldet ein leeres Feld ("%s")', (value) => {
shared/src/contact.test.ts:61:  it.each(['Hauptstr.', 'Straße des 17. Juni', "Rue d'Or", 'Weg_1'])('lehnt "%s" wegen unerlaubter Zeichen ab', (value) => {
shared/src/contact.test.ts:66:describe('F03 Hausnummer (UC 1.1.2.2)', () => {
shared/src/contact.test.ts:67:  it.each(['12', '12a', '12A', '12/1', '12-14', '7b/2'])('akzeptiert "%s"', (value) => {
shared/src/contact.test.ts:71:  it('meldet ein leeres Feld', () => {
shared/src/contact.test.ts:75:  it.each(['12 a', '12.5', '#3', '12,5'])('lehnt "%s" wegen unerlaubter Zeichen ab', (value) => {
shared/src/contact.test.ts:80:describe('F03 Postleitzahl – Format (UC 1.1.2.3)', () => {
shared/src/contact.test.ts:81:  it.each(['10115', '04109', ' 80331 '])('akzeptiert "%s"', (value) => {
shared/src/contact.test.ts:85:  it.each(['', '1011', '101150', '1011a', '10 115'])('lehnt "%s" mit Hinweis ab', (value) => {
shared/src/contact.test.ts:90:describe('F03 Ort – Zeichen (UC 1.1.2.4)', () => {
shared/src/contact.test.ts:91:  it.each(['Berlin', 'Frankfurt am Main', 'Castrop-Rauxel', 'Gießen', 'Überlingen'])('akzeptiert "%s"', (value) => {
shared/src/contact.test.ts:95:  it('meldet ein leeres Feld', () => {
shared/src/contact.test.ts:99:  it.each(['Halle (Saale)', 'St. Ingbert', 'Köln 1'])('lehnt "%s" wegen unerlaubter Zeichen ab', (value) => {
shared/src/contact.test.ts:104:describe('F03 E-Mail-Adresse (UC 1.1.2.5)', () => {
shared/src/contact.test.ts:108:  it.each(['name@domain.de', 'a@b.fr', 'Max.Mustermann+shop@mail.example.com', ' max@domain.de '])(
shared/src/contact.test.ts:115:  it('akzeptiert genau 320 Zeichen und lehnt 321 Zeichen ab', () => {
shared/src/contact.test.ts:132:  ])('lehnt "%s" mit Hinweis ab', (value) => {
shared/src/contact.test.ts:137:describe('F03 Telefonnummer (UC 1.1.2.6)', () => {
shared/src/contact.test.ts:140:  it.each(['', '   '])('erlaubt ein leeres Feld ("%s")', (value) => {
shared/src/contact.test.ts:144:  it('akzeptiert 3 und 15 Ziffern nach +49', () => {
shared/src/contact.test.ts:149:  it('lehnt 2 und 16 Ziffern nach +49 ab', () => {
shared/src/contact.test.ts:154:  it.each(['0151 1234567', '+43 660 1234567', '+49 151 12a3456', '49 151 1234567'])(
shared/src/contact.test.ts:165:  ])('wandelt "%s" in das Standardformat "%s" um', (input, expected) => {
shared/src/contact.test.ts:171:describe('F03 Kontaktdaten gesamt', () => {
shared/src/contact.test.ts:184:  it('meldet keine Hinweise für gültige Daten', () => {
shared/src/contact.test.ts:188:  it('meldet für ein leeres Formular jedes Pflichtfeld, aber nicht das Telefon', () => {
shared/src/contact.test.ts:203:  it('meldet nur die ungültigen Felder', () => {
shared/src/contact.test.ts:210:  describe('PLZ und Ort im Verzeichnis (UC 1.1.2.3, UC 1.1.2.4)', () => {
shared/src/contact.test.ts:215:    it('akzeptiert eine passende Kombination unabhängig von Groß-/Kleinschreibung', () => {
shared/src/contact.test.ts:219:    it('meldet eine unbekannte PLZ', () => {
shared/src/contact.test.ts:223:    it('meldet einen unbekannten Ort', () => {
shared/src/contact.test.ts:227:    it('meldet unbekannte PLZ und unbekannten Ort gemeinsam', () => {
shared/src/contact.test.ts:231:    it('meldet an der PLZ, wenn PLZ und Ort nicht zusammenpassen', () => {
shared/src/contact.test.ts:235:    it('prüft das Verzeichnis nur bei gültigem Format', () => {
shared/src/contact.test.ts:244:describe('F03 Speicherform der Kontaktdaten', () => {
shared/src/contact.test.ts:257:  it('entfernt Leerzeichen, bringt die Telefonnummer ins Standardformat und schreibt die E-Mail klein', () => {
shared/src/contact.test.ts:271:  it('speichert ein leeres Telefonfeld als null', () => {
shared/src/contact.test.ts:276:describe('F09 Persönliche Anrede (UC 1.1.2.1)', () => {
shared/src/password.test.ts:4:describe('F04 Passwort (UC 1.2.1)', () => {
shared/src/password.test.ts:8:  it.each(['Abcdef1!', 'Sneaker2026#', 'Mein Passwort 1!'])('akzeptiert "%s"', (password) => {
shared/src/password.test.ts:12:  it('zählt Ä als Großbuchstaben', () => {
shared/src/password.test.ts:23:  ])('lehnt "%s" ab (%s)', (password) => {
shared/src/password.test.ts:28:describe('F04 Passwort wiederholen (UC 1.2.2)', () => {
shared/src/password.test.ts:29:  it('akzeptiert eine identische Wiederholung', () => {
shared/src/password.test.ts:33:  it.each(['', 'Sneaker1?', 'sneaker1!', 'Sneaker1! '])('meldet die abweichende Wiederholung "%s"', (confirmation) => {
e2e/registration.spec.ts:19:test.describe('F02 Startseite (UC 1.1.1)', () => {
e2e/registration.spec.ts:20:  test('ein Klick auf "Neues Kundenkonto erstellen" zeigt das Formular zur Eingabe der Kontaktdaten', async ({ page }) => {
e2e/registration.spec.ts:30:test.describe('F03 Kontaktdaten erfassen (UC 1.1.2) und F04 Passwort festlegen (UC 1.2)', () => {
e2e/registration.spec.ts:31:  test('erst gültige Kontaktdaten und ein bestätigtes Passwort aktivieren "Konto anlegen"', async ({ page }) => {
e2e/registration.spec.ts:42:  test('zeigt beim Verlassen einen Hinweis, wenn PLZ und Ort nicht zusammenpassen', async ({ page }) => {
e2e/login-lock.spec.ts:40:test.describe('F08 Anmeldung – Schutz vor Passwort-Raten', () => {
e2e/login-lock.spec.ts:41:  test('4 fehlgeschlagene Anmeldungen sind möglich (UC 1.5.3-001)', async ({ page }) => {
e2e/login-lock.spec.ts:60:  test('5 fehlgeschlagene Anmeldungen sind möglich, 6. führt zur Sperre (UC 1.5.3-002)', async ({ page }) => {
e2e/login-lock.spec.ts:84:  test('während der Sperre bleibt der Sperrhinweis (UC 1.5.3-003)', async ({ page }) => {
e2e/login-lock.spec.ts:117:  test('Sperre gilt je E-Mail-Adresse, unabhängig von Groß-/Kleinschreibung (UC 1.5.3-004)', async ({
e2e/login-lock.spec.ts:151:  test('Fehlversuche werden nach erfolgreicher Anmeldung zurückgesetzt (UC 1.5.3-005)', async ({
e2e/login-lock.spec.ts:199:  test('Anmeldung ist möglich, wenn Fehlerversuche unter 5 liegen (UC 1.5.3-007)', async ({ page }) => {
e2e/account.spec.ts:32:test.describe('F05 Kontoanlage, F06 Kontoaktivierung, F08 Anmeldung, F09 Willkommensseite', () => {
e2e/account.spec.ts:33:  test('Registrierung → Mail → Aktivierung → Anmeldung → Willkommensseite → Abmelden (UC 1.3, 1.5, 1.6)', async ({
e2e/account.spec.ts:72:  test('die Landing Page führt über „Anmelden“ zur Anmeldung (UC 1.4.1)', async ({ page }) => {
e2e/account.spec.ts:79:  test('die Willkommensseite leitet ohne Anmeldung zur Anmeldeseite (UC 1.6.3)', async ({ page }) => {
e2e/account.spec.ts:86:  test('falsche Anmeldedaten zeigen den Hinweis (UC 1.5.1)', async ({ page }) => {
e2e/account.spec.ts:95:  test('eine zweite Registrierung mit derselben E-Mail-Adresse zeigt den Hinweis (UC 1.3.2)', async ({ page }) => {
e2e/account.spec.ts:104:  test('ein unbekannter Link wird als ungültig gemeldet', async ({ page }) => {
e2e/theme.spec.ts:6:test.describe('F01 Theme', () => {
e2e/theme.spec.ts:7:  test('folgt der Systemeinstellung "hell"', async ({ page }) => {
e2e/theme.spec.ts:14:  test('folgt der Systemeinstellung "dunkel"', async ({ page }) => {
e2e/theme.spec.ts:21:  test('Umschalten wirkt sofort und bleibt nach dem Neuladen erhalten', async ({ page }) => {

</tests>

```

**Prüfen:**

- Zwei Zeilen der Tabelle stichprobenartig in den Testdateien nachschlagen: Gibt es den genannten Test an der genannten Stelle?
- Eine gemeldete Lücke in der Testdatei gegenprüfen, bevor daran weitergearbeitet wird.
- Die eingesetzte Testliste enthält keine Einträge aus `e2e/`, keine `.test.tsx`-Dateien und keine `it.each`-Tests (siehe „Prüfen“ in Schritt 1). Das Modell meldet deshalb mehr E2E-Lücken, als tatsächlich bestehen.

## Schritt 3 · Testfälle ableiten

**Ziel:** fachliche Testfälle für UC 1.5.3 als Tabelle, noch ohne Code.

**Eingabe:** `docs/feature_08_anmeldung.md` zwischen `<spezifikation>` und `</spezifikation>`. Im Prompt unten bereits eingesetzt.

**Prompt:**

```
Rolle: Testanalyst. Leite aus der Spezifikation E2E-Testfälle für UC 1.5.3 ab (Grenzwertanalyse an der Grenze 5 Fehlversuche).
Ausgabe: Tabelle ID | Regel (Zitat) | Schritte | Erwartetes Ergebnis. Hinweistexte wortgleich.
Danach „Annahmen“ und „Offene Fragen“. Erfinde keine Regeln. Nur synthetische Testdaten.

<spezifikation> 
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
</spezifikation>
```

**Prüfen:** Jede erwartete Aussage braucht ein Zitat aus der Spezifikation. Typische Abweichungen in diesem Beispiel:

- **Grenze 5/6:** Der 5. Fehlversuch zeigt noch „E-Mail-Adresse oder Passwort ist falsch“. Erst der 6. Versuch zeigt die Sperre.
- **Gesperrter Button:** Die Spezifikation sagt nichts darüber, dass der Button während der Sperre deaktiviert ist.
- **Hinweis nach dem Neuladen:** Die Spezifikation fordert keinen sichtbaren Hinweis nach dem Neuladen der Seite.

Solche Erwartungen streichen oder als offene Frage führen, bevor Code entsteht. Wer mag, vollzieht die Testfälle von Hand nach: auf der Anmeldeseite sechsmal mit einer unbekannten E-Mail-Adresse und falschem Passwort anmelden.

## Schritt 4 · Testcode erzeugen lassen

**Ziel:** die neue Datei `e2e/login-lock.spec.ts`. Bestehende Dateien bleiben unverändert.

**Eingaben:** `e2e/account.spec.ts` als Stilvorlage zwischen `<vorlage>` und `</vorlage>`, `client/src/LoginPage.tsx` zwischen `<seite>` und `</seite>`. Im Prompt unten bereits eingesetzt. Der Prompt gehört in den Chat aus Schritt 3.

**Prompt:**

```
Schreibe für die freigegebenen Testfälle einen Playwright-Test als NEUE Datei e2e/login-lock.spec.ts.
Regeln: Stil, Selektoren und Benennung wie in der Vorlage. Titel mit „(UC 1.5.3)“. Eigene E-Mail-Adresse, die kein anderer Test nutzt.
Keine Änderung an bestehenden Dateien, keine neuen Pakete, kein waitForTimeout.
Nach jedem Klick auf die Antwort von POST /api/session warten, denn der Hinweistext bleibt bei Versuch 1 bis 5 gleich. 
Nach jeder Aktion, die den Server anspricht, zuerst eine sichtbare Bestätigung im Browser abwarten, bevor der Test Dateien liest oder weiternavigiert. Übernimm Hilfsfunktionen der Vorlage samt den Erwartungen, die dort direkt nach ihrem Aufruf stehen.

Gib den Source code vollständig hier aus.

<vorlage> 
// account.spec.ts
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { expect, test, type Page } from '@playwright/test';

const OUTBOX_DIR = join(process.env.E2E_DATA_DIR ?? '', 'outbox');

async function register(page: Page, email: string) {
  await page.goto('/');
  await page.getByRole('link', { name: 'Neues Kundenkonto erstellen' }).click();
  await page.getByLabel('Anrede').selectOption({ label: 'Herr' });
  await page.getByLabel('Vorname').fill('Max');
  await page.getByLabel('Nachname').fill('Mustermann');
  await page.getByLabel('Straße').fill('Bahnhofsplatz');
  await page.getByLabel('Hausnummer').fill('1');
  await page.getByLabel('PLZ').fill('96444');
  await page.getByLabel('Ort', { exact: true }).fill('Coburg');
  await page.getByLabel('E-Mail-Adresse').fill(email);
  await page.getByLabel('Passwort', { exact: true }).fill('Sneaker1!');
  await page.getByLabel('Passwort wiederholen').fill('Sneaker1!');
  await page.getByRole('button', { name: 'Konto anlegen' }).click();
}

// Liest die Bestätigungsmail aus dem Datei-Postfach des Test-Servers.
async function confirmationMailTo(email: string): Promise<{ subject: string; text: string }> {
  for (const file of await readdir(OUTBOX_DIR)) {
    const mail = JSON.parse(await readFile(join(OUTBOX_DIR, file), 'utf8'));
    if (mail.to === email) return mail;
  }
  throw new Error(`Keine Mail an ${email} im Postfach`);
}

test.describe('F05 Kontoanlage, F06 Kontoaktivierung, F08 Anmeldung, F09 Willkommensseite', () => {
  test('Registrierung → Mail → Aktivierung → Anmeldung → Willkommensseite → Abmelden (UC 1.3, 1.5, 1.6)', async ({
    page,
  }) => {
    await register(page, 'max.aktivierung@example.de');

    await expect(page.getByText('Deine Kontaktdaten wurden erfolgreich verifiziert.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Bitte bestätige deine E-Mail-Adresse' })).toBeVisible();

    const mail = await confirmationMailTo('max.aktivierung@example.de');
    expect(mail.subject).toBe('Bitte bestätige dein SneakerStudio-Kundenkonto');
    expect(mail.text).toContain('Hallo Herr Mustermann,');
    expect(mail.text).toContain('wird dein Kundenkonto gelöscht');
    const link = mail.text.match(/http:\/\/localhost:5173\/aktivieren\?token=\S+/)?.[0];
    expect(link).toBeDefined();

    await page.goto(link ?? '');
    await expect(page.getByRole('heading', { name: 'Konto erfolgreich aktiviert!' })).toBeVisible();
    await page.getByRole('link', { name: 'Jetzt anmelden' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Anmelden' })).toBeVisible();

    await page.getByLabel('E-Mail-Adresse').fill('max.aktivierung@example.de');
    await page.getByLabel('Passwort').fill('Sneaker1!');
    await page.getByRole('button', { name: 'Anmelden' }).click();

    await expect(page.getByRole('heading', { level: 1, name: 'Willkommen, Herr Mustermann!' })).toBeVisible();
    await expect(page.getByText('96444 Coburg')).toBeVisible();
    await expect(page.getByRole('banner').getByText('Herr Mustermann')).toBeVisible();

    // Landing Page für Angemeldete: „Zu meinem Konto“ statt der Einstiege (UC 1.4.1)
    await page.getByRole('link', { name: 'SneakerStudio' }).click();
    await expect(page.getByRole('main').getByRole('link', { name: 'Anmelden' })).toHaveCount(0);
    await page.getByRole('link', { name: 'Zu meinem Konto' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Willkommen, Herr Mustermann!' })).toBeVisible();

    await page.getByRole('button', { name: 'Abmelden' }).click();
    await expect(page.getByRole('heading', { name: 'Dein Sneaker. Dein Style.' })).toBeVisible();
    await expect(page.getByRole('banner').getByRole('link', { name: 'Anmelden' })).toBeVisible();
  });

  test('die Landing Page führt über „Anmelden“ zur Anmeldung (UC 1.4.1)', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('main').getByRole('link', { name: 'Anmelden' }).click();

    await expect(page.getByRole('heading', { level: 1, name: 'Anmelden' })).toBeVisible();
  });

  test('die Willkommensseite leitet ohne Anmeldung zur Anmeldeseite (UC 1.6.3)', async ({ page }) => {
    await page.goto('/willkommen');

    await expect(page).toHaveURL(/\/anmelden$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Anmelden' })).toBeVisible();
  });

  test('falsche Anmeldedaten zeigen den Hinweis (UC 1.5.1)', async ({ page }) => {
    await page.goto('/anmelden');
    await page.getByLabel('E-Mail-Adresse').fill('niemand@example.de');
    await page.getByLabel('Passwort').fill('Falsch123!');
    await page.getByRole('button', { name: 'Anmelden' }).click();

    await expect(page.getByRole('alert')).toHaveText('E-Mail-Adresse oder Passwort ist falsch');
  });

  test('eine zweite Registrierung mit derselben E-Mail-Adresse zeigt den Hinweis (UC 1.3.2)', async ({ page }) => {
    await register(page, 'max.dublette@example.de');
    await expect(page.getByText('Deine Kontaktdaten wurden erfolgreich verifiziert.')).toBeVisible();

    await register(page, 'MAX.DUBLETTE@example.de');

    await expect(page.getByText('Diese E-Mail-Adresse ist bereits registriert')).toBeVisible();
  });

  test('ein unbekannter Link wird als ungültig gemeldet', async ({ page }) => {
    await page.goto('/aktivieren?token=unbekannt');

    await expect(page.getByRole('heading', { name: 'Dieser Bestätigungslink ist ungültig.' })).toBeVisible();
  });
});

</vorlage>

<seite> 
// LOGIN PAGE

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { sessionQuery, type Customer } from './session.ts';

const CONTROL_CLASS =
  'mt-1 block w-full rounded-md border border-field-line bg-field px-3 py-2 text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

type LoginResult = { signedIn: true; customer: Customer } | { signedIn: false; hint: string };

async function signIn(credentials: { email: string; password: string }): Promise<LoginResult> {
  const response = await fetch('/api/session', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (response.ok) return { signedIn: true, customer: ((await response.json()) as { customer: Customer }).customer };
  if (response.status === 401 || response.status === 403 || response.status === 429) {
    const { error } = (await response.json()) as { error: string };
    return { signedIn: false, hint: error };
  }
  throw new Error(`Anmeldung fehlgeschlagen: HTTP ${response.status}`);
}

export function LoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useMutation({
    mutationFn: signIn,
    onSuccess: (result) => {
      if (!result.signedIn) return;
      // Header und Willkommensseite kennen den Kunden sofort, ohne erneute Abfrage.
      queryClient.setQueryData(sessionQuery.queryKey, result.customer);
      void navigate({ to: '/willkommen' });
    },
  });
  const canSubmit = email.trim() !== '' && password !== '' && !login.isPending;
  const hint = login.isError
    ? 'Die Anmeldung ist fehlgeschlagen. Bitte versuche es später erneut.'
    : login.data?.signedIn === false
      ? login.data.hint
      : null;

  return (
    <section className="mx-auto max-w-md">
      <h1 className="text-3xl font-extrabold tracking-tight">Anmelden</h1>
      <div className="mt-4 h-1 w-12 bg-brand" aria-hidden="true" />

      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          if (canSubmit) login.mutate({ email, password });
        }}
        className="mt-8 space-y-5 rounded-xl border border-line bg-surface p-6 sm:p-8"
      >
        <div>
          <label htmlFor="email" className="text-sm font-medium">
            E-Mail-Adresse
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={CONTROL_CLASS}
          />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-medium">
            Passwort
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={CONTROL_CLASS}
          />
        </div>

        {hint && (
          <p role="alert" className="text-sm text-danger">
            {hint}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-md bg-primary px-6 py-3 text-sm font-bold tracking-wider text-on-primary uppercase enabled:hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            Anmelden
          </button>
          {login.isPending && (
            <p role="status" className="text-sm text-muted">
              Du wirst angemeldet …
            </p>
          )}
        </div>
      </form>

      <p className="mt-6 text-sm text-muted">
        Noch kein Konto?{' '}
        <Link to="/registrieren" className="font-semibold text-accent hover:underline">
          Registrieren
        </Link>
      </p>
    </section>
  );
}

</seite>

```

Den ausgegebenen Code als `e2e/login-lock.spec.ts` speichern.

**Prüfen, vor dem ersten Lauf:**

- Wartet der Test nach `register(...)` auf „Deine Kontaktdaten wurden erfolgreich verifiziert.“, bevor er das Postfach liest? In der Vorlage steht diese Zeile im Test, nicht in der Hilfsfunktion, und geht beim Übertragen leicht verloren.
- Stimmt die Grenze 5/6 aus Schritt 3 auch im Code?
- Verwendet jeder Testfall eine eigene E-Mail-Adresse?

## Schritt 5 · Ausführen

Läuft der API-Server der Anwendung auf Port 3000, diesen vorher stoppen. Playwright startet einen eigenen Server mit frischer Datenbank und bricht sonst ab.

```bash
npx playwright test e2e/login-lock.spec.ts
npm run typecheck
```

**Port 3000 ist anderweitig belegt** (zum Beispiel durch OpenWebUI): Dann die lokale Konfiguration `playwright.local.config.ts` verwenden. Sie startet die API auf Port 3100.

```bash
npx playwright test -c playwright.local.config.ts e2e/login-lock.spec.ts
```

## Schritt 6 · Im Fehlerfall

Bei Rot die **vollständige** Ausgabe in den Chat kopieren und dazu angeben, welche Tests bereits grün sind. So bleibt das Modell bei den fehlerhaften Tests.

**Prompt:**

```
Test 1 und 7 laufen erfolgreich. Folgendes Ergebnis wird geliefert. Überarbeite den source code der tests damit die Ergebnisse passen.

<ergebnis> 
✓ 1 …Schutz vor Passwort-Raten › 4 fehlgeschlagene Anmeldungen sind möglich (UC 1.5.3-001) (1.4s) ✘ 2 …z vor P

...

</ergebnis>
```

**Prüfen:** Ob der Test falsch ist oder die Anwendung von der Spezifikation abweicht, entscheidet der Mensch anhand der Feature-Datei. Ein Test darf nicht an ein falsches Verhalten der Anwendung angepasst werden, nur damit er grün wird.

**Fehlerbilder aus diesem Durchlauf:**

| Meldung | Ursache | Korrektur |
|---|---|---|
| `ENOENT … outbox` oder „Keine Mail an … im Postfach“ | Der Test liest das Postfach, bevor die Mail geschrieben ist. | nach `register(...)` auf die Bestätigung im Browser warten |
| erwartet Sperrhinweis, erhalten „E-Mail-Adresse oder Passwort ist falsch“ | Der Test erwartet die Sperre beim 5. statt beim 6. Versuch. | fünf Fehlversuche, dann ein sechster Versuch mit Sperrhinweis |
| `strict mode violation … resolved to 2 elements` | Auf der Startseite gibt es zwei Links „Anmelden“. | `page.goto('/anmelden')` oder den Link über `getByRole('main')` bzw. `getByRole('banner')` eingrenzen |
| `http://localhost:3000 is already used` | Port 3000 ist belegt. | lokale Konfiguration aus Schritt 5 |

Schlägt das Modell einen Umweg vor, etwa Testdaten direkt in die Datenbank zu schreiben, zurück zur Vorlage lenken: Registrierung und Aktivierung über die Oberfläche genügen.

## Schritt 7 · Den Test selbst prüfen (Mutation)

Ein grüner Test beweist noch nicht, dass er Fehler bemerkt. Gegenprobe:

1. In `server/src/login-throttle.ts` den Wert `MAX_FAILED_ATTEMPTS` von 5 auf 6 ändern.
2. Den Test erneut ausführen. Er muss rot werden.
3. Den Wert zurücksetzen und alle E2E-Tests laufen lassen.

Bleibt der Test in Punkt 2 grün, prüft er die Grenze nicht.

---

## Mögliches Ergebnis

So kann `e2e/login-lock.spec.ts` nach dem Durchlauf aussehen. Ergebnisse streuen; Titel, Anzahl und Aufbau der Testfälle fallen bei jedem Lauf etwas anders aus.

```typescript
// e2e/login-lock.spec.ts
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { expect, test, type Page } from '@playwright/test';

const OUTBOX_DIR = join(process.env.E2E_DATA_DIR ?? '', 'outbox');

async function register(page: Page, email: string) {
  await page.goto('/');
  await page.getByRole('link', { name: 'Neues Kundenkonto erstellen' }).click();
  await page.getByLabel('Anrede').selectOption({ label: 'Herr' });
  await page.getByLabel('Vorname').fill('Max');
  await page.getByLabel('Nachname').fill('Mustermann');
  await page.getByLabel('Straße').fill('Bahnhofsplatz');
  await page.getByLabel('Hausnummer').fill('1');
  await page.getByLabel('PLZ').fill('96444');
  await page.getByLabel('Ort', { exact: true }).fill('Coburg');
  await page.getByLabel('E-Mail-Adresse').fill(email);
  await page.getByLabel('Passwort', { exact: true }).fill('Sneaker1!');
  await page.getByLabel('Passwort wiederholen').fill('Sneaker1!');
  await page.getByRole('button', { name: 'Konto anlegen' }).click();
}

// Liest die Bestätigungsmail aus dem Datei-Postfach des Test-Servers.
async function confirmationMailTo(email: string): Promise<{ subject: string; text: string }> {
  for (const file of await readdir(OUTBOX_DIR)) {
    const mail = JSON.parse(await readFile(join(OUTBOX_DIR, file), 'utf8'));
    if (mail.to === email) return mail;
  }
  throw new Error(`Keine Mail an ${email} im Postfach`);
}

// Aktiviert ein Konto über den Bestätigungslink aus der Mail.
async function activateAccount(page: Page, email: string) {
  const mail = await confirmationMailTo(email);
  const link = mail.text.match(/http:\/\/localhost:5173\/aktivieren\?token=\S+/)?.[0];
  expect(link).toBeDefined();
  await page.goto(link ?? '');
  await expect(page.getByRole('heading', { name: 'Konto erfolgreich aktiviert!' })).toBeVisible();
}

test.describe('F08 Anmeldung – Schutz vor Passwort-Raten', () => {
  test('4 fehlgeschlagene Anmeldungen sind möglich (UC 1.5.3-001)', async ({ page }) => {
    const email = 'lock.test.001@example.de';
    await register(page, email);
    await expect(page.getByText('Deine Kontaktdaten wurden erfolgreich verifiziert.')).toBeVisible();
    await activateAccount(page, email);
    await page.getByRole('link', { name: 'Jetzt anmelden' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Anmelden' })).toBeVisible();

    // 4 fehlgeschlagene Versuche
    for (let i = 1; i <= 4; i++) {
      await page.getByLabel('E-Mail-Adresse').fill(email);
      await page.getByLabel('Passwort').fill('FalschesPassword1!');
      await page.getByRole('button', { name: 'Anmelden' }).click();
      await expect(page.getByRole('alert')).toHaveText('E-Mail-Adresse oder Passwort ist falsch');
      await page.getByLabel('Passwort').clear();
    }

    // 5. Versuch mit korrektem Passwort sollte funktionieren
    await page.getByLabel('E-Mail-Adresse').fill(email);
    await page.getByLabel('Passwort').fill('Sneaker1!');
    await page.getByRole('button', { name: 'Anmelden' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Willkommen, Herr Mustermann!' })).toBeVisible();
  });

  test('5 fehlgeschlagene Anmeldungen sind möglich, 6. führt zur Sperre (UC 1.5.3-002)', async ({ page }) => {
    const email = 'lock.test.002@example.de';
    await register(page, email);
    await expect(page.getByText('Deine Kontaktdaten wurden erfolgreich verifiziert.')).toBeVisible();
    await activateAccount(page, email);
    await page.getByRole('link', { name: 'Jetzt anmelden' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Anmelden' })).toBeVisible();

    // 5 fehlgeschlagene Versuche
    for (let i = 1; i <= 5; i++) {
      await page.getByLabel('E-Mail-Adresse').fill(email);
      await page.getByLabel('Passwort').fill('FalschesPassword1!');
      await page.getByRole('button', { name: 'Anmelden' }).click();
      await expect(page.getByRole('alert')).toHaveText('E-Mail-Adresse oder Passwort ist falsch');
      await page.getByLabel('Passwort').clear();
    }

    // 6. Versuch: gesperrt, auch mit korrektem Passwort
    await page.getByLabel('E-Mail-Adresse').fill(email);
    await page.getByLabel('Passwort').fill('Sneaker1!');
    await page.getByRole('button', { name: 'Anmelden' }).click();
    await expect(page.getByRole('alert')).toHaveText(
      'Zu viele Anmeldeversuche. Bitte versuche es in 15 Minuten erneut.'
    );
  });

  test('während der Sperre bleibt der Sperrhinweis (UC 1.5.3-003)', async ({ page }) => {
    const email = 'lock.test.003@example.de';
    await register(page, email);
    await expect(page.getByText('Deine Kontaktdaten wurden erfolgreich verifiziert.')).toBeVisible();
    await activateAccount(page, email);
    await page.getByRole('link', { name: 'Jetzt anmelden' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Anmelden' })).toBeVisible();

    // 5 fehlgeschlagene Versuche
    for (let i = 1; i <= 5; i++) {
      await page.getByLabel('E-Mail-Adresse').fill(email);
      await page.getByLabel('Passwort').fill('FalschesPassword1!');
      await page.getByRole('button', { name: 'Anmelden' }).click();
      await expect(page.getByRole('alert')).toHaveText('E-Mail-Adresse oder Passwort ist falsch');
      await page.getByLabel('Passwort').clear();
    }

    // Während der Sperre: 3 weitere Anmeldeversuche
    for (let i = 1; i <= 3; i++) {
      await page.getByLabel('E-Mail-Adresse').fill(email);
      await page.getByLabel('Passwort').fill('VerschiedenesPW' + i + '!');
      await page.getByRole('button', { name: 'Anmelden' }).click();
      await expect(page.getByRole('alert')).toHaveText(
        'Zu viele Anmeldeversuche. Bitte versuche es in 15 Minuten erneut.'
      );
      await page.getByLabel('Passwort').clear();
    }
  });

  test('Sperre gilt je E-Mail-Adresse, unabhängig von Groß-/Kleinschreibung (UC 1.5.3-006)', async ({ page }) => {
    const email = 'lock.test.006@example.de';
    await register(page, email);
    await expect(page.getByText('Deine Kontaktdaten wurden erfolgreich verifiziert.')).toBeVisible();
    await activateAccount(page, email);
    await page.getByRole('link', { name: 'Jetzt anmelden' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Anmelden' })).toBeVisible();

    // 5 fehlgeschlagene Versuche für lock.test.006@example.de
    for (let i = 1; i <= 5; i++) {
      await page.getByLabel('E-Mail-Adresse').fill(email);
      await page.getByLabel('Passwort').fill('FalschesPassword1!');
      await page.getByRole('button', { name: 'Anmelden' }).click();
      await expect(page.getByRole('alert')).toHaveText('E-Mail-Adresse oder Passwort ist falsch');
      await page.getByLabel('Passwort').clear();
    }

    // Versuch mit nicht registrierter E-Mail: sollte funktionieren (nicht gesperrt)
    await page.getByLabel('E-Mail-Adresse').fill('nicht.registriert@example.de');
    await page.getByLabel('Passwort').fill('SomePassword1!');
    await page.getByRole('button', { name: 'Anmelden' }).click();
    await expect(page.getByRole('alert')).toHaveText('E-Mail-Adresse oder Passwort ist falsch');
    await page.getByLabel('E-Mail-Adresse').clear();
    await page.getByLabel('Passwort').clear();

    // Versuch mit großgeschriebener E-Mail (LOCK.TEST.006@EXAMPLE.DE): gesperrt
    await page.getByLabel('E-Mail-Adresse').fill('LOCK.TEST.006@EXAMPLE.DE');
    await page.getByLabel('Passwort').fill('FalschesPassword1!');
    await page.getByRole('button', { name: 'Anmelden' }).click();
    await expect(page.getByRole('alert')).toHaveText(
      'Zu viele Anmeldeversuche. Bitte versuche es in 15 Minuten erneut.'
    );
  });

  test('Fehlversuche werden nach erfolgreicher Anmeldung zurückgesetzt (UC 1.5.3-008)', async ({ page }) => {
    const email = 'lock.test.008@example.de';
    await register(page, email);
    await expect(page.getByText('Deine Kontaktdaten wurden erfolgreich verifiziert.')).toBeVisible();
    await activateAccount(page, email);
    await page.getByRole('link', { name: 'Jetzt anmelden' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Anmelden' })).toBeVisible();

    // 4 fehlgeschlagene Versuche
    for (let i = 1; i <= 4; i++) {
      await page.getByLabel('E-Mail-Adresse').fill(email);
      await page.getByLabel('Passwort').fill('FalschesPassword1!');
      await page.getByRole('button', { name: 'Anmelden' }).click();
      await expect(page.getByRole('alert')).toHaveText('E-Mail-Adresse oder Passwort ist falsch');
      await page.getByLabel('Passwort').clear();
    }

    // Erfolgreiche Anmeldung: Zähler wird zurückgesetzt
    await page.getByLabel('E-Mail-Adresse').fill(email);
    await page.getByLabel('Passwort').fill('Sneaker1!');
    await page.getByRole('button', { name: 'Anmelden' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Willkommen, Herr Mustermann!' })).toBeVisible();

    // Abmelden
    await page.getByRole('button', { name: 'Abmelden' }).click();
    await expect(page.getByRole('heading', { name: 'Dein Sneaker. Dein Style.' })).toBeVisible();

    // 5 fehlgeschlagene Versuche (Zähler war bei 0 nach erfolgreicher Anmeldung)
    await page.goto('/anmelden');
    for (let i = 1; i <= 5; i++) {
      await page.getByLabel('E-Mail-Adresse').fill(email);
      await page.getByLabel('Passwort').fill('FalschesPassword1!');
      await page.getByRole('button', { name: 'Anmelden' }).click();
      await expect(page.getByRole('alert')).toHaveText('E-Mail-Adresse oder Passwort ist falsch');
      await page.getByLabel('Passwort').clear();
    }

    // 6. Versuch: gesperrt
    await page.getByLabel('E-Mail-Adresse').fill(email);
    await page.getByLabel('Passwort').fill('Sneaker1!');
    await page.getByRole('button', { name: 'Anmelden' }).click();
    await expect(page.getByRole('alert')).toHaveText(
      'Zu viele Anmeldeversuche. Bitte versuche es in 15 Minuten erneut.'
    );
  });

  test('Anmeldung ist möglich, wenn Fehlerversuche unter 5 liegen (UC 1.5.3-007)', async ({ page }) => {
    const email = 'lock.test.007@example.de';
    await register(page, email);
    await expect(page.getByText('Deine Kontaktdaten wurden erfolgreich verifiziert.')).toBeVisible();
    await activateAccount(page, email);
    await page.getByRole('link', { name: 'Jetzt anmelden' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Anmelden' })).toBeVisible();

    // 4 fehlgeschlagene Versuche
    for (let i = 1; i <= 4; i++) {
      await page.getByLabel('E-Mail-Adresse').fill(email);
      await page.getByLabel('Passwort').fill('FalschesPassword1!');
      await page.getByRole('button', { name: 'Anmelden' }).click();
      await expect(page.getByRole('alert')).toHaveText('E-Mail-Adresse oder Passwort ist falsch');
      await page.getByLabel('Passwort').clear();
    }

    // 5. Versuch mit korrektem Passwort: sollte funktionieren
    await page.getByLabel('E-Mail-Adresse').fill(email);
    await page.getByLabel('Passwort').fill('Sneaker1!');
    await page.getByRole('button', { name: 'Anmelden' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Willkommen, Herr Mustermann!' })).toBeVisible();
  });
});
```

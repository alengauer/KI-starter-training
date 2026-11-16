# SneakerStudio

Web-App für das Kundenkonto von SneakerStudio, Release 0.1 „Registrierung & Login“: Landing Page, Konto erstellen, Konto per Bestätigungsmail aktivieren, anmelden, Willkommensseite.

Das Projekt ist zugleich Trainingsprojekt für spezifikationsgetriebenes Arbeiten mit Claude Code: Jedes Feature leitet sich aus einem Use Case ab, Tests prüfen die Spezifikation, und Leitplanken (Regeln, Hooks, Subagent) sichern das ab. Wie damit Tests entworfen und geprüft werden, zeigt [Demo.md](Demo.md).

## Voraussetzungen

- Node.js ≥ 24.15 (der Server läuft ohne Build direkt aus den TypeScript-Dateien)
- npm (Workspaces)
- Für E2E-Tests einmalig: `npx playwright install chromium`
- Für die Hooks unter `.claude/hooks/`: `jq`

```bash
npm install
```

## Starten

Der Server liefert das Frontend nicht selbst aus. Es laufen immer zwei Prozesse: die API auf Port 3000 und der Client auf Port 5173.

### Entwicklung

```bash
npm run dev -w server   # Terminal 1: API mit Neustart bei Änderungen
npm run dev -w client   # Terminal 2: Vite-Dev-Server
```

### Gebauter Client mit Server

```bash
npm start -w server                                      # Terminal 1
npm run build -w client                                  # Terminal 2
cd client && npx vite preview --port 5173 --strictPort
```

Die App ist danach unter http://localhost:5173 erreichbar.

- **Port 5173 ist Pflicht.** Die Aktivierungslinks in den Bestätigungsmails zeigen auf `http://localhost:5173`; `vite preview` nimmt ohne Angabe 4173. Alternativ den Server mit `APP_BASE_URL=http://localhost:4173` starten.
- **API-Proxy.** Dev-Server und Preview leiten `/api` an `http://localhost:3000` weiter (siehe `client/vite.config.ts`).
- **`vite preview` ist nur eine lokale Vorschau.** Einen Ein-Prozess-Betrieb, in dem Express `client/dist` ausliefert, gibt es nicht.

### Konfiguration des Servers

| Variable | Standard | Bedeutung |
|---|---|---|
| `PORT` | `3000` | Port der API |
| `DB_PATH` | `server/data/sneakerstudio.db` | SQLite-Datenbank (Kundenstamm, Sitzungen) |
| `OUTBOX_DIR` | `server/data/outbox` | Datei-Postfach: Bestätigungsmails landen hier als Dateien |
| `APP_BASE_URL` | `http://localhost:5173` | Basis der Aktivierungslinks |

Es wird keine echte Mail verschickt. Um ein Konto zu aktivieren, den Link aus der jüngsten Datei im Datei-Postfach öffnen.

### Daten zurücksetzen

Alle lokalen Daten liegen unter `server/data/`: die Datenbank mit Kundenkonten und Sitzungen sowie das Datei-Postfach. Zum Zurücksetzen den Server stoppen, den Ordner löschen und den Server neu starten:

```bash
rm -rf server/data
npm start -w server
```

Der Server legt Ordner und Datenbank beim Start neu an, das Postfach beim ersten Mailversand. Danach gibt es keine Konten mehr; bereits verschickte Aktivierungslinks und bestehende Anmeldungen im Browser sind ungültig.

- Nur das Postfach leeren: `rm -rf server/data/outbox`
- Mit geänderten `DB_PATH` oder `OUTBOX_DIR` stattdessen diese Pfade löschen.
- Die E2E-Tests brauchen kein Zurücksetzen: Jeder Lauf nutzt eine frische Datenbank in einem temporären Ordner und lässt `server/data/` unberührt.

## Tests

| Befehl | Zweck |
|---|---|
| `npm test` | Unit- und Komponententests (Vitest) für `shared`, `server`, `client` |
| `npx vitest run <datei> -t "<testname>"` | einzelner Test |
| `npm run test:e2e` | E2E-Tests (Playwright); startet Server und Client selbst, mit frischer Datenbank und leerem Postfach |
| `npm run typecheck` | Typprüfung aller Workspaces und der E2E-Tests |

## Verzeichnisstruktur

```
sneakerstudio/
├── shared/            fachliche Regeln (Kontaktdaten, Passwort, PLZ-Verzeichnis) – von Client und Server genutzt
├── server/            Express-API: Registrierung, Aktivierung, Anmeldung, Sitzungen, Mailversand ins Datei-Postfach
│   └── data/          Datenbank und Datei-Postfach (lokal, nicht versioniert)
├── client/            React-App (TanStack Query/Router, Tailwind, Vite)
│   └── dist/          Build-Ergebnis (nicht versioniert)
├── e2e/               Playwright-Tests: Registrierung, Konto, Theme
├── docs/              Spezifikation und Fortschritt, siehe unten
├── prompts/           versionierte Prompts, z. B. für den Testfallentwurf
├── tools/             Skripte, z. B. Testfallentwürfe im Batch mit `claude -p`
├── .claude/           Leitplanken für Claude Code: Subagent, Skills, Hooks, Berechtigungen
├── CLAUDE.md          Arbeitsregeln für Claude Code in diesem Repository
├── Demo.md            Anleitung: Tests entwerfen und mit Mutationstests prüfen
├── SneakerStudio.pdf  Konzept & Design
└── SNEAKERSTUDIO-030826-1511-242-USECASE.pdf   Use Cases
```

Tests liegen neben dem Code (`*.test.ts`). `SneakerStudio Web App - Transcript.md` ist der Sitzungsverlauf, in dem die App entstanden ist.

### Architektur in Kürze

- npm workspaces: `shared`, `server`, `client`.
- Validierungsregeln stehen nur in `shared/`; Client und Server rufen dieselben Funktionen auf.
- Umsysteme (ERP-Kundenstamm, Mailversand, Adressprüfung) sind nur über Adapter-Interfaces angebunden.
- TypeScript mit „erasable syntax“ und relativen Imports mit `.ts`-Endung, damit Node den Server ohne Build ausführt.
- Wenige Abhängigkeiten, Node-Bordmittel bevorzugt (`node:sqlite`, `node:crypto`, `fetch`).

## Verzeichnis `docs/`

Die Feature-Dateien sind die Quelle der Wahrheit: Regeln, Hinweistexte (wortgleich aus den Use Cases), Annahmen und geforderte Testfälle.

| Datei | Inhalt |
|---|---|
| `feature_01_plattform_design.md` | F01 Plattform & Design-System (Tokens, Dark/Light-Mode, App-Shell) |
| `feature_02_startseite.md` | F02 Startseite |
| `feature_03_kontaktdaten.md` | F03 Kontaktdaten erfassen |
| `feature_04_passwort.md` | F04 Passwort festlegen |
| `feature_05_kontoanlage.md` | F05 Kontoanlage |
| `feature_06_kontoaktivierung.md` | F06 Kontoaktivierung |
| `feature_07_landing_page.md` | F07 Landing Page |
| `feature_08_anmeldung.md` | F08 Anmeldung |
| `feature_09_willkommensseite.md` | F09 Willkommensseite |
| `usecases_entwurf.md` | aus der Design-Vorlage abgeleitete Use Cases (Entwurf bis zur fachlichen Freigabe) |
| `progress.md` | Fortschritt: abgehakte Features und Steps |

## Verzeichnis `.claude/`

| Pfad | Zweck |
|---|---|
| `agents/test-reviewer.md` | Subagent, der einen Step unabhängig gegen die Feature-Datei prüft; ändert nichts |
| `skills/testentwurf/` | wählt das Testentwurfsverfahren (ISTQB CTFL 4.0) und liefert Testfälle als CSV, mit Prüfskript |
| `skills/testfaelle-grenzwerte/` | Äquivalenzklassen und Grenzwertanalyse für Eingabefelder |
| `skills/gherkin-stil/` | Gherkin-Szenarien im Teamstil (deutsch, deklarativ) |
| `hooks/protect-tests.sh` | blockiert das Ändern bestehender Testdateien |
| `hooks/check-tests-unchanged.sh` | meldet am Ende jeder Antwort, wenn Testdateien vom letzten Commit abweichen |
| `settings.json` | Berechtigungen (erlauben, nachfragen, verbieten) und Hook-Anbindung |
| `launch.json` | Startkonfiguration für Client und Server |

## Arbeitsweise

Die verbindlichen Regeln stehen in [CLAUDE.md](CLAUDE.md): kleine Steps mit Plan und Freigabe, kein Code ohne Test und ohne Use-Case-Bezug, bestehende Tests bleiben unangetastet, Commits macht der Mensch.

# SneakerStudio Web App

## Basis Prompt:


```md
In @SneakerStudio.pdf ist eine Produkt Vorstellung für ein Sneaker Shopping Web App. 
Das ist das Konzept hinter der zu erstellenden Web App. 
Im ersten Schritt sollen die Use Cases aus @SNEAKERSTUDIO-030826-1511-242-USECASE.pdf  
bezüglich User gelöst werden.
Bitte mach ein /init für die CLAUDE.MD und das prinzipielle Projekt Setup.
Baue Server und Client Step by Step mit folgendem Tech Stack:

* node mit express
* react mit tanstack (query, router, ...)
* tailwind
* Playwright
* vite und vitest

Bitte gestalte die CSS möglichst nahe am Design von @SneakerStudio.pdf.
Das sind die Farben für den Dark Mode - bitte such auch Farben für einen 
passenden Light mode der dem Design entspricht.

Coding Grundregeln:

* Erstatte nach jedem Step Bericht was erstellt wurde, was damit erreicht 
wurde und warum es erstellt wurde. Erkläre die in diesem Schritt erstellten 
Dateien bzw. welche Änderungen an den Dateien durchgeführt wurden.

* Kein Code ohne Test
* Kein Code ohne Nutzen der sich direkt an den Anforderungen bzw. Use Cases orientiert.
* Im Zweifel nachfragen bis Klarheit hergestellt ist.
* So wenige Bibliotheken und Abhängigkeiten wie möglich - im Zweifel nachfragen
* Fortschritt Step by Step in docs/progress.md - nur ticks mit feature namen
* CLAUDE.MD enthält nur Regeln - keine ausführlichen Beschreibungen und inhaltlichen Texte
* Ausführliche Beschreibungen sind in Feature Files docs/feature_xx_name.md 
* Jedes Feature leitet sich von mindestens einem Use Case ab


Erstelle bitte 

* Die Features auf Basis der Use Cases sowie Basis Plattform Features auf Basis der Design Vorlage.
* Den Server und den Client
* Die Tests
```

PDFs gelesen (10 Seiten Konzept, 19 Seiten Use Cases). Ich extrahiere gerade die exakten Farbwerte aus dem Design, danach kläre ich offene Punkte mit dir.

Beide PDFs gelesen, Farben aus dem Design gemessen. Bevor ich etwas anlege, hier mein Verständnis und der Plan. Vier Punkte muss ich vorher mit dir klären.

**Verständnis**
- Release 0.1 „Kundenkonto“: Startseite mit „Neues Kundenkonto erstellen“ → Formular (Anrede, Vorname, Name, Straße, Hausnr., PLZ, Ort, E-Mail, Telefon, Passwort und Wiederholung) → Kontoanlage beauftragen („in Bearbeitung“) → E-Mail auf Einzigartigkeit im ERP prüfen → Kunde anlegen → Bestätigungsmail mit 24-h-Link → Aktivierung. Ohne Klick wird das Konto nach 24 h gelöscht.
- Plattform-Basis aus dem Design:
  - App-Shell mit Wortmarke SNEAKER**STUDIO** und Startseiten-Hero
  - Dark-Farben gemessen: Hintergrund `#020716`, Karte `#061226`, Primär `#0656c0`, Akzent `#0874e0`, Text `#f7fafc`, gedämpfter Text `#a9aebb`
  - Light-Farben abgeleitet vom hellen Kasten auf Folie 2: `#f1f2f6`, `#ffffff`, Navy-Text `#07122a`, Grau `#545a66`
- Nicht im Umfang, weil es keinen Use Case dafür gibt: Login, Profil ergänzen, Mein Konto, Katalog, Warenkorb.

**Plan** (nach jedem Step bekommst du einen Bericht, dann warte ich auf dein „weiter“)
1. Setup, `CLAUDE.md` per /init (nur Regeln), `docs/progress.md`
2. Feature-Dateien `docs/feature_01…06_*.md`, jeweils mit Bezug zum Use Case
3. Gemeinsame Validierungsregeln für Client und Server, mit Unit-Tests
4. Server: Registrierungs-API (Validierung, Adressprüfung, E-Mail-Einzigartigkeit, Kunde anlegen), mit Tests
5. Server: Bestätigungsmail, Aktivierung, Löschung nach 24 h, mit Tests
6. Client: Dark/Light-Theme, App-Shell, Startseite, mit Tests
7. Client: Registrierungsformular, Bestätigung, Aktivierungsseite, mit Tests
8. Playwright-E2E über den ganzen Ablauf

**Entscheidungen, die ich selbst getroffen habe** (du kannst jederzeit widersprechen)
- **Sprache und Laufzeit:** TypeScript überall. Der Server läuft direkt unter Node 24, ohne Build-Tool.
- **Laufzeit-Pakete:** nur `express`, `react`, `react-dom`, `@tanstack/react-query` und `@tanstack/react-router`. Routing ist im Code definiert. Kein TanStack Form, stattdessen eigene schlanke Formularlogik mit Validatoren, die Client und Server gemeinsam nutzen.
- **Keine Zusatzpakete für Hashing und Server-Tests:** Passwort-Hash über `node:crypto` (scrypt), Server-Tests mit dem eingebauten `fetch`.
- **Schrift:** keine Webfonts vom CDN (wegen DSGVO), stattdessen System-Schrift.
- **Formular:** ein einziges Formular „Konto erstellen“ wie im Design. Der Button „Konto anlegen“ ist der „Speichern-Button“ aus den Use Cases.
- **Hinweise:** erscheinen, sobald man ein Feld verlässt.
- **Telefonnummer:** Leerzeichen, `-`, `/` und Klammern werden entfernt, `0049` wird zu `+49`.
- **Theme:** folgt der Systemeinstellung, zusätzlich gibt es einen Umschalter im Header.
- **Sprache:** Oberfläche auf Deutsch in Du-Form wie in den Use Cases, Code auf Englisch.

Antworten übernommen: Telefon optional, kleine PLZ-Beispielliste, SQLite und Datei-Postfach, Testing Library mit jsdom. Jetzt kommt Step 1 (Setup und `CLAUDE.md` per /init).

Die fünf Setup-Dateien sind angelegt. Jetzt initialisiere ich Git, installiere die Basis-Werkzeuge (TypeScript, Vitest) und prüfe die TS-Konfiguration.

**Step 1 ist fertig:** Git-Repo (Branch `main`) angelegt, `CLAUDE.md` per /init erstellt, Monorepo-Grundgerüst steht. TypeScript 7.0.2 und Vitest 5.0.2 sind installiert, die TS-Konfiguration habe ich mit einer Testdatei geprüft.

| Datei | Inhalt | Warum |
|---|---|---|
| [CLAUDE.md](CLAUDE.md) | Nur Regeln: Arbeitsweise (Steps, Bericht, nachfragen), Feature/Use-Case-Bezug, „kein Code ohne Test“, möglichst wenige Abhängigkeiten, Architektur, Design-Tokens, Sprache | Deine Coding-Regeln gelten damit auch in jeder künftigen Session. Andere Agent-Konfigurationen (README, Cursor, Copilot, Codex, Gemini) gab es nicht. |
| [docs/progress.md](docs/progress.md) | Sechs geplante Features F01–F06, alle noch offen | Fortschritt nur als Häkchen mit Feature-Namen, wie gewünscht. |
| [package.json](package.json) | Monorepo mit npm workspaces `shared`, `server`, `client`, ESM, Node ≥ 24.15, Script `npm test`, Dev-Pakete `typescript`, `vitest`, `@types/node@24` | Gemeinsame Werkzeuge für alle Pakete. Die Ordner entstehen erst in ihren Steps; fehlende Ordner ignoriert npm, das habe ich getestet. Node 24.15 brauchen jsdom und `node:sqlite`. |
| [tsconfig.base.json](tsconfig.base.json) | Strikte TS-Basis mit `erasableSyntaxOnly` und `allowImportingTsExtensions` | Der Server kann so ohne Build-Tool direkt in Node 24 laufen. Getestet: `.ts`-Imports funktionieren, `enum` wird abgelehnt. |
| [.gitignore](.gitignore) | `node_modules/`, `.DS_Store`, Logs | Wird erweitert, sobald Build- oder Testartefakte entstehen. |

`npm test` meldet im Moment „No test files found“. Die ersten Tests kommen in Step 3. Committet habe ich nichts.

**Nächster Step 2:** Die Feature-Dateien `docs/feature_01…06_*.md`, reine Doku ohne Code. Jede enthält den Use-Case-Bezug, die Akzeptanzkriterien mit den genauen Hinweistexten, die Annahmen (z. B. die Normalisierung der Telefonnummer und die PLZ-Beispielliste) und die geplanten Testfälle. F01 enthält außerdem die Farb-Tokens für Dark und Light.

Soll ich mit Step 2 weitermachen?

---

```md
weiter mit Step 2
```

---

**Plan für Step 2:** Sechs Feature-Dateien unter `docs/`, reine Doku ohne Code. Jede enthält Use-Case-Bezug, Regeln mit den genauen Hinweistexten, Verhalten, Annahmen und offene Punkte sowie die geplanten Testfälle. Die Namen passen zu `docs/progress.md`.

Ich habe sechs Feature-Dateien unter `docs/` angelegt, die alle Use Cases abdecken (Plattform-Design, Startseite, Kontaktdaten, Passwort, Kontoanlage, Kontoaktivierung) als Spezifikation für die weiteren Steps. Drei offene Punkte aus den Use Cases beeinflussen die Validierungsregeln für Step 3 – dazu folgen gleich Fragen.

Alle drei Antworten entsprechen der bereits dokumentierten strikten Auslegung. Ich habe sie in [feature_03_kontaktdaten.md](docs/feature_03_kontaktdaten.md) von „Offen“ auf „Entschieden“ umgestellt. **Step 2 ist damit abgeschlossen.**

**Nächster Step 3:** Paket `shared/` mit den Kontaktdaten-Regeln und Unit-Tests. Das sind vier neue Dateien (`shared/package.json`, `shared/tsconfig.json`, `shared/src/contact.ts`, `shared/src/contact.test.ts`). Dazu kommt ein Script `typecheck` in der Root-`package.json`. Das PLZ-Verzeichnis und die Passwortregeln folgen in Step 4, damit jeder Step bei 3–5 Dateien bleibt.

Soll ich mit Step 3 weitermachen?

---

```md
weiter mit Step 3
```

---

**Plan für Step 3:** Neues Paket `shared/` mit den Kontaktdaten-Regeln aus F03, also Formatprüfungen. Ob PLZ und Ort existieren, prüft das Verzeichnis in Step 4. Dazu Unit-Tests für alle Grenzwerte aus der Feature-Datei und ein Script `typecheck` in der Root-`package.json`.

Tests stehen zuerst. Kurzer Lauf, um zu sehen, dass sie ohne Implementierung scheitern:

Die Tests scheitern wie erwartet, weil es `contact.ts` noch nicht gibt. Jetzt die Implementierung:

**Step 3 ist fertig:** 81 Tests grün, Typecheck grün. Die Tests habe ich zuerst geschrieben und scheitern sehen (rot), dann erst implementiert (grün).

| Datei | Neu/geändert | Inhalt und Zweck |
|---|---|---|
| [shared/package.json](shared/package.json) | neu | Paket `@sneakerstudio/shared`. Die Export-Regel `@sneakerstudio/shared/<modul>` → `src/<modul>.ts` sorgt dafür, dass Server und Client den TypeScript-Quelltext direkt importieren, ohne Build-Schritt. |
| [shared/tsconfig.json](shared/tsconfig.json) | neu | Erbt die Basis-Konfiguration, ohne Browser- oder Node-Typen. So läuft der Code garantiert in beiden Umgebungen. |
| [shared/src/contact.ts](shared/src/contact.ts) | neu | Anrede-Optionen, eine Prüffunktion je Feld (liefert den Hinweistext aus dem Use Case oder `null`), Telefon-Normalisierung und `validateContact` fürs ganze Formular. Das ist die einzige Quelle der Regeln: Der Client steuert damit Hinweise und Button, der Server seine 422-Antworten. |
| [shared/src/contact.test.ts](shared/src/contact.test.ts) | neu | Alle Grenzwerte aus F03: E-Mail mit 320/321 Zeichen, Telefon mit 2/3/15/16 Ziffern, PLZ mit 4/5/6 Stellen, Umlaute und ß, die entschiedene strikte Auslegung für Straße und Hausnummer, Normalisierung. Die Test-Namen beginnen mit der Feature-ID (z. B. „F03 Straße (UC 1.1.2.2)“), damit sie sich zurückverfolgen lassen. |
| [package.json](package.json) | geändert | Neues Script `npm run typecheck`, es prüft alle Workspaces. |

**Details:**
- Eingaben werden vor der Prüfung auf Unicode-NFC normalisiert. So werden auch Umlaute akzeptiert, die beim Kopieren als zerlegte Zeichen ankommen („u“ plus Trema).
- Bei jedem `npm install` warnt npm, dass das Paket `fsevents` ein Installationsskript hat (eine indirekte Abhängigkeit von Vitest). Ich habe das Skript bewusst nicht freigegeben, weil Installationsskripte ein Lieferketten-Risiko sind. `fsevents` bringt fertige Binärdateien mit, die Warnung ist also harmlos.

**Nächster Step 4:** PLZ-Verzeichnis mit etwa 30 realen PLZ/Ort-Paaren und der Prüfung PLZ ↔ Ort. Das sind zwei neue Dateien (`postal-directory.ts` mit Test). Die Prüfung wird außerdem in `validateContact` eingebunden, dafür werden `contact.ts` und `contact.test.ts` angepasst. Die Passwortregeln (F04) folgen in Step 5.

Soll ich mit Step 4 weitermachen?

---

```md
weiter mit Step 4
```

---

**Plan für Step 4:** Neues Modul `shared/src/postal-directory.ts` mit 30 realen PLZ/Ort-Paaren und drei Prüfungen: PLZ bekannt, Ort bekannt, PLZ passt zum Ort. Dazu ein eigener Test und die Einbindung in `validateContact` nach der Logik aus F03. Wie in Step 3 kommen die Tests zuerst.

Wie erwartet rot: 4 neue Fälle scheitern, und das Verzeichnis-Modul fehlt noch. Jetzt die Implementierung:

**Step 4 ist fertig:** 106 Tests grün (25 neu), Typecheck grün. Auch hier waren die neuen Tests vorher rot.

| Datei | Neu/geändert | Inhalt und Zweck |
|---|---|---|
| [shared/src/postal-directory.ts](shared/src/postal-directory.ts) | neu | 30 reale PLZ/Ort-Paare, darunter gezielt Orte mit Umlauten, ß, Leerzeichen und Bindestrich sowie Coburg mit zwei PLZ. Dazu `isKnownPostalCode`, `isKnownCity` und `postalCodeMatchesCity`, die Groß-/Kleinschreibung und doppelte Leerzeichen ignorieren. Setzt „PLZ muss existieren und zum Ort passen“ (UC 1.1.2.3) und „Adresse muss existieren“ (UC 1.1.2.4) um, wie mit der Beispiel-Liste entschieden. |
| [shared/src/postal-directory.test.ts](shared/src/postal-directory.test.ts) | neu | Bekannte und unbekannte PLZ und Orte, passende und unpassende Paare. Ein Konsistenztest stellt sicher, dass jeder Eintrag die Eingaberegeln erfüllt, sonst ließe er sich im Formular gar nicht eingeben. |
| [shared/src/contact.ts](shared/src/contact.ts) | geändert | `validateContact` prüft PLZ und Ort jetzt zusätzlich gegen das Verzeichnis, und zwar nur, wenn das Format stimmt. Unbekannte PLZ gibt einen Hinweis an der PLZ, unbekannter Ort am Ort, ein unpassendes Paar an der PLZ. Die Hinweistexte stehen jetzt als Konstanten in der Datei. |
| [shared/src/contact.test.ts](shared/src/contact.test.ts) | geändert | Sechs Fälle für das Zusammenspiel von Format- und Verzeichnisprüfung. |

**Nächster Step 5:** Passwortregeln aus F04 in `shared/src/password.ts` mit Test. Geprüft werden mindestens 8 Zeichen, Sonderzeichen, Großbuchstabe (inklusive Ä/Ö/Ü) und Ziffer sowie die Übereinstimmung der Wiederholung. Es sind nur zwei Dateien, damit ist das Paket `shared` fertig. Danach beginnt der Server.

Soll ich mit Step 5 weitermachen?

---

```md
weiter mit Step 5

Frage: Wo werden die Steps abgearbeitet? 
Ich sehe keinen Tick in progress.md und auch sonst nirgends. 
War aus der Basisanforderung nicht klar das ich die Abarbeitung sehen möchte?
Wie muss ich das beim nächsten mal formulieren?
```

---

Du hast recht, die Vorgabe war klar („Fortschritt Step by Step in docs/progress.md“). Ich habe „nur Ticks mit Feature-Namen“ so gelesen, dass nur **fertige Features** abgehakt werden. Ein Feature zieht sich aber über mehrere Steps (shared, Server, Client, E2E), deshalb blieb die Datei leer. Das korrigiere ich jetzt:

- `docs/progress.md` bekommt eine Zeile pro Step. Erledigte Steps sind abgehakt, geplante offen. Darüber steht die Feature-Liste.
- Die Regel in `CLAUDE.md` formuliere ich genauer, damit das künftig von selbst passiert.
- Außerdem setze ich ab jetzt pro Step ein Kapitel im Chatverlauf. Das erscheint im Inhaltsverzeichnis der App.

**Für nächstes Mal** ist eine Formulierung eindeutig, die sagt, wann (nach jedem Step), wie fein (eine Zeile pro Step) und in welchem Format:
> „Hake nach **jedem** Step in docs/progress.md eine Zeile ab: `- [x] Step N · Feature-Name – Teilschritt`.“

**Plan für Step 5:** Passwortregeln aus F04 in `shared/src/password.ts`, zuerst die Tests. Dazu die Korrektur von `progress.md` und `CLAUDE.md`.

Grün. Jetzt `progress.md` auf Step-Ticks umstellen und die Regel in `CLAUDE.md` präzisieren:

**Step 5 ist fertig:** 121 Tests grün (15 neu), Typecheck grün. `docs/progress.md` zeigt jetzt jeden Step, Steps 1–5 sind abgehakt.

| Datei | Neu/geändert | Inhalt und Zweck |
|---|---|---|
| [shared/src/password.ts](shared/src/password.ts) | neu | `validatePassword` prüft mindestens 8 Zeichen, ein Sonderzeichen (weder Buchstabe noch Ziffer noch Leerzeichen), einen Großbuchstaben (auch Ä/Ö/Ü) und eine Ziffer. `validatePasswordConfirmation` prüft die Wiederholung. Passwörter werden bewusst nicht getrimmt, jedes Zeichen zählt. Client (Hinweise, Button) und Server (Prüfung vor dem Hash) nutzen dieselbe Regel. |
| [shared/src/password.test.ts](shared/src/password.test.ts) | neu | Grenzfälle aus F04: 7 und 8 Zeichen, jeweils eine fehlende Zeichenart, Ä als einziger Großbuchstabe, Leerzeichen zählt nicht als Sonderzeichen, abweichende Wiederholung (auch nur durch ein Leerzeichen am Ende). |
| [docs/progress.md](docs/progress.md) | geändert | Feature-Liste oben, darunter eine Zeile pro Step. Steps 1–5 sind abgehakt, 6–19 geplant. |
| [CLAUDE.md](CLAUDE.md) | geändert | Genauere Fortschrittsregel mit Zeilenformat und dem Zeitpunkt, wann ein Feature abgehakt wird. Neu: zu Beginn jedes Steps ein Kapitel im Chatverlauf. |

**Änderung am Plan:** Statt eines einzigen E2E-Steps am Ende bekommt jetzt jedes Client-Feature seinen Playwright-Test im eigenen Step (Steps 14–19). So kann jedes Feature abgehakt werden, sobald es fertig ist, statt dass alle erst am Schluss fertig werden. Das Paket `shared` ist damit komplett.

**Nächster Step 6:** Der Kundenstamm (F05) als erster Server-Baustein. Das sind `server/package.json`, `server/tsconfig.json`, ein Adapter-Interface mit SQLite-Implementierung über `node:sqlite` und die Tests. Vorerst gibt es nur, was F05 braucht: Kunde anlegen, E-Mail-Einzigartigkeit prüfen ohne Beachtung der Groß-/Kleinschreibung, Kunde löschen (wird zurückgenommen, wenn der Mailversand scheitert). Express kommt erst mit der API in Step 9.

Soll ich mit Step 6 weitermachen?

---

```md
weiter mit Step 6
```

---

**Plan für Step 6:** Paket `server/` anlegen, ohne Express, das kommt erst mit der API in Step 9. Dazu der Kundenstamm als austauschbarer ERP-Adapter mit SQLite-Implementierung über `node:sqlite`. Er kann Kunden anlegen (Status „nicht aktiviert“), die E-Mail-Einzigartigkeit ohne Beachtung der Groß-/Kleinschreibung prüfen und Kunden löschen. Tests zuerst.

Rot wie erwartet. Jetzt die Implementierung:

Typecheck läuft in beiden Paketen. Fortschritt abhaken:

**Step 6 ist fertig:** 127 Tests grün (6 neu), Typecheck grün in `shared` und `server`, Step 6 in [progress.md](docs/progress.md) abgehakt.

| Datei | Neu/geändert | Inhalt und Zweck |
|---|---|---|
| [server/package.json](server/package.json) | neu | Paket `@sneakerstudio/server`. Einzige Abhängigkeit ist das eigene Paket `shared`, externe Pakete gibt es noch keine. |
| [server/tsconfig.json](server/tsconfig.json) | neu | Erbt die Basis-Konfiguration und fügt die Node-Typen hinzu (`node:sqlite`, `node:crypto`). |
| [server/src/customer-store.ts](server/src/customer-store.ts) | neu | Interface `CustomerStore` (`emailExists`, `create`, `delete`) mit SQLite-Implementierung. Die Tabelle `customers` enthält die Felder aus F05. Neue Kunden bekommen den Status `pending`. Die E-Mail wird klein geschrieben gespeichert und ist per Datenbank-Constraint eindeutig. |
| [server/src/customer-store.test.ts](server/src/customer-store.test.ts) | neu | Anlage mit allen Feldern, E-Mail klein geschrieben, Einzigartigkeit unabhängig von Groß-/Kleinschreibung, zweite Anlage mit gleicher E-Mail wird abgelehnt, Löschen, Daten bleiben nach erneutem Öffnen erhalten. |
| [docs/progress.md](docs/progress.md) | geändert | Step 6 abgehakt. |

**Warum so:**
- **Asynchrones Interface**, obwohl SQLite synchron arbeitet: Ein echtes ERP wird über das Netzwerk angesprochen. Nur mit einem asynchronen Vertrag lässt sich der Adapter später wirklich austauschen, ohne alle Aufrufer umzubauen.
- **Datenbank wird übergeben**, statt im Store geöffnet zu werden: Die Tests laufen mit einer In-Memory-Datenbank und prüfen die gespeicherten Spalten direkt. Der Server-Start in Step 11 übergibt dann die Datei unter `server/data/`.
- `delete` gibt es jetzt schon, weil F05 es braucht: Scheitert der Mailversand, wird die Anlage zurückgenommen.

**Nächster Step 7:** Sichere Passwortspeicherung (F04) in `server/src/password-hash.ts` mit Test. Hash per scrypt aus `node:crypto`, zufälliges Salt pro Konto, Klartext wird nie gespeichert. Das sind zwei Dateien.

Soll ich mit Step 7 weitermachen?

---

```md
weiter mit Step 7
```

---

**Plan für Step 7:** `server/src/password-hash.ts` hasht das Passwort mit scrypt aus `node:crypto`. Dabei gelten die OWASP-Mindestparameter N=16384, r=8, p=5, ein zufälliges 16-Byte-Salt pro Konto, und die Parameter werden im Hash mitgespeichert. Der Test prüft außerdem durch Nachrechnen, dass sich der Hash später beim Login verifizieren lässt. Tests zuerst.

**Step 7 ist fertig:** 130 Tests grün (3 neu), Typecheck grün, Step 7 in [progress.md](docs/progress.md) abgehakt.

| Datei | Neu/geändert | Inhalt und Zweck |
|---|---|---|
| [server/src/password-hash.ts](server/src/password-hash.ts) | neu | `hashPassword` rechnet scrypt aus `node:crypto` mit den OWASP-Mindestparametern (N=16384, r=8, p=5, etwa 16 MB Speicher pro Hash) und einem zufälligen 16-Byte-Salt pro Konto. Gespeichert wird `scrypt$N$r$p$<salt>$<hash>`. |
| [server/src/password-hash.test.ts](server/src/password-hash.test.ts) | neu | Prüft drei Dinge: Der Klartext steckt nicht im Hash und das Format stimmt. Gleiche Passwörter ergeben verschiedene Hashes (Salt). Der Hash lässt sich mit den gespeicherten Parametern exakt nachrechnen. |
| [docs/progress.md](docs/progress.md) | geändert | Step 7 abgehakt. |

**Warum so:**
- **Parameter im Hash:** Es gibt noch keinen Login-Use-Case, daher auch keine Funktion `verifyPassword` im Code. Damit ein späterer Login aber jedes gespeicherte Passwort prüfen kann, stehen die Parameter im Hash. Der Nachrechnen-Test stellt das sicher, ohne Code auf Vorrat zu bauen.
- **Keine Zusatzbibliothek:** kein bcrypt/argon2, scrypt ist in Node eingebaut.

**Nächster Step 8:** Bestätigungsmail und Datei-Postfach (F06), vier Dateien:
- Mail-Aufbau mit Test: persönliche Anrede („Hallo Herr/Frau Mustermann“ bzw. „Hallo Max Mustermann“), Aktivierungslink, Hinweis, dass der Link 24 h gilt und das Konto sonst gelöscht wird.
- Mail-Adapter mit Test: Interface plus Implementierung, die jede Mail als JSON-Datei ins Postfach-Verzeichnis schreibt und in der Konsole ausgibt.

Soll ich mit Step 8 weitermachen?

---

```md
weiter mit Step 8
```

---

**Plan für Step 8:** Zwei Module im Server. `confirmation-mail.ts` baut die Bestätigungsmail: Anrede, Link auf `/aktivieren?token=…`, Hinweis auf 24 h und Löschung. `mailer.ts` enthält das Mail-Adapter-Interface und das Datei-Postfach, das jede Mail als JSON ablegt und in der Konsole ausgibt. Tests zuerst.

Rot wie erwartet. Jetzt die beiden Module:

**Step 8 ist fertig:** 139 Tests grün (9 neu), Typecheck grün, Step 8 in [progress.md](docs/progress.md) abgehakt.

| Datei | Neu/geändert | Inhalt und Zweck |
|---|---|---|
| [server/src/confirmation-mail.ts](server/src/confirmation-mail.ts) | neu | `buildConfirmationMail` baut die Mail aus F06: Empfänger und Betreff, persönliche Anrede (Herr/Frau + Nachname, bei „Keine Angabe“ Vor- und Nachname), der Link `<APP_BASE_URL>/aktivieren?token=…` und der Hinweis „24 Stunden gültig“ bzw. dass das Konto sonst gelöscht wird. |
| [server/src/confirmation-mail.test.ts](server/src/confirmation-mail.test.ts) | neu | Empfänger und Betreff, alle drei Anreden, Link, Gültigkeitshinweis, Löschhinweis (UC 1.3.4, UC 1.1.2.1). |
| [server/src/mailer.ts](server/src/mailer.ts) | neu | Mail-Adapter: Interface `Mailer` und das Datei-Postfach `createFileMailer`. Jede Mail wird als eigene JSON-Datei abgelegt (Dateiname aus Zeitstempel und UUID, sortiert also chronologisch) und in der Konsole ausgegeben. |
| [server/src/mailer.test.ts](server/src/mailer.test.ts) | neu | Die Datei wird angelegt und hat den richtigen Inhalt, das Verzeichnis entsteht bei Bedarf, jede Mail bekommt eine eigene Datei, die Konsolenausgabe stimmt. Die Tests nutzen ein temporäres Verzeichnis und räumen es wieder auf. |
| [docs/progress.md](docs/progress.md) | geändert | Step 8 abgehakt. |

**Warum so:** Mail-Inhalt und Versand sind getrennt. Ein echter Versand (z. B. SMTP) ersetzt später nur `createFileMailer`, der Mailtext bleibt gleich. Über das Postfach findet außerdem der E2E-Test den Aktivierungslink, ohne dass der Server dafür einen Test-Endpunkt braucht.

**Nächster Step 9:** API `POST /api/registrations` (F05). Die Kontoanlage läuft so ab:
1. Alle Felder mit den gemeinsamen Regeln prüfen, bei Fehlern 422 mit Hinweistexten.
2. E-Mail-Einzigartigkeit prüfen, bei Konflikt 409.
3. Passwort hashen, Token erzeugen (in der Datenbank nur als SHA-256-Hash), Kunden anlegen, Mail senden, Antwort 201.
4. Scheitert der Mailversand, wird die Anlage zurückgenommen, Antwort 500.

Dafür installiere ich **`express` und `@types/express`**. Beide gehören zu deinem Tech-Stack, sind also keine neuen, unabgestimmten Abhängigkeiten. Die API-Tests laufen mit dem eingebauten `fetch` gegen einen echten Server auf einem zufälligen Port, ohne `supertest`. Geplant sind drei neue Dateien plus `server/package.json`.

Soll ich mit Step 9 weitermachen?

---

```md
weiter mit Step 9
```

---

**Plan für Step 9:** Express und `@types/express` installieren, dann den Router für `POST /api/registrations` bauen (Prüfen → Einzigartigkeit → Hash → Anlegen → Mail → Rücknahme bei Mailfehler). Dazu kommt `normalizeContact` in `shared`: F03 legt die Speicherform fest (getrimmt, Telefon im Standardformat, E-Mail klein geschrieben), und die gehört zu den gemeinsamen Regeln. Tests zuerst.

Jetzt die Tests: Speicherform in `shared` und API-Tests im Server.

Rot wie erwartet. Jetzt die Implementierung: `normalizeContact` in `shared`, danach der Router.

Alles grün. Zur Absicherung für Step 11 prüfe ich schon jetzt, ob Node selbst (ohne Vitest) den TypeScript-Quelltext inklusive `@sneakerstudio/shared` direkt laden kann:

**Step 9 ist fertig:** 149 Tests grün (10 neu), Typecheck grün, Step 9 in [progress.md](docs/progress.md) abgehakt. Außerdem geprüft: Node lädt den Server-Quelltext inklusive `@sneakerstudio/shared` direkt ohne Build. Das ist die Voraussetzung für den Server-Start in Step 11.

| Datei | Neu/geändert | Inhalt und Zweck |
|---|---|---|
| [server/package.json](server/package.json) | geändert | `express@^5.2.1` (Laufzeit) und `@types/express@^5.0.6` (Dev) aus deinem Tech-Stack. Mit den indirekten Abhängigkeiten sind das 77 Pakete. |
| [shared/src/contact.ts](shared/src/contact.ts) | geändert | `normalizeContact` liefert die Speicherform aus F03: getrimmt, NFC, Telefon im Standardformat oder `null`, E-Mail klein geschrieben. |
| [shared/src/contact.test.ts](shared/src/contact.test.ts) | geändert | Zwei Tests für die Speicherform, darunter ein zerlegter Umlaut und ein leeres Telefonfeld. |
| [server/src/registration.ts](server/src/registration.ts) | neu | Router für `POST /api/registrations`: Felder prüfen (422 mit allen Hinweisen) → E-Mail-Einzigartigkeit (409 „Diese E-Mail-Adresse ist bereits registriert“) → Passwort-Hash → Token → Kunde anlegen → Bestätigungsmail → 201. Scheitert die Mail, wird der Kunde wieder gelöscht und es gibt 500. |
| [server/src/registration.test.ts](server/src/registration.test.ts) | neu | 8 API-Tests per `fetch` gegen einen echten Server auf zufälligem Port: Anlage in Speicherform, Passwort nur als Hash, Mail mit Link (Token nur als Hash gespeichert), 409 auch bei anderer Groß-/Kleinschreibung, 422 für leere Daten, 422 bei unpassender PLZ, 422 bei schwachem Passwort, Rücknahme bei Mailfehler. |
| [docs/progress.md](docs/progress.md) | geändert | Step 9 abgehakt. |

**Warum so:**
- **Abhängigkeiten werden übergeben** (Kundenstamm, Mailer, Basis-URL, Uhr): Die Tests laufen mit In-Memory-Datenbank, Fake-Mailer und fester Uhrzeit. Der Server-Start (Step 11) verdrahtet dann die echten Bausteine.
- **Reihenfolge:** Erst die günstigen Prüfungen, dann der teure Hash (etwa 0,1 s). So kosten ungültige und doppelte Anfragen kaum Rechenzeit.
- **Aktivierungs-Token:** 32 zufällige Bytes. In der Datenbank steht nur der SHA-256-Hash, ein Datenbank-Leck macht die Links also nicht nutzbar.
- **Fehlerfall:** Kein eigener Fehler-Handler nötig. Express 5 fängt Fehler in asynchronen Handlern selbst ab und antwortet mit 500.

**Nächster Step 10:** Aktivierung und automatische Löschung (F06):
- Kundenstamm erweitern: Kunden über den Token-Hash finden, aktivieren, abgelaufene nicht aktivierte Konten löschen.
- Router `POST /api/activations`: 200 bei Aktivierung (auch beim zweiten Klick), 410 bei abgelaufenem Link mit sofortiger Löschung, 404 bei unbekanntem Link.
- Aufräumfunktion für den 15-Minuten-Job, getestet mit steuerbarer Uhr.
- Das Token-Hashing wird in eine kleine gemeinsame Hilfsfunktion verschoben, weil Registrierung und Aktivierung es beide brauchen.

Das sind etwa fünf Dateien.

Soll ich mit Step 10 weitermachen?

---

```md
weiter mit Step 10
```

---

**Plan für Step 10:**
- Kundenstamm erweitern: Kunde über den Token-Hash finden, aktivieren, abgelaufene nicht aktivierte Konten löschen, dazu ein eindeutiger Index auf den Token-Hash.
- Neues Modul `activation.ts`: 24-Stunden-Regel, Token-Erzeugung, Router `POST /api/activations` und der 15-Minuten-Aufräum-Job.
- `registration.ts` nutzt künftig die Token-Erzeugung aus `activation.ts`, damit die 24-h-Regel nur an einer Stelle steht.

Tests zuerst.

Rot wie erwartet. Jetzt die Implementierung: Kundenstamm erweitern, `activation.ts` anlegen, `registration.ts` umstellen.

Jetzt `registration.ts` auf die gemeinsame Token-Erzeugung umstellen:

**Step 10 ist fertig:** 160 Tests grün (11 neu), Typecheck grün, Step 10 in [progress.md](docs/progress.md) abgehakt. Das Server-Backend für alle Use Cases ist damit fachlich komplett.

| Datei | Neu/geändert | Inhalt und Zweck |
|---|---|---|
| [server/src/activation.ts](server/src/activation.ts) | neu | 24-Stunden-Regel an einer Stelle, Token-Erzeugung (32 zufällige Bytes, gespeichert wird nur der SHA-256-Hash), Router `POST /api/activations` (200 / 410 mit Löschung / 404), Aufräum-Job alle 15 Minuten. |
| [server/src/activation.test.ts](server/src/activation.test.ts) | neu | Mit steuerbarer Uhr: Aktivierung kurz vor Ablauf, zweiter Klick auch nach 24 h, genau 24 h ergibt 410 und das Konto ist weg, unbekannter, leerer oder fehlender Token ergibt 404. Mit Fake-Timern: Der Job läuft alle 15 Minuten, lässt sich stoppen und protokolliert Fehler. |
| [server/src/customer-store.ts](server/src/customer-store.ts) | geändert | Neu sind `findByActivationTokenHash`, `activate` und `deleteExpiredPending` sowie ein eindeutiger Index auf den Token-Hash (schnelle Suche, keine Dubletten). |
| [server/src/customer-store.test.ts](server/src/customer-store.test.ts) | geändert | Drei neue Tests. Der Löschtest deckt die Grenze „genau abgelaufen“ ab und prüft, dass aktive Konten unberührt bleiben. Der Test zu doppelten E-Mails prüft jetzt gezielt die E-Mail-Constraint. |
| [server/src/registration.ts](server/src/registration.ts) | geändert | Nutzt Token-Erzeugung und 24-h-Regel aus `activation.ts`, keine doppelte Logik mehr. |
| [docs/progress.md](docs/progress.md) | geändert | Step 10 abgehakt. |

**Entscheidungen, die du kennen solltest:**
- **Grenze:** „Innerhalb von 24 Stunden“ heißt bei mir weniger als 24 h. Ein Klick nach genau 24:00:00 gilt als abgelaufen und das Konto wird gelöscht.
- **Bereits aktivierte Konten:** Ein erneuter Klick auf den Link ergibt immer „aktiviert“, auch nach 24 h. Aktive Konten werden nie gelöscht.
- **Aufräum-Job:** Fehler werden protokolliert, statt den Server zu beenden. Der Timer hält den Prozess nicht künstlich am Leben.

**Nächster Step 11:** Server-Start. Dazu gehören:
- `app.ts`, das beide Router zusammensetzt, mit einem Test über den ganzen Server-Ablauf: registrieren → Link aus der Mail → aktivieren.
- `main.ts`, das die Konfiguration aus Umgebungsvariablen liest (Port, Datenbankpfad, Postfach-Ordner, App-URL), die SQLite-Datei öffnet, den Aufräum-Job startet und den Server hochfährt.
- Ein Start-Script und ein `.gitignore`-Eintrag für `server/data/`.

Danach prüfe ich den echten Start einmal von Hand.

Soll ich mit Step 11 weitermachen?

---

```md
weiter mit Step 11
```

---

**Plan für Step 11:**
- `app.ts` bekommt zwei Funktionen:
  - `createApp` setzt beide Router zusammen.
  - `startServer` öffnet die SQLite-Datei, erzeugt das Datei-Postfach, startet den Aufräum-Job und den HTTP-Server.
- `main.ts` liest nur noch die Umgebungsvariablen und ruft `startServer` auf.
- Der Test fährt `startServer` mit echter Datenbankdatei und echtem Postfach in einem Temp-Ordner hoch und spielt den kompletten Ablauf durch, inklusive Neustart.

Tests zuerst.

Rot wie erwartet. Jetzt die Implementierung:

Grün. Jetzt der manuelle Start des echten Servers per `npm start`, mit Temp-Datenbank und Temp-Postfach, damit im Projekt nichts liegen bleibt:

Der echte Server läuft: 201 → 409 → 200 → 404, Mail in der Konsole und im Postfach. Server ist wieder gestoppt. Fortschritt abhaken:

**Step 11 ist fertig:** 162 Tests grün (2 neu), Typecheck grün, Step 11 in [progress.md](docs/progress.md) abgehakt. Der echte Server lief per `npm start` einmal durch: Registrierung 201, gleiche E-Mail nochmal 409, Aktivierung mit dem Link aus dem Postfach 200, falscher Link 404. Danach habe ich ihn wieder gestoppt.

| Datei | Neu/geändert | Inhalt und Zweck |
|---|---|---|
| [server/src/app.ts](server/src/app.ts) | neu | `createApp` setzt Registrierungs- und Aktivierungs-Router zusammen. `startServer` legt den Datenordner an, öffnet die SQLite-Datei, verbindet Datei-Postfach und Aufräum-Job, startet den Server und liefert `url` und `close` zurück. |
| [server/src/app.test.ts](server/src/app.test.ts) | neu | Echter Server mit echter Datenbankdatei und echtem Postfach im Temp-Ordner. Test 1: registrieren → Link aus der JSON-Mail lesen → aktivieren. Test 2: Kunden bleiben über einen Neustart erhalten, danach kommt 409. |
| [server/src/main.ts](server/src/main.ts) | neu | Einstiegspunkt, liest nur die Konfiguration: `PORT` (3000), `DB_PATH` und `OUTBOX_DIR` (Standard jeweils unter `server/data/`), `APP_BASE_URL` (`http://localhost:5173`, die Client-Adresse für den Link). Der Rest steckt getestet in `startServer`. |
| [server/package.json](server/package.json) | geändert | Scripts `start` (`node src/main.ts`) und `dev` (dasselbe mit `--watch`, startet bei Änderungen neu). |
| [.gitignore](.gitignore) | geändert | `server/data/` (Datenbank und Postfach) wird nicht eingecheckt. |
| [docs/progress.md](docs/progress.md) | geändert | Step 11 abgehakt. |

**Selbst ausprobieren:**
```bash
npm run dev -w server
```
Die Bestätigungsmails erscheinen dann in der Konsole und als JSON unter `server/data/outbox/`.

**Nächster Step 12:** Beginn des Clients (F01).
- `client/package.json` und `client/tsconfig.json`.
- Eine Root-`vitest.config.ts`, die `shared` und `server` weiter in Node testet und `client` in jsdom.
- Die Theme-Logik mit Test: Beim Start wird die gespeicherte Wahl übernommen, sonst gilt die Systemeinstellung. Umschalten speichert die Wahl, und blockierter Browser-Speicher führt nicht zum Absturz.

Installiert wird in diesem Step nur **`jsdom`**, abgestimmt mit „Testing Library + jsdom“. React, TanStack, Tailwind und Testing Library folgen in Step 13, wenn sie tatsächlich gebraucht werden.

Soll ich mit Step 12 weitermachen?

---

```md
weiter mit Step 12
```

---

**Plan für Step 12:**
- Client-Paket anlegen: `client/package.json`, `client/tsconfig.json` mit DOM-Typen und Bundler-Auflösung.
- Root-`vitest.config.ts` mit drei Test-Projekten: `shared` und `server` in Node, `client` in jsdom.
- Theme-Logik mit Test.
- Nur `jsdom` installieren.

Tests zuerst.

`client/package.json` enthält jsdom nicht, obwohl npm etwas installiert hat. Ich prüfe das:

Beim ersten Aufruf hat npm nur den neuen Workspace verlinkt. Zweiter Versuch:

jsdom ist installiert, die bestehenden 162 Tests laufen mit der neuen Projekt-Konfiguration. Jetzt der Theme-Test:

**Step 12 ist fertig:** 167 Tests grün (5 neu), Typecheck grün in allen drei Paketen, Step 12 in [progress.md](docs/progress.md) abgehakt.

| Datei | Neu/geändert | Inhalt und Zweck |
|---|---|---|
| [client/package.json](client/package.json) | neu | Paket `@sneakerstudio/client`, bisher nur `jsdom` als Dev-Abhängigkeit. |
| [client/tsconfig.json](client/tsconfig.json) | neu | Browser-Typen (DOM) und Modulauflösung wie bei Vite. |
| [vitest.config.ts](vitest.config.ts) | neu | Drei Test-Projekte: `shared` und `server` in Node, `client` in jsdom. `npm test` startet weiterhin alles, ein einzelnes Projekt geht mit `--project client`. |
| [client/src/theme.ts](client/src/theme.ts) | neu | `restoreTheme` übernimmt beim Start die gespeicherte Wahl. `currentTheme` liefert die gesetzte Wahl oder die Systemeinstellung. `toggleTheme` wechselt und speichert. Ohne gespeicherte Wahl setzt der Code nichts, dann folgt das CSS direkt dem System. |
| [client/src/theme.test.ts](client/src/theme.test.ts) | neu | Systemeinstellung ohne Wahl, gespeicherte Wahl gewinnt, ungültige Werte werden ignoriert, Umschalten speichert, blockierter Speicher führt nicht zum Absturz. |
| [docs/progress.md](docs/progress.md) | geändert | Step 12 abgehakt. |

**Änderung am Plan:** Der bisherige Step 13 „Design-Tokens & App-Shell“ bräuchte etwa zehn Dateien. Ich teile ihn deshalb auf, dadurch gibt es insgesamt 20 Steps. Ich nummeriere `progress.md` im nächsten Step entsprechend um.
- **Step 13 · Design-Tokens:** `client/src/styles.css` mit allen Farben aus F01, jeweils mit Hell- und Dunkel-Wert (CSS `light-dark()`). Die Tailwind-Standardfarben sind abgeschaltet, sodass nur unsere Tokens nutzbar sind. Dazu ein Test, der die WCAG-Kontraste aus F01 für beide Modi nachrechnet: Text mindestens 4,5 : 1, Wortmarke mindestens 3 : 1. Keine neuen Pakete.
- **Step 14 · App-Shell:** Installation von React, TanStack Router/Query, Vite, Tailwind und Testing Library, dazu Header mit Wortmarke und Theme-Umschalter plus Komponententest.

Soll ich mit Step 13 weitermachen?

---

```md
weiter mit Step 13
```

---

**Plan für Step 13:** `client/src/styles.css` bekommt alle Tokens aus F01, jeweils mit Hell- und Dunkel-Wert per `light-dark()`. Das Theme steuert `color-scheme`, entweder über die Systemeinstellung oder über `data-theme`. Ein Test liest die Tokens aus der CSS-Datei und rechnet die WCAG-Kontraste aus F01 nach. Dazu die Umnummerierung in `progress.md`.

Vorab eine technische Kurzprüfung: Kann Vitest die CSS-Datei als Text laden (`?raw`), ohne dass der Client Node-Typen braucht?

Vitest ersetzt CSS in Tests standardmäßig durch einen leeren String, auch mit `?raw`. Ich prüfe, ob die gezielte Freigabe der Datei über `css.include` hilft:

Die Ausgabe war leer. Ich wiederhole die Probe und schaue mir die vollständige Ausgabe an:

Das funktioniert wie erwartet: `css.include` liefert den Dateiinhalt via `?raw`. Testdateien sind entfernt und die Konfiguration zurückgesetzt – jetzt teste ich Tokens und Kontraste gegen F01.

Grün: 192 Tests, darunter 25 neue (Token-Tabelle plus je 12 Kontrastprüfungen für Hell und Dunkel). Jetzt `progress.md` umnummerieren und abhaken:

Step 13 ist abgeschlossen: 192 Tests grün, Typecheck ohne Fehler, styles.css mit den F01-Tokens und Kontrastprüfungen angelegt, Config-Dateien angepasst, progress.md aktualisiert. Beim Nachrechnen der Kontraste ist mir ein Punkt aufgefallen, den ich dir zur Entscheidung vorlege.

```
Frage in 13:
Eingabefelder: Im Design sind die Rahmen sehr dezent (Kontrast etwa 1,3 : 1 zur Karte). WCAG 2.1 (Kriterium 1.4.11) verlangt für Bedienelemente 3 : 1. Seit Juni 2025 gilt für Online-Shops in Deutschland außerdem das Barrierefreiheitsstärkungsgesetz (BFSG), das auf WCAG 2.1 AA verweist. Wie sollen die Rahmen der Eingabefelder aussehen?
--> Entscheidung nach Empfehlung: kräftigerer Rahmen für Eingabefelder.
```

Entschieden: kräftigerer Rahmen für Eingabefelder. Ich ergänze das noch in Step 13 (Test, Token, F01-Doku), Test zuerst:

Der Feldrahmen ist umgesetzt: 196 Tests grün (4 neue Rahmen-Kontraste), Typecheck grün. **Step 13 ist komplett.**

| Datei | Änderung |
|---|---|
| [client/src/styles.css](client/src/styles.css) | Neuer Token `field-line` (hell `#7c8595`, dunkel `#5b6b82`). |
| [client/src/styles.test.ts](client/src/styles.test.ts) | `field-line` steht in der Token-Tabelle, dazu die Prüfung mindestens 3 : 1 zu Karte und Feld in beiden Modi. |
| [docs/feature_01_plattform_design.md](docs/feature_01_plattform_design.md) | Token-Tabelle ergänzt. Die Entscheidung ist mit Begründung dokumentiert (WCAG 1.4.11, BFSG), die Gestaltungsregel für Eingabefelder ist angepasst. |

**Nächster Step 14:** Die App-Shell (F01). Der Header zeigt die Wortmarke SNEAKER**STUDIO** als Link zur Startseite und den Theme-Umschalter, dessen Beschriftung wechselt („Zum hellen/dunklen Design wechseln“). Darunter liegt der Platz für die Seiten (Router). Dazu ein Komponententest mit Testing Library.
- **Installiert werden** (alles wie abgestimmt): `react`, `react-dom`, `@tanstack/react-router` für die Laufzeit, sowie `vite`, `@vitejs/plugin-react`, `@types/react`, `@types/react-dom`, `@testing-library/react`, `@testing-library/dom` für die Entwicklung.
- **Dateien:** neu sind `client/vite.config.ts`, `AppShell.tsx` und `AppShell.test.tsx`. Angepasst werden `client/package.json`, `client/tsconfig.json` (JSX) und `vitest.config.ts`.
- **Später:** Tailwind und `index.html`/`main.tsx` kommen in Step 15, zusammen mit Playwright, das dann die laufende App prüft. TanStack Query folgt in Step 19, wenn der erste Server-Aufruf gebraucht wird.

Soll ich mit Step 14 weitermachen?

---

```md
weiter mit Step 14
```

---

**Plan für Step 14:**
- React, React DOM, TanStack Router, Vite und das React-Plugin sowie die Testing Library installieren.
- `client/vite.config.ts` mit React-Plugin und Test-Einstellungen anlegen. Die Test-Einstellungen wandern aus der Root-Konfiguration in die Client-Konfiguration.
- `AppShell.tsx` mit Wortmarke, Theme-Umschalter und Seitenbereich bauen, dazu der Komponententest.

Vorab prüfe ich, was das React-Plugin an Zusatzpaketen mitziehen würde:

Schlank: Das Plugin zieht kein Babel nach, die Zusatz-Peers sind optional. Installation:

Jetzt Konfiguration und Test, danach die Komponente:

Die neue Projekt-Konfiguration funktioniert, alle 196 Tests laufen weiter. Jetzt die Komponente:

Grün ohne Warnungen: 199 Tests, Typecheck inklusive `vite.config.ts`. Fortschritt abhaken:

**Step 14 ist fertig:** 199 Tests grün (3 neu) ohne Warnungen, Typecheck grün, Step 14 in [progress.md](docs/progress.md) abgehakt.

| Datei | Neu/geändert | Inhalt und Zweck |
|---|---|---|
| [client/src/AppShell.tsx](client/src/AppShell.tsx) | neu | Header mit der Wortmarke Sneaker**Studio** (Großbuchstaben, „Studio“ in `brand`) als Link zur Startseite. Theme-Umschalter als runder Icon-Button: Mond im hellen Modus, Sonne im dunklen, Beschriftung für Screenreader. Darunter der Inhaltsbereich (`<main>`) für die aktuelle Seite. Nur Token-Farben, sichtbarer Fokusrahmen in `accent`. |
| [client/src/AppShell.test.tsx](client/src/AppShell.test.tsx) | neu | Wortmarke verlinkt auf „/“, die Seite erscheint in `<main>`, der Umschalter wechselt den Modus, ändert die Beschriftung und speichert die Wahl. |
| [client/vite.config.ts](client/vite.config.ts) | neu | React-Plugin und Test-Einstellungen für den Client (jsdom, CSS-Freigabe). Diese standen bisher in der Root-Konfiguration. |
| [vitest.config.ts](vitest.config.ts) | geändert | Jetzt schlicht `['shared', 'server', 'client']`. Jedes Paket bringt seine eigene Test-Konfiguration mit. |
| [client/tsconfig.json](client/tsconfig.json) | geändert | JSX (`react-jsx`), `vite.config.ts` wird mitgeprüft. |
| [client/package.json](client/package.json) | geändert | `react`, `react-dom`, `@tanstack/react-router` sowie `vite`, `@vitejs/plugin-react`, `@types/react(-dom)` und `@testing-library/react`/`dom`. Vorher geprüft: Das React-Plugin zieht kein Babel nach. |

**Änderung am Plan:** Der bisherige Step 15 „E2E-Grundgerüst & Theme“ bräuchte etwa neun Dateien. Ich teile ihn wie bei Step 13 auf, dadurch gibt es insgesamt 21 Steps.
- **Step 15 · App-Start:** Tailwind installieren (`tailwindcss`, `@tailwindcss/vite`), `index.html`, `main.tsx` (Theme wiederherstellen, Router, Styles), Dev-Server mit Weiterleitung `/api` → Server auf Port 3000, Scripts `dev`/`build`. Zur Prüfung baue ich die Produktionsversion und zeige dir die laufende App im Browser-Panel, im dunklen und im hellen Modus. `main.tsx` ist reine Verdrahtung, die automatisierte Absicherung übernimmt der E2E-Test in Step 16.
- **Step 16 · E2E-Grundgerüst & Theme:** Playwright mit Theme-Test. Dafür wird ein Browser benötigt, den Download spreche ich dann vorher mit dir ab.

Soll ich mit Step 15 weitermachen?

---

```md
weiter mit Step 15
```

---

Die Unterbrechung hatte noch nichts ausgelöst, ich starte Step 15 sauber.

**Plan für Step 15:** Tailwind installieren. Dann `index.html` und `main.tsx` anlegen (Theme wiederherstellen, Router mit der App-Shell, Styles laden). Den Dev-Server fest auf Port 5173 legen, denn auf diese Adresse zeigen die Aktivierungslinks. Scripts `dev`/`build` ergänzen und `dist/` in `.gitignore` aufnehmen. Zur Prüfung: Produktions-Build und die laufende App im Browser-Panel.

Tailwind ist installiert. Im Projekt liegt neu `SneakerStudio Web App - Transcript.md`, vermutlich von dir angelegt. Ich lasse sie unberührt. Jetzt die Dateien:

Der Build funktioniert, aber mein Suchmuster hat im gebauten CSS keine Tokens gefunden. Ich prüfe, wie Tailwind sie ausgibt:

Passt, Tailwind erzeugt für `light-dark()` einen Fallback mit Umschalt-Variablen für ältere Browser, und nur tatsächlich genutzte Tokens werden ausgegeben. Jetzt richte ich für die Sichtprüfung im Browser-Panel die Startkonfiguration `.claude/launch.json` für den Client-Dev-Server ein.

Der Dark-Mode passt (Hintergrundfarben, Wortmarke, Sonnen-Icon), die „Not Found“-Meldung kommt nur daher, dass Route „/“ (F02) noch fehlt. Als Nächstes prüfe ich Light-Mode und den Umschalter.

Der Light-Mode stimmt ebenfalls (`#f1f2f6`, weißer Header, Mond-Icon). Zum Schluss Umschalten und Neuladen bei heller Systemeinstellung:

Umschalten überschreibt die Systemeinstellung und bleibt nach dem Neuladen erhalten. Ich setze die gespeicherte Wahl im Vorschau-Browser zurück und prüfe die Konsole auf Fehler:

Keine Fehler. Die einzige Warnung ist der erwartete Hinweis „keine Seite für /“, sie verschwindet mit der Startseite. Fortschritt abhaken und die Reihenfolge anpassen:

**Step 15 ist fertig:** 199 Tests grün, Typecheck grün, Build erfolgreich (CSS 7,4 kB, JS 96 kB gzip), Step 15 in [progress.md](docs/progress.md) abgehakt. Die App läuft jetzt im Browser-Panel.

| Datei | Neu/geändert | Inhalt und Zweck |
|---|---|---|
| [client/index.html](client/index.html) | neu | HTML-Gerüst mit `lang="de"` und Titel „SneakerStudio“. |
| [client/src/main.tsx](client/src/main.tsx) | neu | Stellt vor dem ersten Rendern das gespeicherte Theme wieder her (kein Aufflackern), baut den Router mit der App-Shell (Typen registriert, damit Links typgeprüft sind) und rendert die App. |
| [client/vite.config.ts](client/vite.config.ts) | geändert | Tailwind-Plugin. Fester Port 5173 mit `strictPort`, weil die Aktivierungslinks in den Mails auf diese Adresse zeigen. Ist der Port belegt, bricht Vite ab, statt still auf einen anderen Port auszuweichen. |
| [client/package.json](client/package.json) | geändert | `tailwindcss` und `@tailwindcss/vite`, Scripts `dev` und `build`. |
| [.gitignore](.gitignore) | geändert | `client/dist/`. |
| [.claude/launch.json](.claude/launch.json) | neu | Startkonfiguration für das Browser-Panel. Das ist Werkzeug-Konfiguration, kein App-Code. |

**Im Browser geprüft:**
- System dunkel: Seite `#020716`, Header `#061226`, Sonnen-Icon.
- System hell: Seite `#f1f2f6`, Header weiß, Mond-Icon.
- Der Umschalter überschreibt die Systemeinstellung, und die Wahl bleibt nach dem Neuladen erhalten.
- Keine Fehler in der Konsole.

Tailwind übersetzt `light-dark()` für ältere Browser automatisch in einen Fallback, der Systemeinstellung und Umschalter gleichermaßen berücksichtigt. `main.tsx` sichert wie angekündigt der E2E-Test ab.

**Änderung am Plan:** Im Inhaltsbereich steht noch „Not Found“, weil es keine Startseite gibt. Deshalb ziehe ich **F02 Startseite als Step 16 vor**. Der E2E-Test (jetzt Step 17) läuft dann gegen eine echte Seite. [progress.md](docs/progress.md) ist schon angepasst.

**Nächster Step 16:** Die Startseite (F02).
- `HomePage.tsx` mit „Dein Sneaker. **Dein Style.**“, dem Willkommenstext aus Folie 8 und dem Primär-Button „Neues Kundenkonto erstellen“.
- Die Routen ziehen nach `router.tsx` um, damit Tests den echten Routenbaum nutzen.
- Die Route `/registrieren` bekommt eine Seite, vorerst nur mit der Überschrift „Konto erstellen“. Das Formular folgt in Step 18.
- Der Komponententest klickt den Button und prüft, dass die Registrierungsseite erscheint.

Das sind etwa fünf Dateien. Der Dev-Server läuft weiter, damit du die App im Panel ansehen kannst.

Soll ich mit Step 16 weitermachen?

---

```md
weiter mit Step 16
```

---

**Plan für Step 16:**
- Die Routen ziehen nach `router.tsx` um, damit App und Tests denselben Routenbaum nutzen.
- Neue `HomePage.tsx` mit Überschrift, Willkommenstext und Primär-Button „Neues Kundenkonto erstellen“.
- Neue `RegistrationPage.tsx`, vorerst nur mit der Überschrift „Konto erstellen“.
- Test zuerst.

Rot wie erwartet. Jetzt Seiten und Routenbaum:

Grün: 202 Tests, Typecheck ok. Sichtprüfung im laufenden Dev-Server, einmal dunkel, einmal hell, mit Klick auf den Button:

Beide Screenshots zeigen den hellen Modus, obwohl ich vorher dunkel emuliert habe. Ich prüfe, was im Browser gerade gilt:

Alles korrekt: Der Vorschau-Browser hat „hell“ gespeichert, das Vorrang vor der Systemeinstellung hat. Für den Dark-Screenshot schalte ich kurz um, stelle deine Wahl danach wieder her und teste anschließend den Klick auf den Button.

Die Beschriftung hat auf „Zum hellen Design wechseln“ gewechselt, der Screenshot zeigt aber weiter hell. Ich prüfe den tatsächlichen Zustand:

Der Zustand stimmt: dunkel, Hintergrund `#020716`. Der Screenshot war nur zu früh aufgenommen. Neuer Screenshot:

Dark-Mode wie im Design. Jetzt der Klick auf den Button, danach stelle ich deine Wahl „hell“ wieder her:

Klick führt zu `/registrieren` mit „Konto erstellen“, deine Wahl „hell“ ist wiederhergestellt. Kurzer Blick in die Konsole:

**Step 16 ist fertig:** 202 Tests grün (3 neu), Typecheck grün, keine Warnungen in der Konsole, Step 16 in [progress.md](docs/progress.md) abgehakt.

| Datei | Neu/geändert | Inhalt und Zweck |
|---|---|---|
| [client/src/HomePage.tsx](client/src/HomePage.tsx) | neu | „Dein Sneaker. **Dein Style.**“ mit „Dein Style.“ in `brand`, Akzentbalken, Willkommenstext aus Folie 8 und Primär-Button „Neues Kundenkonto erstellen“ → `/registrieren` (UC 1.1.1). |
| [client/src/HomePage.test.tsx](client/src/HomePage.test.tsx) | neu | Überschrift, Option sichtbar mit Ziel `/registrieren`, Klick öffnet die Registrierung. Der Test nutzt den echten Routenbaum. |
| [client/src/RegistrationPage.tsx](client/src/RegistrationPage.tsx) | neu | Seite „Konto erstellen“ mit Akzentbalken. Das Formular folgt in Step 18. |
| [client/src/router.tsx](client/src/router.tsx) | neu | Routenbaum (`/`, `/registrieren`) und `createAppRouter`. App und Tests nutzen denselben Baum, und Links sind typgeprüft: Ein Link auf eine nicht existierende Route fällt schon beim Typecheck auf. |
| [client/src/main.tsx](client/src/main.tsx) | geändert | Nutzt jetzt `createAppRouter`. |
| [docs/progress.md](docs/progress.md) | geändert | Step 16 abgehakt. |

**Im Browser geprüft:** Die Startseite sieht in Hell und Dunkel aus wie die Vorlage, der Klick führt zu „Konto erstellen“. Dabei ist mir aufgefallen, dass im Vorschau-Browser „hell“ gespeichert war, vermutlich hattest du den Umschalter ausprobiert. Die App hat diese Wahl korrekt über die Systemeinstellung gestellt. Für den Dark-Screenshot habe ich kurz umgeschaltet, deine Wahl ist wiederhergestellt.

Das Feature F02 hake ich erst ab, wenn das Formular steht und per E2E geprüft ist. Das zweite Akzeptanzkriterium verlangt nämlich, dass nach dem Klick das Kontaktdaten-Formular erscheint.

**Nächster Step 17:** E2E-Grundgerüst und Theme (F01).
- `@playwright/test` im Root installieren.
- `playwright.config.ts` startet Server und Client automatisch, der Server mit Temp-Datenbank und Temp-Postfach.
- `e2e/theme.spec.ts` prüft: System hell/dunkel ergibt den passenden Hintergrund, Umschalten wirkt sofort und hält nach dem Neuladen.
- Script `npm run test:e2e` und `.gitignore` für die Testberichte.
- **Browser:** Im Playwright-Cache auf deinem Mac liegen schon mehrere Chromium-Versionen, außerdem ist Chrome 154 installiert. Passt eine davon, wird nichts heruntergeladen. Andernfalls frage ich dich vor einem Download (etwa 150 MB vom offiziellen Playwright-CDN).
- Den Dev-Server im Panel beende ich vorher, damit Playwright Port 5173 nutzen kann.

Soll ich mit Step 17 weitermachen?

---

```md
weiter mit Step 17
```

---

**Plan für Step 17:**
1. Den Dev-Server im Panel beenden.
2. `@playwright/test` installieren und prüfen, ob ein passender Browser schon da ist.
3. `playwright.config.ts` und `e2e/theme.spec.ts` anlegen, Test zuerst.
4. Script `test:e2e` ergänzen, dazu `.gitignore`, einen Typecheck für den E2E-Code und den Befehl in `CLAUDE.md`.

Playwright 1.63 benötigt Chromium v1243, im Cache liegen nur ältere Versionen — ich prüfe jetzt die Download-Größe der passenden Headless Shell, um zwischen ihr und dem installierten Chrome 154 entscheiden zu können.

Freigegeben. Ich lade nur die Headless Shell:

Browser ist da. Jetzt Konfiguration und Test:

3 von 3 E2E-Tests grün. Jetzt Unit-Tests und der erweiterte Typecheck inklusive E2E-Code:

Der Typecheck deckt jetzt auch Spec und Playwright-Konfiguration ab. Zum Schluss `CLAUDE.md` und Fortschritt:

**Step 17 ist fertig:** 3 E2E-Tests grün (3,5 s), 202 Unit-Tests grün, Typecheck grün (jetzt inklusive E2E-Code). Step 17 und **Feature F01** sind in [progress.md](docs/progress.md) abgehakt, weil alle F01-Testfälle erfüllt sind: Unit, Komponente und E2E.

| Datei | Neu/geändert | Inhalt und Zweck |
|---|---|---|
| [playwright.config.ts](playwright.config.ts) | neu | Tests liegen in `e2e/`, Basis-URL `http://localhost:5173`, Browser Chromium. Der Client-Dev-Server startet automatisch. Lokal wird ein schon laufender Dev-Server wiederverwendet, in CI nicht. |
| [e2e/theme.spec.ts](e2e/theme.spec.ts) | neu | System hell ergibt `#f1f2f6`, System dunkel `#020716`. Umschalten wirkt sofort und bleibt nach dem Neuladen erhalten. Damit ist auch `main.tsx` abgesichert, denn ohne `restoreTheme()` würde der Neulade-Test scheitern. |
| [e2e/tsconfig.json](e2e/tsconfig.json) | neu | Damit Spec-Dateien und Playwright-Konfiguration typgeprüft werden. |
| [package.json](package.json) | geändert | `@playwright/test`, Script `npm run test:e2e`, `typecheck` prüft zusätzlich `e2e/`. |
| [.gitignore](.gitignore) | geändert | `test-results/`, `playwright-report/`. |
| [CLAUDE.md](CLAUDE.md) | geändert | Befehle für E2E-Tests und Typecheck ergänzt. |

**Browser:** Die Chrome Headless Shell 153 (99 MB) liegt wie freigegeben im Playwright-Cache (`~/Library/Caches/ms-playwright`), nicht im Projekt.

**Abweichung von der Ankündigung:** Die Playwright-Konfiguration startet vorerst nur den Client. Der Server mit Temp-Datenbank und Temp-Postfach kommt in Step 20 dazu, sobald ein E2E-Test die API braucht. Vorher wäre das Vorarbeit „für später“.

**Nächster Step 18:** Das Formular für die Kontaktdaten (F03). Das ist der größte Client-Step:
- `RegistrationPage.tsx` bekommt die Felder Anrede (Auswahlliste mit Herr/Frau/Keine Angabe), Vorname, Nachname, Straße, Hausnummer, PLZ, Ort, E-Mail und Telefon (optional). Alles liegt in einer Karte im Design-Stil, die Rahmen nutzen den neuen Feldrahmen-Token.
- Hinweise erscheinen beim Verlassen eines Felds, mit exakt den Texten aus `shared`.
- Der Button „Konto anlegen“ bleibt deaktiviert, bis alles gültig ist.
- Browser-Autofill wird unterstützt, Hinweise sind per `aria-describedby` für Screenreader verknüpft.
- Dazu kommen Komponententests und ein E2E-Test. Der E2E-Test deckt auch F02 ab: Klick auf den Start-Button → Formular.
- Die Passwortfelder folgen in Step 19.
- Etwa fünf Dateien, inklusive der Abhängigkeit des Clients auf das eigene Paket `shared`.

Soll ich mit Step 18 weitermachen?

---

```md
weiter mit Step 18
```

---

**Plan für Step 18:**
- Der Client bekommt die Abhängigkeit auf das eigene Paket `shared`.
- `RegistrationPage.tsx` erhält das Formular mit den neun Kontaktfeldern in drei Gruppen (Persönliche Daten, Adresse, Kontakt). Hinweise erscheinen beim Verlassen eines Felds, der Button „Konto anlegen“ ist nur bei gültigen Daten aktiv.
- Dazu Komponententests (zuerst) und ein E2E-Test, der auch F02 abdeckt.

Verknüpft. Jetzt die Komponententests:

Rot, 14 von 14 scheitern. Jetzt das Formular:

Mir ist ein Fehler in der Typisierung von `SelectField` unterlaufen: Sie verweist auf ein nicht existierendes `bindType`. Ich korrigiere die Hilfskomponenten:

Grün: 216 Tests, darunter 14 neue, Typecheck ok. Jetzt der E2E-Test für F02 und F03:

6 von 6 E2E-Tests grün, Typecheck ok. Jetzt die Sichtprüfung des Formulars im Browser-Panel, mit einigen provozierten Hinweisen:

Der Screenshot ist durch die Viewport-Skalierung zu klein, und die Eingaben scheinen nicht angekommen zu sein. Ich setze den Viewport zurück und prüfe den Zustand direkt:

Die Klicks sind wegen der Skalierung danebengegangen. Neuer Versuch in normaler Fenstergröße:

Fehlerhinweise, rote Rahmen und der deaktivierte Button sehen wie erwartet aus. Jetzt prüfe ich noch den Dark-Mode und stelle danach wieder auf „hell“ zurück.

Der Dark-Mode des Formulars passt zur Vorlage. Ich stelle deine Wahl „hell“ wieder her und hake ab. F02 und F03 sind jetzt auf allen Ebenen getestet (Unit, Komponente, API, E2E):

**Step 18 ist fertig:** 216 Unit- und Komponententests grün (14 neu), 6 E2E-Tests grün (3 neu), Typecheck grün. In [progress.md](docs/progress.md) sind Step 18 sowie die **Features F02 und F03** abgehakt, beide sind auf allen Ebenen getestet.

| Datei | Neu/geändert | Inhalt und Zweck |
|---|---|---|
| [client/src/RegistrationPage.tsx](client/src/RegistrationPage.tsx) | geändert | Formular „Konto erstellen“ in einer Karte mit drei Gruppen: Persönliche Daten, Adresse, Kontakt.<br>• Die Anrede ist eine Auswahlliste, die Optionen kommen aus `shared`.<br>• Beim Verlassen eines Felds erscheint der Hinweis aus `validateContact`. Das Feld wird dann als ungültig markiert (`aria-invalid`, roter Rahmen) und ist für Screenreader mit dem Hinweis verknüpft.<br>• „Konto anlegen“ ist nur bei gültigen Daten aktiv.<br>• Autofill-Angaben für Name, PLZ, Ort, E-Mail und Telefon. Die native Browser-Validierung ist abgeschaltet, damit nur unsere Hinweise erscheinen. |
| [client/src/RegistrationPage.test.tsx](client/src/RegistrationPage.test.tsx) | neu | Alle Felder und die Anrede-Optionen. Kein Hinweis vor dem Verlassen. Für 8 Felder je ein exakter Hinweistext samt Verknüpfung. PLZ passt nicht zum Ort. Der Hinweis verschwindet bei gültiger Eingabe. Button-Freigabe, und ein leeres Telefonfeld blockiert nicht. |
| [e2e/registration.spec.ts](e2e/registration.spec.ts) | neu | F02: Klick auf den Start-Button → Formular. F03: Vollständige Daten geben den Button frei, PLZ/Ort-Hinweis im echten Browser. |
| [client/package.json](client/package.json) | geändert | Abhängigkeit auf das eigene Paket `@sneakerstudio/shared`. |

**Im Browser geprüft**, hell und dunkel, mit provozierten Hinweisen („Hauptstr.“, PLZ 80331 mit Ort Berlin): Die Darstellung entspricht der Vorlage, deine Theme-Wahl ist wiederhergestellt. Kosmetisch ist mir aufgefallen, dass der PLZ-Hinweis in der schmalen PLZ-Spalte auf drei Zeilen umbricht. Wenn du willst, lasse ich den Hinweis in Step 19 über die volle Breite laufen.

**Nächster Step 19:** Passwortfelder (F04).
- Neue Gruppe „Passwort“ mit „Passwort“ und „Passwort wiederholen“: maskiert und für Passwort-Manager als neues Passwort gekennzeichnet.
- Unter dem Passwortfeld steht dauerhaft ein Hilfetext mit den Regeln, der bei Verstoß durch den Hinweis ersetzt wird.
- Der Hinweis „Die Passwörter stimmen nicht überein“ erscheint nach dem Verlassen der Wiederholung und wird bei Änderungen an beiden Feldern neu geprüft.
- Der Button verlangt zusätzlich ein gültiges und übereinstimmendes Passwort.
- Komponententests, dazu wird der E2E-Test um die Passwortfelder erweitert.

Das sind etwa vier Dateien.

Soll ich mit Step 19 weitermachen?

---

```md
weiter mit Step 19
```

---

**Plan für Step 19:** Das Formular bekommt die Gruppe „Passwort“ mit „Passwort“ (dauerhafter Hilfetext, bei Verstoß der Hinweis) und „Passwort wiederholen“. Der Button verlangt zusätzlich ein gültiges und übereinstimmendes Passwort. Tests zuerst: Die bestehenden Button-Tests füllen künftig auch die Passwörter aus, neue F04-Tests kommen dazu. Der E2E-Test wird entsprechend erweitert. Den PLZ-Hinweis lasse ich unverändert, dafür hattest du keinen Auftrag gegeben.

Rot wie erwartet (7 Fälle). Jetzt die Implementierung. Zuerst lese ich den aktuellen Stand der Seite:

Jetzt der E2E-Test. Der Freigabe-Test füllt künftig auch die Passwörter aus:

2 E2E-Tests scheitern. Die Ursache ist wahrscheinlich: `getByLabel('Ort')` sucht nach Teiltext und passt deshalb jetzt auch auf „Pass**wort**“. Ich prüfe die Fehlermeldung:

Bestätigt: `Ort` trifft drei Felder (Ort, Passwort, Passwort wiederholen). Die Suche muss exakt sein:

Alle 6 E2E-Tests grün. Kurze Sichtprüfung der Passwort-Gruppe im Browser-Panel (Hilfetext, Hinweis, Abweichung):

Beide Hinweise stehen im DOM. Durch den Tab ist der Fokus an den Seitenanfang gesprungen, weil deaktivierte Buttons nicht fokussierbar sind. Deshalb noch ein Screenshot der Passwort-Gruppe:

Die Passwort-Gruppe verhält sich wie spezifiziert – maskiert, mit ersetztem Hilfetext und gemeldeter Abweichung. F04 ist damit auf allen Ebenen (Unit, Komponente, API) getestet; ich hake den Fortschritt jetzt ab.

**Step 19 ist fertig:** 221 Unit- und Komponententests grün (5 neu, 2 angepasst), 6 E2E-Tests grün, Typecheck grün. Step 19 und **Feature F04** sind in [progress.md](docs/progress.md) abgehakt. Damit sind vier von sechs Features fertig.

| Datei | Neu/geändert | Inhalt und Zweck |
|---|---|---|
| [client/src/RegistrationPage.tsx](client/src/RegistrationPage.tsx) | geändert | Neue Gruppe „Passwort“ mit „Passwort“ und „Passwort wiederholen“: maskiert und als `new-password` gekennzeichnet. `validateForm` kombiniert die Kontaktdaten-Regeln mit den Passwortregeln aus `shared`, der Button verlangt beides. Die Feld-Komponente zeigt unter der Eingabe entweder den Hilfetext (grau) oder den Hinweis (rot), jeweils für Screenreader verknüpft. |
| [client/src/RegistrationPage.test.tsx](client/src/RegistrationPage.test.tsx) | geändert | Neu (F04): Maskierung und Autofill-Kennzeichnung. Hilfetext wird durch den Hinweis ersetzt. Abweichende Wiederholung. Neubewertung, wenn sich das Passwort ändert. Button-Freigabe nur mit gültigem und gleichem Passwort. Die zwei bestehenden Button-Tests füllen jetzt auch das Passwort aus. |
| [e2e/registration.spec.ts](e2e/registration.spec.ts) | geändert | Der Freigabe-Test prüft jetzt: nur Kontaktdaten ergibt noch keinen aktiven Button, erst mit bestätigtem Passwort wird er aktiv. |

**Ein Fehler unterwegs:** Zwei E2E-Tests schlugen zunächst fehl. Playwright sucht Beschriftungen standardmäßig per Teiltext, und „Ort“ steckt auch in „Pass**wort**“. Die Suche nach „Ort“ ist jetzt exakt, danach waren alle Tests grün.

**Im Browser geprüft:** Hilfetext, Regel-Hinweis und „Die Passwörter stimmen nicht überein“ erscheinen wie spezifiziert.

**Nächster Step 20:** Absenden und Bestätigung (F05).
- `@tanstack/react-query` installieren (abgestimmter Stack) und den Query-Provider in `main.tsx` einbinden.
- Der Dev-Server leitet `/api` an den Express-Server auf Port 3000 weiter.
- „Konto anlegen“ sendet an `POST /api/registrations`.
  - Währenddessen erscheint „Deine Kontoanlage ist in Bearbeitung.“ und der Button ist gesperrt.
  - Bei Erfolg ersetzt die Bestätigungsansicht das Formular: „Deine Kontaktdaten wurden erfolgreich verifiziert.“, „Bitte bestätige deine E-Mail-Adresse“ und der Hinweis auf den 24-Stunden-Link.
  - Bei 409 und 422 erscheinen die Server-Hinweise an den Feldern, bei anderen Fehlern eine allgemeine Meldung.
- Komponententests mit simuliertem Server-Aufruf.

**Anpassung am Plan:** Der E2E-Test über den ganzen Ablauf kommt in Step 21, zusammen mit der Aktivierungsseite: registrieren → Bestätigung → Link aus dem Postfach → „Konto erfolgreich aktiviert!“, außerdem der Fall „doppelte E-Mail“. Dann startet Playwright auch den Server mit Temp-Datenbank. So bleibt Step 20 bei etwa fünf Dateien.

Soll ich mit Step 20 weitermachen?

---

```md
weiter mit Step 20
```

---

**Plan für Step 20:**
- TanStack Query installieren, Provider in `main.tsx`, Dev-Server-Weiterleitung `/api` → Port 3000.
- `RegistrationPage` sendet die Daten ohne Passwort-Wiederholung per Mutation. Angezeigt werden „in Bearbeitung“, die Bestätigungsansicht, Server-Hinweise an den Feldern (409/422) oder eine allgemeine Fehlermeldung.
- Tests zuerst. Die bestehenden Tests, die die Registrierungsseite rendern (Formular und Startseite), bekommen den Query-Provider.

Installiert (2 Pakete). Jetzt die Tests. Zuerst lese ich den aktuellen Formular-Test vollständig:

Jetzt bekommt auch der Startseiten-Test den Provider, weil sein Klick-Test die Registrierungsseite rendert:

Rot wie erwartet: 5 neue F05-Fälle, alle bestehenden bleiben grün. Jetzt die Implementierung in `RegistrationPage.tsx`:

Überschrift und Akzentbalken stehen jetzt in beiden Zweigen doppelt. Das fasse ich zusammen:

Alle Tests laufen durch (226 Tests, Typecheck, 6 E2E). Jetzt prüfe ich vor der Sichtprüfung mit dem echten Server, ob unter `server/data/` bereits Entwicklungsdaten liegen, um deinen Datenstand nicht zu verändern.

Es gibt noch keine Entwicklungsdaten, daher starte ich den Server mit dem Standard-Datenordner und lösche `server/data/` danach wieder, um den ursprünglichen Zustand wiederherzustellen. Dafür ergänze ich jetzt die Startkonfiguration für das Panel.

Der Server läuft. Den dabei geöffneten Tab für Port 3000 schließe ich und fülle das Formular im Client-Tab aus:

Über den echten Server klappt es: Die Bestätigungsansicht entspricht Schritt 3 der Vorlage. Jetzt der Fall „E-Mail bereits registriert“ in der Oberfläche und ein Blick in die Server-Ausgabe:

Auch die Großbuchstaben-Schreibweise wird korrekt als Dublette erkannt, mit Hinweis am E-Mail-Feld und gesperrtem Button. Ich werfe noch einen kurzen Blick in die Server-Ausgabe und räume dann die Testdaten auf.

Step 20 ist abgehakt. Hier der Bericht:

**Step 20 ist fertig:** 226 Unit- und Komponententests grün (5 neu), 6 E2E-Tests grün, Typecheck grün. Außerdem habe ich den ganzen Ablauf einmal über den echten Server in der Oberfläche durchgespielt.

| Datei | Neu/geändert | Inhalt und Zweck |
|---|---|---|
| [client/src/RegistrationPage.tsx](client/src/RegistrationPage.tsx) | geändert | „Konto anlegen“ sendet per TanStack-Query-Mutation an `POST /api/registrations`, ohne die Passwort-Wiederholung. Während der Anfrage erscheint „Deine Kontoanlage ist in Bearbeitung.“ (UC 1.3.1) und der Button ist gesperrt. Bei Erfolg ersetzt die Bestätigungsansicht das Formular: „Deine Kontaktdaten wurden erfolgreich verifiziert.“ (UC 1.3.2) und „Bitte bestätige deine E-Mail-Adresse“ mit dem 24-h-Hinweis (Folie 8, Schritt 3). Bei 409/422 stehen die Server-Hinweise an den Feldern und verschwinden, sobald das Feld geändert wird. Bei anderen Fehlern kommt eine allgemeine Meldung, ein neuer Versuch ist möglich. |
| [client/src/RegistrationPage.test.tsx](client/src/RegistrationPage.test.tsx) | geändert | Mit simuliertem Server: gesendete Daten, „in Bearbeitung“ mit gesperrtem Button, Bestätigungsansicht, 409-Hinweis am Feld samt Entfernen bei Änderung, allgemeiner Fehler. |
| [client/src/HomePage.test.tsx](client/src/HomePage.test.tsx) | geändert | Query-Provider ergänzt, weil der Klick-Test die Registrierungsseite rendert. |
| [client/src/main.tsx](client/src/main.tsx) | geändert | `QueryClientProvider` um die App. |
| [client/vite.config.ts](client/vite.config.ts) | geändert | Der Dev-Server leitet `/api` an den Express-Server (Port 3000) weiter. |
| [client/package.json](client/package.json) | geändert | `@tanstack/react-query` |
| [.claude/launch.json](.claude/launch.json) | geändert | Startkonfiguration `server` für das Panel. |

**Im Browser geprüft**, mit echtem Server:
- Anlage ergibt die Bestätigungsansicht.
- Der Server hat die Mail „Hallo Frau Mustermann, …“ mit Link ausgegeben.
- Die gleiche E-Mail in Großbuchstaben ergibt „Diese E-Mail-Adresse ist bereits registriert“ am Feld.

Die dabei entstandenen Testdaten (`server/data/`) habe ich wieder gelöscht. Der Ordner existierte vorher nicht.

F05 hake ich erst nach dem E2E-Test in Step 21 ab.

**Nächster Step 21, der letzte:** Aktivierungsseite (F06) und E2E über den ganzen Ablauf.
- Neue `ActivationPage.tsx` unter der Route `/aktivieren?token=…`. Sie aktiviert beim Öffnen automatisch und zeigt je nach Ergebnis: „Konto erfolgreich aktiviert!“ mit Willkommenstext und Link zur Startseite (Folie 8, Schritt 5), „Link abgelaufen, Konto gelöscht“ mit Link zur Registrierung, oder „Link ungültig“. Dazu Komponententests.
- Playwright startet zusätzlich den Server mit Temp-Datenbank und Temp-Postfach.
- E2E: registrieren → Bestätigung → Link aus dem Postfach öffnen → „Konto erfolgreich aktiviert!“. Außerdem: zweite Registrierung mit gleicher E-Mail → Hinweis.
- Danach sind F05 und F06 und damit alle Features abgehakt.

Das sind etwa sechs Dateien.

Soll ich mit Step 21 weitermachen?

---

```md
weiter mit Step 21
```

---

**Plan für Step 21:**
- Neue `ActivationPage` unter der Route `/aktivieren?token=…`. Sie ruft beim Öffnen genau einmal `POST /api/activations` auf und zeigt „wird aktiviert“, Erfolg, abgelaufen, ungültig oder Fehler.
- Playwright startet zusätzlich den Server mit Temp-Datenbank und Temp-Postfach.
- Neuer E2E-Test über den ganzen Ablauf.
- Die Fehlermeldung für unerwartete Fehler auf der Aktivierungsseite trage ich in F06 nach.

Tests zuerst.

Rot wie erwartet (6 Fälle). Jetzt die Seite und die Route:

Grün: 232 Tests, 6 davon neu. Auch unter StrictMode wird genau ein Aktivierungsaufruf gesendet. Jetzt Playwright mit Server und der E2E-Test über den ganzen Ablauf:

Alle 9 E2E-Tests sind grün. Vor dem Lauf meldete meine Prüfung allerdings Port 3000 als belegt. Das kläre ich, bevor ich weitermache:

Niemand hört mehr auf Port 3000, und `server/data/` fehlt – meine Prüfung mit `lsof -ti tcp:3000` war zu ungenau, da sie auch Verbindungen zu Port 3000 erfasst. Ich überprüfe das jetzt genauer.

Das war nur eine bereits geschlossene Verbindung, kein aktiver Server – Playwright hat einen eigenen Server mit Temp-Daten gestartet. Jetzt prüfe ich noch die Aktivierungsseite (Folie 8) über den echten Server und räume danach die Testdaten auf.

Die Aktivierungsseite entspricht in beiden Modi Schritt 5 der Vorlage. Ich stelle deine Theme-Wahl wieder her, stoppe den Server und lösche die Testdaten:

Jetzt die F06-Doku um die Fehlermeldung ergänzen und alle Häkchen setzen:

**Step 21 ist fertig, und damit alle 21 Steps und alle 6 Features.** 232 Unit- und Komponententests grün (6 neu), 9 E2E-Tests grün (3 neu), Typecheck grün. [progress.md](docs/progress.md) ist komplett abgehakt.

| Datei | Neu/geändert | Inhalt und Zweck |
|---|---|---|
| [client/src/ActivationPage.tsx](client/src/ActivationPage.tsx) | neu | Aktiviert beim Öffnen des Mail-Links genau einmal, auch unter React StrictMode, und ohne automatischen Wiederholversuch, weil ein abgelaufenes Konto danach schon gelöscht ist. Mögliche Ansichten: „Dein Konto wird aktiviert …“, „Konto erfolgreich aktiviert!“ mit Link „Zur Startseite“, „Link abgelaufen, Konto gelöscht“ mit Link zur Neuregistrierung, „ungültig“ oder eine allgemeine Fehlermeldung. |
| [client/src/ActivationPage.test.tsx](client/src/ActivationPage.test.tsx) | neu | Genau ein Aufruf mit dem Token aus dem Link, alle fünf Zustände mit exakten Texten und Link-Zielen. |
| [client/src/router.tsx](client/src/router.tsx) | geändert | Route `/aktivieren?token=…`, der Token wird aus der Adresse gelesen und geprüft. |
| [playwright.config.ts](playwright.config.ts) | geändert | Startet zusätzlich den Server mit frischer Temp-Datenbank und leerem Temp-Postfach pro Testlauf. Ein schon laufender Entwicklungs-Server wird dafür bewusst nicht wiederverwendet. |
| [e2e/account.spec.ts](e2e/account.spec.ts) | neu | Voller Ablauf im echten Browser: Registrierung → Bestätigung → Mail im Postfach („Hallo Herr Mustermann,“, Löschhinweis) → Link → „Konto erfolgreich aktiviert!“ → Startseite. Außerdem die Dublette in anderer Schreibweise und ein ungültiger Link. |
| [docs/feature_06_kontoaktivierung.md](docs/feature_06_kontoaktivierung.md) | geändert | Fehlermeldung und die Regel „genau ein Aufruf pro Link“ ergänzt. |

**Im Browser geprüft:** Die Aktivierungsseite sieht hell und dunkel aus wie Schritt 5 der Vorlage. Testdaten sind gelöscht, der Server ist gestoppt, deine Theme-Wahl ist wiederhergestellt. Der Client-Dev-Server läuft weiter im Panel.

**Selbst ausprobieren**, in zwei Terminals:
```bash
npm run dev -w server
```
```bash
npm run dev -w client
```
Dann http://localhost:5173 öffnen. Die Bestätigungsmail mit dem Link steht in der Server-Konsole und unter `server/data/outbox/`.

Tests:
```bash
npm test
```
```bash
npm run test:e2e
```

Committet ist noch nichts. Sag Bescheid, wenn ich einen Commit anlegen soll.


---

```md
commit das bitte
```

---

64 Dateien sind gestaged (Quellcode, Tests, Doku, Konfiguration und die beiden PDFs), während node_modules, Build-/Testartefakte und deine Transkript-Datei ausgeschlossen bleiben. Jetzt erstelle ich den Commit.

Committet als `a08afa5` („Release 0.1: Kundenkonto-Registrierung mit Kontoaktivierung“) auf `main`, mit 64 Dateien. Als erster Commit in einem neuen Repo liegt er direkt auf `main`, nicht auf einem eigenen Branch. Gepusht ist nichts, das Repo hat noch kein Remote.

- **Enthalten:** Quellcode, Tests, Doku, `CLAUDE.md`, Konfiguration inklusive `.claude/launch.json`, Lockfile und die beiden Anforderungs-PDFs, auf die `CLAUDE.md` verweist.
- **Nicht enthalten:** `SneakerStudio Web App - Transcript.md`, weil sie deine Datei ist und du nichts dazu gesagt hattest. Soll sie mit in den Commit, reicht ein kurzes Wort.

---

```md
nimm die Transkript-Datei mit in den Commit
```

---

Die Transkript-Datei (74 KB) ist jetzt Teil des Commits, der Arbeitsbaum ist sauber. Dafür habe ich den bisherigen Commit ergänzt (Amend), statt einen zweiten anzulegen. Es bleibt also bei einem Commit, mit neuem Hash `19b49b2` statt `a08afa5`, jetzt mit 65 Dateien. Das ist unproblematisch, weil noch nichts gepusht war.

---

---

---

---


# Zweiter Prompt

---

```md
Mach einen Feature Plan für eine Landing Page, eine Login Möglichkeit und eine Welcome Page wenn man eingeloggt ist.
```

---


**Verständnis:** Du möchtest einen Feature-Plan, noch keine Umsetzung, für drei Themen: Landing Page, Login und eine Welcome Page nach dem Login. Wie in Step 2 würde das Ergebnis aus Feature-Dateien (`docs/feature_07…`) und geplanten, noch offenen Steps in `docs/progress.md` bestehen.

**Das Hindernis:** Das Use-Case-Dokument enthält zu keinem der drei Themen einen Use Case. Laut `CLAUDE.md` muss aber jedes Feature von einem Use Case abgeleitet sein. Die Design-Vorlage deckt die Themen dagegen ab:
- Folie 7 nennt „Registrierung & Login“ für Release 0.1.
- Folie 8 zeigt „Bereits ein Konto? Anmelden“, „Konto aktiviert“ und „Los geht's – Mein Konto“.

Vier Punkte bestimmen, wie der Plan aussieht:

Alle vier Empfehlungen sind übernommen. Jetzt aktualisiere ich für Step 22 die Doku: den Use-Case-Entwurf mit Kapiteln 1.4–1.6, die Feature-Dateien F07–F09, die geplanten Steps in progress.md sowie den Entwurf als Quelle in CLAUDE.md.

Jetzt `progress.md` mit den neuen Features und geplanten Steps sowie die Quellen-Regel in `CLAUDE.md`:

**Step 22 ist fertig:** Der Feature-Plan steht, reine Doku ohne Code. Alle 10 neuen Use Cases sind einem Feature zugeordnet, das habe ich per Abgleich geprüft.

| Datei | Neu/geändert | Inhalt |
|---|---|---|
| [docs/usecases_entwurf.md](docs/usecases_entwurf.md) | neu | 10 User Stories mit Akzeptanzkriterien und Hinweistexten im Stil des Use-Case-Dokuments: 1.4 Landing Page, 1.5 Anmeldung, 1.6 Willkommensseite. Jede Story nennt ihre Quelle (Folie 1, 5, 7, 8, 9). Der Status ist „Entwurf zur fachlichen Freigabe“. |
| [docs/feature_07_landing_page.md](docs/feature_07_landing_page.md) | neu | Die Startseite `/` wird ausgebaut: Hero mit den Einstiegen „Neues Kundenkonto erstellen“ und „Anmelden“ (angemeldet: „Zu meinem Konto“), Werte-Leiste, „So einfach geht's“ in drei Schritten und vier Vorteilskacheln aus Folie 8. |
| [docs/feature_08_anmeldung.md](docs/feature_08_anmeldung.md) | neu | Anmeldeseite `/anmelden`, API `POST`/`GET`/`DELETE /api/session`, Sitzung per HttpOnly-Cookie, Schutz vor Passwort-Raten. Dazu Anpassungen an Header, Registrierung („Bereits ein Konto? Anmelden“) und Aktivierungsseite („Jetzt anmelden“). **Keine neuen Pakete.** |
| [docs/feature_09_willkommensseite.md](docs/feature_09_willkommensseite.md) | neu | Geschützte Seite `/willkommen` mit „Willkommen, Herr Mustermann!“ (gleiche Anrede-Regel wie in der Mail, dafür wandert die Regel nach `shared`) und einer Übersicht der Kontaktdaten nur zum Lesen. |
| [docs/progress.md](docs/progress.md) | geändert | F07–F09 offen, Step 22 abgehakt, Steps 23–29 geplant. |
| [CLAUDE.md](CLAUDE.md) | geändert | `docs/usecases_entwurf.md` gilt jetzt als Quelle für Features. |

**Geplante Reihenfolge:** zuerst der Server (Steps 23–24: Passwortprüfung, Sitzungen, API). Danach die Anrede-Regel in `shared` (25), der Client (26–28: Anmeldeseite, Header und Abmelden, Willkommensseite) und zuletzt die Landing Page (29), weil sie Login und Willkommensseite verlinkt. Jedes Feature bekommt seinen E2E-Test in seinem Step.

**Das solltest du prüfen oder freigeben:**
- **Freigabe:** Den Use-Case-Entwurf als Ganzes, weil er Grundlage aller drei Features ist.
- **Vorschläge, die nicht aus der Vorlage stammen:** Sperre nach 5 Fehlversuchen für 15 Minuten (1.5.3) und automatisches Abmelden nach 8 Stunden (1.5.4).
- **Bilder:** Sneaker-Bilder aus der Präsentation nutze ich nur, wenn die Nutzungsrechte geklärt sind. Bis dahin gibt es keine Produktfotos.
- **Werbetexte:** Die Vorteilstexte „Maßgeschneiderte Empfehlungen“ und „exklusive Vorteile“ versprechen Funktionen späterer Releases.
- **Nicht im Plan:** „Passwort vergessen“, weil es keinen Use Case gibt. Ich empfehle es für das nächste Release, sonst verlieren Kunden ohne Passwort den Zugang.

Committet ist der Plan noch nicht. Soll ich nach deiner Freigabe mit Step 23 weitermachen?


---

```md
Plan commit und starte dann mit Step 23
```

---

Die Freigabe nehme ich so: Der Plan wird wie dokumentiert umgesetzt, auch die Vorschläge (5 Fehlversuche, 8 Stunden). Der Status des Use-Case-Entwurfs bleibt „Entwurf“, bis du ihn fachlich freigibst. Zuerst der Commit:

Plan committet. Weiter mit Step 23: `verifyPassword` zeitkonstant mit gespeicherten Hash-Parametern prüfen und ein neues `session-store.ts`-Modul für SQLite-Sitzungen (nur Token-Hash, 8h Gültigkeit) erstellen, zunächst mit Tests. Die Fehlversuchssperre kommt erst in Step 24 mit der API.

Der Testfall mit ungültigem `N` prüft nicht den eigentlich gemeinten Fehlerpfad, da er schon an der zu kurzen Schlüssellänge scheitert. Ich ergänze jetzt einen gezielten Test dafür.

Grün: 250 Tests (18 neu), Typecheck ok. Fortschritt abhaken:

**Step 23 ist fertig:** Der Plan ist committet (`1552560`), 250 Tests grün (18 neu), Typecheck grün, Step 23 in [progress.md](docs/progress.md) abgehakt. Der Code von Step 23 ist noch nicht committet.

| Datei | Neu/geändert | Inhalt und Zweck |
|---|---|---|
| [server/src/password-hash.ts](server/src/password-hash.ts) | geändert | Neu ist `verifyPassword` (UC 1.5.1): Die Funktion liest Parameter und Salt aus dem gespeicherten Hash, rechnet mit scrypt nach und vergleicht zeitkonstant (`timingSafeEqual`). Beschädigte Hashes, eine falsche Schlüssellänge oder ungültige Parameter ergeben `false` statt eines Absturzes. |
| [server/src/password-hash.test.ts](server/src/password-hash.test.ts) | geändert | Richtiges Passwort. Vier falsche Varianten, darunter Groß-/Kleinschreibung und ein Leerzeichen am Ende. Ein Hash mit älteren Parametern (N=1024) zeigt, dass die gespeicherten Parameter gelten. Fünf beschädigte Hashes und ungültige Parameter ohne Absturz. |
| [server/src/session-store.ts](server/src/session-store.ts) | neu | Sitzungen in SQLite (Tabelle `sessions`): `create` liefert einen zufälligen 32-Byte-Token, gespeichert wird nur dessen SHA-256-Hash mit Ablauf nach 8 Stunden. Dazu `findCustomerId` (nur gültige Sitzungen) und `delete` für das Abmelden. |
| [server/src/session-store.test.ts](server/src/session-store.test.ts) | neu | Anlegen und Finden, Speicherung nur als Hash, neuer Token pro Anmeldung, Grenze der 8 Stunden (gültig bis kurz davor, danach nicht mehr), unbekannter Token, Abmelden. |

**Sicherheitsdetail:** Ein Hash mit leerem Schlüsselteil hätte beim zeitkonstanten Vergleich jedes Passwort akzeptiert (leer gleich leer). `verifyPassword` verlangt deshalb exakt 64 Byte Schlüssel. Ein Test sichert das ab.

**Nächster Step 24 und eine kleine Planänderung:** Der Step „API Anmelden & Abmelden“ bräuchte etwa acht Dateien. Ich teile ihn auf, dadurch verschieben sich die folgenden Steps um eins bis Step 30:
- **Step 24 · Sperre & Kundensuche:**
  - Zähler für Fehlversuche mit steuerbarer Uhr: 5 Versuche in 15 Minuten, danach 15 Minuten gesperrt.
  - Der Kundenstamm bekommt die Suche per E-Mail für den Login (liefert Status und Passwort-Hash) und per ID für die Kontaktdaten der Willkommensseite.
  - Jeweils mit Tests, etwa vier Dateien.
- **Step 25 · API Anmelden & Abmelden:**
  - Router `POST`/`GET`/`DELETE /api/session` mit Cookie, Einbau in `app.ts`.
  - Server-Test über den ganzen Ablauf: registrieren → aktivieren → anmelden → Daten abrufen → abmelden.

Soll ich mit Step 24 weitermachen?


---

```md
weiter mit Step 24
```

---

**Plan für Step 24:**
- Neues Modul `login-throttle.ts`: zählt Fehlversuche je E-Mail und sperrt nach dem 5. Fehlversuch innerhalb von 15 Minuten für genau 15 Minuten. Eine erfolgreiche Anmeldung setzt den Zähler zurück.
- Der Kundenstamm bekommt `findCredentialsByEmail` (Login) und `findProfile` (Kontaktdaten ohne Passwort, F09).
- Tests zuerst.
- `progress.md` wird wie angekündigt umnummeriert.

Rot wie erwartet. Jetzt die Implementierung:

Grün: 258 Tests (8 neu), Typecheck ok. Jetzt `progress.md` umnummerieren und abhaken:

**Step 24 ist fertig:** 258 Tests grün (8 neu), Typecheck grün, Step 24 in [progress.md](docs/progress.md) abgehakt und die folgenden Steps umnummeriert (jetzt bis Step 30).

| Datei | Neu/geändert | Inhalt und Zweck |
|---|---|---|
| [server/src/login-throttle.ts](server/src/login-throttle.ts) | neu | Schutz vor Passwort-Raten (UC 1.5.3): Fehlversuche je E-Mail-Adresse, ohne Beachtung der Groß-/Kleinschreibung. Der 5. Fehlversuch innerhalb von 15 Minuten sperrt für genau 15 Minuten ab diesem Versuch. Ältere Fehlversuche verfallen, eine erfolgreiche Anmeldung setzt zurück. Die Zähler liegen im Arbeitsspeicher, wie im Plan. |
| [server/src/login-throttle.test.ts](server/src/login-throttle.test.ts) | neu | 4 Fehlversuche erlaubt, 5 sperren. Sperre exakt bis 15 Minuten nach dem 5. Versuch. Nur Versuche der letzten 15 Minuten zählen. Die Sperre gilt je Adresse. Zurücksetzen nach Erfolg. |
| [server/src/customer-store.ts](server/src/customer-store.ts) | geändert | `findCredentialsByEmail` liefert ID, Status und Passwort-Hash für den Login (F08). `findProfile` liefert die Kontaktdaten in Speicherform ohne Passwort für die Willkommensseite (F09) und nutzt dafür den gemeinsamen Typ aus `shared`. |
| [server/src/customer-store.test.ts](server/src/customer-store.test.ts) | geändert | Anmeldedaten per E-Mail (auch in Großbuchstaben) inklusive Status „aktiv“. Kontaktdaten per ID ohne Passwort. Jeweils auch der Fall „unbekannt“. |

**Nächster Step 25:** API zum Anmelden und Abmelden (F08).
- **Router `/api/session`:**
  - `POST` prüft in dieser Reihenfolge Sperre, Kunde, Passwort und Aktivierung. Ergebnis: 200 mit Sitzungs-Cookie, oder 401, 403 bzw. 429 mit den Texten aus dem Use-Case-Entwurf.
  - `GET` liefert die Kontaktdaten der angemeldeten Person oder 401.
  - `DELETE` beendet die Sitzung.
- **Cookie:** `HttpOnly` und `SameSite=Lax`. `Secure` wird automatisch gesetzt, sobald die App-Adresse mit `https` beginnt. Gesetzt wird das Cookie mit Express-Bordmitteln, gelesen mit einer kleinen eigenen Funktion. Das spart das Paket `cookie-parser`.
- **Unbekannte E-Mail:** Es wird trotzdem ein Hash berechnet, damit die Antwortzeit nichts verrät.
- **Einbau in `app.ts`:** Der Server-Gesamttest bekommt den Ablauf registrieren → aktivieren → anmelden → Daten abrufen → abmelden.

Das sind etwa fünf Dateien.

Soll ich mit Step 25 weitermachen?

---

```md
weiter mit Step 25
```

---

**Plan für Step 25:**
- Neuer Router `session.ts` für `POST`/`GET`/`DELETE /api/session`.
- Die Passwortprüfung läuft vor der Aktivierungsprüfung. So bekommt nur jemand mit dem richtigen Passwort den Hinweis „nicht aktiviert“, damit verrät die API noch weniger als im Plan angenommen.
- Einbau in `app.ts`, der Server-Gesamttest wird um Anmelden und Abmelden erweitert.
- Tests zuerst.

Rot wie erwartet: Router fehlt, `/api/session` antwortet mit 404. Jetzt Router und Einbau:

Grün: 271 Tests (13 neu), Typecheck ok. Weil sich der Server-Aufbau geändert hat, lasse ich auch die E2E-Tests laufen:

Port 3000 ist belegt, deshalb startet Playwright bewusst keinen zweiten Server. Ich prüfe, wer ihn belegt:

Ich sehe, dass auf Port 3000 bereits ein Dev-Server läuft und `server/data/` mit Datenbank und Postfach existiert – das habe ich nicht selbst gestartet. Ich lasse das unangetastet und führe die E2E-Tests später aus.

**Step 25 ist fertig:** 271 Tests grün (13 neu), Typecheck grün, Step 25 in [progress.md](docs/progress.md) abgehakt. Damit ist die Anmeldung auf dem Server komplett.

| Datei | Neu/geändert | Inhalt und Zweck |
|---|---|---|
| [server/src/session.ts](server/src/session.ts) | neu | `POST /api/session` prüft in dieser Reihenfolge: Sperre (429) → Passwort (401, auch bei unbekannter E-Mail mit Vergleichs-Hash) → Aktivierung (403) → Sitzung und Cookie (200 mit Kontaktdaten). `GET` liefert die Kontaktdaten der angemeldeten Person oder 401. `DELETE` beendet die Sitzung und löscht das Cookie. Das Cookie lese ich mit einer kleinen eigenen Funktion, gesetzt wird es mit Express-Bordmitteln. |
| [server/src/session.test.ts](server/src/session.test.ts) | neu | Cookie-Attribute (`HttpOnly`, `SameSite=Lax`, `Path=/`, 8 h, kein `Secure` bei http). `Secure` bei https. E-Mail ohne Beachtung von Groß-/Kleinschreibung und Leerzeichen. Identische 401 ohne Cookie. 403 nur mit richtigem Passwort. 429 nach 5 Fehlversuchen, auch mit richtigem Passwort. `GET` ohne Passwort-Hash. Drei ungültige Cookies. Abmelden. Ablauf nach 8 h. |
| [server/src/app.ts](server/src/app.ts) | geändert | Sitzungs-Speicher (gleiche SQLite-Datei), Fehlversuch-Sperre und Router eingebaut. |
| [server/src/app.test.ts](server/src/app.test.ts) | geändert | Der Gesamttest über den echten Server läuft jetzt so: registrieren → Link aus dem Postfach → aktivieren → anmelden → Kontaktdaten → abmelden → 401. |

**Abweichung vom Plan, zum Vorteil:** Der Hinweis „nicht aktiviert“ kommt erst, wenn das Passwort stimmt. Wer nur E-Mail-Adressen durchprobiert, erfährt also nicht, ob dazu ein unbestätigtes Konto existiert.

**Offen:** Die E-Mail-Liste konnte ich nicht ausführen, weil dein laufender Entwicklungs-Server Port 3000 belegt. Den habe ich nicht angefasst. Da er mit `--watch` läuft, hat er sich nach meinen Änderungen neu gestartet und kennt die Anmelde-API bereits. Die E2E-Tests hole ich nach, sobald Port 3000 frei ist, spätestens in Step 27.

**Nächster Step 26:** Die Anrede-Regel (F09) zieht nach `shared`. Neue Funktion `formatAddressee` in `shared/src/contact.ts`: „Herr Mustermann“, „Frau Mustermann“ oder „Max Mustermann“, mit Tests. Die Bestätigungsmail nutzt sie statt ihrer eigenen Kopie, ihre bestehenden Tests belegen, dass die Mailtexte gleich bleiben. Danach können Header und Willkommensseite dieselbe Regel verwenden. Das sind drei Dateien.

Soll ich mit Step 26 weitermachen?

---

```md
weiter mit Step 26
```

---

Kurze Korrektur zum letzten Bericht: Gemeint war „die **E2E-Tests** konnte ich nicht ausführen“, nicht „E-Mail-Liste“.

**Plan für Step 26:**
- `formatAddressee` in `shared/src/contact.ts` mit Tests.
- Die Bestätigungsmail verwendet die Funktion statt ihrer eigenen Kopie. Ihre bestehenden Tests sichern ab, dass die Mailtexte gleich bleiben.

Test zuerst.

Rot wie erwartet. Jetzt die Funktion in `shared` und die Umstellung der Mail:

Grün: 274 Tests. Die unveränderten Mail-Tests bestätigen die gleichen Texte, Typecheck ok. Ist Port 3000 inzwischen frei für die nachzuholenden E2E-Tests?

**Step 26 ist fertig:** 274 Tests grün (3 neu), Typecheck grün, Step 26 in [progress.md](docs/progress.md) abgehakt.

| Datei | Neu/geändert | Inhalt und Zweck |
|---|---|---|
| [shared/src/contact.ts](shared/src/contact.ts) | geändert | Neue Funktion `formatAddressee`: „Herr Mustermann“, „Frau Mustermann“, bei „Keine Angabe“ „Max Mustermann“ (UC 1.1.2.1, Personalisierung). Die Regel steht damit an einer Stelle für Mail, Header und Willkommensseite. |
| [shared/src/contact.test.ts](shared/src/contact.test.ts) | geändert | Alle drei Anreden. |
| [server/src/confirmation-mail.ts](server/src/confirmation-mail.ts) | geändert | Nutzt `formatAddressee`, die eigene Kopie ist entfernt. Die unveränderten Mail-Tests belegen, dass die Texte gleich bleiben. |

**E2E weiter offen:** Dein Entwicklungs-Server belegt noch Port 3000, deshalb habe ich die E2E-Tests wieder ausgelassen. Du kannst ihn beenden, wenn du mit Ausprobieren fertig bist. Die Tests laufen dann im nächsten Step automatisch mit.

**Nächster Step 27:** Die Anmeldeseite (F08) im Client.
- **`/anmelden` mit dem Formular:**
  - Felder „E-Mail-Adresse“ und „Passwort“ (Autofill `email`/`current-password`).
  - Der Button „Anmelden“ ist aktiv, sobald beide Felder ausgefüllt sind. Während der Prüfung erscheint „Du wirst angemeldet …“.
  - Bei 401, 403 und 429 zeigt die Seite den jeweiligen Server-Hinweis, dazu der Link „Noch kein Konto? Registrieren“.
  - Nach Erfolg geht es weiter zur Willkommensseite.
- **Route `/willkommen`:** Wie damals bei `/registrieren` lege ich sie vorerst nur mit der Überschrift an. Das ist nötig, weil Links und Weiterleitungen typgeprüft sind. Inhalt und Zugriffsschutz folgen in Step 29.
- Dazu Komponententests, etwa fünf Dateien.

Soll ich mit Step 27 weitermachen?

---

```md
weiter mit Step 27
```

---

**Plan für Step 27:**
- Neue `LoginPage.tsx` unter `/anmelden`: zwei Felder, der Button ist aktiv, sobald beide ausgefüllt sind. Angezeigt werden „Du wirst angemeldet …“, die Server-Hinweise bei 401/403/429 oder eine allgemeine Fehlermeldung. Nach Erfolg geht es zu `/willkommen`.
- `WelcomePage.tsx` vorerst nur mit Überschrift.
- Beide Routen kommen in `router.tsx`.
- Die allgemeine Fehlermeldung trage ich in F08 nach.
- Tests zuerst.

Rot wie erwartet. Jetzt Seiten und Routen:

Grün: 283 Tests (9 neu), Typecheck ok. Die E2E-Tests fallen weiter aus, weil Port 3000 belegt ist. Sichtprüfung der Anmeldeseite im Browser-Panel:

Auf Port 5173 läuft dein Dev-Server. Ich öffne die Anmeldeseite nur lesend zur Sichtprüfung und teste einen Login mit einer erfundenen Adresse, was deine Daten nicht beeinflusst.

Die Anmeldeseite funktioniert über deine laufenden Server: Der Hinweis „E-Mail-Adresse oder Passwort ist falsch“ erscheint. Fortschritt abhaken:

**Step 27 ist fertig:** 283 Tests grün (9 neu), Typecheck grün, Step 27 in [progress.md](docs/progress.md) abgehakt.

| Datei | Neu/geändert | Inhalt und Zweck |
|---|---|---|
| [client/src/LoginPage.tsx](client/src/LoginPage.tsx) | neu | `/anmelden`: Karte mit „E-Mail-Adresse“ und „Passwort“ (Autofill `email`/`current-password`). Der Button „Anmelden“ ist aktiv, sobald beide Felder ausgefüllt sind, während der Prüfung erscheint „Du wirst angemeldet …“. Server-Hinweise (401/403/429) oder die allgemeine Fehlermeldung werden als Alert angezeigt. Nach Erfolg geht es zu `/willkommen`, dazu der Link „Noch kein Konto? Registrieren“. |
| [client/src/LoginPage.test.tsx](client/src/LoginPage.test.tsx) | neu | Autofill-Kennzeichnung. Button-Freigabe (auch: nur Leerzeichen zählen nicht). Gesendete Daten und Weiterleitung. „Du wirst angemeldet …“. Alle drei Server-Hinweise. Unerwarteter Fehler. Link zur Registrierung. |
| [client/src/WelcomePage.tsx](client/src/WelcomePage.tsx) | neu | `/willkommen` vorerst nur mit der Überschrift „Willkommen“. |
| [client/src/router.tsx](client/src/router.tsx) | geändert | Routen `/anmelden` und `/willkommen`. |
| [docs/feature_08_anmeldung.md](docs/feature_08_anmeldung.md) | geändert | Allgemeine Fehlermeldung als abgeleiteter Hinweis ergänzt. |

**Im Browser geprüft:** über deine laufenden Dev-Server (5173 und 3000) mit einer erfundenen Adresse. Der Hinweis erscheint wie spezifiziert.

**E2E:** Deine Server belegen weiterhin beide Ports, deshalb sind die E2E-Tests noch offen.

**Nächster Step und eine kleine Planänderung:** Der Step „Header, Abmelden & Verlinkung“ berührt acht bis neun Dateien. Ich teile ihn auf, dadurch verschieben sich die folgenden Steps um eins bis Step 31:
- **Step 28 · Header & Abmelden:**
  - Der Header zeigt abgemeldet den Link „Anmelden“, angemeldet „Herr Mustermann“ (über `formatAddressee`) und den Button „Abmelden“.
  - Grundlage ist eine gemeinsame Sitzungsabfrage per TanStack Query (`GET /api/session`), die die Anmeldeseite nach dem Login aktualisiert.
  - „Abmelden“ beendet die Sitzung und führt zur Startseite.
- **Step 29 · Verlinkung:**
  - „Bereits ein Konto? Anmelden“ auf der Registrierungsseite.
  - „Jetzt anmelden“ statt „Zur Startseite“ auf der Aktivierungsseite.

Soll ich mit Step 28 weitermachen?

---

```md
weiter mit Step 28
```

---

**Plan für Step 28:**
- Neues `client/src/session.ts` mit einer gemeinsamen Sitzungsabfrage (`GET /api/session`, TanStack Query) und der Abmelde-Funktion.
- Der Header zeigt abgemeldet „Anmelden“, angemeldet „Herr Mustermann“ und „Abmelden“. Abmelden führt zur Startseite.
- Die Anmeldeseite legt den Kunden nach dem Login direkt in die Sitzungsabfrage, damit der Header sofort umspringt.

Weil der Header jetzt auf jeder Seite die Sitzung abfragt, müssen drei bestehende Tests diese Abfrage simulieren (Startseite, Anmeldung, Aktivierung). Das sind reine Test-Anpassungen, deshalb wird der Step mit etwa acht Dateien größer. Tests zuerst.

Jetzt die Test-Anpassungen: Anmeldung, Startseite und Aktivierung beantworten die Sitzungsabfrage des Headers mit „abgemeldet“. Der Login-Test bekommt zusätzlich die Header-Prüfung:

Rot wie erwartet: 4 neue Fälle, alle angepassten bestehenden Tests bleiben grün. Jetzt die Implementierung:

287 Tests grün (4 neu), Typecheck ok. Jetzt prüfe ich kurz visuell den Header auf deinem Dev-Server im abgemeldeten Zustand – den angemeldeten Zustand decken die Tests ab, ohne dass ich extra ein Konto in deinen Entwicklungsdaten anlegen muss.

Die drei roten 401-Einträge in der Konsole sind erwartungsgemäß, da `GET /api/session` für abgemeldete Nutzer wie in F08 festgelegt mit 401 antwortet und die Anfrage bei Fokuswechsel erneut läuft. Ich hake den Fortschritt entsprechend ab.

Step 28 ist abgeschlossen: 287 Tests grün, Typecheck grün, Header zeigt jetzt je nach Sitzungsstatus „Anmelden“ oder Anrede mit „Abmelden“ – im Browser verifiziert, E2E-Tests bleiben offen wegen der laufenden Server. Mir ist dabei eine Kleinigkeit aufgefallen, dazu habe ich noch eine Frage.

```
Für abgemeldete Besucher antwortet GET /api/session wie in F08 festgelegt mit 401. Browser protokollieren das auf jeder Seite als roten Konsolen-Eintrag („Failed to load resource: 401“). Die App funktioniert, aber das sieht bei der Fehlersuche wie ein Fehler aus. Soll ich das ändern?

200 mit customer: null (Recommended)
```

Entschieden: Abgemeldete bekommen `200` mit `{ customer: null }`. Das erledige ich als eigenen Step, weil es Server, Doku und Tests berührt. Die Verlinkung rückt dadurch einen Step nach hinten.

**Nächster Step 29 · Session-API ohne 401 für Abgemeldete:**
- **Server:** `GET /api/session` liefert ohne gültige Sitzung `200 { customer: null }`. Anpassung in `server/src/session.ts` sowie in `session.test.ts` und `app.test.ts`.
- **Client:** Die Sitzungsabfrage verarbeitet das schon heute korrekt als „abgemeldet“, der Code bleibt unverändert. Der Header-Test simuliert künftig die neue Antwort. Die übrigen Tests prüfen weiterhin, dass auch eine 401 als „abgemeldet“ gilt.
- **Doku:** F08 wird angepasst, `progress.md` bekommt die neue Nummerierung: 30 Verlinkung, 31 Willkommensseite, 32 Landing Page.

Das sind etwa sechs Dateien, meist einzeilige Änderungen.

Soll ich mit Step 29 weitermachen?

---

```md
weiter mit Step 29
```

---

**Plan für Step 29:** Zuerst die Tests auf den neuen Vertrag umstellen (Server-Router, Server-Gesamttest, Header-Test), dann `session.ts` im Server anpassen, danach F08-Doku und `progress.md`.

Rot wie erwartet (6 Fälle). Jetzt die Server-Änderung und die Doku:

Grün: 287 Tests, Typecheck ok. Dein Entwicklungs-Server hat die Änderung per `--watch` schon übernommen. Ich prüfe im Browser, dass die Sitzungsabfrage jetzt mit 200 antwortet:

Die Abfrage liefert jetzt 200 mit customer: null, allerdings zeigt die Netzwerkliste 249 Aufrufe von /api/session. Ich prüfe, ob der Header die Abfrage in einer Schleife wiederholt.

Keine Schleife gefunden — nur ein Aufruf pro Seitenaufruf, die 249 Einträge stammen von der langen Tab-Laufzeit mit vielen Aufrufen und Fokus-Aktualisierungen. Ich hake den Fortschritt ab und nummeriere neu.

**Step 29 ist fertig:** 287 Tests grün, Typecheck grün, Step 29 in [progress.md](docs/progress.md) abgehakt, die folgenden Steps sind neu nummeriert (30–32).

| Datei | Änderung |
|---|---|
| [server/src/session.ts](server/src/session.ts) | `GET /api/session` antwortet immer mit 200: angemeldet mit den Kontaktdaten, sonst mit `{ customer: null }`. 401 gibt es nur noch für falsche Anmeldedaten. |
| [server/src/session.test.ts](server/src/session.test.ts) | Ohne gültige Sitzung (kein, falsches oder fremdes Cookie), nach dem Abmelden und nach 8 h gilt jeweils `customer: null` mit Status 200. |
| [server/src/app.test.ts](server/src/app.test.ts) | Im Gesamtablauf gilt nach dem Abmelden `{ customer: null }`. |
| [client/src/AppShell.test.tsx](client/src/AppShell.test.tsx) | Der Header-Test simuliert die neue Antwort. Die Client-Abfrage selbst blieb unverändert, weil sie `null` schon korrekt als „abgemeldet“ behandelt. |
| [docs/feature_08_anmeldung.md](docs/feature_08_anmeldung.md) | API und Testfälle angepasst, die Entscheidung ist mit Begründung vermerkt. |

**Im Browser geprüft:** Dein Dev-Server liefert jetzt `200 { customer: null }`, damit verschwinden die roten Konsolen-Einträge. Außerdem habe ich nachgemessen, dass die Sitzungsabfrage nicht in einer Schleife läuft: ein Aufruf pro Seitenaufruf.

**Nächster Step 30:** Verlinkung (F08, UC 1.5.1 und 1.5.5).
- Die Registrierungsseite bekommt „Bereits ein Konto? Anmelden“ → `/anmelden`.
- Die Aktivierungsseite zeigt nach Erfolg „Jetzt anmelden“ statt „Zur Startseite“. Die F06-Doku wird entsprechend angepasst.
- Jeweils mit Test, etwa fünf Dateien.

Soll ich mit Step 30 weitermachen?

---

```md
weiter mit Step 30
```

---

**Plan für Step 30:**
- Die Registrierungsseite bekommt „Bereits ein Konto? Anmelden“, die Aktivierungsseite „Jetzt anmelden“ statt „Zur Startseite“.
- Weil die Registrierungsseite dadurch einen Router-Link enthält, rendern ihre Tests die Seite künftig in einem kleinen Test-Router.
- Die F06-Doku und der E2E-Ablauf (der bisher „Zur Startseite“ klickt) werden angepasst.
- Tests zuerst.

Im F05-Block der Registrierungstests steht `await` jetzt in einer nicht-asynchronen `beforeEach`-Funktion, deshalb ist die Datei gar nicht gelaufen. Ich korrigiere das:

Jetzt scheitern genau die zwei neuen Erwartungen, die umgebauten Tests laufen. Implementierung:

Grün: 288 Tests, Typecheck ok, auch für den angepassten E2E-Code. Kurze Sichtprüfung auf deinem Dev-Server und Port-Check für die E2E-Tests:

**Step 30 ist fertig:** 288 Tests grün (1 neu, 1 angepasst), Typecheck grün, Step 30 in [progress.md](docs/progress.md) abgehakt.

| Datei | Neu/geändert | Inhalt und Zweck |
|---|---|---|
| [client/src/RegistrationPage.tsx](client/src/RegistrationPage.tsx) | geändert | Unter dem Formular „Bereits ein Konto? **Anmelden**“ → `/anmelden` (UC 1.5.1). |
| [client/src/RegistrationPage.test.tsx](client/src/RegistrationPage.test.tsx) | geändert | Neuer Test für den Link. Die Seite wird jetzt in einem kleinen Test-Router gerendert, weil Router-Links einen Router brauchen. Header und Sitzungsabfrage sind dabei nicht beteiligt. |
| [client/src/ActivationPage.tsx](client/src/ActivationPage.tsx) | geändert | Nach erfolgreicher Aktivierung „Jetzt anmelden“ → `/anmelden` statt „Zur Startseite“ (UC 1.5.5). |
| [client/src/ActivationPage.test.tsx](client/src/ActivationPage.test.tsx) | geändert | Der Erfolgstest erwartet „Jetzt anmelden“ mit Ziel `/anmelden`. |
| [e2e/account.spec.ts](e2e/account.spec.ts) | geändert | Der E2E-Ablauf klickt nach der Aktivierung „Jetzt anmelden“ und erwartet die Anmeldeseite. |
| [docs/feature_06_kontoaktivierung.md](docs/feature_06_kontoaktivierung.md) | geändert | Erfolgsansicht und Annahme angepasst („Jetzt einkaufen“ → „Jetzt anmelden“). |

**Im Browser geprüft:** „Bereits ein Konto? Anmelden“ steht unter dem Formular. Den Test-Umbau hatte ich zunächst an einer Stelle fehlerhaft gemacht (`await` in einer nicht-asynchronen Funktion). Das habe ich gefunden, weil die Datei im Testlauf fehlte, und behoben.

**E2E:** Weiterhin offen, deine Dev-Server belegen die Ports. F08 hake ich erst ab, wenn der E2E-Ablauf mit der Willkommensseite (Step 31) gelaufen ist.

**Nächster Step 31:** Die Willkommensseite (F09).
- **Inhalt:** Überschrift „Willkommen, Herr Mustermann!“ (über `formatAddressee`) und die Karte „Deine Kontaktdaten“ mit Anrede, Name, Adresse, E-Mail und Telefon (nur wenn vorhanden). Das Passwort erscheint nie. Dazu der Link „Zur Startseite“.
- **Zugriffsschutz:** Wer nicht angemeldet ist, wird zu `/anmelden` umgeleitet und landet nach dem Login wieder hier.
  - Anders als in F09 geplant prüfe ich das in der Seite selbst statt im Router. Die Router-Variante würde den Aufbau des Routers und drei bestehende Tests ändern, das Verhalten für Kunden ist gleich. F09 passe ich entsprechend an.
- **E2E:** Der Ablauf wird verlängert: aktivieren → „Jetzt anmelden“ → Anmeldung → Willkommensseite → Abmelden. Außerdem wird `/willkommen` ohne Anmeldung auf die Anmeldung umgeleitet.

Das sind etwa fünf Dateien.

Soll ich mit Step 31 weitermachen?

---

```md
weiter mit Step 31
```

---

**Plan für Step 31:**
- `WelcomePage` mit persönlicher Begrüßung, der Karte „Deine Kontaktdaten“ und „Zur Startseite“. Ohne Anmeldung leitet sie zu `/anmelden` weiter.
- Neue Komponententests.
- Der E2E-Ablauf wird bis zum Abmelden verlängert.
- Die F09-Doku bekommt die angekündigte Anpassung zum Zugriffsschutz.
- Tests zuerst.

Rot wie erwartet (7 Fälle). Jetzt die Seite:

Die 7 Willkommensseiten-Tests laufen durch, aber zwei Login-Tests schlagen fehl, weil die Simulation nach dem Login weiterhin „abgemeldet“ meldet statt den Kunden zu liefern. Ich passe die Simulation an den neuen Vertrag (`200 { customer: null }`) an.

Alle 295 Tests grün, Typecheck ok. Der Kommentar in der Login-Test-Simulation stimmt nicht mehr, den korrigiere ich:

Jetzt der verlängerte E2E-Ablauf bis zum Abmelden und die Prüfung des Zugriffsschutzes:

Ich hake Step 31 ab, lasse F08 und F09 aber offen, bis die E2E-Tests für Anmeldung und Willkommensseite tatsächlich erfolgreich durchlaufen — bisher konnten sie wegen des belegten Ports 3000 nicht getestet werden.

Step 31 ist abgeschlossen: 295 Tests grün, Typecheck sauber, WelcomePage inklusive Zugriffsschutz und E2E-Abdeckung umgesetzt, dokumentiert und in progress.md abgehakt. Die E2E-Tests für F08/F09 konnte ich allerdings nicht ausführen, da dein Dev-Server auf Port 3000 läuft und Playwright einen eigenen Server benötigt – diese beiden habe ich deshalb noch nicht abgehakt.

Freigegeben. Zuerst schaue ich mir den Prozessbaum an. `--watch` würde einen einzeln beendeten Server bei der nächsten Dateiänderung neu starten, deshalb muss der Watcher mit beendet werden:

Port 3000 ist frei, der Dev-Server samt Watcher ist beendet. Jetzt der vollständige E2E-Lauf:

Alle 11 E2E-Tests grün (4,4 s), auch der komplette Ablauf mit Anmeldung, Willkommensseite und Abmelden. Damit sind F08 und F09 auf allen Ebenen getestet:

Die E2E-Tests sind nachgeholt: **11 von 11 grün**. **F08 Anmeldung** und **F09 Willkommensseite** sind in [progress.md](docs/progress.md) abgehakt. Offen ist nur noch F07.

- Dein Server-Dev-Prozess ist beendet, deine Daten unter `server/data/` sind unberührt, weil die E2E-Tests eine eigene Temp-Datenbank nutzen. Neu starten:
  ```bash
  npm run dev -w server
  ```
- Dein Client-Dev-Server auf Port 5173 läuft weiter. Playwright hat ihn mitbenutzt.
- Seit dem Plan-Commit sind die Steps 23–31 noch nicht committet. Sag Bescheid, falls ich das jetzt tun soll.

**Nächster und letzter Step 32:** Die Landing Page (F07). Die Startseite wird wie in F07 geplant ausgebaut:
- **Hero:** zusätzlich zum bestehenden Button ein Rahmen-Button „Anmelden“, angemeldet stattdessen „Zu meinem Konto“.
- **Werte-Leiste:** vier Werte mit Linien-Icons.
- **„So einfach geht's“:** drei nummerierte Schritte.
- **Vorteile:** vier Kacheln aus Folie 8.
- **Keine Produktfotos,** dafür ein dezenter Farbverlauf in `brand`.
- **Tests:** Komponententests und E2E-Tests: „Anmelden“ führt zum Login, angemeldet führt „Zu meinem Konto“ zur Willkommensseite.

Das sind etwa vier Dateien.

Soll ich mit Step 32 weitermachen?

---

```md
weiter mit Step 32
```

---

**Plan für Step 32:**
- `HomePage` wird zur Landing Page: Hero mit „Anmelden“ bzw. angemeldet „Zu meinem Konto“, Werte-Leiste, „So einfach geht's“ und Vorteilskacheln, Icons als Inline-SVG und ein dezenter Farbverlauf.
- Die Komponententests werden erweitert, der E2E-Ablauf bekommt die Landing-Page-Prüfungen.
- Weil der Header auf der Startseite jetzt ebenfalls „Anmelden“ zeigt, grenzen Tests die Suche auf Hero bzw. Header ein.
- Zum Schluss setze ich den Status in F07–F09 von „geplant“ auf „umgesetzt“.
- Tests zuerst.

Rot wie erwartet: 5 neue F07-Fälle, die F02-Tests bleiben grün. Jetzt die Landing Page:

Grün: 300 Tests, Typecheck ok. Jetzt der E2E-Ablauf. Auf der Startseite gibt es „Anmelden“ jetzt zweimal (Header und Hero), deshalb grenze ich die Suche ein:

12 von 12 E2E-Tests grün, Typecheck ok. Jetzt die Sichtprüfung der Landing Page auf deinem Client-Dev-Server, auf dem Desktop hell und dunkel, dazu die mobile Breite:

Der zweite Screenshot wirkt abgeschnitten – unter „So einfach geht's“ fehlen Texte und Vorteile. Ich prüfe, ob das ein echter Layout-Fehler ist oder der Screenshot nur zu früh aufgenommen wurde.

Das war nur ein zu früher Screenshot, das Layout stimmt: drei Schritte und vier Vorteilskacheln. Jetzt der dunkle Modus und die mobile Ansicht:

Dunkel wirkt die Seite wie die Vorlage, inklusive Farbverlauf. Mobil ist sie einspaltig ohne horizontales Scrollen. Ich setze Viewport und deine Theme-Wahl zurück und schließe die Doku ab:

**Step 32 ist fertig, damit sind alle 32 Steps und alle 9 Features abgeschlossen.** 300 Unit- und Komponententests grün, 12 E2E-Tests grün, Typecheck grün. In [progress.md](docs/progress.md) ist kein Punkt mehr offen.

| Datei | Neu/geändert | Inhalt und Zweck |
|---|---|---|
| [client/src/HomePage.tsx](client/src/HomePage.tsx) | geändert | Landing Page mit Hero und dezentem Farbverlauf in `brand`. Abgemeldet: „Neues Kundenkonto erstellen“ und der Rahmen-Button „Anmelden“. Angemeldet: „Zu meinem Konto“. Dazu Werte-Leiste (4 Linien-Icons), „So einfach geht's“ (3 nummerierte Schritte) und „Deine Vorteile auf einen Blick“ (4 Kacheln). Icons als Inline-SVG, nur Tokens. |
| [client/src/HomePage.test.tsx](client/src/HomePage.test.tsx) | geändert | Neu (F07): „Anmelden“ im Hero, angemeldet „Zu meinem Konto“ ohne die beiden Einstiege, 4 Werte in fester Reihenfolge, 3 Schritte und 4 Vorteile mit den Texten aus F07. |
| [e2e/account.spec.ts](e2e/account.spec.ts) | geändert | Angemeldet führt die Startseite über „Zu meinem Konto“ zur Willkommensseite. Neuer Test: „Anmelden“ im Hero öffnet den Login. „Anmelden“ gibt es jetzt in Header und Hero, deshalb suchen die Tests gezielt im jeweiligen Bereich. |
| F07–F09 Doku | geändert | Status „umgesetzt“. |

**Im Browser geprüft:** hell, dunkel und mobil (375 px, einspaltig, kein horizontales Scrollen). Einmal wirkte die Seite abgeschnitten, das war nur ein zu früh aufgenommener Screenshot, gegengeprüft über die Maße der Seite. Viewport und deine Theme-Wahl sind zurückgesetzt.

**Noch offen:**
- **Nicht committet:** Die Steps 23–32 liegen noch unversioniert vor. Soll ich committen?
- **Fachlich:**
  - Die Freigabe des Use-Case-Entwurfs.
  - Die Bildrechte für Sneaker-Fotos.
  - Die Vorteilstexte, die Funktionen späterer Releases versprechen.
  - „Passwort vergessen“ als nächstes Feature.
- **Aufräumen, optional:** Button- und Feldstile stehen mehrfach in den Seiten. Ein kleiner Step könnte sie in gemeinsame UI-Bausteine zusammenführen.
- **Dein Server-Dev-Prozess** ist seit dem E2E-Lauf beendet. Neu starten:
  ```bash
  npm run dev -w server
  ```

  ---

 ```md
  commit das bitte
  ```

  ---

Alle Änderungen gehören zu den Steps 23–32. Dazu kommt deine aktualisierte Transkript-Datei, die ich wie beim letzten Mal mitnehme:

Committet als `a36bb13` („F07–F09: Landing Page, Anmeldung und Willkommensseite“) auf `main`, mit 36 Dateien. Das umfasst die Steps 23–32 und, wie beim letzten Commit, deine aktualisierte Transkript-Datei. Der Arbeitsbaum ist sauber, gepusht ist nichts, weil es kein Remote gibt.



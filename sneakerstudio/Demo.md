# Demo: Tests mit Claude Code entwerfen und mit Mutationstests prüfen

Die Anleitung zeigt am Feature F04 „Passwort festlegen“, wie mit den Skills, dem Subagenten und den Leitplanken dieses Repositorys Tests entstehen – und wie man anschließend prüft, ob diese Tests Fehler überhaupt bemerken.

- **Teil A:** von der Feature-Datei zu Testfällen, Gherkin-Szenarien und automatisierten Tests
- **Teil B:** Mutationstests, um die Tests selbst zu prüfen

Voraussetzungen: `npm install` ist gelaufen, `npm test` ist grün, Claude Code ist im Projektordner gestartet (`claude`).

## Die Bausteine

| Baustein | Ort | Aufgabe |
|---|---|---|
| Regeln | `CLAUDE.md` | Arbeitszyklus je Step: erkunden, planen, Freigabe, umsetzen, prüfen, berichten |
| Spezifikation | `docs/feature_xx_*.md` | Quelle der Wahrheit für Regeln, Hinweistexte und geforderte Testfälle |
| Skill `testentwurf` | `.claude/skills/testentwurf/` | wählt das Testentwurfsverfahren und liefert Testfälle als CSV, geprüft per Skript |
| Skill `testfaelle-grenzwerte` | `.claude/skills/testfaelle-grenzwerte/` | Äquivalenzklassen und Grenzwerte für einzelne Eingabefelder |
| Skill `gherkin-stil` | `.claude/skills/gherkin-stil/` | überführt freigegebene Testfälle in Gherkin im Teamstil |
| Subagent `test-reviewer` | `.claude/agents/test-reviewer.md` | prüft das Ergebnis unabhängig gegen die Feature-Datei, nur lesend |
| Hooks | `.claude/hooks/` | verhindern und melden Änderungen an bestehenden Tests |
| Berechtigungen | `.claude/settings.json` | Testbefehle erlaubt; Tests, `CLAUDE.md`, `.claude/` und `git push` gesperrt |

Skills lädt Claude selbst, wenn die Aufgabe zur Beschreibung passt. Mit `/skill-name` ruft man sie gezielt auf.

---

## Teil A: Tests erzeugen

### Schritt 1: Testfälle aus der Feature-Datei entwerfen

Eingabe im Chat:

```
/testentwurf Entwirf Testfälle für docs/feature_04_passwort.md, Tabelle „Felder & Regeln“.
```

Was passiert:

1. Der Skill wählt die Technik anhand der Anforderung. Bei „mind. 8 Zeichen“ sind das Grenzwertanalyse und Äquivalenzklassen; er lädt nur die passenden Anleitungen aus `references/`.
2. Claude gibt das Modell aus (Klassen und Grenzen) und **hält an**. Hier prüft der Mensch: Stimmen die Klassen? Fehlt eine Regel?
3. Nach der Freigabe entstehen die Testfälle als CSV mit der Kopfzeile `ID;Klasse;Eingabe;Soll-Laenge;Erwartung;Quelle`.
4. Das mitgelieferte Skript prüft Längen und Pflichtspalten:

   ```bash
   python3 .claude/skills/testentwurf/scripts/pruefe_testdaten.py testfaelle/feature_04.csv --nur-befunde
   ```

   Exit-Code 0 heißt: geprüft. Bei Exit-Code 1 korrigiert Claude die CSV und lässt das Skript erneut laufen.
5. Zum Schluss listet Claude Annahmen und offene Fragen auf, statt Lücken stillschweigend zu füllen.

Warum das Skript? Sprachmodelle zählen Zeichen unzuverlässig. Ob `Abcde1!` wirklich 7 Zeichen hat, entscheidet deshalb ein Werkzeug und nicht das Modell.

Für ein einzelnes Eingabefeld ohne Zustände oder Regelkombinationen genügt der schlankere Skill:

```
/testfaelle-grenzwerte
<anforderung>
Passwort: mind. 8 Zeichen, mind. ein Sonderzeichen, ein Großbuchstabe und eine Ziffer
</anforderung>
```

### Schritt 2: Testfälle in Gherkin überführen (optional)

```
/gherkin-stil Überführe die freigegebenen Testfälle aus testfaelle/feature_04.csv in eine Feature-Datei.
```

Ergebnis: Szenarien mit `# language: de`, genau einem `Wenn` je Szenario, Grenzwerte als `Szenariogrundriss` mit `Beispiele`-Tabelle, dazu die Zuordnung Testfall → Szenario. Der Skill arbeitet nur auf freigegebenen Testfällen und erfindet keine.

### Schritt 3: Tests automatisieren

```
Setze die freigegebenen Testfälle für F04 als Unit-Tests in shared um.
Lege dafür eine neue Testdatei an. Folge dem Arbeitszyklus aus CLAUDE.md.
```

Claude liest zuerst Feature-Datei und Code, legt dann einen Plan vor (Dateiliste, Testfälle, Annahmen, offene Fragen) und setzt erst nach der Freigabe um. Danach laufen `npm test` und `npm run typecheck`.

Dabei greifen die Leitplanken:

- **Neue** Testdateien darf Claude anlegen. **Bestehende** Tests ändern, löschen oder überspringen blockiert `protect-tests.sh`.
- Weicht am Ende einer Antwort eine Testdatei vom letzten Commit ab, meldet das `check-tests-unchanged.sh` und Claude muss es dem Menschen berichten.
- Wird ein Test rot, entscheidet nicht Claude, ob Test oder Code falsch ist. Es meldet Datei, Test, Zitat aus der Feature-Datei und einen Vorschlag.
- E2E-Tests unter `e2e/` entstehen in einer eigenen Sitzung aus der Spezifikation, damit sie nicht von der Implementierung abgeschaut werden.

### Schritt 4: Unabhängiges Review

```
Lass den Subagenten test-reviewer den Step gegen docs/feature_04_passwort.md prüfen.
```

Der Subagent kennt den Verlauf der Hauptsitzung nicht und hat nur Lesewerkzeuge. Er vergleicht jede Regel, jeden Hinweistext und jeden geforderten Testfall der Feature-Datei mit dem Code und liefert eine Befundtabelle, „Nicht prüfbar“ und ein Fazit. Typische Befunde: fehlender Testfall, Test ohne echte Assertion, Hinweistext nicht wortgleich, Code ohne Bezug zur Spezifikation. Die Freigabe bleibt beim Menschen.

### Schritt 5: Entwürfe im Batch vergleichen (optional)

```bash
tools/testfaelle-batch.sh 3 "docs/feature_0[34]_*.md"
```

Das Skript ruft Claude nicht interaktiv auf (`claude -p`) und erzeugt je Feature-Datei mehrere Entwürfe mit dem versionierten Prompt `prompts/testfaelle_v1.md`. Anschließend prüft es deterministisch, ob jeder zitierte Hinweistext wirklich in der Spezifikation steht, und schreibt Kosten, Anzahl der Testfälle und Befunde nach `out/testfaelle/…/protokoll.csv`. So sieht man, wie stark die Ergebnisse zwischen Läufen streuen. Modell und Zugang (Bedrock-Profil) stehen im Kopf des Skripts und sind an die eigene Umgebung anzupassen.

---

## Teil B: Die Tests mit Mutationstests prüfen

### Die Idee

Grüne Tests sagen nur, dass der Code die Tests besteht. Ob die Tests einen Fehler **bemerken würden**, zeigt ein Mutationstest: Ein Skript baut absichtlich je einen kleinen Fehler in den Code ein (einen Mutanten), etwa `>=` statt `>`, und lässt die Tests laufen.

- Tests werden rot: Mutant **getötet**, die Tests prüfen diese Stelle.
- Tests bleiben grün: Mutant **überlebt**, hier fehlt ein Testfall oder eine Assertion ist zu schwach.

Das ergänzt den `test-reviewer`: Er liest und beurteilt, der Mutationstest führt aus und misst.

### Schritt 1: Das Skript von Claude erzeugen lassen

```
Erstelle tools/mutation-test.mjs: einen Mutationstest ohne neue Abhängigkeit, nur mit Node-Bordmitteln.
Aufruf: node tools/mutation-test.mjs <quelldatei> <testdatei>
- Vorab die Tests unverändert laufen lassen; sind sie rot, abbrechen.
- Je Mutant genau eine Stelle ändern: Grenzen (>= zu >), Vergleiche (=== zu !==),
  Logik (&& zu ||), Wahrheitswerte, Zahlen + 1. Kommentar- und Importzeilen auslassen.
- Je Mutant `npx vitest run <testdatei>` ausführen und „getötet“ oder „ÜBERLEBT“ ausgeben.
- Die Quelldatei in jedem Fall wiederherstellen, auch bei Abbruch.
- Exit-Code 1, wenn Mutanten überleben. Überlebende mit Zeile, vorher und nachher auflisten.
Testdateien werden nie verändert. Folge dem Arbeitszyklus aus CLAUDE.md.
```

Die Vorgaben im Prompt sind die Punkte, auf die es ankommt: Ausgangslage grün, eine Änderung je Mutant, sicheres Wiederherstellen, maschinenlesbarer Exit-Code. Stryker wäre die fertige Alternative, ist aber eine neue Abhängigkeit und müsste laut `CLAUDE.md` vorher abgestimmt werden.

### Schritt 2: Wie das Ergebnis aussehen kann

Diese Fassung wurde in einer Kopie des Projekts gegen `shared/src/password.ts` ausgeführt. Sie ist als Referenz gedacht und liegt nicht im Repository.

```js
// tools/mutation-test.mjs
// Mutationstest ohne Zusatzbibliothek: verändert eine Quelldatei jeweils an genau einer Stelle
// und prüft, ob die zugehörigen Tests den Fehler bemerken.
// Aufruf: node tools/mutation-test.mjs <quelldatei> <testdatei>
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const [sourceFile, testFile] = process.argv.slice(2);
if (!sourceFile || !testFile) {
  console.error('Aufruf: node tools/mutation-test.mjs <quelldatei> <testdatei>');
  process.exit(2);
}

// Mutationsoperatoren: [Name, Suchmuster, Ersetzung]
const OPERATORS = [
  ['Grenze >= zu >', />=/g, () => '>'],
  ['Grenze <= zu <', /<=/g, () => '<'],
  ['Vergleich === zu !==', /===/g, () => '!=='],
  ['Vergleich !== zu ===', /!==/g, () => '==='],
  ['Logik && zu ||', /&&/g, () => '||'],
  ['Logik || zu &&', /\|\|/g, () => '&&'],
  ['Wahrheitswert true zu false', /\btrue\b/g, () => 'false'],
  ['Wahrheitswert false zu true', /\bfalse\b/g, () => 'true'],
  ['Zahl + 1', /\b\d+\b/g, (n) => String(Number(n) + 1)],
];

const original = readFileSync(sourceFile, 'utf8');
const restore = () => writeFileSync(sourceFile, original);
process.on('SIGINT', () => {
  restore();
  process.exit(130);
});

const testsPass = () =>
  spawnSync('npx', ['vitest', 'run', testFile], { encoding: 'utf8' }).status === 0;

// Kommentar- und Importzeilen werden nicht mutiert.
const isCode = (line) => !/^\s*(\/\/|\*|\/\*|import\b)/.test(line);

const lines = original.split('\n');
const mutants = [];
lines.forEach((line, index) => {
  if (!isCode(line)) return;
  for (const [name, pattern, replace] of OPERATORS) {
    for (const match of line.matchAll(pattern)) {
      const mutated =
        line.slice(0, match.index) + replace(match[0]) + line.slice(match.index + match[0].length);
      mutants.push({
        name,
        lineNumber: index + 1,
        before: line.trim(),
        after: mutated.trim(),
        content: [...lines.slice(0, index), mutated, ...lines.slice(index + 1)].join('\n'),
      });
    }
  }
});

if (!testsPass()) {
  console.error('Abbruch: Die Tests sind schon ohne Mutation rot.');
  process.exit(2);
}

const survivors = [];
try {
  for (const mutant of mutants) {
    writeFileSync(sourceFile, mutant.content);
    const killed = !testsPass();
    console.log(`${killed ? 'getötet ' : 'ÜBERLEBT'}  ${sourceFile}:${mutant.lineNumber}  ${mutant.name}`);
    if (!killed) survivors.push(mutant);
  }
} finally {
  restore();
}

console.log(
  `\nMutanten: ${mutants.length}, getötet: ${mutants.length - survivors.length}, überlebt: ${survivors.length}`,
);
for (const s of survivors) {
  console.log(`\n${sourceFile}:${s.lineNumber}  ${s.name}\n  vorher:  ${s.before}\n  nachher: ${s.after}`);
}
process.exit(survivors.length > 0 ? 1 : 0);
```

### Schritt 3: Ausführen und lesen

```bash
node tools/mutation-test.mjs shared/src/password.ts shared/src/password.test.ts
```

Ausgabe des Laufs gegen den aktuellen Stand:

```
getötet   shared/src/password.ts:5  Zahl + 1
ÜBERLEBT  shared/src/password.ts:10  Zahl + 1
getötet   shared/src/password.ts:10  Zahl + 1
getötet   shared/src/password.ts:14  Grenze >= zu >
getötet   shared/src/password.ts:14  Logik && zu ||
getötet   shared/src/password.ts:14  Zahl + 1
getötet   shared/src/password.ts:15  Logik && zu ||
getötet   shared/src/password.ts:16  Logik && zu ||
getötet   shared/src/password.ts:22  Vergleich === zu !==

Mutanten: 9, getötet: 8, überlebt: 1

shared/src/password.ts:10  Zahl + 1
  vorher:  const DIGIT = /[0-9]/;
  nachher: const DIGIT = /[1-9]/;
```

Lesart:

- Die Grenze „mindestens 8 Zeichen“ ist sauber getestet: `>=` zu `>` und `8` zu `9` werden getötet. Das ist der Nutzen der Grenzwertanalyse aus Teil A (7 und 8 Zeichen).
- Ein Mutant überlebt: Mit `/[1-9]/` gälte die `0` nicht mehr als Ziffer, und kein Test bemerkt es. Es fehlt ein Testfall mit einem Passwort, dessen einzige Ziffer die `0` ist.

### Schritt 4: Überlebende Mutanten auswerten

```
Werte die überlebenden Mutanten aus. Je Mutant: Welche Regel aus docs/feature_04_passwort.md
ist betroffen (Zitat)? Fehlt ein Testfall, oder ist der Mutant gleichwertig zum Original?
Schlage Testfälle vor, ändere nichts.
```

Drei mögliche Ergebnisse je Mutant:

1. **Testfall fehlt.** Claude schlägt ihn vor, der Mensch gibt frei, der Test kommt in eine **neue** Testdatei (bestehende sind gesperrt). Danach den Mutationstest wiederholen.
2. **Gleichwertiger Mutant.** Die Änderung verändert das Verhalten nicht; kein Test kann ihn töten. Begründet abhaken.
3. **Spezifikation schweigt.** Lässt sich die Erwartung nicht aus der Feature-Datei belegen, ist es eine Klärungsfrage an den Fachbereich und kein Testfall.

### Schritt 5: Als Mechanismus verankern

Damit Mutationstests nicht vom einzelnen Prompt abhängen, lässt sich das Vorgehen als Skill ablegen. Claude darf `.claude/` nicht ändern; die Datei legt der Mensch an, den Inhalt kann man sich von Claude im Chat entwerfen lassen:

```markdown
---
name: mutationstest
description: >-
  Prüft die Wirksamkeit vorhandener Tests mit Mutationstests. Verwenden, wenn nach einem Step
  beurteilt werden soll, ob die Tests einer Quelldatei Fehler bemerken, oder wenn ein
  Mutationsskript für eine Datei oder ein Feature erstellt oder erweitert werden soll.
---

# Mutationstest

1. Quelldatei und zugehörige Testdatei bestimmen; Feature-Datei lesen.
2. Fehlt tools/mutation-test.mjs: Skript nach Plan und Freigabe erstellen (nur Node-Bordmittel).
3. Passende Operatoren wählen: Grenzen bei Längen und Fristen, Logik bei kombinierten Regeln,
   Texte bei Hinweistexten. Neue Operatoren begründen.
4. Skript ausführen, nicht nachrechnen: node tools/mutation-test.mjs <quelle> <test>
5. Je überlebendem Mutanten: Regel der Feature-Datei zitieren; Testfall fehlt, gleichwertig
   oder Klärungsfrage. Nichts ändern, auf Freigabe warten.

Regeln: Testdateien nie verändern. Quelldatei nach dem Lauf unverändert (git status prüfen).
```

Aufruf danach: `/mutationstest shared/src/contact.ts`. Als Erweiterung kann der Arbeitszyklus in `CLAUDE.md` den Mutationstest als Prüfschritt nach `npm test` nennen; auch diese Änderung macht der Mensch.

### Stolpersteine

- **Hook-Fehlalarm.** `protect-tests.sh` blockiert Shell-Befehle, die eine Testdatei nennen und ein schreibendes Muster enthalten (`>`, `cp`, `tee`, `node -e` …). Den Mutationstest deshalb ohne Umleitung und ohne Pipe aufrufen. Wird ein Befehl blockiert, meldet Claude das und umgeht den Hook nicht.
- **Arbeitsverzeichnis.** Das Skript ändert die Quelldatei vorübergehend. Nach dem Lauf mit `git status` prüfen, dass nichts geändert zurückbleibt, und währenddessen weder Dev-Server noch andere Testläufe auf derselben Datei laufen lassen.
- **Laufzeit.** Je Mutant ein Testlauf. Immer gezielt eine Quelldatei mit ihrer Testdatei prüfen, nicht das ganze Projekt.
- **Grobe Operatoren.** Das Skript arbeitet mit Suchmustern, nicht mit dem Syntaxbaum. Es mutiert auch Zahlen in Texten und regulären Ausdrücken. Das ist für die Demo gewollt, erzeugt aber gelegentlich Mutanten ohne fachliche Bedeutung.
- **Kennzahl mit Maß.** Eine hohe Quote getöteter Mutanten ist kein Ziel an sich. Wertvoll ist die Liste der Überlebenden, weil sie auf konkrete Lücken zeigt.

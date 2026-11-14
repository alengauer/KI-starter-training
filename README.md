# KI-Unterstützung für effiziente Qualitätssicherung und smarte Softwaretests

Handout zur zweitägigen Inhouse-Präsenzschulung über den Einsatz generativer KI in Testanalyse, Testmanagement und Qualitätssicherung.

Die Schulung vermittelt einen ersten Zugang zum Thema: was ein Sprachmodell tut, wie es im Testumfeld sinnvoll eingesetzt wird, wie Ergebnisse zu bewerten sind und was rechtlich zu beachten ist. Vorkenntnisse zu KI oder Programmierung sind nicht erforderlich.

**Leitprinzip:** Die KI erzeugt schnell, der Mensch prüft gezielt. Jedes erzeugte Ergebnis wird geprüft, bevor es weiterverwendet wird.

## Inhalt dieses Ordners

### Foliensätze

| Datei | Thema |
|---|---|
| [Modul-0_Einstieg.pdf](Modul-0_Einstieg.pdf) | Einstieg, Ziele und Ablauf |
| [Modul-1_Grundlagen-und-zentrale-Begriffe.pdf](Modul-1_Grundlagen-und-zentrale-Begriffe.pdf) | KI, maschinelles Lernen, generative KI; wie ein Sprachmodell antwortet; Streuung und plausible Fehler; Prompt, Kontext, RAG, Agent |
| [Modul-2_Arbeiten-mit-dem-Modell.pdf](Modul-2_Arbeiten-mit-dem-Modell.pdf) | Wirksame Prompts für QS-Aufgaben, iteratives Verbessern, Annahmen offenlegen, Skills |
| [Modul-3_Potenziale-und-Grenzen-im-Softwaretesting.pdf](Modul-3_Potenziale-und-Grenzen-im-Softwaretesting.pdf) | Einsatzmöglichkeiten entlang des Testprozesses, realistische Erwartungen, Anforderungen prüfen |
| [Modul-4_KI-gestuetzte-Erstellung-von-Testfaellen-Schwerpunkt.pdf](Modul-4_KI-gestuetzte-Erstellung-von-Testfaellen-Schwerpunkt.pdf) | **Schwerpunkt:** Testfälle aus User Stories mit Äquivalenzklassen, Grenzwertanalyse, Entscheidungstabellen und Zustandsübergängen |
| [Modul-5_Integration-in-bestehende-Testprozesse.pdf](Modul-5_Integration-in-bestehende-Testprozesse.pdf) | Vom Modellergebnis zum verwertbaren Artefakt, Gherkin, Weg ins Testmanagementwerkzeug |
| [Modul-6_Ergebnisse-bewerten.pdf](Modul-6_Ergebnisse-bewerten.pdf) | Bewertung KI-generierter Testartefakte, Fehlermuster, Quellenangaben und Konfidenz, Gegenprüfung |
| [Modul-7_Rechtlicher-Rahmen.pdf](Modul-7_Rechtlicher-Rahmen.pdf) | Rechtliche Aspekte, insbesondere die KI-Verordnung der EU |
| [Modul-8_Eignung-fuer-die-eigenen-Projekte.pdf](Modul-8_Eignung-fuer-die-eigenen-Projekte.pdf) | Kriterien zur Auswahl von KI-Werkzeugen für den eigenen Testprozess |

### Arbeitsunterlagen

| Datei | Inhalt |
|---|---|
| [Teilnehmer-Unterlagen.pdf](Teilnehmer-Unterlagen.pdf) | Übungsanleitungen mit kopierfertigen Prompts, Anforderungstexte zum Fallbeispiel (Anhang A) und Vorlagen (Anhang B): Prüfprotokoll, SKILL.md, Bewertungsmatrix für KI-Werkzeuge, Kennzeichnung KI-unterstützter Artefakte |
| [Teilnehmer-Loesungsheft.pdf](Teilnehmer-Loesungsheft.pdf) | Lösungsskizzen, Lösungsschlüssel, typische Fehler und Diskussionspunkte zu allen Übungen. Für den besten Lerneffekt erst nach der jeweiligen Übung lesen. |
| [Prompt-Sammlung.pdf](Prompt-Sammlung.pdf) | 25 wiederverwendbare Prompt-Vorlagen für die Arbeit nach dem Kurs: Anforderungen prüfen, Testentwurf, Testdaten, Gherkin, Gegenprüfung, Fehlerberichte, Annahmen offenlegen, Skills |
| [OpenWebUI-Demos-Testen.md](OpenWebUI-Demos-Testen.md) · [PDF](OpenWebUI-Demos-Testen.pdf) | Zehn Demos zum Mitmachen im Chat (ohne Datei-Upload), jeweils mit vollständigem Prompt und der Schwäche, die sie sichtbar macht |

### Fallbeispiel

| Datei | Inhalt |
|---|---|
| [sneakerstudio.zip](sneakerstudio.zip) | Beispielprojekt **SneakerStudio** des fiktiven Unternehmens Schnürschuh & Collegen GmbH: Web-App für Kundenkonto-Erstellung, Passwort-Management, Kontoaktivierung und Anmeldung. Enthält Use-Case-Dokumentation, Feature-Spezifikationen, Quellcode mit Unit- und E2E-Tests sowie eine Claude-Code-Konfiguration mit Skills, Hooks und Subagent für den Testentwurf. Einstieg: `README.md` und `Demo.md` im Archiv. |

## Übungen im Überblick

| Übung | Thema |
|---|---|
| Mini-Übung | Streuung erleben |
| 1 | Vom schwachen zum starken Prompt |
| 1b | Einen eigenen Skill schreiben |
| 2 | Anforderungen prüfen |
| 3a | Äquivalenzklassen und Grenzwerte |
| 3b | Entscheidungstabelle |
| 3c | Zustandsübergänge |
| 4 | Testfälle in Gherkin überführen |
| 5 | Fehler in einem KI-Artefakt finden |
| 6 | Eigenen Anwendungsfall bewerten |
| Zusatz | Mensch als Harness |

Alle Übungen funktionieren allein durch Einfügen von Text in einen Chat, ohne Administratorrechte und ohne Datei-Upload.

## Hinweise

- **Ergebnisse streuen.** Antworten von Sprachmodellen unterscheiden sich je nach Modell, Systemprompt und Durchlauf. Ein eigenes Ergebnis kann vom Lösungsschlüssel abweichen und trotzdem richtig sein; maßgeblich ist, ob jede Aussage auf eine Fundstelle in der Anforderung zurückgeht.
- **Rechtsstand.** Die Inhalte zum rechtlichen Rahmen geben den Stand zum Zeitpunkt der Schulung wieder. Der Rechtsstand entwickelt sich schnell und ist vor eigener Verwendung zu prüfen.
- **Fallbeispiel und Daten.** SneakerStudio und die Schnürschuh & Collegen GmbH sind fiktiv, alle Testdaten sind synthetisch.

## Autor

Trainer: Andreas Lengauer · Stand: November 2026

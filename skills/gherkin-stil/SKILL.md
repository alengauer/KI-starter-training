---
name: gherkin-stil
description: >-
  Schreibt und prüft Gherkin-Szenarien im Teamstil: deutsche Schlüsselwörter mit
  "# language: de", deklarativ in Fachsprache, genau ein Wenn je Szenario,
  Szenariogrundriss mit Beispiele-Tabelle für Äquivalenzklassen und Grenzwerte,
  Tags mit Bezug auf Feature, Anforderung und Testfall. Verwenden, wenn Testfälle,
  Akzeptanzkriterien oder Use Cases in Gherkin, BDD-Szenarien oder eine
  .feature-Datei überführt werden sollen oder vorhandene Szenarien auf den
  Teamstil geprüft werden sollen.
---

# Gherkin im Teamstil

Ergebnis: eine Feature-Datei, die Fachbereich, Test und Automatisierung gleich lesen – und die Liste neu eingeführter Schritte.
Grundlage sind freigegebene Testfälle oder Akzeptanzkriterien. Fehlen sie, danach fragen; keine Testfälle erfinden.

## Stilregeln

1. Erste Zeile `# language: de`. Nur diese Schlüsselwörter: Funktionalität, Grundlage, Szenario, Szenariogrundriss, Beispiele, Angenommen, Wenn, Dann, Und, Aber.
2. Deklarativ: beschreiben, **was** fachlich geschieht, nicht **wie** geklickt wird. Keine Klickstrecken, keine Selektoren, keine Adressen, keine Wartezeiten.
3. Genau ein `Wenn` je Szenario. Mehrere Aktionen → mehrere Szenarien oder Vorbedingung in `Angenommen`.
4. Äquivalenzklassen und Grenzwerte als `Szenariogrundriss` mit `Beispiele`-Tabelle; Spalte `klasse` benennt die Klasse oder Grenze, Spalte `testfall` die Testfall-ID.
5. Tags:
   - an `Funktionalität`: Feature-ID, z. B. `@F03`
   - an jedem Szenario: Anforderungs-ID, z. B. `@UC-1.1.2.3`
   - an `Szenario`: zusätzlich Testfall-ID, z. B. `@TF-07`; bei `Szenariogrundriss` steht sie in der Spalte `testfall`
   - Szenarien, die auf einer Annahme beruhen: zusätzlich `@Annahme`
6. Hinweistexte wörtlich aus der Anforderung, in Anführungszeichen; Schreibweise nicht angleichen.
7. Vorhandene Schrittformulierungen wörtlich wiederverwenden. Neue Schritte am Ende auflisten.
8. Gemeinsame Vorbedingungen aller Szenarien in `Grundlage`.
9. Perspektive der Anwenderin oder des Anwenders in der Ich-Form („ich gebe … an“), Präsens.

## Ausgabe

1. Die Feature-Datei in einem Codeblock (`gherkin`).
2. „Neue Schritte“: Liste der Schritte, die nicht aus vorhandenen Formulierungen stammen.
3. „Zuordnung“: `| Testfall | Szenario oder Beispielzeile |` – jeder Testfall genau einmal.
4. „Offene Punkte“: Testfälle, die sich nicht deklarativ ausdrücken ließen, mit Grund.

## Prüfschritte vor der Ausgabe

- [ ] `# language: de` in der ersten Zeile, keine englischen Schlüsselwörter
- [ ] je Szenario genau ein `Wenn`
- [ ] keine Oberflächendetails (Button-Klicks, Felder per Selektor, Adressen)
- [ ] Tags vollständig; jeder Testfall genau einem Szenario oder einer Beispielzeile zugeordnet
- [ ] Hinweistexte wortgleich; gleiche Schritte gleich formuliert
- [ ] Beispiele-Tabellen: alle Platzhalter `<…>` haben eine Spalte

## Fallstricke

- Imperative Schritte („Wenn ich auf ‚Konto anlegen‘ klicke“) statt fachlicher Aussage („Wenn ich … angebe“).
- Erfundene Vorbedingungen, z. B. „Angenommen ich bin angemeldet“ bei einer Registrierung.
- `Dann` prüft Zwischenschritte statt des Ergebnisses.
- Gleiche Aussage unterschiedlich formuliert – jede Variante braucht eine eigene Schrittdefinition.
- Deutsch-englische Mischung von Schlüsselwörtern.
- Szenariogrundriss für Fälle mit unterschiedlichem erwarteten Verhalten: dann getrennte Grundrisse.

## Beispiel

```gherkin
# language: de
@F03
Funktionalität: Kontaktdaten bei der Registrierung erfassen
  Als neuer Benutzer möchte ich meine Kontaktdaten angeben,
  damit ich ein Kundenkonto anlegen kann.

  Grundlage:
    Angenommen ich erstelle ein neues Kundenkonto

  @UC-1.1.2.3
  Szenariogrundriss: Ungültige PLZ wird abgelehnt
    Wenn ich die PLZ "<plz>" mit dem Ort "<ort>" angebe
    Dann erhalte ich an der PLZ den Hinweis "Bitte gib Deine korrekte Postleitzahl ein"

    Beispiele:
      | plz    | ort    | klasse                          | testfall |
      | 9644   | Coburg | 4 Ziffern                       | TF-02    |
      | 964440 | Coburg | 6 Ziffern                       | TF-03    |
      | 12345  | Coburg | 5 Ziffern, nicht im Verzeichnis | TF-04    |
      | 80331  | Coburg | bekannt, passt nicht zum Ort    | TF-05    |

  @UC-1.1.2.3 @TF-01
  Szenario: Passende PLZ und Ort werden angenommen
    Wenn ich die PLZ "96444" mit dem Ort "Coburg" angebe
    Dann erhalte ich an der PLZ keinen Hinweis
```

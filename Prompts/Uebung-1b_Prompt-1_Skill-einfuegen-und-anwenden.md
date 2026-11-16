# Übung 1b – Prompt 1: Skill einfügen und anwenden

- Chat: neuer Chat (Weg ohne Skills-Freigabe)
- Enthalten: ein Beispiel-Skill zwischen `<skill>` und `</skill>` und UC 1.1.2.3 „Postleitzahl eingeben“ (Anhang A.1)
- Eigener Skill: den Text zwischen `<skill>` und `</skill>` durch die eigene SKILL.md (einschließlich Kopf) ersetzen; ohne eigenen Skill die Datei unverändert verwenden

Den Inhalt des Kastens vollständig kopieren.

```text
<skill>
---
name: testfaelle-eingabefelder
description: >-
  Leitet Testfälle für Formular-Eingabefelder mit Längen-, Zeichen- und
  Formatregeln nach Äquivalenzklassen und 2-Wert-Grenzwertanalyse ab.
  Verwenden, wenn aus einem Use Case oder aus Akzeptanzkriterien Testfälle
  für ein Eingabefeld erstellt werden sollen, z. B. Passwort oder Postleitzahl.
---
# Testfälle für Eingabefelder

Kontext: Testanalyse im Projekt SneakerStudio. Die Anforderung steht in
<anforderung> … </anforderung>. Fehlt sie, zuerst danach fragen.

## Vorgehen
1. Regeln des Felds mit wörtlicher Fundstelle auflisten (R1, R2, …).
2. Äquivalenzklassen bilden, gültige und ungültige (K1, K2, …).
3. Grenzwertanalyse (2-Wert) für jede Längen- oder Wertegrenze: Wert auf der
   Grenze und direkt daneben; bei fester Länge auf beiden Seiten.
4. Testfälle ableiten: Jeder Negativtest verletzt genau eine Regel,
   alle anderen Regeln sind erfüllt.

## Ausgabe
Teil A: Regeln und Klassen als nummerierte Liste.
Teil B: Tabelle mit genau diesen Spalten:
| ID | Klasse/Grenze | Eingabe | Zeichenanzahl | Erwartetes Ergebnis | Fundstelle |
IDs TF-01, TF-02, …; höchstens 15 Testfälle. Hängt das Feld von einem
anderen Feld ab (z. B. Passwort wiederholen, Ort), je Feld eine Spalte ergänzen.
Teil C: Annahmen und Klärungsfragen (A1, A2, …) mit betroffenen Testfällen.

## Regeln
- Nur Regeln verwenden, die in der Anforderung belegt sind.
- Hinweistexte nur wörtlich übernehmen; fehlt ein Text,
  „Hinweis (Text nicht spezifiziert)“ schreiben.
- Regeln, die Referenzdaten brauchen (z. B. „PLZ muss existieren“), als Annahme
  führen und nach den Referenzdaten fragen; keine Daten erfinden.

## Prüfschritte vor der Ausgabe
- Jede Klasse und jede Grenze hat mindestens einen Testfall.
- Zeichenanzahl jeder Eingabe Zeichen für Zeichen nachzählen, nicht schätzen.
- Jeder Testfall hat eine Fundstelle oder einen Verweis auf eine Annahme [A…].
</skill>

Wende den Skill oben an: Erstelle Testfälle für das Feld Postleitzahl.

<anforderung>
UC 1.1.2.3 Postleitzahl eingeben
User Story
- Als Kunde
- möchte ich die PLZ meines Wohnortes hinterlegen können,
- um die Adressdaten in meinem Kundenkonto zu vervollständigen.
Akzeptanzkriterien
Das Formular enthält unten stehende Daten und folgt den jeweiligen Regeln.
- das PLZ-Feld ist ein Pflicht-Eingabefeld
- nur Ziffern sind erlaubt
- die Eingabe muss aus 5 Zeichen bestehen
- die PLZ muss existieren und zum Ort passen
- der Speichern-Button wird nur aktiv, wenn die Eingabe valide ist
- ist die Eingabe nicht valide, erscheint ein Hinweis "Bitte gib Deine korrekte Postleitzahl ein"
</anforderung>
```

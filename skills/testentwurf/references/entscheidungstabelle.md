# Entscheidungstabellentest

Grundlage: ISTQB CTFL 4.0, Entscheidungstabellentest (decision table testing).

## Prinzip

- Für Regeln, bei denen die **Kombination** mehrerer Bedingungen die Reaktion bestimmt.
- Zeilen: Bedingungen (oben) und Aktionen (unten). Spalten: Entscheidungsregeln, je eine Kombination mit erwarteter Aktion.
- Einträge: J/N für Bedingungen, X für ausgelöste Aktionen, „–“ für „nicht relevant“.
- Vollständige Tabelle: alle Kombinationen. Nicht mögliche Kombinationen streichen und begründen; Spalten mit gleicher Aktion dürfen zusammengefasst werden, wenn eine Bedingung dort nicht relevant ist.
- Überdeckung = getestete Spalten / mögliche Spalten. Standard: jede Spalte ein Testfall.

## Vorgehen

1. Bedingungen und Aktionen wörtlich aus der Anforderung ableiten, mit Fundstelle.
2. Alle Kombinationen aufstellen; nicht mögliche und nicht relevante kennzeichnen.
3. Je Spalte die Aktion aus der Anforderung eintragen. **Regelt die Anforderung eine Spalte nicht: „?“ eintragen und Klärungsfrage stellen**, nicht raten.
4. Je Spalte einen Testfall mit konkreten Werten ableiten.
5. Formale Vorbedingungen (z. B. „PLZ hat 5 Ziffern“) gehören in die Äquivalenzklassen, nicht in die Tabelle.

## Beispiel: PLZ und Ort (F03)

Voraussetzung: PLZ formal gültig (5 Ziffern), Ort nicht leer. Laut F03: PLZ unbekannt → Hinweis an der PLZ; Ort unbekannt → Hinweis am Ort; beide bekannt, passen nicht → Hinweis an der PLZ.

| | R1 | R2 | R3 | R4 | R5 |
|---|---|---|---|---|---|
| B1 PLZ im Verzeichnis | N | N | J | J | J |
| B2 Ort im Verzeichnis | N | J | N | J | J |
| B3 PLZ und Ort passen zusammen | – | – | – | N | J |
| A1 Hinweis an der PLZ | ? | X | | X | |
| A2 Hinweis am Ort | ? | | X | | |
| A3 kein Hinweis | | | | | X |
| Testdaten | `12345` Atlantis | `12345` Coburg | `96444` Atlantis | `80331` Coburg | `96444` Coburg |

R1 ist nicht ausdrücklich geregelt (beide Hinweise? nur einer?) → Klärungsfrage an den Fachbereich.
B3 ist nur relevant, wenn B1 und B2 zutreffen; deshalb fünf statt acht Spalten.

## Fallstricke

- Kombinationen weglassen, weil sie „unwahrscheinlich“ wirken – gerade dort fehlen oft Regeln.
- Aktionen erfinden, wenn die Anforderung schweigt (R1).
- Zeitpunkt vergessen: Laut F03 erscheint der Hinweis nach Verlassen des Felds; Testschritte entsprechend formulieren.

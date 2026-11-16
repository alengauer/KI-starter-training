# Übung 4 – Prompt 1: Testfälle in Gherkin überführen

- Chat: neuer Chat
- Enthalten: geprüfte Testfalltabelle zu PLZ, Ort und E-Mail-Adresse mit 25 Testfällen (TF-01 bis TF-25), wie sie in Übung 3a entsteht; die Hinweistexte für den Ort (TF-14, TF-15) sind nach Klärung mit dem Fachbereich ergänzt
- Eigene Tabelle aus Übung 3a: kann den Text zwischen `<testfaelle>` und `</testfaelle>` ersetzen
- Die Angaben `<plz>`, `<ort>`, `<email>`, `<laenge>` und `<hinweis>` in Stilregel 7 gehören zum Gherkin und bleiben stehen

Den Inhalt des Kastens vollständig kopieren.

```text
Du bist Testanalyst in einem agilen Team. Überführe die unten eingefügten, bereits
geprüften Testfälle in Gherkin.

Kontext: Registrierung im Online-Shop SneakerStudio, Formular "Konto erstellen",
Felder PLZ, Ort und E-Mail-Adresse (Use Cases 1.1.2.3, 1.1.2.4, 1.1.2.5).

Stilregeln:
1. Deutsches Gherkin. Erste Zeile: # language: de. Nur deutsche Schlüsselwörter:
   Funktionalität, Grundlage, Szenario, Szenariogrundriss, Beispiele, Angenommen,
   Wenn, Dann, Und, Aber.
2. Deklarativ: fachliches Verhalten beschreiben. Keine Klicks, keine Feldbezeichner
   der Oberfläche, keine Wartezeiten.
3. Je Szenario genau ein Wenn-Schritt.
4. Testfälle mit gleichen Schritten, die sich nur in den Daten unterscheiden, als
   Szenariogrundriss zusammenfassen. Die Beispieltabelle erhält als erste Spalte
   "fall" mit der Äquivalenzklasse oder Grenze. Unterschiedliche Hinweistexte kommen
   in eine Spalte "hinweis".
5. Jedes Szenario und jeder Szenariogrundriss erhält ein Tag mit der Use-Case-ID,
   z. B. @UC-1.1.2.3 (ohne Leerzeichen).
6. Hinweistexte wortgleich aus den Testfällen übernehmen, einschließlich Groß- und
   Kleinschreibung. Keine Texte erfinden oder verändern.
7. Verwende ausschließlich diese Schrittformulierungen:
   - Angenommen ich erstelle ein neues Kundenkonto
   - Wenn ich die PLZ "<plz>" mit dem Ort "<ort>" angebe
   - Wenn ich die E-Mail-Adresse "<email>" angebe
   - Wenn ich eine ansonsten gültige E-Mail-Adresse mit <laenge> Zeichen angebe
   - Dann erhalte ich an der PLZ den Hinweis "<hinweis>"
   - Dann erhalte ich am Ort den Hinweis "<hinweis>"
   - Dann erhalte ich an der E-Mail-Adresse den Hinweis "<hinweis>"
   - Dann erhalte ich an PLZ und Ort keinen Hinweis
   - Dann erhalte ich an der E-Mail-Adresse keinen Hinweis
   Wird eine weitere Formulierung benötigt, verwende sie nicht, sondern liste sie
   nach dem Gherkin unter "Neue Schritte" auf.
8. Jeder eingegebene Testfall kommt genau einmal vor. Gib nach dem Gherkin eine
   Zuordnungstabelle aus: Testfall-ID | Szenario | Tabellenzeile.
9. Erfinde keine zusätzlichen Testfälle. Fehlt aus deiner Sicht etwas, nenne es
   unter "Offene Punkte".

Testfälle:
<testfaelle>
| ID | Anforderung | Technik/Klasse | Vorbedingung | Schritte | Testdaten | erwartetes Ergebnis | Priorität |
|---|---|---|---|---|---|---|---|
| TF-01 | UC 1.1.2.3, UC 1.1.2.4 | ÄK PLZ G1, Ort G2 | Formular „Konto erstellen“ geöffnet, übrige Felder gültig | PLZ und Ort eingeben, Feld verlassen | PLZ 96444, Ort Coburg | kein Hinweis an PLZ und Ort | hoch |
| TF-02 | UC 1.1.2.4 | ÄK Ort G2, Variante Bindestrich | Formular „Konto erstellen“ geöffnet, übrige Felder gültig | PLZ und Ort eingeben, Feld verlassen | PLZ 44575, Ort Castrop-Rauxel | kein Hinweis an PLZ und Ort | mittel |
| TF-03 | UC 1.1.2.4 | ÄK Ort G2, Variante Leerzeichen | Formular „Konto erstellen“ geöffnet, übrige Felder gültig | PLZ und Ort eingeben, Feld verlassen | PLZ 60311, Ort Frankfurt am Main | kein Hinweis an PLZ und Ort | mittel |
| TF-04 | UC 1.1.2.4 | ÄK Ort G2, Variante ß | Formular „Konto erstellen“ geöffnet, übrige Felder gültig | PLZ und Ort eingeben, Feld verlassen | PLZ 35390, Ort Gießen | kein Hinweis an PLZ und Ort | mittel |
| TF-05 | UC 1.1.2.4 | ÄK Ort G2, Variante Umlaut groß | Formular „Konto erstellen“ geöffnet, übrige Felder gültig | PLZ und Ort eingeben, Feld verlassen | PLZ 88662, Ort Überlingen | kein Hinweis an PLZ und Ort | mittel |
| TF-06 | UC 1.1.2.4 | ÄK Ort G2, Variante Kleinschreibung | Formular „Konto erstellen“ geöffnet, übrige Felder gültig | PLZ und Ort eingeben, Feld verlassen | PLZ 96444, Ort coburg | kein Hinweis an PLZ und Ort | niedrig |
| TF-07 | UC 1.1.2.3 | ÄK PLZ U1 leer | Formular „Konto erstellen“ geöffnet, übrige Felder gültig | PLZ und Ort eingeben, Feld verlassen | PLZ leer, Ort Coburg | Hinweis an der PLZ: „Bitte gib Deine korrekte Postleitzahl ein“ | hoch |
| TF-08 | UC 1.1.2.3 | ÄK PLZ U2, GWA B1 (4 Ziffern) | Formular „Konto erstellen“ geöffnet, übrige Felder gültig | PLZ und Ort eingeben, Feld verlassen | PLZ 9644 (4), Ort Coburg | Hinweis an der PLZ: „Bitte gib Deine korrekte Postleitzahl ein“ | hoch |
| TF-09 | UC 1.1.2.3 | ÄK PLZ U3, GWA B2 (6 Ziffern) | Formular „Konto erstellen“ geöffnet, übrige Felder gültig | PLZ und Ort eingeben, Feld verlassen | PLZ 964445 (6), Ort Coburg | Hinweis an der PLZ: „Bitte gib Deine korrekte Postleitzahl ein“ | hoch |
| TF-10 | UC 1.1.2.3 | ÄK PLZ U4 nicht nur Ziffern | Formular „Konto erstellen“ geöffnet, übrige Felder gültig | PLZ und Ort eingeben, Feld verlassen | PLZ 9644a, Ort Coburg | Hinweis an der PLZ: „Bitte gib Deine korrekte Postleitzahl ein“ | hoch |
| TF-11 | UC 1.1.2.3 | ÄK PLZ U5 5 Ziffern, nicht im Verzeichnis | Formular „Konto erstellen“ geöffnet, übrige Felder gültig | PLZ und Ort eingeben, Feld verlassen | PLZ 12345, Ort Coburg | Hinweis an der PLZ: „Bitte gib Deine korrekte Postleitzahl ein“ | hoch |
| TF-12 | UC 1.1.2.3 | ÄK PLZ U6 im Verzeichnis, passt nicht zum Ort | Formular „Konto erstellen“ geöffnet, übrige Felder gültig | PLZ und Ort eingeben, Feld verlassen | PLZ 80331, Ort Berlin | Hinweis an der PLZ: „Bitte gib Deine korrekte Postleitzahl ein“ | hoch |
| TF-13 | UC 1.1.2.4 | ÄK Ort U7 leer | Formular „Konto erstellen“ geöffnet, übrige Felder gültig | PLZ und Ort eingeben, Feld verlassen | PLZ 96444, Ort leer | Hinweis am Ort: „Bitte fülle alle Pflichtfelder aus“ | hoch |
| TF-14 | UC 1.1.2.4 | ÄK Ort U8 unzulässige Zeichen | Formular „Konto erstellen“ geöffnet, übrige Felder gültig | PLZ und Ort eingeben, Feld verlassen | PLZ 96444, Ort Coburg1 | Hinweis am Ort: „Der Ort darf nur Buchstaben, Leerzeichen und Bindestriche enthalten“ (nach Klärung festgelegt) | mittel |
| TF-15 | UC 1.1.2.4 | ÄK Ort U9 nicht im Verzeichnis | Formular „Konto erstellen“ geöffnet, übrige Felder gültig | PLZ und Ort eingeben, Feld verlassen | PLZ 96444, Ort Atlantis | Hinweis am Ort: „Bitte gib einen existierenden Ort in Deutschland ein“ (nach Klärung festgelegt) | mittel |
| TF-16 | UC 1.1.2.5 | ÄK E-Mail G3 | Formular „Konto erstellen“ geöffnet, übrige Felder gültig | E-Mail-Adresse eingeben, Feld verlassen | erika@example.de (16) | kein Hinweis an der E-Mail-Adresse | hoch |
| TF-17 | UC 1.1.2.5 | ÄK E-Mail G3, Variante Großbuchstaben | Formular „Konto erstellen“ geöffnet, übrige Felder gültig | E-Mail-Adresse eingeben, Feld verlassen | Erika@Example.DE (16) | kein Hinweis an der E-Mail-Adresse | niedrig |
| TF-18 | UC 1.1.2.5 | GWA E-Mail B3 Untergrenze | Formular „Konto erstellen“ geöffnet, übrige Felder gültig | E-Mail-Adresse eingeben, Feld verlassen | a@b.de (6) | kein Hinweis an der E-Mail-Adresse | hoch |
| TF-19 | UC 1.1.2.5 | GWA E-Mail B4 unter der Untergrenze, zugleich Kennung mit 1 Buchstaben | Formular „Konto erstellen“ geöffnet, übrige Felder gültig | E-Mail-Adresse eingeben, Feld verlassen | a@b.d (5) | Hinweis an der E-Mail-Adresse: „Bitte gib eine gültige E-Mail-Adresse ein“ | mittel |
| TF-20 | UC 1.1.2.5 | GWA E-Mail B5 Obergrenze | Formular „Konto erstellen“ geöffnet, übrige Felder gültig | E-Mail-Adresse eingeben, Feld verlassen | 308 x "a" + "@example.com" (320) | kein Hinweis an der E-Mail-Adresse | hoch |
| TF-21 | UC 1.1.2.5 | GWA E-Mail B6 über der Obergrenze | Formular „Konto erstellen“ geöffnet, übrige Felder gültig | E-Mail-Adresse eingeben, Feld verlassen | 309 x "a" + "@example.com" (321) | Hinweis an der E-Mail-Adresse: „Bitte gib eine gültige E-Mail-Adresse ein“ | hoch |
| TF-22 | UC 1.1.2.5 | ÄK E-Mail U10 leer | Formular „Konto erstellen“ geöffnet, übrige Felder gültig | E-Mail-Adresse eingeben, Feld verlassen | leer | Hinweis an der E-Mail-Adresse: „Bitte gib eine gültige E-Mail-Adresse ein“ | hoch |
| TF-23 | UC 1.1.2.5 | ÄK E-Mail U11 ohne @ | Formular „Konto erstellen“ geöffnet, übrige Felder gültig | E-Mail-Adresse eingeben, Feld verlassen | erika.example.de | Hinweis an der E-Mail-Adresse: „Bitte gib eine gültige E-Mail-Adresse ein“ | hoch |
| TF-24 | UC 1.1.2.5 | ÄK E-Mail U12 ohne Kennung | Formular „Konto erstellen“ geöffnet, übrige Felder gültig | E-Mail-Adresse eingeben, Feld verlassen | erika@example | Hinweis an der E-Mail-Adresse: „Bitte gib eine gültige E-Mail-Adresse ein“ | hoch |
| TF-25 | UC 1.1.2.5 | ÄK E-Mail U13 Kennung mit 1 Buchstaben | Formular „Konto erstellen“ geöffnet, übrige Felder gültig | E-Mail-Adresse eingeben, Feld verlassen | erika@example.d | Hinweis an der E-Mail-Adresse: „Bitte gib eine gültige E-Mail-Adresse ein“ | mittel |
</testfaelle>
```

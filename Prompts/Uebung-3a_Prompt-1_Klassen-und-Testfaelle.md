# Übung 3a – Prompt 1: Klassen und Testfälle

- Chat: neuer Chat; Prompts 2 bis 6 folgen im selben Chat
- Enthalten: UC 1.1.2.3 bis 1.1.2.5 (Anhang A.1), Auszug aus dem Fachkonzept 1.1, PLZ-Verzeichnis der Testumgebung

Den Inhalt des Kastens vollständig kopieren.

```text
Du unterstützt mich als Testanalyst beim Testentwurf für die Registrierung eines Online-Schuhhändlers.

Aufgabe: Leite Testfälle für die Felder PLZ, Ort und E-Mail-Adresse ab. Verwende ausschließlich die Anforderung zwischen <anforderung> und </anforderung> und das PLZ-Verzeichnis zwischen <verzeichnis> und </verzeichnis>.

Methode: Äquivalenzklassenbildung und Grenzwertanalyse (2-Wert-Variante).

Arbeite in zwei Schritten.

Schritt 1: Gib je Feld eine nummerierte Liste aus: gültige Äquivalenzklassen (G1, G2 …), ungültige Äquivalenzklassen (U1, U2 …) und Grenzwerte (B1, B2 …). Nenne zu jedem Eintrag die Fundstelle in der Anforderung. Liste danach getrennt alle Annahmen und offenen Fragen auf, zu denen die Anforderung nichts oder nichts Eindeutiges sagt. Halte dann an und warte auf mein "Weiter".

Schritt 2 (erst nach meinem "Weiter"): Erstelle die Testfälle als Tabelle mit den Spalten
ID | Anforderung | Technik/Klasse | Vorbedingung | Schritte | Testdaten | erwartetes Ergebnis | Priorität
Regeln:
- Jede Klasse und jeder Grenzwert aus Schritt 1 wird von mindestens einem Testfall abgedeckt. Nenne in der Spalte "Technik/Klasse" die abgedeckten Nummern.
- Je Testfall höchstens eine ungültige Klasse; alle übrigen Felder sind gültig.
- Erwartete Hinweistexte wörtlich aus der Anforderung. Gibt die Anforderung keinen Text vor, schreibe "nicht spezifiziert – Klärung".
- PLZ-Ort-Paare für gültige Eingaben nur aus dem Verzeichnis.
- Gib bei Testdaten, deren Länge geprüft wird, die Zeichenanzahl in Klammern an. Sehr lange Werte darfst du als Bildungsregel angeben, z. B. 300 x "a" + "@example.com".
- Höchstens 25 Testfälle. Wenn das für die vollständige Abdeckung nicht reicht, sage es.

<anforderung>
Formular "Konto erstellen" (Registrierung). Der Speichern-Button heißt in der Oberfläche "Konto anlegen".

Fachkonzept Kontaktdaten-Verwaltung (Auszug):
- Die E-Mail-Adresse muss einem Standard-Schema entsprechen und darf maximal 320 Zeichen lang sein.

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

UC 1.1.2.4 Wohnort eingeben
User Story
- Als Kunde
- möchte ich meinen Wohnort hinterlegen können,
- um meine Adressdaten in meinem Kundenkonto zu vervollständigen.
Akzeptanzkriterien
Das Formular enthält unten stehende Daten und folgt den jeweiligen Regeln.
- Das Feld Ort ist ein Pflicht-Eingabefeld.
- Im Feld Ort sind nur bestimmte Zeichen erlaubt:
  - Ort: Buchstaben (a-z, A-Z), Leerzeichen, Umlaute (ä, ö, ü), Eszett (ß) und Bindestriche (-).
- Die Adresse muss in Deutschland existieren (über eine Adressvalidierung geprüft).
- Der Speichern-Button wird nur aktiv, wenn das Eingabefeld korrekt und valide ausgefüllt ist.
- Wird das Pflichtfeld nicht ausgefüllt, erscheint ein Hinweis "Bitte fülle alle Pflichtfelder aus".

UC 1.1.2.5 E-Mail-Adresse eingeben
User Story
- Als Kunde
- möchte ich meine E-Mail-Adresse hinterlegen können,
- um wichtige Mitteilungen und Benachrichtigungen zu meinem Kundenkonto und zu meinen Bestellungen zu erhalten.
Akzeptanzkriterien
Das Formular enthält unten stehende Daten und folgt den jeweiligen Regeln.
- Das Feld E-Mail-Adresse ist ein Pflicht-Eingabefeld.
- Die Eingabe muss zwischen 6 und maximal 320 Zeichen lang sein.
- Die E-Mail-Adresse muss ein gültiges Format aufweisen (z. B. name@domain.de).
- Der Domänenanteil der E-Mail-Adresse muss ein Länderkennzeichen (z. B. .de, .com, .fr) enthalten.
- Der Speichern-Button wird nur aktiv, wenn das Eingabefeld korrekt und valide ausgefüllt ist.
- Wird keine oder eine ungültige E-Mail-Adresse eingegeben, erscheint ein Hinweis "Bitte gib eine gültige E-Mail-Adresse ein".

Testumgebung: Die Adressvalidierung prüft PLZ und Ort gegen das folgende Verzeichnis.
</anforderung>

<verzeichnis>
01067 Dresden; 04109 Leipzig; 10115 Berlin; 10117 Berlin; 14467 Potsdam; 20095 Hamburg; 24103 Kiel; 28195 Bremen; 30159 Hannover; 35390 Gießen; 40213 Düsseldorf; 44135 Dortmund; 44575 Castrop-Rauxel; 50667 Köln; 53111 Bonn; 60311 Frankfurt am Main; 66111 Saarbrücken; 70173 Stuttgart; 79098 Freiburg im Breisgau; 80331 München; 82467 Garmisch-Partenkirchen; 86150 Augsburg; 88662 Überlingen; 90402 Nürnberg; 93047 Regensburg; 96047 Bamberg; 96444 Coburg; 96450 Coburg; 97070 Würzburg; 99084 Erfurt
</verzeichnis>
```

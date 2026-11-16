# Übung 2 – Prompt 2: Gegenprüfung (Zusatzaufgabe)

- Chat: neuer Chat oder zweites Modell
- Enthalten: Anhang A.1 vollständig und eine Beispiel-Befundtabelle mit zehn Befunden (A01 bis A10), wie sie Prompt 1 liefert
- Vor dem Absenden: die Beispielbefunde selbst einstufen (E, I, F) und das Ergebnis des Modells damit vergleichen
- Eigene Befundtabelle: wer sie prüfen lassen will, ersetzt den Text zwischen `<befunde>` und `</befunde>`

Den Inhalt des Kastens vollständig kopieren.

```text
Prüfe jeden Befund: Steht das Zitat wörtlich im Anforderungstext? Ist der Befund berechtigt? Welche Mängel fehlen in der Liste?

<anforderung>
Fachkonzept 1.1 Kundenkonto Erstellung
Kundenkonto-Erstellung
- Der Benutzer kann ein neues Kundenkonto über eine sichtbare Schaltfläche „Neues Kundenkonto erstellen“ anlegen.
- Ein Formular wird angezeigt, in dem der Benutzer seine Kontaktdaten eingeben muss.
- Eine Bestätigungsmeldung wird nach dem Absenden des Formulars angezeigt.
Kontaktdaten-Verwaltung
- Pflichtfelder: E-Mail-Adresse, Telefonnummer, Name, Vorname, Anrede, Straße, Ort, PLZ.
- Die E-Mail-Adresse muss einem Standard-Schema entsprechen und darf maximal 320 Zeichen lang sein.
- Die Telefonnummer wird in ein Standardformat umgewandelt und validiert.

UC 1.1.2.1 Anrede eingeben
User Story
- Als Kunde
- möchte ich die Anrede in meinem Kundenkonto hinterlegen können,
- um die Personalisierung meiner Kommunikation zu verbessern.
Akzeptanzkriterien
Das Formular enthält unten stehende Daten und folgt den jeweiligen Regeln.
- Das Anrede-Feld ist ein Pflicht-Eingabefeld.
- Es stehen die folgenden Auswahlmöglichkeiten zur Verfügung: Herr, Frau, Keine Angabe.
- Es darf nur eine der vorgegebenen Anreden ausgewählt sein.
- Der Speichern-Button wird nur aktiv, wenn eine Anrede ausgewählt wurde.
- Wird keine Anrede ausgewählt, erscheint ein Hinweis "Bitte wähle eine Anrede aus".

UC 1.1.2.2 Straße und Hausnummer eingeben
User Story
- Als Kunde
- möchte ich meine Straße und Hausnummer hinterlegen können,
- um meine Adressdaten in meinem Kundenkonto zu vervollständigen.
Akzeptanzkriterien
Das Formular enthält unten stehende Daten und folgt den jeweiligen Regeln.
- Die Felder Straße und Hausnummer sind Pflicht-Eingabefelder.
- In den Feldern sind nur bestimmte Zeichen erlaubt:
  - Straße: Buchstaben (a-z, A-Z), Leerzeichen, Umlaute (ä, ö, ü), Eszett (ß) und Bindestriche (-).
  - Hausnummer: Ziffern (0-9), Buchstaben (a-z, A-Z) und Sonderzeichen wie Schrägstriche (/) und Bindestriche (-).
- Der Speichern-Button wird nur aktiv, wenn beide Eingabefelder korrekt und valide ausgefüllt sind.
- Wird ein Pflichtfeld nicht ausgefüllt, erscheint ein Hinweis "Bitte fülle alle Pflichtfelder aus".

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

UC 1.1.2.6 Telefonnummer eingeben
User Story
- Als Kunde
- möchte ich meine Telefonnummer hinterlegen können,
- um eine alternative Kontaktmöglichkeit für mein Kundenkonto bereitzustellen.
Akzeptanzkriterien
Das Formular enthält unten stehende Daten und folgt den jeweiligen Regeln.
- Die Telefonnummer muss mit der Ländervorwahl +49 beginnen.
- Die Telefonnummer darf nur aus Ziffern (0-9) nach der Ländervorwahl bestehen.
- Die Telefonnummer muss nach der Ländervorwahl mindestens 3 Ziffern und maximal 15 Ziffern enthalten.
- Der Speichern-Button wird nur aktiv, wenn das Eingabefeld korrekt und valide ausgefüllt ist oder wenn das Feld leer bleibt.
- Wird eine ungültige Telefonnummer eingegeben, erscheint ein Hinweis "Bitte gib eine gültige Telefonnummer mit der Vorwahl +49 ein"
</anforderung>

<befunde>
| ID | Fundstelle | Mangeltyp | Beschreibung | Klärungsfrage | Schwere |
|---|---|---|---|---|---|
| A01 | Fachkonzept, UC 1.1.2.6 | Widerspruch | Das Fachkonzept nennt die Telefonnummer als Pflichtfeld („Pflichtfelder: E-Mail-Adresse, Telefonnummer, Name, Vorname, Anrede, Straße, Ort, PLZ.“), UC 1.1.2.6 lässt ein leeres Feld zu („oder wenn das Feld leer bleibt“). | Ist die Telefonnummer ein Pflichtfeld oder optional? | hoch |
| A02 | UC 1.1.2.2 | implizite Annahme | „Straße: Buchstaben (a-z, A-Z), Leerzeichen, Umlaute (ä, ö, ü), Eszett (ß) und Bindestriche (-).“ Reale Straßennamen mit Ziffern oder Punkt, z. B. „Straße des 17. Juni“ oder „Hauptstr.“, würden abgelehnt. | Sollen Ziffern und Punkte im Straßennamen zulässig sein? | hoch |
| A03 | UC 1.1.2.3 | Lücke | „Die PLZ muss mindestens 5 Ziffern lang sein.“ Eine Obergrenze für die Länge fehlt. | Wie viele Ziffern darf die PLZ höchstens haben? | mittel |
| A04 | UC 1.1.2.5 | Widerspruch | „Der Domänenanteil der E-Mail-Adresse muss ein Länderkennzeichen (z. B. .de, .com, .fr) enthalten.“ .com ist kein Länderkennzeichen. | Ist jede Top-Level-Domain zulässig oder nur eine Länderkennung? | mittel |
| A05 | UC 1.1.2.4 | nicht prüfbar | „Die Adresse muss in Deutschland existieren (über eine Adressvalidierung geprüft).“ Prüfdienst, Prüftiefe und Verhalten bei Ausfall des Dienstes sind nicht festgelegt. | Gegen welchen Dienst oder welches Verzeichnis wird geprüft, und was geschieht, wenn er nicht erreichbar ist? | hoch |
| A06 | Fachkonzept | Lücke | Für die Verarbeitung der Kontaktdaten fehlt eine Einwilligung nach Datenschutz-Grundverordnung. (Kontextwissen) | Wo und in welcher Form wird die Einwilligung eingeholt? | hoch |
| A07 | UC 1.1.2.2 | sonstiges (realisierbar) | Die Straße darf laut Anforderung „maximal 50 Zeichen“ lang sein; lange Straßennamen werden damit abgeschnitten. | Reicht die Maximallänge von 50 Zeichen aus? | niedrig |
| A08 | UC 1.1.2.6 | sonstiges (realisierbar) | „mindestens 3 Ziffern und maximal 15 Ziffern“: Nach der Empfehlung E.164 haben deutsche Rufnummern nach der Ländervorwahl immer genau 11 Ziffern. (Kontextwissen) | Soll die Länge auf genau 11 Ziffern festgelegt werden? | mittel |
| A09 | alle Use Cases | Lücke | „erscheint ein Hinweis“: Der Zeitpunkt ist offen – bei der Eingabe, beim Verlassen des Felds oder beim Absenden? | Wann erscheinen die Hinweise? | mittel |
| A10 | UC 1.1.2.5 | sonstiges (notwendig) | Die User Story nennt „Benachrichtigungen zu meinem Kundenkonto und zu meinen Bestellungen“; Bestellungen sind nicht Gegenstand der Registrierung. | Gehören Bestellbenachrichtigungen zum Umfang von Release 0.1? | niedrig |
</befunde>
```

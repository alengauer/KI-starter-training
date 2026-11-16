# Übung 3b – Prompt 1: Entscheidungstabellen

- Chat: neuer Chat; Prompt 2 folgt bei Bedarf im selben Chat
- Enthalten: UC 1.1.2.1 bis 1.1.2.6 (Anhang A.1), UC 1.2.1 und 1.2.2 (Anhang A.2), UC 1.3.1 (Anhang A.3), Auszüge aus den Fachkonzepten 1.1 und 1.2, PLZ-Verzeichnis der Testumgebung

Den Inhalt des Kastens vollständig kopieren.

```text
Du unterstützt mich als Testanalyst beim Testentwurf für die Registrierung eines Online-Schuhhändlers.

Methode: Entscheidungstabellentest. Verwende ausschließlich die Anforderung zwischen <anforderung> und </anforderung>.

Aufgabe A: Erstelle eine Entscheidungstabelle für das Zusammenspiel von PLZ und Ort. Bedingungen: PLZ im Verzeichnis? Ort im Verzeichnis? PLZ und Ort passen laut Verzeichnis zusammen? Aktionen: welcher Hinweis an welchem Feld erscheint. Setze voraus, dass beide Felder ein formal gültiges Format haben.

Aufgabe B: Erstelle eine Entscheidungstabelle dafür, wann der Button "Konto anlegen" (in den Use Cases "Speichern-Button") aktiv ist. Bedingungen sind die Gültigkeit der einzelnen Felder.

Regeln für beide Tabellen:
- Bedingungen als Zeilen, Regeln als Spalten; J = ja, N = nein, – = irrelevant.
- Reduziere die Tabelle, wo eine Bedingung für das Ergebnis irrelevant ist, und begründe jede Zusammenfassung.
- Markiere jede Regel, deren Aktion die Anforderung nicht eindeutig festlegt, mit "NICHT SPEZIFIZIERT" und formuliere eine Klärungsfrage. Erfinde keine Hinweistexte.
- Markiere Widersprüche innerhalb der Anforderung mit Fundstellen.
- Leite danach je Regel genau einen konkreten Testfall ab: ID | Regel | Testdaten | erwartetes Ergebnis. Je Testfall ist höchstens eine Bedingung verletzt, alle anderen Felder sind gültig. PLZ-Ort-Paare für gültige Eingaben nur aus dem Verzeichnis.

<anforderung>
Fachkonzept Kontaktdaten-Verwaltung:
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

Fachkonzept Passwort-Management: Das Passwort muss mindestens 8 Zeichen lang sein und mindestens ein Sonderzeichen, einen Großbuchstaben sowie eine Zahl enthalten. Eine Fehlermeldung wird angezeigt, falls das Verifizierungskennwort nicht mit dem ursprünglichen Passwort übereinstimmt.

UC 1.2.1 Passwort eingeben
User Story
- Als neuer Benutzer
- möchte ich ein Passwort eingeben,
- damit ich mein Konto schützen kann.
Akzeptanzkriterien
- Das Passwort muss mindestens 8 Zeichen lang sein.
- Das Passwort muss mindestens ein Sonderzeichen, einen Großbuchstaben und eine Zahl enthalten.

UC 1.2.2 Passwort verifizieren
User Story
- Als neuer Benutzer
- möchte ich mein Passwort verifizieren,
- damit ich sicherstellen kann, dass ich es korrekt eingegeben habe.
Akzeptanzkriterien
- Das Verifizierungspasswort muss mit dem ursprünglichen Passwort übereinstimmen.
- Eine Fehlermeldung wird angezeigt, wenn die Passwörter nicht übereinstimmen.

UC 1.3.1 Kontoanlage beauftragen
User Story
- Als neuer Benutzer
- möchte ich die Kontoanlage beauftragen,
- damit mein Konto erstellt wird.
Akzeptanzkriterien
- Nach Eingabe der Kontaktdaten und des Passworts kann der Benutzer die Kontoanlage beauftragen.
- Eine Bestätigungsmeldung wird angezeigt, dass die Kontoanlage in Bearbeitung ist.

Testumgebung: Die Adressvalidierung prüft PLZ und Ort gegen dieses Verzeichnis:
01067 Dresden; 04109 Leipzig; 10115 Berlin; 10117 Berlin; 14467 Potsdam; 20095 Hamburg; 24103 Kiel; 28195 Bremen; 30159 Hannover; 35390 Gießen; 40213 Düsseldorf; 44135 Dortmund; 44575 Castrop-Rauxel; 50667 Köln; 53111 Bonn; 60311 Frankfurt am Main; 66111 Saarbrücken; 70173 Stuttgart; 79098 Freiburg im Breisgau; 80331 München; 82467 Garmisch-Partenkirchen; 86150 Augsburg; 88662 Überlingen; 90402 Nürnberg; 93047 Regensburg; 96047 Bamberg; 96444 Coburg; 96450 Coburg; 97070 Würzburg; 99084 Erfurt
</anforderung>
```

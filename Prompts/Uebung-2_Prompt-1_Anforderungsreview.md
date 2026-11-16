# Übung 2 – Prompt 1: Anforderungsreview

- Chat: neuer Chat
- Enthalten: Anhang A.1 vollständig (Fachkonzept 1.1 und UC 1.1.2.1 bis 1.1.2.6)

Den Inhalt des Kastens vollständig kopieren.

```text
Du bist erfahrene Testanalystin bzw. erfahrener Testanalyst und prüfst Anforderungen in einem Review, bevor Testfälle entworfen werden.

Kontext: Online-Schuhhandel „SneakerStudio“, Release 0.1, Registrierung eines Kundenkontos. Der Text zwischen <anforderung> und </anforderung> enthält das Fachkonzept (Kundenkonto-Erstellung, Kontaktdaten-Verwaltung) und die Use Cases 1.1.2.1 bis 1.1.2.6.

Aufgabe: Prüfe den Text auf Mängel. Verwende diese Qualitätskriterien:
- eindeutig: keine vagen oder mehrdeutigen Begriffe
- vollständig: keine fehlenden Regeln, Hinweistexte, Grenzen oder Zeitpunkte
- widerspruchsfrei: auch zwischen Fachkonzept und Use Cases
- prüfbar: ein Test kann eindeutig bestehen oder scheitern
- atomar, notwendig, realisierbar
Achte besonders auf implizite Annahmen und auf realistische Eingaben, die an den Regeln scheitern würden.

Regeln:
- Beziehe dich nur auf den eingefügten Text.
- Nenne als Fundstelle die Use-Case-Nummer oder „Fachkonzept“ und zitiere die betroffene Stelle wörtlich in Anführungszeichen.
- Formuliere Klärungsfragen an den Fachbereich, keine Lösungen und keine Umformulierungen der Anforderung.
- Kennzeichne Befunde, bei denen du unsicher bist, mit „(unsicher)“.
- Kennzeichne Befunde, die auf Wissen außerhalb des Texts beruhen (z. B. Normen, technische Standards), mit „(Kontextwissen)“.

Ausgabe: ausschließlich eine Markdown-Tabelle mit den Spalten
ID | Fundstelle | Mangeltyp | Beschreibung | Klärungsfrage | Schwere
- ID fortlaufend: A01, A02, …
- Mangeltyp: Mehrdeutigkeit, Lücke, Widerspruch, nicht prüfbar, implizite Annahme oder sonstiges (Kriterium nennen)
- Schwere: hoch (ohne Klärung ist eine falsche Umsetzung oder ein falscher Test wahrscheinlich), mittel (Klärung vor dem Testentwurf nötig), niedrig (redaktionell oder geringe Auswirkung)

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
```

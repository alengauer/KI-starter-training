# Übung 3c – Prompt 1: Zustandsmodell

- Chat: neuer Chat; Prompt 2 folgt im selben Chat
- Enthalten: UC 1.3.2 bis 1.3.4 (Anhang A.3), Fachkonzept 1.3, Anmeldehinweis aus dem Use-Case-Entwurf 1.5.2, Auszüge aus F06

Den Inhalt des Kastens vollständig kopieren.

```text
Du unterstützt mich als Testanalyst beim Testentwurf für die Kontoaktivierung eines Online-Schuhhändlers.

Methode: Zustandsübergangstest. Verwende ausschließlich die Anforderung zwischen <anforderung> und </anforderung>.

Arbeite in zwei Schritten.

Schritt 1: Erstelle ein Zustandsmodell als Zustandstabelle: Zeilen = Zustände, Spalten = Ereignisse, Zellen = Folgezustand und sichtbare Reaktion (Meldung). Kennzeichne ungültige oder nicht vorgesehene Kombinationen ausdrücklich. Nenne alle Bedingungen (z. B. Zeitgrenzen). Liste danach alle Stellen, an denen die Anforderung das Verhalten nicht eindeutig festlegt, als Klärungsfragen auf. Halte dann an und warte auf mein "Weiter".

Schritt 2 (erst nach meinem "Weiter"): Leite Testfälle ab, die alle Zustände, alle gültigen Übergänge und jeden ungültigen Übergang in einem eigenen Testfall abdecken. Spalten:
ID | Anforderung | Übergang (Ausgangszustand – Ereignis – Folgezustand) | Vorbedingung | Schritte | erwartetes Ergebnis | Priorität
Erwartete Meldungen wörtlich aus der Anforderung; gibt die Anforderung keine Meldung vor, schreibe "nicht spezifiziert – Klärung". Gib bei Zeitgrenzen konkrete Zeitpunkte relativ zur Kontoanlage an. Höchstens 15 Testfälle.

<anforderung>
Fachkonzept Kontoaktivierung:
- Eine Bestätigungsmail wird an die angegebene E-Mail-Adresse gesendet und enthält einen 24 Stunden gültigen Bestätigungslink.
- Das Konto wird aktiviert, wenn der Bestätigungslink innerhalb von 24 Stunden angeklickt wird.
- Sollte der Bestätigungslink nicht innerhalb von 24 Stunden angeklickt werden, wird das Kundenkonto gelöscht.

UC 1.3.2 Kontaktdaten erfolgreich verifiziert
User Story
- Als System
- möchte ich die Kontaktdaten des Benutzers verifizieren,
- damit ich sicherstellen kann, dass die eingegebenen Daten korrekt sind.
Akzeptanzkriterien
- Die E-Mail-Adresse wird auf Einzigartigkeit im ERP-System geprüft.
- Eine Bestätigungsmeldung wird angezeigt, wenn die Kontaktdaten erfolgreich verifiziert wurden.

UC 1.3.3 Kunde angelegt
User Story
- Als System
- möchte ich den neuen Kunden anlegen,
- damit er Zugriff auf sein Konto hat.
Akzeptanzkriterien
- Der Kunde wird im System angelegt, nachdem die Kontaktdaten verifiziert wurden.
- Eine Bestätigungsmail wird an die angegebene E-Mail-Adresse gesendet.

UC 1.3.4 Bestätigungsmail zum Kundenkonto versendet
User Story
- Als System
- möchte ich eine Bestätigungsmail zum Kundenkonto versenden,
- damit der Benutzer sein Konto aktivieren kann.
Akzeptanzkriterien
- Die Bestätigungsmail enthält einen 24 Stunden gültigen Bestätigungslink.
- Der Benutzer wird informiert, dass das Konto gelöscht wird, wenn der Link nicht innerhalb von 24 Stunden angeklickt wird.

UC 1.5.2 Nur aktivierte Konten: Ist das Konto noch nicht aktiviert, erscheint bei der Anmeldung der Hinweis "Bitte bestätige zuerst deine E-Mail-Adresse über den Link in unserer E-Mail."

Umsetzung laut Feature-Beschreibung:
- Die Aktivierungsseite aktiviert beim Öffnen des Links automatisch; der Klick auf den Link genügt.
- Meldungen der Aktivierungsseite: Erfolg "Konto erfolgreich aktiviert!"; Link abgelaufen "Dein Bestätigungslink ist abgelaufen. Dein Kundenkonto wurde gelöscht."; Link unbekannt "Dieser Bestätigungslink ist ungültig."
- Ein Aufräum-Job löscht alle 15 Minuten nicht aktivierte Konten, deren Link älter als 24 Stunden ist.
</anforderung>
```

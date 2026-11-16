# Übung 1 – Prompt 2: starker Prompt

- Chat: zweiter neuer Chat
- Enthalten: Anhang A.2 vollständig, derselbe Text wie in Prompt 1

Den Inhalt des Kastens vollständig kopieren.

```text
Rolle und Kontext: Du arbeitest als Testanalyst im Projekt SneakerStudio, einem Online-Schuhhandel. Getestet wird die Passwortvergabe bei der Registrierung neuer Kunden.

Aufgabe: Leite aus der Anforderung in <anforderung> Testfälle ab.

Methode:
1. Bilde Äquivalenzklassen (gültig und ungültig) für „Passwort“ und für „Passwort wiederholen“.
2. Wende die Grenzwertanalyse (2-Wert) auf die Mindestlänge an.
3. Jeder Negativtest verletzt genau eine Regel; alle anderen Regeln sind in diesem Testfall erfüllt.

Ausgabe:
Teil A: Liste der Klassen und Grenzwerte mit IDs (K1, K2, …).
Teil B: Tabelle mit genau diesen Spalten:
| ID | Klasse/Grenze | Passwort | Wiederholung | Zeichenanzahl Passwort | Erwartetes Ergebnis | Fundstelle |
IDs fortlaufend TF-01, TF-02, …; höchstens 15 Testfälle.

Qualitätsregeln:
- Verwende nur Regeln, die in <anforderung> belegt sind.
- Übernimm Fehlermeldungen nur wörtlich aus <anforderung>. Ist kein Text vorgegeben, schreibe „Fehlermeldung (Text nicht spezifiziert)“.
- Triffst du eine Annahme, markiere den betroffenen Testfall mit [A1], [A2] usw.

<anforderung>
Fachkonzept 1.2 Passwort-Management
- Das Passwort muss mindestens 8 Zeichen lang sein und mindestens ein Sonderzeichen, einen Großbuchstaben sowie eine Zahl enthalten.
- Eine Fehlermeldung wird angezeigt, falls das Verifizierungskennwort nicht mit dem ursprünglichen Passwort übereinstimmt.

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
</anforderung>
```

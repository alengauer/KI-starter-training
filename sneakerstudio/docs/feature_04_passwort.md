# F04 Passwort festlegen

**Use Cases:** 1.2 Passwort-Management (Fachkonzept), 1.2.1 Passwort eingeben, 1.2.2 Passwort verifizieren
**Design-Vorlage:** Folie 8 – Schritt 2 (Passwortfeld im Formular „Konto erstellen“)
**Pakete:** shared (Regeln), client (Felder im Formular), server (erneute Prüfung, sichere Speicherung)

## Ziel
Der Benutzer schützt sein Konto mit einem starken Passwort und stellt durch Wiederholung sicher, dass er es korrekt eingegeben hat.

## Felder & Regeln
| Feld | Regel | Hinweis | Quelle |
|---|---|---|---|
| Passwort | mind. 8 Zeichen, mind. ein Sonderzeichen, ein Großbuchstabe und eine Ziffer | „Das Passwort muss mindestens 8 Zeichen lang sein und mindestens ein Sonderzeichen, einen Großbuchstaben sowie eine Zahl enthalten“ | UC 1.2.1, Fachkonzept 1.2 |
| Passwort wiederholen | identisch mit dem Passwort | „Die Passwörter stimmen nicht überein“ | UC 1.2.2, Fachkonzept 1.2 |

## Verhalten
- Beide Felder sind Teil des Formulars „Konto erstellen“ (F03) und steuern den Button „Konto anlegen“ mit.
- Unter dem Passwortfeld steht dauerhaft der Hilfetext „Mindestens 8 Zeichen, ein Sonderzeichen, ein Großbuchstabe und eine Zahl“. Nach Verlassen des Felds mit ungültigem Passwort wird er durch den Hinweis ersetzt.
- Der Hinweis zur Wiederholung erscheint nach Verlassen des Wiederholungsfelds und wird bei jeder Änderung eines der beiden Felder neu bewertet.
- Passwortfelder sind maskiert und für Passwort-Manager als „neues Passwort“ gekennzeichnet.
- Die Wiederholung wird nur im Client geprüft; an den Server geht nur das Passwort.
- Der Server prüft die Passwortregel erneut und speichert nur einen Hash (scrypt aus `node:crypto`, zufälliges Salt je Konto) – nie das Klartext-Passwort.

## Annahmen & offene Punkte
- Sonderzeichen = jedes Zeichen, das weder Buchstabe (inkl. Umlaute) noch Ziffer noch Leerzeichen ist.
- Großbuchstaben schließen Ä, Ö, Ü ein.
- Der Hinweis zur Passwortregel übernimmt den Wortlaut des Fachkonzepts; der Hinweis zur Wiederholung ist abgeleitet (die Use Cases nennen keinen Text).

## Testfälle
- **Unit (shared):** 7 und 8 Zeichen; ohne Sonderzeichen, ohne Großbuchstabe, ohne Ziffer; Umlaut als Großbuchstabe; Wiederholung gleich/ungleich.
- **Unit (server):** Der Hash enthält das Passwort nicht; zwei Hashes desselben Passworts unterscheiden sich (Salt).
- **Komponente (client):** Hinweise erscheinen mit exaktem Text; Button bleibt deaktiviert bei ungültigem oder nicht übereinstimmendem Passwort.
- **API (server):** Ein schwaches Passwort wird bei der Kontoanlage abgelehnt; gespeichert wird kein Klartext.

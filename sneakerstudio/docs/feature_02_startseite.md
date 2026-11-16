# F02 Startseite

**Use Cases:** 1.1.1 Auswahl „Neues Kundenkonto erstellen“; Fachkonzept 1.1 („sichtbare Schaltfläche“)
**Design-Vorlage:** Folie 8 – Schritt 1 „Aufruf“ und Startseiten-Mockup („Dein Sneaker. Dein Style.“)
**Pakete:** client

## Ziel
Neue Benutzer finden auf der Startseite sofort den Einstieg in die Registrierung.

## Verhalten
- Route `/` zeigt die Überschrift „Dein Sneaker. Dein Style.“ („Dein Style.“ in `brand`) und den Text „Willkommen bei SneakerStudio. Erstelle dein Konto und erlebe Sneaker ganz neu.“ (Folie 8, Schritt 1).
- Schaltfläche „Neues Kundenkonto erstellen“ als Primär-Button, ohne Scrollen sichtbar.
- Ein Klick öffnet `/registrieren` mit dem Formular zur Eingabe der Kontaktdaten (F03).

## Akzeptanzkriterien (UC 1.1.1)
- Die Option „Neues Kundenkonto erstellen“ ist auf der Startseite sichtbar.
- Beim Klicken auf die Option wird ein Formular zur Eingabe der Kontaktdaten angezeigt.

## Bewusst nicht enthalten
- „Bereits ein Konto? Anmelden“, Werte-Leiste („Individuell gestalten“ …), Produktbilder – dafür gibt es in Release 0.1 keinen Use Case.

## Testfälle
- **Komponente:** Die Startseite zeigt die Schaltfläche „Neues Kundenkonto erstellen“ mit dem Ziel `/registrieren`.
- **E2E:** Ein Klick auf die Schaltfläche zeigt das Kontaktdaten-Formular.

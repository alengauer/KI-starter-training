# F07 Landing Page

**Use Cases:** 1.4.1 Einstieg für neue und bestehende Kunden, 1.4.2 Markenversprechen und Vorteile (Entwurf, `docs/usecases_entwurf.md`); erweitert F02 (UC 1.1.1)
**Design-Vorlage:** Folie 1 (Werte mit Icons), Folie 8 (Startseiten-Mockup, Registrierungsprozess, „Vorteile für unsere Kunden“)
**Pakete:** client
**Status:** umgesetzt

## Ziel
Die Startseite `/` wird zur Landing Page: Besucher verstehen das Angebot und finden sofort den Weg zur Registrierung oder Anmeldung.

## Aufbau (von oben nach unten)
1. **Hero** (aus F02): „Dein Sneaker. Dein Style.“ und Willkommenstext, darunter zwei Einstiege:
   - Primär-Button „Neues Kundenkonto erstellen“ → `/registrieren`
   - Rahmen-Button „Anmelden“ → `/anmelden` (F08)
   - Angemeldet stattdessen „Zu meinem Konto“ → `/willkommen` (F09)
2. **Werte-Leiste:** vier Einträge mit Linien-Icon – „Individuell gestalten“, „Hochwertig kaufen“, „Persönlich erleben“, „Nachhaltig handeln“.
3. **So einfach geht's:** drei nummerierte Schritte
   - „Registrieren“ – „Gib deine Kontaktdaten ein und wähle ein Passwort.“
   - „E-Mail bestätigen“ – „Klicke innerhalb von 24 Stunden auf den Link in unserer E-Mail.“
   - „Loslegen“ – „Melde dich an und starte dein Sneaker-Erlebnis.“
4. **Vorteile:** vier Kacheln mit Icon, Titel und Text aus Folie 8
   - „Schnell & einfach“ – „In wenigen Schritten zum eigenen Konto.“
   - „Sicher & vertrauenswürdig“ – „Höchste Sicherheitsstandards für deine Daten.“
   - „Persönlich & individuell“ – „Maßgeschneiderte Empfehlungen und Angebote.“
   - „Sofort startklar“ – „Direkter Zugriff auf alle Funktionen und exklusive Vorteile.“

## Gestaltung
- Nur Design-Tokens; Linien-Icons als Inline-SVG im Stil der Vorlage (keine Icon-Bibliothek).
- Mobil einspaltig, ab Tablet Werte und Vorteile in vier Spalten.
- Keine Produktfotos (siehe offene Punkte); grafischer Akzent über einen dezenten Farbverlauf in `brand`.

## Testfälle
- **Komponente:** beide Einstiege mit Zielen; angemeldet „Zu meinem Konto“ statt der Einstiege; vier Werte, drei Schritte und vier Vorteile mit den Texten oben.
- **E2E:** „Anmelden“ öffnet das Anmeldeformular; angemeldet führt „Zu meinem Konto“ zur Willkommensseite.

## Offene Punkte
- Sneaker-Bilder aus der Präsentation nur, wenn die Nutzungsrechte geklärt sind – sonst Bildmaterial vom Fachbereich.
- „Maßgeschneiderte Empfehlungen“ und „exklusive Vorteile“ beschreiben Funktionen späterer Releases – Texte vor dem Livegang fachlich bestätigen.

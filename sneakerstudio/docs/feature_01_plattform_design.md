# F01 Plattform & Design-System

**Use Cases:** Grundlage aller Oberflächen aus 1.1 Kundenkonto Erstellung, 1.2 Passwort-Management und 1.3 Kontoaktivierung; direkt benötigt von 1.1.1 (Startseite)
**Design-Vorlage:** `SneakerStudio.pdf` – Folien 1, 2, 7, 8 (Farben, Wortmarke, Buttons, Karten)
**Pakete:** client

## Ziel
Ein einheitlicher Rahmen für alle Seiten: App-Shell mit Wortmarke, Seiten-Routing, Server-Anbindung und ein Design-System, das das dunkle Design der Vorlage umsetzt und einen passenden hellen Modus bietet.

## Umfang
- Client-Grundgerüst: Vite, React, TanStack Router (Routen im Code definiert), TanStack Query (Server-Aufrufe), Tailwind.
- App-Shell: Header mit Wortmarke „SNEAKER“ + „STUDIO“ (Link zur Startseite) und Theme-Umschalter; darunter der Inhaltsbereich der Seiten.
- Design-Tokens als CSS-Variablen, als Tailwind-Farben nutzbar. Die Tailwind-Standardpalette ist deaktiviert, damit nur Tokens verwendet werden können.
- Theme: folgt der Systemeinstellung (hell/dunkel). Der Umschalter überschreibt sie, die Wahl wird im Browser gespeichert und beim nächsten Besuch wiederhergestellt.
- Schrift: System-Schriften, keine Webfonts (DSGVO).

## Design-Tokens
Dark = aus der Vorlage gemessen. Light = abgeleitet vom hellen Kasten „Unsere Stärken & Voraussetzungen“ (Folie 2).

| Token | Verwendung | Dark | Light |
|---|---|---|---|
| `bg` | Seitenhintergrund | `#020716` | `#f1f2f6` |
| `surface` | Karten, Header | `#061226` | `#ffffff` |
| `field` | Eingabefelder | `#0a192d` | `#f6f7fa` |
| `field-line` | Rahmen der Eingabefelder | `#5b6b82` | `#7c8595` |
| `line` | Rahmen von Karten, Trennlinien | `#1e2a3b` | `#d9dce3` |
| `fg` | Text | `#f7fafc` | `#07122a` |
| `muted` | Nebentext | `#a9aebb` | `#545a66` |
| `primary` | Buttons | `#0656c0` | `#0656c0` |
| `on-primary` | Text auf Buttons | `#ffffff` | `#ffffff` |
| `brand` | Wortmarke „STUDIO“, Akzentbalken, Hervorhebung in Überschriften | `#0874e0` | `#0656c0` |
| `accent` | Links, Fokusrahmen | `#2f86ee` | `#0656c0` |
| `danger` | Hinweistexte bei Fehleingaben | `#f97066` | `#b42318` |

- `accent` (Dark) ist gegenüber `brand` aufgehellt, damit kleine Texte lesbar bleiben.
- `danger` kommt in der Vorlage nicht vor und ist passend zur Palette gewählt.
- Kontrast nach WCAG AA: Text in `fg`, `muted`, `accent`, `danger` auf `bg`/`surface` mindestens 4,5 : 1; `brand` im Dark-Mode nur für große Schrift.
- *Entschieden:* `field-line` ist kräftiger als in der Vorlage, damit Eingabefelder den Mindestkontrast 3 : 1 für Bedienelemente erreichen (WCAG 2.1 Kriterium 1.4.11; das Barrierefreiheitsstärkungsgesetz verweist für Online-Shops auf WCAG 2.1 AA). Karten und Trennlinien bleiben dezent wie in der Vorlage.

## Gestaltungsregeln (aus der Vorlage)
- Überschriften fett; Wortmarke in Großbuchstaben mit enger Laufweite.
- Unter Seitenüberschriften ein kurzer Akzentbalken in `brand`.
- Buttons: `primary` mit weißer Schrift, Großbuchstaben, leicht gerundet; deaktiviert = abgeschwächt und nicht klickbar.
- Karten: `surface` mit feinem Rahmen in `line`, abgerundete Ecken.
- Eingabefelder: `field` mit Rahmen in `field-line`, Fokusrahmen in `accent`.

## Testfälle
- **Unit:** Startmodus = gespeicherte Wahl, sonst Systemeinstellung.
- **Komponente:** Header zeigt die Wortmarke und verlinkt auf „/“.
- **Komponente:** Theme-Umschalter wechselt den Modus, beschriftet sich passend („Zum hellen Design wechseln“ / „Zum dunklen Design wechseln“) und speichert die Wahl.
- **E2E:** Systemeinstellung hell bzw. dunkel ergibt den passenden Seitenhintergrund; Umschalten wirkt sofort und bleibt nach dem Neuladen erhalten.

# Zustandsübergangstest

Grundlage: ISTQB CTFL 4.0, Zustandsübergangstest (state transition testing).

## Prinzip

- Das Testobjekt wird als Zustände, Ereignisse, Bedingungen (Guards) und Aktionen modelliert. Übergang: `Zustand –Ereignis [Bedingung] / Aktion→ Folgezustand`.
- Darstellung als Zustandsdiagramm oder Zustandstabelle. Nur die Tabelle zeigt auch ungültige Übergänge (Zellen ohne vorgesehenen Übergang).
- Überdeckungskriterien: alle Zustände · alle gültigen Übergänge (0-Switch-Überdeckung) · alle Übergänge, auch ungültige.
- Ungültige Übergänge je Testfall einzeln prüfen, damit ein Fehler keinen anderen verdeckt.

## Vorgehen

1. Zustände, Ereignisse und Bedingungen mit Fundstelle aus der Anforderung ableiten.
2. Zustandstabelle erstellen: Zeilen = Zustände, Spalten = Ereignisse, Zellen = Folgezustand und sichtbare Reaktion.
3. Leere oder ungeregelte Zellen kennzeichnen: „nicht möglich“, „ungültig – testen“ oder „ungeregelt – Klärungsfrage“.
4. Überdeckungsziel nennen (Standard: alle Übergänge) und je Übergang einen Testfall ableiten: Vorbedingung (Ausgangszustand), Ereignis, erwartete Reaktion und Folgezustand.
5. Zeitabhängige Übergänge brauchen eine steuerbare Uhr; das als Voraussetzung angeben.

## Beispiel: Kontoaktivierung (F06)

Laut F06: Bestätigungslink 24 Stunden gültig; Link nach Ablauf → Konto gelöscht (410) mit Seite „Dein Bestätigungslink ist abgelaufen. Dein Kundenkonto wurde gelöscht.“; Aufräumjob alle 15 Minuten löscht nicht aktivierte Konten mit Link älter als 24 Stunden; erneuter Klick bei aktiviertem Konto → bleibt aktiviert (200); unbekannter Link → 404 ohne Zustandsänderung.

Zustände: Z1 nicht aktiviert, Link gültig · Z2 nicht aktiviert, Link abgelaufen, noch nicht gelöscht (entsteht durch den 15-Minuten-Takt) · Z3 aktiviert · Z4 gelöscht

| Zustand | E1 Link öffnen | E2 24 Stunden vergehen | E3 Aufräumjob läuft |
|---|---|---|---|
| Z1 | → Z3, Konto aktiviert (200) | → Z2, keine sichtbare Reaktion | bleibt Z1 |
| Z2 | → Z4, Seite „Dein Bestätigungslink ist abgelaufen. Dein Kundenkonto wurde gelöscht.“ (410) | nicht relevant | → Z4 |
| Z3 | bleibt Z3 (200) | bleibt Z3 | bleibt Z3 – **ungültiger Übergang „löschen“ testen** |
| Z4 | in F06 nachlesen, sonst Klärungsfrage | nicht relevant | nicht relevant |

Testfälle im CSV-Format (Soll-Laenge bei Ereignissen leer):

```text
ID;Klasse;Eingabe;Soll-Laenge;Erwartung;Quelle
TF-01;Z1 –E1→ Z3;Link 23:59:59 h nach Registrierung öffnen;;Konto aktiviert (200);F06
TF-02;Z2 –E1→ Z4;Link 24:00:01 h nach Registrierung öffnen, vor dem nächsten Aufräumlauf;;Seite „Dein Bestätigungslink ist abgelaufen. Dein Kundenkonto wurde gelöscht.“ (410);F06
TF-03;Z3 –E3→ Z3 (ungültig: löschen);Aufräumjob läuft bei aktiviertem Konto mit Link älter als 24 h;;Konto bleibt aktiviert;F06
```

Offene Frage: Gilt der Link bei genau 24:00:00 noch?

## Fallstricke

- Zwischenzustand Z2 fehlt, weil „nach 24 Stunden gelöscht“ vereinfacht wird.
- Nur gültige Übergänge getestet; der ungültige Übergang „Aufräumjob löscht aktiviertes Konto“ fehlt.
- Ereignisse ohne Zeitangabe („Link später öffnen“) – Zeitpunkte konkret angeben.

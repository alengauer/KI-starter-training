# Übung 6 – Prompt 1: Beispiel-Canvas prüfen (optional)

- Chat: neuer Chat
- Enthalten: das ausgefüllte fiktive Beispiel-Canvas aus der Übung; zeigt, welche Art von Hinweisen das Modell liefert

Den Inhalt des Kastens vollständig kopieren.

```text
Welche Risiken, Prüfkriterien und offenen Fragen fehlen in diesem Canvas?

| Feld | Eintrag |
|---|---|
| Aufgabe | Review neuer User Stories für die Online-Kfz-Schadenmeldung vor dem Refinement: Mehrdeutigkeiten, Lücken und Widersprüche in den Akzeptanzkriterien finden (vgl. Übung 2). Eingabe: Story-Text mit Akzeptanzkriterien, ohne Kundendaten. Ausgabe: nummerierte Hinweisliste mit Fundstelle, Mangeltyp und Klärungsfrage an den Product Owner. |
| Häufigkeit | 8–12 Stories je zweiwöchigem Sprint; drei Testanalysten im Team. |
| Risiko | Gering bis mittel: Die KI ergänzt das manuelle Review, ersetzt es nicht. Ein übersehener Hinweis entspricht dem heutigen Stand, ein falscher Hinweis kostet Diskussionszeit. Kritisch wird es, wenn das manuelle Review wegen der KI verkürzt wird (Automation Bias). |
| Datenklasse | Intern: fachliche Anforderungen ohne personenbezogene Daten; Beispielwerte in Stories sind synthetisch. Einstufung gegen die interne Datenklassifizierung prüfen. |
| Prüfaufwand | 5–10 Minuten je Story: Hinweise sichten, verwerfen oder als Klärungsfrage übernehmen. |
| Erwarteter Nutzen | Weniger Klärungsbedarf nach Sprintstart. Messung: Anzahl Rückfragen und nachträglicher Story-Änderungen je Sprint; Ausgangsbasis aus zwei Sprints ohne KI. |
| Werkzeugkategorie | Chat-Assistent (OpenWebUI, Modell der Klasse „groß“) mit versioniertem Team-Prompt; später gegebenenfalls integriertes Werkzeug als Eigenentwicklung. |
| Offene Fragen | Ist die Datenklasse „intern“ für OpenWebUI freigegeben? Wer pflegt den Team-Prompt? Wie werden übernommene Hinweise im Jira-Ticket gekennzeichnet? Ist die Auswertung der Rückfragen mit dem Betriebsrat abzustimmen, falls sie Personen zugeordnet werden kann? |
```

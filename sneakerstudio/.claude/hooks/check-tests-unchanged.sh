#!/bin/bash
# .claude/hooks/check-tests-unchanged.sh
# Stop-Hook: prüft am Ende jeder Antwort, ob bestehende Testdateien gegenüber dem letzten Commit
# geändert oder gelöscht wurden – gleich auf welchem Weg (Dateiwerkzeug, Shell-Befehl, Skript).
# Exit 2 = Claude hört noch nicht auf und erhält den Text auf stderr als Auftrag.

INPUT=$(cat)
# Endlosschleife vermeiden: Läuft Claude bereits wegen dieses Hooks weiter, nicht erneut blockieren.
if [ "$(printf '%s' "$INPUT" | jq -r '.stop_hook_active // false')" = "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR" || exit 0
CHANGED=$(git diff --name-status HEAD -- e2e '*.test.ts' '*.spec.ts' 2>/dev/null)

if [ -n "$CHANGED" ]; then
  {
    echo "Achtung: Bestehende Testdateien weichen vom letzten Commit ab:"
    echo "$CHANGED"
    echo "Nicht selbst zurücknehmen und nicht weiterarbeiten. Dem Menschen melden:"
    echo "welche Datei, welche Änderung, auf welchem Weg, warum. Dann auf Entscheidung warten."
  } >&2
  exit 2
fi
exit 0

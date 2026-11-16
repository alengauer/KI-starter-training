#!/bin/bash
# .claude/hooks/protect-tests.sh
# PreToolUse-Hook: verhindert, dass der Agent bestehende Testdateien ändert oder überschreibt.
# Exit 2 = Werkzeugaufruf wird blockiert; der Text auf stderr geht als Begründung an Claude.
# Voraussetzung: jq ist installiert.

INPUT=$(cat)
TOOL=$(printf '%s' "$INPUT" | jq -r '.tool_name // empty')

# Geschützte Testdateien – an das Projekt anpassen
TEST_FILES='(^|/)e2e/|\.test\.tsx?$|\.spec\.tsx?$'
TEST_WORDS='e2e/|\.test\.tsx?|\.spec\.tsx?'

block() {
  echo "Blockiert: $1 Tests nicht ändern, nicht umgehen, sondern den Befund dem Menschen melden." >&2
  exit 2
}

case "$TOOL" in
  Edit|MultiEdit|NotebookEdit|Write)
    FILE=$(printf '%s' "$INPUT" | jq -r '.tool_input.file_path // .tool_input.notebook_path // empty')
    FILE="${FILE//\\//}"
    if [[ "$FILE" =~ $TEST_FILES ]]; then
      # Neue Testdatei anlegen (Write auf nicht vorhandene Datei) ist erlaubt,
      # Ändern oder Überschreiben einer vorhandenen Testdatei nicht.
      if [ "$TOOL" != "Write" ] || [ -e "$FILE" ]; then
        block "$FILE ist eine bestehende Testdatei."
      fi
    fi
    ;;
  Bash)
    CMD=$(printf '%s' "$INPUT" | jq -r '.tool_input.command // empty')
    # Harmlose Umleitungen (2>&1, >/dev/null) vor der Prüfung entfernen
    CLEAN=$(printf '%s' "$CMD" | sed -E 's#[0-9]*>&[0-9]+##g; s#[0-9]*>>? */dev/null##g')
    # Grobfilter: Befehl nennt eine Testdatei UND enthält ein schreibendes Muster
    if printf '%s' "$CLEAN" | grep -Eq "$TEST_WORDS" && \
       printf '%s' "$CLEAN" | grep -Eq '>|sed -i|perl -i|tee |mv |cp |rm |truncate|git (checkout|restore|rm|mv|stash)|node -e|python3? -c'; then
      block "Der Befehl würde vermutlich Testdateien verändern."
    fi
    ;;
esac
exit 0

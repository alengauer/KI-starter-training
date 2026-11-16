#!/bin/bash
# tools/testfaelle-batch.sh – Testfallentwürfe je Feature-Datei, nicht interaktiv (claude -p)
# Aufruf im Projektordner: tools/testfaelle-batch.sh [Läufe je Feature] [Dateimuster]
# Beispiel: tools/testfaelle-batch.sh 3 "docs/feature_0[34]_*.md"
set -euo pipefail

LAEUFE="${1:-1}"
MUSTER="${2:-docs/feature_*.md}"
PROMPT_DATEI="prompts/testfaelle_v1.md"
PROMPT_VERSION="testfaelle_v1"
MODELL="${MODELL:-eu.anthropic.claude-haiku-4-5-20251001-v1:0}"
AUSGABE="out/testfaelle/$(date +%Y-%m-%d_%H%M)_${PROMPT_VERSION}"

# Bedrock-Konfiguration der Trainer-Umgebung (Shell-Aliase gelten in Skripten nicht)
export CLAUDE_CONFIG_DIR="$HOME/.claude-bedrock"
export CLAUDE_CODE_USE_BEDROCK=1 AWS_PROFILE=ki-training AWS_REGION=eu-north-1

mkdir -p "$AUSGABE"
echo "datei;lauf;kosten_usd;testfaelle;nicht_belegte_zitate" > "$AUSGABE/protokoll.csv"

for f in $MUSTER; do
  name=$(basename "$f" .md)
  for lauf in $(seq 1 "$LAEUFE"); do
    ziel="$AUSGABE/${name}_lauf${lauf}"
    # Feature-Datei per stdin; --bare: ohne CLAUDE.md, Hooks, Subagents, MCP
    if ! claude -p "$(cat "$PROMPT_DATEI")" --bare \
        --model "$MODELL" --permission-mode dontAsk \
        --max-turns 3 --max-budget-usd 1.00 \
        --output-format json < "$f" > "$ziel.json"; then
      echo "$name lauf$lauf: Lauf fehlgeschlagen, siehe $ziel.json" >> "$AUSGABE/befunde.txt"
      continue
    fi

    jq -r '.result' "$ziel.json" > "$ziel.md"

    # Deterministische Prüfungen per Werkzeug, nicht per Modell
    anzahl=$(grep -c '^| *TF-' "$ziel.md" || true)
    fremd=0
    while IFS= read -r zitat; do
      grep -qF -- "$zitat" "$f" || { echo "$name lauf$lauf: nicht in Spezifikation: $zitat" >> "$AUSGABE/befunde.txt"; fremd=$((fremd+1)); }
    done < <(grep -o '„[^“]*“' "$ziel.md" | sort -u)
    kosten=$(jq -r '.total_cost_usd // "n/a"' "$ziel.json")
    echo "$name;$lauf;$kosten;$anzahl;$fremd" >> "$AUSGABE/protokoll.csv"
  done
done

# Metadaten für Nachvollziehbarkeit
{
  echo "datum: $(date +%Y-%m-%dT%H:%M:%S%z)"
  echo "modell: $MODELL"
  echo "prompt: $PROMPT_DATEI ($PROMPT_VERSION), sha256 $(shasum -a 256 "$PROMPT_DATEI" | cut -d' ' -f1)"
  echo "claude_code: $(claude --version)"
  echo "git_stand: $(git rev-parse --short HEAD)"
} > "$AUSGABE/metadaten.txt"
echo "Fertig: $AUSGABE"

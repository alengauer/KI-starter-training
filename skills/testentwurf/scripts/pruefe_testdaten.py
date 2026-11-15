#!/usr/bin/env python3
"""Prüft eine Testfalltabelle im CSV-Format deterministisch.

Gehört zum Skill "testentwurf". Nur Python-Standardbibliothek, keine
interaktiven Eingaben, liest nur (ändert keine Dateien).

Ausgabe:   JSON auf stdout, Zusammenfassung und Fehlermeldungen auf stderr.
Exit-Code: 0 = kein Befund, 1 = Befunde, 2 = Aufruffehler.
"""

import argparse
import csv
import io
import json
import re
import sys
import unicodedata

VERSION = "1.0"
STANDARD_PFLICHTSPALTEN = "ID,Klasse,Eingabe,Erwartung,Quelle"
LEER_MARKE = "<leer>"
EXIT_OK, EXIT_BEFUND, EXIT_AUFRUF = 0, 1, 2

HILFE_DETAILS = """\
Was geprüft wird (je Befund Exit-Code 1):
  spalte_fehlt           eine Pflichtspalte fehlt in der Kopfzeile
  spalte_doppelt         ein Spaltenname kommt in der Kopfzeile mehrfach vor
  spaltenzahl            eine Zeile hat mehr oder weniger Felder als die Kopfzeile
  pflichtfeld_leer       ein Pflichtfeld ist leer
  id_doppelt             eine ID kommt mehrfach vor
  soll_laenge_ungueltig  die Soll-Länge ist keine ganze Zahl
  laenge_abweichend      die Eingabe hat nicht die angegebene Soll-Länge

Länge: Anzahl der Unicode-Zeichen (Codepoints) der Eingabe, ohne Kürzen von
Leerzeichen. Eine leere Eingabe wird als <leer> geschrieben (Länge 0); ein leeres
Feld in der Spalte Eingabe gilt als vergessen. Hinweise (ohne Einfluss auf den
Exit-Code) erscheinen bei Leerraum am Rand, bei nicht NFC-normalisierten Eingaben
(z. B. zerlegter Umlaut) und bei Zeichen, die in UTF-16 zwei Einheiten belegen
(z. B. Emoji).

Datei: UTF-8 (mit oder ohne BOM); Trennzeichen Semikolon oder Komma, erkannt an
der Kopfzeile. Spaltennamen ohne Beachtung von Groß-/Kleinschreibung;
"Soll-Länge" und "Soll-Laenge" gelten als gleich.

Beispiele:
  python3 pruefe_testdaten.py testfaelle.csv
  python3 pruefe_testdaten.py testfaelle.csv --nur-befunde
  python3 pruefe_testdaten.py tabelle.csv --pflichtspalten "Nr,Eingabe,Ergebnis" --id-spalte Nr
"""


class Aufruffehler(Exception):
    """Fehler, die der Aufrufer beheben muss (Exit-Code 2)."""


class Parser(argparse.ArgumentParser):
    def error(self, message):
        self.print_usage(sys.stderr)
        sys.stderr.write(f"Aufruffehler: {message}\nHilfe: --help\n")
        sys.exit(EXIT_AUFRUF)


def normiere(name):
    n = name.strip().lower()
    for alt, neu in (("ä", "ae"), ("ö", "oe"), ("ü", "ue"), ("ß", "ss")):
        n = n.replace(alt, neu)
    return n


def lies_text(pfad):
    try:
        if pfad == "-":
            daten = sys.stdin.buffer.read()
        else:
            with open(pfad, "rb") as datei:
                daten = datei.read()
    except FileNotFoundError:
        raise Aufruffehler(f"Datei nicht gefunden: {pfad}")
    except IsADirectoryError:
        raise Aufruffehler(f"Ist ein Ordner, keine Datei: {pfad}")
    except OSError as fehler:
        raise Aufruffehler(f"Datei nicht lesbar: {pfad} ({fehler.strerror})")
    try:
        return daten.decode("utf-8-sig")
    except UnicodeDecodeError as fehler:
        raise Aufruffehler(
            f"Datei ist nicht UTF-8-kodiert (ungültiges Byte an Position {fehler.start}). "
            "Datei als 'CSV UTF-8' speichern und erneut prüfen."
        )


def erkenne_trennzeichen(text):
    for zeile in text.splitlines():
        if zeile.strip():
            semikolon, komma = zeile.count(";"), zeile.count(",")
            return ";" if semikolon >= komma and semikolon > 0 else ","
    raise Aufruffehler("Datei ist leer: keine Kopfzeile gefunden.")


def hinweise_zur_eingabe(eingabe):
    hinweise = []
    if eingabe != eingabe.strip():
        hinweise.append("Eingabe beginnt oder endet mit Leerraum – beabsichtigt?")
    nfc = unicodedata.normalize("NFC", eingabe)
    if nfc != eingabe:
        hinweise.append(
            f"Eingabe ist nicht NFC-normalisiert (z. B. zerlegter Umlaut): "
            f"{len(eingabe)} Zeichen, nach NFC {len(nfc)} Zeichen."
        )
    utf16 = len(eingabe.encode("utf-16-le")) // 2
    if utf16 != len(eingabe):
        hinweise.append(
            f"Enthält Zeichen, die in UTF-16 zwei Einheiten belegen (z. B. Emoji): "
            f"{len(eingabe)} Zeichen, {utf16} UTF-16-Einheiten – Zählweise der Anwendung klären."
        )
    return hinweise


def pruefe(text, pflichtspalten, eingabe_spalte, id_spalte, soll_spalte, trennzeichen):
    befunde = []
    testfaelle = []

    def befund(zeile, tf_id, art, meldung):
        befunde.append({"zeile": zeile, "id": tf_id, "art": art, "meldung": meldung})

    leser = csv.reader(io.StringIO(text, newline=""), delimiter=trennzeichen)
    kopf, kopf_zeile, vorher = None, 0, 0
    zeilen = []
    for feld in leser:
        start, vorher = vorher + 1, leser.line_num
        if kopf is None:
            if any(f.strip() for f in feld):
                kopf, kopf_zeile = [f.strip() for f in feld], start
            continue
        if not any(f.strip() for f in feld):
            continue  # leere Zeile, z. B. ";;;;" am Dateiende
        zeilen.append((start, feld))
    if kopf is None:
        raise Aufruffehler("Datei ist leer: keine Kopfzeile gefunden.")
    while kopf and kopf[-1] == "":
        kopf.pop()  # leere Spalten am Ende, z. B. aus Tabellenkalkulationen

    index = {}
    for i, name in enumerate(kopf):
        schluessel = normiere(name)
        if not schluessel:
            continue
        if schluessel in index:
            befund(kopf_zeile, None, "spalte_doppelt", f"Spalte '{name}' kommt mehrfach vor; ausgewertet wird die erste.")
        else:
            index[schluessel] = i

    for name in pflichtspalten:
        if normiere(name) not in index:
            befund(kopf_zeile, None, "spalte_fehlt",
                   f"Pflichtspalte '{name}' fehlt. Vorhandene Spalten: {', '.join(kopf)}")

    i_eingabe = index.get(normiere(eingabe_spalte))
    i_id = index.get(normiere(id_spalte))
    i_soll = index.get(normiere(soll_spalte))
    i_pflicht = [(n, index[normiere(n)]) for n in pflichtspalten if normiere(n) in index]
    gesehene_ids = {}

    for zeile, feld in zeilen:
        if len(feld) > len(kopf) and not any(f.strip() for f in feld[len(kopf):]):
            feld = feld[:len(kopf)]  # leere Zusatzfelder, z. B. aus Tabellenkalkulationen
        tf_id = feld[i_id].strip() if i_id is not None and i_id < len(feld) else None
        tf_id = tf_id or None
        if len(feld) != len(kopf):
            befund(zeile, tf_id, "spaltenzahl",
                   f"Zeile hat {len(feld)} Felder, die Kopfzeile {len(kopf)}. "
                   "Trennzeichen oder Anführungszeichen im Text prüfen.")
            feld = feld + [""] * (len(kopf) - len(feld))

        for name, i in i_pflicht:
            wert = feld[i]
            leer = (wert == "") if i == i_eingabe else (wert.strip() == "")
            if leer:
                zusatz = f" Leere Eingabe als {LEER_MARKE} schreiben." if i == i_eingabe else ""
                befund(zeile, tf_id, "pflichtfeld_leer", f"Pflichtfeld '{kopf[i]}' ist leer.{zusatz}")

        if tf_id is not None:
            if tf_id in gesehene_ids:
                befund(zeile, tf_id, "id_doppelt",
                       f"ID '{tf_id}' kommt mehrfach vor (zuerst in Zeile {gesehene_ids[tf_id]}).")
            else:
                gesehene_ids[tf_id] = zeile

        eintrag = {"zeile": zeile, "id": tf_id, "eingabe": None, "laenge": None,
                   "soll_laenge": None, "hinweise": []}
        if i_eingabe is not None and feld[i_eingabe] != "":
            roh = feld[i_eingabe]
            eingabe = "" if roh.strip() == LEER_MARKE else roh
            eintrag["eingabe"] = roh
            eintrag["laenge"] = len(eingabe)
            eintrag["hinweise"] = hinweise_zur_eingabe(eingabe)
            if i_soll is not None and feld[i_soll].strip() != "":
                soll_text = feld[i_soll].strip()
                if re.fullmatch(r"\d+", soll_text):
                    soll = int(soll_text)
                    eintrag["soll_laenge"] = soll
                    if soll != len(eingabe):
                        befund(zeile, tf_id, "laenge_abweichend",
                               f"Eingabe hat {len(eingabe)} Zeichen, Soll-Länge ist {soll}.")
                else:
                    befund(zeile, tf_id, "soll_laenge_ungueltig",
                           f"Soll-Länge '{soll_text}' ist keine ganze Zahl.")
        testfaelle.append(eintrag)

    return kopf, testfaelle, befunde


def als_json(ergebnis):
    """Gültiges JSON, Listeneinträge je eine Zeile (gut lesbar, vorhersehbare Länge)."""
    zeilen = []
    for schluessel, wert in ergebnis.items():
        name = json.dumps(schluessel)
        if isinstance(wert, list) and wert and isinstance(wert[0], dict):
            eintraege = ",\n".join("    " + json.dumps(e, ensure_ascii=False) for e in wert)
            zeilen.append(f"  {name}: [\n{eintraege}\n  ]")
        else:
            zeilen.append(f"  {name}: {json.dumps(wert, ensure_ascii=False)}")
    return "{\n" + ",\n".join(zeilen) + "\n}\n"


def main(argv=None):
    parser = Parser(
        prog="pruefe_testdaten.py",
        description="Prüft eine Testfalltabelle (CSV): Pflichtspalten, leere Pflichtfelder, "
                    "doppelte IDs und die Länge jeder Eingabe in Zeichen. "
                    "Ausgabe als JSON auf stdout; Exit-Code 0 = kein Befund, 1 = Befunde, 2 = Aufruffehler.",
        epilog=HILFE_DETAILS,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("datei", help="CSV-Datei (UTF-8); '-' liest von der Standardeingabe")
    parser.add_argument("--pflichtspalten", default=STANDARD_PFLICHTSPALTEN,
                        help=f"durch Komma getrennte Pflichtspalten (Standard: {STANDARD_PFLICHTSPALTEN})")
    parser.add_argument("--eingabe-spalte", default="Eingabe",
                        help="Spalte, deren Länge gezählt wird (Standard: Eingabe)")
    parser.add_argument("--id-spalte", default="ID",
                        help="Spalte mit der Testfall-ID für die Dublettenprüfung (Standard: ID)")
    parser.add_argument("--soll-spalte", default="Soll-Laenge",
                        help="optionale Spalte mit der beabsichtigten Länge (Standard: Soll-Laenge)")
    parser.add_argument("--trennzeichen", choices=["auto", ";", ","], default="auto",
                        help="Trennzeichen (Standard: auto, erkannt an der Kopfzeile)")
    parser.add_argument("--nur-befunde", action="store_true",
                        help="in 'testfaelle' nur Zeilen mit Befund oder Hinweis ausgeben (kürzere Ausgabe)")
    parser.add_argument("--version", action="version", version=f"%(prog)s {VERSION}")
    args = parser.parse_args(argv)

    pflichtspalten = [s.strip() for s in re.split(r"[;,]", args.pflichtspalten) if s.strip()]
    if not pflichtspalten:
        parser.error("--pflichtspalten enthält keinen Spaltennamen.")

    try:
        text = lies_text(args.datei)
        trennzeichen = erkenne_trennzeichen(text) if args.trennzeichen == "auto" else args.trennzeichen
        kopf, testfaelle, befunde = pruefe(text, pflichtspalten, args.eingabe_spalte,
                                           args.id_spalte, args.soll_spalte, trennzeichen)
    except Aufruffehler as fehler:
        sys.stderr.write(f"Aufruffehler: {fehler}\n")
        return EXIT_AUFRUF

    anzahl_testfaelle = len(testfaelle)
    zeilen_mit_befund = {b["zeile"] for b in befunde}
    if args.nur_befunde:
        testfaelle = [t for t in testfaelle if t["zeile"] in zeilen_mit_befund or t["hinweise"]]

    ergebnis = {
        "datei": args.datei,
        "trennzeichen": trennzeichen,
        "spalten": kopf,
        "pflichtspalten": pflichtspalten,
        "anzahl_testfaelle": anzahl_testfaelle,
        "anzahl_befunde": len(befunde),
        "ergebnis": "befunde" if befunde else "ok",
        "befunde": befunde,
        "testfaelle": testfaelle,
    }
    sys.stdout.write(als_json(ergebnis))

    arten = {}
    for b in befunde:
        arten[b["art"]] = arten.get(b["art"], 0) + 1
    zusammenfassung = ", ".join(f"{art}: {anzahl}" for art, anzahl in sorted(arten.items()))
    sys.stderr.write(
        f"pruefe_testdaten: {len(befunde)} Befund(e)"
        + (f" ({zusammenfassung})" if zusammenfassung else "")
        + f", Exit-Code {EXIT_BEFUND if befunde else EXIT_OK}.\n"
    )
    return EXIT_BEFUND if befunde else EXIT_OK


if __name__ == "__main__":
    sys.exit(main())

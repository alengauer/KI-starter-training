// Beispiel-PLZ-Verzeichnis (F03, UC 1.1.2.3 und 1.1.2.4) anstelle eines Adressdienstes.
// Adressen außerhalb dieser Liste werden abgelehnt; Straßen werden nicht geprüft.

export const POSTAL_DIRECTORY: ReadonlyMap<string, string> = new Map([
  ['01067', 'Dresden'],
  ['04109', 'Leipzig'],
  ['10115', 'Berlin'],
  ['10117', 'Berlin'],
  ['14467', 'Potsdam'],
  ['20095', 'Hamburg'],
  ['24103', 'Kiel'],
  ['28195', 'Bremen'],
  ['30159', 'Hannover'],
  ['35390', 'Gießen'],
  ['40213', 'Düsseldorf'],
  ['44135', 'Dortmund'],
  ['44575', 'Castrop-Rauxel'],
  ['50667', 'Köln'],
  ['53111', 'Bonn'],
  ['60311', 'Frankfurt am Main'],
  ['66111', 'Saarbrücken'],
  ['70173', 'Stuttgart'],
  ['79098', 'Freiburg im Breisgau'],
  ['80331', 'München'],
  ['82467', 'Garmisch-Partenkirchen'],
  ['86150', 'Augsburg'],
  ['88662', 'Überlingen'],
  ['90402', 'Nürnberg'],
  ['93047', 'Regensburg'],
  ['96047', 'Bamberg'],
  ['96444', 'Coburg'],
  ['96450', 'Coburg'],
  ['97070', 'Würzburg'],
  ['99084', 'Erfurt'],
]);

function normalizeCity(city: string): string {
  return city.normalize('NFC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('de');
}

const KNOWN_CITIES = new Set([...POSTAL_DIRECTORY.values()].map(normalizeCity));

export function isKnownPostalCode(postalCode: string): boolean {
  return POSTAL_DIRECTORY.has(postalCode.trim());
}

export function isKnownCity(city: string): boolean {
  return KNOWN_CITIES.has(normalizeCity(city));
}

export function postalCodeMatchesCity(postalCode: string, city: string): boolean {
  const expected = POSTAL_DIRECTORY.get(postalCode.trim());
  return expected !== undefined && normalizeCity(expected) === normalizeCity(city);
}

export const offerLines = [
  ['s1', 130, 'm²', 'Ίχνος εδάφους μιας όψης', 'Raw space, one side'],
  ['s2', 140, 'm²', 'Ίχνος εδάφους δύο όψεων', 'Raw space, two sides'],
  ['s3', 150, 'm²', 'Ίχνος εδάφους τριών όψεων', 'Raw space, three sides'],
  ['s4', 160, 'm²', 'Ίχνος εδάφους τεσσάρων όψεων', 'Raw space, four sides'],
  ['mini', 990, 'τεμ.', 'Mini booth 6 τ.μ. με τυποποιημένη κατασκευή', 'Mini booth 6 m² with preconstructed booth'],
  ['outdoor', 60, 'm²', 'Υπαίθριος χώρος', 'Outdoor space'],
  ['booth', 35, 'm²', 'Τυποποιημένη κατασκευή HELEXPO τύπου 2', 'HELEXPO standard booth, Type 2'],
  ['stage', 500, 'τεμ.', 'Μισάωρη εκδήλωση στο Open Stage', 'Half-hour event on the Open Stage'],
] as const;

type Line = (typeof offerLines)[number][0];
export type OfferLanguage = 'el' | 'en';
type Amount = number | string;
export type OfferNumbers = {
  prices: Partial<Record<Line, Amount>>;
  quantities: Partial<Record<Line, Amount>>;
  discount: Amount;
  extraDiscount: Amount;
  registration: Amount;
  vat: Amount;
};

export const defaultPayment = {
  el: 'Με την οριστικοποίηση της Δήλωσης Συμμετοχής θα πρέπει να κατατεθεί το 50% του συνολικού ποσού του τιμολογίου και η εξόφληση να πραγματοποιηθεί κατά το προπαρασκευαστικό στάδιο της έκθεσης, έως 01/03/2027.\n\nΣε περίπτωση εξόφλησης με επιταγές, θα πρέπει με την οριστικοποίηση της Δήλωσης Συμμετοχής να κατατεθούν δύο επιταγές για το 50% η καθεμία, με λήξεις 01/03/2027 και 09/05/2027.',
  en: 'Once the Participation Form has been finalized, full payment of the total amount is due immediately.',
};

const amount = (value: Amount | undefined) => {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
};

export function calculateOffer(offer: OfferNumbers) {
  const lines = Object.fromEntries(
    offerLines.map(([key]) => [key, amount(offer.prices[key]) * amount(offer.quantities[key])]),
  ) as Record<Line, number>;
  const space = lines.s1 + lines.s2 + lines.s3 + lines.s4 + lines.outdoor;
  const discount = (space * Math.min(100, amount(offer.discount))) / 100;
  const extraDiscount = ((space - discount) * Math.min(100, amount(offer.extraDiscount))) / 100;
  const net = space - discount - extraDiscount + lines.mini + lines.booth + lines.stage + amount(offer.registration);
  const total = net > 100 ? net : 0; // ίδιος κανόνας με το πρότυπο Excel
  const vat = (total * amount(offer.vat)) / 100;
  return { lines, space, discount, extraDiscount, total, vat, final: total + vat };
}

import { fold } from './text';

const greek = Object.fromEntries(
  Array.from('αβγδεζηθικλμνξοπρστυφχψω', (letter, index) => [
    letter,
    'a v g d e z i th i k l m n x o p r s t y f ch ps o'.split(' ')[index],
  ]),
);
const legalWords = new Set(
  'ae ike oe ee epe mepe sa ltd limited llc inc co corp corporation company gmbh ag srl spa bv nv plc kft sro doo hellas ellas ellados greece the kai and monoprosopi s a e k o'.split(
    ' ',
  ),
);

export function companyNameWords(name: string) {
  return fold(name)
    .replace(/ς/g, 'σ')
    .replace(/[α-ω]/g, (letter) => greek[letter] ?? letter)
    .split(/[^a-z0-9]+/)
    .filter((word) => word && !legalWords.has(word));
}

function editDistance(a: string, b: string) {
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min(previous[j] + 1, row[j - 1] + 1, previous[j - 1] + Number(a[i - 1] !== b[j - 1]));
    }
    previous = row;
  }
  return previous[b.length];
}

export function companySimilarity(a: string[], b: string[]) {
  const [short, long] = [a.join(''), b.join('')].sort((x, y) => x.length - y.length);
  if (!short) return 0;
  if (short === long) return 1;
  const shared = new Set(a.filter((word) => b.includes(word))).size;
  const union = new Set([...a, ...b]).size;
  return Math.max(
    short.length >= 5 && long.startsWith(short) ? 0.93 : 0,
    short.length >= 6 && long.includes(short) ? 0.82 : 0,
    shared === Math.min(a.length, b.length) && shared >= 2 && short.length >= 8 ? 0.85 : 0,
    (0.95 * shared) / union,
    long.length <= 40 && short.length >= 3 ? 1 - editDistance(short, long) / long.length : 0,
  );
}

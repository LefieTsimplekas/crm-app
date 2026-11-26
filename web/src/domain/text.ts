/** Κανονικοποίηση για συγκρίσεις: πεζά, χωρίς περιττά κενά. */
export const norm = (v: unknown): string =>
  String(v ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');

/** Όπως το norm, χωρίς τόνους (για αναζήτηση). */
export const fold = (v: unknown): string =>
  String(v ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/ς/g, 'σ')
    .trim();

/** Κωδικός εταιρείας από «12 · Όνομα» ή αριθμό· 0 αν δεν υπάρχει. */
export function parseCode(v: unknown): number {
  if (typeof v === 'number') return v;
  const m = String(v ?? '').match(/^\s*(\d+)\s*(·|$)/);
  return m ? Number(m[1]) : 0;
}

/** Ημέρα ως ακέραιος (ημέρες από 1/1/1970, UTC) — ίδια για όλους, ανεξάρτητα από ώρα/ζώνη. */
export const dayFromISO = (iso: string | null | undefined): number => {
  if (!iso) return 0;
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return y && m && d ? Math.floor(Date.UTC(y, m - 1, d) / 86400000) : 0;
};
export const todayDay = (now = new Date()): number =>
  Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
export const formatDay = (day: number): string => {
  if (!day) return '';
  const d = new Date(day * 86400000);
  return `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()}`;
};

const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
export const emailsOf = (v: unknown): string[] => String(v ?? '').match(EMAIL_RE) ?? [];

/** Χειριστές από «Α, Β». */
export const handlerParts = (v: unknown): string[] =>
  String(v ?? '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);

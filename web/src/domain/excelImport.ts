import { fold, norm } from './text';

export const importFields = [
  [
    'company',
    'Εταιρεία',
    ['εταιρεια', 'επωνυμια', 'company', 'organisation', 'organization', 'εκθετης', 'exhibitor', 'brand'],
  ],
  ['sector', 'Κλάδος', ['κλαδος', 'sector', 'industry', 'δραστηριοτητα']],
  ['country', 'Χώρα', ['χωρα', 'country']],
  ['contact', 'Ονοματεπώνυμο επαφής', ['ονοματεπωνυμο', 'contact person', 'contact', 'επαφη', 'full name']],
  ['role', 'Θέση', ['θεση', 'position', 'job title', 'role']],
  ['phone', 'Τηλέφωνο', ['τηλεφωνο', 'phone', 'tel', 'mobile', 'κινητο']],
  ['email', 'Email', ['email', 'e-mail', 'mail']],
  ['sqm', 'Τ.μ.', ['τ.μ.', 'τ.μ', 'τμ', 'sqm', 'm2', 'τετραγωνικα']],
  ['notes', 'Σημειώσεις lead', ['σημειωσεις', 'notes', 'comments']],
  ['list_comments', 'Αρχικά σχόλια List', ['αρχικα σχολια', 'list comments']],
] as const;

export type ImportField = (typeof importFields)[number][0];
export type ImportMapping = Partial<Record<ImportField, string>>;
export type ImportSheet = { name: string; rows: string[][] };

export async function readImportFile(file: File): Promise<ImportSheet[]> {
  if (/\.csv$/i.test(file.name)) {
    const bytes = await file.arrayBuffer();
    const utf8 = new TextDecoder().decode(bytes);
    const source = utf8.includes('\uFFFD') ? new TextDecoder('windows-1253').decode(bytes) : utf8;
    const { default: Papa } = await import('papaparse');
    const result = Papa.parse<string[]>(source, { delimitersToGuess: [',', ';', '\t', '|'] });
    const error = result.errors.find((item) => item.type === 'Quotes');
    if (error) throw new Error('Το CSV έχει εντοπισμένο πρόβλημα στα εισαγωγικά.');
    return [{ name: 'CSV', rows: result.data }];
  }
  if (!/\.xlsx$/i.test(file.name)) throw new Error('Επιλέξτε αρχείο .xlsx ή .csv.');
  const { default: readWorkbook } = await import('read-excel-file/browser');
  return (await readWorkbook(file)).map(({ sheet, data }) => ({
    name: sheet,
    rows: data.map((row) =>
      row.map((cell) => (cell instanceof Date ? cell.toISOString().slice(0, 10) : String(cell ?? ''))),
    ),
  }));
}

export function sheetColumns(sheet: ImportSheet) {
  const firstNonempty = sheet.rows.findIndex((row) => row.some((cell) => cell.trim()));
  if (firstNonempty < 0) return { headers: [], rows: [] };
  const headers = sheet.rows[firstNonempty];
  const rows = sheet.rows
    .slice(firstNonempty + 1)
    .flatMap((cells, index) => (cells.some((cell) => cell.trim()) ? [{ line: firstNonempty + index + 2, cells }] : []));
  return { headers, rows };
}

export function guessImportMapping(headers: string[]): ImportMapping {
  const used = new Set<number>();
  const result: ImportMapping = {};
  for (const [key, , aliases] of importFields) {
    const index = headers.findIndex((title, i) => !used.has(i) && aliases.some((alias) => fold(title) === fold(alias)));
    if (index < 0) continue;
    result[key] = String(index);
    used.add(index);
  }
  return result;
}

export function companyImportKey(name: string) {
  return norm(fold(name))
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

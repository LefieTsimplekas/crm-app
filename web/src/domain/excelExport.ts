import type { Cell } from 'write-excel-file/browser';
import { formatDay } from './text';
import type { Dataset, Derived } from './types';

type ExcelColumn<T> = [header: string, value: (row: T) => Cell];

function sheet<T>(name: string, rows: Iterable<T>, columns: ExcelColumn<T>[]) {
  return {
    sheet: name,
    dateFormat: 'dd/mm/yyyy',
    columns: columns.map(([title]) => ({ width: Math.min(50, Math.max(10, title.length + 2)) })),
    data: [columns.map(([title]) => title), ...Array.from(rows, (row) => columns.map(([, value]) => value(row)))],
  };
}

const excelDate = (day: number) => (day ? new Date(day * 86_400_000) : null);

function excelArea(area: number | string | null) {
  if (area === null || area === '') return null;
  const value = Number(area);
  return Number.isFinite(value) ? value : area;
}

export function exportSheets(dataset: Dataset, derived: Derived) {
  const listNames = Object.keys(dataset.lists);
  const lastListPosition = Math.max(-1, ...Object.values(dataset.lists).map((list) => list.findLastIndex(Boolean)));

  return [
    sheet('Εταιρείες', derived.companies.values(), [
      ['Κωδ.', (company) => company.code],
      ['Εταιρεία', (company) => company.name],
      ['Κλάδος', (company) => company.row.sector],
      ['Χώρα', (company) => company.row.country],
      ['FG/RET', (company) => company.row.fgret],
      ['Contact Person', (company) => company.person],
      ['Τηλέφωνο', (company) => company.phone],
      ['Email', (company) => company.email],
      ['Αρ. επαφών', (company) => company.contacts.length],
      ['Tellody', (company) => company.row.tellody],
      ['Σύνδεσμος αρχείων', (company) => company.row.files_link],
      ['Αναγνωριστικό List', (company) => company.row.list_id],
      ['Χρονιές ως lead', (company) => company.leads.length],
    ]),
    sheet('Leads', derived.leads, [
      ['Κωδ.', (lead) => lead.code],
      ['Εταιρεία', (lead) => lead.companyName],
      ['Χρονιά', (lead) => lead.year],
      ['Κλάδος', (lead) => lead.company?.row.sector],
      ['Contact Person', (lead) => lead.company?.person],
      ['Τηλέφωνο', (lead) => lead.company?.phone],
      ['Email', (lead) => lead.company?.email],
      ['Προέλευση', (lead) => lead.row.source],
      ['Χειριστής', (lead) => lead.handler],
      ['Πορεία ενδιαφέροντος', (lead) => lead.stage],
      ['Χορηγία', (lead) => lead.sponsor],
      ['Λόγος ακύρωσης', (lead) => lead.row.cancel_reason],
      ['Hall', (lead) => lead.row.hall],
      ['Αριθμός Stand', (lead) => lead.row.stand],
      ['Τ.μ.', (lead) => excelArea(lead.row.sqm)],
      ['Εκθέτης προηγ. χρονιάς', (lead) => (lead.prevExhibitor ? 'Ναι' : 'Όχι')],
      ['Τελευταία ενέργεια', (lead) => excelDate(lead.lastDay)],
      ['Τι έγινε τελευταία', (lead) => lead.lastDescription],
      ['Σημειώσεις', (lead) => lead.row.notes],
      [
        'Ιστορικό ενεργειών',
        (lead) =>
          lead.actions
            .map((action) =>
              [formatDay(action.day), action.type ? `[${action.type}]` : '', action.description]
                .filter(Boolean)
                .join(' '),
            )
            .join('\n'),
      ],
      ['Αρχικά σχόλια List', (lead) => lead.row.list_comments],
    ]),
    sheet('Ενέργειες', derived.actions, [
      ['Ημερομηνία', (action) => excelDate(action.day)],
      ['Κωδ.', (action) => action.code],
      ['Εταιρεία', (action) => action.companyName],
      ['Χρονιά lead', (action) => action.year || null],
      ['Τύπος ενέργειας', (action) => action.type],
      ['Περιγραφή', (action) => action.description],
      ['Χειριστής', (action) => action.handler],
    ]),
    sheet('Επαφές', dataset.contacts, [
      ['Κωδ.', (contact) => contact.company_code],
      ['Εταιρεία', (contact) => derived.companies.get(contact.company_code)?.name],
      ['Ονοματεπώνυμο', (contact) => contact.name],
      ['Θέση', (contact) => contact.role],
      ['Τηλέφωνο', (contact) => contact.phone],
      ['Email', (contact) => contact.email],
      ['Κύρια επαφή', (contact) => (contact.is_primary ? 'Ναι' : 'Όχι')],
      ['Σημειώσεις', (contact) => contact.notes],
    ]),
    sheet<number>(
      'Ρυθμίσεις',
      Array.from({ length: lastListPosition + 1 }, (_, index) => index),
      listNames.map((name) => [name, (index) => dataset.lists[name][index] || null]),
    ),
  ];
}

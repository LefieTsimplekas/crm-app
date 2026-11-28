import { describe, expect, it } from 'vitest';
import { companyNameWords, companySimilarity } from './companyNames';
import { guessImportMapping, readImportFile, sheetColumns } from './excelImport';
import { calculateOffer } from './offer';

describe('εισαγωγή εταιρειών', () => {
  it('διατηρεί εισαγωγικά, κενές γραμμές και μικτούς τίτλους στο CSV', async () => {
    const file = new File(
      ['\nΕταιρεία;Country;Τ.μ.;Σημειώσεις\n\n"Alpha; Energy";Greece;12,5;"A ""quote"""\n'],
      'leads.csv',
    );
    const [sheet] = await readImportFile(file);
    const { headers, rows } = sheetColumns(sheet);

    expect(guessImportMapping(headers)).toEqual({ company: '0', country: '1', sqm: '2', notes: '3' });
    expect(rows).toEqual([{ line: 4, cells: ['Alpha; Energy', 'Greece', '12,5', 'A "quote"'] }]);
  });

  it('αναγνωρίζει παρόμοιες λατινικές και ελληνικές επωνυμίες', () => {
    const name = companyNameWords('ΑΛΦΑ ΕΝΕΡΓΕΙΑ Α.Ε.');
    expect(companySimilarity(name, companyNameWords('Alfa Energeia Ltd'))).toBe(1);
    expect(companySimilarity(name, companyNameWords('Solar Corp'))).toBeLessThan(0.8);
  });
});

describe('οικονομικές προσφορές', () => {
  it('εφαρμόζει τις διαδοχικές εκπτώσεις στον χώρο και ΦΠΑ στο καθαρό σύνολο', () => {
    const offer = calculateOffer({
      prices: { s1: 140, booth: 35 },
      quantities: { s1: 16, booth: 16 },
      discount: 10,
      extraDiscount: 5,
      registration: 110,
      vat: 24,
    });
    expect(offer.space).toBe(2240);
    expect(offer.total).toBeCloseTo(2585.2);
    expect(offer.final).toBeCloseTo(3205.648);
  });

  it('διατηρεί το όριο των 100 ευρώ του αρχικού προτύπου', () => {
    const offer = calculateOffer({
      prices: {},
      quantities: {},
      discount: 0,
      extraDiscount: 0,
      registration: 100,
      vat: 24,
    });
    expect(offer.final).toBe(0);
  });
});

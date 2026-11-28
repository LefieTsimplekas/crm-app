import { emailsOf } from '../domain/text';
import type { Company } from '../domain/types';
import { supabase } from './supabase';

export type SectorCompany = { code: number; name: string; country: string; domain: string };
export type SectorSuggestion = { code: number; sector: string; confidence: number; reason: string };

const webmail = new Set([
  'gmail.com',
  'yahoo.com',
  'yahoo.gr',
  'hotmail.com',
  'hotmail.gr',
  'outlook.com',
  'live.com',
  'icloud.com',
  'aol.com',
  'protonmail.com',
  'proton.me',
  'mail.com',
  'otenet.gr',
  'yandex.com',
  'mail.ru',
  'gmx.de',
  'gmx.com',
]);

export function sectorCompany(company: Company): SectorCompany {
  const email = company.contacts
    .flatMap((contact) => emailsOf(contact.email))
    .find((address) => !webmail.has(address.split('@')[1].toLowerCase()));
  return {
    code: company.code,
    name: company.name,
    country: company.row.country ?? '',
    domain: email?.split('@')[1].toLowerCase() ?? '',
  };
}

export async function suggestSectors(companies: SectorCompany[], sectors: string[]) {
  if (!sectors.length) throw new Error('Η λίστα «Κλάδος» στις Ρυθμίσεις είναι κενή.');
  const { data, error } = await supabase.functions.invoke<{ results: SectorSuggestion[] }>('suggest-sector', {
    body: { companies, sectors },
  });
  if (error) {
    const response = error.context as Response | undefined;
    let code = '';
    try {
      code = String((await response?.json())?.error ?? '');
    } catch {
      /* Μη αναγνώσιμη απάντηση. */
    }
    if (response?.status === 404) throw new Error('Η Edge Function «suggest-sector» δεν είναι διαθέσιμη στο Supabase.');
    if (code === 'missing_groq_key') throw new Error('Λείπει το GROQ_API_KEY από τα Secrets του Supabase.');
    if (code === 'rate_limited' || response?.status === 429)
      throw new Error('Το όριο του Groq εξαντλήθηκε προσωρινά. Δοκιμάστε αργότερα.');
    throw new Error('Η πρόταση κλάδου δεν ολοκληρώθηκε.');
  }
  const valid = new Set(companies.map((company) => company.code));
  return (data?.results ?? []).filter((result) => valid.has(result.code) && sectors.includes(result.sector));
}

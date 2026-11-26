/** Γραμμές όπως έρχονται από τη βάση (Supabase). */
export interface CompanyRow {
  code: number;
  name: string;
  sector: string | null;
  country: string | null;
  fgret: string | null;
  tellody: string | null;
  files_link: string | null;
  list_id: string | null;
  created_at?: string;
}
export interface LeadRow {
  id: number;
  company_code: number;
  year: number;
  source: string | null;
  handler: string | null;
  stage: string | null;
  sponsor: string | null;
  cancel_reason: string | null;
  hall: string | null;
  stand: string | null;
  sqm: number | string | null;
  notes: string | null;
  list_comments: string | null;
  created_at?: string;
}
export interface ActionRow {
  id: number;
  company_code: number;
  lead_year: number | null;
  action_date: string;
  type: string | null;
  description: string | null;
  handler: string | null;
  created_at?: string;
}
export interface ContactRow {
  id: number;
  company_code: number;
  name: string;
  role: string | null;
  phone: string | null;
  email: string | null;
  is_primary: boolean;
  notes: string | null;
  created_at?: string;
}
export interface ListRow {
  list_name: string;
  position: number;
  value: string;
}

export interface Dataset {
  companies: CompanyRow[];
  leads: LeadRow[];
  actions: ActionRow[];
  contacts: ContactRow[];
  /** όνομα λίστας → 25 θέσεις (κενό = ελεύθερη) */
  lists: Record<string, string[]>;
}

/** Υπολογισμένα στοιχεία (ό,τι έκαναν οι τύποι του Excel). */
export interface Company {
  code: number;
  name: string;
  row: CompanyRow;
  contacts: ContactRow[];
  leads: Lead[];
  actions: Action[];
  person: string;
  phone: string;
  email: string;
}
export interface Action {
  id: number;
  code: number;
  year: number;
  day: number;
  type: string;
  description: string;
  handler: string;
  companyName: string;
}
export interface Lead {
  id: number;
  code: number;
  year: number;
  row: LeadRow;
  company: Company | undefined;
  companyName: string;
  stage: string;
  sponsor: string;
  handler: string;
  actions: Action[];
  /** μέρα τελευταίας ενέργειας (0 = καμία) */
  lastDay: number;
  lastDescription: string;
  open: boolean;
  won: boolean;
  lost: boolean;
  prevExhibitor: boolean;
}
export interface Derived {
  companies: Map<number, Company>;
  leads: Lead[];
  actions: Action[];
}

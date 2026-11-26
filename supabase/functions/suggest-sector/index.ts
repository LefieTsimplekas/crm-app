// Supabase Edge Function: suggest-sector
// Προτείνει κλάδο για εταιρείες, ρωτώντας το Groq. Το κλειδί GROQ_API_KEY μένει κρυφό στα Secrets του Supabase.
// Δέχεται ΜΟΝΟ: όνομα εταιρείας, χώρα, domain email – και τη λίστα κλάδων. Απαντά μόνο σε συνδεδεμένους χρήστες.
import { createClient } from "jsr:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });
const clip = (v: unknown, n: number) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, n);

async function pickModel(key: string): Promise<string> {
  // αν το προεπιλεγμένο μοντέλο αποσυρθεί, διαλέγουμε ένα από τα διαθέσιμα
  const r = await fetch("https://api.groq.com/openai/v1/models", { headers: { Authorization: `Bearer ${key}` } });
  const ids: string[] = r.ok ? ((await r.json()).data || []).map((m: { id: string }) => m.id) : [];
  const chat = ids.filter((id) => !/whisper|tts|guard|prompt|embed|compound|orpheus|playai/i.test(id));
  return chat.find((id) => /llama.*70b|versatile/i.test(id)) || chat.find((id) => /gpt-oss|llama|qwen|mixtral|gemma/i.test(id)) || chat[0] || "";
}

async function askGroq(key: string, model: string, sectors: string[], companies: unknown[]) {
  const system =
    "Κατατάσσεις εταιρείες που ενδιαφέρονται για την έκθεση ενέργειας ENERGY (Helexpo, Θεσσαλονίκη) σε ΕΝΑΝ κλάδο από τη λίστα που σου δίνεται. " +
    "Χρησιμοποίησε ΜΟΝΟ τιμές της λίστας, γραμμένες ακριβώς όπως είναι. Αν δεν ξέρεις την εταιρεία, κρίνε από το όνομα και το domain και βάλε χαμηλή βεβαιότητα. " +
    "Αν δεν μπορείς να κρίνεις καθόλου, βάλε sector κενό και confidence 0. Μην επινοείς στοιχεία. " +
    'Απάντησε μόνο με JSON: {"results":[{"code":<αριθμός>,"sector":"<τιμή από τη λίστα ή κενό>","confidence":<0 έως 1>,"reason":"<σύντομη αιτιολόγηση στα ελληνικά, έως 15 λέξεις>"}]}';
  const user = JSON.stringify({ sectors, companies });
  const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, temperature: 0, response_format: { type: "json_object" },
      messages: [{ role: "system", content: system }, { role: "user", content: user }] }),
  });
  const body = await r.json().catch(() => ({}));
  return { ok: r.ok, status: r.status, body };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  try {
    // 1) μόνο συνδεδεμένοι χρήστες της εφαρμογής
    const token = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY") || "");
    const { data: u, error: ue } = await sb.auth.getUser(token);
    if (ue || !u?.user) return json({ error: "not_authenticated" }, 401);

    const key = Deno.env.get("GROQ_API_KEY");
    if (!key) return json({ error: "missing_groq_key" }, 500);

    // 2) δεχόμαστε μόνο τα ελάχιστα πεδία, κομμένα σε λογικό μήκος
    const inp = await req.json().catch(() => ({}));
    const sectors: string[] = (Array.isArray(inp.sectors) ? inp.sectors : []).map((s: unknown) => clip(s, 80)).filter(Boolean).slice(0, 60);
    const companies = (Array.isArray(inp.companies) ? inp.companies : []).slice(0, 25).map((c: Record<string, unknown>) => ({
      code: Number(c.code) || 0, name: clip(c.name, 120), country: clip(c.country, 60), domain: clip(c.domain, 80).toLowerCase(),
    })).filter((c: { code: number; name: string }) => c.code && c.name);
    if (!sectors.length || !companies.length) return json({ error: "bad_request" }, 400);

    // 3) ερώτηση στο Groq (με αυτόματη αλλαγή μοντέλου αν το προεπιλεγμένο δεν υπάρχει πια)
    let model = Deno.env.get("GROQ_MODEL") || "llama-3.3-70b-versatile";
    let res = await askGroq(key, model, sectors, companies);
    if (!res.ok && (res.status === 404 || /model/i.test(JSON.stringify(res.body?.error || "")))) {
      const alt = await pickModel(key);
      if (alt && alt !== model) { model = alt; res = await askGroq(key, model, sectors, companies); }
    }
    if (!res.ok) return json({ error: res.status === 429 ? "rate_limited" : "groq_error", detail: clip(res.body?.error?.message, 200) }, res.status === 429 ? 429 : 502);

    // 4) έλεγχος απάντησης: μόνο κλάδοι της λίστας, μόνο κωδικοί που ζητήθηκαν
    let parsed: { results?: Array<Record<string, unknown>> } = {};
    try { parsed = JSON.parse(res.body?.choices?.[0]?.message?.content || "{}"); } catch { parsed = {}; }
    const wanted = new Set(companies.map((c: { code: number }) => c.code));
    const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
    const byNorm = new Map(sectors.map((s) => [norm(s), s]));
    const results = (parsed.results || []).map((r) => {
      const sector = byNorm.get(norm(clip(r.sector, 80))) || "";
      const conf = Math.max(0, Math.min(1, Number(r.confidence) || 0));
      return { code: Number(r.code) || 0, sector, confidence: sector ? conf : 0, reason: clip(r.reason, 160) };
    }).filter((r) => wanted.has(r.code));
    return json({ results, model });
  } catch (e) {
    return json({ error: "server_error", detail: clip((e as Error)?.message, 200) }, 500);
  }
});

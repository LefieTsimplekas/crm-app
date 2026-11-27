import { Core } from "./store.js";
import { mountCrm } from "./CrmShell.jsx";

// Χώρες: «Αγγλικά|Ελληνικά|άλλες ονομασίες…». Αποθηκεύεται το αγγλικό όνομα.
const COUNTRIES_RAW = `Afghanistan|Αφγανιστάν
Albania|Αλβανία
Algeria|Αλγερία
Andorra|Ανδόρα
Angola|Αγκόλα
Antigua and Barbuda|Αντίγκουα και Μπαρμπούντα
Argentina|Αργεντινή
Armenia|Αρμενία
Australia|Αυστραλία
Austria|Αυστρία
Azerbaijan|Αζερμπαϊτζάν
Bahamas|Μπαχάμες
Bahrain|Μπαχρέιν
Bangladesh|Μπανγκλαντές
Barbados|Μπαρμπάντος
Belarus|Λευκορωσία
Belgium|Βέλγιο
Belize|Μπελίζ
Benin|Μπενίν
Bhutan|Μπουτάν
Bolivia|Βολιβία
Bosnia and Herzegovina|Βοσνία και Ερζεγοβίνη|Bosnia
Botswana|Μποτσουάνα
Brazil|Βραζιλία
Brunei|Μπρουνέι
Bulgaria|Βουλγαρία
Burkina Faso|Μπουρκίνα Φάσο
Burundi|Μπουρούντι
Cambodia|Καμπότζη
Cameroon|Καμερούν
Canada|Καναδάς
Cape Verde|Πράσινο Ακρωτήριο
Central African Republic|Κεντροαφρικανική Δημοκρατία
Chad|Τσαντ
Chile|Χιλή
China|Κίνα|PRC|P.R. China
Colombia|Κολομβία
Comoros|Κομόρες
Congo|Κονγκό
Costa Rica|Κόστα Ρίκα
Croatia|Κροατία
Cuba|Κούβα
Cyprus|Κύπρος
Czech Republic|Τσεχία|Czechia|Τσεχική Δημοκρατία
Democratic Republic of the Congo|Λαϊκή Δημοκρατία του Κονγκό|DR Congo
Denmark|Δανία
Djibouti|Τζιμπουτί
Dominica|Δομινίκα
Dominican Republic|Δομινικανή Δημοκρατία
Ecuador|Ισημερινός
Egypt|Αίγυπτος
El Salvador|Ελ Σαλβαδόρ
Equatorial Guinea|Ισημερινή Γουινέα
Eritrea|Ερυθραία
Estonia|Εσθονία
Eswatini|Εσουατίνι|Swaziland
Ethiopia|Αιθιοπία
Fiji|Φίτζι
Finland|Φινλανδία
France|Γαλλία
Gabon|Γκαμπόν
Gambia|Γκάμπια
Georgia|Γεωργία
Germany|Γερμανία|Deutschland
Ghana|Γκάνα
Greece|Ελλάδα|Ελλάς|Hellas|GR
Grenada|Γρενάδα
Guatemala|Γουατεμάλα
Guinea|Γουινέα
Guinea-Bissau|Γουινέα-Μπισάου
Guyana|Γουιάνα
Haiti|Αϊτή
Honduras|Ονδούρα
Hong Kong|Χονγκ Κονγκ
Hungary|Ουγγαρία
Iceland|Ισλανδία
India|Ινδία
Indonesia|Ινδονησία
Iran|Ιράν
Iraq|Ιράκ
Ireland|Ιρλανδία
Israel|Ισραήλ
Italy|Ιταλία
Ivory Coast|Ακτή Ελεφαντοστού|Côte d'Ivoire
Jamaica|Τζαμάικα
Japan|Ιαπωνία
Jordan|Ιορδανία
Kazakhstan|Καζακστάν
Kenya|Κένυα
Kiribati|Κιριμπάτι
Kosovo|Κοσσυφοπέδιο|Κόσοβο
Kuwait|Κουβέιτ
Kyrgyzstan|Κιργιστάν
Laos|Λάος
Latvia|Λετονία
Lebanon|Λίβανος
Lesotho|Λεσότο
Liberia|Λιβερία
Libya|Λιβύη
Liechtenstein|Λιχτενστάιν
Lithuania|Λιθουανία
Luxembourg|Λουξεμβούργο
Macau|Μακάο
Madagascar|Μαδαγασκάρη
Malawi|Μαλάουι
Malaysia|Μαλαισία
Maldives|Μαλδίβες
Mali|Μάλι
Malta|Μάλτα
Marshall Islands|Νήσοι Μάρσαλ
Mauritania|Μαυριτανία
Mauritius|Μαυρίκιος
Mexico|Μεξικό
Micronesia|Μικρονησία
Moldova|Μολδαβία
Monaco|Μονακό
Mongolia|Μογγολία
Montenegro|Μαυροβούνιο
Morocco|Μαρόκο
Mozambique|Μοζαμβίκη
Myanmar|Μιανμάρ|Burma
Namibia|Ναμίμπια
Nauru|Ναουρού
Nepal|Νεπάλ
Netherlands|Ολλανδία|Κάτω Χώρες|Holland|The Netherlands
New Zealand|Νέα Ζηλανδία
Nicaragua|Νικαράγουα
Niger|Νίγηρας
Nigeria|Νιγηρία
North Korea|Βόρεια Κορέα
North Macedonia|Βόρεια Μακεδονία|Macedonia|FYROM|Σκόπια
Norway|Νορβηγία
Oman|Ομάν
Pakistan|Πακιστάν
Palau|Παλάου
Palestine|Παλαιστίνη
Panama|Παναμάς
Papua New Guinea|Παπούα Νέα Γουινέα
Paraguay|Παραγουάη
Peru|Περού
Philippines|Φιλιππίνες
Poland|Πολωνία
Portugal|Πορτογαλία
Qatar|Κατάρ
Romania|Ρουμανία
Russia|Ρωσία|Russian Federation
Rwanda|Ρουάντα
Saint Kitts and Nevis|Άγιος Χριστόφορος και Νέβις
Saint Lucia|Αγία Λουκία
Saint Vincent and the Grenadines|Άγιος Βικέντιος και Γρεναδίνες
Samoa|Σαμόα
San Marino|Άγιος Μαρίνος|Σαν Μαρίνο
Sao Tome and Principe|Σάο Τομέ και Πρίνσιπε
Saudi Arabia|Σαουδική Αραβία
Senegal|Σενεγάλη
Serbia|Σερβία
Seychelles|Σεϋχέλλες
Sierra Leone|Σιέρα Λεόνε
Singapore|Σιγκαπούρη
Slovakia|Σλοβακία
Slovenia|Σλοβενία
Solomon Islands|Νήσοι Σολομώντα
Somalia|Σομαλία
South Africa|Νότια Αφρική
South Korea|Νότια Κορέα|Korea|Republic of Korea
South Sudan|Νότιο Σουδάν
Spain|Ισπανία
Sri Lanka|Σρι Λάνκα
Sudan|Σουδάν
Suriname|Σουρινάμ
Sweden|Σουηδία
Switzerland|Ελβετία
Syria|Συρία
Taiwan|Ταϊβάν
Tajikistan|Τατζικιστάν
Tanzania|Τανζανία
Thailand|Ταϊλάνδη
Timor-Leste|Ανατολικό Τιμόρ|East Timor
Togo|Τόγκο
Tonga|Τόνγκα
Trinidad and Tobago|Τρινιντάντ και Τομπάγκο
Tunisia|Τυνησία
Turkey|Τουρκία|Türkiye|Turkiye
Turkmenistan|Τουρκμενιστάν
Tuvalu|Τουβαλού
Uganda|Ουγκάντα
Ukraine|Ουκρανία
United Arab Emirates|Ηνωμένα Αραβικά Εμιράτα|UAE|ΗΑΕ
United Kingdom|Ηνωμένο Βασίλειο|UK|Great Britain|Britain|England|Αγγλία|Μεγάλη Βρετανία|Scotland|Σκωτία|Wales|Ουαλία|Northern Ireland
United States|Ηνωμένες Πολιτείες|USA|US|United States of America|ΗΠΑ|Αμερική
Uruguay|Ουρουγουάη
Uzbekistan|Ουζμπεκιστάν
Vanuatu|Βανουάτου
Vatican City|Βατικανό
Venezuela|Βενεζουέλα
Vietnam|Βιετνάμ|Viet Nam
Yemen|Υεμένη
Zambia|Ζάμπια
Zimbabwe|Ζιμπάμπουε`;
const COUNTRIES = COUNTRIES_RAW.split("\n").map(l => { const p = l.split("|"); return { en: p[0], el: p[1], all: p }; });
const fold = s => String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/ς/g, "σ").trim();
const COUNTRY_INDEX = new Map(); for (const c of COUNTRIES) for (const n of c.all) COUNTRY_INDEX.set(fold(n), c);
const countryOf = v => COUNTRY_INDEX.get(fold(v)) || null;
const countryLabel = v => { const c = countryOf(v); return c ? `${c.el} · ${c.en}` : String(v ?? ""); };
function countrySearch(q) {
  const f = fold(q); if (!f) return COUNTRIES.slice().sort((a, b) => a.el.localeCompare(b.el, "el"));
  const score = c => { let best = 9; for (const n of c.all) { const x = fold(n); if (x === f) return 0; if (x.startsWith(f)) best = Math.min(best, 1); else if (x.split(/[\s-]+/).some(w => w.startsWith(f))) best = Math.min(best, 2); else if (x.includes(f)) best = Math.min(best, 3); } return best; };
  return COUNTRIES.map(c => [score(c), c]).filter(([s]) => s < 9).sort((a, b) => a[0] - b[0] || a[1].el.localeCompare(b[1].el, "el")).map(x => x[1]);
}

// ---------- εύρεση παρόμοιων εταιρειών (για να μη γίνονται διπλές) ----------
const GR2LAT = { α: "a", β: "v", γ: "g", δ: "d", ε: "e", ζ: "z", η: "i", θ: "th", ι: "i", κ: "k", λ: "l", μ: "m", ν: "n", ξ: "x", ο: "o", π: "p", ρ: "r", σ: "s", τ: "t", υ: "y", φ: "f", χ: "ch", ψ: "ps", ω: "o" };
const LEGAL_WORDS = new Set(["ae", "ike", "oe", "ee", "epe", "mepe", "sa", "ltd", "limited", "llc", "inc", "co", "corp", "corporation", "company", "gmbh", "ag", "srl", "spa", "bv", "nv", "plc", "kft", "sro", "doo", "hellas", "ellas", "ellados", "greece", "the", "kai", "and", "monoprosopi", "s", "a", "e", "k", "o"]);
function companyKey(name) {
  let s = String(name ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/ς/g, "σ");
  s = s.replace(/[α-ω]/g, ch => GR2LAT[ch] || ch);
  s = s.replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ");
  return s.split(" ").filter(w => w && !LEGAL_WORDS.has(w)).join(" ");
}
function lev(a, b) {
  if (a === b) return 0; if (!a.length) return b.length; if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[b.length];
}
function nameSimilarity(a, b) {
  const ka = companyKey(a), kb = companyKey(b); if (!ka || !kb) return 0;
  const ca = ka.replace(/ /g, ""), cb = kb.replace(/ /g, "");
  if (ca === cb) return 1;
  const [sh, lo] = ca.length <= cb.length ? [ca, cb] : [cb, ca];
  let best = 0;
  if (sh.length >= 5 && lo.startsWith(sh)) best = 0.93; else if (sh.length >= 6 && lo.includes(sh)) best = 0.82;
  const ta = new Set(ka.split(" ")), tb = new Set(kb.split(" ")), inter = [...ta].filter(t => tb.has(t)).length;
  best = Math.max(best, inter / (ta.size + tb.size - inter) * 0.95);
  const small = ta.size <= tb.size ? ta : tb, tokLen = [...small].join("").length;
  if (small.size >= 2 && tokLen >= 8 && inter === small.size) best = Math.max(best, 0.85);   // όλες οι λέξεις του ενός υπάρχουν στο άλλο
  if (Math.max(ca.length, cb.length) <= 40) best = Math.max(best, 1 - lev(ca, cb) / Math.max(ca.length, cb.length));
  return best;
}
function similarCompanies(name, limit = 3, min = 0.8) {
  const out = [];
  for (const c of Core.derive().comp.values()) { const sc = nameSimilarity(name, c.name); if (sc >= min) out.push({ c, sc }); }
  return out.sort((a, b) => b.sc - a.sc).slice(0, limit);
}

const $ = s => document.querySelector(s);
const esc = v => String(v === null || v === undefined ? "" : v).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmtD = n => { if (!n || typeof n !== "number") return n ? String(n) : ""; const d = new Date(Date.UTC(1899, 11, 30) + Math.round(n) * 864e5); return `${String(d.getUTCDate()).padStart(2, "0")}/${String(d.getUTCMonth() + 1).padStart(2, "0")}/${d.getUTCFullYear()}`; };
const toInputDate = n => { const d = new Date(Date.UTC(1899, 11, 30) + Math.round(n) * 864e5); return d.toISOString().slice(0, 10); };
const fromInputDate = s => { if (!s) return 0; const [y, m, d] = s.split("-").map(Number); return Math.floor(Date.UTC(y, m - 1, d) / 864e5) + 25569; };
// προσωπικές ρυθμίσεις: στον browser και (αν υπάρχει ο πίνακας user_prefs) στη βάση, ώστε να ακολουθούν τον χρήστη σε κάθε συσκευή
const PREF_KEYS = ["cols", "sorts", "year", "handler", "me", "orange", "red", "offer", "widths"];
const LS = { get(k, d) { try { const v = localStorage.getItem("leadscrm:" + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem("leadscrm:" + k, JSON.stringify(v)); } catch (e) {} if (PREF_KEYS.includes(k)) schedulePrefs(); } };
const prefSync = { uid: "", on: false, t: 0 };
function collectPrefs() { const o = {}; for (const k of PREF_KEYS) { const v = LS.get(k, undefined); if (v !== undefined) o[k] = v; } return o; }
function schedulePrefs() { if (!prefSync.on) return; clearTimeout(prefSync.t); prefSync.t = setTimeout(savePrefsNow, 1500); }
async function savePrefsNow() {   // διαβάζει πρώτα την εγγραφή, ώστε να μη σβήνει ρυθμίσεις της νέας έκδοσης (κλειδί «v2»)
  clearTimeout(prefSync.t); if (!prefSync.on) return;
  const r = await Core.getPrefs(prefSync.uid).catch(() => ({})); const base = (r && r.prefs) || {};
  await Core.savePrefs(prefSync.uid, { ...base, ...collectPrefs() }).catch(() => {});
}
async function syncPrefs(uid) {
  prefSync.uid = uid; prefSync.on = false;
  const r = await Core.getPrefs(uid).catch(e => ({ error: e }));
  if (r.error) return;                                 // ο πίνακας δεν έχει στηθεί: μένουν μόνο στον browser
  if (r.prefs && Object.keys(r.prefs).length) {        // υπάρχουν στη βάση → εφαρμόζονται εδώ
    for (const k of PREF_KEYS) { try { if (k in r.prefs) localStorage.setItem("leadscrm:" + k, JSON.stringify(r.prefs[k])); else localStorage.removeItem("leadscrm:" + k); } catch (e) {} }
    prefSync.on = true;
  } else { prefSync.on = true; await savePrefsNow(); }  // πρώτη φορά: ανεβαίνουν όσες υπάρχουν σε αυτόν τον browser
}

const ui = { view: "track", loaded: false, email: "", live: "", year: 0, handler: LS.get("handler", "Όλοι"), show: "open", q: "", stage: "",
  me: LS.get("me", ""), orange: 0, red: 0, cols: LS.get("cols", null), drawer: 0, cq: "", aq: "", ay: "", ah: "", at: "", sy: 0 };
const ALLCOLS = {
  "Κατάσταση": l => l._st, "Εταιρεία": l => l.name, "Χειριστής": l => l.handler, "Πορεία": l => l.stage, "Χορηγία": l => l.sponsor,
  "Τελευταία επαφή": l => fmtD(l.last), "Τι έγινε τελευταία": l => l.lastDesc, "Επαφή": l => l.co ? l.co.person : "", "Τηλέφωνο": l => l.co ? l.co.phone : "",
  "Email": l => l.co ? l.co.email : "", "Προέλευση": l => l.v["Προέλευση"], "Τ.μ.": l => l.v["Τ.μ."], "Χρονιά": l => l.year, "Κλάδος": l => l.co ? l.co.v["Κλάδος"] : "",
  "Λόγος ακύρωσης": l => l.v["Λόγος ακύρωσης"], "Hall": l => l.v["Hall"], "Αριθμός Stand": l => l.v["Αριθμός Stand"], "Εκθέτης προηγ. χρονιάς": l => l.prevExhibitor,
  "Σημειώσεις": l => l.v["Σημειώσεις"], "Ιστορικό ενεργειών": l => l.acts.map(a => `${fmtD(a.date)} ${a.type ? "[" + a.type + "] " : ""}${a.desc}`).join("\n"), "Αρχικά σχόλια List": l => l.v["Αρχικά σχόλια List"]
};
const DEFCOLS = ["Κατάσταση", "Εταιρεία", "Χειριστής", "Πορεία", "Χορηγία", "Τελευταία επαφή", "Τι έγινε τελευταία", "Επαφή", "Τηλέφωνο", "Email", "Προέλευση", "Τ.μ."];
if (!Array.isArray(ui.cols) || !ui.cols.length) ui.cols = DEFCOLS.slice();
ui.cols = ui.cols.filter(c => ALLCOLS[c]);

const list = h => ((Core.S.lists || {})[h] || []).filter(v => String(v).trim() !== "");
function toast(msg, err) { const t = $("#toast"); t.textContent = (err ? "⚠️ " : "✅ ") + msg; t.className = "toast on" + (err ? " err" : ""); clearTimeout(t._h); t._h = setTimeout(() => t.className = "toast", err ? 7000 : 4500); }

// ---------- σύνδεση με τη βάση ----------
const SUPA_URL = "https://qyhkdyewdqrbreebmacn.supabase.co";
const SUPA_KEY = "sb_publishable_OvMExg_PKnJfSh7CP8hIsQ_Mg0oowyG";
// μέτρηση κίνησης: πόσα bytes κατεβάζει αυτή η εφαρμογή από το Supabase (εκτίμηση egress)
let pendingBytes = 0, usageLogOff = false;
const countingFetch = async (input, init) => {
  const res = await fetch(input, init);
  try {
    const len = res.headers.get("content-length");
    if (len) pendingBytes += Number(len) + 300;
    else res.clone().arrayBuffer().then(b => { pendingBytes += b.byteLength + 300; }).catch(() => {});
  } catch (e) {}
  return res;
};
async function flushUsage() {
  if (!ui.loaded || usageLogOff || pendingBytes < 1) return;
  const b = pendingBytes; pendingBytes = 0;
  const ok = await Core.logUsage(b).catch(() => false);
  if (!ok) { usageLogOff = true; }   // ο πίνακας δεν έχει στηθεί ακόμα: σταματάμε σιωπηλά
}
setInterval(flushUsage, 60000);
document.addEventListener("visibilitychange", () => { if (document.hidden) { flushUsage(); if (prefSync.t) savePrefsNow(); } });
const sb = window.supabase ? window.supabase.createClient(SUPA_URL, SUPA_KEY, { global: { fetch: countingFetch } }) : null;
if (sb) Core.init(sb);
let channel = null, reloadT = 0;
async function startApp(session) {
  ui.email = session.user.email || "";
  try { await Core.load(); } catch (e) { toast(e.message, true); }
  await syncPrefs(session.user.id);
  ui.cols = (LS.get("cols", null) || DEFCOLS.slice()).filter(c => ALLCOLS[c]); if (!ui.cols.length) ui.cols = DEFCOLS.slice();
  ui.sorts = LS.get("sorts", {}); ui.widths = LS.get("widths", {}); ui.handler = LS.get("handler", "Όλοι"); ui.me = LS.get("me", "");
  ui.loaded = true;
  const ys = Core.derive().leads.map(l => l.year);
  ui.year = LS.get("year", 0) || Math.max(...ys, new Date().getFullYear());
  ui.sy = ui.year;
  ui.orange = LS.get("orange", 7); ui.red = LS.get("red", 21);
  if (!ui.me) { const h = list("Χειριστής").find(h => !h.includes(",") && Core.norm(h).split(" ")[0] === Core.norm(ui.email).split(/[.@_]/)[0]); if (h) { ui.me = h; LS.set("me", h); } }
  refreshDatalist(); render();
  if (!channel) {
    let wasDown = false;
    channel = sb.channel("crm-live")
      .on("postgres_changes", { event: "*", schema: "public" }, p => { try { pendingBytes += JSON.stringify(p).length + 200; } catch (e) {} if (Core.applyChange(p)) { clearTimeout(reloadT); reloadT = setTimeout(() => { refreshDatalist(); rerenderAll(); }, 250); } })
      .subscribe(st => {
        ui.live = st === "SUBSCRIBED" ? "on" : ""; const d = $("#liveDot"); if (d) d.dataset.on = ui.live;
        if (st === "SUBSCRIBED") { if (wasDown) reloadData(); wasDown = false; }   // μετά από διακοπή: πλήρης συγχρονισμός
        else if (st === "CHANNEL_ERROR" || st === "TIMED_OUT" || st === "CLOSED") wasDown = true;
      });
    // ασφάλεια: αν η καρτέλα έμεινε κρυμμένη >5 λεπτά ή γύρισε το internet, ξαναφορτώνουμε μία φορά
    let hiddenAt = 0;
    document.addEventListener("visibilitychange", () => { if (document.hidden) hiddenAt = Date.now(); else if (hiddenAt && Date.now() - hiddenAt > 5 * 60e3) reloadData(); });
    window.addEventListener("online", reloadData);
  }
}
async function reloadData() {
  try { await Core.load(); refreshDatalist(); rerenderAll(); } catch (e) { /* σιωπηλά: θα ξαναδοκιμάσει στην επόμενη αλλαγή */ }
}
function rerenderAll() {
  if (!ui.loaded) return;
  const ae = document.activeElement, id = ae && ae.id, pos = ae && ae.selectionStart;
  render();
  if (ui.drawer) openDrawer(ui.drawer);
  if (id && $("#" + id) && !$("#modal").contains(ae)) { const el = $("#" + id); el.focus(); try { if (pos != null) el.setSelectionRange(pos, pos); } catch (e) {} }
}
async function boot() {
  if (!sb) { mountCrm({ unavailable: true }); return; }
  const { data } = await sb.auth.getSession();
  if (data && data.session) startApp(data.session); else render();
  sb.auth.onAuthStateChange((ev, session) => {
    if (ev === "SIGNED_OUT") { ui.loaded = false; closeDrawer(); render(); }
  });
}
async function exportExcel() {
  if (!window.XLSX) return toast("Η εξαγωγή χρειάζεται σύνδεση στο internet.", true);
  const d = Core.derive(), wb = XLSX.utils.book_new();
  const add = (name, rows) => { const ws = XLSX.utils.json_to_sheet(rows); ws["!cols"] = Object.keys(rows[0] || {}).map(k => ({ wch: Math.min(50, Math.max(10, k.length + 2)) })); XLSX.utils.book_append_sheet(wb, ws, name); };
  const dt = n => n ? new Date(Date.UTC(1899, 11, 30) + n * 864e5) : "";
  add("Εταιρείες", [...d.comp.values()].map(c => ({ "Κωδ.": c.code, "Εταιρεία": c.name, "Κλάδος": c.v["Κλάδος"], "Χώρα": c.v["Χώρα"], "FG/RET": c.v["FG/RET"], "Contact Person": c.person, "Τηλέφωνο": c.phone, "Email": c.email, "Αρ. επαφών": c.contacts.length, "Tellody": c.v["Tellody"], "Σύνδεσμος αρχείων": c.v["Σύνδεσμος αρχείων"], "Αναγνωριστικό List": c.v["Αναγνωριστικό List"], "Χρονιές ως lead": c.leads.length })));
  add("Leads", d.leads.map(l => ({ "Κωδ.": l.code, "Εταιρεία": l.name, "Χρονιά": l.year, "Κλάδος": l.co ? l.co.v["Κλάδος"] : "", "Contact Person": l.co ? l.co.person : "", "Τηλέφωνο": l.co ? l.co.phone : "", "Email": l.co ? l.co.email : "",
    "Προέλευση": l.v["Προέλευση"], "Χειριστής": l.handler, "Πορεία ενδιαφέροντος": l.stage, "Χορηγία": l.sponsor, "Λόγος ακύρωσης": l.v["Λόγος ακύρωσης"], "Hall": l.v["Hall"], "Αριθμός Stand": l.v["Αριθμός Stand"], "Τ.μ.": l.v["Τ.μ."],
    "Εκθέτης προηγ. χρονιάς": l.prevExhibitor, "Τελευταία ενέργεια": dt(l.last), "Τι έγινε τελευταία": l.lastDesc, "Σημειώσεις": l.v["Σημειώσεις"], "Ιστορικό ενεργειών": ALLCOLS["Ιστορικό ενεργειών"](l), "Αρχικά σχόλια List": l.v["Αρχικά σχόλια List"] })));
  add("Ενέργειες", d.acts.map(a => ({ "Ημερομηνία": dt(a.date), "Κωδ.": a.code, "Εταιρεία": a.name, "Χρονιά lead": a.year, "Τύπος ενέργειας": a.type, "Περιγραφή": a.desc, "Χειριστής": a.handler })));
  add("Επαφές", Core.rows.P.map(p => ({ "Κωδ.": p.v["Επιλογή εταιρείας"], "Εταιρεία": (d.comp.get(p.v["Επιλογή εταιρείας"]) || {}).name || "", "Ονοματεπώνυμο": p.v["Ονοματεπώνυμο"], "Θέση": p.v["Θέση"], "Τηλέφωνο": p.v["Τηλέφωνο"], "Email": p.v["Email"], "Κύρια επαφή": p.v["Κύρια επαφή"], "Σημειώσεις": p.v["Σημειώσεις"] })));
  const L = Core.S.lists, keys = Object.keys(L), set = [];
  for (let i = 0; i < 25; i++) { const r = {}; keys.forEach(k => r[k] = L[k][i] || ""); if (Object.values(r).some(Boolean)) set.push(r); }
  add("Ρυθμίσεις", set);
  const now = new Date(), stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  XLSX.writeFile(wb, `Leads CRM ${stamp}.xlsx`, { cellDates: true });
  toast("Το αντίγραφο Excel κατέβηκε.");
}
function after(res) { refreshDatalist(); render(); if (ui.drawer) openDrawer(ui.drawer); if (res && res.msg) toast(res.msg, res.warn); }

function refreshDatalist() {
  const d = Core.derive();
  $("#dl-hall").innerHTML = list("Hall").map(h => `<option value="${esc(h)}"></option>`).join("");
  $("#dl-co").innerHTML = [...d.comp.values()].sort((a, b) => a.name.localeCompare(b.name, "el")).map(c => `<option value="${esc(c.code + " · " + c.name)}"></option>`).join("");
}

// ---------- απόδοση ----------
const views = { track: trackHTML, companies: companiesHTML, history: historyHTML, summary: summaryHTML, report: reportHTML, settings: settingsHTML, help: helpHTML };

function render() {
  if (!ui.loaded) {
    mountCrm({ signIn });
    return;
  }

  mountCrm({
    loaded: true,
    email: ui.email,
    live: ui.live,
    view: ui.view,
    canInstall: Boolean(installEvt),
    exportExcel,
    install: installApp,
    signOut,
    selectView: (view) => { ui.view = view; render(); },
    openForm: (kind) => openForm(kind, {}),
    openOffer: () => openOffer({}),
    openImport,
  });

  // The existing views own the children of #view during the migration.
  const content = $("#view");
  content.innerHTML = views[ui.view]();
  bindMain();
  applySorts(content);
  if (ui.view === "settings") loadUsage();
}

async function signIn(email, password) {
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw new Error(/invalid/i.test(error.message) ? "Λάθος email ή κωδικός." : error.message);
  await startApp(data.session);
}

async function signOut() {
  await flushUsage();
  await savePrefsNow();
  prefSync.on = false;
  await sb.auth.signOut();
}

async function installApp() {
  if (!installEvt) return;
  installEvt.prompt();
  await installEvt.userChoice.catch(() => {});
  installEvt = null;
  const button = $("#installBtn");
  if (button) button.hidden = true;
}

// ---- Παρακολούθηση ----
function trackRows() {
  const d = Core.derive(), t = Core.today(), q = Core.norm(ui.q);
  const byH = l => ui.handler === "Όλοι" || (ui.handler === "Χωρίς χειριστή" ? l.handler === "" : l.handler !== "" && Core.norm(l.handler).includes(Core.norm(ui.handler)));
  const base = d.leads.filter(l => l.year === ui.year && byH(l));
  const rows = base.filter(l => (ui.show === "all" || l.open) && (!ui.stage || l.stage === ui.stage) && (!q || Core.norm([l.name, l.co && l.co.person, l.co && l.co.phone, l.co && l.co.email, l.co && l.co.v["Κλάδος"], l.handler, l.stage, l.sponsor, l.v["Hall"], l.v["Αριθμός Stand"], l.v["Σημειώσεις"], l.v["Προέλευση"], l.v["Λόγος ακύρωσης"], l.lastDesc].join(" ")).includes(q)));
  for (const l of rows) {
    l._days = l.last ? t - Math.floor(l.last) : 99999;
    if (!l.open) { l._cls = "k"; l._st = "✔ Κλειστό"; }
    else if (l._days === 99999) { l._cls = "r"; l._st = "Καμία επαφή"; }
    else if (l._days >= ui.red) { l._cls = "r"; l._st = `${l._days} ημ. χωρίς επαφή`; }
    else if (l._days >= ui.orange) { l._cls = "a"; l._st = `${l._days} ημ. χωρίς επαφή`; }
    else { l._cls = "g"; l._st = `πριν ${l._days} ημ.`; }
  }
  rows.sort((a, b) => (a.open ? 1e6 + (a.last || 0) : 5e6) - (b.open ? 1e6 + (b.last || 0) : 5e6) || a.i - b.i);
  return { rows, base };
}
const yearsAll = () => { const s = new Set(list("Χρονιά").map(Number).filter(Boolean)); Core.derive().leads.forEach(l => l.year && s.add(l.year)); s.add(ui.year); return [...s].sort(); };
const opt = (vals, cur, first) => (first !== undefined ? `<option value="">${esc(first)}</option>` : "") + vals.map(v => `<option value="${esc(v)}"${String(v) === String(cur) ? " selected" : ""}>${esc(v)}</option>`).join("");
function trackHTML() {
  const { rows, base } = trackRows();
  const open = rows.filter(l => l.open);
  const k = { r: open.filter(l => l._days !== 99999 && l._days >= ui.red).length, n: open.filter(l => l._days === 99999).length,
    a: open.filter(l => l._days >= ui.orange && l._days < ui.red).length, g: open.filter(l => l._days < ui.orange).length };
  const stages = list("Πορεία ενδιαφέροντος");
  const handlers = ["Όλοι", "Χωρίς χειριστή", ...list("Χειριστής").filter(h => !h.includes(","))];
  return `<div class="filters">
    <label>Χρονιά<select id="fYear">${opt(yearsAll(), ui.year)}</select></label>
    <label>Χειριστής<select id="fHandler">${opt(handlers, ui.handler)}</select></label>
    <label>Εμφάνιση<select id="fShow"><option value="open"${ui.show === "open" ? " selected" : ""}>Μόνο ανοιχτά</option><option value="all"${ui.show === "all" ? " selected" : ""}>Όλα</option></select></label>
    <label style="flex:1;min-width:200px">Αναζήτηση<input id="fQ" type="search" value="${esc(ui.q)}" placeholder="εταιρεία, επαφή, τηλέφωνο, σημείωση…"></label>
    <button class="btn" id="colBtn">Στήλες</button><button class="btn" id="cpAll" title="Αντιγράφει τα email όλων των γραμμών που φαίνονται">Αντιγραφή email</button></div>
  <div class="kpis">
    <div class="kpi r"><b>${k.r}</b><span>Πάνω από ${ui.red} ημ. χωρίς επαφή</span></div>
    <div class="kpi r"><b>${k.n}</b><span>Καμία επαφή ακόμα</span></div>
    <div class="kpi a"><b>${k.a}</b><span>Θέλουν επαφή σύντομα (${ui.orange}+ ημ.)</span></div>
    <div class="kpi g"><b>${k.g}</b><span>Πρόσφατη επαφή</span></div>
    <div class="kpi"><b>${rows.length}</b><span>Σύνολο στη λίστα</span></div></div>
  <div class="pipe"><span class="muted" style="align-self:center;font-size:13px">Pipeline ${ui.year}:</span>${stages.map(s => `<button class="chip" data-stage="${esc(s)}" aria-pressed="${ui.stage === s}">${esc(s)}<b>${base.filter(l => l.stage === s).length}</b></button>`).join("")}</div>
  ${rows.length ? `<div class="scroll"><table class="stack" data-sort-id="trk"><thead><tr><th></th>${ui.cols.map(c => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>
  ${rows.map(l => `<tr class="${l.open && l._cls !== "g" ? l._cls : ""}" data-code="${l.code}"><td class="nw"><button class="btn sm pri" data-quick="${l.code}" data-year="${l.year}">+ Ενέργεια</button></td>${ui.cols.map(c => cellHTML(c, l)).join("")}</tr>`).join("")}
  </tbody></table></div>` : `<div class="empty">Δεν υπάρχουν leads με αυτά τα φίλτρα.</div>`}`;
}
function cellHTML(c, l) {
  const v = ALLCOLS[c](l);
  if (c === "Κατάσταση") return `<td data-s="${l.open ? l._days : 1e9}"><span class="st"><i class="dot ${l._cls}"></i>${esc(v)}</span></td>`;
  if (c === "Εταιρεία") return `<td class="co"><b>${esc(v)}</b></td>`;
  if (c === "Email") return `<td class="em">${emailsHTML(v)}</td>`;
  if (["Hall", "Αριθμός Stand"].includes(c)) return `<td class="nw">${esc(v)}</td>`;
  if (["Χειριστής", "Πορεία", "Χορηγία", "Επαφή", "Προέλευση", "Κλάδος", "Λόγος ακύρωσης"].includes(c)) return `<td class="md">${esc(v)}</td>`;
  if (c === "Τι έγινε τελευταία" || c === "Σημειώσεις") return `<td class="wide">${esc(v)}</td>`;
  if (c === "Ιστορικό ενεργειών") return `<td class="pre">${esc(v)}</td>`;
  if (c === "Τ.μ." || c === "Χρονιά") return `<td class="num">${esc(v)}</td>`;
  if (c === "Τελευταία επαφή") return `<td class="nw" data-s="${l.last || ""}">${esc(v)}</td>`;
  if (c === "Τηλέφωνο") return `<td class="ph">${esc(v)}</td>`;
  return `<td>${esc(v)}</td>`;
}
function colPopover(anchor) {
  document.querySelectorAll(".pop").forEach(p => p.remove());
  const p = document.createElement("div"); p.className = "pop";
  const draw = () => {
    const order = [...ui.cols, ...Object.keys(ALLCOLS).filter(c => !ui.cols.includes(c))];
    p.innerHTML = `<b style="display:block;margin-bottom:6px">Στήλες λίστας</b>` + order.map(c => {
      const on = ui.cols.includes(c), fixed = c === "Κατάσταση" || c === "Εταιρεία";
      return `<div><label><input type="checkbox" data-c="${esc(c)}"${on ? " checked" : ""}${fixed ? " disabled" : ""}>${esc(c)}</label>${on ? `<button data-up="${esc(c)}" aria-label="πάνω">↑</button><button data-dn="${esc(c)}" aria-label="κάτω">↓</button>` : ""}</div>`;
    }).join("") + `<div style="margin-top:8px"><button class="btn sm" id="colReset" style="width:auto">Προεπιλογή</button></div>`;
  };
  draw();
  p.onclick = e => {
    const t = e.target, c = t.dataset.c || t.dataset.up || t.dataset.dn;
    if (t.id === "colReset") ui.cols = DEFCOLS.slice();
    else if (t.dataset.c !== undefined) ui.cols = t.checked ? [...ui.cols, c] : ui.cols.filter(x => x !== c);
    else if (c) { const i = ui.cols.indexOf(c), j = t.dataset.up ? i - 1 : i + 1; if (j >= 0 && j < ui.cols.length) { [ui.cols[i], ui.cols[j]] = [ui.cols[j], ui.cols[i]]; } }
    else return;
    LS.set("cols", ui.cols); draw(); $("#view").innerHTML = trackHTML(); bindMain(); applySorts($("#view")); document.body.appendChild(p);
  };
  const r = anchor.getBoundingClientRect();
  p.style.top = (r.bottom + window.scrollY + 6) + "px"; p.style.left = Math.max(8, Math.min(r.left, window.innerWidth - 310)) + "px";
  document.body.appendChild(p);
  setTimeout(() => document.addEventListener("click", function h(e) { if (!e.target.isConnected || p.contains(e.target) || e.target === anchor || !p.isConnected) { if (!p.isConnected) document.removeEventListener("click", h); return; } p.remove(); document.removeEventListener("click", h); }), 0);
}

// ---- Εταιρείες ----
function companiesHTML() {
  const q = Core.norm(ui.cq);
  const cs = [...Core.derive().comp.values()].filter(c => !q || Core.norm([c.code, c.name, c.person, c.phone, c.email, c.v["Κλάδος"], countryLabel(c.v["Χώρα"])].join(" ")).includes(q)).sort((a, b) => a.name.localeCompare(b.name, "el"));
  return `<div class="filters"><label style="flex:1;min-width:220px">Αναζήτηση εταιρείας<input id="cQ" type="search" value="${esc(ui.cq)}" placeholder="όνομα, κωδικός, επαφή, κλάδος…"></label><span class="muted">${cs.length} εταιρείες</span><button class="btn" id="cpAll" title="Αντιγράφει τα email όλων των γραμμών που φαίνονται">Αντιγραφή email</button></div>
  <div class="scroll"><table class="stack" data-sort-id="cos"><thead><tr><th>Κωδ.</th><th>Εταιρεία</th><th>Κλάδος</th><th>Χώρα</th><th>Επαφή</th><th>Τηλέφωνο</th><th>Email</th><th>Χρονιές lead</th><th>Τελευταία χρονιά</th></tr></thead><tbody>
  ${cs.map(c => `<tr data-code="${c.code}"><td class="num">${c.code}</td><td><b>${esc(c.name)}</b></td><td>${esc(c.v["Κλάδος"])}</td><td>${esc(countryLabel(c.v["Χώρα"]))}</td><td>${esc(c.person)}</td><td class="nw">${esc(c.phone)}</td><td class="em">${emailsHTML(c.email)}</td><td class="num">${c.leads.length}</td><td class="num">${c.leads.length ? Math.max(...c.leads.map(l => l.year)) : ""}</td></tr>`).join("")}
  </tbody></table></div>`;
}

// ---- Ενέργειες (ιστορικό) ----
function historyHTML() {
  const q = Core.norm(ui.aq);
  const as = Core.derive().acts.filter(a => (!ui.ay || a.year === +ui.ay) && (!ui.ah || Core.norm(a.handler).includes(Core.norm(ui.ah))) && (!ui.at || a.type === ui.at) && (!q || Core.norm([a.name, a.desc, a.type, a.handler, fmtD(a.date)].join(" ")).includes(q)))
    .sort((a, b) => b.date - a.date || b.i - a.i);
  return `<div class="filters">
    <label>Χρονιά lead<select id="aY">${opt(yearsAll(), ui.ay, "Όλες")}</select></label>
    <label>Χειριστής<select id="aH">${opt(list("Χειριστής").filter(h => !h.includes(",")), ui.ah, "Όλοι")}</select></label>
    <label>Τύπος<select id="aT">${opt(list("Τύπος ενέργειας"), ui.at, "Όλοι")}</select></label>
    <label style="flex:1;min-width:200px">Αναζήτηση<input id="aQ" type="search" value="${esc(ui.aq)}" placeholder="εταιρεία, περιγραφή, ημερομηνία…"></label><span class="muted">${as.length} ενέργειες</span></div>
  ${as.length ? `<div class="scroll"><table class="stack" data-sort-id="his"><thead><tr><th>Ημερομηνία</th><th>Εταιρεία</th><th>Χρονιά</th><th>Τύπος</th><th>Περιγραφή</th><th>Χειριστής</th></tr></thead><tbody>
  ${as.slice(0, 600).map(a => `<tr data-code="${a.code}"><td class="nw" data-s="${a.date || ""}">${fmtD(a.date)}</td><td><b>${esc(a.name)}</b></td><td class="num">${a.year || ""}</td><td>${esc(a.type)}</td><td class="wide">${esc(a.desc)}</td><td>${esc(a.handler)}</td></tr>`).join("")}
  </tbody></table></div>` : `<div class="empty">Καμία ενέργεια με αυτά τα φίλτρα.</div>`}`;
}

// ---- Σύνοψη ----
function summaryHTML() {
  const d = Core.derive(), Y = +ui.sy, t = Core.today();
  const L = y => d.leads.filter(l => l.year === y), S = Core.S.lists;
  const win = S["Πορεία ενδιαφέροντος"][5], lost = S["Πορεία ενδιαφέροντος"][6], sp = S["Χορηγία"];
  const sum = a => a.reduce((s, l) => s + (Number(l.v["Τ.μ."]) || 0), 0);
  const m = y => { const ls = L(y), ex = ls.filter(l => l.stage === win), ca = ls.filter(l => l.stage === lost);
    return [ls.length, ls.filter(l => l.stage !== "" && l.stage !== win && l.stage !== lost).length, ex.length, ls.filter(l => l.sponsor === sp[2]).length,
      ls.filter(l => l.sponsor === sp[0] || l.sponsor === sp[1]).length, ca.length,
      ls.filter(l => (l.stage === win || l.sponsor === sp[2]) && l.prevExhibitor === "Ναι").length, sum(ex),
      sum(ls.filter(l => l.stage === "Οικονομική πρόταση" || l.stage === "Αναμονή πρότασης")),
      ex.length + ca.length ? Math.round(100 * ex.length / (ex.length + ca.length)) + "%" : "–",
      d.acts.filter(a => a.year === y).length, ls.filter(l => !l.last).length]; };
  const labels = ["Σύνολο leads", "Ανοιχτά leads περιπτέρου", "Εκθέτες (περίπτερο)", "Χορηγοί (κλεισμένοι)", "Χορηγίες σε εξέλιξη", "Ακυρώσεις (περίπτερο)",
    "Εκθέτες/χορηγοί και την προηγ. χρονιά", "Τ.μ. εκθετών", "Τ.μ. σε ανοιχτές προτάσεις", "Ποσοστό μετατροπής (εκθέτες / κλειστά)", "Ενέργειες", "Leads χωρίς καμία ενέργεια"];
  const a = m(Y), b = m(Y - 1);
  const stages = list("Πορεία ενδιαφέροντος"), mx = Math.max(1, ...stages.map(s => L(Y).filter(l => l.stage === s).length));
  const first = new Date(); const mStart = Math.floor(Date.UTC(first.getFullYear(), first.getMonth(), 1) / 864e5) + 25569;
  const hs = list("Χειριστής").filter(h => !h.includes(","));
  return `<div class="filters"><label>Χρονιά<select id="sY">${opt(yearsAll(), Y)}</select></label></div>
  <div class="kpis">
    <div class="kpi"><b>${a[0]}</b><span>Leads ${Y}</span></div><div class="kpi g"><b>${a[2]}</b><span>Εκθέτες</span></div>
    <div class="kpi g"><b>${a[3]}</b><span>Χορηγοί</span></div><div class="kpi"><b>${a[7]}</b><span>Τ.μ. εκθετών</span></div>
    <div class="kpi"><b>${d.acts.filter(x => x.date >= t - 6 && x.date <= t).length}</b><span>Ενέργειες τελευταίες 7 ημέρες</span></div>
    <div class="kpi"><b>${d.acts.filter(x => x.date >= mStart && x.date <= t).length}</b><span>Ενέργειες τρέχοντος μήνα</span></div></div>
  <div class="two"><div class="sec"><h3>Δείκτες</h3><div class="scroll"><table data-sort-id="sumi"><thead><tr><th>Δείκτης</th><th style="text-align:right">${Y}</th><th style="text-align:right">${Y - 1}</th></tr></thead><tbody>
    ${labels.map((l, i) => `<tr style="cursor:default"><td>${l}</td><td class="num"><b>${a[i]}</b></td><td class="num muted">${b[i]}</td></tr>`).join("")}</tbody></table></div></div>
  <div class="sec"><h3>Πορεία ενδιαφέροντος ${Y}</h3><div class="bars"><div class="muted" style="font-size:12px"><span></span><span></span><span style="text-align:right">${Y}</span><span style="text-align:right">${Y - 1}</span><span style="text-align:right">Τ.μ.</span></div>
    ${stages.map(s => { const n = L(Y).filter(l => l.stage === s).length; return `<div><span>${esc(s)}</span><span class="bar"><i style="width:${100 * n / mx}%"></i></span><b style="text-align:right">${n}</b><span class="muted" style="text-align:right">${L(Y - 1).filter(l => l.stage === s).length}</span><span style="text-align:right">${sum(L(Y).filter(l => l.stage === s)) || ""}</span></div>`; }).join("")}</div>
    <h3 style="margin-top:20px">Ανά χειριστή (${Y})</h3><div class="scroll"><table data-sort-id="sumh"><thead><tr><th>Χειριστής</th><th style="text-align:right">Leads</th><th style="text-align:right">Ανοιχτά</th><th style="text-align:right">Εκθέτες</th><th style="text-align:right">Ενέργειες 7 ημ.</th></tr></thead><tbody>
    ${hs.map(h => { const ls = L(Y).filter(l => Core.norm(l.handler).includes(Core.norm(h))); return `<tr style="cursor:default"><td>${esc(h)}</td><td class="num">${ls.length}</td><td class="num">${ls.filter(l => l.open).length}</td><td class="num">${ls.filter(l => l.won).length}</td><td class="num">${d.acts.filter(x => Core.norm(x.handler).includes(Core.norm(h)) && x.date >= t - 6 && x.date <= t).length}</td></tr>`; }).join("")}</tbody></table></div></div></div>
  ${sourceHTML(d, Y)}`;
}
function sourceHTML(d, Y) {
  const S = Core.S.lists, win = S["Πορεία ενδιαφέροντος"][5], lost = S["Πορεία ενδιαφέροντος"][6], spon = S["Χορηγία"][2];
  const g = ui.srcGroup || "full";
  const keyOf = l => { const v = String(l.v["Προέλευση"] || "").trim(); if (!v) return "(χωρίς προέλευση)"; const p = v.split("·").map(x => x.trim());
    return g === "type" ? (p.length > 1 ? p[0] : "(χωρίς τύπο)") : g === "channel" ? p[p.length - 1] : v; };
  const order = g === "full" ? list("Προέλευση") : [];
  const keys = [...new Set([...order, ...d.leads.filter(l => l.year === Y || l.year === Y - 1).map(keyOf)])];
  const rows = keys.map(k => {
    const ls = d.leads.filter(l => l.year === Y && keyOf(l) === k), prev = d.leads.filter(l => l.year === Y - 1 && keyOf(l) === k).length;
    const ex = ls.filter(l => l.stage === win).length, ca = ls.filter(l => l.stage === lost).length;
    return { k, n: ls.length, prev, open: ls.filter(l => l.open).length, ex, sp: ls.filter(l => l.sponsor === spon).length, ca,
      conv: ex + ca ? Math.round(100 * ex / (ex + ca)) : null, sqm: ls.filter(l => l.stage === win).reduce((a, l) => a + (Number(l.v["Τ.μ."]) || 0), 0) };
  }).filter(r => r.n || r.prev);
  const tot = rows.reduce((a, r) => a + r.n, 0) || 1;
  return `<div class="sec" style="margin-top:6px"><h3>Ανά προέλευση (${Y})<label style="font-size:12px;font-weight:400;color:var(--mute);display:flex;gap:6px;align-items:center">Ομαδοποίηση
    <select id="srcG" style="min-height:30px;padding:2px 6px"><option value="full"${g === "full" ? " selected" : ""}>Πλήρης προέλευση</option><option value="type"${g === "type" ? " selected" : ""}>Τύπος (Παλιός Εκθέτης / Νέο Lead / …)</option><option value="channel"${g === "channel" ? " selected" : ""}>Κανάλι (Προσέγγιση / email / …)</option></select></label></h3>
  ${rows.length ? `<div class="scroll"><table data-sort-id="src"><thead><tr><th>Προέλευση</th><th style="text-align:right">Leads ${Y}</th><th style="text-align:right">% του συνόλου</th><th style="text-align:right">Leads ${Y - 1}</th><th style="text-align:right">Ανοιχτά</th><th style="text-align:right">Εκθέτες</th><th style="text-align:right">Χορηγοί</th><th style="text-align:right">Ακυρώσεις</th><th style="text-align:right">Μετατροπή</th><th style="text-align:right">Τ.μ. εκθετών</th></tr></thead><tbody>
  ${rows.map(r => `<tr style="cursor:default"><td>${esc(r.k)}</td><td class="num"><b>${r.n}</b></td><td class="num" data-s="${r.n / tot}">${Math.round(100 * r.n / tot)}%</td><td class="num muted">${r.prev}</td><td class="num">${r.open}</td><td class="num">${r.ex}</td><td class="num">${r.sp}</td><td class="num">${r.ca}</td><td class="num" data-s="${r.conv ?? -1}">${r.conv === null ? "–" : r.conv + "%"}</td><td class="num">${r.sqm || ""}</td></tr>`).join("")}
  </tbody></table></div><p class="muted" style="font-size:12.5px;margin:6px 0 0">Μετατροπή = εκθέτες / (εκθέτες + ακυρώσεις). Πατήστε τον τίτλο μιας στήλης για ταξινόμηση.</p>` : `<div class="empty">Κανένα lead για ${Y}.</div>`}</div>`;
}

// ---- Αναφορά (για PDF) ----
function repPeriod() {
  const t = Core.today(), d = new Date(), y = d.getFullYear(), m = d.getMonth();
  const ser = dt => Math.floor(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate()) / 864e5) + 25569;
  const p = ui.rp || "7";
  if (p === "7") return [t - 6, t, "Τελευταίες 7 ημέρες"];
  if (p === "30") return [t - 29, t, "Τελευταίες 30 ημέρες"];
  if (p === "m") return [ser(new Date(y, m, 1)), t, "Τρέχων μήνας"];
  if (p === "pm") return [ser(new Date(y, m - 1, 1)), ser(new Date(y, m, 0)), "Προηγούμενος μήνας"];
  const a = fromInputDate(ui.rfrom) || t - 6, b = fromInputDate(ui.rto) || t;
  return [Math.min(a, b), Math.max(a, b), "Προσαρμοσμένη περίοδος"];
}
function reportHTML() {
  const d = Core.derive(), Y = ui.ry || ui.year, H = ui.rh || "", t = Core.today();
  const [from, to, plabel] = repPeriod();
  const byH = h => !H || Core.norm(h).split(",").map(x => x.trim()).includes(Core.norm(H));
  const S = Core.S.lists, win = S["Πορεία ενδιαφέροντος"][5], lost = S["Πορεία ενδιαφέροντος"][6], sp = S["Χορηγία"];
  const L = y => d.leads.filter(l => l.year === y && byH(l.handler));
  const ls = L(Y), lp = L(Y - 1);
  const acts = d.acts.filter(a => a.date >= from && a.date <= to && byH(a.handler)).sort((a, b) => b.date - a.date || b.i - a.i);
  const sum = a => a.reduce((s, l) => s + (Number(l.v["Τ.μ."]) || 0), 0);
  const ex = ls.filter(l => l.stage === win), ca = ls.filter(l => l.stage === lost), exP = lp.filter(l => l.stage === win), caP = lp.filter(l => l.stage === lost);
  const conv = (e, c) => e.length + c.length ? Math.round(100 * e.length / (e.length + c.length)) + "%" : "–";
  // νέα leads της περιόδου (εξαιρούνται όσα ήρθαν με την αρχική μεταφορά από το Excel)
  const cts = d.leads.map(l => l.created).filter(Boolean), cnt = {}; cts.forEach(c => cnt[c] = (cnt[c] || 0) + 1);
  const bulk = new Set(Object.keys(cnt).filter(k => cnt[k] > 20));
  const isoSer = s => { const x = new Date(s); return isNaN(x) ? 0 : Math.floor(Date.UTC(x.getFullYear(), x.getMonth(), x.getDate()) / 864e5) + 25569; };
  const newLeads = d.leads.filter(l => l.created && !bulk.has(l.created) && isoSer(l.created) >= from && isoSer(l.created) <= to && byH(l.handler));
  const open = ls.filter(l => l.open).map(l => ({ l, days: l.last ? t - Math.floor(l.last) : 99999 }));
  const late = open.filter(x => x.days >= ui.red).sort((a, b) => b.days - a.days);
  const hs = list("Χειριστής").filter(h => !h.includes(",") && (!H || Core.norm(h) === Core.norm(H)));
  const types = list("Τύπος ενέργειας").filter(x => acts.some(a => a.type === x));
  const nf = n => n ? Number(n).toLocaleString("el-GR", { maximumFractionDigits: 1 }) : "";
  const kpi = (v, l, c, prev) => `<div class="kpi ${c || ""}"><b>${v}</b><span>${l}${prev !== undefined ? `<span class="chg">${Y - 1}: ${prev}</span>` : ""}</span></div>`;
  const stages = list("Πορεία ενδιαφέροντος"), mx = Math.max(1, ...stages.map(s => ls.filter(l => l.stage === s).length));
  return `<div class="filters no-print">
    <label>Περίοδος ενεργειών<select id="rP">${[["7", "Τελευταίες 7 ημέρες"], ["30", "Τελευταίες 30 ημέρες"], ["m", "Τρέχων μήνας"], ["pm", "Προηγούμενος μήνας"], ["c", "Προσαρμογή…"]].map(([v, l]) => `<option value="${v}"${(ui.rp || "7") === v ? " selected" : ""}>${l}</option>`).join("")}</select></label>
    ${(ui.rp || "7") === "c" ? `<label>Από<input type="date" id="rF" value="${toInputDate(from)}"></label><label>Έως<input type="date" id="rT" value="${toInputDate(to)}"></label>` : ""}
    <label>Χρονιά leads<select id="rY">${opt(yearsAll(), Y)}</select></label>
    <label>Χειριστής<select id="rH">${opt(list("Χειριστής").filter(h => !h.includes(",")), H, "Όλοι")}</select></label>
    <button class="btn pri" id="rPrint">Αποθήκευση PDF / Εκτύπωση</button></div>
  <article class="rep">
  <h1>Αναφορά leads ${Y}${H ? " – " + esc(H) : ""}</h1>
  <p class="meta">${plabel}: ${fmtD(from)} – ${fmtD(to)} · Δημιουργήθηκε ${new Date().toLocaleString("el-GR")} από ${esc(ui.email)}</p>

  <section><h2>Εικόνα χρονιάς ${Y}</h2><div class="kpis">
    ${kpi(ls.length, "Leads", "", lp.length)}${kpi(ls.filter(l => l.open).length, "Ανοιχτά")}${kpi(ex.length, "Εκθέτες", "g", exP.length)}
    ${kpi(ls.filter(l => l.sponsor === sp[2]).length, "Χορηγοί", "g", lp.filter(l => l.sponsor === sp[2]).length)}${kpi(ca.length, "Ακυρώσεις", "", caP.length)}
    ${kpi(nf(sum(ex)) || 0, "Τ.μ. εκθετών", "", nf(sum(exP)) || 0)}${kpi(conv(ex, ca), "Μετατροπή", "", conv(exP, caP))}</div></section>

  <section><h2>Δραστηριότητα περιόδου</h2><div class="kpis">
    ${kpi(acts.length, "Ενέργειες")}${kpi(new Set(acts.map(a => a.code)).size, "Εταιρείες με επαφή")}${kpi(newLeads.length, "Νέα leads")}
    ${kpi(late.length, `Ανοιχτά ${ui.red}+ ημ. χωρίς επαφή`, late.length ? "r" : "")}${kpi(open.filter(x => x.days === 99999).length, "Ανοιχτά χωρίς καμία επαφή", "r")}</div>
    <div class="scroll"><table data-sort-id="rh"><thead><tr><th>Χειριστής</th><th style="text-align:right">Ενέργειες</th><th style="text-align:right">Εταιρείες</th>${types.map(x => `<th style="text-align:right">${esc(x)}</th>`).join("")}<th style="text-align:right">Ανοιχτά leads</th><th style="text-align:right">Καθυστερημένα</th></tr></thead><tbody>
    ${hs.map(h => { const ah = acts.filter(a => Core.norm(a.handler).includes(Core.norm(h))); const lh = open.filter(x => Core.norm(x.l.handler).includes(Core.norm(h)));
      return `<tr style="cursor:default"><td>${esc(h)}</td><td class="num"><b>${ah.length}</b></td><td class="num">${new Set(ah.map(a => a.code)).size}</td>${types.map(x => `<td class="num">${ah.filter(a => a.type === x).length || ""}</td>`).join("")}<td class="num">${lh.length}</td><td class="num">${lh.filter(x => x.days >= ui.red).length}</td></tr>`; }).join("")}
    </tbody></table></div></section>

  <section><h2>Pipeline ${Y}</h2><div class="bars"><div class="muted" style="font-size:12px"><span></span><span></span><span style="text-align:right">${Y}</span><span style="text-align:right">${Y - 1}</span><span style="text-align:right">Τ.μ.</span></div>
    ${stages.map(s => { const n = ls.filter(l => l.stage === s).length; return `<div><span>${esc(s)}</span><span class="bar"><i style="width:${100 * n / mx}%"></i></span><b style="text-align:right">${n}</b><span class="muted" style="text-align:right">${lp.filter(l => l.stage === s).length}</span><span style="text-align:right">${nf(sum(ls.filter(l => l.stage === s)))}</span></div>`; }).join("")}</div></section>

  <section><h2>Θέλουν επαφή (${late.length})</h2>${late.length ? `<div class="scroll"><table data-sort-id="rl"><thead><tr><th>Εταιρεία</th><th>Χειριστής</th><th>Πορεία</th><th>Τελευταία επαφή</th><th style="text-align:right">Ημέρες</th><th>Τι έγινε τελευταία</th></tr></thead><tbody>
    ${late.slice(0, 60).map(({ l, days }) => `<tr class="r" style="cursor:default"><td><b>${esc(l.name)}</b></td><td>${esc(l.handler)}</td><td>${esc(l.stage)}</td><td class="nw" data-s="${l.last || ""}">${fmtD(l.last) || "καμία"}</td><td class="num" data-s="${days}">${days === 99999 ? "–" : days}</td><td>${esc(l.lastDesc)}</td></tr>`).join("")}
    </tbody></table></div>${late.length > 60 ? `<p class="muted" style="font-size:12px">…και ${late.length - 60} ακόμα (δείτε την Παρακολούθηση).</p>` : ""}` : `<p class="muted">Κανένα ανοιχτό lead δεν έχει μείνει ${ui.red}+ ημέρες χωρίς επαφή.</p>`}</section>

  ${newLeads.length ? `<section><h2>Νέα leads περιόδου (${newLeads.length})</h2><div class="scroll"><table data-sort-id="rn"><thead><tr><th>Εταιρεία</th><th>Χρονιά</th><th>Προέλευση</th><th>Χειριστής</th><th>Πορεία</th></tr></thead><tbody>
    ${newLeads.map(l => `<tr style="cursor:default"><td><b>${esc(l.name)}</b></td><td class="num">${l.year}</td><td>${esc(l.v["Προέλευση"])}</td><td>${esc(l.handler)}</td><td>${esc(l.stage)}</td></tr>`).join("")}</tbody></table></div></section>` : ""}

  <section style="break-inside:auto"><h2>Ενέργειες περιόδου (${acts.length})</h2>${acts.length ? `<div class="scroll"><table data-sort-id="ra"><thead><tr><th>Ημερομηνία</th><th>Εταιρεία</th><th>Τύπος</th><th>Περιγραφή</th><th>Χειριστής</th></tr></thead><tbody>
    ${acts.slice(0, 300).map(a => `<tr style="cursor:default"><td class="nw" data-s="${a.date}">${fmtD(a.date)}</td><td><b>${esc(a.name)}</b></td><td>${esc(a.type)}</td><td>${esc(a.desc)}</td><td>${esc(a.handler)}</td></tr>`).join("")}</tbody></table></div>` : `<p class="muted">Καμία ενέργεια στην περίοδο.</p>`}</section>
  </article>`;
}

// ---- Οδηγίες ----
function helpHTML() {
  const sec = [["start", "Ξεκίνημα"], ["track", "Παρακολούθηση"], ["lead", "Νέο lead"], ["action", "Ενέργεια"], ["contact", "Επαφές"], ["card", "Καρτέλα εταιρείας"],
    ["delete", "Διαγραφή"], ["import", "Εισαγωγή"], ["export", "Εξαγωγή"], ["summary", "Σύνοψη"], ["offer", "Προσφορά"], ["ai", "AI κλάδος"], ["report", "Αναφορά PDF"], ["settings", "Ρυθμίσεις"], ["admin", "Διαχειριστής"], ["faq", "Συχνές ερωτήσεις"]];
  return `<article class="help">
  <h1 style="font-size:28px;margin:4px 0 6px">Οδηγίες χρήσης</h1>
  <p class="muted" style="margin:0">Το Leads CRM κρατά τις εταιρείες, τα leads ανά χρονιά, τις ενέργειες και τις επαφές της έκθεσης. Όλα αποθηκεύονται αμέσως στη βάση και τα βλέπει όλη η ομάδα.</p>
  <div class="toc" role="navigation" aria-label="Περιεχόμενα">${sec.map(([id, t]) => `<a href="#h-${id}" data-jump="h-${id}">${t}</a>`).join("")}</div>

  <h2 id="h-start">Ξεκίνημα</h2>
  <ul>
    <li><b>Σύνδεση:</b> με το email και τον κωδικό που σας έδωσε ο διαχειριστής. Μένετε συνδεδεμένοι μέχρι να πατήσετε «Αποσύνδεση».</li>
    <li><b>Η πράσινη τελεία</b> δίπλα στο email σας σημαίνει ότι η εφαρμογή λαμβάνει ζωντανά τις αλλαγές των συναδέλφων. Αν είναι γκρι, ανανεώστε τη σελίδα.</li>
    <li><b>Ρυθμίσεις → «Είμαι ο/η»:</b> διαλέξτε το όνομά σας. Έτσι μπαίνει αυτόματα ως χειριστής στις νέες καταχωρήσεις.</li>
    <li><b>Εγκατάσταση ως εφαρμογή:</b> στον υπολογιστή πατήστε «Εγκατάσταση εφαρμογής» πάνω δεξιά (Chrome/Edge). Στο κινητό: Android → μενού ⋮ → «Εγκατάσταση εφαρμογής», iPhone → Safari → Κοινοποίηση → «Προσθήκη στην οθόνη Αφετηρίας».</li>
  </ul>

  <h2 id="h-track">Παρακολούθηση</h2>
  <p>Η βασική οθόνη: τα leads μιας χρονιάς, με αυτά που χρειάζονται επαφή πρώτα.</p>
  <table><thead><tr><th>Χρώμα</th><th>Σημαίνει</th></tr></thead><tbody>
    <tr style="cursor:default"><td><span class="st"><i class="dot r"></i>Κόκκινο</span></td><td>Καμία επαφή ακόμα, ή ${ui.red} ημέρες και πάνω χωρίς επαφή</td></tr>
    <tr style="cursor:default"><td><span class="st"><i class="dot a"></i>Πορτοκαλί</span></td><td>${ui.orange}–${ui.red - 1} ημέρες χωρίς επαφή: θέλει επαφή σύντομα</td></tr>
    <tr style="cursor:default"><td><span class="st"><i class="dot"></i>Πράσινο</span></td><td>Πρόσφατη επαφή (κάτω από ${ui.orange} ημέρες)</td></tr>
    <tr style="cursor:default"><td><span class="st"><i class="dot k"></i>Κλειστό</span></td><td>Εκθέτης ή ακύρωση, και χωρίς χορηγία σε εξέλιξη· φαίνεται μόνο με «Εμφάνιση: Όλα»</td></tr></tbody></table>
  <ul>
    <li><b>Φίλτρα:</b> Χρονιά, Χειριστής (η δική σας λίστα = φίλτρο με το όνομά σας), Μόνο ανοιχτά / Όλα, και αναζήτηση σε όνομα, επαφή, τηλέφωνο, σημειώσεις κ.λπ.</li>
    <li><b>Pipeline:</b> τα κουμπάκια με τα στάδια δείχνουν πόσα leads έχει το καθένα· πατήστε ένα για να δείτε μόνο αυτό το στάδιο.</li>
    <li><b>«+ Ενέργεια»</b> στην αρχή κάθε γραμμής: καταγράφετε γρήγορα τι έγινε με αυτό το lead.</li>
    <li><b>Κλικ σε γραμμή:</b> ανοίγει η καρτέλα της εταιρείας.</li>
    <li><b>Στήλες:</b> το κουμπί «Στήλες» προσθέτει/αφαιρεί στήλες και αλλάζει τη σειρά τους (↑ ↓). Η επιλογή κρατιέται στον browser σας.</li>
    <li><b>Αντιγραφή email:</b> κλικ πάνω σε ένα email (υπογραμμισμένο με διακεκομμένη) το αντιγράφει. Το κουμπί <b>«Αντιγραφή email»</b> αντιγράφει μαζί όλα τα email της λίστας που βλέπετε (με τα φίλτρα και την αναζήτηση που έχετε βάλει), χωρισμένα με «;» για επικόλληση στο Outlook – για μαζική αποστολή καλύτερα στην «Ιδιαίτ. κοιν.» (Bcc).</li>
    <li><b>Πλάτος στηλών:</b> σύρετε τη δεξιά άκρη του τίτλου μιας στήλης (ο δείκτης γίνεται ↔). Διπλό κλικ στην άκρη την επαναφέρει στο αυτόματο πλάτος. Ισχύει σε όλους τους πίνακες και θυμάται για τον λογαριασμό σας.</li>
    <li><b>Ταξινόμηση:</b> κλικ στον τίτλο μιας στήλης → ▲ αύξουσα, ξανά → ▼ φθίνουσα, τρίτη φορά → αρχική σειρά. Ισχύει σε όλους τους πίνακες.</li>
  </ul>

  <h2 id="h-lead">Νέο lead / νέα εταιρεία</h2>
  <p>Για <b>νέα εταιρεία</b> ή για <b>παλιά εταιρεία σε νέα χρονιά</b>. Σε ένα βήμα φτιάχνει εταιρεία (αν δεν υπάρχει), επαφή, lead και πρώτη ενέργεια.</p>
  <ul>
    <li>Στο «Εταιρεία» αρχίστε να γράφετε: η λίστα προτείνει τις υπάρχουσες. Για νέα, γράψτε απλώς το όνομα.</li>
    <li>Αν το όνομα <b>μοιάζει</b> με υπάρχουσα (π.χ. «Goodwe Hellas ΑΕ» και «GOODWE»), εμφανίζεται «Μήπως υπάρχει ήδη;». Πατήστε την εταιρεία για να τη χρησιμοποιήσετε· αν είναι πράγματι νέα, πατήστε «Αποθήκευση» δύο φορές.</li>
    <li><b>Χώρα:</b> γράψτε λίγα γράμματα στα ελληνικά ή στα αγγλικά («γερμ», «germ») και διαλέξτε. Αποθηκεύεται με το αγγλικό όνομα.</li>
    <li><b>Χειριστής:</b> τσεκάρετε έναν ή περισσότερους.</li>
    <li>Ένα lead ανά εταιρεία ανά χρονιά. Αν υπάρχει ήδη, χρησιμοποιήστε «+ Ενέργεια».</li>
  </ul>

  <h2 id="h-action">Νέα ενέργεια / σχόλιο</h2>
  <p>Κάθε τηλέφωνο, email, συνάντηση ή σχόλιο. Από εδώ μετριούνται οι «ημέρες χωρίς επαφή».</p>
  <ul>
    <li>Διαλέξτε εταιρεία· η χρονιά, αν μείνει κενή, είναι η τελευταία του lead. Πάνω στη φόρμα φαίνεται πού βρίσκεται τώρα το lead.</li>
    <li>Γράψτε <b>Περιγραφή</b>. Ο τύπος, αν μείνει κενός, γίνεται «Σχόλιο».</li>
    <li><b>Ενημέρωση lead:</b> συμπληρώστε μόνο ό,τι άλλαξε (νέα πορεία, χορηγία, Hall, τ.μ., χειριστές). Τα κενά πεδία δεν αλλάζουν τίποτα.</li>
    <li>Για να αλλάξετε μόνο την πορεία χωρίς ενέργεια, αφήστε κενά Τύπο και Περιγραφή.</li>
    <li>Αν το lead γίνει «Ακύρωση», θα σας θυμίσει να βάλετε και «Λόγο ακύρωσης».</li>
  </ul>

  <h2 id="h-contact">Επαφές</h2>
  <ul>
    <li><b>«+ Επαφή»:</b> νέο πρόσωπο σε υπάρχουσα εταιρεία. «Κύρια επαφή: Ναι – αντί της παλιάς» την κάνει τη μόνη κύρια.</li>
    <li>Η κύρια επαφή είναι αυτή που φαίνεται στις λίστες (Επαφή, Τηλέφωνο, Email).</li>
    <li>Αλλαγή ή αφαίρεση: από την καρτέλα της εταιρείας.</li>
  </ul>

  <h2 id="h-card">Καρτέλα εταιρείας</h2>
  <p>Ανοίγει με κλικ σε οποιαδήποτε γραμμή. Δείχνει στοιχεία, επαφές, leads ανά χρονιά και όλο το ιστορικό ενεργειών. Από εδώ:</p>
  <ul>
    <li><b>Επεξεργασία</b> στοιχείων εταιρείας, κάθε lead (Hall, Stand, σημειώσεις κ.λπ.), κάθε επαφής και κάθε ενέργειας.</li>
    <li><b>Σβήσιμο</b> μιας ενέργειας ή επαφής (δεύτερο κλικ για επιβεβαίωση).</li>
    <li><b>Μετονομασία:</b> το νέο όνομα φαίνεται παντού αμέσως.</li>
    <li><b>+ Lead νέας χρονιάς</b>, <b>+ Ενέργεια</b>, <b>+ Επαφή</b>, <b>Διαγραφή</b>, ήδη συμπληρωμένα με την εταιρεία.</li>
  </ul>

  <h2 id="h-delete">Διαγραφή</h2>
  <ul>
    <li><b>Με χρονιά:</b> σβήνει μόνο εκείνο το lead και τις ενέργειές του· η εταιρεία και οι επαφές μένουν.</li>
    <li><b>«Ολόκληρη η εταιρεία»:</b> σβήνει εταιρεία, όλα τα leads, ενέργειες και επαφές.</li>
    <li>Πριν σβήσει δείχνει τι θα χαθεί και ζητά να τσεκάρετε «ΝΑΙ – οριστική διαγραφή».</li>
  </ul>
  <div class="warn">Η διαγραφή είναι οριστική. Αν δεν είστε σίγουροι, κρατήστε πρώτα ένα αντίγραφο με «Εξαγωγή σε Excel».</div>

  <h2 id="h-import">Εισαγωγή από Excel / CSV</h2>
  <ol>
    <li><b>Αρχείο:</b> .xlsx ή .csv με μία εταιρεία ανά γραμμή και τίτλους στηλών (π.χ. Company, Contact Person, E-mail).</li>
    <li><b>Αντιστοίχιση:</b> όσες στήλες αναγνωρίστηκαν είναι ήδη επιλεγμένες· ελέγξτε τις υπόλοιπες. Ορίστε χρονιά, προέλευση, πορεία, Hall και χειριστές για όλα τα νέα leads.</li>
    <li><b>Έλεγχος:</b> για κάθε γραμμή φαίνεται τι θα γίνει. Οι <b>κίτρινες</b> μοιάζουν με εταιρεία που υπάρχει: διαλέξτε «Νέα εταιρεία» ή «Ίδια με…». Η ίδια εταιρεία δύο φορές στο αρχείο μπαίνει μία φορά με όλες τις επαφές.</li>
    <li><b>Εισαγωγή:</b> μην κλείσετε τη σελίδα μέχρι να τελειώσει. Στο τέλος φαίνονται πόσα μπήκαν και τυχόν σφάλματα.</li>
  </ol>
  <div class="tip">Τσεκάρετε «Καταγραφή ενέργειας» αν δεν θέλετε τα νέα leads να εμφανίζονται κόκκινα ως «Καμία επαφή».</div>

  <h2 id="h-export">Εξαγωγή σε Excel</h2>
  <p>Το κουμπί πάνω δεξιά κατεβάζει ένα Excel με φύλλα Εταιρείες, Leads (με τελευταία επαφή και ιστορικό), Ενέργειες, Επαφές και Ρυθμίσεις. Χρήσιμο για αντίγραφο ασφαλείας ή για να στείλετε μια λίστα.</p>

  <h2 id="h-summary">Σύνοψη</h2>
  <ul>
    <li><b>Δείκτες</b> της χρονιάς δίπλα στην προηγούμενη: leads, εκθέτες, χορηγοί, ακυρώσεις, τ.μ., ποσοστό μετατροπής (εκθέτες / (εκθέτες + ακυρώσεις)).</li>
    <li><b>Πορεία ενδιαφέροντος</b> και <b>ανά χειριστή</b> (leads, ανοιχτά, εκθέτες, ενέργειες της εβδομάδας).</li>
    <li><b>Ανά προέλευση</b>, με ομαδοποίηση ανά πλήρη προέλευση, τύπο (Παλιός Εκθέτης / Νέο Lead…) ή κανάλι (Προσέγγιση / email…).</li>
  </ul>

  <h2 id="h-offer">Οικονομική προσφορά</h2>
  <ul>
    <li>Από το κουμπί <b>«Οικονομική προσφορά»</b> (κενή) ή από την καρτέλα εταιρείας → lead → <b>«Προσφορά»</b> (συμπληρώνονται εταιρεία, Hall, Stand και τ.μ.).</li>
    <li>Διαλέξτε <b>Ελληνικά / English</b>, γράψτε τ.μ. ανά τύπο χώρου, mini booth, υπαίθριο, κατασκευή τύπου 2, open stage. Οι τιμές ανά μονάδα αλλάζουν αν χρειαστεί.</li>
    <li><b>Έκπτωση %</b> στον χώρο (με το χέρι) και, αν θέλετε, <b>επιπλέον (συνδυαστική) έκπτωση</b> πάνω στο υπόλοιπο. Η ετικέτα της έκπτωσης αλλάζει (π.χ. «ΕΚΠΤΩΣΗ (ΛΟΓΩ ΜΕΤΡΩΝ)»).</li>
    <li>Το σύνολο, ο ΦΠΑ και το τελικό ποσό φαίνονται δεξιά καθώς γράφετε. <b>«PDF / Εκτύπωση»</b> → Αποθήκευση ως PDF.</li>
    <li>Οι τιμές, ο ΦΠΑ, το τέλος εγγραφής και το κείμενο πληρωμής που αλλάζετε θυμούνται για τις επόμενες προσφορές σας.</li>
  </ul>

  <h2 id="h-ai">Πρόταση κλάδου με AI</h2>
  <ul>
    <li><b>Μία εταιρεία:</b> στη φόρμα «Στοιχεία εταιρείας» ή «Νέο lead» πατήστε <b>«✨ Πρόταση κλάδου με AI»</b>. Εμφανίζεται πρόταση, βεβαιότητα και αιτιολόγηση· με «Χρήση» μπαίνει στο πεδίο και μετά πατάτε Αποθήκευση.</li>
    <li><b>Πολλές μαζί:</b> Ρυθμίσεις → «Πρόταση κλάδου με AI» → για όλες τις εταιρείες χωρίς κλάδο. Ελέγξτε τον πίνακα (οι κίτρινες έχουν χαμηλή βεβαιότητα και δεν είναι τσεκαρισμένες), αλλάξτε ό,τι θέλετε και πατήστε «Αποθήκευση επιλεγμένων».</li>
    <li><b>Τι στέλνεται:</b> μόνο όνομα εταιρείας, χώρα και domain εταιρικού email. Ποτέ ονόματα, τηλέφωνα, προσωπικά email ή σημειώσεις. Το AI διαλέγει μόνο από τη λίστα «Κλάδος».</li>
    <li>Για μικρές τοπικές εταιρείες το AI «μαντεύει» από το όνομα· ελέγχετε πάντα πριν αποθηκεύσετε.</li>
  </ul>

  <h2 id="h-report">Αναφορά (PDF)</h2>
  <ul>
    <li>Διαλέξτε <b>περίοδο</b> (τελευταίες 7 ή 30 ημέρες, τρέχων ή προηγούμενος μήνας, ή δικές σας ημερομηνίες), <b>χρονιά leads</b> και, αν θέλετε, <b>χειριστή</b>.</li>
    <li>Περιέχει: εικόνα της χρονιάς σε σύγκριση με την προηγούμενη, δραστηριότητα της περιόδου ανά χειριστή και τύπο ενέργειας, pipeline, ποια leads θέλουν επαφή, νέα leads και όλες τις ενέργειες της περιόδου.</li>
    <li><b>«Αποθήκευση PDF / Εκτύπωση»:</b> στο παράθυρο που ανοίγει διαλέξτε <b>Προορισμός → Αποθήκευση ως PDF</b> (ή «Microsoft Print to PDF») και πατήστε Αποθήκευση. Για καλύτερο αποτέλεσμα τσεκάρετε «Γραφικά φόντου» στις περισσότερες ρυθμίσεις.</li>
    <li>Τα «νέα leads» μετρούν όσα καταχωρήθηκαν μέσα στην περίοδο· όσα ήρθαν με την αρχική μεταφορά από το Excel δεν μετρούν ως νέα.</li>
  </ul>

  <h2 id="h-settings">Ρυθμίσεις</h2>
  <ul>
    <li><b>Όρια χρωμάτων:</b> μετά από πόσες ημέρες ένα lead γίνεται πορτοκαλί ή κόκκινο (μόνο για εσάς).</li>
    <li><b>Προσωπικές ρυθμίσεις</b> (στήλες, ταξινομήσεις, φίλτρα χρονιάς/χειριστή, «Είμαι ο/η», όρια χρωμάτων): αποθηκεύονται στον λογαριασμό σας, άρα είναι ίδιες σε κάθε υπολογιστή και κινητό, και δεν χάνονται με τις ενημερώσεις της εφαρμογής.</li>
    <li><b>Νέος χειριστής:</b> μπαίνει στις λίστες. Για να μπορεί και να συνδεθεί, ο διαχειριστής του φτιάχνει λογαριασμό (δείτε παρακάτω).</li>
    <li><b>Λίστες επιλογών:</b> «Προσθήκη» νέας τιμής· περάστε το ποντίκι πάνω από μια τιμή για <b>✎</b> μετονομασία (αλλάζει και σε όλες τις εγγραφές), <b>↑ ↓</b> σειρά, <b>✕</b> διαγραφή (μόνο από τη λίστα). Οι τιμές «Εξέλιξη σε εκθέτη», «Ακύρωση» και οι καταστάσεις χορηγίας μετρούν στα στατιστικά: μετονομάζονται, αλλά δεν σβήνονται.</li>
    <li><b>Χώρες:</b> ενοποίηση παλιών ονομάτων (π.χ. Κίνα → China) με ένα κλικ.</li>
    <li><b>Όρια Supabase:</b> μέγεθος βάσης και εκτίμηση κίνησης του μήνα ως προς τα όρια του δωρεάν πλάνου.</li>
    <li><b>Αλλαγή κωδικού</b> (τουλάχιστον 8 χαρακτήρες).</li>
  </ul>

  <h2 id="h-admin">Για τον διαχειριστή</h2>
  <ul>
    <li><b>Νέος χρήστης:</b> Supabase → Authentication → Users → Add user → Create new user, με email, προσωρινό κωδικό και «Auto Confirm User». Μετά προσθέστε το όνομά του στις Ρυθμίσεις → Νέος χειριστής.</li>
    <li><b>Ξέχασε τον κωδικό:</b> Supabase → Authentication → Users → ο χρήστης → «Send password recovery», ή διαγράψτε τον και ξαναφτιάξτε τον με νέο κωδικό.</li>
    <li><b>Αφαίρεση πρόσβασης:</b> Supabase → Authentication → Users → διαγραφή χρήστη. Τα δεδομένα που καταχώρησε μένουν.</li>
    <li><b>Δεδομένα απευθείας:</b> Supabase → Table Editor (companies, leads, actions, contacts, lists).</li>
    <li><b>Όρια και κατανάλωση:</b> Supabase → (organization) → Usage.</li>
    <li><b>Ενημερώσεις εφαρμογής:</b> γίνονται στο GitHub repo. Η σελίδα ανανεώνεται μόνη της 1–2 λεπτά μετά.</li>
  </ul>

  <h2 id="h-faq">Συχνές ερωτήσεις</h2>
  <h3>Γιατί ένα lead είναι κόκκινο ενώ του μίλησα;</h3>
  <p>Μετράει μόνο ό,τι έχει καταγραφεί ως ενέργεια. Πατήστε «+ Ενέργεια» και γράψτε τι έγινε.</p>
  <h3>Δεν βλέπω μια εταιρεία στην Παρακολούθηση.</h3>
  <p>Ελέγξτε Χρονιά, Χειριστή και «Εμφάνιση: Όλα» (τα κλειστά κρύβονται) και καθαρίστε την αναζήτηση. Αν δεν έχει lead εκείνη τη χρονιά, θα τη βρείτε στις «Εταιρείες».</p>
  <h3>Άλλαξε κάτι ο συνάδελφος και δεν το βλέπω.</h3>
  <p>Συνήθως εμφανίζεται σε λίγα δευτερόλεπτα. Αν η τελεία δίπλα στο email είναι γκρι, ανανεώστε τη σελίδα (<kbd>F5</kbd>).</p>
  <h3>Η σελίδα φαίνεται πολύ μεγάλη ή πολύ μικρή.</h3>
  <p><kbd>Ctrl</kbd> + <kbd>0</kbd> επαναφέρει το ζουμ στο 100%· <kbd>Ctrl</kbd> + <kbd>+</kbd> / <kbd>−</kbd> το αλλάζει.</p>
  <h3>«Η σύνδεσή σας έληξε ή δεν έχετε δικαίωμα».</h3>
  <p>Πατήστε «Αποσύνδεση» και συνδεθείτε ξανά.</p>
  <h3>Πού βρίσκονται τα δεδομένα;</h3>
  <p>Στη βάση Supabase της ομάδας. Η εφαρμογή στο GitHub είναι μόνο η «οθόνη»· δεν περιέχει δεδομένα.</p>
  </article>`;
}

// ---- Ρυθμίσεις ----
function settingsHTML() {
  const L = Core.S.lists;
  return `<div class="two"><div class="sec"><h3>Εγώ & όρια χρωμάτων</h3><div class="card"><p class="muted" style="margin:0 0 8px;font-size:12.5px">${prefSync.on ? "Οι προσωπικές σας ρυθμίσεις (στήλες, ταξινομήσεις, φίλτρα, αυτές εδώ) αποθηκεύονται στον λογαριασμό σας και σας ακολουθούν σε κάθε συσκευή." : "Οι προσωπικές σας ρυθμίσεις κρατιούνται μόνο σε αυτόν τον browser. Για να σας ακολουθούν σε κάθε συσκευή, τρέξτε μία φορά το <b>db/user_prefs.sql</b> στο Supabase."}</p><div class="fg">
    <label>Είμαι ο/η (προεπιλογή χειριστή στις φόρμες)<select id="sMe">${opt(list("Χειριστής").filter(h => !h.includes(",")), ui.me, "—")}</select></label><span></span>
    <label>Πορτοκαλί μετά από (ημέρες)<input id="sO" type="number" min="1" value="${ui.orange}"></label>
    <label>Κόκκινο μετά από (ημέρες)<input id="sR" type="number" min="1" value="${ui.red}"></label></div></div></div>
  <div class="sec"><h3>Νέος χειριστής</h3><div class="card"><p class="muted" style="margin-top:0;font-size:14px">Μπαίνει στη λίστα «Χειριστής» των Ρυθμίσεων. Η προσωπική του λίστα είναι η Παρακολούθηση με φίλτρο το όνομά του.</p>
    <div class="fg"><label class="full">Ονοματεπώνυμο (όπως θα φαίνεται στη στήλη Χειριστής)<input id="newH" placeholder="π.χ. Maria Papadopoulou"></label></div>
    <button class="btn pri" id="addH" style="margin-top:10px">Προσθήκη χειριστή</button>
    <p class="muted" style="font-size:13px;margin-bottom:0">Για να μπαίνει στην εφαρμογή, δημιουργήστε του και λογαριασμό: Supabase → Authentication → Users → Add user.</p></div></div>
  <div class="sec"><h3>Όρια Supabase (δωρεάν πλάνο)</h3><div class="card" id="usage"><span class="muted">Φόρτωση…</span></div>
    <div class="card" id="traffic"><span class="muted">Φόρτωση…</span></div></div>
  <div class="sec"><h3>Αλλαγή κωδικού</h3><div class="card"><div class="fg">
    <label>Νέος κωδικός<input id="pw1" type="password" autocomplete="new-password"></label><label>Ξανά<input id="pw2" type="password" autocomplete="new-password"></label></div>
    <button class="btn" id="pwBtn" style="margin-top:10px">Αλλαγή κωδικού</button></div></div></div>
  ${(() => { const fx = countryFixes(), unk = [...new Set(Core.rows.E.map(r => String(r.v["Χώρα"] || "").trim()).filter(v => v && !countryOf(v)))];
    return `<div class="sec"><h3>Χώρες</h3><div class="card"><p style="margin:0 0 8px;font-size:13.5px">Στις φόρμες η χώρα διαλέγεται από λίστα (γράφετε ελληνικά ή αγγλικά) και αποθηκεύεται με το αγγλικό της όνομα.</p>
    ${fx.length ? `<p style="margin:0 0 8px;font-size:13.5px"><b>${fx.length}</b> εταιρείες έχουν τη χώρα γραμμένη αλλιώς (π.χ. ${esc([...new Set(fx.map(x => Core.rows.E.find(r => r.id === x[0]).v["Χώρα"] + " → " + x[2]))].slice(0, 4).join(", "))}).</p><button class="btn pri sm" id="normC">Ενοποίηση ${fx.length} εγγραφών</button>` : `<p class="muted" style="margin:0;font-size:13px">Όλες οι χώρες είναι γραμμένες ενιαία.</p>`}
    ${unk.length ? `<p class="muted" style="margin:8px 0 0;font-size:12.5px">Δεν αναγνωρίστηκαν (διορθώστε τα από την καρτέλα της εταιρείας): ${esc(unk.join(", "))}</p>` : ""}</div></div>`; })()}
  <div class="sec"><h3>Πρόταση κλάδου με AI</h3><div class="card" id="aiCard">${aiBulkHTML()}</div></div>
  <div class="sec"><h3>Λίστες επιλογών</h3><p class="muted" style="font-size:14px;margin-top:0">Στην «Πορεία ενδιαφέροντος» η 6η τιμή σημαίνει επιτυχία και η 7η απώλεια· στη «Χορηγία» οι 2 πρώτες = σε εξέλιξη, η 3η = κλεισμένη. Οι νέες τιμές μπαίνουν στην πρώτη κενή θέση και τις βλέπουν αμέσως όλοι. Η μετονομασία (✎) αλλάζει την τιμή και σε όλες τις εγγραφές που τη χρησιμοποιούν· η διαγραφή (✕) τη βγάζει μόνο από τη λίστα. Οι τιμές με ειδική σημασία δεν σβήνονται.</p>
  <div class="lists">${Object.keys(L).filter(h => h !== "Ναι/Όχι").map(h => `<div class="card"><b>${esc(h)}</b><ol class="lv">${L[h].map((v, i) => [v, i]).filter(([v]) => String(v).trim() !== "").map(([v, i]) => `<li data-l="${esc(h)}" data-p="${i}"><span class="t">${esc(v)}</span><span class="lb">${Core.canMove(h) ? `<button data-lm="-1" title="Πάνω" aria-label="Πάνω">↑</button><button data-lm="1" title="Κάτω" aria-label="Κάτω">↓</button>` : ""}<button data-le title="Μετονομασία" aria-label="Μετονομασία">✎</button>${Core.isFixed(h, i) ? "" : `<button data-ld title="Διαγραφή" aria-label="Διαγραφή">✕</button>`}</span></li>`).join("")}</ol>
    <div style="display:flex;gap:6px"><input data-listin="${esc(h)}" placeholder="νέα τιμή" style="flex:1;min-height:34px;padding:4px 8px"><button class="btn sm" data-listadd="${esc(h)}">Προσθήκη</button></div></div>`).join("")}</div></div>`;
}

// ---------- events ----------
function bindMain() {
  const V = $("#view");
  V.onclick = e => {
    const q = e.target.closest("[data-quick]"); if (q) { e.stopPropagation(); return openForm("action", { company: codeLabel(+q.dataset.quick), year: q.dataset.year }); }
    const st = e.target.closest("[data-stage]"); if (st) { ui.stage = ui.stage === st.dataset.stage ? "" : st.dataset.stage; return rerender(); }
    if (e.target.id === "colBtn") return colPopover(e.target);
    if (e.target.id === "cpAll") return copyVisibleEmails();
    if (e.target.id === "addH") { busy(e.target, () => Core.addListValue("Χειριστής", $("#newH").value)); return; }
    if (e.target.id === "pwBtn") { changePw(); return; }
    const la = e.target.closest("[data-listadd]"); if (la) { const h = la.dataset.listadd; const inp = [...document.querySelectorAll("[data-listin]")].find(i => i.dataset.listin === h); busy(la, () => Core.addListValue(h, inp.value)); return; }
    const j = e.target.closest("[data-jump]"); if (j) { e.preventDefault(); document.getElementById(j.dataset.jump)?.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    const li = e.target.closest("li[data-l]");
    if (li && e.target.closest("button")) return listItemAction(li, e.target.closest("button"));
    const tr = e.target.closest("tr[data-code]"); if (tr) openDrawer(+tr.dataset.code);
  };
  const on = (id, ev, fn) => { const el = $("#" + id); if (el) el[ev] = fn; };
  on("fYear", "onchange", e => { ui.year = +e.target.value; LS.set("year", ui.year); ui.stage = ""; rerender(); });
  on("fHandler", "onchange", e => { ui.handler = e.target.value; LS.set("handler", ui.handler); rerender(); });
  on("fShow", "onchange", e => { ui.show = e.target.value; rerender(); });
  on("fQ", "oninput", e => { ui.q = e.target.value; rerender("fQ"); });
  on("cQ", "oninput", e => { ui.cq = e.target.value; rerender("cQ"); });
  on("aQ", "oninput", e => { ui.aq = e.target.value; rerender("aQ"); });
  on("aY", "onchange", e => { ui.ay = e.target.value; rerender(); });
  on("aH", "onchange", e => { ui.ah = e.target.value; rerender(); });
  on("aT", "onchange", e => { ui.at = e.target.value; rerender(); });
  on("sY", "onchange", e => { ui.sy = +e.target.value; rerender(); });
  on("srcG", "onchange", e => { ui.srcGroup = e.target.value; rerender(); });
  on("rP", "onchange", e => { ui.rp = e.target.value; rerender(); });
  on("rF", "onchange", e => { ui.rfrom = e.target.value; rerender(); });
  on("rT", "onchange", e => { ui.rto = e.target.value; rerender(); });
  on("rY", "onchange", e => { ui.ry = +e.target.value; rerender(); });
  on("rH", "onchange", e => { ui.rh = e.target.value; rerender(); });
  on("rPrint", "onclick", () => { const old = document.title; const [f, t] = repPeriod(); document.title = `Αναφορά leads ${ui.ry || ui.year} ${fmtD(f).replace(/\//g, "-")} έως ${fmtD(t).replace(/\//g, "-")}`; window.print(); setTimeout(() => document.title = old, 1000); });
  on("normC", "onclick", e => busy(e.target, async () => { const ch = countryFixes(); const n = await Core.setFieldMany("E", ch); return { msg: `Ενοποιήθηκαν ${n} εγγραφές χωρών.` }; }));
  on("sMe", "onchange", e => { ui.me = e.target.value; LS.set("me", ui.me); });
  on("sO", "onchange", e => { ui.orange = Math.max(1, +e.target.value || 7); LS.set("orange", ui.orange); });
  on("sR", "onchange", e => { ui.red = Math.max(1, +e.target.value || 21); LS.set("red", ui.red); });
}
async function loadTraffic() {
  const box = $("#traffic"); if (!box) return;
  await flushUsage();
  const now = new Date(), first = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const rows = await Core.monthUsage(first).catch(() => null);
  if (!$("#traffic")) return;
  if (!rows) { box.innerHTML = `<p class="muted" style="margin:0;font-size:13px">Η μέτρηση κίνησης δεν είναι ενεργή ακόμα: τρέξτε μία φορά το <b>db/usage_log.sql</b> στο SQL Editor του Supabase.</p>`; return; }
  const MB = 1048576, LIM = 5 * 1024 * MB, tot = rows.reduce((a, r) => a + Number(r.bytes), 0), pct = Math.min(100, 100 * tot / LIM);
  const col = pct > 80 ? "var(--red)" : pct > 60 ? "var(--amb)" : "var(--brand2)";
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Athens" });
  const byUser = {}; rows.forEach(r => byUser[r.user_email] = (byUser[r.user_email] || 0) + Number(r.bytes));
  const tday = rows.filter(r => String(r.day).slice(0, 10) === today).reduce((a, r) => a + Number(r.bytes), 0);
  const f = b => b >= 1024 * MB ? (b / 1024 / MB).toFixed(2) + " GB" : (b / MB).toFixed(1) + " MB";
  const since = rows.length ? rows.map(r => String(r.day).slice(0, 10)).sort()[0] : "";
  const startDay = since && since > first ? Number(since.slice(8, 10)) : 1;   // αν η μέτρηση ξεκίνησε μέσα στον μήνα
  const days = Math.max(1, now.getDate() - startDay + 1), dim = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate(), proj = tot / days * (dim - startDay + 1);
  box.innerHTML = `<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px"><b>Κίνηση αυτού του μήνα (εκτίμηση)</b><span>${f(tot)} από 5 GB (${pct.toFixed(1)}%)</span></div>
    <div class="bar" style="height:12px"><i style="width:${Math.max(pct, 0.5)}%;background:${col}"></i></div>
    <div class="grid" style="margin-top:10px"><div><span>Σήμερα</span>${f(tday)}</div><div><span>Πρόβλεψη τέλους μήνα</span>${f(proj)}</div>
    ${Object.entries(byUser).sort((a, b) => b[1] - a[1]).map(([u, b]) => `<div><span>${esc(u)}</span>${f(b)}</div>`).join("")}</div>
    <p class="muted" style="margin:10px 0 0;font-size:12.5px">Μετρά ό,τι κατεβάζει η εφαρμογή${since && since > first ? ` (από ${since.split("-").reverse().join("/")})` : ""}. Δεν μετρά ό,τι κάνετε απευθείας μέσα στο Supabase, και ο κύκλος χρέωσης του Supabase μπορεί να μην ξεκινά την 1η του μήνα· τα επίσημα νούμερα είναι στο Supabase → Usage.</p>`;
}
async function loadUsage() {
  loadTraffic();
  const box = $("#usage"); if (!box) return;
  const u = await Core.usage().catch(() => null);
  if (!$("#usage")) return;
  const fmt = n => n.toLocaleString("el-GR");
  const link = `<a href="https://supabase.com/dashboard/org/_/usage" target="_blank" rel="noopener">Supabase → Usage</a>`;
  if (!u) { box.innerHTML = `<p class="muted" style="margin:0;font-size:13px">Ο δείκτης δεν είναι ενεργός ακόμα: τρέξτε μία φορά το <b>db/usage.sql</b> στο SQL Editor του Supabase. Μέχρι τότε τα όρια φαίνονται στο ${link}.</p>`; return; }
  const mb = u.db_bytes / 1048576, pct = Math.min(100, 100 * mb / 500), col = pct > 80 ? "var(--red)" : pct > 60 ? "var(--amb)" : "var(--brand2)";
  const recs = u.companies + u.leads + u.actions + u.contacts;
  box.innerHTML = `<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px"><b>Μέγεθος βάσης</b><span>${mb.toFixed(1)} MB από 500 MB (${pct.toFixed(1)}%)</span></div>
    <div class="bar" style="height:12px"><i style="width:${Math.max(pct, 0.5)}%;background:${col}"></i></div>
    <div class="grid" style="margin-top:10px"><div><span>Εταιρείες</span>${fmt(u.companies)}</div><div><span>Leads</span>${fmt(u.leads)}</div><div><span>Ενέργειες</span>${fmt(u.actions)}</div><div><span>Επαφές</span>${fmt(u.contacts)}</div></div>
    <p class="muted" style="margin:10px 0 0;font-size:12.5px">${fmt(recs)} εγγραφές συνολικά. Το μέγεθος περιλαμβάνει και τα αρχεία συστήματος της βάσης (περίπου 10–20 MB σταθερά). Την κίνηση (egress, όριο 5 GB/μήνα) τη βλέπετε στο ${link}.</p>`;
}
// ---------- ταξινόμηση πινάκων (κλικ στον τίτλο της στήλης) ----------
ui.sorts = LS.get("sorts", {});
function sortVal(td) {
  if (!td) return null;
  if (td.dataset.s !== undefined) return td.dataset.s === "" ? null : Number(td.dataset.s);
  const t = td.textContent.trim(); if (!t || t === "–" || t === "—") return null;
  if (/^-?\d+([.,]\d+)?%?$/.test(t)) return parseFloat(t.replace(",", "."));
  return t;
}
function applySorts(root) {
  for (const tb of (root || document).querySelectorAll("table[data-sort-id]")) {
    const id = tb.dataset.sortId, st = ui.sorts[id], body = tb.tBodies[0]; if (!body) continue;
    const ths = [...tb.tHead.rows[0].cells];
    ths.forEach((th, i) => { if (!th.textContent.trim()) return; th.classList.add("so"); th.dataset.ci = i; th.removeAttribute("data-dir");
      if (!th.querySelector(".si")) th.insertAdjacentHTML("beforeend", '<span class="si">↕</span>');
      th.querySelector(".si").textContent = st && st.c === i ? (st.d > 0 ? "▲" : "▼") : "↕"; if (st && st.c === i) th.dataset.dir = st.d; });
    const rows = [...body.rows]; rows.forEach((r, i) => { if (r.dataset.oi === undefined) r.dataset.oi = i; });
    if (!st || !ths[st.c]) { rows.sort((a, b) => a.dataset.oi - b.dataset.oi); }
    else rows.sort((a, b) => {
      const x = sortVal(a.cells[st.c]), y = sortVal(b.cells[st.c]);
      if (x === null && y === null) return a.dataset.oi - b.dataset.oi; if (x === null) return 1; if (y === null) return -1;
      const r = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y), "el", { numeric: true, sensitivity: "base" });
      return r * st.d || a.dataset.oi - b.dataset.oi;
    });
    body.append(...rows);
    applyWidths(tb);
  }
}
// ---------- πλάτος στηλών (σύρσιμο στην άκρη του τίτλου, διπλό κλικ = αυτόματο) ----------
ui.widths = LS.get("widths", {});
const colKey = th => th.textContent.replace(/[↕▲▼]/g, "").trim();
function setColWidth(tb, i, w) {
  const cells = [tb.tHead.rows[0].cells[i], ...[...tb.tBodies[0].rows].map(r => r.cells[i])].filter(Boolean);
  for (const c of cells) {
    if (w) { c.style.width = c.style.minWidth = c.style.maxWidth = w + "px"; c.classList.add("wset"); }
    else { c.style.width = c.style.minWidth = c.style.maxWidth = ""; c.classList.remove("wset"); }
  }
}
function applyWidths(tb) {
  const id = tb.dataset.sortId, W = (ui.widths || {})[id] || {};
  [...tb.tHead.rows[0].cells].forEach((th, i) => {
    th.classList.add("rzt");
    if (!th.querySelector(".rz")) th.insertAdjacentHTML("beforeend", '<span class="rz" title="Σύρετε για πλάτος · διπλό κλικ: αυτόματο"></span>');
    const k = colKey(th) || "#" + i;
    if (W[k]) setColWidth(tb, i, W[k]);
  });
}
let rzIgnoreClick = false;
document.addEventListener("pointerdown", e => {
  const h = e.target.closest("th .rz"); if (!h) return;
  e.preventDefault(); e.stopPropagation();
  const th = h.parentElement, tb = th.closest("table[data-sort-id]"), i = [...th.parentElement.cells].indexOf(th);
  const x0 = e.clientX, w0 = th.getBoundingClientRect().width;
  h.classList.add("on"); document.body.classList.add("rzing"); rzIgnoreClick = true;
  let w = w0;
  const mv = ev => { w = Math.max(48, Math.min(900, Math.round(w0 + ev.clientX - x0))); setColWidth(tb, i, w); };
  const up = () => {
    document.removeEventListener("pointermove", mv); document.removeEventListener("pointerup", up);
    h.classList.remove("on"); document.body.classList.remove("rzing"); setTimeout(() => rzIgnoreClick = false, 50);
    if (Math.abs(w - w0) < 2) return;
    const id = tb.dataset.sortId; ui.widths = ui.widths || {}; (ui.widths[id] = ui.widths[id] || {})[colKey(th) || "#" + i] = w; LS.set("widths", ui.widths);
  };
  document.addEventListener("pointermove", mv); document.addEventListener("pointerup", up);
}, true);
document.addEventListener("dblclick", e => {
  const h = e.target.closest("th .rz"); if (!h) return;
  e.preventDefault(); e.stopPropagation();
  const th = h.parentElement, tb = th.closest("table[data-sort-id]"), i = [...th.parentElement.cells].indexOf(th), id = tb.dataset.sortId;
  setColWidth(tb, i, 0); if (ui.widths && ui.widths[id]) { delete ui.widths[id][colKey(th) || "#" + i]; LS.set("widths", ui.widths); }
}, true);
document.addEventListener("click", e => {
  if (rzIgnoreClick || e.target.closest(".rz")) return;
  const th = e.target.closest("th.so"); if (!th) return;
  const tb = th.closest("table[data-sort-id]"), id = tb.dataset.sortId, c = +th.dataset.ci, st = ui.sorts[id];
  ui.sorts[id] = !st || st.c !== c ? { c, d: 1 } : st.d === 1 ? { c, d: -1 } : null;   // ▲ → ▼ → αρχική σειρά
  if (!ui.sorts[id]) delete ui.sorts[id];
  LS.set("sorts", ui.sorts); applySorts(tb.parentElement);
});
new MutationObserver(() => { const v = $("#view"); if (v && !v._sorted) { v._sorted = true; applySorts(v); } }).observe(document.body, { childList: true, subtree: true });

// ---------- αντιγραφή email ----------
const EMAIL_RE = /[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}/g;
const emailsOf = v => String(v ?? "").match(EMAIL_RE) || [];
function emailsHTML(v) {
  const t = String(v ?? ""); if (!t.trim()) return "";
  const parts = []; let last = 0;
  for (const m of t.matchAll(EMAIL_RE)) { parts.push(esc(t.slice(last, m.index))); parts.push(`<span class="cp" data-copy="${esc(m[0])}" title="Κλικ για αντιγραφή">${esc(m[0])}</span>`); last = m.index + m[0].length; }
  parts.push(esc(t.slice(last)));
  return parts.join("");
}
async function copyText(text, msg) {
  let ok = false;
  try { await navigator.clipboard.writeText(text); ok = true; } catch (e) {
    try { const ta = document.createElement("textarea"); ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select(); ok = document.execCommand("copy"); ta.remove(); } catch (e2) {}
  }
  toast(ok ? msg : "Δεν έγινε αντιγραφή – ο browser δεν το επέτρεψε.", !ok);
}
document.addEventListener("click", e => {
  const c = e.target.closest("[data-copy]"); if (!c) return;
  e.preventDefault(); e.stopPropagation(); copyText(c.dataset.copy, `Αντιγράφηκε: ${c.dataset.copy}`);
}, true);
function copyVisibleEmails() {
  const tb = document.querySelector("#view table[data-sort-id=trk], #view table[data-sort-id=cos]"); if (!tb) return;
  const seen = new Set(), out = [], comp = Core.derive().comp;
  for (const tr of tb.querySelectorAll("tbody tr[data-code]")) {   // οι γραμμές που φαίνονται, με τη σειρά τους – ανεξάρτητα από το αν φαίνεται η στήλη Email
    const c = comp.get(+tr.dataset.code); if (!c) continue;
    for (const m of emailsOf(c.email)) { const k = m.toLowerCase(); if (!seen.has(k)) { seen.add(k); out.push(m); } }
  }
  if (!out.length) return toast("Δεν υπάρχουν email στη λίστα που βλέπετε.", true);
  copyText(out.join("; "), `Αντιγράφηκαν ${out.length} email (χωρισμένα με «;» – επικόλληση στο Προς / Κοιν. / Ιδιαίτ. κοιν.).`);
}

// ---------- χώρες ----------
function countryFixes() {
  const ch = [];
  for (const r of Core.rows.E) { const v = r.v["Χώρα"]; if (!String(v || "").trim()) continue; const c = countryOf(v); if (c && c.en !== v) ch.push([r.id, "Χώρα", c.en]); }
  return ch;
}
function setupCountry(frm) {
  for (const box of frm.querySelectorAll(".cbx")) {
    const inp = box.querySelector(".cbx-in"), hid = box.querySelector("input[type=hidden]"), lst = box.querySelector(".cbx-list");
    let items = [], act = -1;
    const show = () => { items = countrySearch(inp.value).slice(0, 60); act = items.length ? 0 : -1;
      lst.innerHTML = items.map((c, i) => `<div data-i="${i}" aria-selected="${i === act}">${esc(c.el)}<small>${esc(c.en)}</small></div>`).join("") || `<div style="cursor:default" class="muted">Καμία χώρα· θα κρατηθεί όπως το γράψατε</div>`; lst.hidden = false; };
    const pick = c => { hid.value = c.en; inp.value = `${c.el} · ${c.en}`; lst.hidden = true; };
    const mark = () => [...lst.children].forEach((d, i) => d.setAttribute("aria-selected", i === act));
    inp.onfocus = () => { inp.select(); show(); };
    inp.oninput = () => { const c = countryOf(inp.value); hid.value = c ? c.en : inp.value.trim(); show(); };
    inp.onkeydown = e => {
      if (lst.hidden) return;
      if (e.key === "ArrowDown") { e.preventDefault(); act = Math.min(items.length - 1, act + 1); mark(); lst.children[act]?.scrollIntoView({ block: "nearest" }); }
      else if (e.key === "ArrowUp") { e.preventDefault(); act = Math.max(0, act - 1); mark(); lst.children[act]?.scrollIntoView({ block: "nearest" }); }
      else if (e.key === "Enter" && act >= 0 && items[act]) { e.preventDefault(); pick(items[act]); }
      else if (e.key === "Escape") { e.stopPropagation(); lst.hidden = true; }
    };
    lst.onmousedown = e => { const d = e.target.closest("[data-i]"); if (d) { e.preventDefault(); pick(items[+d.dataset.i]); } };
    inp.onblur = () => setTimeout(() => { lst.hidden = true; const c = countryOf(hid.value); if (c) inp.value = `${c.el} · ${c.en}`; }, 120);
  }
}
function rerender(focusId) {
  const pos = focusId && $("#" + focusId) ? $("#" + focusId).selectionStart : null;
  const views = { track: trackHTML, companies: companiesHTML, history: historyHTML, summary: summaryHTML, settings: settingsHTML, help: helpHTML, report: reportHTML };
  $("#view").innerHTML = views[ui.view](); bindMain(); applySorts($("#view"));
  if (ui.view === "settings") loadUsage();
  if (focusId) { const el = $("#" + focusId); el.focus(); if (pos !== null) el.setSelectionRange(pos, pos); }
}
function listItemAction(li, b) {
  const list = li.dataset.l, pos = +li.dataset.p, val = (Core.S.lists[list] || [])[pos];
  if (b.dataset.lm) return busy(b, () => Core.moveListValue(list, pos, +b.dataset.lm));
  if (b.dataset.ld !== undefined) {
    if (!b.dataset.sure) {
      const n = Core.listUsage(list, val);
      b.dataset.sure = "1"; b.classList.add("danger"); b.textContent = n ? `Σβήσιμο; (σε ${n} εγγρ.)` : "Σβήσιμο;";
      setTimeout(() => { if (b.isConnected) { delete b.dataset.sure; b.classList.remove("danger"); b.textContent = "✕"; } }, 4000);
      return;
    }
    return busy(b, () => Core.deleteListValue(list, pos));
  }
  if (b.dataset.le !== undefined) {
    const n = Core.listUsage(list, val);
    li.innerHTML = `<input value="${esc(val)}" aria-label="Νέα τιμή"><span style="display:flex;gap:4px;flex-wrap:wrap;align-items:center"><button class="btn sm pri" data-ls>Αποθήκευση</button><button class="btn sm" data-lc>Άκυρο</button>${n ? `<span class="muted" style="font-size:12px">θα αλλάξει και σε ${n} εγγραφές</span>` : ""}</span>`;
    const inp = li.querySelector("input"); inp.focus(); inp.select();
    const save = () => busy(li.querySelector("[data-ls]"), () => Core.renameListValue(list, pos, inp.value));
    inp.onkeydown = e => { if (e.key === "Enter") { e.preventDefault(); save(); } if (e.key === "Escape") { e.stopPropagation(); rerender(); } };
    li.querySelector("[data-ls]").onclick = e => { e.stopPropagation(); save(); };
    li.querySelector("[data-lc]").onclick = e => { e.stopPropagation(); rerender(); };
  }
}
async function busy(btn, fn) {
  btn.disabled = true;
  try { after(await fn()); } catch (er) { toast(er.message, true); btn.disabled = false; }
}
async function changePw() {
  const a = $("#pw1").value, b = $("#pw2").value;
  if (a.length < 8) return toast("Ο κωδικός θέλει τουλάχιστον 8 χαρακτήρες.", true);
  if (a !== b) return toast("Οι δύο κωδικοί δεν ταιριάζουν.", true);
  const { error } = await sb.auth.updateUser({ password: a });
  if (error) toast(error.message, true); else { $("#pw1").value = $("#pw2").value = ""; toast("Ο κωδικός άλλαξε."); }
}

// ---------- καρτέλα εταιρείας ----------
const codeLabel = code => { const c = Core.derive().comp.get(code); return c ? `${c.code} · ${c.name}` : ""; };
function openDrawer(code) {
  const c = Core.derive().comp.get(code);
  if (!c) { closeDrawer(); return; }
  ui.drawer = code;
  const dr = $("#drawer"), lbl = codeLabel(code);
  const leads = c.leads.slice().sort((a, b) => b.year - a.year);
  const acts = c.actions.slice().sort((a, b) => b.date - a.date || b.i - a.i);
  const lf = (l, h) => esc(l.v[h]);
  dr.innerHTML = `<div class="dh"><div style="display:flex;justify-content:space-between;gap:10px"><div><div style="font-size:13px;color:var(--lime)">Κωδ. ${c.code}</div><h2>${esc(c.name)}</h2></div><button class="x-close" id="dClose" aria-label="Κλείσιμο">×</button></div>
    <div class="row"><button class="btn lime sm" data-f="action">+ Ενέργεια</button><button class="btn ghost sm" data-f="lead">+ Lead νέας χρονιάς</button><button class="btn ghost sm" data-f="contact">+ Επαφή</button><button class="btn ghost sm" data-f="rename">Μετονομασία</button><button class="btn ghost sm" data-f="del">Διαγραφή</button></div></div>
  <div class="db">
    <div class="sec"><h3>Στοιχεία <button class="btn sm" data-edit="E" data-i="${c.i}">Επεξεργασία</button></h3><div class="grid">
      ${["Κλάδος", "Χώρα", "FG/RET", "Tellody", "Αναγνωριστικό List"].map(h => `<div><span>${h}</span>${esc(h === "Χώρα" ? countryLabel(c.v[h]) : c.v[h]) || "—"}</div>`).join("")}
      <div><span>Σύνδεσμος αρχείων</span>${/^https:\/\//.test(String(c.v["Σύνδεσμος αρχείων"])) ? `<a href="${esc(c.v["Σύνδεσμος αρχείων"])}" target="_blank" rel="noopener">άνοιγμα</a>` : esc(c.v["Σύνδεσμος αρχείων"]) || "—"}</div></div></div>
    <div class="sec"><h3>Επαφές (${c.contacts.length})</h3>${c.contacts.map(p => `<div class="card"><div class="hd"><b>${esc(p.v["Ονοματεπώνυμο"])}${p.v["Κύρια επαφή"] === "Ναι" ? ' <span class="chip" style="padding:1px 8px">Κύρια</span>' : ""}</b><span><button class="btn sm" data-edit="P" data-i="${p.i}">Επεξεργασία</button> <button class="btn sm" data-rm="P" data-i="${p.i}">Αφαίρεση</button></span></div>
      <div class="grid">${["Θέση", "Τηλέφωνο", "Email", "Σημειώσεις"].filter(h => String(p.v[h] ?? "").trim()).map(h => `<div><span>${h}</span>${h === "Email" ? emailsHTML(p.v[h]) : esc(p.v[h])}</div>`).join("")}</div></div>`).join("") || '<p class="muted">Καμία επαφή.</p>'}</div>
    <div class="sec"><h3>Leads</h3>${leads.map(l => `<div class="card"><div class="hd"><b style="font-size:17px">${l.year}</b><span class="st"><i class="dot ${l.open ? "g" : "k"}"></i>${esc(l.stage || "—")}</span><span><button class="btn sm" data-f="action" data-year="${l.year}">+ Ενέργεια</button> <button class="btn sm" data-offer="${l.i}">Προσφορά</button> <button class="btn sm" data-edit="L" data-i="${l.i}">Επεξεργασία</button></span></div>
      <div class="grid"><div><span>Χειριστής</span>${esc(l.handler) || "—"}</div><div><span>Χορηγία</span>${esc(l.sponsor) || "—"}</div><div><span>Προέλευση</span>${lf(l, "Προέλευση") || "—"}</div>
      <div><span>Hall / Stand</span>${lf(l, "Hall") || "—"}${l.v["Αριθμός Stand"] ? " · " + lf(l, "Αριθμός Stand") : ""}</div><div><span>Τ.μ.</span>${lf(l, "Τ.μ.") || "—"}</div><div><span>Τελευταία επαφή</span>${fmtD(l.last) || "καμία"}</div>
      <div><span>Εκθέτης προηγ. χρονιάς</span>${l.prevExhibitor}</div>${l.v["Λόγος ακύρωσης"] ? `<div><span>Λόγος ακύρωσης</span>${lf(l, "Λόγος ακύρωσης")}</div>` : ""}
      ${l.v["Σημειώσεις"] ? `<div style="grid-column:1/-1"><span>Σημειώσεις</span>${lf(l, "Σημειώσεις")}</div>` : ""}${l.v["Αρχικά σχόλια List"] ? `<div style="grid-column:1/-1"><span>Αρχικά σχόλια List</span>${lf(l, "Αρχικά σχόλια List")}</div>` : ""}</div></div>`).join("") || '<p class="muted">Κανένα lead.</p>'}</div>
    <div class="sec"><h3>Ιστορικό ενεργειών (${acts.length})</h3><ul class="tl">${acts.map(a => `<li><span class="x"><button class="btn sm" data-edit="A" data-i="${a.i}">Αλλαγή</button><button class="btn sm" data-rm="A" data-i="${a.i}">Σβήσιμο</button></span>
      <div class="m">${fmtD(a.date)} · ${a.year || ""} · ${esc(a.handler)}</div><div>${a.type ? `<b>${esc(a.type)}</b> · ` : ""}${esc(a.desc)}</div></li>`).join("") || '<p class="muted">Καμία ενέργεια.</p>'}</ul></div>
  </div>`;
  dr.classList.add("on"); $("#ov").classList.add("on");
  dr.onclick = e => {
    if (e.target.id === "dClose") return closeDrawer();
    const f = e.target.closest("[data-f]"); if (f) return openForm(f.dataset.f, { company: lbl, year: f.dataset.year || "" });
    const ed = e.target.closest("[data-edit]"); if (ed) return openForm("edit" + ed.dataset.edit, { i: +ed.dataset.i, company: lbl });
    const of = e.target.closest("[data-offer]"); if (of) { const l = c.leads.find(x => x.i === +of.dataset.offer); return openOffer({ company: c.name, hall: l.v["Hall"], stand: l.v["Αριθμός Stand"], sqm: l.v["Τ.μ."] }); }
    const rm = e.target.closest("[data-rm]"); if (rm) return askRemove(rm.dataset.rm, +rm.dataset.i, rm);
  };
}
function closeDrawer() { ui.drawer = 0; $("#drawer").classList.remove("on"); $("#ov").classList.remove("on"); }
$("#ov").onclick = closeDrawer;
document.addEventListener("keydown", e => { if (e.key === "Escape") { if ($("#modal").classList.contains("on")) closeForm(); else if (ui.drawer) closeDrawer(); } });
function askRemove(k, i, btn) {
  if (btn.dataset.sure) { busy(btn, async () => { await Core.removeRow(k, i); return { msg: k === "A" ? "Η ενέργεια σβήστηκε." : "Η επαφή αφαιρέθηκε." }; }); return; }
  btn.dataset.sure = "1"; btn.textContent = "Σίγουρα;"; btn.classList.add("danger");
  setTimeout(() => { if (btn.isConnected) { delete btn.dataset.sure; btn.textContent = k === "A" ? "Σβήσιμο" : "Αφαίρεση"; btn.classList.remove("danger"); } }, 3500);
}

// ---------- φόρμες ----------
const F = (name, label, type, o = {}) => ({ name, label, type, ...o });
const sel = (name, label, listName, o) => F(name, label, "select", { list: listName, ...o });
const FORMS = {
  lead: { title: "Νέο lead / νέα εταιρεία", ok: "Αποθήκευση", hint: "Νέα εταιρεία ή παλιά εταιρεία για νέα χρονιά. Δημιουργεί εταιρεία (αν δεν υπάρχει), επαφή, lead και πρώτη ενέργεια.",
    groups: [["Εταιρεία", [F("company", "Εταιρεία * (διαλέξτε ή γράψτε νέο όνομα)", "company", { full: 1 }), sel("sector", "Κλάδος", "Κλάδος"), F("country", "Χώρα", "country"), sel("fgret", "FG/RET", "FG/RET"), sel("tellody", "Tellody", "Tellody")]],
      ["Επαφή", [F("cname", "Ονοματεπώνυμο", "text"), F("crole", "Θέση", "text"), F("cphone", "Τηλέφωνο", "text"), F("cemail", "Email", "email")]],
      ["Lead", [sel("year", "Χρονιά *", "Χρονιά"), sel("source", "Προέλευση (τύπος · κανάλι)", "Προέλευση"), F("handler", "Χειριστής (ένας ή περισσότεροι)", "multi", { list: "Χειριστής" }), sel("stage", "Πορεία ενδιαφέροντος", "Πορεία ενδιαφέροντος"), sel("sponsor", "Χορηγία", "Χορηγία"), sel("hall", "Hall", "Hall"), F("sqm", "Τ.μ.", "number")]],
      ["Πρώτη ενέργεια", [F("adate", "Ημερομηνία", "date"), sel("atype", "Τύπος ενέργειας", "Τύπος ενέργειας"), F("adesc", "Περιγραφή", "textarea", { full: 1 })]]],
    run: v => Core.newLead(v) },
  action: { title: "Νέα ενέργεια / σχόλιο", ok: "Αποθήκευση", hint: "Καταγράφει ενέργεια και, προαιρετικά, ενημερώνει την πορεία του lead. Αφήστε κενή την περιγραφή για να αλλάξετε μόνο το lead.",
    groups: [["Ενέργεια", [F("company", "Εταιρεία *", "company", { full: 1 }), F("year", "Χρονιά lead (κενό = τελευταία)", "leadyear"), F("date", "Ημερομηνία", "date"), sel("type", "Τύπος ενέργειας", "Τύπος ενέργειας"), sel("handler", "Ποιος την έκανε", "Χειριστής", { single: 1 }), F("desc", "Περιγραφή *", "textarea", { full: 1 })]],
      ["Ενημέρωση lead (μόνο ό,τι άλλαξε)", [sel("stage", "Νέα πορεία ενδιαφέροντος", "Πορεία ενδιαφέροντος"), sel("sponsor", "Νέα κατάσταση χορηγίας", "Χορηγία"), sel("reason", "Λόγος ακύρωσης", "Λόγος ακύρωσης"), sel("hall", "Hall", "Hall"), F("sqm", "Τ.μ.", "number"), F("newhandler", "Αλλαγή χειριστών lead", "multi", { list: "Χειριστής", hint: "Αφήστε όλα ξετσέκαρτα για να μείνουν οι χειριστές ως έχουν." })]]],
    run: v => Core.newAction(v), live: actionInfo },
  contact: { title: "Νέα επαφή", ok: "Προσθήκη", hint: "«Ναι – αντί της παλιάς» = γίνεται η μόνη κύρια επαφή (οι παλιές γίνονται Όχι).",
    groups: [["", [F("company", "Εταιρεία *", "company", { full: 1 }), F("name", "Ονοματεπώνυμο *", "text"), F("role", "Θέση", "text"), F("phone", "Τηλέφωνο", "text"), F("email", "Email", "email"),
      F("primary", "Κύρια επαφή", "select", { opts: ["Όχι", "Ναι – επιπλέον κύρια", "Ναι – αντί της παλιάς"], nofirst: 1 }), F("notes", "Σημειώσεις", "textarea", { full: 1 })]]],
    run: v => Core.newContact(v) },
  del: { title: "Διαγραφή", ok: "Οριστική διαγραφή", danger: 1, hint: "Σβήνει ένα lead (με χρονιά) ή ολόκληρη την εταιρεία (χωρίς χρονιά: εταιρεία + leads + ενέργειες + επαφές). Δεν αναιρείται – εκτός αν δεν αποθηκεύσετε το Excel.",
    groups: [["", [F("company", "Εταιρεία *", "company", { full: 1 }), F("year", "Τι διαγράφεται", "delyear", { full: 1 }), F("confirm", "ΝΑΙ – οριστική διαγραφή", "check", { full: 1 })]]],
    run: v => Core.remove(v), live: delInfo },
  rename: { title: "Μετονομασία εταιρείας", ok: "Μετονομασία", hint: "Το όνομα αλλάζει μόνο στις «Εταιρείες»· όλα τα άλλα φύλλα ακολουθούν, γιατί συνδέονται με τον κωδικό.",
    groups: [["", [F("company", "Εταιρεία", "company", { full: 1 }), F("newName", "Το σωστό όνομα *", "text", { full: 1 })]]],
    run: v => Core.rename(String(Core.parseCode(v.company) || v.company), v.newName) },
  editE: { title: "Στοιχεία εταιρείας", ok: "Αποθήκευση", k: "E", groups: [["", [sel("Κλάδος", "Κλάδος", "Κλάδος"), F("Χώρα", "Χώρα", "country"), sel("FG/RET", "FG/RET", "FG/RET"), sel("Tellody", "Tellody", "Tellody"), F("Σύνδεσμος αρχείων", "Σύνδεσμος αρχείων", "text", { full: 1 }), F("Αναγνωριστικό List", "Αναγνωριστικό List", "text")]]] },
  editL: { title: "Επεξεργασία lead", ok: "Αποθήκευση", k: "L", hint: "Για αλλαγή πορείας με καταγραφή στο ιστορικό, προτιμήστε «+ Ενέργεια».",
    groups: [["", [sel("Προέλευση", "Προέλευση", "Προέλευση"), F("Χειριστής", "Χειριστής (ένας ή περισσότεροι)", "multi", { list: "Χειριστής" }), sel("Πορεία ενδιαφέροντος", "Πορεία ενδιαφέροντος", "Πορεία ενδιαφέροντος"), sel("Χορηγία", "Χορηγία", "Χορηγία"),
      sel("Λόγος ακύρωσης", "Λόγος ακύρωσης", "Λόγος ακύρωσης"), sel("Hall", "Hall", "Hall"), F("Αριθμός Stand", "Αριθμός Stand", "text"), F("Τ.μ.", "Τ.μ.", "number"), F("Σημειώσεις", "Σημειώσεις", "textarea", { full: 1 }), F("Αρχικά σχόλια List", "Αρχικά σχόλια List", "textarea", { full: 1 })]]] },
  editP: { title: "Επεξεργασία επαφής", ok: "Αποθήκευση", k: "P", groups: [["", [F("Ονοματεπώνυμο", "Ονοματεπώνυμο", "text"), F("Θέση", "Θέση", "text"), F("Τηλέφωνο", "Τηλέφωνο", "text"), F("Email", "Email", "email"),
    F("Κύρια επαφή", "Κύρια επαφή", "select", { opts: ["Ναι", "Όχι"] }), F("Σημειώσεις", "Σημειώσεις", "textarea", { full: 1 })]]] },
  editA: { title: "Αλλαγή ενέργειας", ok: "Αποθήκευση", k: "A", groups: [["", [F("Ημερομηνία", "Ημερομηνία", "date"), sel("Τύπος ενέργειας", "Τύπος ενέργειας", "Τύπος ενέργειας"), sel("Χειριστής", "Ποιος την έκανε", "Χειριστής", { single: 1 }), F("Χρονιά lead", "Χρονιά lead", "number"), F("Περιγραφή", "Περιγραφή", "textarea", { full: 1 })]]] }
};
let cur = null;
function fieldHTML(f, val) {
  const id = "f_" + f.name.replace(/[^\w]/g, "_") + "_" + Math.random().toString(36).slice(2, 6);
  const nm = `name="${esc(f.name)}" id="${id}"`, cls = f.full ? ' class="full"' : "";
  let inp;
  if (f.type === "multi") {   // πολλαπλή επιλογή (χειριστές): αποθηκεύεται ως «Α, Β»
    const cur = String(val ?? "").split(",").map(x => x.trim()).filter(Boolean);
    const opts = list(f.list).filter(h => !h.includes(","));
    cur.forEach(c => { if (!opts.some(o => Core.norm(o) === Core.norm(c))) opts.push(c); });
    return `<label class="full" style="gap:3px">${esc(f.label)}<span class="mchk" data-multi="${esc(f.name)}">${opts.map(o => `<label><input type="checkbox" value="${esc(o)}"${cur.some(c => Core.norm(c) === Core.norm(o)) ? " checked" : ""}>${esc(o)}</label>`).join("")}</span><input type="hidden" name="${esc(f.name)}" value="${esc(cur.join(", "))}">${f.hint ? `<span style="font-size:12px">${esc(f.hint)}</span>` : ""}</label>`;
  }
  if (f.type === "select") {
    const vals = f.opts || (f.single ? list(f.list).filter(h => !h.includes(",")) : list(f.list)); const all = val !== "" && val !== undefined && !vals.map(String).includes(String(val)) ? [...vals, val] : vals;
    inp = `<select ${nm}>${opt(all, val, f.nofirst ? undefined : "—")}</select>`;
  } else if (f.type === "textarea") inp = `<textarea ${nm}>${esc(val)}</textarea>`;
  else if (f.type === "company") inp = `<input ${nm} list="dl-co" autocomplete="off" value="${esc(val)}">`;
  else if (f.type === "country") inp = `<span class="cbx"><input class="cbx-in" id="${id}" autocomplete="off" placeholder="γράψτε ελληνικά ή αγγλικά…" value="${esc(val ? countryLabel(val) : "")}"><input type="hidden" name="${esc(f.name)}" value="${esc(val)}"><span class="cbx-list" hidden></span></span>`;
  else if (f.type === "date") inp = `<input ${nm} type="date" value="${val ? toInputDate(val) : ""}">`;
  else if (f.type === "leadyear" || f.type === "delyear") inp = `<select ${nm}></select>`;
  else if (f.type === "check") return `<label class="full" style="flex-direction:row;align-items:center;gap:8px;color:var(--red);font-weight:600"><input type="checkbox" ${nm} style="min-height:0;width:20px;height:20px">${esc(f.label)}</label>`;
  else inp = `<input ${nm} type="${f.type === "number" ? "number" : f.type === "email" ? "email" : "text"}" value="${esc(val)}"${f.type === "number" ? ' step="any"' : ""}>`;
  return `<label for="${id}"${cls}>${esc(f.label)}${inp}</label>`;
}
function openForm(kind, pre) {
  const fd = FORMS[kind]; cur = { kind, fd, pre };
  let vals = { ...pre };
  if (fd.k) vals = { ...Core.row(fd.k, pre.i) };
  else {
    const t = Core.today();
    if (kind === "lead") Object.assign(vals, { year: pre.year || ui.year, handler: ui.me, adate: t });
    if (kind === "action") Object.assign(vals, { date: t, handler: ui.me });
    if (kind === "contact") vals.primary = "Όχι";
  }
  if (kind === "lead" && pre.company) vals.year = Math.max(ui.year, Core.latestYear(Core.parseCode(pre.company)) + 1);
  $("#mbox").innerHTML = `<div class="mh"><h2>${esc(fd.title)}${fd.k ? ` <span class="muted" style="font-size:14px;font-weight:400">${esc(pre.company)}</span>` : ""}</h2><button class="x-close" id="mClose" aria-label="Κλείσιμο">×</button></div>
    <form id="frm" class="mb" autocomplete="off">${fd.hint ? `<p class="muted" style="margin-top:0;font-size:14px">${esc(fd.hint)}</p>` : ""}<div id="live"></div>
    ${fd.groups.map(([lg, fs]) => `<fieldset>${lg ? `<legend>${esc(lg)}</legend>` : ""}<div class="fg">${fs.map(f => fieldHTML(f, vals[f.name] ?? "")).join("")}</div></fieldset>`).join("")}</form>
    <div class="mf"><span class="msg" id="fmsg"></span><button class="btn" id="mCancel">Άκυρο</button><button class="btn ${fd.danger ? "danger" : "pri"}" id="mOk">${esc(fd.ok)}</button></div>`;
  $("#modal").classList.add("on");
  const frm = $("#frm");
  const co = frm.querySelector('[name="company"]');
  if (co && kind === "rename" && pre.company) co.readOnly = true;
  if (co && fd.k) co.remove();
  const yearSel = frm.querySelector('select[name="year"]');
  const fillYears = () => {
    const f = fd.groups.flat(2).find(x => x && x.name === "year"); if (!f || (f.type !== "leadyear" && f.type !== "delyear") || !yearSel) return;
    const c = Core.derive().comp.get(Core.parseCode(co.value)) || [...Core.derive().comp.values()].find(x => Core.norm(x.name) === Core.norm(co.value));
    const ys = c ? c.leads.map(l => l.year).sort((a, b) => b - a) : [];
    const keep = yearSel.value || String(pre.year || "");
    yearSel.innerHTML = (f.type === "leadyear" ? `<option value="">Τελευταία${ys.length ? " (" + ys[0] + ")" : ""}</option>` : `<option value="">Ολόκληρη η εταιρεία</option>`) + ys.map(y => `<option value="${y}"${String(y) === keep ? " selected" : ""}>${f.type === "delyear" ? "Μόνο το lead " + y : y}</option>`).join("");
  };
  const live = () => { fillYears(); if (fd.live) $("#live").innerHTML = fd.live(readForm()); if (kind === "lead") dupHint(co); };
  frm.oninput = e => { if (e.target.name === "company" || e.target.name === "year") live(); };
  frm.onchange = live;
  live();
  setupCountry(frm);
  if (kind === "lead" || kind === "editE") setupAiButton(frm, kind);
  for (const m of frm.querySelectorAll(".mchk")) m.onchange = () => { m.parentElement.querySelector(`input[type=hidden][name="${m.dataset.multi}"]`).value = [...m.querySelectorAll("input:checked")].map(x => x.value).join(", "); };
  frm.onsubmit = e => { e.preventDefault(); submitForm(); };
  $("#mClose").onclick = closeForm; $("#mCancel").onclick = closeForm; $("#mOk").onclick = submitForm;
  setTimeout(() => { const first = frm.querySelector("input:not([readonly]),select,textarea"); if (first && !pre.company) first.focus(); else { const d = frm.querySelector('[name="desc"],[name="name"],[name="newName"]'); if (d) d.focus(); } }, 30);
}
function readForm() {
  const v = {}; const frm = $("#frm"); if (!frm) return v;
  for (const el of frm.elements) { if (!el.name) continue; v[el.name] = el.type === "checkbox" ? el.checked : el.type === "date" ? fromInputDate(el.value) : el.value; }
  return v;
}
async function submitForm() {
  if (!cur || cur.busy) return;
  const { kind, fd, pre } = cur, v = readForm(), m = $("#fmsg"), okb = $("#mOk");
  if (kind === "lead" && v.company && !Core.findCompany(v.company) && !Core.parseCode(v.company) && !cur.dupOk) {
    const sim = similarCompanies(v.company);
    if (sim.length) { cur.dupOk = true; m.textContent = `⚠️ Μοιάζει με «${sim[0].c.name}». Αν είναι σίγουρα νέα εταιρεία, πατήστε ξανά «${fd.ok}».`; m.className = "msg err"; return; }
  }
  cur.busy = true; okb.disabled = true; m.textContent = "Αποθήκευση…"; m.className = "msg";
  try {
    let res;
    if (fd.k) {
      if (fd.k === "A" && v["Ημερομηνία"] > Core.today()) throw new Error("Η ημερομηνία είναι στο μέλλον.");
      if (fd.k === "A" && !v["Ημερομηνία"]) delete v["Ημερομηνία"];
      await Core.editRow(fd.k, pre.i, v); res = { msg: "Οι αλλαγές καταχωρήθηκαν." };
    } else res = await fd.run(v);
    closeForm();
    if (kind === "del" && !res.code) closeDrawer();
    if (res.code && kind !== "del" && !ui.drawer && (kind === "lead" || kind === "contact")) ui.drawer = res.code;
    after(res);
  } catch (e) { m.textContent = "⚠️ " + (e.message || e); m.className = "msg err"; if (cur) { cur.busy = false; okb.disabled = false; } }
}
function closeForm() { $("#modal").classList.remove("on"); $("#mbox").classList.remove("wide"); cur = null; }
function dupHint(co) {
  if (!co) return;
  let box = co.parentElement.querySelector(".dup"); if (!box) { box = document.createElement("div"); co.insertAdjacentElement("afterend", box); }
  const v = co.value.trim(); if (cur) cur.dupOk = false;
  const hit = v ? Core.findCompany(v) : null;
  if (!v) { box.className = ""; box.innerHTML = ""; return; }
  if (hit) { box.className = "dup ok"; box.textContent = `Υπάρχουσα εταιρεία (κωδ. ${hit.id}) – θα ανοίξει lead για τη χρονιά που διαλέγετε.`; return; }
  const sim = similarCompanies(v);
  if (!sim.length) { box.className = "dup ok"; box.textContent = "Νέα εταιρεία – δεν βρέθηκε παρόμοια."; return; }
  box.className = "dup";
  box.innerHTML = `<b>Μήπως υπάρχει ήδη;</b> Βρέθηκαν παρόμοιες εταιρείες:<br>${sim.map(x => `<button type="button" class="btn sm" data-use="${x.c.code}">${esc(x.c.name)} (κωδ. ${x.c.code})</button>`).join("")}<br><span class="muted">Πατήστε μία για να τη χρησιμοποιήσετε, ή συνεχίστε αν είναι πράγματι νέα.</span>`;
  box.onclick = e => { const b = e.target.closest("[data-use]"); if (!b) return; co.value = codeLabel(+b.dataset.use); co.dispatchEvent(new Event("input", { bubbles: true })); };
}
function actionInfo(v) {
  const c = Core.derive().comp.get(Core.parseCode(v.company)) || [...Core.derive().comp.values()].find(x => Core.norm(x.name) === Core.norm(v.company));
  if (!c) return "";
  const y = +v.year || (c.leads.length ? Math.max(...c.leads.map(l => l.year)) : 0), l = c.leads.find(x => x.year === y);
  if (!l) return `<div class="info">Η «${esc(c.name)}» δεν έχει lead. Ανοίξτε πρώτα lead με «Νέο lead».</div>`;
  return `<div class="info"><b>Τώρα (${y}):</b> ${esc(l.stage || "χωρίς πορεία")}${l.sponsor ? " · χορηγία: " + esc(l.sponsor) : ""} · χειριστής: ${esc(l.handler || "—")} · κύρια επαφή: ${esc(c.person || "—")}<br><span class="muted">Τελευταία επαφή: ${fmtD(l.last) || "καμία"}${l.lastDesc ? " – " + esc(l.lastDesc) : ""}</span></div>`;
}
function delInfo(v) {
  const p = Core.deletePreview(v.company, v.year); if (!p) return "";
  return `<div class="info" style="background:var(--redbg)"><b>Θα διαγραφούν:</b> εταιρεία: ${v.year ? "όχι (μένει)" : "ΝΑΙ – ολόκληρη"} · leads: ${p.leads} · ενέργειες: ${p.actions} · επαφές: ${p.contacts}</div>`;
}
$("#modal").addEventListener("mousedown", e => { if (e.target.id === "modal") closeForm(); });
// ---------- Οικονομική προσφορά (από το Excel «Οικονομική προσφορά FG/RET 26») ----------
const OFFER_TXT = {
  el: { title: "ΟΙΚΟΝΟΜΙΚΗ ΠΡΟΣΦΟΡΑ", company: "ΕΠΩΝΥΜΙΑ ΕΤΑΙΡΕΙΑΣ", space: "ΧΩΡΟΣ", stand: "STAND", desc: "Περιγραφή χώρου", ppm: "€/m²", m2: "m²", fee: "Αμοιβή Συμμετοχής",
    indoor: "ΣΤΕΓΑΣΜΕΝΟΣ", s1: "Ίχνος εδάφους μιας όψης", s2: "Ίχνος εδάφους δύο όψεων", s3: "Ίχνος εδάφους τριών όψεων", s4: "Ίχνος εδάφους τεσσάρων όψεων",
    mini: "Mini booth 6 τμ με τυποποιημένη κατασκευή", outdoor: "Υπαίθριος Χώρος", disc: "ΕΚΠΤΩΣΗ", rest: "ΥΠΟΛΟΙΠΟ (ΜΕΙΟΝ ΕΚΠΤΩΣΗ)", disc2: "ΕΠΙΠΛΕΟΝ ΕΚΠΤΩΣΗ", rest2: "ΥΠΟΛΟΙΠΟ (ΜΕΙΟΝ ΕΠΙΠΛΕΟΝ ΕΚΠΤΩΣΗ)",
    booth: "ΤΥΠΟΠΟΙΗΜΕΝΗ ΚΑΤΑΣΚΕΥΗ ΑΠΟ HELEXPO ΤΥΠΟΥ 2", stage: "Μισάωρη εκδήλωση στο open stage", reg: "ΤΕΛΟΣ ΕΓΓΡΑΦΗΣ ΕΚΘΕΤΗ", total: "ΣΥΝΟΛΟ ΔΑΠΑΝΗΣ", vat: "Φ.Π.Α.", grand: "ΣΥΝΟΛΟ ΑΜΟΙΒΗΣ ΣΥΜΜΕΤΟΧΗΣ",
    valid: d => `Η δέσμευση του συγκεκριμένου χώρου ισχύει για ${d} ημέρες από την αποστολή του παρόντος.`, payTitle: "ΤΡΟΠΟΣ ΠΛΗΡΩΜΗΣ", banks: "ΤΡΑΠΕΖΙΚΟΙ ΛΟΓΑΡΙΑΣΜΟΙ",
    pay: "Με την οριστικοποίηση της Δήλωσης Συμμετοχής θα πρέπει να κατατεθεί το 50% του συνολικού ποσού του τιμολογίου και η εξόφληση να πραγματοποιηθεί κατά το προπαρασκευαστικό στάδιο της έκθεσης, έως 01/03/2027.\n\nΣε περίπτωση που επιθυμείτε εξόφληση εκδίδοντας επιταγές θα πρέπει με την οριστικοποίηση της Δήλωσης Συμμετοχής να κατατεθούν δύο επιταγές.\n• Η πρώτη να καλύπτει το 50% του συνολικού ποσού με λήξη 01/03/2027\n• Η δεύτερη να καλύπτει το 50% με λήξη 09/05/2027" },
  en: { title: "FINANCIAL OFFER", company: "COMPANY NAME", space: "PAVILION", stand: "STAND", desc: "Space Description", ppm: "€/m²", m2: "m²", fee: "Participation Fee",
    indoor: "INDOOR", s1: "Raw space, one side", s2: "Raw space, two sides", s3: "Raw space, three sides", s4: "Raw space, four sides",
    mini: "Mini booth 6 m² with preconstructed booth", outdoor: "Outdoor Space", disc: "DISCOUNT", rest: "AMOUNT (MINUS THE DISCOUNT)", disc2: "ADDITIONAL DISCOUNT", rest2: "AMOUNT (MINUS THE ADDITIONAL DISCOUNT)",
    booth: "PRECONSTRUCTED BOOTH / TYPE 2 (BY HELEXPO)", stage: "Half-hour event on the open stage", reg: "REGISTRATION FEE", total: "TOTAL PARTICIPATION FEE", vat: "VAT", grand: "TOTAL PARTICIPATION FEE (INCL. VAT)",
    valid: d => `The reservation of the selected exhibition space is valid for ${d} days after the offer is sent.`, payTitle: "PAYMENT METHODS", banks: "BANK ACCOUNTS",
    pay: "Once the Participation Form has been finalized, full payment of the total amount is due immediately." }
};
// γραμμές χώρου: [κλειδί, προεπιλεγμένη τιμή, μονάδα]
const OFFER_LINES = [["s1", 130, "m²"], ["s2", 140, "m²"], ["s3", 150, "m²"], ["s4", 160, "m²"], ["mini", 990, "τεμ."], ["outdoor", 60, "m²"]];
const OFFER_DEF = { lang: "el", valid: 10, p: { s1: 130, s2: 140, s3: 150, s4: 160, mini: 990, outdoor: 60, booth: 35, stage: 500 }, reg: 110, vat: 24 };
const eur = n => (Math.round(n * 100) / 100).toLocaleString("el-GR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
function offerCalc(o) {
  const q = k => Math.max(0, Number(o.q[k]) || 0), p = k => Number(o.p[k]) || 0;
  const line = k => q(k) * p(k);
  const discBase = ["s1", "s2", "s3", "s4", "outdoor"].reduce((a, k) => a + line(k), 0);   // όπως στο Excel: η έκπτωση στον χώρο
  const disc = discBase * (Number(o.disc) || 0) / 100, rest = discBase - disc;
  const disc2 = o.use2 ? rest * (Number(o.disc2) || 0) / 100 : 0, rest2 = rest - disc2;
  const mini = line("mini"), booth = line("booth"), stage = line("stage"), reg = o.useReg ? Number(o.reg) || 0 : 0;
  const sum = rest2 + mini + booth + stage + reg;
  const total = sum > 100 ? sum : 0;                                                // όπως το IF(SUM(...)>100;...;0) του Excel
  const vat = total * (Number(o.vat) || 0) / 100;
  return { discBase, disc, rest, disc2, rest2, mini, booth, stage, reg, total, vat, grand: total + vat };
}
function offerDefaults(pre) {
  const saved = LS.get("offer", {}) || {};
  const o = { ...OFFER_DEF, ...saved, p: { ...OFFER_DEF.p, ...(saved.p || {}) } };
  o.q = { s1: pre.sqm || "", s2: "", s3: "", s4: "", mini: "", outdoor: "", booth: "", stage: "" };
  o.company = pre.company || ""; o.hall = pre.hall || ""; o.standNo = pre.stand || "";
  o.disc = ""; o.use2 = false; o.disc2 = ""; o.useReg = true; o.date = Core.today();
  o.bankDetails = ""; o.discLabel = ""; o.pay = saved["pay_" + o.lang] || OFFER_TXT[o.lang].pay;
  return o;
}
let offer = null;
function openOffer(pre) {
  offer = offerDefaults(pre || {}); cur = { kind: "offer", fd: {}, pre: {} };
  $("#mbox").classList.add("wide"); $("#modal").classList.add("on"); drawOffer();
}
function drawOffer() {
  const o = offer, T = OFFER_TXT[o.lang], c = offerCalc(o);
  const num = (k, v, w) => `<input type="number" step="any" min="0" data-o="${k}" value="${esc(v)}" style="width:${w || 90}px;text-align:right">`;
  const row = (k, unit) => `<tr><td>${esc(T[k] || k)}</td><td>${num("p." + k, o.p[k], 90)}</td><td>${num("q." + k, o.q[k], 80)} <span class="muted">${unit}</span></td><td class="num" id="ol-${k}">${eur((Number(o.q[k]) || 0) * (Number(o.p[k]) || 0))}</td></tr>`;
  $("#mbox").innerHTML = `<div class="mh"><h2>Οικονομική προσφορά</h2><button class="x-close" id="mClose" aria-label="Κλείσιμο">×</button></div>
  <div class="mb"><div class="offer-grid">
   <div>
    <div class="fg">
      <label>Γλώσσα<select data-o="lang"><option value="el"${o.lang === "el" ? " selected" : ""}>Ελληνικά</option><option value="en"${o.lang === "en" ? " selected" : ""}>English</option></select></label>
      <label>Ισχύς προσφοράς (ημέρες)${num("valid", o.valid, 80)}</label>
      <label class="full">Εταιρεία<input data-o="company" list="dl-co" value="${esc(o.company)}"></label>
      <label>${o.lang === "en" ? "Pavilion" : "Χώρος"} (Hall)<input data-o="hall" value="${esc(o.hall)}" list="dl-hall"></label>
      <label>Stand<input data-o="standNo" value="${esc(o.standNo)}"></label>
    </div>
    <div class="scroll" style="margin-top:10px"><table class="otbl"><thead><tr><th>Περιγραφή</th><th>€ / μονάδα</th><th>Ποσότητα</th><th style="text-align:right">Ποσό</th></tr></thead><tbody>
      ${OFFER_LINES.map(([k, , u]) => row(k, u)).join("")}
      <tr><td>Έκπτωση στον χώρο <input data-o="discLabel" placeholder="${esc(T.disc)}" value="${esc(o.discLabel)}" style="width:170px"></td><td></td><td>${num("disc", o.disc, 80)} <span class="muted">%</span></td><td class="num" id="ol-disc">${c.disc ? "−" + eur(c.disc) : "–"}</td></tr>
      <tr><td colspan="3"><label style="display:flex;gap:6px;align-items:center"><input type="checkbox" data-o="use2"${o.use2 ? " checked" : ""} style="width:16px;height:16px;min-height:0">Επιπλέον έκπτωση (συνδυαστική)</label></td><td>${o.use2 ? num("disc2", o.disc2, 80) + ' <span class="muted">%</span>' : ""}</td></tr>
      ${row("booth", "m²")}${row("stage", "τεμ.")}
      <tr><td><label style="display:flex;gap:6px;align-items:center"><input type="checkbox" data-o="useReg"${o.useReg ? " checked" : ""} style="width:16px;height:16px;min-height:0">${esc(T.reg)}</label></td><td>${num("reg", o.reg, 90)}</td><td></td><td class="num">${o.useReg ? eur(Number(o.reg) || 0) : "–"}</td></tr>
      <tr><td>Φ.Π.Α.</td><td></td><td>${num("vat", o.vat, 80)} <span class="muted">%</span></td><td class="num" id="ol-vat">${eur(c.vat)}</td></tr>
    </tbody></table></div>
    <div class="fg" style="margin-top:10px"><label class="full">Τρόπος πληρωμής (κείμενο στο PDF)<textarea data-o="pay" rows="5">${esc(o.pay)}</textarea></label>
      <label class="full">Τραπεζικοί λογαριασμοί στο PDF (προαιρετικά)<textarea data-o="bankDetails" rows="3">${esc(o.bankDetails)}</textarea></label></div>
   </div>
   <aside class="offer-sum">
     <div><span>Χώρος (μετά τις εκπτώσεις)</span><b id="os-rest">${eur(c.rest2)}</b></div>
     <div><span>Mini booth / κατασκευή / open stage</span><b id="os-extra">${eur(c.mini + c.booth + c.stage)}</b></div>
     <div><span>Τέλος εγγραφής</span><b>${eur(c.reg)}</b></div>
     <div class="t"><span>${esc(OFFER_TXT.el.total)}</span><b id="os-total">${eur(c.total)}</b></div>
     <div><span>Φ.Π.Α. ${esc(o.vat)}%</span><b id="os-vat">${eur(c.vat)}</b></div>
     <div class="g"><span>ΣΥΝΟΛΟ με ΦΠΑ</span><b id="os-grand">${eur(c.grand)}</b></div>
   </aside>
  </div></div>
  <div class="mf"><span class="msg muted" style="font-size:12.5px">Τιμές, ΦΠΑ, τέλος εγγραφής και κείμενο πληρωμής θυμούνται για την επόμενη προσφορά.</span><button class="btn" id="mCancel">Κλείσιμο</button><button class="btn pri" id="offPdf">PDF / Εκτύπωση</button></div>`;
  const mb = $("#mbox");
  mb.oninput = e => {
    const k = e.target.dataset.o; if (!k) return;
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    if (k.startsWith("p.")) o.p[k.slice(2)] = v; else if (k.startsWith("q.")) o.q[k.slice(2)] = v; else o[k] = v;
    if (k === "lang") { o.pay = (LS.get("offer", {}) || {})["pay_" + v] || OFFER_TXT[v].pay; drawOffer(); return; }
    if (k === "use2" || k === "useReg") { drawOffer(); return; }
    const c2 = offerCalc(o);
    for (const [kk] of [...OFFER_LINES, ["booth"], ["stage"]]) { const el = $("#ol-" + kk); if (el) el.textContent = eur((Number(o.q[kk]) || 0) * (Number(o.p[kk]) || 0)); }
    $("#ol-disc").textContent = c2.disc ? "−" + eur(c2.disc) : "–"; $("#ol-vat").textContent = eur(c2.vat);
    $("#os-rest").textContent = eur(c2.rest2); $("#os-extra").textContent = eur(c2.mini + c2.booth + c2.stage);
    $("#os-total").textContent = eur(c2.total); $("#os-vat").textContent = eur(c2.vat); $("#os-grand").textContent = eur(c2.grand);
  };
  mb.onchange = mb.oninput;
  $("#mClose").onclick = closeForm; $("#mCancel").onclick = closeForm;
  $("#offPdf").onclick = printOffer;
}
function offerDocHTML(o) {
  const T = OFFER_TXT[o.lang], c = offerCalc(o), q = k => Number(o.q[k]) || 0, d = fmtD(o.date);
  const name = Core.findCompany(o.company) ? Core.findCompany(o.company).v["Εταιρεία"] : String(o.company).replace(/^\s*\d+\s*·\s*/, "");
  const ln = (label, k, cls) => `<tr class="${cls || ""}"><td colspan="2">${esc(label)}</td><td class="n">${eur(Number(o.p[k]) || 0)}</td><td class="n">${q(k) || ""}</td><td class="n">${q(k) ? eur(q(k) * (Number(o.p[k]) || 0)) : "–"}</td></tr>`;
  const sum = (label, v, cls) => `<tr class="${cls || "s"}"><td colspan="4">${esc(label)}</td><td class="n">${v}</td></tr>`;
  return `<div class="odoc">
    <img class="ologo" src="img/logo-offer.jpg" alt="ENERGY HELEXPO">
    <h1>${esc(T.title)}</h1>
    <table class="ohead"><tr><th>${esc(T.company)}</th><td colspan="3"><b>${esc(name)}</b></td></tr>
      <tr><th>${esc(T.space)}</th><td>${esc(o.hall)}</td><th>${esc(T.stand)}</th><td>${esc(o.standNo)}</td></tr></table>
    <p class="odate">${d}</p>
    <table class="olines"><thead><tr><th colspan="2">${esc(T.desc)}</th><th>${esc(T.ppm)}</th><th>${esc(T.m2)}</th><th>${esc(T.fee)}</th></tr></thead><tbody>
      ${["s1", "s2", "s3", "s4"].map((k, i) => `<tr>${i === 0 ? `<td class="vert" rowspan="4"><span>${esc(T.indoor)}</span></td>` : ""}<td>${esc(T[k])}</td><td class="n">${eur(Number(o.p[k]) || 0)}</td><td class="n">${q(k) || ""}</td><td class="n">${q(k) ? eur(q(k) * (Number(o.p[k]) || 0)) : "–"}</td></tr>`).join("")}
      ${q("mini") ? ln(T.mini, "mini") : ""}
      ${ln(T.outdoor, "outdoor")}
      ${sum(o.discLabel || T.disc, c.disc ? eur(c.disc) + (o.disc ? ` (${o.disc}%)` : "") : "–")}
      ${sum(T.rest, eur(c.rest))}
      ${o.use2 ? sum(T.disc2, c.disc2 ? eur(c.disc2) + ` (${o.disc2}%)` : "–") + sum(T.rest2, eur(c.rest2)) : ""}
      ${ln(T.booth, "booth")}
      ${q("stage") ? ln(T.stage, "stage") : ""}
      ${o.useReg ? sum(T.reg, eur(c.reg)) : ""}
      ${sum(T.total, eur(c.total))}
      ${sum(`${T.vat} ${o.vat}%`, eur(c.vat))}
      ${sum(T.grand, eur(c.grand), "g")}
    </tbody></table>
    <p class="ovalid">${esc(T.valid(o.valid))}</p>
    <div class="opay"><b>${esc(T.payTitle)}</b><div>${esc(o.pay).replace(/\n/g, "<br>")}</div></div>
    ${o.bankDetails.trim() ? `<div class="obanks"><b>${esc(T.banks)}</b><div>${esc(o.bankDetails).replace(/\n/g, "<br>")}</div></div>` : ""}
  </div>`;
}
function printOffer() {
  const o = offer;
  const keep = { p: o.p, reg: o.reg, vat: o.vat, valid: o.valid, lang: o.lang }; keep["pay_" + o.lang] = o.pay;
  LS.set("offer", { ...(LS.get("offer", {}) || {}), ...keep });
  let box = $("#offerPrint"); if (!box) { box = document.createElement("div"); box.id = "offerPrint"; document.body.appendChild(box); }
  box.innerHTML = offerDocHTML(o);
  const name = (Core.findCompany(o.company) || { v: { "Εταιρεία": o.company } }).v["Εταιρεία"];
  const old = document.title; document.title = `${o.lang === "en" ? "Financial offer" : "Οικονομική προσφορά"} ${name} ${fmtD(o.date).replace(/\//g, "-")}`;
  document.body.classList.add("print-offer");
  const done = () => { document.body.classList.remove("print-offer"); document.title = old; window.removeEventListener("afterprint", done); };
  window.addEventListener("afterprint", done);
  const img = box.querySelector("img");
  const go = () => { window.print(); setTimeout(done, 1500); };
  if (img && !img.complete) { img.onload = go; img.onerror = go; } else go();
}

// ---------- Πρόταση κλάδου με AI (Groq, μέσω της Edge Function «suggest-sector») ----------
const WEBMAIL = new Set(["gmail.com", "googlemail.com", "yahoo.com", "yahoo.gr", "hotmail.com", "hotmail.gr", "outlook.com", "outlook.com.gr", "live.com", "live.gr", "msn.com", "icloud.com", "me.com", "aol.com",
  "otenet.gr", "hol.gr", "windowslive.com", "mail.ru", "yandex.ru", "yandex.com", "gmx.de", "gmx.net", "web.de", "t-online.de", "libero.it", "orange.fr", "free.fr", "163.com", "126.com", "qq.com", "sina.com", "proton.me", "protonmail.com", "zoho.com", "cosmotemail.gr", "freemail.gr", "in.gr", "forthnet.gr", "vodafone.gr", "wind.gr", "nova.gr", "inbox.com"]);
function aiPayload(c) {   // ΜΟΝΟ όνομα, χώρα, domain εταιρικού email – τίποτα προσωπικό
  let domain = "";
  for (const p of c.contacts) for (const m of emailsOf(p.v["Email"])) { const d = m.split("@")[1].toLowerCase(); if (!WEBMAIL.has(d)) { domain = d; break; } }
  return { code: c.code, name: c.name, country: String(c.v["Χώρα"] || ""), domain };
}
async function aiSuggest(companies) {
  const sectors = list("Κλάδος");
  if (!sectors.length) throw new Error("Η λίστα «Κλάδος» στις Ρυθμίσεις είναι κενή.");
  const { data, error } = await sb.functions.invoke("suggest-sector", { body: { sectors, companies } });
  if (error) {
    let code = "", st = error.context && error.context.status;
    try { const b = await error.context.json(); code = b.error || ""; } catch (e) {}
    if (st === 404) throw new Error("Η λειτουργία AI δεν έχει στηθεί ακόμα στο Supabase (Edge Function «suggest-sector»). Δείτε Οδηγίες → AI.");
    if (code === "missing_groq_key") throw new Error("Λείπει το GROQ_API_KEY από τα Secrets του Supabase.");
    if (code === "rate_limited" || st === 429) throw new Error("Το δωρεάν όριο του Groq γέμισε προσωρινά. Δοκιμάστε σε λίγο.");
    if (code === "not_authenticated" || st === 401) throw new Error("Η σύνδεσή σας έληξε – αποσυνδεθείτε και ξανασυνδεθείτε.");
    throw new Error("Η πρόταση AI απέτυχε" + (code ? ` (${code})` : "") + ".");
  }
  return data.results || [];
}
// κουμπί «✨ Πρόταση» δίπλα στον Κλάδο, στη φόρμα στοιχείων εταιρείας και στο Νέο lead
function setupAiButton(frm, kind) {
  const sel = frm.querySelector('select[name="Κλάδος"], select[name="sector"]'); if (!sel) return;
  const lab = sel.closest("label"); const box = document.createElement("div"); box.className = "ai-box";
  box.innerHTML = `<button type="button" class="btn sm" id="aiOne">✨ Πρόταση κλάδου με AI</button><span class="ai-out"></span>`;
  lab.insertAdjacentElement("afterend", box);
  box.querySelector("#aiOne").onclick = async () => {
    const out = box.querySelector(".ai-out"), btn = box.querySelector("#aiOne");
    let payload;
    if (kind === "editE") { const c = Core.derive().comp.get(cur.pre.i); payload = aiPayload(c); }
    else {
      const name = frm.querySelector('[name="company"]').value.trim(); if (!name) { out.textContent = " Γράψτε πρώτα την εταιρεία."; return; }
      const hit = Core.findCompany(name), c = hit && Core.derive().comp.get(hit.id);
      const em = (frm.querySelector('[name="cemail"]') || {}).value || "", d = (emailsOf(em)[0] || "").split("@")[1] || "";
      payload = c ? aiPayload(c) : { code: 1, name: name.replace(/^\s*\d+\s*·\s*/, ""), country: (frm.querySelector('input[type=hidden][name="country"]') || {}).value || "", domain: WEBMAIL.has(d.toLowerCase()) ? "" : d.toLowerCase() };
      if (c) payload.code = 1;
    }
    btn.disabled = true; out.textContent = " Ρωτάω…";
    try {
      const [r] = await aiSuggest([payload]);
      const sent = `στάλθηκαν: ${payload.name}${payload.country ? " · " + payload.country : ""}${payload.domain ? " · " + payload.domain : ""}`;
      if (!r || !r.sector) { out.innerHTML = ` <span class="muted">Δεν μπόρεσε να κρίνει. (${esc(sent)})</span>`; }
      else {
        out.innerHTML = ` <b>${esc(r.sector)}</b> <span class="muted">(${Math.round(r.confidence * 100)}% · ${esc(r.reason)})</span> <button type="button" class="btn sm pri" id="aiUse">Χρήση</button><br><span class="muted" style="font-size:11.5px">${esc(sent)}</span>`;
        box.querySelector("#aiUse").onclick = () => { sel.value = r.sector; sel.dispatchEvent(new Event("change", { bubbles: true })); out.innerHTML = ` <span class="muted">✔ Μπήκε «${esc(r.sector)}» – πατήστε Αποθήκευση.</span>`; };
      }
    } catch (e) { out.innerHTML = ` <span style="color:var(--red)">⚠️ ${esc(e.message)}</span>`; }
    btn.disabled = false;
  };
}
// μαζική πρόταση για εταιρείες χωρίς κλάδο (Ρυθμίσεις)
let aiBulk = null;
function aiBulkHTML() {
  const missing = [...Core.derive().comp.values()].filter(c => !String(c.v["Κλάδος"] || "").trim());
  if (!aiBulk) return `<p style="margin:0 0 8px;font-size:13.5px"><b>${missing.length}</b> εταιρείες δεν έχουν κλάδο.</p>
    <p class="muted" style="margin:0 0 8px;font-size:12.5px">Στέλνονται στο Groq μόνο: όνομα εταιρείας, χώρα και domain του εταιρικού email (π.χ. goodwe.com). Όχι ονόματα επαφών, τηλέφωνα, προσωπικά email ή σημειώσεις. Τίποτα δεν αποθηκεύεται χωρίς τη δική σας έγκριση.</p>
    ${missing.length ? `<button class="btn pri sm" id="aiRun">✨ Πρόταση για ${missing.length} εταιρείες</button>` : ""}`;
  const S = list("Κλάδος");
  return `<div class="prog"><i style="width:${aiBulk.total ? 100 * aiBulk.done / aiBulk.total : 100}%"></i></div>
    <p style="margin:0 0 8px;font-size:13px">${aiBulk.running ? `Ρωτάω… ${aiBulk.done} / ${aiBulk.total}` : `Έτοιμο: ${aiBulk.rows.filter(r => r.sector).length} προτάσεις από ${aiBulk.total}.`}${aiBulk.err ? ` <span style="color:var(--red)">⚠️ ${esc(aiBulk.err)}</span>` : ""}</p>
    ${aiBulk.rows.length ? `<div class="scroll" style="max-height:50vh"><table class="imp-tbl"><thead><tr><th><input type="checkbox" id="aiAll" checked style="width:16px;height:16px;min-height:0"></th><th>Εταιρεία</th><th>Domain</th><th>Πρόταση</th><th>Βεβαιότητα</th><th>Αιτιολόγηση</th></tr></thead><tbody>
      ${aiBulk.rows.map((r, i) => `<tr class="${r.sector && r.confidence < 0.6 ? "st-warn" : ""}"><td><input type="checkbox" data-ai="${i}"${r.ok ? " checked" : ""} style="width:16px;height:16px;min-height:0"></td><td><b>${esc(r.name)}</b></td><td class="muted">${esc(r.domain)}</td>
        <td><select data-ais="${i}">${opt(S, r.sector, "—")}</select></td><td class="num">${r.sector ? Math.round(r.confidence * 100) + "%" : "–"}</td><td class="muted">${esc(r.reason)}</td></tr>`).join("")}</tbody></table></div>
      ${aiBulk.running ? "" : `<div style="display:flex;gap:8px;margin-top:8px"><button class="btn pri sm" id="aiSave">Αποθήκευση επιλεγμένων</button><button class="btn sm" id="aiClose">Ακύρωση</button></div>`}` : ""}`;
}
function drawAiBulk() { const b = $("#aiCard"); if (b) b.innerHTML = aiBulkHTML(); }
async function runAiBulk() {
  const missing = [...Core.derive().comp.values()].filter(c => !String(c.v["Κλάδος"] || "").trim());
  aiBulk = { total: missing.length, done: 0, rows: [], running: true, err: "" }; drawAiBulk();
  for (let i = 0; i < missing.length; i += 20) {
    const batch = missing.slice(i, i + 20).map(aiPayload);
    try {
      const res = await aiSuggest(batch), by = new Map(res.map(r => [r.code, r]));
      for (const p of batch) { const r = by.get(p.code) || {}; aiBulk.rows.push({ code: p.code, name: p.name, domain: p.domain, sector: r.sector || "", confidence: r.confidence || 0, reason: r.reason || "", ok: !!r.sector && (r.confidence || 0) >= 0.6 }); }
    } catch (e) { aiBulk.err = e.message; break; }
    aiBulk.done = Math.min(missing.length, i + 20); drawAiBulk();
  }
  aiBulk.running = false; drawAiBulk();
}
document.addEventListener("click", async e => {
  if (!e.target.closest("#aiCard")) return;
  const id = e.target.id;
  if (id === "aiRun") runAiBulk();
  else if (id === "aiClose") { aiBulk = null; drawAiBulk(); }
  else if (id === "aiAll") { document.querySelectorAll("#aiCard [data-ai]").forEach(c => { c.checked = e.target.checked; aiBulk.rows[+c.dataset.ai].ok = c.checked; }); }
  else if (e.target.dataset.ai !== undefined) aiBulk.rows[+e.target.dataset.ai].ok = e.target.checked;
  else if (id === "aiSave") {
    const ch = aiBulk.rows.filter(r => r.ok && r.sector).map(r => [r.code, "Κλάδος", r.sector]);
    if (!ch.length) return toast("Δεν έχει επιλεγεί καμία πρόταση.", true);
    e.target.disabled = true;
    try { const n = await Core.setFieldMany("E", ch); aiBulk = null; after({ msg: `Μπήκε κλάδος σε ${n} εταιρείες.` }); } catch (er) { toast(er.message, true); e.target.disabled = false; }
  }
});
document.addEventListener("change", e => { const s = e.target.closest("#aiCard [data-ais]"); if (!s) return; const r = aiBulk.rows[+s.dataset.ais]; r.sector = s.value; r.ok = !!s.value; const cb = document.querySelector(`#aiCard [data-ai="${s.dataset.ais}"]`); if (cb) cb.checked = r.ok; });


// ---------- εισαγωγή από Excel / CSV ----------
const IMP_FIELDS = [
  ["company", "Εταιρεία *", ["εταιρεια", "επωνυμια", "company", "organisation", "organization", "εκθετης", "exhibitor", "brand"]],
  ["sector", "Κλάδος", ["κλαδος", "sector", "industry", "δραστηριοτητα", "activity"]],
  ["country", "Χώρα", ["χωρα", "country"]],
  ["cname", "Επαφή (ονοματεπώνυμο)", ["ονοματεπωνυμο", "contact person", "contact", "επαφη", "υπευθυνος", "full name", "name"]],
  ["crole", "Θέση", ["θεση", "position", "job title", "title", "role"]],
  ["cphone", "Τηλέφωνο", ["τηλεφωνο", "phone", "tel", "mobile", "κινητο"]],
  ["cemail", "Email", ["email", "e-mail", "mail"]],
  ["sqm", "Τ.μ.", ["τ.μ", "τμ", "sqm", "m2", "τετραγωνικα"]],
  ["notes", "Σημειώσεις lead", ["σημειωσεις", "notes", "σχολια", "comments", "remarks"]],
  ["lcomments", "Αρχικά σχόλια List", ["αρχικα σχολια"]]
];
let imp = null;
function openImport() {
  if (!window.XLSX) return toast("Η εισαγωγή χρειάζεται σύνδεση στο internet (φόρτωση βιβλιοθήκης Excel).", true);
  imp = { step: 1 }; cur = { kind: "import", fd: {}, pre: {} };
  $("#mbox").classList.add("wide"); $("#modal").classList.add("on"); drawImport();
}
function impHead(title) {
  const st = ["Αρχείο", "Αντιστοίχιση", "Έλεγχος", "Εισαγωγή"];
  return `<div class="mh"><h2>${esc(title)}</h2><button class="x-close" id="mClose" aria-label="Κλείσιμο">×</button></div>
  <div class="mb"><div class="imp-steps">${st.map((x, i) => `<span class="${imp.step === i + 1 ? "on" : ""}">${i + 1}. ${x}</span>`).join("")}</div>`;
}
function drawImport() {
  const mb = $("#mbox");
  if (imp.step === 1) {
    mb.innerHTML = impHead("Εισαγωγή από Excel / CSV") + `<p style="margin-top:0">Διαλέξτε ένα αρχείο <b>.xlsx</b> ή <b>.csv</b> με μία εταιρεία ανά γραμμή και τίτλους στηλών στην πρώτη γραμμή (π.χ. Εταιρεία, Κλάδος, Χώρα, Ονοματεπώνυμο, Τηλέφωνο, Email).</p>
      <div class="drop" id="impDrop"><p style="margin:0 0 12px">Σύρετε εδώ το αρχείο</p><button class="btn pri" id="impPick">Επιλογή αρχείου</button><input type="file" id="impFile" accept=".xlsx,.xls,.csv" hidden></div>
      <p class="muted" style="font-size:13px">Πριν γραφτεί οτιδήποτε θα δείτε προεπισκόπηση με τις εταιρείες που υπάρχουν ήδη ή μοιάζουν με υπάρχουσες.</p></div>
      <div class="mf"><span class="msg" id="fmsg"></span><button class="btn" id="mCancel">Άκυρο</button></div>`;
    const d = $("#impDrop"), fi = $("#impFile");
    $("#impPick").onclick = () => fi.click(); fi.onchange = () => readImpFile(fi.files[0]);
    d.ondragover = e => { e.preventDefault(); d.classList.add("on"); }; d.ondragleave = () => d.classList.remove("on");
    d.ondrop = e => { e.preventDefault(); d.classList.remove("on"); readImpFile(e.dataTransfer.files[0]); };
  } else if (imp.step === 2) {
    const S = Core.S.lists, years = yearsAll();
    mb.innerHTML = impHead(`Αντιστοίχιση στηλών – ${imp.name}`) + `
      ${imp.sheets.length > 1 ? `<label style="display:flex;gap:8px;align-items:center;margin-bottom:10px;font-size:13px">Φύλλο<select id="impSheet">${opt(imp.sheets, imp.sheet)}</select></label>` : ""}
      <p class="muted" style="margin-top:0;font-size:13px">${imp.rows.length} γραμμές δεδομένων. Για κάθε πεδίο του CRM διαλέξτε από ποια στήλη του αρχείου έρχεται (όσες αναγνωρίστηκαν έχουν ήδη συμπληρωθεί).</p>
      <fieldset><legend>Στήλες αρχείου</legend><div class="fg">${IMP_FIELDS.map(([k, l]) => `<label>${esc(l)}<select data-map="${k}"><option value="">— (δεν υπάρχει)</option>${imp.headers.map((h, i) => `<option value="${i}"${imp.map[k] === i ? " selected" : ""}>${esc(h || "Στήλη " + (i + 1))}${imp.rows[0] && imp.rows[0][i] !== undefined && String(imp.rows[0][i]).trim() ? " – π.χ. " + esc(String(imp.rows[0][i]).slice(0, 30)) : ""}</option>`).join("")}</select></label>`).join("")}</div></fieldset>
      <fieldset><legend>Ίδιες τιμές για όλα τα νέα leads</legend><div class="fg">
        <label>Χρονιά *<select id="impYear">${opt(years, imp.def.year)}</select></label>
        <label>Προέλευση<select id="impSource">${opt(list("Προέλευση"), imp.def.source, "—")}</select></label>
        <label>Πορεία ενδιαφέροντος<select id="impStage">${opt(list("Πορεία ενδιαφέροντος"), imp.def.stage, "—")}</select></label>
        <label>Hall<select id="impHall">${opt(list("Hall"), imp.def.hall, "—")}</select></label>
        ${fieldHTML(F("handler", "Χειριστής (ένας ή περισσότεροι)", "multi", { list: "Χειριστής" }), imp.def.handler)}
        <label class="full" style="flex-direction:row;align-items:center;gap:8px;color:var(--ink)"><input type="checkbox" id="impLog" style="width:18px;height:18px;min-height:0"${imp.def.log ? " checked" : ""}>Καταγραφή ενέργειας «Εισαγωγή από ${esc(imp.name)}» σε κάθε νέο lead (αλλιώς θα εμφανίζονται ως «Καμία επαφή»)</label>
      </div></fieldset></div>
      <div class="mf"><span class="msg" id="fmsg"></span><button class="btn" id="impBack">Πίσω</button><button class="btn pri" id="impNext">Έλεγχος γραμμών →</button></div>`;
    const mm = mb.querySelector(".mchk"); if (mm) mm.onchange = () => { mb.querySelector('input[type=hidden][name="handler"]').value = [...mm.querySelectorAll("input:checked")].map(x => x.value).join(", "); };
    if ($("#impSheet")) $("#impSheet").onchange = e => { loadImpSheet(e.target.value); drawImport(); };
    $("#impBack").onclick = () => { imp.step = 1; drawImport(); };
    $("#impNext").onclick = () => {
      mb.querySelectorAll("[data-map]").forEach(s => imp.map[s.dataset.map] = s.value === "" ? undefined : +s.value);
      imp.def = { year: +$("#impYear").value, source: $("#impSource").value, stage: $("#impStage").value, hall: $("#impHall").value,
        handler: mb.querySelector('input[type=hidden][name="handler"]').value, log: $("#impLog").checked };
      if (imp.map.company === undefined) { $("#fmsg").textContent = "⚠️ Διαλέξτε ποια στήλη έχει την «Εταιρεία»."; $("#fmsg").className = "msg err"; return; }
      buildPlan(); imp.step = 3; drawImport();
    };
  } else if (imp.step === 3) {
    const P = imp.plan, cnt = a => P.filter(p => p.act === a).length;
    const lbl = { newco: "Νέα εταιρεία + lead", lead: "Lead σε υπάρχουσα", contact: "Μόνο επαφή", skip: "Παράλειψη" };
    mb.innerHTML = impHead(`Έλεγχος – ${imp.rows.length} γραμμές`) + `
      <div class="kpis"><div class="kpi g"><b id="kNew">${cnt("newco")}</b><span>νέες εταιρείες</span></div><div class="kpi"><b id="kLead">${cnt("lead")}</b><span>leads σε υπάρχουσες</span></div>
      <div class="kpi"><b id="kCon">${cnt("contact")}</b><span>μόνο επαφή</span></div><div class="kpi a"><b>${P.filter(p => p.warn).length}</b><span>μοιάζουν με υπάρχουσα – ελέγξτε</span></div><div class="kpi"><b id="kSkip">${cnt("skip")}</b><span>παραλείπονται</span></div></div>
      <p class="muted" style="margin-top:0;font-size:13px">Οι κίτρινες γραμμές μοιάζουν με εταιρεία που υπάρχει ήδη: διαλέξτε αν είναι νέα ή η ίδια. Μπορείτε να αλλάξετε την ενέργεια σε κάθε γραμμή.</p>
      <div class="scroll" style="max-height:52vh"><table class="imp-tbl"><thead><tr><th>#</th><th>Εταιρεία (αρχείο)</th><th>Τι θα γίνει</th><th>Επαφή</th><th>Email</th><th>Σημείωση</th></tr></thead><tbody>
      ${P.map((p, i) => `<tr class="${p.act === "skip" ? "st-skip" : p.warn ? "st-warn" : ""}"><td class="num">${p.row}</td><td><b>${esc(p.name)}</b></td><td>${p.fixed ? esc(lbl[p.act]) + (p.code ? ` <span class="muted">(κωδ. ${p.code})</span>` : "") :
        `<select data-pi="${i}"><option value="new"${p.act === "newco" ? " selected" : ""}>Νέα εταιρεία</option>${p.sim.map(x => `<option value="${x.c.code}"${p.code === x.c.code ? " selected" : ""}>Ίδια με: ${esc(x.c.name)} (κωδ. ${x.c.code})</option>`).join("")}<option value="skip"${p.act === "skip" ? " selected" : ""}>Παράλειψη</option></select>${p.act === "contact" ? ` <span class="muted">έχει ήδη lead – μόνο επαφή</span>` : p.act === "lead" ? ` <span class="muted">+ lead ${imp.def.year}</span>` : ""}`}</td>
        <td>${esc(p.f.cname)}</td><td>${esc(p.f.cemail)}</td><td class="muted">${esc(p.note)}</td></tr>`).join("")}
      </tbody></table></div></div>
      <div class="mf"><span class="msg" id="fmsg"></span><button class="btn" id="impBack">Πίσω</button><button class="btn pri" id="impGo">Εισαγωγή ${P.filter(p => p.act !== "skip").length} γραμμών</button></div>`;
    mb.querySelector("tbody").onchange = e => {
      const s = e.target.closest("[data-pi]"); if (!s) return; const p = P[+s.dataset.pi];
      if (s.value === "new") { p.act = "newco"; p.code = 0; } else if (s.value === "skip") p.act = "skip"; else { p.code = +s.value; p.act = hasLead(p.code, imp.def.year) ? "contact" : "lead"; }
      drawImport();
    };
    $("#impBack").onclick = () => { imp.step = 2; drawImport(); };
    $("#impGo").onclick = runImport;
  } else {
    const r = imp.res, done = r.done, tot = imp.plan.filter(p => p.act !== "skip").length;
    mb.innerHTML = impHead(imp.running ? "Εισαγωγή…" : "Η εισαγωγή ολοκληρώθηκε") + `
      <div class="prog"><i style="width:${tot ? 100 * done / tot : 100}%"></i></div><p style="margin:0 0 10px">${done} από ${tot} γραμμές</p>
      <div class="kpis"><div class="kpi g"><b>${r.co}</b><span>νέες εταιρείες</span></div><div class="kpi g"><b>${r.leads}</b><span>νέα leads</span></div><div class="kpi"><b>${r.contacts}</b><span>επαφές</span></div><div class="kpi"><b>${r.skipped}</b><span>παραλείφθηκαν</span></div><div class="kpi r"><b>${r.errors.length}</b><span>σφάλματα</span></div></div>
      ${r.errors.length ? `<div class="scroll" style="max-height:30vh"><table class="imp-tbl"><thead><tr><th>Γραμμή</th><th>Εταιρεία</th><th>Σφάλμα</th></tr></thead><tbody>${r.errors.map(x => `<tr><td class="num">${x.row}</td><td>${esc(x.name)}</td><td>${esc(x.msg)}</td></tr>`).join("")}</tbody></table></div>` : ""}</div>
      <div class="mf"><span class="msg"></span>${imp.running ? "" : `<button class="btn pri" id="mCancel">Κλείσιμο</button>`}</div>`;
  }
  const c1 = $("#mClose"), c2 = $("#mCancel");
  if (c1) c1.onclick = () => { if (!imp.running) closeForm(); };
  if (c2) c2.onclick = () => { if (!imp.running) closeForm(); };
}
async function readImpFile(f) {
  if (!f) return;
  try {
    const buf = new Uint8Array(await f.arrayBuffer());
    let wb;
    if (/\.csv$/i.test(f.name)) {
      let txt = new TextDecoder("utf-8").decode(buf);
      if (txt.includes("\uFFFD")) txt = new TextDecoder("windows-1253").decode(buf);   // παλιά ελληνικά CSV του Excel
      wb = XLSX.read(txt, { type: "string", raw: true });
    } else wb = XLSX.read(buf, { type: "array", cellDates: true });
    imp.wb = wb; imp.name = f.name; imp.sheets = wb.SheetNames;
    loadImpSheet(wb.SheetNames[0]);
    imp.def = { year: ui.year, source: "", stage: list("Πορεία ενδιαφέροντος")[0] || "", hall: "", handler: ui.me || "", log: false };
    imp.step = 2; drawImport();
  } catch (e) { console.error(e); const m = $("#fmsg"); if (m) { m.textContent = "⚠️ Δεν διαβάστηκε το αρχείο: " + (e.message || e); m.className = "msg err"; } }
}
function loadImpSheet(name) {
  imp.sheet = name;
  const aoa = XLSX.utils.sheet_to_json(imp.wb.Sheets[name], { header: 1, defval: "", blankrows: false, raw: false });
  let h = 0; while (h < aoa.length - 1 && aoa[h].filter(x => String(x).trim()).length < 2) h++;   // πρώτη γραμμή με ≥2 τίτλους
  imp.headers = (aoa[h] || []).map(x => String(x).trim()); imp.rows = aoa.slice(h + 1).filter(r => r.some(x => String(x).trim())); imp.first = h + 2;
  imp.map = {}; const used = new Set();
  for (const [k, , keys] of IMP_FIELDS) {
    const i = imp.headers.findIndex((hd, i) => !used.has(i) && keys.some(w => { const a = fold(hd), b = fold(w); return a === b || (b.length > 3 && a.includes(b)); }));
    if (i >= 0) { imp.map[k] = i; used.add(i); }
  }
}
const hasLead = (code, year) => Core.derive().leads.some(l => l.code === code && l.year === year);
function buildPlan() {
  const seen = new Map(), get = (r, k) => imp.map[k] === undefined ? "" : String(r[imp.map[k]] ?? "").trim();
  imp.plan_ = [];
  imp.plan = imp.rows.map((r, i) => imp.plan_[i] = (() => {
    const f = {}; for (const [k] of IMP_FIELDS) f[k] = get(r, k);
    if (f.country) { const c = countryOf(f.country); if (c) f.country = c.en; }
    const name = f.company.replace(/\s+/g, " "), row = imp.first + i, p = { row, name, f, sim: [], act: "skip", code: 0, note: "", fixed: true, warn: false };
    if (!name) { p.note = "κενή εταιρεία"; return p; }
    const key = companyKey(name) || Core.norm(name);
    if (seen.has(key)) { const first = imp.plan_[seen.get(key)]; p.act = "contact"; p.note = `ίδια εταιρεία με τη γραμμή ${first.row}`; p.same = first; if (!f.cname && !f.cphone && !f.cemail) { p.act = "skip"; p.note += " – χωρίς επαφή"; } return p; }
    seen.set(key, i);
    const hit = Core.findCompany(name);
    if (hit) { p.code = hit.id; if (hasLead(hit.id, imp.def.year)) { p.act = f.cname ? "contact" : "skip"; p.note = `έχει ήδη lead ${imp.def.year}` + (f.cname ? " – θα μπει μόνο η επαφή" : ""); } else { p.act = "lead"; p.note = "υπάρχει ήδη η εταιρεία"; } return p; }
    p.sim = similarCompanies(name); p.fixed = false;
    if (p.sim.length && p.sim[0].sc >= 0.999) { p.code = p.sim[0].c.code; p.act = hasLead(p.code, imp.def.year) ? "contact" : "lead"; p.note = "ίδιο όνομα με άλλη γραφή"; }
    else { p.act = "newco"; if (p.sim.length) { p.warn = true; p.note = "μοιάζει με υπάρχουσα"; } }
    return p;
  })());
}
async function runImport() {
  const D = imp.def, todo = imp.plan.filter(p => p.act !== "skip");
  imp.res = { done: 0, co: 0, leads: 0, contacts: 0, skipped: imp.plan.length - todo.length, errors: [] }; imp.running = true; imp.step = 4; drawImport();
  for (const p of todo) {
    const f = p.f, target = p.code ? String(p.code) : p.name;
    try {
      if (p.act === "contact") {
        if (f.cname || f.cphone || f.cemail) {
          const ref = p.same ? (p.same.code ? String(p.same.code) : p.same.name) : target;
          if (p.same && p.same.act === "skip") { imp.res.skipped++; imp.res.done++; continue; }
          try { await Core.newContact({ company: ref, name: f.cname || "Γενικά στοιχεία", role: f.crole, phone: f.cphone, email: f.cemail, primary: "Όχι" }); imp.res.contacts++; }
          catch (e) { if (/υπάρχει ήδη/.test(e.message)) imp.res.skipped++; else throw e; }
        } else imp.res.skipped++;
      } else {
        const r = await Core.newLead({ ...f, company: target, year: D.year, source: D.source, stage: D.stage, hall: D.hall, handler: D.handler,
          atype: D.log ? "Σχόλιο" : "", adesc: D.log ? `Εισαγωγή από ${imp.name}` : "" });
        imp.res.leads++; if (/νέα εταιρεία/.test(r.msg)) imp.res.co++; if (/επαφή/.test(r.msg)) imp.res.contacts++;
      }
    } catch (e) { imp.res.errors.push({ row: p.row, name: p.name, msg: e.message || String(e) }); }
    imp.res.done++;
    if (imp.res.done % 5 === 0 || imp.res.done === todo.length) drawImport();
  }
  imp.running = false; drawImport(); refreshDatalist(); render();
  toast(`Εισαγωγή: ${imp.res.co} νέες εταιρείες, ${imp.res.leads} leads, ${imp.res.contacts} επαφές.`, imp.res.errors.length > 0);
}

// ---------- εγκατάσταση ως εφαρμογή ----------
let installEvt = null;
window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); installEvt = e; const b = $("#installBtn"); if (b) b.hidden = false; });
window.addEventListener("appinstalled", () => { installEvt = null; const b = $("#installBtn"); if (b) b.hidden = true; toast("Η εφαρμογή εγκαταστάθηκε."); });
if ("serviceWorker" in navigator && import.meta.env.PROD && location.protocol === "https:") navigator.serviceWorker.register(import.meta.env.BASE_URL + "sw.js").catch(() => {});

export { boot };

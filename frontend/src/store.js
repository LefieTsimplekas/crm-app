// ===== Store: τα δεδομένα στο Supabase, με την ίδια λογική που είχαν τα Office Scripts =====
const Core = (() => {
  const MAP = {
    E: { table: "companies", id: "code", cols: { "Κωδ.": "code", "Εταιρεία": "name", "Κλάδος": "sector", "Χώρα": "country", "FG/RET": "fgret", "Tellody": "tellody", "Σύνδεσμος αρχείων": "files_link", "Αναγνωριστικό List": "list_id" } },
    L: { table: "leads", id: "id", cols: { "Επιλογή εταιρείας": "company_code", "Χρονιά": "year", "Προέλευση": "source", "Χειριστής": "handler", "Πορεία ενδιαφέροντος": "stage", "Χορηγία": "sponsor", "Λόγος ακύρωσης": "cancel_reason", "Hall": "hall", "Αριθμός Stand": "stand", "Τ.μ.": "sqm", "Σημειώσεις": "notes", "Αρχικά σχόλια List": "list_comments" } },
    A: { table: "actions", id: "id", cols: { "Ημερομηνία": "action_date", "Επιλογή εταιρείας": "company_code", "Χρονιά lead": "lead_year", "Τύπος ενέργειας": "type", "Περιγραφή": "description", "Χειριστής": "handler" } },
    P: { table: "contacts", id: "id", cols: { "Επιλογή εταιρείας": "company_code", "Ονοματεπώνυμο": "name", "Θέση": "role", "Τηλέφωνο": "phone", "Email": "email", "Κύρια επαφή": "is_primary", "Σημειώσεις": "notes" } }
  };
  const NUMS = new Set(["year", "lead_year", "sqm", "company_code", "code"]);
  let sb = null, rows = { E: [], L: [], A: [], P: [] }, S = { lists: {} }, version = 0;

  // ---------- βοηθητικά ----------
  const norm = v => String(v === null || v === undefined ? "" : v).trim().toLowerCase().replace(/\s+/g, " ");
  const isBlank = v => norm(v) === "";
  function parseCode(v) { if (typeof v === "number") return v; const m = String(v ?? "").match(/^\s*(\d+)\s*(·|$)/); return m ? Number(m[1]) : 0; }
  function today() { const d = new Date(); return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000) + 25569; }
  const num = v => { if (v === "" || v === null || v === undefined) return 0; const n = Number(v); return isNaN(n) ? 0 : n; };
  const serialToISO = n => new Date(Date.UTC(1899, 11, 30) + Math.round(n) * 864e5).toISOString().slice(0, 10);
  const isoToSerial = s => { if (!s) return ""; const [y, m, d] = String(s).slice(0, 10).split("-").map(Number); return Math.floor(Date.UTC(y, m - 1, d) / 864e5) + 25569; };

  // γραμμή βάσης -> αντικείμενο με τα ελληνικά ονόματα στηλών (όπως στο Excel)
  function toV(k, r) {
    const v = {};
    for (const [g, c] of Object.entries(MAP[k].cols)) {
      let x = r[c];
      if (c === "action_date") x = isoToSerial(x);
      else if (c === "is_primary") x = x ? "Ναι" : "Όχι";
      else if (x === null || x === undefined) x = "";
      else if (c === "sqm") x = Number(x);
      v[g] = x;
    }
    return v;
  }
  function toDb(k, vals, keepBlank) {
    const o = {};
    for (const [g, x0] of Object.entries(vals)) {
      const c = MAP[k].cols[g]; if (!c) continue;
      let x = typeof x0 === "string" ? x0.trim() : x0;
      if (x === "" || x === null || x === undefined) { if (keepBlank) o[c] = c === "is_primary" ? false : null; continue; }
      if (c === "action_date") x = typeof x === "number" ? serialToISO(x) : x;
      else if (c === "is_primary") x = x === true || x === "Ναι";
      else if (NUMS.has(c)) { const n = Number(x); if (isNaN(n)) throw new Error(`Το «${g}» θέλει αριθμό.`); x = n; }
      else x = String(x);
      o[c] = x;
    }
    return o;
  }
  function dbErr(error) {
    const m = String(error && (error.message || error) || "");
    if (error && error.code === "23505") return new Error(m.includes("companies_name") ? "Υπάρχει ήδη εταιρεία με αυτό το όνομα." : m.includes("leads") ? "Υπάρχει ήδη lead για αυτή την εταιρεία και χρονιά." : "Η εγγραφή υπάρχει ήδη.");
    if (/fetch|network|Failed/i.test(m)) return new Error("Δεν υπάρχει σύνδεση με τη βάση. Ελέγξτε το internet και ξαναδοκιμάστε.");
    if (/JWT|expired|not authorized|permission|row-level/i.test(m)) return new Error("Η σύνδεσή σας έληξε ή δεν έχετε δικαίωμα. Αποσυνδεθείτε και ξανασυνδεθείτε.");
    return new Error("Σφάλμα βάσης: " + m);
  }
  const ok = ({ data, error }) => { if (error) throw dbErr(error); return data; };

  // ---------- φόρτωση ----------
  async function fetchAll(table, order) {
    const out = [];
    for (let from = 0; ; from += 1000) {
      const data = ok(await sb.from(table).select("*").order(order).range(from, from + 999));
      out.push(...data); if (data.length < 1000) break;
    }
    return out;
  }
  async function load() {
    const [E, L, A, P, Ls] = await Promise.all([fetchAll("companies", "code"), fetchAll("leads", "id"), fetchAll("actions", "id"), fetchAll("contacts", "id"), fetchAll("lists", "position")]);
    const it = (k, r, id) => ({ id, v: toV(k, r), created: r.created_at || "" });
    rows = { E: E.map(r => it("E", r, r.code)), L: L.map(r => it("L", r, r.id)), A: A.map(r => it("A", r, r.id)), P: P.map(r => it("P", r, r.id)) };
    const lists = {};
    for (const r of Ls) { (lists[r.list_name] = lists[r.list_name] || Array(25).fill(""))[r.position] = r.value; }
    S = { lists };
    version++;
  }

  // ---------- τοπική ενημέρωση: μόνο η εγγραφή που άλλαξε ----------
  const KEY = { companies: "E", leads: "L", actions: "A", contacts: "P" };
  function putRow(table, r) {
    if (!r) return;
    if (table === "lists") { (S.lists[r.list_name] = S.lists[r.list_name] || Array(25).fill(""))[r.position] = r.value; return; }
    const k = KEY[table]; if (!k) return;
    const id = r[MAP[k].id], item = { id, v: toV(k, r), created: r.created_at || "" }, arr = rows[k];
    const i = arr.findIndex(x => x.id === id);
    if (i >= 0) arr[i] = item;
    else { let j = arr.length; while (j > 0 && arr[j - 1].id > id) j--; arr.splice(j, 0, item); }   // κρατά τη σειρά (= σειρά ιστορικού)
  }
  function dropRow(table, r) {
    if (!r) return;
    if (table === "lists") { const L = S.lists[r.list_name]; if (L && r.position !== undefined) L[r.position] = ""; return; }
    const k = KEY[table]; if (!k) return;
    const id = r[MAP[k].id]; if (id === undefined) return;
    rows[k] = rows[k].filter(x => x.id !== id);
    if (k === "E") for (const c of ["L", "A", "P"]) rows[c] = rows[c].filter(x => codeOf(x) !== id);   // ό,τι σβήνει η βάση με cascade
  }
  function applyChange(p) {   // ειδοποίηση από το Supabase για αλλαγή άλλου χρήστη
    if (!p || !p.table) return false;
    if (p.eventType === "DELETE") dropRow(p.table, p.old); else putRow(p.table, p.new);
    version++; return true;
  }

  // ---------- αναζητήσεις ----------
  const codeOf = r => parseCode(r.v["Επιλογή εταιρείας"]);
  function findCompany(input) {
    const code = parseCode(input);
    if (code) { const r = rows.E.find(r => r.id === code); if (r) return r; }
    const n = norm(input); if (n === "") return null;
    return rows.E.find(r => norm(r.v["Εταιρεία"]) === n) || null;
  }
  const findLead = (code, year) => rows.L.find(r => codeOf(r) === code && Number(r.v["Χρονιά"]) === year) || null;
  function latestYear(code) { let b = 0; for (const r of rows.L) if (codeOf(r) === code) b = Math.max(b, Number(r.v["Χρονιά"]) || 0); return b; }
  const listVal = (h, i) => (S.lists[h] || [])[i] || "";

  const ins = async (k, vals) => { const r = ok(await sb.from(MAP[k].table).insert(toDb(k, vals)).select().single()); putRow(MAP[k].table, r); version++; return r; };
  const upd = async (k, id, obj) => {
    if (!Object.keys(obj).length) return;
    const rs = ok(await sb.from(MAP[k].table).update(obj).eq(MAP[k].id, id).select());
    (rs || []).forEach(r => putRow(MAP[k].table, r)); version++;
  };

  // ---------- 1. Νέο lead ----------
  async function newLead(f) {
    const tx = k => String(f[k] ?? "").trim();
    const input = tx("company"); if (input === "") throw new Error("Συμπληρώστε την «Εταιρεία».");
    const year = num(f.year); if (!year) throw new Error("Συμπληρώστε τη «Χρονιά».");
    let co = findCompany(input);
    if (!co && parseCode(input)) throw new Error(`Δεν βρέθηκε εταιρεία με κωδικό ${parseCode(input)}.`);
    const name = co ? String(co.v["Εταιρεία"]) : input.replace(/\s+/g, " ");
    if (co && findLead(co.id, year)) throw new Error(`Υπάρχει ήδη lead για «${name}» το ${year}. Για νέα κίνηση χρησιμοποιήστε τη φόρμα «Νέα ενέργεια».`);
    const when = num(f.adate) || today();
    if (when > today()) throw new Error("Η ημερομηνία της ενέργειας είναι στο μέλλον – ελέγξτε τη χρονιά.");
    const info = { "Κλάδος": tx("sector"), "Χώρα": tx("country"), "FG/RET": tx("fgret"), "Tellody": tx("tellody") };
    const what = [];
    let code;
    if (!co) { const r = await ins("E", { ...info, "Εταιρεία": name }); code = r.code; what.push(`νέα εταιρεία (κωδ. ${code})`); }
    else {
      code = co.id; const fill = {};
      for (const h of Object.keys(info)) if (info[h] !== "" && isBlank(co.v[h])) fill[h] = info[h];
      await upd("E", code, toDb("E", fill));
    }
    const cname = tx("cname"), cphone = tx("cphone"), cemail = tx("cemail");
    if (cname || cphone || cemail) {
      const mine = rows.P.filter(r => codeOf(r) === code);
      if (!(cname && mine.some(r => norm(r.v["Ονοματεπώνυμο"]) === norm(cname)))) {
        await ins("P", { "Επιλογή εταιρείας": code, "Ονοματεπώνυμο": cname || "Γενικά στοιχεία", "Θέση": tx("crole"), "Τηλέφωνο": cphone, "Email": cemail, "Κύρια επαφή": mine.length ? "Όχι" : "Ναι" });
        what.push("επαφή");
      }
    }
    const handler = tx("handler");
    await ins("L", { "Επιλογή εταιρείας": code, "Χρονιά": year, "Προέλευση": tx("source"), "Χειριστής": handler, "Πορεία ενδιαφέροντος": tx("stage"), "Χορηγία": tx("sponsor"), "Hall": tx("hall"), "Τ.μ.": num(f.sqm) || "",
      "Σημειώσεις": tx("notes"), "Αρχικά σχόλια List": tx("lcomments") });
    what.push(`lead ${year}`);
    const atype = tx("atype"), adesc = tx("adesc");
    if (atype || adesc) {
      await ins("A", { "Ημερομηνία": when, "Επιλογή εταιρείας": code, "Χρονιά lead": year, "Τύπος ενέργειας": atype || "Σχόλιο", "Περιγραφή": adesc || "Νέο lead", "Χειριστής": handler });
      what.push("ενέργεια");
    }
    return { code, msg: `Αποθηκεύτηκε «${name}»: ${what.join(", ")}.` };
  }

  // ---------- 2. Νέα ενέργεια / ενημέρωση lead ----------
  async function newAction(f) {
    const tx = k => String(f[k] ?? "").trim();
    const input = tx("company"); if (input === "") throw new Error("Διαλέξτε «Εταιρεία».");
    const desc = tx("desc"); const type = tx("type") || (desc !== "" ? "Σχόλιο" : "");
    if (type !== "" && desc === "") throw new Error("Γράψτε «Περιγραφή» (ή αφήστε κενό και τον «Τύπο» για να αλλάξετε μόνο το lead).");
    const co = findCompany(input);
    if (!co) throw new Error(`Η εταιρεία «${input}» δεν υπάρχει. Διαλέξτε από τη λίστα ή χρησιμοποιήστε τη φόρμα «Νέο lead».`);
    const name = String(co.v["Εταιρεία"]), code = co.id;
    const year = num(f.year) || latestYear(code);
    if (!year) throw new Error(`Η «${name}» δεν έχει lead. Ανοίξτε πρώτα lead με τη φόρμα «Νέο lead».`);
    const lead = findLead(code, year); if (!lead) throw new Error(`Δεν υπάρχει lead για «${name}» το ${year}.`);
    const handler = tx("handler") || String(lead.v["Χειριστής"] ?? "");
    const when = num(f.date) || today();
    if (when > today()) throw new Error("Η ημερομηνία είναι στο μέλλον – ελέγξτε τη χρονιά.");
    const u = { "Πορεία ενδιαφέροντος": tx("stage"), "Χορηγία": tx("sponsor"), "Λόγος ακύρωσης": tx("reason"), "Χειριστής": tx("newhandler"), "Hall": tx("hall"), "Τ.μ.": num(f.sqm) || "" };
    const changed = Object.keys(u).filter(h => u[h] !== "");
    if (desc === "" && !changed.length) throw new Error("Δεν υπάρχει τίποτα να αποθηκευτεί: γράψτε ενέργεια ή διαλέξτε κάτι στο «Ενημέρωση lead».");
    if (desc !== "") await ins("A", { "Ημερομηνία": when, "Επιλογή εταιρείας": code, "Χρονιά lead": year, "Τύπος ενέργειας": type, "Περιγραφή": desc, "Χειριστής": handler });
    await upd("L", lead.id, toDb("L", u));
    const stage = u["Πορεία ενδιαφέροντος"] || lead.v["Πορεία ενδιαφέροντος"], reason = u["Λόγος ακύρωσης"] || lead.v["Λόγος ακύρωσης"];
    const note = norm(stage).indexOf("ακύρωση") === 0 && isBlank(reason) ? " Συμπληρώστε και «Λόγο ακύρωσης»." : "";
    return { code, warn: note !== "", msg: (desc !== "" ? `Αποθηκεύτηκε ενέργεια για «${name}» (${year})` + (changed.length ? ` · ενημερώθηκαν: ${changed.join(", ")}` : "")
      : `Ενημερώθηκε το lead «${name}» (${year}) χωρίς ενέργεια: ${changed.join(", ")}`) + "." + note };
  }

  // ---------- 3. Νέα επαφή ----------
  async function newContact(f) {
    const tx = k => String(f[k] ?? "").trim();
    const input = tx("company"), name = tx("name");
    if (input === "") throw new Error("Διαλέξτε «Εταιρεία».");
    if (name === "") throw new Error("Γράψτε «Ονοματεπώνυμο».");
    const co = findCompany(input); if (!co) throw new Error(`Η εταιρεία «${input}» δεν υπάρχει. Χρησιμοποιήστε τη φόρμα «Νέο lead».`);
    const cname = String(co.v["Εταιρεία"]), code = co.id;
    const mine = rows.P.filter(r => codeOf(r) === code);
    if (mine.some(r => norm(r.v["Ονοματεπώνυμο"]) === norm(name))) throw new Error(`Η επαφή «${name}» υπάρχει ήδη στην «${cname}».`);
    const choice = tx("primary"), primary = mine.length === 0 || choice.indexOf("Ναι") === 0;
    let replaced = 0;
    if (primary && choice.indexOf("αντί") >= 0) {
      replaced = mine.filter(r => r.v["Κύρια επαφή"] === "Ναι").length;
      if (replaced) { const rs = ok(await sb.from("contacts").update({ is_primary: false }).eq("company_code", code).eq("is_primary", true).select()); (rs || []).forEach(r => putRow("contacts", r)); }
    }
    await ins("P", { "Επιλογή εταιρείας": code, "Ονοματεπώνυμο": name, "Θέση": tx("role"), "Τηλέφωνο": tx("phone"), "Email": tx("email"), "Κύρια επαφή": primary ? "Ναι" : "Όχι", "Σημειώσεις": tx("notes") });
    return { code, msg: `Προστέθηκε η επαφή «${name}» στην «${cname}»` + (primary ? (replaced ? " ως η νέα κύρια επαφή (η παλιά έγινε «Όχι»)." : " ως κύρια επαφή.") : ".") };
  }

  // ---------- 4. Διαγραφή ----------
  const autoYear = r => num(r.v["Χρονιά lead"]) || latestYear(codeOf(r));
  function deletePreview(input, year) {
    const co = findCompany(input); if (!co) return null; year = num(year);
    return { leads: rows.L.filter(r => codeOf(r) === co.id && (!year || Number(r.v["Χρονιά"]) === year)).length,
      actions: rows.A.filter(r => codeOf(r) === co.id && (!year || autoYear(r) === year)).length,
      contacts: year ? 0 : rows.P.filter(r => codeOf(r) === co.id).length };
  }
  async function remove(f) {
    const input = String(f.company || "").trim();
    if (input === "") throw new Error("Διαλέξτε «Εταιρεία».");
    if (!f.confirm) throw new Error("Για ασφάλεια επιβεβαιώστε «ΝΑΙ – οριστική διαγραφή».");
    const co = findCompany(input); if (!co) throw new Error(`Η εταιρεία «${input}» δεν βρέθηκε.`);
    const name = String(co.v["Εταιρεία"]), code = co.id, year = num(f.year), p = deletePreview(input, year);
    if (year) {
      if (!p.leads) throw new Error(`Η «${name}» δεν έχει lead το ${year} – δεν σβήστηκε τίποτα.`);
      const ids = rows.A.filter(r => codeOf(r) === code && autoYear(r) === year).map(r => r.id);
      for (let i = 0; i < ids.length; i += 200) ok(await sb.from("actions").delete().in("id", ids.slice(i, i + 200)));
      ok(await sb.from("leads").delete().eq("company_code", code).eq("year", year));
      const idset = new Set(ids); rows.A = rows.A.filter(r => !idset.has(r.id)); rows.L = rows.L.filter(r => !(codeOf(r) === code && Number(r.v["Χρονιά"]) === year));
    } else { ok(await sb.from("companies").delete().eq("code", code)); dropRow("companies", { code }); }   // leads, ενέργειες, επαφές σβήνονται μαζί (cascade)
    version++;
    return { code: year ? code : 0, msg: year ? `Διαγράφηκε το lead ${year} της «${name}» και ${p.actions} ενέργειες του. Η εταιρεία και οι επαφές της έμειναν.`
      : `Διαγράφηκε η εταιρεία «${name}» μαζί με ${p.leads} leads, ${p.actions} ενέργειες και ${p.contacts} επαφές.` };
  }

  // ---------- 5. Νέος χειριστής / τιμή λίστας ----------
  async function addListValue(header, value) {
    const v = String(value || "").trim().replace(/\s+/g, " ");
    if (!v) throw new Error(header === "Χειριστής" ? "Γράψτε το ονοματεπώνυμο του νέου χειριστή." : "Γράψτε την τιμή.");
    const list = S.lists[header] || Array(25).fill("");
    if (list.map(norm).includes(norm(v))) throw new Error(`Το «${v}» υπάρχει ήδη στη λίστα.`);
    const free = list.findIndex(isBlank); if (free < 0) throw new Error(`Η λίστα «${header}» είναι γεμάτη (25).`);
    ok(await sb.from("lists").insert({ list_name: header, position: free, value: v }));
    putRow("lists", { list_name: header, position: free, value: v }); version++;
    return { msg: header === "Χειριστής" ? `Προστέθηκε ο χειριστής «${v}».` : `Προστέθηκε «${v}» στη λίστα «${header}».` };
  }
  async function removeListValue(header, value) {
    ok(await sb.from("lists").delete().eq("list_name", header).eq("value", value));
    const L = S.lists[header]; if (L) { const i = L.indexOf(value); if (i >= 0) L[i] = ""; } version++;
    return { msg: `Αφαιρέθηκε «${value}» από τη λίστα «${header}».` };
  }

  // ---------- επεξεργασία υπαρχουσών τιμών λίστας ----------
  // ποιες στήλες χρησιμοποιούν κάθε λίστα (για να ακολουθούν οι εγγραφές τη μετονομασία)
  const LISTUSE = {
    "Πορεία ενδιαφέροντος": [["L", "Πορεία ενδιαφέροντος"]], "Χορηγία": [["L", "Χορηγία"]], "Προέλευση": [["L", "Προέλευση"]],
    "Χειριστής": [["L", "Χειριστής"], ["A", "Χειριστής"]], "Κλάδος": [["E", "Κλάδος"]], "Hall": [["L", "Hall"]],
    "FG/RET": [["E", "FG/RET"]], "Tellody": [["E", "Tellody"]], "Τύπος ενέργειας": [["A", "Τύπος ενέργειας"]], "Λόγος ακύρωσης": [["L", "Λόγος ακύρωσης"]]
  };
  // θέσεις με ειδική σημασία: δεν σβήνονται και δεν μετακινούνται
  const FIXED = { "Πορεία ενδιαφέροντος": [5, 6], "Χορηγία": [0, 1, 2, 3] };
  const isFixed = (list, pos) => (FIXED[list] || []).includes(pos);
  const canMove = list => !FIXED[list];
  const handlerParts = v => String(v ?? "").split(",").map(x => x.trim()).filter(Boolean);
  function listUsage(list, value) {
    let n = 0;
    for (const [k, h] of LISTUSE[list] || []) for (const r of rows[k]) {
      const v = r.v[h];
      if (list === "Χειριστής" ? handlerParts(v).some(x => norm(x) === norm(value)) : norm(v) === norm(value)) n++;
    }
    return n;
  }
  async function renameListValue(list, pos, newValue) {
    const L = S.lists[list]; const old = L && L[pos];
    const nv = String(newValue || "").trim().replace(/\s+/g, " ");
    if (!old) throw new Error("Η τιμή δεν βρέθηκε – ανανεώστε τη σελίδα.");
    if (!nv) throw new Error("Η νέα τιμή δεν μπορεί να είναι κενή.");
    if (nv === old) return { msg: "Δεν άλλαξε τίποτα." };
    if (L.some((v, i) => i !== pos && norm(v) === norm(nv))) throw new Error(`Το «${nv}» υπάρχει ήδη στη λίστα «${list}».`);
    ok(await sb.from("lists").update({ value: nv }).eq("list_name", list).eq("position", pos));
    putRow("lists", { list_name: list, position: pos, value: nv });
    if (list === "Χειριστής") for (let i = 0; i < L.length; i++) {   // και οι κοινές τιμές της λίστας, π.χ. «Α, Β»
      if (i === pos || !handlerParts(L[i]).some(x => norm(x) === norm(old)) || handlerParts(L[i]).length < 2) continue;
      const v = handlerParts(L[i]).map(x => norm(x) === norm(old) ? nv : x).join(", ");
      ok(await sb.from("lists").update({ value: v }).eq("list_name", list).eq("position", i)); L[i] = v;
    }
    let changed = 0;
    for (const [k, h] of LISTUSE[list] || []) {
      const t = MAP[k].table, col = MAP[k].cols[h];
      if (list === "Χειριστής") {   // και τα «Α, Β» (κοινός χειρισμός)
        for (const r of rows[k].filter(r => handlerParts(r.v[h]).some(x => norm(x) === norm(old)))) {
          const v = handlerParts(r.v[h]).map(x => norm(x) === norm(old) ? nv : x).join(", ");
          const rs = ok(await sb.from(t).update({ [col]: v }).eq(MAP[k].id, r.id).select()); (rs || []).forEach(x => putRow(t, x)); changed++;
        }
      } else {
        const rs = ok(await sb.from(t).update({ [col]: nv }).eq(col, old).select()); (rs || []).forEach(x => putRow(t, x)); changed += (rs || []).length;
      }
    }
    version++;
    return { msg: `«${old}» → «${nv}»` + (changed ? ` · ενημερώθηκαν και ${changed} εγγραφές που το χρησιμοποιούσαν.` : ".") };
  }
  async function deleteListValue(list, pos) {
    const L = S.lists[list]; const old = L && L[pos];
    if (!old) throw new Error("Η τιμή δεν βρέθηκε – ανανεώστε τη σελίδα.");
    if (isFixed(list, pos)) throw new Error(`Η τιμή «${old}» έχει ειδική σημασία για τα στατιστικά και δεν σβήνεται· μπορείτε να τη μετονομάσετε.`);
    ok(await sb.from("lists").delete().eq("list_name", list).eq("position", pos));
    L[pos] = ""; version++;
    const n = listUsage(list, old);
    return { msg: `Αφαιρέθηκε «${old}» από τη λίστα «${list}».` + (n ? ` Οι ${n} εγγραφές που το έχουν το κρατούν όπως είναι.` : "") };
  }
  async function moveListValue(list, pos, dir) {
    if (!canMove(list)) throw new Error(`Στη λίστα «${list}» η σειρά έχει ειδική σημασία και δεν αλλάζει.`);
    const L = S.lists[list]; let j = pos + dir;
    while (j >= 0 && j < 25 && isBlank(L[j])) j += dir;
    if (j < 0 || j >= 25) return { msg: "" };
    const a = L[pos], b = L[j];
    ok(await sb.from("lists").update({ value: b }).eq("list_name", list).eq("position", pos));
    ok(await sb.from("lists").update({ value: a }).eq("list_name", list).eq("position", j));
    L[pos] = b; L[j] = a; version++;
    return { msg: "" };
  }

  // ---------- 7. Μετονομασία ----------
  async function rename(input, newName) {
    const nn = String(newName || "").trim().replace(/\s+/g, " ");
    if (String(input || "").trim() === "") throw new Error("Γράψτε τον κωδικό ή το τρέχον όνομα της εταιρείας.");
    if (nn === "") throw new Error("Γράψτε το νέο όνομα.");
    const co = findCompany(/^\s*\d+\s*$/.test(input) ? Number(input) : input); if (!co) throw new Error(`Δεν βρέθηκε εταιρεία «${input}».`);
    const dup = rows.E.find(r => r !== co && norm(r.v["Εταιρεία"]) === norm(nn));
    if (dup) throw new Error(`Υπάρχει ήδη άλλη εταιρεία με όνομα «${nn}» (κωδ. ${dup.id}).`);
    const old = co.v["Εταιρεία"];
    await upd("E", co.id, { name: nn });
    return { code: co.id, msg: `Η «${old}» μετονομάστηκε σε «${nn}» – άλλαξε παντού.` };
  }

  // ---------- επεξεργασία / σβήσιμο μίας εγγραφής ----------
  const row = (k, id) => (rows[k].find(r => r.id === id) || { v: {} }).v;
  async function editRow(k, id, vals) {
    const cur = row(k, id), ch = {};
    for (const h of Object.keys(vals)) {
      if (!MAP[k].cols[h] || ["Επιλογή εταιρείας", "Κωδ.", "Εταιρεία"].includes(h)) continue;
      if (String(vals[h] ?? "").trim() !== String(cur[h] ?? "").trim()) ch[h] = vals[h];
    }
    await upd(k, id, toDb(k, ch, true));
  }
  async function setFieldMany(k, changes) { for (const [id, h, v] of changes) await upd(k, id, toDb(k, { [h]: v })); return changes.length; }
  async function removeRow(k, id) { ok(await sb.from(MAP[k].table).delete().eq(MAP[k].id, id)); dropRow(MAP[k].table, { [MAP[k].id]: id }); version++; }

  // ---------- υπολογισμένα πεδία (ό,τι έκαναν οι τύποι του Excel) ----------
  let cache = null, cacheV = -1;
  function derive() {
    if (cacheV === version) return cache;
    const comp = new Map();
    for (const r of rows.E) comp.set(r.id, { i: r.id, code: r.id, name: String(r.v["Εταιρεία"]), v: r.v, contacts: [], leads: [], actions: [] });
    for (const r of rows.P) { const c = comp.get(codeOf(r)); if (c) c.contacts.push({ i: r.id, v: r.v }); }
    for (const c of comp.values()) {
      const prim = c.contacts.filter(p => p.v["Κύρια επαφή"] === "Ναι"), src = prim.length ? prim : c.contacts.slice(0, 1);
      const j = h => src.map(p => String(p.v[h] ?? "")).filter(Boolean).join(" / ");
      c.person = j("Ονοματεπώνυμο"); c.phone = j("Τηλέφωνο"); c.email = j("Email");
    }
    const leads = [];
    for (const r of rows.L) {
      const code = codeOf(r), co = comp.get(code);
      const l = { i: r.id, code, year: num(r.v["Χρονιά"]), v: r.v, co, name: co ? co.name : "?", acts: [], last: 0, lastDesc: "", created: r.created };
      leads.push(l); if (co) co.leads.push(l);
    }
    const leadBy = new Map(leads.map(l => [l.code + "|" + l.year, l]));
    const maxYear = new Map(); for (const l of leads) maxYear.set(l.code, Math.max(maxYear.get(l.code) || 0, l.year));
    const acts = [];
    for (const r of rows.A) {
      const c = codeOf(r), y = num(r.v["Χρονιά lead"]) || maxYear.get(c) || 0;
      const a = { i: r.id, code: c, year: y, date: num(r.v["Ημερομηνία"]), type: String(r.v["Τύπος ενέργειας"] ?? ""), desc: String(r.v["Περιγραφή"] ?? ""), handler: String(r.v["Χειριστής"] ?? ""), name: comp.has(c) ? comp.get(c).name : "?" };
      acts.push(a); if (comp.has(c)) comp.get(c).actions.push(a);
      const l = leadBy.get(c + "|" + y); if (l) { l.acts.push(a); if (a.date && a.date >= l.last) { l.last = a.date; l.lastDesc = a.desc; } }
    }
    const win = listVal("Πορεία ενδιαφέροντος", 5), lost = listVal("Πορεία ενδιαφέροντος", 6), spo = [listVal("Χορηγία", 0), listVal("Χορηγία", 1)], sponsor = listVal("Χορηγία", 2);
    for (const l of leads) {
      const st = String(l.v["Πορεία ενδιαφέροντος"] ?? ""), sp = String(l.v["Χορηγία"] ?? "");
      l.stage = st; l.sponsor = sp; l.handler = String(l.v["Χειριστής"] ?? "");
      l.open = (st === "" && sp === "") || (st !== "" && st !== win && st !== lost) || (sp !== "" && spo.includes(sp));
      const p = leadBy.get(l.code + "|" + (l.year - 1));
      l.prevExhibitor = p && (p.v["Πορεία ενδιαφέροντος"] === win || p.v["Χορηγία"] === sponsor) ? "Ναι" : "Όχι";
      l.won = st === win; l.lost = st === lost;
    }
    cache = { comp, leads, acts, leadBy }; cacheV = version; return cache;
  }

  return {
    init(client) { sb = client; }, load, applyChange,
    async getPrefs(uid) { const { data, error } = await sb.from("user_prefs").select("prefs").eq("user_id", uid).maybeSingle(); if (error) return { error }; return { prefs: data ? data.prefs : null }; },
    async savePrefs(uid, prefs) { const { error } = await sb.from("user_prefs").upsert({ user_id: uid, prefs, updated_at: new Date().toISOString() }); return !error; },
    async logUsage(bytes) { const { error } = await sb.rpc("log_usage", { p_bytes: Math.round(bytes) }); return !error; },
    async monthUsage(fromISO) { const { data, error } = await sb.from("usage_log").select("*").gte("day", fromISO); return error ? null : data; },
    async usage() { const { data, error } = await sb.rpc("db_usage"); if (error) return null; return typeof data === "string" ? JSON.parse(data) : data; }, derive, newLead, newAction, newContact, remove, deletePreview, addListValue, removeListValue, renameListValue, deleteListValue, moveListValue, listUsage, isFixed, canMove, rename, editRow, removeRow, row, setFieldMany,
    findCompany, parseCode, today, norm, latestYear, get S() { return S; }, get version() { return version; }, get rows() { return rows; }
  };
})();


export { Core };

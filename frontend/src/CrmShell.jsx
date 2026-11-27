import React, { useState } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";

const tabs = [
  ["track", "Παρακολούθηση"],
  ["companies", "Εταιρείες"],
  ["history", "Ενέργειες"],
  ["summary", "Σύνοψη"],
  ["report", "Αναφορά"],
  ["settings", "Ρυθμίσεις"],
  ["help", "Οδηγίες"],
];

function Login({ signIn }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    setError("");
    setPending(true);
    try {
      await signIn(fields.get("email").trim(), fields.get("password"));
    } catch (error) {
      setError(error.message);
    } finally {
      setPending(false);
    }
  }

  return <>
    <header className="top"><h1>Leads CRM</h1></header>
    <div className="welcome">
      <h2>Σύνδεση</h2>
      <p className="muted">Μπείτε με το email και τον κωδικό που σας έδωσε ο διαχειριστής.</p>
      <form id="login" className="card" style={{ padding: 18 }} onSubmit={submit}>
        <div className="fg">
          <label className="full">Email<input name="email" id="lgEmail" type="email" autoComplete="username" required /></label>
          <label className="full">Κωδικός<input name="password" id="lgPass" type="password" autoComplete="current-password" required /></label>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 14 }}>
          <button className="btn pri" id="lgBtn" disabled={pending}>Σύνδεση</button>
          <span role="status" className={error ? "msg err" : "msg"} id="lgMsg">
            {error ? "⚠️ " + error : pending ? "Σύνδεση…" : ""}
          </span>
        </div>
      </form>
    </div>
  </>;
}

function CrmShell(props) {
  if (props.unavailable) {
    return <div className="welcome">
      <h2>Δεν φορτώθηκε η εφαρμογή</h2>
      <p>Χρειάζεται σύνδεση στο internet. Ανανεώστε τη σελίδα.</p>
    </div>;
  }
  if (!props.loaded) return <Login signIn={props.signIn} />;

  return <>
    <header className="top">
      <h1>Leads CRM</h1>
      <span className="file" title={props.email}><i id="liveDot" className="live" data-on={props.live} />{props.email}</span>
      <span className="sp" />
      <button className="btn ghost" id="installBtn" hidden={!props.canInstall} onClick={props.install}>Εγκατάσταση εφαρμογής</button>
      <button className="btn ghost" id="exportBtn" onClick={props.exportExcel}>Εξαγωγή σε Excel</button>
      <button className="btn ghost" id="logoutBtn" onClick={props.signOut}>Αποσύνδεση</button>
    </header>
    <nav aria-label="Κύριο μενού">
      {tabs.map(([key, label]) => (
        <button key={key} data-view={key} aria-current={props.view === key} onClick={() => props.selectView(key)}>{label}</button>
      ))}
    </nav>
    <div className="acts">
      <button className="btn pri" data-form="lead" onClick={() => props.openForm("lead")}>+ Νέο lead</button>
      <button className="btn" data-form="action" onClick={() => props.openForm("action")}>+ Ενέργεια / σχόλιο</button>
      <button className="btn" data-form="contact" onClick={() => props.openForm("contact")}>+ Επαφή</button>
      <button className="btn" data-form="del" onClick={() => props.openForm("del")}>Διαγραφή</button>
      <button className="btn" id="offerBtn" onClick={props.openOffer}>Οικονομική προσφορά</button>
      <button className="btn" id="impBtn" onClick={props.openImport}>Εισαγωγή από Excel</button>
    </div>
    <main id="view" />
  </>;
}

const root = createRoot(document.getElementById("app"));

export function mountCrm(props) {
  // Commit the shell before the existing view code binds its DOM events.
  flushSync(() => root.render(<CrmShell {...props} />));
}

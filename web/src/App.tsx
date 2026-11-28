import { Center, Loader } from '@mantine/core';
import { useHash } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { LoginPage } from './auth/LoginPage';
import { useSession } from './auth/useSession';
import { AppLayout, type NavItem } from './components/AppLayout';
import { flushPrefs, loadPrefs } from './data/prefs';
import { store } from './data/store';
import { supabase } from './data/supabase';
import { useData } from './data/useData';
import { CompanyDrawer } from './components/CompanyDrawer';
import { CompaniesPage } from './pages/CompaniesPage';
import { HelpPage } from './pages/HelpPage';
import { HistoryPage } from './pages/HistoryPage';
import { ReportPage } from './pages/ReportPage';
import { SettingsPage } from './pages/SettingsPage';
import { SummaryPage } from './pages/SummaryPage';
import { TrackingPage } from './pages/TrackingPage';

const NAV: NavItem[] = [
  { id: 'tracking', label: 'Παρακολούθηση' },
  { id: 'companies', label: 'Εταιρείες' },
  { id: 'history', label: 'Ενέργειες' },
  { id: 'summary', label: 'Σύνοψη' },
  { id: 'report', label: 'Αναφορά' },
  { id: 'settings', label: 'Ρυθμίσεις' },
  { id: 'help', label: 'Οδηγίες' },
];

export function App() {
  const session = useSession();
  const { live, derived } = useData();
  const [selection, setSelection] = useState<{ code: number; uid: string } | null>(null);
  const [hash, setHash] = useHash();
  const page = NAV.find((n) => `#${n.id}` === hash) ?? NAV[0];
  const uid = session?.user.id;

  // σύνδεση: ρυθμίσεις, δεδομένα, ζωντανή ενημέρωση
  useEffect(() => {
    if (!uid) return;
    void loadPrefs(uid);
    void store.load();
    store.startLive();
    let hiddenAt = 0;
    const onVis = () => {
      if (document.hidden) {
        hiddenAt = Date.now();
        void flushPrefs();
      } else if (hiddenAt && Date.now() - hiddenAt > 5 * 60_000) void store.load();
    };
    const onOnline = () => void store.load();
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('online', onOnline);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('online', onOnline);
      void store.stop();
    };
  }, [uid]);

  if (session === undefined)
    return (
      <Center h="60vh">
        <Loader aria-label="Έλεγχος σύνδεσης" />
      </Center>
    );
  if (!session) return <LoginPage />;

  async function logout() {
    await flushPrefs();
    await supabase.auth.signOut();
    setSelection(null);
  }

  const selected = selection?.uid === session.user.id ? selection : null;
  const openCompany = (code: number) => setSelection({ code, uid: session.user.id });

  return (
    <AppLayout
      email={session.user.email ?? ''}
      live={live}
      items={NAV}
      current={page.id}
      onNavigate={(id) => setHash(`#${id}`)}
      onLogout={() => void logout()}
    >
      {page.id === 'tracking' ? (
        <TrackingPage onOpenCompany={openCompany} />
      ) : page.id === 'companies' ? (
        <CompaniesPage onOpen={openCompany} />
      ) : page.id === 'history' ? (
        <HistoryPage onOpenCompany={openCompany} />
      ) : page.id === 'summary' ? (
        <SummaryPage />
      ) : page.id === 'report' ? (
        <ReportPage email={session.user.email ?? ''} />
      ) : page.id === 'settings' ? (
        <SettingsPage />
      ) : (
        <HelpPage />
      )}
      <CompanyDrawer
        opened={selected !== null}
        company={selected ? derived.companies.get(selected.code) : undefined}
        onClose={() => setSelection(null)}
      />
    </AppLayout>
  );
}

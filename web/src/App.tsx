import { Center, Loader } from '@mantine/core';
import { useHash } from '@mantine/hooks';
import { useEffect } from 'react';
import { LoginPage } from './auth/LoginPage';
import { useSession } from './auth/useSession';
import { AppLayout, type NavItem } from './components/AppLayout';
import { flushPrefs, loadPrefs } from './data/prefs';
import { store } from './data/store';
import { supabase } from './data/supabase';
import { useData } from './data/useData';
import { ComingSoon } from './pages/ComingSoon';
import { TrackingPage } from './pages/TrackingPage';

const NAV: (NavItem & { phase?: number })[] = [
  { id: 'tracking', label: 'Παρακολούθηση' },
  { id: 'companies', label: 'Εταιρείες', phase: 2 },
  { id: 'history', label: 'Ενέργειες', phase: 2 },
  { id: 'summary', label: 'Σύνοψη', phase: 3 },
  { id: 'report', label: 'Αναφορά', phase: 3 },
  { id: 'settings', label: 'Ρυθμίσεις', phase: 4 },
  { id: 'help', label: 'Οδηγίες', phase: 4 },
];

export function App() {
  const session = useSession();
  const { live } = useData();
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
  }

  return (
    <AppLayout
      email={session.user.email ?? ''}
      live={live}
      items={NAV}
      current={page.id}
      onNavigate={(id) => setHash(`#${id}`)}
      onLogout={() => void logout()}
    >
      {page.id === 'tracking' ? <TrackingPage /> : <ComingSoon title={page.label} phase={page.phase ?? 2} />}
    </AppLayout>
  );
}

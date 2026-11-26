import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../data/supabase';

/** Η τρέχουσα σύνδεση (undefined = ακόμα ελέγχεται). */
export function useSession(): Session | null | undefined {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  useEffect(() => {
    let alive = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (alive) setSession(data.session);
    });
    const { data } = supabase.auth.onAuthStateChange((_ev, s) => setSession(s));
    return () => {
      alive = false;
      data.subscription.unsubscribe();
    };
  }, []);
  return session;
}

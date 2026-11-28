import { createClient } from '@supabase/supabase-js';

// Δημόσια στοιχεία του project (το «publishable» κλειδί είναι φτιαγμένο για δημόσιες σελίδες· τα δεδομένα τα προστατεύει το RLS).
const url = import.meta.env.VITE_SUPABASE_URL ?? 'https://qyhkdyewdqrbreebmacn.supabase.co';
const key = import.meta.env.VITE_SUPABASE_KEY ?? 'sb_publishable_OvMExg_PKnJfSh7CP8hIsQ_Mg0oowyG';

const rest = new URL('rest/v1/', url.replace(/\/?$/, '/'));
const trackedFetch: typeof fetch = async (input, init) => {
  const address = new URL(input instanceof Request ? input.url : input);
  const owner = trafficUser;
  const response = await fetch(input, init);
  if (
    owner &&
    trafficUser === owner &&
    address.origin === rest.origin &&
    address.pathname.startsWith(rest.pathname) &&
    !['rpc/log_usage', 'usage_log'].includes(address.pathname.slice(rest.pathname.length))
  ) {
    // Reading the decoded body gives an estimate when Content-Length is absent.
    const size = Number(response.headers.get('content-length'));
    if (size > 0) receivedBytes += size;
    else if (response.body) {
      void response
        .clone()
        .arrayBuffer()
        .then(
          (body) => {
            if (trafficUser === owner) receivedBytes += body.byteLength;
          },
          () => undefined,
        );
    }
  }
  return response;
};

let trafficUser: string | undefined;
let receivedBytes = 0;
let saving: Promise<void> | undefined;

export const supabase = createClient(url, key, { global: { fetch: trackedFetch } });

export function trackTrafficFor(uid?: string) {
  if (trafficUser !== uid) receivedBytes = 0;
  trafficUser = uid;
}

export async function flushTraffic() {
  if (saving) await saving;
  if (!trafficUser || !receivedBytes || saving) return;
  const bytes = Math.min(receivedBytes, 200_000_000);
  receivedBytes -= bytes;
  // The RPC increments a counter. Avoid retrying a request that may have committed.
  saving = Promise.resolve(supabase.rpc('log_usage', { p_bytes: bytes })).then(
    () => undefined,
    () => undefined,
  );
  try {
    await saving;
  } finally {
    saving = undefined;
  }
}

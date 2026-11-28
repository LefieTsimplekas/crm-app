import { useEffect, useState } from 'react';

interface InstallEvent extends Event {
  prompt(): Promise<unknown>;
}

export function useInstallPrompt() {
  const [available, setAvailable] = useState<InstallEvent>();
  useEffect(() => {
    const savePrompt = (event: Event) => {
      event.preventDefault();
      setAvailable(event as InstallEvent);
    };
    const clearPrompt = () => setAvailable(undefined);
    window.addEventListener('beforeinstallprompt', savePrompt);
    window.addEventListener('appinstalled', clearPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', savePrompt);
      window.removeEventListener('appinstalled', clearPrompt);
    };
  }, []);

  if (!available) return undefined;
  return () => {
    setAvailable(undefined);
    void available.prompt().catch(() => undefined);
  };
}

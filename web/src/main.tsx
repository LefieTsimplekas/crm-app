import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { cssResolver, theme } from './theme';

const root = document.getElementById('root');
if (!root) throw new Error('Λείπει το #root');
createRoot(root).render(
  <StrictMode>
    <MantineProvider theme={theme} cssVariablesResolver={cssResolver} defaultColorScheme="auto">
      <Notifications position="bottom-center" />
      <App />
    </MantineProvider>
  </StrictMode>,
);

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => undefined);
}

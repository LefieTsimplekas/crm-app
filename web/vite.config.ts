import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Η νέα έκδοση δημοσιεύεται στο /crm-app/next/ μέχρι να αντικαταστήσει την παλιά.
export default defineConfig({
  base: process.env.VITE_BASE ?? '/crm-app/next/',
  plugins: [react()],
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});

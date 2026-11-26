import { createTheme, type CSSVariablesResolver, type MantineColorsTuple } from '@mantine/core';

/** Design tokens: ένα σημείο για χρώματα, γραμματοσειρές, αποστάσεις, στρογγυλοποιήσεις. */
const brand: MantineColorsTuple = [
  '#e6f5f1',
  '#cde9e1',
  '#9fd3c4',
  '#6dbca5',
  '#45a88b',
  '#2c9b7b',
  '#1a8f6f',
  '#0b7a5e',
  '#005f49',
  '#00463c',
];

export const theme = createTheme({
  primaryColor: 'brand',
  primaryShade: { light: 9, dark: 5 },
  colors: { brand },
  fontFamily: 'Inter, system-ui, sans-serif',
  headings: { fontFamily: '"Inter Tight", Inter, sans-serif', fontWeight: '700' },
  defaultRadius: 'md',
  radius: { xs: '4px', sm: '6px', md: '8px', lg: '12px', xl: '16px' },
  spacing: { xs: '6px', sm: '10px', md: '14px', lg: '20px', xl: '28px' },
  fontSizes: { xs: '12px', sm: '13.5px', md: '15px', lg: '17px', xl: '20px' },
  focusRing: 'auto',
  cursorType: 'pointer',
  other: { headerBg: '#00463c', headerAccent: '#e6f5c8' },
});

/** Χρώματα σήματος (κατάσταση leads), σε φωτεινό και σκούρο θέμα. */
export const cssResolver: CSSVariablesResolver = () => ({
  variables: { '--crm-header-bg': '#00463c', '--crm-header-accent': '#e6f5c8' },
  light: {
    '--crm-red': '#c8371f',
    '--crm-red-bg': '#fde8e4',
    '--crm-amber': '#a86c00',
    '--crm-amber-bg': '#fff3d6',
    '--crm-green': '#1f8a5b',
    '--crm-closed': '#868e96',
  },
  dark: {
    '--crm-red': '#ff7b66',
    '--crm-red-bg': '#3a1d18',
    '--crm-amber': '#f2b544',
    '--crm-amber-bg': '#3a2c0e',
    '--crm-green': '#5fd49a',
    '--crm-closed': '#909296',
  },
});

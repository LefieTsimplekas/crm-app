import { Input, Paper, createTheme, type CSSVariablesResolver, type MantineColorsTuple } from '@mantine/core';
import classes from './theme.module.css';

/** Design tokens: ένα σημείο για χρώματα, γραμματοσειρές, αποστάσεις, στρογγυλοποιήσεις. */
const brand: MantineColorsTuple = [
  '#e6f5f1',
  '#cde9e1',
  '#9fd3c4',
  '#6dbca5',
  '#45a88b',
  '#2c9b7b',
  '#1a8f6f',
  '#0b6b5c',
  '#00594c',
  '#00463c',
];

const dark: MantineColorsTuple = [
  '#e8efec',
  '#cfe3dc',
  '#9fb2ad',
  '#70877f',
  '#26372f',
  '#13211e',
  '#111d1a',
  '#0d1715',
  '#091311',
  '#060d0b',
];

const palette = {
  light: {
    background: '#ffffff',
    surface: '#f4f7f5',
    ink: '#14211e',
    muted: '#5b6b67',
    border: '#dde5e2',
    card: '#ffffff',
  },
  dark: { background: dark[7], surface: dark[5], ink: dark[0], muted: dark[2], border: dark[4], card: dark[6] },
};

function surfaceVariables(colors: (typeof palette)['light'], hover: string, link: string) {
  return {
    '--mantine-color-body': colors.background,
    '--mantine-color-text': colors.ink,
    '--mantine-color-dimmed': colors.muted,
    '--mantine-color-placeholder': colors.muted,
    '--mantine-color-anchor': link,
    '--mantine-color-default': colors.card,
    '--mantine-color-default-color': colors.ink,
    '--mantine-color-default-border': colors.border,
    '--mantine-color-default-hover': colors.surface,
    '--mantine-color-brand-filled': brand[9],
    '--mantine-color-brand-filled-hover': hover,
    '--crm-surface': colors.surface,
  };
}

export const theme = createTheme({
  primaryColor: 'brand',
  primaryShade: { light: 9, dark: 5 },
  colors: { brand, dark },
  components: {
    Input: Input.extend({ classNames: { input: classes.input } }),
    Paper: Paper.extend({ classNames: { root: classes.paper } }),
  },
  fontFamily: 'Inter, system-ui, sans-serif',
  headings: { fontFamily: '"Inter Tight", Inter, sans-serif', fontWeight: '700' },
  defaultRadius: 'md',
  radius: { xs: '4px', sm: '6px', md: '8px', lg: '12px', xl: '16px' },
  spacing: { xs: '6px', sm: '10px', md: '14px', lg: '20px', xl: '28px' },
  fontSizes: { xs: '12px', sm: '13.5px', md: '15px', lg: '17px', xl: '20px' },
  focusRing: 'auto',
  cursorType: 'pointer',
  focusClassName: classes.focus,
});

/** Χρώματα σήματος (κατάσταση leads), σε φωτεινό και σκούρο θέμα. */
export const cssResolver: CSSVariablesResolver = () => ({
  variables: {
    '--crm-header-bg': brand[9],
    '--crm-header-accent': '#e6f5c8',
    '--crm-header-text-muted': dark[1],
    '--crm-live-off': dark[2],
    '--crm-live-on': '#7ee2a8',
    '--crm-coral': '#ff6f59',
  },
  light: {
    ...surfaceVariables(palette.light, brand[8], brand[8]),
    '--crm-focus': brand[7],
    '--crm-red': '#c8371f',
    '--crm-red-bg': '#fde8e4',
    '--crm-amber': '#a86c00',
    '--crm-amber-bg': '#fff3d6',
    '--crm-green': '#1f8a5b',
    '--crm-closed': '#868e96',
  },
  dark: {
    ...surfaceVariables(palette.dark, brand[7], '#6fbf9f'),
    '--crm-focus': '#6fbf9f',
    '--crm-red': '#ff7b66',
    '--crm-red-bg': '#3a1d18',
    '--crm-amber': '#f2b544',
    '--crm-amber-bg': '#3a2c0e',
    '--crm-green': '#5fd49a',
    '--crm-closed': dark[2],
  },
});

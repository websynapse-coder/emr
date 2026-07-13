/**
 * Moonaria design-token system.
 *
 * This file is the SINGLE SOURCE OF TRUTH for every visual value in the app:
 * colors, typography, spacing, radii, fonts. No component or stylesheet should
 * hardcode a hex value, font name, or spacing number — everything flows from here.
 *
 * Tailwind (tailwind.config.ts) extends from the token *names* exported here and
 * resolves them to CSS variables (`hsl(var(--color-brand-primary))`, etc.).
 * The actual values are injected at runtime by <ThemeStyles /> (see
 * components/theme-styles.tsx), which reads the light/dark maps below. Editing
 * this file is therefore the only change needed to re-theme every screen.
 *
 * Tokens are named semantically (color-surface, color-text-primary, color-success)
 * rather than by raw hue, so component code stays meaningful as the palette
 * evolves. The structure is dark-mode-ready: every color token has a light and a
 * dark variant, even though dark mode is not surfaced in the UI yet.
 */

/* ------------------------------------------------------------------ */
/*  Color tokens                                                       */
/* ------------------------------------------------------------------ */

/**
 * Each color value is an HSL triplet written space-separated (e.g. "181 65% 41%")
 * so Tailwind can apply opacity modifiers via `hsl(var(--token) / <alpha>)`.
 */
export const colorTokens = {
  light: {
    // Brand
    'color-brand-primary': '181 65% 41%',
    'color-brand-primary-foreground': '0 0% 100%',
    'color-brand-secondary': '199 70% 53%',
    'color-brand-secondary-foreground': '0 0% 100%',

    // Surfaces
    'color-surface': '0 0% 100%',
    'color-surface-raised': '210 40% 98%',
    'color-surface-sunken': '210 20% 96%',

    // Text
    'color-text-primary': '205 30% 13%',
    'color-text-secondary': '205 16% 32%',
    'color-text-muted': '205 12% 45%',
    'color-text-inverse': '0 0% 100%',

    // Borders / lines
    'color-border': '205 20% 90%',
    'color-border-strong': '205 18% 80%',

    // Semantic feedback
    'color-success': '152 56% 40%',
    'color-success-foreground': '0 0% 100%',
    'color-warning': '38 92% 50%',
    'color-warning-foreground': '30 50% 12%',
    'color-danger': '0 72% 51%',
    'color-danger-foreground': '0 0% 100%',
    'color-info': '199 89% 48%',
    'color-info-foreground': '0 0% 100%',

    // Accent (subtle brand tint for hovers/highlights)
    'color-accent': '181 40% 94%',
    'color-accent-foreground': '181 60% 20%',

    // Sidebar (dark, for contrast against light canvas)
    'color-sidebar': '205 32% 16%',
    'color-sidebar-foreground': '200 20% 88%',
    'color-sidebar-muted': '200 15% 65%',
    'color-sidebar-accent': '181 50% 30%',
    'color-sidebar-accent-foreground': '0 0% 100%',
    'color-sidebar-border': '200 20% 28%',

    // Focus ring
    'color-ring': '181 65% 41%',

    // Chart palette
    'color-chart-1': '181 65% 41%',
    'color-chart-2': '199 70% 53%',
    'color-chart-3': '152 56% 40%',
    'color-chart-4': '38 92% 50%',
    'color-chart-5': '0 72% 51%',
  },
  dark: {
    'color-brand-primary': '181 55% 50%',
    'color-brand-primary-foreground': '205 40% 10%',
    'color-brand-secondary': '199 60% 58%',
    'color-brand-secondary-foreground': '205 40% 10%',

    'color-surface': '205 30% 10%',
    'color-surface-raised': '205 28% 13%',
    'color-surface-sunken': '205 30% 8%',

    'color-text-primary': '200 20% 92%',
    'color-text-secondary': '200 14% 72%',
    'color-text-muted': '200 10% 58%',
    'color-text-inverse': '205 30% 12%',

    'color-border': '200 18% 22%',
    'color-border-strong': '200 16% 32%',

    'color-success': '152 50% 48%',
    'color-success-foreground': '152 50% 10%',
    'color-warning': '38 85% 55%',
    'color-warning-foreground': '38 60% 12%',
    'color-danger': '0 70% 58%',
    'color-danger-foreground': '0 0% 100%',
    'color-info': '199 80% 58%',
    'color-info-foreground': '205 40% 10%',

    'color-accent': '181 40% 20%',
    'color-accent-foreground': '181 40% 88%',

    'color-sidebar': '205 34% 12%',
    'color-sidebar-foreground': '200 18% 86%',
    'color-sidebar-muted': '200 12% 60%',
    'color-sidebar-accent': '181 45% 35%',
    'color-sidebar-accent-foreground': '0 0% 100%',
    'color-sidebar-border': '200 18% 22%',

    'color-ring': '181 55% 50%',

    'color-chart-1': '181 55% 50%',
    'color-chart-2': '199 60% 58%',
    'color-chart-3': '152 50% 48%',
    'color-chart-4': '38 85% 55%',
    'color-chart-5': '0 70% 58%',
  },
} as const;

/**
 * shadcn/ui component aliases. These map the shadcn token names (background,
 * foreground, card, primary, …) onto the semantic tokens above so the existing
 * UI primitives keep working without hardcoding anything.
 */
export const shadcnAliases = {
  background: 'color-surface',
  foreground: 'color-text-primary',
  card: 'color-surface-raised',
  'card-foreground': 'color-text-primary',
  popover: 'color-surface',
  'popover-foreground': 'color-text-primary',
  primary: 'color-brand-primary',
  'primary-foreground': 'color-brand-primary-foreground',
  secondary: 'color-surface-sunken',
  'secondary-foreground': 'color-text-primary',
  muted: 'color-surface-sunken',
  'muted-foreground': 'color-text-muted',
  accent: 'color-accent',
  'accent-foreground': 'color-accent-foreground',
  destructive: 'color-danger',
  'destructive-foreground': 'color-danger-foreground',
  border: 'color-border',
  input: 'color-border',
  ring: 'color-ring',
  'chart-1': 'color-chart-1',
  'chart-2': 'color-chart-2',
  'chart-3': 'color-chart-3',
  'chart-4': 'color-chart-4',
  'chart-5': 'color-chart-5',
} as const;

/* ------------------------------------------------------------------ */
/*  Typography scale                                                   */
/* ------------------------------------------------------------------ */

export type TypographyToken = {
  fontSize: string;
  lineHeight: string;
  fontWeight: number;
  letterSpacing: string;
};

export const typography = {
  display: { fontSize: '3rem', lineHeight: '1.1', fontWeight: 700, letterSpacing: '-0.02em' },
  h1: { fontSize: '2.25rem', lineHeight: '1.15', fontWeight: 700, letterSpacing: '-0.02em' },
  h2: { fontSize: '1.875rem', lineHeight: '1.2', fontWeight: 600, letterSpacing: '-0.01em' },
  h3: { fontSize: '1.5rem', lineHeight: '1.25', fontWeight: 600, letterSpacing: '-0.01em' },
  h4: { fontSize: '1.25rem', lineHeight: '1.3', fontWeight: 600, letterSpacing: '0' },
  body: { fontSize: '1rem', lineHeight: '1.6', fontWeight: 400, letterSpacing: '0' },
  'body-sm': { fontSize: '0.875rem', lineHeight: '1.6', fontWeight: 400, letterSpacing: '0' },
  caption: { fontSize: '0.75rem', lineHeight: '1.5', fontWeight: 500, letterSpacing: '0.02em' },
} as const satisfies Record<string, TypographyToken>;

/* ------------------------------------------------------------------ */
/*  Spacing (8px base scale)                                           */
/* ------------------------------------------------------------------ */

export const spacing = {
  0: '0px',
  0.5: '4px',
  1: '8px',
  1.5: '12px',
  2: '16px',
  3: '24px',
  4: '32px',
  5: '40px',
  6: '48px',
  7: '56px',
  8: '64px',
  10: '80px',
  12: '96px',
  14: '112px',
  16: '128px',
  20: '160px',
  24: '192px',
} as const;

/* ------------------------------------------------------------------ */
/*  Radii                                                              */
/* ------------------------------------------------------------------ */

export const radii = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  full: '9999px',
} as const;

/* ------------------------------------------------------------------ */
/*  Fonts                                                              */
/* ------------------------------------------------------------------ */

export const fonts = {
  sans: 'var(--font-sans)',
  mono: 'var(--font-mono, ui-monospace, monospace)',
} as const;

/* ------------------------------------------------------------------ */
/*  CSS-variable generation                                            */
/* ------------------------------------------------------------------ */

type TokenMap = Record<string, string>;

function mapToDeclarations(tokens: TokenMap, prefix = '--'): string {
  return Object.entries(tokens)
    .map(([key, value]) => `  ${prefix}${key}: ${value};`)
    .join('\n');
}

/**
 * Build the full `<style>` body that defines every Moonaria CSS variable for
 * both the default (light) and `.dark` scopes. Consumed by <ThemeStyles />.
 */
export function buildThemeCss(): string {
  const lightColors = mapToDeclarations(colorTokens.light);
  const darkColors = mapToDeclarations(colorTokens.dark);
  const typeDecls = Object.entries(typography)
    .map(([key, t]) => {
      return [
        `  --type-${key}-size: ${t.fontSize};`,
        `  --type-${key}-line: ${t.lineHeight};`,
        `  --type-${key}-weight: ${t.fontWeight};`,
        `  --type-${key}-tracking: ${t.letterSpacing};`,
      ].join('\n');
    })
    .join('\n');
  const spaceDecls = mapToDeclarations(
    Object.fromEntries(Object.entries(spacing).map(([key, v]) => [`space-${key}`, v]))
  );
  const radiusDecls = mapToDeclarations(
    Object.fromEntries(Object.entries(radii).map(([key, v]) => [`radius-${key}`, v]))
  );
  const fontDecls = mapToDeclarations(
    Object.fromEntries(
      Object.entries(fonts).map(([key, v]) => [`font-${key}`, v])
    )
  );

  return [
    `:root {`,
    lightColors,
    typeDecls,
    spaceDecls,
    radiusDecls,
    fontDecls,
    `}`,
    `.dark {`,
    darkColors,
    `}`,
  ].join('\n');
}

/* ------------------------------------------------------------------ */
/*  Tailwind config helpers                                            */
/* ------------------------------------------------------------------ */

/** Color names available as Tailwind utilities (bg-*, text-*, border-*, …). */
export const tailwindColorNames = [
  ...Object.keys(colorTokens.light),
  ...Object.keys(shadcnAliases),
];

/** Build the `colors` map for tailwind.config.ts. */
export function buildTailwindColors(): Record<string, string> {
  const map: Record<string, string> = {};

  // Semantic tokens resolve directly to their CSS vars.
  for (const name of Object.keys(colorTokens.light)) {
    map[name.replace(/^color-/, '')] = `hsl(var(--${name}) / <alpha-value>)`;
  }

  // shadcn aliases resolve to the semantic token they point at.
  for (const [alias, target] of Object.entries(shadcnAliases)) {
    map[alias] = `hsl(var(--${target}) / <alpha-value>)`;
  }

  return map;
}

/** Build the `fontSize` map for tailwind.config.ts. */
export function buildTailwindFontSize(): Record<string, [string, { lineHeight: string; fontWeight: number; letterSpacing: string }]> {
  const map: Record<string, [string, { lineHeight: string; fontWeight: number; letterSpacing: string }]> = {};
  for (const [key, t] of Object.entries(typography)) {
    map[key] = [`var(--type-${key}-size, ${t.fontSize})`, { lineHeight: `var(--type-${key}-line, ${t.lineHeight})`, fontWeight: t.fontWeight, letterSpacing: `var(--type-${key}-tracking, ${t.letterSpacing})` }];
  }
  return map;
}

/** Build the `spacing` map for tailwind.config.ts. */
export function buildTailwindSpacing(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const [key] of Object.entries(spacing)) {
    map[key] = `var(--space-${key})`;
  }
  return map;
}

/** Build the `borderRadius` map for tailwind.config.ts. */
export function buildTailwindRadii(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const [key] of Object.entries(radii)) {
    map[key] = `var(--radius-${key})`;
  }
  return map;
}

/** Build the `fontFamily` map for tailwind.config.ts. */
export function buildTailwindFonts(): Record<string, string> {
  return {
    sans: fonts.sans,
    mono: fonts.mono,
  };
}

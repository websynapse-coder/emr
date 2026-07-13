import { buildThemeCss } from '@/lib/theme';

/**
 * Injects the Moonaria design-token CSS variables into the document head.
 *
 * This is what makes theme.ts the single source of truth: the variables are
 * generated from the token maps at build time and rendered into a <style> tag
 * once per document. Editing lib/theme.ts is the only change needed to
 * re-theme every screen.
 *
 * Rendered as a Server Component inside the root layout.
 */
export function ThemeStyles() {
  return <style dangerouslySetInnerHTML={{ __html: buildThemeCss() }} />;
}

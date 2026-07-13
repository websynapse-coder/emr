import './globals.css';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';

import { ThemeStyles } from '@/components/theme-styles';
import { AppProviders } from '@/components/app-providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Moonaria — Behavioral Health EMR',
  description:
    'Moonaria is a multi-tenant behavioral health EMR prototype. Client demo — no backend, no real auth.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <ThemeStyles />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

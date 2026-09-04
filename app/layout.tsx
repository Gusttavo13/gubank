import type { Metadata } from 'next';
import './globals.css';
import Script from 'next/script';

export const metadata: Metadata = { title: 'GuBank', description: 'POC GuBank · KYC Legitimuz' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400,0,0" />
        <Script src="https://sdk.legitimuz.dev/v1/websdk.iife.js" strategy="beforeInteractive" />
      </head>
      <body>{children}</body>
    </html>
  );
}

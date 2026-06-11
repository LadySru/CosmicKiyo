import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kiyo Dreams ✦',
  description: 'Kiyo Dreams — magical cosplayer, anime lover, gamer girl. A sparkly portfolio of cosplays, anime faves, and gaming adventures.',
  keywords: ['cosplay', 'anime', 'gamer', 'kiyo dreams', 'magical girl', 'portfolio'],
  openGraph: {
    title: 'Kiyo Dreams ✦',
    description: 'Magical cosplayer portfolio — cosplays, anime, games & dreams ✨',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kiyo Dreams ✦',
  description: 'A magical cosplayer portfolio — cosplay, anime, games & dramas ✨',
  keywords: ['cosplay', 'anime', 'gaming', 'portfolio', 'kiyo dreams'],
  openGraph: {
    title: 'Kiyo Dreams ✦',
    description: 'A magical cosplayer portfolio',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

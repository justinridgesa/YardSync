import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { LayoutContent } from '@/components/LayoutContent';

export const metadata: Metadata = {
  title: 'Yard Sync - Horse & Yard Management',
  description: 'Centralized task tracking and horse records for yard managers, grooms, and owners.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <Providers>
          <LayoutContent>{children}</LayoutContent>
        </Providers>
      </body>
    </html>
  );
}

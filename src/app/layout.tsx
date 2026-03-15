import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Sidebar } from '@/components/Sidebar';

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
          <div className="flex h-screen flex-col md:flex-row">
            <Sidebar />
            <div className="flex-1 overflow-auto md:pl-0">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}

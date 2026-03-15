import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - Yard Sync',
  description: 'Sign in to your Yard Sync account',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

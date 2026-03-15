'use server';

import { cookies } from 'next/headers';

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('yard_sync_token', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('yard_sync_token');
}

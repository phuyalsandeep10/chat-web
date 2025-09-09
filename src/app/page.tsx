'use client';
import { useRedirectIfAuthenticated } from '@/hooks/auth/useRedirectIfAuthenticated';
import { ROUTES } from '@/routes/routes';
import Link from 'next/link';

import { redirect } from 'next/navigation';

export default function Home() {
  redirect(ROUTES.DASHBOARD);
  // useRedirectIfAuthenticated();
  return (
    <div>
      <h1>Home page</h1>
      <div className="m-6">
        <Link href={'/login'} className="cursor-pointer text-indigo-400">
          Login
        </Link>
        <Link
          href={'/register'}
          className="ml-6 cursor-pointer text-indigo-400"
        >
          Register
        </Link>
      </div>
    </div>
  );
}

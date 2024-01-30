// auth.js (Custom Authentication Hook)
import { useSession, getSession } from 'next-auth/react';

export function useAuthentication() {
  const { data: session } = useSession();

  if (!session) {
    // User is not authenticated, handle the redirect or display an error message
    // You can redirect to the login page or show an error message here
  }

  return session;
}

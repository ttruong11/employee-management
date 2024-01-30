import { SessionProvider, useSession } from 'next-auth/react';

// Custom Authentication Hook
function useAuthentication() {
  const { data: session } = useSession();

  if (!session) {
    // User is not authenticated, handle the redirect or display an error message
    // You can redirect to the login page or show an error message here
  }

  return session;
}

function AuthApp({ Component, pageProps }) {
  // Use the custom authentication hook to check if the user is authenticated
  const session = useAuthentication();

  // If the user is not authenticated, you can handle redirection or display an error message here
  if (!session) {
    return (
      <div>
        {/* You can redirect to the login page or show an error message here */}
        <p>Please log in to access the application.</p>
      </div>
    );
  }

  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default AuthApp;

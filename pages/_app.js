import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { styles } from '../styles/styles.css'

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Your global side effect code here (if any)
  }, [router.pathname]);

  return (
    <SessionProvider session={pageProps.session}>
      <>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        </Head>
        <Component {...pageProps} />
      </>
    </SessionProvider>
  );
}

export default MyApp;

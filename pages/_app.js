import '../styles/globals.css'; // Import global styles
import '../styles/styles.css'; // Import global styles
import Head from 'next/head'; // Import Head from next/head
import { BrowserRouter as Router } from 'react-router-dom';


import { useEffect } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Your global side effect code here (if any)
  }, [router.pathname]);

  return (
    <>
      {/* Add the viewport meta tag here */}
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
export default MyApp;

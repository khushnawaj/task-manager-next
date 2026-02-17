import '../styles/globals.css';
import { Provider } from "react-redux";
import store from "../store";
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import { useMemo, useEffect } from 'react';
import { setAuth, setInitialized } from '../store/slices/authSlice';

export default function App({ Component, pageProps }) {
  // Ensure store is stable across renders
  const stableStore = useMemo(() => store, []);

  // Hydrate auth state on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('forge_auth');
    if (savedAuth) {
      try {
        const parsedAuth = JSON.parse(savedAuth);
        stableStore.dispatch(setAuth(parsedAuth));
      } catch (err) {
        console.error("Failed to rehydrate auth", err);
        localStorage.removeItem('forge_auth');
        stableStore.dispatch(setInitialized());
      }
    } else {
      stableStore.dispatch(setInitialized());
    }
  }, [stableStore]);

  return (
    <Provider store={stableStore}>
      <Head>
        <title>Forge | Enterprise Engineering Platform</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'text-[10px] font-bold uppercase tracking-widest',
          duration: 3000,
          style: {
            background: '#09090b',
            color: '#f4f4f5',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
            padding: '12px 16px',
          },
          success: {
            iconTheme: {
              primary: '#3b82f6',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <div className="min-h-screen bg-background text-zinc-100 font-sans antialiased selection:bg-brand-500/30">
        <Component {...pageProps} />
      </div>
    </Provider>
  );
}

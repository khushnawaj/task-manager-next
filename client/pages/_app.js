import '../styles/globals.css';
import { Provider } from "react-redux";
import store from "../store";
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import { useMemo } from 'react';

export default function App({ Component, pageProps }) {
  // Ensure store is stable across renders
  const stableStore = useMemo(() => store, []);

  return (
    <Provider store={stableStore}>
      <Head>
        <title>TaskMaster | Enterprise Task Management</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'text-sm font-medium',
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '8px',
          },
          success: {
            iconTheme: {
              primary: '#4f46e5',
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
      <div className="min-h-screen bg-brand-50/50 text-gray-900 font-sans antialiased selection:bg-brand-500 selection:text-white">
        <Component {...pageProps} />
      </div>
    </Provider>
  );
}

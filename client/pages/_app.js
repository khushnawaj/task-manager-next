import '../styles/globals.css';
import { Provider, useSelector } from "react-redux";
import store from "../store";
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import { useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import { setAuth, setInitialized } from '../store/slices/authSlice';

// Define public routes that don't need authentication
const publicRoutes = ['/', '/login', '/signup', '/terms', '/privacy'];

function AuthGuard({ children }) {
  const { user, initialized } = useSelector((state) => state.auth);
  const router = useRouter();

  const isPublicRoute = publicRoutes.includes(router.pathname);

  useEffect(() => {
    if (initialized) {
      if (!user && !isPublicRoute) {
        // Unauthenticated user trying to access protected route
        router.push('/login');
      } else if (user && (router.pathname === '/login' || router.pathname === '/signup' || router.pathname === '/')) {
        // Authenticated user trying to access login/signup/landing
        router.push('/dashboard');
      }
    }
  }, [initialized, user, isPublicRoute, router.pathname]);

  if (!initialized) {
    // Premium loading state during initial hydration
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center selection:bg-brand-500/30">
        <div className="w-12 h-12 border-2 border-zinc-800 border-t-brand-500 rounded-full animate-spin mb-6 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
        <p className="text-zinc-500 font-bold text-[10px] tracking-[0.3em] uppercase animate-pulse">Initializing Forge</p>
      </div>
    );
  }

  // Prevent flash of unauthorized content on protected routes
  if (!user && !isPublicRoute) {
    return null;
  }

  // Prevent flash of landing page if already logged in (but allow viewing terms/privacy)
  if (user && (router.pathname === '/' || router.pathname === '/login' || router.pathname === '/signup')) {
    return null;
  }

  return <>{children}</>;
}

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
              secondary: '#18181b',
            },
            style: {
              border: '1px solid rgba(59,130,246,0.2)',
            }
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#18181b',
            },
            style: {
              border: '1px solid rgba(239,68,68,0.2)',
            }
          },
        }}
      />
      <div className="min-h-screen bg-background text-zinc-100 font-sans antialiased selection:bg-brand-500/30">
        <AuthGuard>
          <Component {...pageProps} />
        </AuthGuard>
      </div>
    </Provider>
  );
}

import '../styles/globals.css';
import { Provider } from "react-redux";
import store from "../store";
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <title>Nexus | Future of Work</title>
      </Head>
      <div className="font-sans antialiased text-slate-100 bg-slate-900 min-h-screen selection:bg-indigo-500 selection:text-white">
        <Component {...pageProps} />
      </div>
    </Provider>
  );
}

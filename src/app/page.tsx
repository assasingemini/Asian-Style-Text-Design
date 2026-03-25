'use client';

import dynamic from 'next/dynamic';

// Dynamically import the SPA app to avoid SSR issues with react-router's createBrowserRouter
// which requires `document` (browser-only API)
const ClientApp = dynamic(() => import('./ClientApp'), { ssr: false });

export default function Page() {
  return <ClientApp />;
}

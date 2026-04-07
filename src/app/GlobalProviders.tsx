'use client';

import { AppProvider } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Notification } from './components/ui/Notification';
import { usePathname } from 'next/navigation';
import '../styles/fonts.css';

export default function GlobalProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const isAdmin = pathname.startsWith('/admin');
  const isAuth = pathname === '/login' || pathname === '/register';

  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        {!isAdmin && !isAuth && <Footer />}
        <Notification />
      </div>
    </AppProvider>
  );
}

import type { ReactNode } from 'react';

import { Footer } from './Footer';
import { Header } from './Header';
import { RatesBanner } from './RatesBanner';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="pt-16">
        <RatesBanner />
      </div>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

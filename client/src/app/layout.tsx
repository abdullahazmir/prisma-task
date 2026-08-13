import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '../providers/HeroUIProvider';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
  title: 'SCIC Store - Modern Full-Stack E-Commerce',
  description: 'Production-ready Express.js, TypeScript, Prisma, PostgreSQL & Next.js + HeroUI application.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased">
        <Providers>
          <Navbar />
          <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

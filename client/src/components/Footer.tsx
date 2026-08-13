import React from 'react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/80 py-8 text-center text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-xs">
            P
          </div>
          <span className="font-semibold text-slate-200">SCIC/EJP-13 Full-Stack E-Commerce</span>
        </div>
        <p>© 2026 Powered by Express.js, Prisma ORM, PostgreSQL & Next.js + HeroUI</p>
      </div>
    </footer>
  );
};

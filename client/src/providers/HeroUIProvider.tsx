'use client';

import { HeroUIProvider as BaseHeroUIProvider } from '@heroui/react';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <BaseHeroUIProvider>
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </BaseHeroUIProvider>
  );
}

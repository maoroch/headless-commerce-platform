// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { FavouritesProvider } from "@/context/FavouritesContext";
import { CartProvider } from "@/context/Cartcontext";
import { AuthProvider } from "@/context/Authcontext";
import { defaultMetadata } from '@/lib/seo';

export const metadata = defaultMetadata;


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <FavouritesProvider>
              {children}
            </FavouritesProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
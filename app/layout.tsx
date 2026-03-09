import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar/NavbarMain";
import Footer from "@/components/Footer/Footer";
import { FavouritesProvider } from "@/context/FavouritesContext";
import { CartProvider } from "@/context/Cartcontext";
import { AuthProvider } from "@/context/Authcontext";

export const metadata: Metadata = {
  title: "Coom Endem — Organic Products for Health & Nature Care",
  description: "Discover fresh, natural and certified organic products for your health. Coom Endem offers eco-friendly solutions that care for your body and the planet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
                <AuthProvider>
          <CartProvider>
            <FavouritesProvider>

        <Navbar />
        {children}
        <Footer />
      </FavouritesProvider>
    </CartProvider>
  </AuthProvider>
      </body>
    </html>
  );
}

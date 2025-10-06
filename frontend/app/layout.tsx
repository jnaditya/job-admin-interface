// frontend/app/layout.tsx
import { Inter } from 'next/font/google';
import Providers from './providers'; // Import the provider component

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* WRAP THE CHILDREN WITH YOUR PROVIDER */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
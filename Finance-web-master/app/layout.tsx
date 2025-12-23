import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'sonner';
import QueryProvider from '@/components/providers/QueryProvider';
import LoadingProvider from '@/components/providers/LoadingProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DhanSeva - Your Trusted Financial Partner | भरोसे का साथ, तुरंत लोन आपके पास',
  description: 'Complete Financial & Legal Solutions - Loan Services, CA Services, Legal Services, and more',
  keywords: 'loan services, legal services, financial services, CA services, business legal, personal legal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          src="https://checkout.razorpay.com/v1/checkout.js"
          async
        ></script>
      </head>
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            <LoadingProvider>
              {children}
            </LoadingProvider>
            <Toaster position="top-right" richColors closeButton />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

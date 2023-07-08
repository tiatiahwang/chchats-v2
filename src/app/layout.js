import '@/styles/globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Chchats',
  description: '한인커뮤니티',
};

export default function RootLayout({ children }) {
  return (
    <html lang='ko'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

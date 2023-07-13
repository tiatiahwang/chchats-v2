import NavBar from '@/components/NavBar';
import Providers from '@/components/Providers';
import { cls } from '@/lib/utils';
import '@/styles/globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CHCHATS',
  description: '미국 거주하는 한인 커뮤니티',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='ko'
      className={cls(
        'bg-white text-slate-900 antialiased light',
        inter.className,
      )}
    >
      <body
        suppressContentEditableWarning={true}
        suppressHydrationWarning={true}
        className='min-h-screen pt-12 bg-slate-50 antialiased'
      >
        <Providers>
          <NavBar />
          <div className='container max-w-7xl mx-auto h-full pt-12'>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}

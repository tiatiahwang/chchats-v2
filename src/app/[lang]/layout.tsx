import Footer from '@/components/Footer';
import NavBar from '@/components/nav/NavBar';
import Providers from '@/components/Providers';
import ToastProvider from '@/components/ToastProvider';
import { Locale } from '@/i18n.config';

import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
  title: 'CHCHATS',
  description: '미국 거주하는 한인 커뮤니티',
};

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  return (
    <html
      lang={params.lang}
      suppressContentEditableWarning={true}
      suppressHydrationWarning={true}
      className='bg-slate-50 text-slate-900 antialiased light box-border h-full'
    >
      <body
        suppressContentEditableWarning={true}
        suppressHydrationWarning={true}
        className='min-h-screen pt-12 bg-slate-50 antialiased box-border'
      >
        <Providers>
          <ToastProvider>
            <NavBar lang={params.lang} />
            <div className='max-w-7xl mx-auto h-full pt-12 box-border'>
              {children}
            </div>
            <Footer />
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}

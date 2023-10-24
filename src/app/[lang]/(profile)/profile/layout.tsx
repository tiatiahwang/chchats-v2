import WebSideBar from '@/components/WebSideBar';
import { Locale } from '@/i18n.config';
import { getAllCategories } from '@/lib/utils';

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) => {
  const lang = params.lang ?? 'en';
  const categories = await getAllCategories();
  return (
    <div className='flex px-2'>
      <WebSideBar lang={lang} categories={categories} />
      <div className='w-full'>{children}</div>
    </div>
  );
};

export default Layout;

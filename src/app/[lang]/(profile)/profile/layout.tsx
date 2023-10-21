import WebSideBar from '@/components/WebSideBar';
import { getAllCategories } from '@/lib/utils';

const Layout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const categories = await getAllCategories();
  return (
    <div className='flex px-2'>
      <WebSideBar categories={categories} />
      <div className='w-full'>{children}</div>
    </div>
  );
};

export default Layout;

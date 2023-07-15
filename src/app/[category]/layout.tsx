import WebSideBar from '@/components/WebSideBar';
import { db } from '@/lib/db';

const Layout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const categories = await db.category.findMany({
    where: { isDefault: true },
    include: {
      subcategories: true,
    },
  });
  return (
    <div className='flex text-sm px-2 pb-2'>
      <WebSideBar categories={categories} />
      <div className='w-full px-4'>{children}</div>
    </div>
  );
};

export default Layout;

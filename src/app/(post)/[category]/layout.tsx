import NotFound from '@/components/ui/NotFound';
import { getCategoryURLs } from '@/lib/utils';
// import NotFound from './not-found';

const Layout = async ({
  children,
  params: { category },
}: {
  children: React.ReactNode;
  params: { category: string };
}) => {
  const categoryURLs = await getCategoryURLs();
  const isValid = Boolean(
    categoryURLs.find((url) => url === category),
  );

  if (!isValid) {
    return <NotFound />;
  }
  return <div className='flex px-2'>{children}</div>;
};

export default Layout;

import NotFound from '@/components/ui/NotFound';
import { getSubcategoryURLs } from '@/lib/utils';

const Layout = async ({
  children,
  params: { category, subcategory },
}: {
  children: React.ReactNode;
  params: { category: string; subcategory: string };
}) => {
  const subcategoryURLs = await getSubcategoryURLs(
    category,
  );
  const isValid = Boolean(
    subcategoryURLs.find((url) => url === subcategory),
  );

  if (!isValid) {
    return <NotFound />;
  }

  return <>{children}</>;
};

export default Layout;

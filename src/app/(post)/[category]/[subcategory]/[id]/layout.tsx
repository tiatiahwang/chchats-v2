import NotFound from '@/components/ui/NotFound';
import { db } from '@/lib/db';

const Layout = async ({
  children,
  params: { id },
}: {
  children: React.ReactNode;
  params: { id: string };
}) => {
  const post = await db.post.findFirst({
    where: {
      id,
    },
  });

  if (!post) {
    return <NotFound />;
  }

  return <>{children}</>;
};

export default Layout;

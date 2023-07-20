import NewPost from '@/components/post/NewPost';
import { getAllCategories } from '@/lib/utils';

const Page = async ({
  params: { category },
}: {
  params: { category: string };
}) => {
  const categories = await getAllCategories();
  const currentCategory = categories.find(
    (cate) => cate.ref === category,
  );
  return (
    <NewPost
      categories={categories}
      currentCategory={currentCategory!}
    />
  );
};

export default Page;

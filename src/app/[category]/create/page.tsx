import PostCategory from '@/components/post/PostCategory';
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
    <PostCategory
      categories={categories}
      currentCategory={currentCategory!}
    />
  );
};

export default Page;

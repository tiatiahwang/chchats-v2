import Editor from '@/components/post/Editor';
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
    <>
      <div className='flex justify-end w-full'></div>
      <PostCategory
        categories={categories}
        currentCategory={currentCategory!}
      />
      <Editor />
    </>
  );
};

export default Page;

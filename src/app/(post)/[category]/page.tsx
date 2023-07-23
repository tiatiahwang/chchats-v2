import WebSideBar from '@/components/WebSideBar';
import PostCard from '@/components/post/PostCard';
import { getAllCategories } from '@/lib/utils';
import Link from 'next/link';

const Page = async ({
  params: { category },
}: {
  params: { category: string };
}) => {
  const categories = await getAllCategories();
  const currentCategory = categories.find(
    (cate) => cate.ref === category,
  );

  //TODO: loading
  return (
    <>
      <WebSideBar categories={categories} />
      <div className='w-full px-4'>
        <div className='pb-4'>
          <h1 className='font-bold text-3xl md:text-4xl h-14'>
            {currentCategory?.name}
          </h1>
          <div className='flex items-center justify-end'>
            {currentCategory?.id !== 5 && (
              <Link
                href={`${currentCategory?.url}/create`}
                className='p-2 rounded-md bg-main hover:bg-mainDark text-white'
              >
                글쓰기
              </Link>
            )}
          </div>
        </div>
        <div className='space-y-2'>
          <PostCard categoryId={currentCategory?.id} />
        </div>
      </div>
    </>
  );
};

export default Page;

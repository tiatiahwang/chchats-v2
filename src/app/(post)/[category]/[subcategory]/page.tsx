import WebSideBar from '@/components/WebSideBar';
import PostCard from '@/components/post/PostCard';
import { db } from '@/lib/db';
import { getAllCategories } from '@/lib/utils';
import Link from 'next/link';

const Page = async ({
  params: { category, subcategory },
}: {
  params: { category: string; subcategory: string };
}) => {
  const categories = await getAllCategories();
  const currentSubcategory = await db.subcategory.findFirst(
    {
      where: {
        ref: subcategory,
      },
    },
  );

  return (
    <>
      <WebSideBar categories={categories} />
      <div className='w-full px-4'>
        <div className='border rounded-md w-full p-4'>
          <div>
            <h1 className='font-bold text-3xl md:text-4xl h-14'>
              {currentSubcategory?.name}
            </h1>
            <div className='flex items-center justify-end'>
              <Link
                href={`${currentSubcategory?.url}/create`}
                className='p-2 rounded-md bg-main hover:bg-mainDark text-white'
              >
                글 남기기
              </Link>
            </div>
          </div>
          <ul className='py-2 space-y-2'>
            <PostCard
              subcategoryId={currentSubcategory?.id}
            />
          </ul>
        </div>
      </div>
    </>
  );
};

export default Page;

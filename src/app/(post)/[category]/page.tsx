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

  return (
    <>
      <WebSideBar categories={categories} />
      <div className='w-full px-4'>
        <div className='border rounded-md w-full p-4'>
          <div>
            <h1 className='font-bold text-3xl md:text-4xl h-14'>
              {currentCategory?.name}
            </h1>
            <div className='flex items-center justify-end'>
              <Link
                href={`${currentCategory?.url}/create`}
                className='p-2 rounded-md bg-main hover:bg-mainDark text-white'
              >
                글 남기기
              </Link>
            </div>
          </div>
          <ul className='py-2 space-y-2'>
            <PostCard />
          </ul>
        </div>
      </div>
    </>
  );
};

export default Page;

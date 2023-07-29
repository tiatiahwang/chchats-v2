import Ads from '@/components/Ads';
import PostList from '@/components/PostList';
import WebSideBar from '@/components/WebSideBar';
import { getAllCategories } from '@/lib/utils';
import Link from 'next/link';

export default async function Home() {
  const categories = await getAllCategories();
  return (
    <div className='flex text-sm pb-2 px-2 md:space-x-8'>
      <WebSideBar categories={categories} />
      <div className='w-full'>
        <div className='w-full h-[100px] border rounded-md text-center mb-4 text-gray-400 text-xs pt-2'>
          광고자리
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 w-full h-min gap-4'>
          {categories?.map((category) => (
            <div
              key={category.id}
              className='border rounded-md w-full p-4'
            >
              <Link
                href={`${category.url}`}
                className='flex justify-between border-b pb-2 cursor-pointer pt-2 hover:text-main'
              >
                <div className='text-2xl font-bold'>
                  {category.name}
                </div>
                <span className='text-xs self-end'>
                  전체보기
                </span>
              </Link>
              <PostList categoryId={category.id} />
            </div>
          ))}
        </div>
      </div>
      <Ads />
    </div>
  );
}

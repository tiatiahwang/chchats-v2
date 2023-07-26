import PostList from '@/components/PostList';
import WebSideBar from '@/components/WebSideBar';
import { getAllCategories } from '@/lib/utils';
import Link from 'next/link';

export default async function Home() {
  const categories = await getAllCategories();
  return (
    <div className='flex text-sm px-2 pb-2'>
      <WebSideBar categories={categories} />
      <div className='grid grid-cols-1 md:grid-cols-2 md:ml-4 w-full gap-4'>
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
  );
}

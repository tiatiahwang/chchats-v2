import WebSideBar from '@/components/WebSideBar';
import PostCard from '@/components/post/PostCardList';
import Skeleton from '@/components/ui/Skeleton';
import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/config';
import { db } from '@/lib/db';
import { getAllCategories } from '@/lib/utils';
import Link from 'next/link';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

interface PageProps {
  params: {
    category: string;
  };
}

const page = async ({
  params: { category },
}: PageProps) => {
  const categories = await getAllCategories();
  const currentCategory = categories.find(
    (cate) => cate.ref === category,
  );

  const posts = await db.post.findMany({
    where: {
      categoryId: currentCategory?.id!,
    },
    include: {
      author: {
        select: { id: true, username: true },
      },
      category: {
        select: { ref: true },
      },
      subcategory: {
        select: { name: true, ref: true },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: INFINITE_SCROLL_PAGINATION_RESULTS,
  });

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
        <Suspense
          fallback={<Skeleton className='w-full h-50' />}
        >
          <div className='space-y-2'>
            <PostCard
              initialPosts={posts}
              categoryId={currentCategory?.id}
            />
          </div>
        </Suspense>
      </div>
    </>
  );
};

export default page;

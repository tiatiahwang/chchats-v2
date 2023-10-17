import WebSideBar from '@/components/WebSideBar';
import PostCardList from '@/components/post/PostCardList';
import { INFINITE_SCROLL_LIMIT } from '@/config';
import { db } from '@/lib/db';
import { getAllCategories } from '@/lib/utils';
import { PostListLoading } from '../page';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

interface PageProps {
  params: {
    subcategory: string;
  };
}

const page = async ({
  params: { subcategory },
}: PageProps) => {
  const categories = await getAllCategories();
  const currentSubcategory = await db.subcategory.findFirst(
    {
      where: {
        ref: subcategory,
      },
    },
  );

  const posts = await db.post.findMany({
    where: {
      subcategoryId: currentSubcategory?.id!,
    },
    include: {
      author: {
        select: { id: true, username: true },
      },
      category: {
        select: { name: true, ref: true },
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
    take: INFINITE_SCROLL_LIMIT,
  });

  return (
    <>
      <WebSideBar categories={categories} />
      <div className='w-full md:px-4'>
        <h1 className='font-bold text-3xl md:text-4xl h-14'>
          {currentSubcategory?.name}
        </h1>
        <Suspense fallback={<PostListLoading />}>
          <div className='space-y-2'>
            <PostCardList
              initialPosts={posts}
              currentSubcategory={currentSubcategory!}
            />
          </div>
        </Suspense>
      </div>
    </>
  );
};

export default page;

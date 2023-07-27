import WebSideBar from '@/components/WebSideBar';
import PostCard from '@/components/post/PostCardList';
import { INFINITE_SCROLL_LIMIT } from '@/config';
import { db } from '@/lib/db';
import { getAllCategories } from '@/lib/utils';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

interface PageProps {
  params: {
    category: string;
    subcategory: string;
  };
}

const page = async ({
  params: { category, subcategory },
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
    take: INFINITE_SCROLL_LIMIT,
  });

  return (
    <>
      <WebSideBar categories={categories} />
      <div className='w-full px-4'>
        <div className='pb-4'>
          <h1 className='font-bold text-3xl md:text-4xl h-14'>
            {currentSubcategory?.name}
          </h1>
          <div className='flex items-center justify-end'>
            <Link
              href={`${currentSubcategory?.url}/create`}
              className='p-2 rounded-md bg-main hover:bg-mainDark text-white'
            >
              글쓰기
            </Link>
          </div>
        </div>
        <div className='space-y-2'>
          <PostCard
            initialPosts={posts}
            categoryId={currentSubcategory?.categoryId}
            subcategoryId={currentSubcategory?.id}
          />
        </div>
      </div>
    </>
  );
};

export default page;

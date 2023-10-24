import WebSideBar from '@/components/WebSideBar';
import PostCardList from '@/components/post/PostCardList';
import Skeleton from '@/components/ui/Skeleton';
import { INFINITE_SCROLL_LIMIT } from '@/config';
import { db } from '@/lib/db';
import { getAllCategories } from '@/lib/utils';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export const PostListLoading = () => {
  return (
    <div className='space-y-2'>
      <Skeleton className='w-full h-32' />
      <Skeleton className='w-full h-32' />
      <Skeleton className='w-full h-32' />
      <Skeleton className='w-full h-32' />
      <Skeleton className='w-full h-32' />
      <Skeleton className='w-full h-32' />
    </div>
  );
};

interface PageProps {
  params: {
    lang: string;
    category: string;
  };
}

const page = async ({
  params: { lang, category },
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
      <WebSideBar
        lang={lang ?? 'en'}
        categories={categories}
      />
      <div className='w-full md:px-4'>
        <h1 className='font-bold text-3xl md:text-4xl h-14'>
          {lang === 'en'
            ? currentCategory?.eng
            : currentCategory?.name}
        </h1>
        <Suspense fallback={<PostListLoading />}>
          <div className='space-y-2'>
            <PostCardList
              lang={lang ?? 'en'}
              initialPosts={posts}
              currentCategory={currentCategory}
            />
          </div>
        </Suspense>
      </div>
    </>
  );
};

export default page;

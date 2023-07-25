import WebSideBar from '@/components/WebSideBar';
import CommentSection from '@/components/comment/CommentSection';
import PostDetail from '@/components/post/PostDetail';
import Skeleton from '@/components/ui/Skeleton';
import { db } from '@/lib/db';
import { formatTime, getAllCategories } from '@/lib/utils';
import { Suspense } from 'react';

interface PageProps {
  params: {
    id: string;
  };
}

const Page = async ({ params: { id } }: PageProps) => {
  const categories = await getAllCategories();
  const post = await db.post.findFirst({
    where: {
      id,
    },
    include: {
      category: {
        select: {
          name: true,
          url: true,
        },
      },
      subcategory: {
        select: {
          name: true,
          ref: true,
        },
      },
      author: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
    },
  });
  if (!post) return;
  return (
    <>
      <WebSideBar categories={categories} />
      <div className='space-y-6 border rounded-md w-full ml-4 p-4'>
        <Suspense
          fallback={
            <>
              <Skeleton className='w-full h-10' />
              <Skeleton className='w-full h-20' />
              <Skeleton className='w-full h-[500px]' />
            </>
          }
        >
          <PostDetail
            post={post}
            formattedTime={formatTime(post?.createdAt!)}
          />
        </Suspense>
        <Suspense
          fallback={
            <div className='mt-4'>
              <Skeleton className='w-full h-40' />
            </div>
          }
        >
          <CommentSection postId={post.id} />
        </Suspense>
      </div>
    </>
  );
};

export default Page;

import WebSideBar from '@/components/WebSideBar';
import CommentSection from '@/components/comment/CommentSection';
import PostDetail from '@/components/post/PostDetail';
import Skeleton from '@/components/ui/Skeleton';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { formatTime, getAllCategories } from '@/lib/utils';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

interface PageProps {
  params: {
    id: string;
  };
}

const page = async ({ params: { id } }: PageProps) => {
  const session = await getAuthSession();
  const categories = await getAllCategories();

  // post 조회할 때마다 조회수 1씩 증가
  await db.post.update({
    where: {
      id,
    },
    data: {
      viewCount: { increment: 1 },
    },
  });

  const post = await db.post.findFirst({
    where: {
      id,
    },
    include: {
      votes: true,
      category: {
        select: {
          name: true,
          ref: true,
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
      <div className='border rounded-md w-full ml-4 p-4'>
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
            isScrapped={
              session?.user
                ? Boolean(
                    await db.scrap.findFirst({
                      where: {
                        userId: session?.user.id,
                        postId: post.id,
                      },
                    }),
                  )
                : false
            }
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

export default page;

import MyComment from '@/components/profile/MyComment';
import ProfileNav from '@/components/profile/ProfileNav';
import Skeleton from '@/components/ui/Skeleton';
import { INFINITE_SCROLL_LIMIT } from '@/config';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { Suspense } from 'react';

const Page = async () => {
  const session = await getAuthSession();
  const mycomments = await db.comment.findMany({
    where: {
      authorId: session?.user.id,
    },
    include: {
      post: {
        select: {
          title: true,
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
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    // TODO
    // take: INFINITE_SCROLL_LIMIT,
  });

  // TODO: LOADING
  return (
    <div className='w-full px-4'>
      {session?.user ? (
        <ProfileNav user={session.user} />
      ) : null}
      <MyComment initialComments={mycomments} />
    </div>
  );
};

export default Page;

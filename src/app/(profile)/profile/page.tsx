import MyPost from '@/components/profile/MyPost';
import ProfileNav from '@/components/profile/ProfileNav';
import { INFINITE_SCROLL_LIMIT } from '@/config';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';

const Page = async () => {
  const session = await getAuthSession();
  const myposts = await db.post.findMany({
    where: {
      authorId: session?.user.id,
    },
    include: {
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
    orderBy: {
      createdAt: 'desc',
    },
    take: INFINITE_SCROLL_LIMIT,
  });

  // TODO: loading
  return (
    <div className='ml-4 w-full p-4'>
      {session?.user ? (
        <ProfileNav user={session.user} />
      ) : null}
      <MyPost initialPosts={myposts} />
    </div>
  );
};
export default Page;

import MyPost from '@/components/profile/MyPost';
import ProfileNav from '@/components/profile/ProfileNav';
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
  });

  return (
    <div className='ml-4 w-full p-4'>
      {session?.user ? (
        <ProfileNav user={session.user} />
      ) : null}
      <MyPost posts={myposts} />
    </div>
  );
};
export default Page;

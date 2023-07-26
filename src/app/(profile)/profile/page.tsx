import WebSideBar from '@/components/WebSideBar';
import MyPost from '@/components/profile/MyPost';
import ProfileNav from '@/components/profile/ProfileNav';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { getAllCategories } from '@/lib/utils';

const Page = async () => {
  const categories = await getAllCategories();
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
    <div className='flex'>
      <WebSideBar categories={categories} />
      <div className='ml-4 w-full border rounded-md p-4'>
        {session?.user ? (
          <ProfileNav user={session.user} />
        ) : null}
        <MyPost posts={myposts} />
      </div>
    </div>
  );
};
export default Page;

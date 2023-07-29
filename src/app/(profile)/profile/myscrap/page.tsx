import MyScrap from '@/components/profile/MyScrap';
import ProfileNav from '@/components/profile/ProfileNav';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';

const Page = async () => {
  const session = await getAuthSession();
  const myscraps = await db.scrap.findMany({
    where: {
      userId: session?.user?.id,
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
    // TODO
    // take: INFINITE_SCROLL_LIMIT,
  });

  // TODO: LOADING
  if (!myscraps) return;
  return (
    <div className='w-full px-4'>
      {session?.user ? (
        <ProfileNav user={session.user} />
      ) : null}
      <MyScrap initialScraps={myscraps} />
    </div>
  );
};

export default Page;

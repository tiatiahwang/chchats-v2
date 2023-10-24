import MyPost from '@/components/profile/MyPost';
import ProfileNav from '@/components/profile/ProfileNav';
import { INFINITE_SCROLL_LIMIT } from '@/config';
import { Locale } from '@/i18n.config';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';

const Page = async ({
  params,
}: {
  params: { lang: Locale };
}) => {
  const lang = params.lang ?? 'en';
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
    <div className='w-full px-4'>
      {session?.user ? (
        <ProfileNav user={session.user} />
      ) : null}
      <MyPost initialPosts={myposts} />
    </div>
  );
};
export default Page;
